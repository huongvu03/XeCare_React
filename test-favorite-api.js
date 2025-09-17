// Test script for Favorite API
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// Test data
const testGarageId = 1;
const testToken = 'your_jwt_token_here'; // Replace with actual token

async function testFavoriteAPI() {
  console.log('🧪 Testing Favorite API...\n');

  try {
    // Test 1: Check favorite status without token (should fail)
    console.log('1️⃣ Testing check favorite status without token...');
    try {
      const response = await axios.get(`${BASE_URL}/apis/favorites/check/${testGarageId}`);
      console.log('❌ Should have failed without token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected without token (401)');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    // Test 2: Check favorite status with token
    console.log('\n2️⃣ Testing check favorite status with token...');
    try {
      const response = await axios.get(`${BASE_URL}/apis/favorites/check/${testGarageId}`, {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });
      console.log('✅ Successfully checked favorite status:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Token is invalid or expired');
      } else if (error.response?.status === 403) {
        console.log('❌ Access forbidden - check user permissions');
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
      }
    }

    // Test 3: Get user favorites
    console.log('\n3️⃣ Testing get user favorites...');
    try {
      const response = await axios.get(`${BASE_URL}/apis/favorites`, {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });
      console.log('✅ Successfully got favorites:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Token is invalid or expired');
      } else if (error.response?.status === 403) {
        console.log('❌ Access forbidden - check user permissions');
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
      }
    }

    // Test 4: Add to favorites
    console.log('\n4️⃣ Testing add to favorites...');
    try {
      const response = await axios.post(`${BASE_URL}/apis/favorites/${testGarageId}`, {}, {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });
      console.log('✅ Successfully added to favorites:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Token is invalid or expired');
      } else if (error.response?.status === 403) {
        console.log('❌ Access forbidden - check user permissions');
      } else if (error.response?.status === 409) {
        console.log('✅ Correctly handled duplicate favorite (409)');
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
      }
    }

    // Test 5: Remove from favorites
    console.log('\n5️⃣ Testing remove from favorites...');
    try {
      const response = await axios.delete(`${BASE_URL}/apis/favorites/${testGarageId}`, {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });
      console.log('✅ Successfully removed from favorites:', response.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Token is invalid or expired');
      } else if (error.response?.status === 403) {
        console.log('❌ Access forbidden - check user permissions');
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
      }
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run tests
testFavoriteAPI();

console.log('\n📝 Instructions:');
console.log('1. Make sure backend is running on http://localhost:8080');
console.log('2. Replace "your_jwt_token_here" with a valid JWT token');
console.log('3. Run: node test-favorite-api.js');
console.log('4. Check the results to identify any issues');
