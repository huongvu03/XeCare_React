/**
 * Script fix notification ID 27
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function fixNotification27() {
  console.log('🔧 Fixing Notification ID 27...\n');

  // Thay đổi thông tin này theo user thật của bạn
  const testUser = {
    email: 'your-email@example.com',  // Thay bằng email thật
    password: 'your-password'         // Thay bằng password thật
  };

  try {
    // 1. Đăng nhập
    console.log('📝 1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/apis/v1/login`, testUser);
    
    if (!loginResponse.data.token) {
      console.error('❌ Login failed');
      return;
    }
    
    const token = loginResponse.data.token;
    const loggedInUserId = loginResponse.data.id;
    console.log(`✅ Login successful - User ID: ${loggedInUserId}`);
    
    // 2. Lấy thông tin notification ID 27
    console.log('\n📝 2. Getting notification ID 27 details...');
    const debugResponse = await axios.get(`${BASE_URL}/apis/notifications/debug-all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const debugData = debugResponse.data;
    const allNotifications = debugData.allNotificationsList || [];
    const notification27 = allNotifications.find(n => n.id === 27);
    
    if (!notification27) {
      console.log('❌ Notification ID 27 not found');
      return;
    }
    
    console.log('📋 Notification ID 27 details:');
    console.log(`   - ID: ${notification27.id}`);
    console.log(`   - Title: ${notification27.title}`);
    console.log(`   - Recipient ID: ${notification27.recipientId}`);
    console.log(`   - Current User ID: ${loggedInUserId}`);
    console.log(`   - Is Read: ${notification27.isRead}`);
    
    // 3. Tạo notification mới với user ID đúng
    console.log('\n📝 3. Creating new notification with correct user ID...');
    
    const notificationTypes = [
      {
        type: 'EMERGENCY_REQUEST_CREATED',
        title: 'Yêu cầu cứu hộ mới 🚨',
        message: 'Yêu cầu cứu hộ của bạn đã được tạo thành công. ID: #1001'
      },
      {
        type: 'FAVORITE_ADDED',
        title: 'Đã thêm vào yêu thích ❤️',
        message: 'Bạn đã thêm garage Test Garage vào danh sách yêu thích'
      },
      {
        type: 'APPOINTMENT_CREATED',
        title: 'Đặt lịch hẹn thành công! 📅',
        message: 'Bạn đã đặt lịch hẹn thành công với garage. Vui lòng chờ garage xác nhận.'
      },
      {
        type: 'SYSTEM_UPDATE',
        title: 'Đăng nhập thành công! 👋',
        message: 'Chào mừng bạn quay trở lại! Hệ thống đã được cập nhật với nhiều tính năng mới.'
      }
    ];
    
    let createdCount = 0;
    for (let i = 0; i < notificationTypes.length; i++) {
      const notificationType = notificationTypes[i];
      
      try {
        console.log(`\n   Creating ${i + 1}/${notificationTypes.length}: ${notificationType.type}...`);
        
        const createResponse = await axios.post(`${BASE_URL}/apis/notifications/create-test-for-current-user`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (createResponse.data.success) {
          console.log(`   ✅ Created successfully`);
          createdCount++;
        } else {
          console.log(`   ❌ Failed: ${createResponse.data.error}`);
        }
        
        // Chờ một chút giữa các requests
        await new Promise(resolve => setTimeout(resolve, 800));
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.response?.data || error.message}`);
      }
    }
    
    console.log(`\n✅ Created ${createdCount} new notifications with correct user ID`);
    
    // 4. Chờ notifications được tạo
    console.log('\n📝 4. Waiting for notifications to be created...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 5. Kiểm tra notifications mới
    console.log('\n📝 5. Checking new notifications...');
    const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const notifications = notificationsResponse.data;
    const userNotifications = notifications.filter(n => n.recipientId === loggedInUserId);
    const unreadNotifications = userNotifications.filter(n => !n.isRead);
    
    console.log(`📊 Results:`);
    console.log(`   - Total notifications: ${notifications.length}`);
    console.log(`   - User notifications: ${userNotifications.length}`);
    console.log(`   - Unread notifications: ${unreadNotifications.length}`);
    
    // 6. Test mark as read với notifications mới
    if (unreadNotifications.length > 0) {
      console.log('\n📝 6. Testing mark as read with new notifications...');
      
      for (let i = 0; i < Math.min(3, unreadNotifications.length); i++) {
        const testNotification = unreadNotifications[i];
        console.log(`\n   Testing notification ${i + 1}:`);
        console.log(`   - ID: ${testNotification.id}`);
        console.log(`   - Title: ${testNotification.title}`);
        console.log(`   - Recipient ID: ${testNotification.recipientId}`);
        console.log(`   - Current User ID: ${loggedInUserId}`);
        
        try {
          const markReadResponse = await axios.post(`${BASE_URL}/apis/notifications/${testNotification.id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log(`   ✅ Mark as read successful!`);
          console.log(`   Response: ${JSON.stringify(markReadResponse.data)}`);
          
          // Chờ một chút
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.log(`   ❌ Mark as read failed:`);
          console.log(`      Status: ${error.response?.status}`);
          console.log(`      Message: ${error.response?.data || error.message}`);
        }
      }
    }
    
    // 7. Kiểm tra unread count
    console.log('\n📝 7. Checking unread count...');
    try {
      const unreadCountResponse = await axios.get(`${BASE_URL}/apis/notifications/me/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const unreadCount = unreadCountResponse.data;
      console.log(`📊 Current unread count: ${unreadCount}`);
      
    } catch (error) {
      console.error('❌ Failed to get unread count:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Fix completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Go to your frontend notification page');
  console.log('   2. You should see new notifications with correct user ID');
  console.log('   3. Try clicking the "Da doc" button on these new notifications');
  console.log('   4. The 403 error should be gone for these new notifications');
  console.log('   5. Old notifications with wrong user ID will still give 403 errors');
}

// Chạy fix
fixNotification27();
