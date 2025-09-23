/**
 * Script test nút "Đã đọc" trong notification card
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testMarkAsReadButton() {
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
    
    // 2. Tạo notification test với user ID đúng
    console.log('\n📝 2. Creating test notification...');
    const testNotificationResponse = await axios.post(`${BASE_URL}/apis/notifications/create-test-for-current-user`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Test notification created:', testNotificationResponse.data);
    
    // Chờ notification được tạo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 3. Kiểm tra notifications
    console.log('\n📝 3. Checking notifications...');
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
    
    // 4. Kiểm tra unread count trước khi test
    console.log('\n📝 4. Checking unread count...');
    const unreadCountResponse = await axios.get(`${BASE_URL}/apis/notifications/me/unread-count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const initialUnreadCount = unreadCountResponse.data;
    console.log(`🔔 Initial unread count: ${initialUnreadCount}`);
    
    // 5. Tìm notification chưa đọc để test
    const unreadNotification = notifications.find(n => !n.isRead);
    
    if (!unreadNotification) {
      console.log('\n⚠️ No unread notifications found to test');
      return;
    }
    
    console.log(`\n📝 5. Testing mark as read for notification ID: ${unreadNotification.id}`);
    console.log(`   Recipient ID: ${unreadNotification.recipientId}`);
    console.log(`   Current User ID: ${loggedInUserId}`);
    
    if (unreadNotification.recipientId !== loggedInUserId) {
      console.log('❌ Cannot mark as read - User ID mismatch!');
      console.log('💡 This explains why the button does not work');
      return;
    }
    
    // 6. Test mark as read
    console.log('\n📝 6. Testing mark as read...');
    try {
      await axios.post(`${BASE_URL}/apis/notifications/${unreadNotification.id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Mark as read API call succeeded');
      
      // Chờ một chút
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 7. Kiểm tra unread count sau khi mark as read
      console.log('\n📝 7. Checking unread count after mark as read...');
      const updatedUnreadCountResponse = await axios.get(`${BASE_URL}/apis/notifications/me/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedUnreadCount = updatedUnreadCountResponse.data;
      console.log(`🔔 Updated unread count: ${updatedUnreadCount}`);
      
      if (updatedUnreadCount < initialUnreadCount) {
        console.log('✅ Unread count decreased successfully!');
      } else {
        console.log('⚠️ Unread count did not decrease');
      }
      
      // 8. Kiểm tra notification status
      console.log('\n📝 8. Checking notification status...');
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
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Test completed!');
  console.log('\n💡 If the button still does not work:');
  console.log('   1. Check browser console for JavaScript errors');
  console.log('   2. Check if the notification card is re-rendering');
  console.log('   3. Check if the unread count is updating in the bell');
  console.log('   4. Test the API call directly with Postman');
}

// Chạy test
testMarkAsReadButton();
