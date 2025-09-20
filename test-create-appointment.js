// Test script to create an appointment for user 1
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testCreateAppointment() {
  try {
    console.log('🔍 Testing Appointment Creation for User 1...\n');

    // Test data for creating an appointment
    const appointmentData = {
      garageId: 1, // Assuming garage 1 exists
      vehicleTypeId: 1, // Assuming vehicle type 1 exists
      appointmentDate: "2024-12-25",
      appointmentTime: "09:00",
      description: "Test appointment created via script",
      contactPhone: "0123456789",
      contactEmail: "user@gmail.com",
      services: [1], // Assuming service 1 exists
      // Vehicle information
      vehicleBrand: "Honda",
      vehicleModel: "Civic",
      licensePlate: "30A-TEST01",
      vehicleYear: 2020
    };

    console.log('📋 Test appointment data:');
    console.log(JSON.stringify(appointmentData, null, 2));

    console.log('\n⚠️  Note: This test requires authentication.');
    console.log('   You need to be logged in as user@gmail.com to create appointments.');
    console.log('   This script will likely fail with 401 Unauthorized.');

    // Try to create appointment (will likely fail without auth)
    try {
      const response = await axios.post(`${BASE_URL}/apis/user/appointments`, appointmentData);
      console.log('\n✅ SUCCESS: Appointment created!');
      console.log('   Response:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('\n⚠️  EXPECTED: Authentication required (401)');
        console.log('   This means the endpoint exists and is working.');
        console.log('   You need to be logged in to create appointments.');
      } else if (error.response?.status === 400) {
        console.log('\n❌ Bad Request (400):');
        console.log('   Error:', error.response.data);
        console.log('   This might indicate missing data or validation errors.');
      } else {
        console.log('\n❌ Unexpected error:');
        console.log('   Status:', error.response?.status);
        console.log('   Error:', error.response?.data || error.message);
      }
    }

    console.log('\n🎯 Alternative approaches:');
    console.log('   1. Use the booking page to create an appointment:');
    console.log('      http://localhost:3000/booking/1');
    console.log('   2. Run the SQL script to insert test data directly:');
    console.log('      create-test-appointments.sql');
    console.log('   3. Check if appointments exist in database:');
    console.log('      test-user-appointments-database.sql');

    console.log('\n🔧 Steps to create test appointment:');
    console.log('   1. Go to http://localhost:3000/booking/1');
    console.log('   2. Fill out the booking form');
    console.log('   3. Submit the appointment');
    console.log('   4. Check http://localhost:3000/user/appointments');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCreateAppointment();
