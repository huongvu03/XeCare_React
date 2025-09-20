// Test script to check API endpoint directly
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testApiDirect() {
  try {
    console.log('🔍 Testing API endpoint directly...\n');

    // Test 1: Check if backend is running
    console.log('1. Testing backend connectivity:');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/apis/garage/1`);
      console.log('✅ Backend is running');
      console.log('   Response status:', healthResponse.status);
    } catch (error) {
      console.log('❌ Backend not accessible:', error.message);
      return;
    }

    // Test 2: Test appointments endpoint without auth (should fail)
    console.log('\n2. Testing appointments endpoint without auth:');
    try {
      const response = await axios.get(`${BASE_URL}/apis/user/appointments/my`);
      console.log('❌ UNEXPECTED: API allowed access without auth');
      console.log('   Response:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ EXPECTED: API requires authentication (401)');
        console.log('   This means the endpoint exists and is protected');
      } else if (error.response?.status === 403) {
        console.log('✅ EXPECTED: API requires authorization (403)');
        console.log('   This means the endpoint exists and is protected');
      } else {
        console.log('❌ UNEXPECTED ERROR:', error.response?.status, error.response?.data);
      }
    }

    // Test 3: Check if we can access other user endpoints
    console.log('\n3. Testing other user endpoints:');
    const endpoints = [
      '/apis/user/profile',
      '/apis/user/vehicles',
      '/apis/user/appointments/my'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${BASE_URL}${endpoint}`);
        console.log(`❌ ${endpoint}: Allowed without auth (unexpected)`);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log(`✅ ${endpoint}: Requires auth (${error.response.status})`);
        } else {
          console.log(`❌ ${endpoint}: Unexpected error (${error.response?.status})`);
        }
      }
    }

    console.log('\n🎯 Next steps:');
    console.log('   1. Check browser console for detailed API response logs');
    console.log('   2. Run database queries to verify appointments exist');
    console.log('   3. Check if user 1 is properly authenticated');
    console.log('   4. Verify JWT token is valid and not expired');

    console.log('\n🔧 Browser debugging:');
    console.log('   1. Open DevTools > Application tab');
    console.log('   2. Check Local Storage for auth token');
    console.log('   3. Go to Network tab and reload page');
    console.log('   4. Look for API call to /apis/user/appointments/my');
    console.log('   5. Check the response status and data');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testApiDirect();
