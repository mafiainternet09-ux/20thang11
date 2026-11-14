-- ============================================================================
-- CƠ SỞ DỮ LIỆU SUPABASE CHO BỨC TƯỜNG LỜI CHÚC 20/11
-- Hướng dẫn: Mở Supabase Dashboard -> SQL Editor -> Dán toàn bộ nội dung này và Run
-- ============================================================================

-- 1. Bảng lưu trữ lời chúc tri ân
CREATE TABLE IF NOT EXISTS public.wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL DEFAULT 'Ẩn danh',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT wishes_author_length CHECK (char_length(author) BETWEEN 1 AND 60),
  CONSTRAINT wishes_message_length CHECK (char_length(message) BETWEEN 3 AND 600)
);

-- Chỉ mục sắp xếp lời chúc mới nhất lên đầu
CREATE INDEX IF NOT EXISTS idx_wishes_created_at_desc
  ON public.wishes (created_at DESC);

-- 2. Bảng giới hạn tần suất gửi (Rate Limit theo IP đã được băm SHA-256 trên máy chủ)
CREATE TABLE IF NOT EXISTS public.wish_rate_limits (
  ip_hash TEXT PRIMARY KEY,
  last_submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Bật Row Level Security (RLS)
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wish_rate_limits ENABLE ROW LEVEL SECURITY;

-- 4. Chính sách bảo mật:
-- Chỉ cho phép đọc công khai danh sách lời chúc (nếu cần truy vấn trực tiếp bằng anon key)
-- Không cho phép khách truy cập INSERT / UPDATE / DELETE trực tiếp từ trình duyệt;
-- Mọi thao tác ghi đều đi qua Serverless API /api/wishes sử dụng service_role_key trên máy chủ.
DROP POLICY IF EXISTS "Public read wishes" ON public.wishes;
CREATE POLICY "Public read wishes"
  ON public.wishes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Không tạo policy nào cho bảng wish_rate_limits -> chỉ service_role (backend) được phép đọc/ghi.

-- 5. (Tùy chọn) Thêm một vài lời chúc mẫu ban đầu
INSERT INTO public.wishes (author, message)
VALUES
  ('Minh Anh · 12C3', 'Kính chúc quý thầy cô luôn dồi dào sức khỏe, giữ mãi ngọn lửa nhiệt huyết trên bục giảng và mãi là điểm tựa dịu dàng trong ký ức tuổi học trò của chúng em.'),
  ('Hoàng Nam · Tổ 2', 'Cảm ơn cô Huyền chủ nhiệm đã luôn kiên nhẫn lắng nghe, giảng dạy môn Vật Lý thật dễ hiểu và bao dung cho những lần tụi em bồng bột. Ngày 20/11 thật nhiều niềm vui gửi đến cô ạ!'),
  ('Thảo Vy · Tổ 4', 'Chúc thầy Thoại, cô Thảo, cô Quyên, thầy Hải, thầy Linh, thầy Thủy, cô Bông, thầy Thanh và cô Huyền một mùa Hiến chương 20/11 thật ấm áp, bình an và nhiều sức khỏe!')
ON CONFLICT DO NOTHING;
