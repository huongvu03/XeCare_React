/**
 * Script update notification ID 27 recipientId trong database
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function updateNotification27() {
  console.log('🔧 Updating Notification ID 27...\n');

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
    
    console.log('📋 Notification ID 27 BEFORE update:');
    console.log(`   - ID: ${notification27.id}`);
    console.log(`   - Title: ${notification27.title}`);
    console.log(`   - Recipient ID: ${notification27.recipientId}`);
    console.log(`   - Current User ID: ${loggedInUserId}`);
    console.log(`   - Is Read: ${notification27.isRead}`);
    
    if (notification27.recipientId === loggedInUserId) {
      console.log('✅ Notification already has correct user ID - no update needed');
      return;
    }
    
    // 3. Tạo endpoint để update notification (nếu chưa có)
    console.log('\n📝 3. Note: Direct database update not available via API');
    console.log('💡 You need to update the database directly using SQL:');
    console.log('\n🔧 SQL Command to fix notification ID 27:');
    console.log(`UPDATE notifications SET recipient_id = ${loggedInUserId} WHERE id = 27;`);
    
    console.log('\n🔧 SQL Command to fix ALL notifications for current user:');
    console.log(`UPDATE notifications SET recipient_id = ${loggedInUserId} WHERE recipient_type = 'USER';`);
    
    // 4. Tạo notification mới thay thế
    console.log('\n📝 4. Creating new notification to replace notification ID 27...');
    
    try {
      const createResponse = await axios.post(`${BASE_URL}/apis/notifications/create-test-for-current-user`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (createResponse.data.success) {
        console.log('✅ New notification created successfully');
        console.log('Response:', createResponse.data);
        
        // Chờ notification được tạo
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Lấy notifications mới
        const newNotificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const newNotifications = newNotificationsResponse.data;
        const userNotifications = newNotifications.filter(n => n.recipientId === loggedInUserId);
        const unreadNotification = userNotifications.find(n => !n.isRead);
        
        if (unreadNotification) {
          console.log(`\n📝 5. Testing mark as read with new notification...`);
          console.log(`   New notification ID: ${unreadNotification.id}`);
          console.log(`   Recipient ID: ${unreadNotification.recipientId}`);
          console.log(`   Current User ID: ${loggedInUserId}`);
          
          try {
            const markReadResponse = await axios.post(`${BASE_URL}/apis/notifications/${unreadNotification.id}/read`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('✅ Mark as read with new notification successful!');
            console.log('Response:', markReadResponse.data);
            
          } catch (error) {
            console.log('❌ Mark as read with new notification failed:');
            console.log(`   Status: ${error.response?.status}`);
            console.log(`   Message: ${error.response?.data || error.message}`);
          }
        }
      } else {
        console.log('❌ Failed to create new notification');
      }
      
    } catch (error) {
      console.error('❌ Error creating new notification:', error.response?.status, error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Update completed!');
  console.log('\n💡 Solutions:');
  console.log('   1. Use SQL to update notification ID 27 recipientId');
  console.log('   2. Use new notifications with correct user ID');
  console.log('   3. Test mark as read with new notifications');
  console.log('   4. Old notifications with wrong user ID will still give 403 errors');
}

// Chạy update
updateNotification27();
