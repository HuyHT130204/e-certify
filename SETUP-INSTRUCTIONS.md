# Hướng dẫn Setup RBAC System

## Bước 1: Chạy Supabase Schema

1. Mở **Supabase Dashboard** → **SQL Editor**
2. Copy toàn bộ nội dung từ file `supabase-schema.sql`
3. Paste vào SQL Editor và nhấn **Run**
4. Đảm bảo không có lỗi

## Bước 2: Set Admin User

1. Trong **Supabase SQL Editor**, copy nội dung từ file `supabase-set-admin.sql`
2. Paste và nhấn **Run**
3. Kiểm tra kết quả để xác nhận user `huyht1302@gmail.com` đã có role `admin`

```sql
-- Verify admin user
SELECT 
  u.email,
  p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'huyht1302@gmail.com';
```

## Bước 3: Cấu hình Auth Hook (Quan trọng!)

Để thêm role vào JWT token, bạn cần cấu hình Custom Access Token Hook:

1. Trong **Supabase Dashboard**, đi tới **Authentication** → **Hooks**
2. Click **Add Hook** → Chọn **Customize Access Token (JWT) Claims**
3. Bật toggle **"Enable Customize Access Token (JWT) Claims hook"**
4. Chọn **Postgres** làm Hook type
5. **Postgres Schema:** Giữ nguyên `public`
6. **Postgres function:** Chọn `get_user_role` từ dropdown
7. Trong phần **"The following statements will be executed on the selected function:"**, nhập:

```sql
SELECT public.get_user_role(auth.uid());
```

8. Click **Create hook**

**Lưu ý:** Sau khi tạo hook, user cần **đăng xuất và đăng nhập lại** để JWT token mới chứa role claim.

## Bước 4: Test Hệ thống RBAC

### Test Admin Role:
1. Đăng nhập với email `huyht1302@gmail.com`
2. Truy cập `/dashboard` → Nên redirect đến `/admin/dashboard`
3. Sidebar phải hiển thị: Admin Dashboard, User Management, Course Management, Certification Center

### Test Teacher Role:
1. Tạo một user mới hoặc update role của user hiện tại:
```sql
-- Set a user as teacher (thay EMAIL_HERE bằng email của user)
UPDATE public.profiles
SET role = 'teacher'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'EMAIL_HERE'
);
```
2. Đăng nhập với user đó
3. Truy cập `/dashboard` → Nên redirect đến `/teacher/dashboard`
4. Sidebar phải hiển thị: Teacher Dashboard, Create Course, My Courses, My Students

### Test Student Role:
1. Tạo một user mới (mặc định sẽ là student)
2. Đăng nhập với user đó
3. Truy cập `/dashboard` → Nên thấy Student Dashboard
4. Sidebar phải hiển thị: Dashboard, Browse Courses, Skills Passport, My Settings

## Bước 5: Kiểm tra Middleware Protection

1. Đăng nhập với **Student role**
2. Thử truy cập trực tiếp `/admin/dashboard` → Nên bị redirect về `/dashboard`
3. Thử truy cập `/teacher/dashboard` → Nên bị redirect về `/dashboard`

## Troubleshooting

### Role không hiển thị đúng trong JWT?
- Đảm bảo Auth Hook đã được tạo và bật
- Đăng xuất và đăng nhập lại
- Kiểm tra trong browser DevTools → Application → Cookies → xem JWT token

### Middleware không hoạt động?
- Kiểm tra file `middleware.ts` có ở root của project không
- Restart Next.js dev server sau khi thay đổi middleware

### RLS Policies không hoạt động?
- Kiểm tra RLS đã được enable cho các bảng
- Kiểm tra policies đã được tạo trong Supabase Dashboard → Database → Policies

