/**
 * Script test đơn giản cho emergency notification
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testEmergencyNotification() {
  console.log('🚀 Testing Emergency Notification...\n');

  // Thay đổi thông tin này theo user thật của bạn
  const testUser = {
    email: 'user@example.com',  // Thay bằng email thật
    password: 'password123'     // Thay bằng password thật
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
    console.log('✅ Login successful');
    
    // 2. Kiểm tra user hiện tại
    console.log('\n📝 2. Checking current user...');
    try {
      const userResponse = await axios.get(`${BASE_URL}/apis/emergency/current-user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('👤 Current user info:', userResponse.data);
    } catch (error) {
      console.error('❌ Error getting user info:', error.response?.data || error.message);
    }
    
    // 3. Test tạo notification
    console.log('\n📝 3. Testing notification creation...');
    try {
      const testResponse = await axios.post(`${BASE_URL}/apis/emergency/test-notification`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Test notification response:', testResponse.data);
    } catch (error) {
      console.error('❌ Error creating test notification:', error.response?.data || error.message);
    }
    
    // 4. Tạo emergency request thật
    console.log('\n📝 4. Creating real emergency request...');
    const emergencyData = {
      description: 'Test emergency - Xe bị hỏng',
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
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error('❌ Error creating emergency request:', error.response?.data || error.message);
    }
    
    // 5. Kiểm tra notifications
    console.log('\n📝 5. Checking notifications...');
    try {
      const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const notifications = notificationsResponse.data;
      console.log(`📊 Total notifications: ${notifications.length}`);
      
      notifications.forEach((notification, index) => {
        console.log(`\n  ${index + 1}. ${notification.title}`);
        console.log(`     Type: ${notification.type}`);
        console.log(`     Read: ${notification.isRead ? 'Yes' : 'No'}`);
        console.log(`     Created: ${notification.createdAt}`);
      });
      
    } catch (error) {
      console.error('❌ Error getting notifications:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Test completed!');
}

// Chạy test
testEmergencyNotification();
