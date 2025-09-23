/**
 * Script để fix user ID mismatch trong notifications
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function fixUserIdMismatch() {
  console.log('🔧 Fixing User ID Mismatch in Notifications...\n');

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
    
    // 2. Lấy tất cả notifications để xem recipientId
    console.log('\n📝 2. Getting all notifications...');
    const debugResponse = await axios.get(`${BASE_URL}/apis/notifications/debug-all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const debugData = debugResponse.data;
    console.log('📊 Debug data:', debugData);
    
    const allNotifications = debugData.allNotificationsList || [];
    const userNotifications = debugData.userNotificationsList || [];
    
    console.log(`\n📋 Total notifications in DB: ${allNotifications.length}`);
    console.log(`👤 Notifications for current user (ID: ${loggedInUserId}): ${userNotifications.length}`);
    
    // 3. Phân tích recipientId
    console.log('\n📝 3. Analyzing recipient IDs...');
    const recipientStats = debugData.recipientStats || {};
    
    console.log('📊 Recipient ID statistics:');
    Object.entries(recipientStats).forEach(([recipientId, count]) => {
      const isCurrentUser = parseInt(recipientId) === loggedInUserId;
      console.log(`   - Recipient ID ${recipientId}: ${count} notifications ${isCurrentUser ? '(Current User)' : '(Other User)'}`);
    });
    
    // 4. Tìm notifications có recipientId khác với current user
    const mismatchedNotifications = allNotifications.filter(n => 
      n.recipientType === 'USER' && n.recipientId !== loggedInUserId
    );
    
    console.log(`\n⚠️ Found ${mismatchedNotifications.length} notifications with mismatched recipientId`);
    
    if (mismatchedNotifications.length === 0) {
      console.log('✅ No user ID mismatch found! All notifications belong to the current user.');
      return;
    }
    
    // 5. Hiển thị thông tin notifications bị mismatch
    console.log('\n📝 4. Mismatched notifications:');
    mismatchedNotifications.forEach((notification, index) => {
      console.log(`\n  ${index + 1}. ID: ${notification.id}`);
      console.log(`     Title: ${notification.title}`);
      console.log(`     Recipient ID: ${notification.recipientId} (should be ${loggedInUserId})`);
      console.log(`     Created: ${notification.createdAt}`);
    });
    
    // 6. Tạo notifications mới với user ID đúng
    console.log('\n📝 5. Creating new notifications with correct user ID...');
    
    const notificationTypes = [
      {
        type: 'EMERGENCY_REQUEST_CREATED',
        title: 'Yêu cầu cứu hộ mới 🚨',
        message: 'Yêu cầu cứu hộ của bạn đã được tạo thành công. ID: #999'
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
      }
    ];
    
    let createdCount = 0;
    for (const notificationType of notificationTypes) {
      try {
        console.log(`\n   Creating ${notificationType.type} notification...`);
        
        // Tạo notification test với user ID đúng
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
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.response?.data || error.message}`);
      }
    }
    
    console.log(`\n✅ Created ${createdCount} new notifications with correct user ID`);
    
    // 7. Kiểm tra kết quả
    console.log('\n📝 6. Checking results...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const finalDebugResponse = await axios.get(`${BASE_URL}/apis/notifications/debug-all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const finalDebugData = finalDebugResponse.data;
    const finalUserNotifications = finalDebugData.userNotificationsList || [];
    
    console.log(`📊 Final result:`);
    console.log(`   - Total notifications: ${finalDebugData.totalNotifications}`);
    console.log(`   - Notifications for current user: ${finalUserNotifications.length}`);
    
    // 8. Test mark as read với notifications mới
    if (finalUserNotifications.length > 0) {
      console.log('\n📝 7. Testing mark as read with new notifications...');
      
      const unreadNotification = finalUserNotifications.find(n => !n.isRead);
      if (unreadNotification) {
        console.log(`   Testing with notification ID: ${unreadNotification.id}`);
        
        try {
          const markReadResponse = await axios.post(`${BASE_URL}/apis/notifications/${unreadNotification.id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log('   ✅ Mark as read successful:', markReadResponse.data);
        } catch (error) {
          console.log('   ❌ Mark as read failed:', error.response?.data || error.message);
        }
      } else {
        console.log('   ⚠️ No unread notifications found to test');
      }
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Fix completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Test the notification page in your frontend');
  console.log('   2. Try clicking the "Đã đọc" button on notification cards');
  console.log('   3. Check if the unread count decreases');
  console.log('   4. If still having issues, check browser console for errors');
}

// Chạy fix
fixUserIdMismatch();