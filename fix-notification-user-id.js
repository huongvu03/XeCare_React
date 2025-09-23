/**
 * Script để fix user ID mismatch trong notifications
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function fixNotificationUserID() {
  console.log('🔧 Fixing Notification User ID Mismatch...\n');

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
    
    // 2. Debug notifications
    console.log('\n📝 2. Debugging notifications...');
    const debugResponse = await axios.get(`${BASE_URL}/apis/notifications/debug-all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 Debug results:');
    console.log(`   Current User ID: ${debugResponse.data.currentUserId}`);
    console.log(`   Total Notifications: ${debugResponse.data.totalNotifications}`);
    console.log(`   User Notifications: ${debugResponse.data.userNotifications}`);
    console.log(`   Recipient Stats:`, debugResponse.data.recipientStats);
    
    // 3. Tạo notification mới với user ID đúng
    console.log('\n📝 3. Creating new notification with correct user ID...');
    
    // Tạo test notification
    const testNotificationResponse = await axios.post(`${BASE_URL}/apis/emergency/test-notification`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Test notification created:', testNotificationResponse.data);
    
    // Chờ notification được tạo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 4. Tạo emergency request để có notification thật
    console.log('\n📝 4. Creating emergency request...');
    const emergencyData = {
      description: 'Test emergency for notification fix',
      latitude: 10.7769,
      longitude: 106.7009
    };
    
    const emergencyResponse = await axios.post(`${BASE_URL}/apis/emergency/request`, emergencyData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Emergency request created:', emergencyResponse.data.id);
    
    // Chờ notification được tạo
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 5. Kiểm tra notifications sau khi tạo
    console.log('\n📝 5. Checking notifications after creation...');
    const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const notifications = notificationsResponse.data;
    console.log(`📊 Notifications found: ${notifications.length}`);
    
    if (notifications.length === 0) {
      console.log('⚠️ Still no notifications found');
      console.log('💡 This means the issue is not just user ID mismatch');
      return;
    }
    
    // 6. Test mark as read với notification mới
    const unreadNotification = notifications.find(n => !n.isRead);
    
    if (unreadNotification) {
      console.log(`\n📝 6. Testing mark as read for notification ID: ${unreadNotification.id}`);
      console.log(`   Recipient ID: ${unreadNotification.recipientId}`);
      console.log(`   Current User ID: ${loggedInUserId}`);
      
      if (unreadNotification.recipientId === loggedInUserId) {
        console.log('✅ User ID matches - testing mark as read...');
        
        try {
          await axios.post(`${BASE_URL}/apis/notifications/${unreadNotification.id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('✅ Mark as read succeeded');
          
          // Kiểm tra lại
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
      } else {
        console.log('❌ User ID still does not match');
        console.log(`   Notification Recipient ID: ${unreadNotification.recipientId}`);
        console.log(`   Current User ID: ${loggedInUserId}`);
      }
    } else {
      console.log('⚠️ No unread notifications found to test');
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Fix completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Check if notifications are now visible on frontend');
  console.log('   2. Test the "Mark as Read" button');
  console.log('   3. If still not working, check browser console for errors');
}

// Chạy fix
fixNotificationUserID();
