/**
 * Script debug user ID mismatch
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function debugUserIDMismatch() {
  console.log('🔍 Debugging User ID Mismatch...\n');

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
    console.log(`👤 User info:`, {
      id: loginResponse.data.id,
      email: loginResponse.data.email,
      name: loginResponse.data.name,
      role: loginResponse.data.role
    });
    
    // 2. Kiểm tra user hiện tại từ emergency endpoint
    console.log('\n📝 2. Checking current user from emergency endpoint...');
    try {
      const userResponse = await axios.get(`${BASE_URL}/apis/emergency/current-user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('👤 Current user from emergency:', userResponse.data);
      
      if (userResponse.data.id !== loggedInUserId) {
        console.log('⚠️ WARNING: User ID mismatch!');
        console.log(`   Login ID: ${loggedInUserId}`);
        console.log(`   Emergency ID: ${userResponse.data.id}`);
      }
      
    } catch (error) {
      console.error('❌ Error getting user info:', error.response?.data || error.message);
    }
    
    // 3. Kiểm tra notifications với user ID thật
    console.log('\n📝 3. Checking notifications with real user ID...');
    try {
      const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const notifications = notificationsResponse.data;
      console.log(`📊 Notifications found: ${notifications.length}`);
      
      if (notifications.length === 0) {
        console.log('⚠️ No notifications found for current user');
        console.log('💡 This might be because notifications were created for user ID = 3');
        console.log('💡 But you are logged in as user ID =', loggedInUserId);
      } else {
        console.log('✅ Notifications found:');
        notifications.forEach((notification, index) => {
          console.log(`\n  ${index + 1}. ID: ${notification.id}`);
          console.log(`     Title: ${notification.title}`);
          console.log(`     Recipient ID: ${notification.recipientId}`);
          console.log(`     Read: ${notification.isRead ? 'Yes' : 'No'}`);
          console.log(`     Created: ${notification.createdAt}`);
        });
      }
      
    } catch (error) {
      console.error('❌ Error getting notifications:', error.response?.data || error.message);
    }
    
    // 4. Test tạo notification với user ID đúng
    console.log('\n📝 4. Creating test notification with correct user ID...');
    try {
      const testResponse = await axios.post(`${BASE_URL}/apis/emergency/test-notification`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Test notification response:', testResponse.data);
      
      // Chờ notification được tạo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Kiểm tra lại notifications
      const newNotificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newNotifications = newNotificationsResponse.data;
      console.log(`📊 Notifications after test: ${newNotifications.length}`);
      
      if (newNotifications.length > 0) {
        console.log('✅ Test notification found!');
        const testNotification = newNotifications.find(n => n.title.includes('Test'));
        if (testNotification) {
          console.log('📋 Test notification details:', {
            id: testNotification.id,
            title: testNotification.title,
            recipientId: testNotification.recipientId,
            message: testNotification.message
          });
        }
      }
      
    } catch (error) {
      console.error('❌ Error creating test notification:', error.response?.data || error.message);
    }
    
    // 5. Kiểm tra tất cả notifications trong database (nếu có quyền admin)
    console.log('\n📝 5. Checking all notifications in database...');
    try {
      // Thử endpoint admin nếu có
      const allNotificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📊 All notifications:', allNotificationsResponse.data);
      
    } catch (error) {
      console.log('⚠️ Cannot access all notifications (normal for non-admin users)');
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Debug completed!');
  console.log('\n💡 Solutions:');
  console.log('   1. If user ID mismatch: Update emergency creation to use correct user ID');
  console.log('   2. If no notifications: Check if notifications were created for wrong user');
  console.log('   3. If API error: Check server logs and authentication');
}

// Chạy debug
debugUserIDMismatch();
