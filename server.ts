import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { validateWishInput, WISH_COOLDOWN_MS } from './src/utils/wishesValidation';

dotenv.config();

interface StoredWish {
  id: string;
  author: string;
  message: string;
  created_at: string;
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const LOCAL_WISHES_FILE = path.join(DATA_DIR, 'wishes.json');
const rateLimitMap = new Map<string, number>();

const DEFAULT_WISHES: StoredWish[] = [
  {
    id: 'seed-1',
    author: 'Minh Anh · Lớp trưởng 12C3',
    message:
      'Kính chúc quý thầy cô luôn dồi dào sức khỏe, giữ mãi ngọn lửa nhiệt huyết trên bục giảng và mãi là điểm tựa dịu dàng trong ký ức tuổi học trò của chúng em.',
    created_at: '2026-11-12T08:30:00.000Z',
  },
  {
    id: 'seed-2',
    author: 'Hoàng Nam · Tổ 2',
    message:
      'Cảm ơn cô Huyền chủ nhiệm đã luôn kiên nhẫn lắng nghe, giảng dạy môn Vật Lý thật dễ hiểu và bao dung cho những lần tụi em bồng bột. Ngày 20/11 thật nhiều niềm vui gửi đến cô ạ!',
    created_at: '2026-11-12T14:15:00.000Z',
  },
  {
    id: 'seed-3',
    author: 'Ẩn danh',
    message:
      'Dù sau này có đi qua bao nhiêu mùa phượng nữa, em vẫn không bao giờ quên những tiết học đầy ắp tiếng cười ở phòng học tầng hai và lời động viên của thầy cô trước kỳ thi.',
    created_at: '2026-11-13T09:40:00.000Z',
  },
  {
    id: 'seed-4',
    author: 'Thảo Vy · Tổ 4',
    message:
      'Chúc thầy Thoại, cô Thảo, cô Quyên, thầy Hải, thầy Linh, thầy Thủy, cô Bông, thầy Thanh và cô Huyền một mùa Hiến chương 20/11 thật ấm áp, bình an và nhiều sức khỏe!',
    created_at: '2026-11-13T16:20:00.000Z',
  },
];

function readLocalWishes(): StoredWish[] {
  try {
    if (!fs.existsSync(LOCAL_WISHES_FILE)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(LOCAL_WISHES_FILE, JSON.stringify(DEFAULT_WISHES, null, 2), 'utf-8');
      return [...DEFAULT_WISHES];
    }
    const raw = fs.readFileSync(LOCAL_WISHES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_WISHES];
  } catch {
    return [...DEFAULT_WISHES];
  }
}

function writeLocalWishes(wishes: StoredWish[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(LOCAL_WISHES_FILE, JSON.stringify(wishes, null, 2), 'utf-8');
}

function hashClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = Array.isArray(forwarded)
    ? forwarded[0]
    : typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.ip || req.socket?.remoteAddress || 'local';
  const secret = process.env.RATE_LIMIT_SECRET || 'default-local-rate-limit-secret';
  return crypto.createHmac('sha256', secret).update(rawIp).digest('hex');
}

function hasSupabaseConfig(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseHeaders(): Record<string, string> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, storageMode: hasSupabaseConfig() ? 'supabase' : 'local-file' });
  });

  app.get('/api/wishes', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const limit = Math.min(Math.max(Number.parseInt(String(req.query.limit ?? '6'), 10) || 6, 1), 30);
    const offset = Math.max(Number.parseInt(String(req.query.offset ?? '0'), 10) || 0, 0);

    if (hasSupabaseConfig()) {
      try {
        const supabaseUrl = process.env.SUPABASE_URL!.replace(/\/$/, '');
        const url = `${supabaseUrl}/rest/v1/wishes?select=id,author,message,created_at&order=created_at.desc&limit=${limit}&offset=${offset}`;
        const supaRes = await fetch(url, {
          headers: { ...getSupabaseHeaders(), Prefer: 'count=exact' },
        });
        if (!supaRes.ok) {
          throw new Error(`Supabase GET ${supaRes.status}`);
        }
        const wishes = (await supaRes.json()) as StoredWish[];
        const contentRange = supaRes.headers.get('content-range') || '';
        const totalMatch = contentRange.match(/\/(\d+)$/);
        const total = totalMatch ? Number.parseInt(totalMatch[1], 10) : wishes.length + offset;
        return res.json({
          wishes,
          total,
          hasMore: offset + wishes.length < total,
          storageMode: 'supabase',
        });
      } catch (err) {
        console.warn('Supabase GET fallback to local store:', err);
      }
    }

    const allWishes = readLocalWishes().sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const slice = allWishes.slice(offset, offset + limit);
    return res.json({
      wishes: slice,
      total: allWishes.length,
      hasMore: offset + slice.length < allWishes.length,
      storageMode: 'local-file',
    });
  });

  app.post('/api/wishes', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const validation = validateWishInput({
      author: typeof req.body?.author === 'string' ? req.body.author : '',
      message: typeof req.body?.message === 'string' ? req.body.message : '',
    });

    if (!validation.ok) {
      return res.status(400).json({ error: validation.error });
    }

    const ipHash = hashClientIp(req);
    const bypassCooldownInTest =
      process.env.NODE_ENV !== 'production' && req.headers['x-bypass-rate-limit'] === '1';

    if (hasSupabaseConfig()) {
      try {
        const supabaseUrl = process.env.SUPABASE_URL!.replace(/\/$/, '');
        if (!bypassCooldownInTest) {
          const rateRes = await fetch(
            `${supabaseUrl}/rest/v1/wish_rate_limits?select=last_submitted_at&ip_hash=eq.${ipHash}&limit=1`,
            { headers: getSupabaseHeaders() }
          );
          if (rateRes.ok) {
            const rows = (await rateRes.json()) as Array<{ last_submitted_at: string }>;
            if (rows.length > 0) {
              const elapsed = Date.now() - new Date(rows[0].last_submitted_at).getTime();
              if (elapsed < WISH_COOLDOWN_MS) {
                const waitSec = Math.ceil((WISH_COOLDOWN_MS - elapsed) / 1000);
                return res.status(429).json({
                  error: `Bạn vừa gửi lời chúc xong. Vui lòng đợi ${waitSec} giây trước khi gửi tiếp.`,
                });
              }
            }
          }
        }

        const insertRes = await fetch(`${supabaseUrl}/rest/v1/wishes?select=id,author,message,created_at`, {
          method: 'POST',
          headers: { ...getSupabaseHeaders(), Prefer: 'return=representation' },
          body: JSON.stringify({
            author: validation.author,
            message: validation.message,
          }),
        });
        if (!insertRes.ok) {
          throw new Error(`Supabase POST ${insertRes.status}`);
        }
        const inserted = (await insertRes.json()) as StoredWish[];
        const createdWish = Array.isArray(inserted) ? inserted[0] : inserted;

        await fetch(`${supabaseUrl}/rest/v1/wish_rate_limits`, {
          method: 'POST',
          headers: { ...getSupabaseHeaders(), Prefer: 'resolution=merge-duplicates' },
          body: JSON.stringify({
            ip_hash: ipHash,
            last_submitted_at: new Date().toISOString(),
          }),
        });

        return res.status(201).json({ wish: createdWish, storageMode: 'supabase' });
      } catch (err) {
        console.warn('Supabase POST fallback to local store:', err);
      }
    }

    if (!bypassCooldownInTest) {
      const lastTime = rateLimitMap.get(ipHash);
      if (lastTime && Date.now() - lastTime < WISH_COOLDOWN_MS) {
        const waitSec = Math.ceil((WISH_COOLDOWN_MS - (Date.now() - lastTime)) / 1000);
        return res.status(429).json({
          error: `Bạn vừa gửi lời chúc xong. Vui lòng đợi ${waitSec} giây trước khi gửi tiếp.`,
        });
      }
    }

    const newWish: StoredWish = {
      id: `wish-${crypto.randomUUID()}`,
      author: validation.author,
      message: validation.message,
      created_at: new Date().toISOString(),
    };

    const existing = readLocalWishes();
    existing.unshift(newWish);
    writeLocalWishes(existing);
    rateLimitMap.set(ipHash, Date.now());

    return res.status(201).json({ wish: newWish, storageMode: 'local-file' });
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT || 3000);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
