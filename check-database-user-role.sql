-- Kiểm tra user role trong database
-- Chạy query này trong MySQL để kiểm tra role của user hiện tại

-- 1. Xem tất cả users và roles
SELECT 
    u.id,
    u.username,
    u.email,
    u.role,
    u.created_at
FROM users u
ORDER BY u.id;

-- 2. Tìm user có role ADMIN
SELECT 
    u.id,
    u.username,
    u.email,
    u.role
FROM users u
WHERE u.role = 'ADMIN';

-- 3. Kiểm tra user hiện tại (thay 'your_username' bằng username của bạn)
SELECT 
    u.id,
    u.username,
    u.email,
    u.role
FROM users u
WHERE u.username = 'your_username';

-- 4. Update user role thành ADMIN (nếu cần)
-- UPDATE users SET role = 'ADMIN' WHERE username = 'your_username';

-- 5. Kiểm tra AccountType enum values
-- Có thể role được lưu dưới dạng khác như 'ROLE_ADMIN' hoặc số
SELECT DISTINCT role FROM users;
