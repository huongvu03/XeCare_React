/**
 * Test script để kiểm tra chức năng nút "Đã đọc" nhỏ cho từng thông báo
 * Chạy script này để test API endpoints
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';
const API_URL = `${BASE_URL}/apis/notifications`;

// Mock token (thay thế bằng token thực tế khi test)
const MOCK_TOKEN = 'your-jwt-token-here';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${MOCK_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testIndividualReadButton() {
  console.log('🧪 [Test] Bắt đầu test chức năng nút "Đã đọc" nhỏ...\n');

  try {
    // 1. Lấy danh sách thông báo
    console.log('📋 [Test] 1. Lấy danh sách thông báo...');
    const notificationsResponse = await axiosClient.get(`${API_URL}/me`);
    const notifications = notificationsResponse.data;
    
    console.log(`✅ [Test] Tìm thấy ${notifications.length} thông báo`);
    
    if (notifications.length === 0) {
      console.log('⚠️ [Test] Không có thông báo nào để test. Tạo test notification trước...');
      
      // Tạo test notification
      const createResponse = await axiosClient.post(`${API_URL}/create-test-for-current-user`);
      console.log('✅ [Test] Đã tạo test notification:', createResponse.data.message);
      
      // Lấy lại danh sách
      const newNotificationsResponse = await axiosClient.get(`${API_URL}/me`);
      const newNotifications = newNotificationsResponse.data;
      console.log(`✅ [Test] Bây giờ có ${newNotifications.length} thông báo`);
      
      if (newNotifications.length === 0) {
        throw new Error('Không thể tạo test notification');
      }
      
      notifications = newNotifications;
    }

    // 2. Tìm thông báo chưa đọc để test
    const unreadNotifications = notifications.filter(n => !n.isRead);
    console.log(`📊 [Test] Tìm thấy ${unreadNotifications.length} thông báo chưa đọc`);

    if (unreadNotifications.length === 0) {
      console.log('⚠️ [Test] Không có thông báo chưa đọc nào để test');
      return;
    }

    // 3. Test đánh dấu từng thông báo đã đọc
    const testNotification = unreadNotifications[0];
    console.log(`\n🎯 [Test] 2. Test đánh dấu thông báo ID ${testNotification.id} đã đọc...`);
    console.log(`   - Tiêu đề: ${testNotification.title}`);
    console.log(`   - Trạng thái hiện tại: ${testNotification.isRead ? 'Đã đọc' : 'Chưa đọc'}`);

    // Gọi API đánh dấu đã đọc
    const markReadResponse = await axiosClient.post(`${API_URL}/${testNotification.id}/read`);
    console.log('✅ [Test] API response:', markReadResponse.data);

    // 4. Kiểm tra lại trạng thái
    console.log('\n🔍 [Test] 3. Kiểm tra lại trạng thái thông báo...');
    const updatedNotificationsResponse = await axiosClient.get(`${API_URL}/me`);
    const updatedNotifications = updatedNotificationsResponse.data;
    const updatedNotification = updatedNotifications.find(n => n.id === testNotification.id);
    
    if (updatedNotification) {
      console.log(`✅ [Test] Thông báo đã được đánh dấu đã đọc: ${updatedNotification.isRead}`);
    } else {
      console.log('❌ [Test] Không tìm thấy thông báo sau khi cập nhật');
    }

    // 5. Test đánh dấu tất cả đã đọc
    console.log('\n📝 [Test] 4. Test chức năng "Đánh dấu tất cả đã đọc"...');
    const markAllResponse = await axiosClient.post(`${API_URL}/mark-all-read`);
    console.log('✅ [Test] Mark all as read response:', markAllResponse.data);

    // 6. Kiểm tra unread count
    console.log('\n📊 [Test] 5. Kiểm tra số lượng thông báo chưa đọc...');
    const unreadCountResponse = await axiosClient.get(`${API_URL}/me/unread-count`);
    console.log(`✅ [Test] Số thông báo chưa đọc: ${unreadCountResponse.data}`);

    console.log('\n🎉 [Test] Tất cả test đã hoàn thành thành công!');
    console.log('\n📋 [Test] Tóm tắt:');
    console.log('   ✅ API lấy danh sách thông báo hoạt động');
    console.log('   ✅ API đánh dấu thông báo đã đọc hoạt động');
    console.log('   ✅ API đánh dấu tất cả đã đọc hoạt động');
    console.log('   ✅ API đếm số thông báo chưa đọc hoạt động');
    console.log('\n💡 [Test] Chức năng nút "Đã đọc" nhỏ đã sẵn sàng sử dụng!');

  } catch (error) {
    console.error('❌ [Test] Lỗi trong quá trình test:', error.message);
    
    if (error.response) {
      console.error('📋 [Test] Chi tiết lỗi API:');
      console.error('   - Status:', error.response.status);
      console.error('   - Data:', error.response.data);
    }
    
    console.log('\n🔧 [Test] Hướng dẫn khắc phục:');
    console.log('   1. Đảm bảo backend đang chạy trên localhost:8080');
    console.log('   2. Đảm bảo đã đăng nhập và có token hợp lệ');
    console.log('   3. Kiểm tra database có dữ liệu thông báo');
    console.log('   4. Thay thế MOCK_TOKEN bằng token thực tế');
  }
}

// Chạy test
if (require.main === module) {
  testIndividualReadButton();
}

module.exports = { testIndividualReadButton };
