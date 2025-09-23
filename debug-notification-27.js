/**
 * Script debug cụ thể cho notification ID 27
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function debugNotification27() {
  console.log('🔍 Debugging Notification ID 27...\n');

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
    
    // 2. Lấy tất cả notifications để tìm notification ID 27
    console.log('\n📝 2. Getting all notifications...');
    const debugResponse = await axios.get(`${BASE_URL}/apis/notifications/debug-all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const debugData = debugResponse.data;
    const allNotifications = debugData.allNotificationsList || [];
    
    console.log(`📊 Total notifications in DB: ${allNotifications.length}`);
    
    // 3. Tìm notification ID 27
    console.log('\n📝 3. Looking for notification ID 27...');
    const notification27 = allNotifications.find(n => n.id === 27);
    
    if (!notification27) {
      console.log('❌ Notification ID 27 not found in database');
      console.log('\n📋 Available notification IDs:');
      allNotifications.forEach(n => {
        console.log(`   - ID: ${n.id}, Title: ${n.title}, Recipient ID: ${n.recipientId}`);
      });
      return;
    }
    
    console.log('✅ Found notification ID 27:');
    console.log(`   - ID: ${notification27.id}`);
    console.log(`   - Title: ${notification27.title}`);
    console.log(`   - Message: ${notification27.message}`);
    console.log(`   - Recipient ID: ${notification27.recipientId}`);
    console.log(`   - Recipient Type: ${notification27.recipientType}`);
    console.log(`   - Current User ID: ${loggedInUserId}`);
    console.log(`   - Is Read: ${notification27.isRead}`);
    console.log(`   - Created: ${notification27.createdAt}`);
    
    // 4. Phân tích vấn đề
    console.log('\n📝 4. Analyzing the problem...');
    
    if (notification27.recipientId !== loggedInUserId) {
      console.log('❌ PROBLEM IDENTIFIED: User ID Mismatch!');
      console.log(`   - Notification Recipient ID: ${notification27.recipientId}`);
      console.log(`   - Current User ID: ${loggedInUserId}`);
      console.log(`   - This causes 403 Forbidden error`);
      console.log('\n💡 Solution: Update notification recipientId or create new notification');
    } else {
      console.log('✅ User ID matches - notification should be accessible');
      console.log('❌ But still getting 403 - check backend endpoint');
    }
    
    // 5. Test mark as read với notification ID 27
    console.log('\n📝 5. Testing mark as read with notification ID 27...');
    
    try {
      const markReadResponse = await axios.post(`${BASE_URL}/apis/notifications/27/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Mark as read successful:', markReadResponse.data);
      
    } catch (error) {
      console.log('❌ Mark as read failed:');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data || error.message}`);
      
      if (error.response?.status === 403) {
        console.log('\n🔍 403 Error Analysis:');
        console.log('   - The notification recipientId does not match the logged-in user');
        console.log('   - Backend authorization check is failing');
        console.log('   - Solution: Update notification recipientId in database');
      }
    }
    
    // 6. Tạo notification mới với user ID đúng để test
    console.log('\n📝 6. Creating new notification with correct user ID...');
    
    try {
      const createResponse = await axios.post(`${BASE_URL}/apis/notifications/create-test-for-current-user`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (createResponse.data.success) {
        console.log('✅ New notification created successfully');
        
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
          console.log(`\n📝 7. Testing mark as read with new notification...`);
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
    
    // 7. Đề xuất giải pháp
    console.log('\n📝 8. Solution Recommendations:');
    
    if (notification27.recipientId !== loggedInUserId) {
      console.log('🔧 Option 1: Update notification recipientId in database');
      console.log('   - Run SQL: UPDATE notifications SET recipient_id = ? WHERE id = 27');
      console.log(`   - Replace ? with ${loggedInUserId}`);
      
      console.log('\n🔧 Option 2: Create new notifications with correct user ID');
      console.log('   - Use the create-test-for-current-user endpoint');
      console.log('   - This will create notifications with the correct recipientId');
      
      console.log('\n🔧 Option 3: Update all notifications for current user');
      console.log('   - Run SQL: UPDATE notifications SET recipient_id = ? WHERE recipient_type = "USER"');
      console.log(`   - Replace ? with ${loggedInUserId}`);
    } else {
      console.log('🔧 Check backend endpoint implementation');
      console.log('   - Verify the mark as read endpoint exists');
      console.log('   - Check if backend is running properly');
      console.log('   - Restart backend if needed');
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Debug completed!');
}

// Chạy debug
debugNotification27();
