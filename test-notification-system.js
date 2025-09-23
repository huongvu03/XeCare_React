/**
 * Test script để kiểm tra hệ thống notification hoàn chỉnh
 * Chạy script này để test các tính năng notification
 */

const axios = require('axios');

// Cấu hình
const BASE_URL = 'http://localhost:8080';
const FRONTEND_URL = 'http://localhost:3000';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

const testGarage = {
  name: 'Test Garage',
  address: '123 Test Street',
  phone: '0123456789',
  email: 'garage@example.com'
};

async function testNotificationSystem() {
  console.log('🚀 Bắt đầu test hệ thống notification...\n');

  try {
    // 1. Test đăng nhập và tạo notification
    console.log('📝 1. Testing login notification...');
    await testLoginNotification();
    
    // 2. Test tạo emergency request và notification
    console.log('\n📝 2. Testing emergency notification...');
    await testEmergencyNotification();
    
    // 3. Test favorite notification
    console.log('\n📝 3. Testing favorite notification...');
    await testFavoriteNotification();
    
    // 4. Test appointment notification
    console.log('\n📝 4. Testing appointment notification...');
    await testAppointmentNotification();
    
    // 5. Test lấy danh sách notifications
    console.log('\n📝 5. Testing get notifications...');
    await testGetNotifications();
    
    console.log('\n✅ Tất cả test đã hoàn thành!');
    
  } catch (error) {
    console.error('❌ Lỗi trong quá trình test:', error.message);
  }
}

async function testLoginNotification() {
  try {
    const loginResponse = await axios.post(`${BASE_URL}/apis/v1/login`, testUser);
    
    if (loginResponse.data.token) {
      console.log('✅ Đăng nhập thành công - notification sẽ được tạo tự động');
      
      // Chờ một chút để notification được tạo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Kiểm tra notification
      const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
        headers: { Authorization: `Bearer ${loginResponse.data.token}` }
      });
      
      const loginNotifications = notificationsResponse.data.filter(n => 
        n.title.includes('Đăng nhập thành công')
      );
      
      if (loginNotifications.length > 0) {
        console.log('✅ Notification đăng nhập đã được tạo:', loginNotifications[0].title);
      } else {
        console.log('⚠️ Chưa thấy notification đăng nhập');
      }
    }
  } catch (error) {
    console.error('❌ Lỗi test login notification:', error.response?.data || error.message);
  }
}

async function testEmergencyNotification() {
  try {
    // Đăng nhập trước
    const loginResponse = await axios.post(`${BASE_URL}/apis/v1/login`, testUser);
    const token = loginResponse.data.token;
    
    // Tạo emergency request
    const emergencyData = {
      description: 'Xe bị hỏng tại đường ABC',
      latitude: 10.7769,
      longitude: 106.7009
    };
    
    const emergencyResponse = await axios.post(`${BASE_URL}/apis/emergency/request`, emergencyData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (emergencyResponse.data.id) {
      console.log('✅ Emergency request đã được tạo - notification sẽ được tạo tự động');
      
      // Chờ notification được tạo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Kiểm tra notification
      const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const emergencyNotifications = notificationsResponse.data.filter(n => 
        n.type === 'EMERGENCY_REQUEST_CREATED'
      );
      
      if (emergencyNotifications.length > 0) {
        console.log('✅ Emergency notification đã được tạo:', emergencyNotifications[0].title);
      } else {
        console.log('⚠️ Chưa thấy emergency notification');
      }
    }
  } catch (error) {
    console.error('❌ Lỗi test emergency notification:', error.response?.data || error.message);
  }
}

async function testFavoriteNotification() {
  try {
    // Đăng nhập trước
    const loginResponse = await axios.post(`${BASE_URL}/apis/v1/login`, testUser);
    const token = loginResponse.data.token;
    
    // Lấy danh sách garage để thêm vào favorite
    const garagesResponse = await axios.get(`${BASE_URL}/apis/garages/public`);
    const garages = garagesResponse.data;
    
    if (garages.length > 0) {
      const garageId = garages[0].id;
      
      // Thêm vào favorite
      await axios.post(`${BASE_URL}/apis/favorites/${garageId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Garage đã được thêm vào favorite - notification sẽ được tạo tự động');
      
      // Chờ notification được tạo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Kiểm tra notification
      const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const favoriteNotifications = notificationsResponse.data.filter(n => 
        n.type === 'FAVORITE_ADDED'
      );
      
      if (favoriteNotifications.length > 0) {
        console.log('✅ Favorite notification đã được tạo:', favoriteNotifications[0].title);
      } else {
        console.log('⚠️ Chưa thấy favorite notification');
      }
    } else {
      console.log('⚠️ Không có garage nào để test favorite');
    }
  } catch (error) {
    console.error('❌ Lỗi test favorite notification:', error.response?.data || error.message);
  }
}

async function testAppointmentNotification() {
  try {
    // Đăng nhập trước
    const loginResponse = await axios.post(`${BASE_URL}/apis/v1/login`, testUser);
    const token = loginResponse.data.token;
    
    // Lấy danh sách garage để đặt lịch
    const garagesResponse = await axios.get(`${BASE_URL}/apis/garages/public`);
    const garages = garagesResponse.data;
    
    if (garages.length > 0) {
      const garageId = garages[0].id;
      
      // Tạo appointment
      const appointmentData = {
        garageId: garageId,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Ngày mai
        time: '09:00',
        description: 'Sửa chữa xe',
        vehicleType: 'CAR'
      };
      
      const appointmentResponse = await axios.post(`${BASE_URL}/apis/user/appointments`, appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (appointmentResponse.data.id) {
        console.log('✅ Appointment đã được tạo - notification sẽ được tạo tự động');
        
        // Chờ notification được tạo
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Kiểm tra notification
        const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const appointmentNotifications = notificationsResponse.data.filter(n => 
          n.type === 'APPOINTMENT_CREATED'
        );
        
        if (appointmentNotifications.length > 0) {
          console.log('✅ Appointment notification đã được tạo:', appointmentNotifications[0].title);
        } else {
          console.log('⚠️ Chưa thấy appointment notification');
        }
      }
    } else {
      console.log('⚠️ Không có garage nào để test appointment');
    }
  } catch (error) {
    console.error('❌ Lỗi test appointment notification:', error.response?.data || error.message);
  }
}

async function testGetNotifications() {
  try {
    // Đăng nhập trước
    const loginResponse = await axios.post(`${BASE_URL}/apis/v1/login`, testUser);
    const token = loginResponse.data.token;
    
    // Lấy danh sách notifications
    const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const notifications = notificationsResponse.data;
    console.log(`✅ Đã lấy được ${notifications.length} notifications`);
    
    // Hiển thị thống kê
    const unreadCount = notifications.filter(n => !n.isRead).length;
    console.log(`📊 Thống kê: ${unreadCount} chưa đọc / ${notifications.length} tổng cộng`);
    
    // Hiển thị một số notification mẫu
    notifications.slice(0, 3).forEach((notification, index) => {
      console.log(`📋 ${index + 1}. ${notification.title} (${notification.type})`);
    });
    
    // Test unread count API
    const unreadResponse = await axios.get(`${BASE_URL}/apis/notifications/me/unread-count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`🔔 Unread count API: ${unreadResponse.data}`);
    
  } catch (error) {
    console.error('❌ Lỗi test get notifications:', error.response?.data || error.message);
  }
}

// Chạy test
if (require.main === module) {
  testNotificationSystem();
}

module.exports = { testNotificationSystem };
