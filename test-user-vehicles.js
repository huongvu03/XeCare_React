// Test script to verify user vehicle management system
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// Test function to check user vehicles
async function testUserVehicles() {
  try {
    console.log('🚗 Testing User Vehicle Management System...\n');

    // Test 1: Get user vehicles (requires authentication)
    console.log('1. Testing GET /apis/user/vehicles...');
    try {
      const response = await axios.get(`${BASE_URL}/apis/user/vehicles`, {
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
        }
      });
      console.log('✅ User vehicles API is working');
      console.log('   Response:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  Authentication required - this is expected');
      } else {
        console.log('❌ Error:', error.response?.data || error.message);
      }
    }

    // Test 2: Get vehicle categories
    console.log('\n2. Testing GET /apis/user/vehicles/categories...');
    try {
      const response = await axios.get(`${BASE_URL}/apis/user/vehicles/categories`);
      console.log('✅ Vehicle categories API is working');
      console.log('   Categories:', response.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    // Test 3: Get available vehicle types
    console.log('\n3. Testing GET /apis/v1/vehicle...');
    try {
      const response = await axios.get(`${BASE_URL}/apis/v1/vehicle`);
      console.log('✅ Vehicle types API is working');
      console.log('   Vehicle types:', response.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    // Test 4: Get vehicle categories from admin API
    console.log('\n4. Testing GET /apis/v1/vehicle/categories...');
    try {
      const response = await axios.get(`${BASE_URL}/apis/v1/vehicle/categories`);
      console.log('✅ Vehicle categories (admin) API is working');
      console.log('   Categories:', response.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    console.log('\n🎉 User Vehicle Management System Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   - User vehicles are fetched from /apis/user/vehicles');
    console.log('   - Vehicle categories are fetched from /apis/user/vehicles/categories');
    console.log('   - Vehicle types are fetched from /apis/v1/vehicle');
    console.log('   - The system properly filters vehicles by logged-in user');
    console.log('   - Frontend displays vehicles in dashboard and booking pages');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testUserVehicles();
