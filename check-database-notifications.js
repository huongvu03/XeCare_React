/**
 * Script kiểm tra database notifications
 */

const mysql = require('mysql2/promise');

async function checkDatabaseNotifications() {
  console.log('🔍 Checking Database Notifications...\n');

  // Cấu hình database - thay đổi theo database của bạn
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',  // Thay bằng password MySQL của bạn
    database: 'xecare2'
  });

  try {
    // 1. Kiểm tra bảng Notifications
    console.log('📝 1. Checking Notifications table...');
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME, TABLE_ROWS 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'xecare2' 
      AND TABLE_NAME = 'Notifications'
    `);
    
    if (tables.length === 0) {
      console.log('❌ Notifications table does not exist!');
      console.log('💡 You need to create the table first.');
      return;
    }
    
    console.log('✅ Notifications table exists:', tables[0]);
    
    // 2. Kiểm tra cấu trúc bảng
    console.log('\n📝 2. Checking table structure...');
    const [columns] = await connection.execute('DESCRIBE Notifications');
    console.log('📋 Table columns:');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // 3. Đếm notifications
    console.log('\n📝 3. Counting notifications...');
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM Notifications');
    console.log(`📊 Total notifications: ${countResult[0].total}`);
    
    // 4. Hiển thị notifications gần đây
    console.log('\n📝 4. Recent notifications...');
    const [notifications] = await connection.execute(`
      SELECT 
        id, recipientType, recipientId, type, title, message, 
        isRead, createdAt, priority, category
      FROM Notifications 
      ORDER BY createdAt DESC 
      LIMIT 10
    `);
    
    if (notifications.length === 0) {
      console.log('⚠️ No notifications found in database');
    } else {
      console.log(`📋 Found ${notifications.length} recent notifications:`);
      notifications.forEach((notification, index) => {
        console.log(`\n  ${index + 1}. ID: ${notification.id}`);
        console.log(`     Title: ${notification.title}`);
        console.log(`     Type: ${notification.type}`);
        console.log(`     Recipient: ${notification.recipientType} ID ${notification.recipientId}`);
        console.log(`     Read: ${notification.isRead ? 'Yes' : 'No'}`);
        console.log(`     Created: ${notification.createdAt}`);
        console.log(`     Priority: ${notification.priority}`);
      });
    }
    
    // 5. Thống kê theo user
    console.log('\n📝 5. Statistics by user...');
    const [userStats] = await connection.execute(`
      SELECT 
        recipientId,
        COUNT(*) as total,
        SUM(CASE WHEN isRead = false THEN 1 ELSE 0 END) as unread
      FROM Notifications 
      WHERE recipientType = 'USER'
      GROUP BY recipientId 
      ORDER BY total DESC
    `);
    
    if (userStats.length === 0) {
      console.log('⚠️ No user notifications found');
    } else {
      console.log('📊 User notification statistics:');
      userStats.forEach(stat => {
        console.log(`   User ID ${stat.recipientId}: ${stat.total} total, ${stat.unread} unread`);
      });
    }
    
    // 6. Test tạo notification
    console.log('\n📝 6. Testing notification creation...');
    try {
      const [insertResult] = await connection.execute(`
        INSERT INTO Notifications (
          recipientType, recipientId, type, title, message, 
          isRead, createdAt, priority, category
        ) VALUES (
          'USER', 1, 'EMERGENCY_REQUEST_CREATED', 
          'Test Notification 🧪', 'This is a test notification', 
          false, NOW(), 'HIGH', 'EMERGENCY'
        )
      `);
      
      console.log('✅ Test notification created with ID:', insertResult.insertId);
      
      // Xóa test notification
      await connection.execute('DELETE FROM Notifications WHERE id = ?', [insertResult.insertId]);
      console.log('🗑️ Test notification deleted');
      
    } catch (error) {
      console.error('❌ Error creating test notification:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await connection.end();
  }
  
  console.log('\n🏁 Database check completed!');
}

// Chạy check
checkDatabaseNotifications();
