// Script kiểm tra database trực tiếp
const mysql = require('mysql2/promise');

async function checkDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'hoang1',
    password: 'Hoang765218@',
    database: 'hk4_project'
  });

  try {
    console.log('=== Kiểm tra Database ===');
    
    // 1. Kiểm tra user2
    console.log('\n1. Thông tin user2:');
    const [users] = await connection.execute(
      'SELECT id, name, email, account_type, roles FROM users WHERE email = ?',
      ['user2@gmail.com']
    );
    console.log('User2:', users[0]);
    
    // 2. Kiểm tra cấu trúc bảng garage
    console.log('\n2. Cấu trúc bảng garage:');
    const [garageColumns] = await connection.execute('DESCRIBE garages');
    console.log('Garage columns:', garageColumns);
    
    // 3. Kiểm tra garage của user2
    console.log('\n3. Garage của user2:');
    const [garages] = await connection.execute(
      'SELECT * FROM garages WHERE user_id = ?',
      [users[0]?.id]
    );
    console.log('Garages:', garages);
    
    // 4. Kiểm tra tất cả garage
    console.log('\n4. Tất cả garage trong hệ thống:');
    const [allGarages] = await connection.execute(
      'SELECT g.id, g.name, g.user_id, g.status, u.name as owner_name, u.email as owner_email FROM garages g LEFT JOIN users u ON g.user_id = u.id'
    );
    console.log('All garages:', allGarages);
    
    // 5. Kiểm tra users có roles
    console.log('\n5. Users có roles:');
    const [usersWithRoles] = await connection.execute(
      'SELECT id, name, email, account_type, roles FROM users WHERE roles IS NOT NULL'
    );
    console.log('Users with roles:', usersWithRoles);
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await connection.end();
  }
}

checkDatabase();
