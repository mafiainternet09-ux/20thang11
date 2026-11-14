# Dư Âm Bảng Phấn — Website Tri Ân Ngày Nhà Giáo Việt Nam 20/11

Website kỷ niệm Ngày Nhà giáo Việt Nam 20/11 dành riêng cho tập thể lớp, kết hợp nghệ thuật thị giác hoài niệm, tương tác mượt mà và Bức tường lời chúc lưu trữ trực tuyến qua **Supabase + Vercel Serverless**.

---

## 1. Tính năng nổi bật

- **Cinematic Welcome Intro**: Màn hình chào mừng 20/11 với hiệu ứng chữ và nút **Bắt đầu khám phá** / **Bỏ qua intro**.
- **Trang chủ & Đồng hồ đếm ngược 20/11**: Tự động tính theo múi giờ `Asia/Ho_Chi_Minh` (trước 20/11 đếm ngược năm hiện tại, đúng 20/11 hiển thị thông điệp chúc mừng, sau 20/11 tự chuyển sang năm tiếp theo).
- **Góc tri ân thầy cô**: Bộ sưu tập thiệp giáo viên bộ môn, mở không gian thư riêng và kỷ niệm khi nhấn vào từng thầy cô.
- **Góc kỷ niệm tập thể & Lightbox**: Bộ lọc chủ đề, hỗ trợ phóng to ảnh, chuyển ảnh trước/sau, phím mũi tên, `Escape` và vuốt chạm trên điện thoại.
- **Không gian đặc biệt dành cho Cô chủ nhiệm**:
  - **The Letter**: Phong bì thư lớn đóng dấu sáp mở bằng animation.
  - **Our Journey**: Dòng thời gian hành trình Cô và Lớp.
  - **Special Memory Album**: Album kỷ niệm riêng với Lightbox và thông điệp kết.
- **Video kỷ niệm**: Hỗ trợ phát MP4 theo yêu cầu (không tự động phát, không tải trước khi mở) kèm trình chiếu mẫu khi chưa gắn video.
- **Bức tường lời chúc trực tuyến**: Form gửi lời chúc (cho phép ẩn danh), xác thực dữ liệu cả client & backend, chống spam/HTML injection, giới hạn tần suất gửi theo IP băm.
- **Âm thanh nhẹ nhàng**: Người dùng chủ động bật/tắt nhạc nền (*Màu Nắng Học Trò — Piano Cover* phát qua YouTube IFrame Player API, có fallback sang file MP3 nội bộ hoặc âm thanh piano tổng hợp khi ngoại tuyến).

---

## 2. Tùy chỉnh nội dung của lớp

Mở tệp `src/data/tributeData.ts` và tìm các vị trí đánh dấu `[THAY THẾ TẠI ĐÂY]` để cập nhật:
- Tên chủ đề, tên lớp, tên trường, niên khóa.
- Danh sách thầy cô bộ môn, lời chúc và thư riêng.
- Thông tin, lá thư, dòng thời gian và album của Cô chủ nhiệm.
- Ảnh & Video của lớp: đặt vào thư mục `public/assets/images/`, `public/assets/videos/class-memories.mp4` hoặc `public/assets/audio/background-theme.mp3` rồi cập nhật đường dẫn tương ứng.

---

## 3. Hướng dẫn triển khai lên Supabase & Vercel

### Bước 1: Tạo dự án Supabase và bảng dữ liệu
1. Truy cập [https://supabase.com](https://supabase.com) và tạo một Project mới.
2. Trong Supabase Dashboard, mở **SQL Editor**.
3. Sao chép toàn bộ nội dung tệp `database.sql` trong thư mục gốc, dán vào SQL Editor và nhấn **Run**.
4. Vào **Project Settings -> API** để lấy:
   - `Project URL` (`SUPABASE_URL`)
   - `service_role` secret key (`SUPABASE_SERVICE_ROLE_KEY`) — **Tuyệt đối không đưa key này lên GitHub hoặc mã phía trình duyệt.**

### Bước 2: Đẩy mã nguồn lên GitHub
```bash
git init
git add .
git commit -m "Website tri an 20/11"
git push -u origin main
```

### Bước 3: Kết nối GitHub với Vercel và cấu hình biến môi trường
1. Đăng nhập [https://vercel.com](https://vercel.com), chọn **Add New Project** và nhập repository GitHub của bạn.
2. Trong mục **Environment Variables** của dự án trên Vercel, thêm 3 biến:
   - `SUPABASE_URL` = URL dự án Supabase của bạn
   - `SUPABASE_SERVICE_ROLE_KEY` = Khóa `service_role` của Supabase
   - `RATE_LIMIT_SECRET` = Một chuỗi ngẫu nhiên bí mật dài tối thiểu 32 ký tự
3. Nhấn **Deploy**.

### Bước 4: Kiểm tra và quản lý lời chúc
- Mở website sau khi deploy và thử gửi một lời chúc trên mục **Bức tường lời chúc**.
- Tải lại trang để xác nhận lời chúc được lưu trong bảng `public.wishes` trên Supabase.
- Để duyệt hoặc xóa lời chúc không phù hợp: truy cập **Supabase Dashboard -> Table Editor -> wishes**.

---

## 4. Chạy thử trên máy cá nhân

```bash
npm install
npm run test
npm run dev
```
Truy cập `http://localhost:3000`. Khi chạy nội bộ chưa cấu hình Supabase, hệ thống tự động lưu lời chúc vào tệp cục bộ `.data/wishes.json` để bạn thử nghiệm đầy đủ tính năng.
