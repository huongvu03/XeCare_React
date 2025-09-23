/**
 * Script test fix lỗi 403 khi mark as read
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testMarkAsRead403Fix() {
  console.log('🔍 Testing Mark As Read 403 Fix...\n');

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
    
    // 2. Kiểm tra auth
    console.log('\n📝 2. Testing authentication...');
    try {
      const authResponse = await axios.get(`${BASE_URL}/apis/notifications/test-auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Auth test:', authResponse.data);
    } catch (error) {
      console.error('❌ Auth test failed:', error.response?.data || error.message);
    }
    
    // 3. Tạo notification test với user ID đúng
    console.log('\n📝 3. Creating test notification...');
    try {
      const testNotificationResponse = await axios.post(`${BASE_URL}/apis/notifications/create-test-for-current-user`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Test notification created:', testNotificationResponse.data);
    } catch (error) {
      console.error('❌ Failed to create test notification:', error.response?.data || error.message);
    }
    
    // Chờ notification được tạo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 4. Kiểm tra notifications
    console.log('\n📝 4. Checking notifications...');
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
    
    // 5. Kiểm tra unread count trước khi test
    console.log('\n📝 5. Checking unread count...');
    const unreadCountResponse = await axios.get(`${BASE_URL}/apis/notifications/me/unread-count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const initialUnreadCount = unreadCountResponse.data;
    console.log(`🔔 Initial unread count: ${initialUnreadCount}`);
    
    // 6. Tìm notification chưa đọc để test
    const unreadNotification = notifications.find(n => !n.isRead);
    
    if (!unreadNotification) {
      console.log('\n⚠️ No unread notifications found to test');
      return;
    }
    
    console.log(`\n📝 6. Testing mark as read for notification ID: ${unreadNotification.id}`);
    console.log(`   Recipient ID: ${unreadNotification.recipientId}`);
    console.log(`   Current User ID: ${loggedInUserId}`);
    
    // 7. Test mark as read với endpoint mới
    console.log('\n📝 7. Testing mark as read with new endpoint...');
    try {
      const markReadResponse = await axios.post(`${BASE_URL}/apis/notifications/${unreadNotification.id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Mark as read successful:', markReadResponse.data);
      
      // Chờ một chút
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 8. Kiểm tra unread count sau khi mark as read
      console.log('\n📝 8. Checking unread count after mark as read...');
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
      
      // 9. Kiểm tra notification status
      console.log('\n📝 9. Checking notification status...');
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
      
      if (error.response?.status === 403) {
        console.log('\n🔍 403 Error Analysis:');
        console.log('   - This means the user ID in the notification does not match the logged-in user');
        console.log('   - Check the recipientId in the notification vs current user ID');
        console.log('   - You may need to update the notification recipientId in the database');
      }
    }
    
    // 10. Test mark all as read
    console.log('\n📝 10. Testing mark all as read...');
    try {
      const markAllResponse = await axios.post(`${BASE_URL}/apis/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Mark all as read:', markAllResponse.data);
    } catch (error) {
      console.error('❌ Mark all as read failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Test completed!');
  console.log('\n💡 If you still get 403 errors:');
  console.log('   1. The notification recipientId does not match your user ID');
  console.log('   2. Run the fix-user-id-mismatch.js script to fix this');
  console.log('   3. Or create new notifications with the correct user ID');
}

// Chạy test
testMarkAsRead403Fix();
