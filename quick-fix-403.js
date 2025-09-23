/**
 * Script fix nhanh lỗi 403 bằng cách tạo notifications mới
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function quickFix403() {
  console.log('⚡ Quick Fix for 403 Error...\n');

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
    
    // 2. Tạo nhiều notifications test với user ID đúng
    console.log('\n📝 2. Creating test notifications with correct user ID...');
    
    const notificationTypes = [
      {
        type: 'EMERGENCY_REQUEST_CREATED',
        title: 'Yêu cầu cứu hộ mới 🚨',
        message: 'Yêu cầu cứu hộ của bạn đã được tạo thành công. ID: #1001'
      },
      {
        type: 'FAVORITE_ADDED',
        title: 'Đã thêm vào yêu thích ❤️',
        message: 'Bạn đã thêm garage Test Garage vào danh sách yêu thích'
      },
      {
        type: 'APPOINTMENT_CREATED',
        title: 'Đặt lịch hẹn thành công! 📅',
        message: 'Bạn đã đặt lịch hẹn thành công với garage. Vui lòng chờ garage xác nhận.'
      },
      {
        type: 'SYSTEM_UPDATE',
        title: 'Đăng nhập thành công! 👋',
        message: 'Chào mừng bạn quay trở lại! Hệ thống đã được cập nhật với nhiều tính năng mới.'
      },
      {
        type: 'EMERGENCY_REQUEST_CREATED',
        title: 'Test Notification 🧪',
        message: 'Đây là thông báo test để kiểm tra nút "Đã đọc" hoạt động'
      }
    ];
    
    let createdCount = 0;
    for (let i = 0; i < notificationTypes.length; i++) {
      const notificationType = notificationTypes[i];
      
      try {
        console.log(`\n   Creating ${i + 1}/${notificationTypes.length}: ${notificationType.type}...`);
        
        const createResponse = await axios.post(`${BASE_URL}/apis/notifications/create-test-for-current-user`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (createResponse.data.success) {
          console.log(`   ✅ Created successfully`);
          createdCount++;
        } else {
          console.log(`   ❌ Failed: ${createResponse.data.error}`);
        }
        
        // Chờ một chút giữa các requests
        await new Promise(resolve => setTimeout(resolve, 800));
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.response?.data || error.message}`);
      }
    }
    
    console.log(`\n✅ Created ${createdCount} notifications with correct user ID`);
    
    // 3. Chờ notifications được tạo
    console.log('\n📝 3. Waiting for notifications to be created...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 4. Kiểm tra notifications
    console.log('\n📝 4. Checking created notifications...');
    const notificationsResponse = await axios.get(`${BASE_URL}/apis/notifications/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const notifications = notificationsResponse.data;
    const userNotifications = notifications.filter(n => n.recipientId === loggedInUserId);
    const unreadNotifications = userNotifications.filter(n => !n.isRead);
    
    console.log(`📊 Results:`);
    console.log(`   - Total notifications: ${notifications.length}`);
    console.log(`   - User notifications: ${userNotifications.length}`);
    console.log(`   - Unread notifications: ${unreadNotifications.length}`);
    
    // 5. Test mark as read với notifications mới
    if (unreadNotifications.length > 0) {
      console.log('\n📝 5. Testing mark as read with new notifications...');
      
      const testNotification = unreadNotifications[0];
      console.log(`   Testing with notification ID: ${testNotification.id}`);
      console.log(`   Title: ${testNotification.title}`);
      console.log(`   Recipient ID: ${testNotification.recipientId}`);
      console.log(`   Current User ID: ${loggedInUserId}`);
      
      try {
        const markReadResponse = await axios.post(`${BASE_URL}/apis/notifications/${testNotification.id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('   ✅ Mark as read successful!');
        console.log('   Response:', markReadResponse.data);
        
        // Kiểm tra unread count sau khi mark as read
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const unreadCountResponse = await axios.get(`${BASE_URL}/apis/notifications/me/unread-count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const newUnreadCount = unreadCountResponse.data;
        console.log(`   📊 New unread count: ${newUnreadCount}`);
        
        if (newUnreadCount < unreadNotifications.length) {
          console.log('   ✅ Unread count decreased - mark as read is working!');
        } else {
          console.log('   ⚠️ Unread count did not decrease');
        }
        
      } catch (error) {
        console.log('   ❌ Mark as read failed:');
        console.log(`      Status: ${error.response?.status}`);
        console.log(`      Message: ${error.response?.data || error.message}`);
      }
    } else {
      console.log('\n⚠️ No unread notifications found to test');
    }
    
    // 6. Test mark all as read
    console.log('\n📝 6. Testing mark all as read...');
    try {
      const markAllResponse = await axios.post(`${BASE_URL}/apis/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Mark all as read successful:', markAllResponse.data);
      
    } catch (error) {
      console.error('❌ Mark all as read failed:', error.response?.status, error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Quick fix completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Go to your frontend notification page');
  console.log('   2. You should see new notifications');
  console.log('   3. Try clicking the "Da doc" button');
  console.log('   4. Check if it works without 403 errors');
  console.log('   5. If still having issues, check browser console');
}

// Chạy quick fix
quickFix403();
