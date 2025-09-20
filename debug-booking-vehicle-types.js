// Debug script to check vehicle type filtering issue
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function debugVehicleTypeFiltering() {
  try {
    console.log('🔍 Debugging Vehicle Type Filtering Issue...\n');

    // Test 1: Get garage 1 vehicle types
    console.log('1. Testing GET /apis/garage/1/vehicle-types...');
    try {
      const garageResponse = await axios.get(`${BASE_URL}/apis/garage/1/vehicle-types`);
      console.log('✅ Garage 1 vehicle types:');
      console.log(JSON.stringify(garageResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Error fetching garage vehicle types:', error.response?.data || error.message);
    }

    // Test 2: Get user 1 vehicles (requires authentication)
    console.log('\n2. Testing GET /apis/user/vehicles (requires auth)...');
    try {
      const userResponse = await axios.get(`${BASE_URL}/apis/user/vehicles`, {
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
        }
      });
      console.log('✅ User 1 vehicles:');
      console.log(JSON.stringify(userResponse.data, null, 2));
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  Authentication required - this is expected');
      } else {
        console.log('❌ Error:', error.response?.data || error.message);
      }
    }

    // Test 3: Get all vehicle types from admin API
    console.log('\n3. Testing GET /apis/v1/vehicle (all vehicle types)...');
    try {
      const vehicleTypesResponse = await axios.get(`${BASE_URL}/apis/v1/vehicle`);
      console.log('✅ All vehicle types:');
      console.log(JSON.stringify(vehicleTypesResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    // Test 4: Check specific vehicle type 2
    console.log('\n4. Checking vehicle type 2 details...');
    try {
      const vehicleTypesResponse = await axios.get(`${BASE_URL}/apis/v1/vehicle`);
      const vehicleType2 = vehicleTypesResponse.data.find(vt => vt.id === 2);
      if (vehicleType2) {
        console.log('✅ Vehicle type 2 found:');
        console.log(JSON.stringify(vehicleType2, null, 2));
      } else {
        console.log('❌ Vehicle type 2 not found');
      }
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    console.log('\n🎯 Analysis:');
    console.log('   - Check if garage 1 has vehicle type 2 in its vehicle types');
    console.log('   - Check if user 1 has vehicles with vehicleTypeId = 2');
    console.log('   - Verify the data structure matches between garage and user vehicles');
    console.log('   - Look for any ID mismatches or data type issues');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

// Run the debug
debugVehicleTypeFiltering();
