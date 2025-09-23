/**
 * Script debug lỗi 403 khi mark as read
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function debug403Error() {
  console.log('🔍 Debugging 403 Error...\n');

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
    
    // 2. Test authentication
    console.log('\n📝 2. Testing authentication...');
    try {
      const authResponse = await axios.get(`${BASE_URL}/apis/notifications/test-auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Auth test successful:', authResponse.data);
    } catch (error) {
      console.error('❌ Auth test failed:', error.response?.status, error.response?.data);
      return;
    }
    
    // 3. Kiểm tra endpoint có tồn tại không
    console.log('\n📝 3. Testing endpoint availability...');
    
    // Tạo một notification test trước
    try {
      const createResponse = await axios.post(`${BASE_URL}/apis/notifications/create-test-for-current-user`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Test notification created:', createResponse.data);
    } catch (error) {
      console.error('❌ Failed to create test notification:', error.response?.status, error.response?.data);
    }
    
    // Chờ notification được tạo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 4. Lấy notifications
    console.log('\n📝 4. Getting notifications...');
    const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const notifications = notificationsResponse.data;
    console.log(`📊 Found ${notifications.length} notifications`);
    
    if (notifications.length === 0) {
      console.log('⚠️ No notifications found');
      return;
    }
    
    // 5. Phân tích từng notification
    console.log('\n📝 5. Analyzing notifications...');
    notifications.forEach((notification, index) => {
      console.log(`\n  ${index + 1}. ID: ${notification.id}`);
      console.log(`     Title: ${notification.title}`);
      console.log(`     Recipient ID: ${notification.recipientId}`);
      console.log(`     Current User ID: ${loggedInUserId}`);
      console.log(`     Read: ${notification.isRead ? 'Yes' : 'No'}`);
      console.log(`     Created: ${notification.createdAt}`);
      
      if (notification.recipientId !== loggedInUserId) {
        console.log(`     ⚠️ WARNING: Recipient ID (${notification.recipientId}) != Current User ID (${loggedInUserId})`);
        console.log(`     ❌ This will cause 403 error!`);
      } else {
        console.log(`     ✅ User ID matches - should work`);
      }
    });
    
    // 6. Tìm notification để test
    const unreadNotification = notifications.find(n => !n.isRead && n.recipientId === loggedInUserId);
    
    if (!unreadNotification) {
      console.log('\n⚠️ No unread notifications with correct user ID found');
      
      // Tạo notification mới với user ID đúng
      console.log('\n📝 6a. Creating new notification with correct user ID...');
      try {
        const createResponse = await axios.post(`${BASE_URL}/apis/notifications/create-test-for-current-user`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ New notification created:', createResponse.data);
        
        // Chờ và lấy lại notifications
        await new Promise(resolve => setTimeout(resolve, 2000));
        const newNotificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const newNotifications = newNotificationsResponse.data;
        const newUnreadNotification = newNotifications.find(n => !n.isRead && n.recipientId === loggedInUserId);
        
        if (newUnreadNotification) {
          console.log(`✅ Found new notification ID: ${newUnreadNotification.id}`);
          await testMarkAsRead(newUnreadNotification.id, token, loggedInUserId);
        }
        
      } catch (error) {
        console.error('❌ Failed to create new notification:', error.response?.status, error.response?.data);
      }
      
    } else {
      console.log(`\n📝 6. Testing mark as read with notification ID: ${unreadNotification.id}`);
      await testMarkAsRead(unreadNotification.id, token, loggedInUserId);
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Debug completed!');
}

async function testMarkAsRead(notificationId, token, userId) {
  try {
    console.log(`\n   Testing mark as read for notification ID: ${notificationId}`);
    console.log(`   Current user ID: ${userId}`);
    
    // Test với endpoint mới
    const markReadResponse = await axios.post(`${BASE_URL}/apis/notifications/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('   ✅ Mark as read successful:', markReadResponse.data);
    
  } catch (error) {
    console.log('   ❌ Mark as read failed:');
    console.log(`      Status: ${error.response?.status}`);
    console.log(`      Message: ${error.response?.data || error.message}`);
    
    if (error.response?.status === 403) {
      console.log('\n   🔍 403 Error Analysis:');
      console.log('      - The notification recipientId does not match the logged-in user');
      console.log('      - This is the most common cause of 403 errors');
      console.log('      - Solution: Update notification recipientId or create new notifications');
    } else if (error.response?.status === 404) {
      console.log('\n   🔍 404 Error Analysis:');
      console.log('      - The notification ID does not exist');
      console.log('      - Or the endpoint is not found');
      console.log('      - Solution: Check if backend is running and endpoint exists');
    } else if (error.response?.status === 401) {
      console.log('\n   🔍 401 Error Analysis:');
      console.log('      - JWT token is invalid or expired');
      console.log('      - Solution: Login again to get a new token');
    }
  }
}

// Chạy debug
debug403Error();
