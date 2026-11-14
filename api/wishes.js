/**
 * Vercel Serverless Function: /api/wishes
 * Kết nối trực tiếp với Supabase REST API bằng SUPABASE_SERVICE_ROLE_KEY trên máy chủ.
 * KHÔNG BAO GIỜ đưa service_role_key vào mã phía trình duyệt.
 */
import crypto from 'node:crypto';

const AUTHOR_MAX_LENGTH = 60;
const MESSAGE_MIN_LENGTH = 3;
const MESSAGE_MAX_LENGTH = 600;
const COOLDOWN_MS = 20_000;

function getSupabaseHeaders() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  return {
    apikey: secretKey,
    'Content-Type': 'application/json',
  };
}

function containsSpam(text) {
  const patterns = [
    /https?:\/\/\S+/i,
    /www\.\S+/i,
    /(.)\1{11,}/,
    /\b(casino|bet88|kubet|sex|xxx|crypto\s*airdrop|vay\s*tiền\s*nhanh)\b/i,
  ];
  return patterns.some((re) => re.test(text));
}

function hashClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = Array.isArray(forwarded)
    ? forwarded[0]
    : typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.socket?.remoteAddress || 'unknown';
  const secret = process.env.RATE_LIMIT_SECRET || 'default-local-rate-limit-secret';
  return crypto.createHmac('sha256', secret).update(rawIp).digest('hex');
}

function getSupabaseHeaders() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(503).json({
      error: 'Chưa cấu hình SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trên máy chủ.',
      fallbackRecommended: true,
    });
  }

  try {
    if (req.method === 'GET') {
      const limit = Math.min(Math.max(Number.parseInt(req.query?.limit ?? '8', 10) || 8, 1), 30);
      const offset = Math.max(Number.parseInt(req.query?.offset ?? '0', 10) || 0, 0);

      const url = `${supabaseUrl}/rest/v1/wishes?select=id,author,message,created_at&order=created_at.desc&limit=${limit}&offset=${offset}`;
      const response = await fetch(url, {
        headers: {
          ...getSupabaseHeaders(),
          Prefer: 'count=exact',
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(502).json({ error: 'Không thể tải lời chúc từ Supabase.', detail: errText });
      }

      const wishes = await response.json();
      const contentRange = response.headers.get('content-range') || '';
      const totalMatch = contentRange.match(/\/(\d+)$/);
      const total = totalMatch ? Number.parseInt(totalMatch[1], 10) : wishes.length + offset;

      return res.status(200).json({
        wishes,
        total,
        hasMore: offset + wishes.length < total,
        storageMode: 'supabase',
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const author = sanitizePlainText(body.author || '') || 'Ẩn danh';
      const message = sanitizePlainText(body.message || '');

      if (!message || message.length < MESSAGE_MIN_LENGTH) {
        return res.status(400).json({ error: `Lời chúc cần có ít nhất ${MESSAGE_MIN_LENGTH} ký tự.` });
      }
      if (message.length > MESSAGE_MAX_LENGTH) {
        return res.status(400).json({ error: `Lời chúc không được vượt quá ${MESSAGE_MAX_LENGTH} ký tự.` });
      }
      if (author.length > AUTHOR_MAX_LENGTH) {
        return res.status(400).json({ error: `Tên người gửi tối đa ${AUTHOR_MAX_LENGTH} ký tự.` });
      }
      if (containsSpam(message) || containsSpam(author)) {
        return res.status(400).json({ error: 'Nội dung không hợp lệ hoặc chứa liên kết spam.' });
      }

      // Kiểm tra giới hạn tần suất gửi theo IP băm
      const ipHash = hashClientIp(req);
      const rateUrl = `${supabaseUrl}/rest/v1/wish_rate_limits?select=last_submitted_at&ip_hash=eq.${ipHash}&limit=1`;
      const rateRes = await fetch(rateUrl, { headers: getSupabaseHeaders() });
      if (rateRes.ok) {
        const rows = await rateRes.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const lastMs = new Date(rows[0].last_submitted_at).getTime();
          const elapsed = Date.now() - lastMs;
          if (elapsed < COOLDOWN_MS) {
            const waitSec = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
            return res.status(429).json({
              error: `Bạn vừa gửi lời chúc xong. Vui lòng đợi ${waitSec} giây trước khi gửi tiếp.`,
            });
          }
        }
      }

      // Lưu lời chúc mới vào Supabase
      const insertRes = await fetch(`${supabaseUrl}/rest/v1/wishes?select=id,author,message,created_at`, {
        method: 'POST',
        headers: {
          ...getSupabaseHeaders(),
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ author, message }),
      });

      if (!insertRes.ok) {
        const errText = await insertRes.text();
        return res.status(502).json({ error: 'Không thể lưu lời chúc lên Supabase.', detail: errText });
      }

      const inserted = await insertRes.json();
      const createdWish = Array.isArray(inserted) ? inserted[0] : inserted;

      // Cập nhật thời điểm gửi gần nhất
      await fetch(`${supabaseUrl}/rest/v1/wish_rate_limits`, {
        method: 'POST',
        headers: {
          ...getSupabaseHeaders(),
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          ip_hash: ipHash,
          last_submitted_at: new Date().toISOString(),
        }),
      });

      return res.status(201).json({
        wish: createdWish,
        storageMode: 'supabase',
      });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  } catch (err) {
    return res.status(500).json({ error: 'Đã xảy ra lỗi máy chủ khi xử lý lời chúc.' });
  }
}
