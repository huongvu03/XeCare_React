/**
 * Script debug notification system
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function debugNotificationSystem() {
  console.log('🔍 Debugging Notification System...\n');

  // Test data - thay đổi theo user thật của bạn
  const testUser = {
    email: 'your-email@example.com', // Thay đổi email này
    password: 'your-password'        // Thay đổi password này
  };

  try {
    // 1. Test login
    console.log('📝 1. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/apis/v1/login`, testUser);
    
    if (!loginResponse.data.token) {
      console.error('❌ Login failed. Please check your email and password.');
      console.log('💡 Update the testUser object with your real credentials');
      return;
    }
    
    const token = loginResponse.data.token;
    const userId = loginResponse.data.id;
    console.log(`✅ Login successful - User ID: ${userId}`);
    
    // 2. Test tạo notification trực tiếp
    console.log('\n📝 2. Creating test notification...');
    try {
      const testResponse = await axios.post(`${BASE_URL}/apis/emergency/test-notification`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Test notification response:', testResponse.data);
    } catch (error) {
      console.error('❌ Test notification failed:', error.response?.data || error.message);
    }
    
    // 3. Kiểm tra notifications trong database
    console.log('\n📝 3. Checking notifications in database...');
    try {
      const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`📊 Found ${notificationsResponse.data.length} notifications:`);
      
      notificationsResponse.data.forEach((notification, index) => {
        console.log(`\n  ${index + 1}. ID: ${notification.id}`);
        console.log(`     Title: ${notification.title}`);
        console.log(`     Type: ${notification.type}`);
        console.log(`     Message: ${notification.message}`);
        console.log(`     Read: ${notification.isRead}`);
        console.log(`     Created: ${notification.createdAt}`);
        console.log(`     Priority: ${notification.priority}`);
        console.log(`     Category: ${notification.category}`);
      });
      
    } catch (error) {
      console.error('❌ Error getting notifications:', error.response?.data || error.message);
    }
    
    // 4. Test unread count
    console.log('\n📝 4. Testing unread count...');
    try {
      const unreadResponse = await axios.get(`${BASE_URL}/apis/notifications/me/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`🔔 Unread count: ${unreadResponse.data}`);
      
    } catch (error) {
      console.error('❌ Error getting unread count:', error.response?.data || error.message);
    }
    
    // 5. Test database structure
    console.log('\n📝 5. Testing database structure...');
    try {
      const dbTestResponse = await axios.get(`${BASE_URL}/apis/notifications/test-db`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Database test:', dbTestResponse.data);
      
    } catch (error) {
      console.error('❌ Database test failed:', error.response?.data || error.message);
    }
    
    // 6. Test tạo emergency request
    console.log('\n📝 6. Testing emergency request creation...');
    const emergencyData = {
      description: 'Debug emergency request - Testing notification system',
      latitude: 10.7769,
      longitude: 106.7009
    };
    
    try {
      const emergencyResponse = await axios.post(`${BASE_URL}/apis/emergency/request`, emergencyData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Emergency request created:', emergencyResponse.data.id);
      
      // Chờ notification được tạo
      console.log('⏳ Waiting for notification...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Kiểm tra lại notifications
      const newNotificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newEmergencyNotifications = newNotificationsResponse.data.filter(n => 
        n.type === 'EMERGENCY_REQUEST_CREATED' && n.message.includes('emergency request')
      );
      
      if (newEmergencyNotifications.length > 0) {
        console.log('✅ Emergency notification found:', newEmergencyNotifications[0].title);
      } else {
        console.log('⚠️ Emergency notification not found');
      }
      
    } catch (error) {
      console.error('❌ Error creating emergency request:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Debug completed!');
  console.log('\n💡 If notifications are not working:');
  console.log('   1. Check server console logs for error messages');
  console.log('   2. Verify database table "Notifications" exists');
  console.log('   3. Check NotificationService is properly injected');
  console.log('   4. Update email/password in this script');
}

// Chạy debug
debugNotificationSystem();
