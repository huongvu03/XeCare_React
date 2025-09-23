/**
 * Script test nút "Đã đọc" không hoạt động
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testMarkAsRead() {
  console.log('🔍 Testing Mark As Read Button...\n');

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
    
    // 2. Lấy notifications
    console.log('\n📝 2. Getting notifications...');
    const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const notifications = notificationsResponse.data;
    console.log(`📊 Found ${notifications.length} notifications`);
    
    if (notifications.length === 0) {
      console.log('⚠️ No notifications found');
      return;
    }
    
    // Hiển thị thông tin notifications
    notifications.forEach((notification, index) => {
      console.log(`\n  ${index + 1}. ID: ${notification.id}`);
      console.log(`     Title: ${notification.title}`);
      console.log(`     Recipient ID: ${notification.recipientId}`);
      console.log(`     Current User ID: ${loggedInUserId}`);
      console.log(`     Read: ${notification.isRead ? 'Yes' : 'No'}`);
      
      if (notification.recipientId !== loggedInUserId) {
        console.log(`     ⚠️ WARNING: Recipient ID (${notification.recipientId}) != Current User ID (${loggedInUserId})`);
      }
    });
    
    // 3. Tìm notification chưa đọc để test
    const unreadNotification = notifications.find(n => !n.isRead);
    
    if (!unreadNotification) {
      console.log('\n⚠️ No unread notifications found to test');
      return;
    }
    
    console.log(`\n📝 3. Testing mark as read for notification ID: ${unreadNotification.id}`);
    console.log(`   Recipient ID: ${unreadNotification.recipientId}`);
    console.log(`   Current User ID: ${loggedInUserId}`);
    
    if (unreadNotification.recipientId !== loggedInUserId) {
      console.log('❌ Cannot mark as read - User ID mismatch!');
      console.log('💡 This explains why the button does not work');
      console.log('💡 The notification belongs to user ID =', unreadNotification.recipientId);
      console.log('💡 But you are logged in as user ID =', loggedInUserId);
      
      // Thử mark as read anyway để xem lỗi
      console.log('\n📝 4. Trying to mark as read anyway to see the error...');
      try {
        await axios.post(`${BASE_URL}/apis/notifications/${unreadNotification.id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Mark as read succeeded (unexpected)');
      } catch (error) {
        console.log('❌ Mark as read failed as expected:');
        console.log(`   Status: ${error.response?.status}`);
        console.log(`   Message: ${error.response?.data || error.message}`);
      }
    } else {
      console.log('✅ User ID matches - should be able to mark as read');
      
      // Thử mark as read
      try {
        await axios.post(`${BASE_URL}/apis/notifications/${unreadNotification.id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Mark as read succeeded');
        
        // Kiểm tra lại notifications
        const updatedNotificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const updatedNotifications = updatedNotificationsResponse.data;
        const updatedNotification = updatedNotifications.find(n => n.id === unreadNotification.id);
        
        if (updatedNotification && updatedNotification.isRead) {
          console.log('✅ Notification is now marked as read');
        } else {
          console.log('⚠️ Notification is still not marked as read');
        }
        
      } catch (error) {
        console.log('❌ Mark as read failed:');
        console.log(`   Status: ${error.response?.status}`);
        console.log(`   Message: ${error.response?.data || error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Test completed!');
  console.log('\n💡 Solutions:');
  console.log('   1. If user ID mismatch: Create notifications with correct user ID');
  console.log('   2. If API error: Check server logs and authentication');
  console.log('   3. If frontend error: Check browser console for JavaScript errors');
}

// Chạy test
testMarkAsRead();
