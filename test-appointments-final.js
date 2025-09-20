// Test script to verify appointments API is working
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testAppointmentsFinal() {
  try {
    console.log('🔍 Testing Appointments API - Final Test...\n');

    // Test 1: Test without authentication
    console.log('1. Testing /apis/user/appointments/my without authentication:');
    try {
      const response = await axios.get(`${BASE_URL}/apis/user/appointments/my?page=0&size=10`);
      console.log('✅ Response:', response.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data);
    }

    // Test 2: Test with invalid token
    console.log('\n2. Testing with invalid JWT token:');
    try {
      const response = await axios.get(`${BASE_URL}/apis/user/appointments/my?page=0&size=10`, {
        headers: {
          'Authorization': 'Bearer invalid-token-123'
        }
      });
      console.log('✅ Response:', response.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data);
    }

    console.log('\n🎯 Expected Behavior:');
    console.log('   - Test 1: Should return 401/403 (authentication required)');
    console.log('   - Test 2: Should return 401/403 (invalid token)');
    console.log('   - With valid token: Should return appointments data');

    console.log('\n🔧 Backend Debug Steps:');
    console.log('   1. Check backend console for logs:');
    console.log('      🔍 [AppointmentController] getUserAppointments called');
    console.log('      🔍 [AppointmentController] Authentication: ...');
    console.log('      🔍 [AppointmentController] User email: user@gmail.com');
    console.log('      🔍 [AppointmentController] Authorities: [ROLE_USER]');
    console.log('      🔍 [AppointmentController] Found X appointments');

    console.log('\n📋 Frontend Debug Steps:');
    console.log('   1. Open browser DevTools > Console');
    console.log('   2. Check for axiosClient logs:');
    console.log('      🔍 [axiosClient] Request: { method: "GET", url: "/apis/user/appointments/my", ... }');
    console.log('      ✅ [axiosClient] Authorization header set');
    console.log('   3. Check for appointment loading logs:');
    console.log('      🔍 User context: { id: 1, email: "user@gmail.com", roles: ["user"] }');
    console.log('      🔍 API URL will be called with: { page: 0, size: 10 }');

    console.log('\n🔍 Final Fix Details:');
    console.log('   ✅ Fixed @PreAuthorize role format: hasRole("ROLE_USER")');
    console.log('   ✅ Added explicit parameter names: @RequestParam(value = "page")');
    console.log('   ✅ Removed userId parameter requirement');
    console.log('   ✅ Added debug logging to controller');
    console.log('   ✅ Updated frontend to not send userId');

    console.log('\n🚀 Next Steps:');
    console.log('   1. Restart backend server');
    console.log('   2. Test frontend: http://localhost:3000/user/appointments');
    console.log('   3. Check backend console for debug logs');
    console.log('   4. Verify appointments load successfully');

    console.log('\n🔍 Parameter Name Fix:');
    console.log('   Before: @RequestParam(defaultValue = "0") int page');
    console.log('   After:  @RequestParam(value = "page", defaultValue = "0") int page');
    console.log('   This ensures Spring can identify parameter names even without -parameters flag');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAppointmentsFinal();
