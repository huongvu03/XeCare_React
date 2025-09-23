-- Kiểm tra dữ liệu garage trong database
-- Chạy queries này trong MySQL để kiểm tra

-- 1. Xem tất cả garages
SELECT 
    g.id,
    g.name,
    g.status,
    g.owner_id,
    u.username as owner_username,
    u.role as owner_role,
    g.created_at
FROM garages g
LEFT JOIN users u ON g.owner_id = u.id
ORDER BY g.id;

-- 2. Đếm số lượng garages theo status
SELECT 
    status,
    COUNT(*) as count
FROM garages
GROUP BY status;

-- 3. Xem garages có status ACTIVE
SELECT 
    g.id,
    g.name,
    g.status,
    g.owner_id,
    u.username as owner_username
FROM garages g
LEFT JOIN users u ON g.owner_id = u.id
WHERE g.status = 'ACTIVE';

-- 4. Kiểm tra garage ID 1 có tồn tại không
SELECT 
    g.id,
    g.name,
    g.status,
    g.owner_id,
    u.username as owner_username
FROM garages g
LEFT JOIN users u ON g.owner_id = u.id
WHERE g.id = 1;

-- 5. Xem tất cả users và roles
SELECT 
    id,
    username,
    email,
    role,
    created_at
FROM users
ORDER BY id;
