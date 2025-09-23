/**
 * Script kiểm tra backend endpoints có tồn tại không
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function checkBackendEndpoints() {
  console.log('🔍 Checking Backend Endpoints...\n');

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
    
    // 2. Kiểm tra các endpoints
    const endpoints = [
      {
        name: 'Get Notifications',
        method: 'GET',
        url: '/apis/notifications/me',
        expectedStatus: 200
      },
      {
        name: 'Get Unread Count',
        method: 'GET',
        url: '/apis/notifications/me/unread-count',
        expectedStatus: 200
      },
      {
        name: 'Test Auth',
        method: 'GET',
        url: '/apis/notifications/test-auth',
        expectedStatus: 200
      },
      {
        name: 'Create Test Notification',
        method: 'POST',
        url: '/apis/notifications/create-test-for-current-user',
        expectedStatus: 200
      },
      {
        name: 'Mark All as Read',
        method: 'POST',
        url: '/apis/notifications/mark-all-read',
        expectedStatus: 200
      }
    ];
    
    console.log('\n📝 2. Testing endpoints...');
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\n   Testing ${endpoint.name}...`);
        console.log(`   ${endpoint.method} ${endpoint.url}`);
        
        let response;
        if (endpoint.method === 'GET') {
          response = await axios.get(`${BASE_URL}${endpoint.url}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else if (endpoint.method === 'POST') {
          response = await axios.post(`${BASE_URL}${endpoint.url}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        
        console.log(`   ✅ Status: ${response.status} (Expected: ${endpoint.expectedStatus})`);
        
        if (endpoint.name === 'Get Notifications' && response.data.length > 0) {
          console.log(`   📊 Found ${response.data.length} notifications`);
        } else if (endpoint.name === 'Get Unread Count') {
          console.log(`   📊 Unread count: ${response.data}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Failed: ${error.response?.status || 'No response'} - ${error.response?.data || error.message}`);
        
        if (error.response?.status === 404) {
          console.log(`   🔍 Endpoint not found - check if backend is running and endpoint exists`);
        } else if (error.response?.status === 403) {
          console.log(`   🔍 Forbidden - check authorization`);
        } else if (error.response?.status === 500) {
          console.log(`   🔍 Server error - check backend logs`);
        }
      }
    }
    
    // 3. Tạo notification test để kiểm tra mark as read endpoint
    console.log('\n📝 3. Creating test notification for mark as read test...');
    
    try {
      const createResponse = await axios.post(`${BASE_URL}/apis/notifications/create-test-for-current-user`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (createResponse.data.success) {
        console.log('✅ Test notification created successfully');
        
        // Chờ notification được tạo
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Lấy notifications để tìm ID
        const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const notifications = notificationsResponse.data;
        const userNotifications = notifications.filter(n => n.recipientId === loggedInUserId);
        const unreadNotification = userNotifications.find(n => !n.isRead);
        
        if (unreadNotification) {
          console.log(`\n📝 4. Testing mark as read endpoint...`);
          console.log(`   Notification ID: ${unreadNotification.id}`);
          console.log(`   Recipient ID: ${unreadNotification.recipientId}`);
          console.log(`   Current User ID: ${loggedInUserId}`);
          
          try {
            const markReadResponse = await axios.post(`${BASE_URL}/apis/notifications/${unreadNotification.id}/read`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('   ✅ Mark as read endpoint working!');
            console.log('   Response:', markReadResponse.data);
            
          } catch (error) {
            console.log('   ❌ Mark as read endpoint failed:');
            console.log(`      Status: ${error.response?.status}`);
            console.log(`      Message: ${error.response?.data || error.message}`);
            
            if (error.response?.status === 404) {
              console.log('   🔍 Mark as read endpoint not found - check if backend is running');
            }
          }
        } else {
          console.log('⚠️ No unread notifications found to test mark as read');
        }
      } else {
        console.log('❌ Failed to create test notification');
      }
      
    } catch (error) {
      console.error('❌ Error creating test notification:', error.response?.status, error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Backend check completed!');
  console.log('\n💡 If endpoints are not found:');
  console.log('   1. Make sure backend is running on port 8080');
  console.log('   2. Check if the NotificationController has the new endpoints');
  console.log('   3. Restart the backend if you made changes');
  console.log('   4. Check backend console for any errors');
}

// Chạy check
checkBackendEndpoints();
