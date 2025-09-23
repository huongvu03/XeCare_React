/**
 * Script test notification cho emergency
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

async function testEmergencyNotification() {
  console.log('🚀 Testing Emergency Notification System...\n');

  try {
    // 1. Đăng nhập
    console.log('📝 1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/apis/v1/login`, testUser);
    
    if (!loginResponse.data.token) {
      console.error('❌ Login failed');
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // 2. Test tạo notification trực tiếp
    console.log('\n📝 2. Testing direct notification creation...');
    try {
      const testNotificationResponse = await axios.post(`${BASE_URL}/apis/emergency/test-notification`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (testNotificationResponse.data.success) {
        console.log('✅ Test notification created successfully');
      }
    } catch (error) {
      console.error('❌ Error creating test notification:', error.response?.data || error.message);
    }
    
    // 3. Tạo emergency request thật
    console.log('\n📝 3. Creating real emergency request...');
    const emergencyData = {
      description: 'Test emergency request - Xe bị hỏng tại đường ABC',
      latitude: 10.7769,
      longitude: 106.7009
    };
    
    try {
      const emergencyResponse = await axios.post(`${BASE_URL}/apis/emergency/request`, emergencyData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (emergencyResponse.data.id) {
        console.log('✅ Emergency request created with ID:', emergencyResponse.data.id);
        
        // Chờ một chút để notification được tạo
        console.log('⏳ Waiting for notification to be created...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('❌ Error creating emergency request:', error.response?.data || error.message);
    }
    
    // 4. Kiểm tra notifications
    console.log('\n📝 4. Checking notifications...');
    try {
      const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const notifications = notificationsResponse.data;
      console.log(`📊 Total notifications: ${notifications.length}`);
      
      // Hiển thị emergency notifications
      const emergencyNotifications = notifications.filter(n => 
        n.type === 'EMERGENCY_REQUEST_CREATED' || n.title.includes('cứu hộ')
      );
      
      console.log(`🚨 Emergency notifications: ${emergencyNotifications.length}`);
      
      emergencyNotifications.forEach((notification, index) => {
        console.log(`  ${index + 1}. ${notification.title}`);
        console.log(`     Message: ${notification.message}`);
        console.log(`     Created: ${notification.createdAt}`);
        console.log(`     Read: ${notification.isRead ? 'Yes' : 'No'}`);
        console.log('');
      });
      
      // 5. Kiểm tra unread count
      const unreadResponse = await axios.get(`${BASE_URL}/apis/notifications/me/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`🔔 Unread notifications: ${unreadResponse.data}`);
      
    } catch (error) {
      console.error('❌ Error getting notifications:', error.response?.data || error.message);
    }
    
    // 6. Test database trực tiếp
    console.log('\n📝 5. Testing database...');
    try {
      const dbTestResponse = await axios.get(`${BASE_URL}/apis/notifications/test-db`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Database test result:', dbTestResponse.data);
      
    } catch (error) {
      console.error('❌ Database test failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Test completed!');
}

// Chạy test
testEmergencyNotification();
