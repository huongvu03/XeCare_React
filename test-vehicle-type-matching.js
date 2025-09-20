// Test script to verify vehicle type ID matching
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testVehicleTypeMatching() {
  try {
    console.log('🔍 Testing Vehicle Type ID Matching...\n');

    // Test 1: Get garage 1 vehicle types
    console.log('1. Garage 1 Vehicle Types:');
    try {
      const garageResponse = await axios.get(`${BASE_URL}/apis/garage/1/vehicle-types`);
      console.log('✅ Garage vehicle types:');
      garageResponse.data.forEach(vt => {
        console.log(`   - ID: ${vt.id}, VehicleTypeID: ${vt.vehicleTypeId}, Name: ${vt.vehicleTypeName}`);
      });
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    // Test 2: Get all vehicle types
    console.log('\n2. All Vehicle Types:');
    try {
      const vehicleTypesResponse = await axios.get(`${BASE_URL}/apis/v1/vehicle`);
      console.log('✅ All vehicle types:');
      vehicleTypesResponse.data.forEach(vt => {
        console.log(`   - ID: ${vt.id}, Name: ${vt.name}`);
      });
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    // Test 3: Check specific vehicle type 2
    console.log('\n3. Vehicle Type 2 Details:');
    try {
      const vehicleTypesResponse = await axios.get(`${BASE_URL}/apis/v1/vehicle`);
      const vehicleType2 = vehicleTypesResponse.data.find(vt => vt.id === 2);
      if (vehicleType2) {
        console.log('✅ Vehicle type 2 found:');
        console.log(`   - ID: ${vehicleType2.id}`);
        console.log(`   - Name: ${vehicleType2.name}`);
        console.log(`   - Description: ${vehicleType2.description || 'N/A'}`);
      } else {
        console.log('❌ Vehicle type 2 not found');
      }
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    // Test 4: Check if garage 1 has vehicle type 2
    console.log('\n4. Checking if Garage 1 has Vehicle Type 2:');
    try {
      const garageResponse = await axios.get(`${BASE_URL}/apis/garage/1/vehicle-types`);
      const hasVehicleType2 = garageResponse.data.some(vt => vt.vehicleTypeId === 2);
      console.log(`✅ Garage 1 has vehicle type 2: ${hasVehicleType2}`);
      
      if (hasVehicleType2) {
        const vehicleType2 = garageResponse.data.find(vt => vt.vehicleTypeId === 2);
        console.log(`   - Garage Vehicle Type ID: ${vehicleType2.id}`);
        console.log(`   - Vehicle Type ID: ${vehicleType2.vehicleTypeId}`);
        console.log(`   - Vehicle Type Name: ${vehicleType2.vehicleTypeName}`);
      }
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    console.log('\n🎯 Expected Result:');
    console.log('   - Garage 1 should have vehicle type 2 in its vehicle types');
    console.log('   - User 1 should have vehicles with vehicleTypeId = 2');
    console.log('   - The matching should work: garage.vehicleTypeId === user.vehicleTypeId');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testVehicleTypeMatching();
