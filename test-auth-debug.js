// Test script to debug authentication issues
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testAuthDebug() {
  try {
    console.log('🔍 Testing Authentication Debug...\n');

    // Test 1: Check if backend is accessible
    console.log('1. Testing backend connectivity:');
    try {
      const response = await axios.get(`${BASE_URL}/apis/garage/1`);
      console.log('✅ Backend is accessible');
      console.log('   Status:', response.status);
    } catch (error) {
      console.log('❌ Backend not accessible:', error.message);
      return;
    }

    // Test 2: Test appointments endpoint without auth
    console.log('\n2. Testing appointments endpoint without authentication:');
    try {
      const response = await axios.get(`${BASE_URL}/apis/user/appointments/my`);
      console.log('❌ UNEXPECTED: API allowed access without auth');
      console.log('   Response:', response.data);
    } catch (error) {
      console.log('✅ EXPECTED: API requires authentication');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message || error.response?.data);
      
      if (error.response?.status === 401) {
        console.log('   🔐 This is an authentication error (401)');
        console.log('   💡 Solution: User needs to be logged in with valid JWT token');
      } else if (error.response?.status === 403) {
        console.log('   🚫 This is an authorization error (403)');
        console.log('   💡 Solution: User needs proper roles (USER or GARAGE)');
      }
    }

    // Test 3: Test other endpoints for comparison
    console.log('\n3. Testing other endpoints for comparison:');
    const endpoints = [
      { url: '/apis/garage/1', name: 'Public Garage Info' },
      { url: '/apis/user/profile', name: 'User Profile' },
      { url: '/apis/user/vehicles', name: 'User Vehicles' },
      { url: '/apis/user/appointments/my', name: 'User Appointments' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${BASE_URL}${endpoint.url}`);
        console.log(`✅ ${endpoint.name}: Accessible (${response.status})`);
      } catch (error) {
        const status = error.response?.status;
        if (status === 401) {
          console.log(`🔐 ${endpoint.name}: Requires authentication (401)`);
        } else if (status === 403) {
          console.log(`🚫 ${endpoint.name}: Requires authorization (403)`);
        } else {
          console.log(`❌ ${endpoint.name}: Error (${status})`);
        }
      }
    }

    console.log('\n🎯 Debugging Steps:');
    console.log('   1. Open browser DevTools > Console');
    console.log('   2. Navigate to http://localhost:3000/user/appointments');
    console.log('   3. Look for axiosClient request logs:');
    console.log('      🔍 [axiosClient] Request: {...}');
    console.log('   4. Check if token exists:');
    console.log('      hasToken: true/false');
    console.log('   5. Click "🔐 Check Auth" button in debug panel');
    console.log('   6. Check Network tab for actual HTTP request');

    console.log('\n🔧 Common Issues and Solutions:');
    console.log('   ❌ hasToken: false');
    console.log('      → User not logged in');
    console.log('      → Token expired or cleared');
    console.log('      → Solution: Login again');
    console.log('');
    console.log('   ❌ Status 401 (Unauthorized)');
    console.log('      → JWT token invalid or expired');
    console.log('      → Solution: Refresh token or login again');
    console.log('');
    console.log('   ❌ Status 403 (Forbidden)');
    console.log('      → User doesn\'t have USER or GARAGE role');
    console.log('      → Solution: Check user roles in database');
    console.log('');
    console.log('   ❌ Status 500 (Server Error)');
    console.log('      → Backend service error');
    console.log('      → Solution: Check backend logs');

    console.log('\n📋 Frontend Debug Checklist:');
    console.log('   □ Check localStorage for token');
    console.log('   □ Verify user object in localStorage');
    console.log('   □ Check axiosClient request logs');
    console.log('   □ Verify API endpoint URL');
    console.log('   □ Check Network tab for HTTP status');
    console.log('   □ Verify user roles in database');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAuthDebug();
