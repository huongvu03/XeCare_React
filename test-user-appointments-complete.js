// Complete test script to debug user appointments issue
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testUserAppointmentsComplete() {
  try {
    console.log('🔍 Complete User Appointments Debug Test...\n');

    // Test 1: Test authentication endpoints
    console.log('1. Testing authentication system:');
    console.log('   - Login to get token for user 1');
    console.log('   - Use token to access appointments');
    console.log('   - Check if user roles are correct\n');

    // Test 2: Test appointments API with different approaches
    console.log('2. Testing appointments API without auth (should fail):');
    try {
      const response = await axios.get(`${BASE_URL}/apis/user/appointments/my`);
      console.log('❌ UNEXPECTED: API allowed access without auth');
      console.log('   Response:', response.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('✅ EXPECTED: API rejected request without auth');
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Message: ${error.response.data?.message || 'Access denied'}`);
      } else {
        console.log('❌ UNEXPECTED ERROR:', error.response?.data || error.message);
      }
    }

    // Test 3: Check if appointment data exists in database
    console.log('\n3. Frontend debugging steps:');
    console.log('   a) Open browser and navigate to http://localhost:3000/user/appointments');
    console.log('   b) Open DevTools > Console tab');
    console.log('   c) Look for debug logs starting with 🔍');
    console.log('   d) Check Network tab for API calls');
    console.log('   e) Verify user authentication in Application tab > Local Storage');

    console.log('\n4. Backend debugging steps:');
    console.log('   a) Check if user 1 exists in database');
    console.log('   b) Check if appointments exist for user 1 in appointments table');
    console.log('   c) Verify user_id foreign key matches');
    console.log('   d) Check backend logs for any errors');

    console.log('\n5. Expected debug output in browser console:');
    console.log('   🔍 loadAppointments called');
    console.log('   🔍 User object: { id: 1, email: "user1@example.com", ... }');
    console.log('   🔍 User available: true');
    console.log('   ✅ Loading appointments for user: user1@example.com');
    console.log('   🔍 Filter parameters: { page: 0, size: 10, status: undefined }');
    console.log('   🔍 Full API response: { data: { content: [...], totalElements: X } }');
    console.log('   🔍 Appointments data: [array of appointments]');
    console.log('   🔍 Appointments data length: X');

    console.log('\n6. Possible issues and solutions:');
    console.log('   ❌ User not authenticated:');
    console.log('      -> Check login status and JWT token');
    console.log('      -> Verify useAuth hook is working');
    console.log('   ❌ API returns empty array:');
    console.log('      -> Check database for appointments with user_id = 1');
    console.log('      -> Verify appointmentRepository.findByUserIdOrderByCreatedAtDesc method');
    console.log('   ❌ User ID mismatch:');
    console.log('      -> Check if user.getId() returns correct value');
    console.log('      -> Verify foreign key relationship');
    console.log('   ❌ Authentication/authorization issue:');
    console.log('      -> Check user roles (should include USER or GARAGE)');
    console.log('      -> Verify JWT token is valid');

    console.log('\n7. Database verification queries:');
    console.log('   -- Check if user 1 exists');
    console.log('   SELECT * FROM users WHERE id = 1;');
    console.log('   ');
    console.log('   -- Check appointments for user 1');
    console.log('   SELECT * FROM appointments WHERE user_id = 1;');
    console.log('   ');
    console.log('   -- Check appointment count');
    console.log('   SELECT COUNT(*) FROM appointments WHERE user_id = 1;');

    console.log('\n8. Test with curl (if you have JWT token):');
    console.log('   curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \\');
    console.log('        "http://localhost:8080/apis/user/appointments/my?page=0&size=10"');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the complete test
testUserAppointmentsComplete();
