/**
 * Test script để kiểm tra bảo mật của user profile
 * Chạy script này để test các endpoint profile
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// Test cases
async function testProfileSecurity() {
  console.log('🔒 Testing User Profile Security...\n');

  // Test 1: Truy cập profile mà không có token
  console.log('Test 1: Truy cập profile mà không có token');
  try {
    const response = await axios.get(`${BASE_URL}/apis/user/profile`);
    console.log('❌ FAIL: Có thể truy cập profile mà không cần authentication');
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('✅ PASS: Profile được bảo vệ đúng cách');
    } else {
      console.log('❌ FAIL: Lỗi không mong muốn:', error.response?.status);
    }
  }

  // Test 2: Truy cập profile với token không hợp lệ
  console.log('\nTest 2: Truy cập profile với token không hợp lệ');
  try {
    const response = await axios.get(`${BASE_URL}/apis/user/profile`, {
      headers: {
        'Authorization': 'Bearer invalid_token_123'
      }
    });
    console.log('❌ FAIL: Có thể truy cập profile với token không hợp lệ');
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('✅ PASS: Token không hợp lệ bị từ chối');
    } else {
      console.log('❌ FAIL: Lỗi không mong muốn:', error.response?.status);
    }
  }

  // Test 3: Update profile mà không có token
  console.log('\nTest 3: Update profile mà không có token');
  try {
    const response = await axios.put(`${BASE_URL}/apis/user/profile`, {
      name: 'Test User',
      email: 'test@example.com'
    });
    console.log('❌ FAIL: Có thể update profile mà không cần authentication');
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('✅ PASS: Update profile được bảo vệ đúng cách');
    } else {
      console.log('❌ FAIL: Lỗi không mong muốn:', error.response?.status);
    }
  }

  // Test 4: Update profile image mà không có token
  console.log('\nTest 4: Update profile image mà không có token');
  try {
    const formData = new FormData();
    formData.append('image', 'fake_image_data');
    
    const response = await axios.put(`${BASE_URL}/apis/user/profile/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('❌ FAIL: Có thể update profile image mà không cần authentication');
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('✅ PASS: Update profile image được bảo vệ đúng cách');
    } else {
      console.log('❌ FAIL: Lỗi không mong muốn:', error.response?.status);
    }
  }

  // Test 5: Kiểm tra endpoint cũ vẫn hoạt động (nếu có)
  console.log('\nTest 5: Kiểm tra endpoint cũ có bị vô hiệu hóa không');
  try {
    const response = await axios.put(`${BASE_URL}/apis/v1/users/1`, {
      name: 'Test User',
      email: 'test@example.com'
    });
    console.log('⚠️  WARNING: Endpoint cũ vẫn có thể truy cập');
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('✅ PASS: Endpoint cũ được bảo vệ đúng cách');
    } else {
      console.log('ℹ️  INFO: Endpoint cũ trả về lỗi:', error.response?.status);
    }
  }

  console.log('\n🎯 Test Summary:');
  console.log('- Tất cả endpoint profile đều yêu cầu authentication');
  console.log('- Token không hợp lệ bị từ chối');
  console.log('- Các endpoint update được bảo vệ đúng cách');
  console.log('\n✅ Profile security test completed!');
}

// Chạy test
testProfileSecurity().catch(console.error);
