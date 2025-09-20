// Debug script to check user 1 appointments
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function debugUserAppointments() {
  try {
    console.log('🔍 Debugging User 1 Appointments...\n');

    // Test 1: Check if user 1 exists and get user info
    console.log('1. Checking User 1 info:');
    try {
      const userResponse = await axios.get(`${BASE_URL}/apis/user/profile`);
      console.log('✅ User profile response:', userResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  Authentication required - this is expected');
      } else {
        console.log('❌ Error:', error.response?.data || error.message);
      }
    }

    // Test 2: Check appointments API endpoint
    console.log('\n2. Testing appointments API endpoint:');
    try {
      const appointmentsResponse = await axios.get(`${BASE_URL}/apis/user/appointments/my`, {
        params: {
          page: 0,
          size: 10
        }
      });
      console.log('✅ Appointments API response:');
      console.log('   - Status:', appointmentsResponse.status);
      console.log('   - Data structure:', Object.keys(appointmentsResponse.data));
      console.log('   - Content:', appointmentsResponse.data.content);
      console.log('   - Total elements:', appointmentsResponse.data.totalElements);
      console.log('   - Total pages:', appointmentsResponse.data.totalPages);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  Authentication required - this is expected');
      } else {
        console.log('❌ Error:', error.response?.data || error.message);
      }
    }

    // Test 3: Check appointments with different parameters
    console.log('\n3. Testing appointments with different parameters:');
    const testParams = [
      { page: 0, size: 10 },
      { page: 0, size: 10, status: 'PENDING' },
      { page: 0, size: 10, status: 'CONFIRMED' },
      { page: 0, size: 10, status: 'COMPLETED' }
    ];

    for (const params of testParams) {
      try {
        const response = await axios.get(`${BASE_URL}/apis/user/appointments/my`, { params });
        console.log(`   - Params ${JSON.stringify(params)}: ${response.data.content?.length || 0} appointments`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`   - Params ${JSON.stringify(params)}: Authentication required`);
        } else {
          console.log(`   - Params ${JSON.stringify(params)}: Error - ${error.response?.data || error.message}`);
        }
      }
    }

    // Test 4: Check if there are any appointments in the database
    console.log('\n4. Checking database for appointments:');
    try {
      // This might not work without proper authentication, but let's try
      const allAppointmentsResponse = await axios.get(`${BASE_URL}/apis/user/appointments`);
      console.log('✅ All appointments response:', allAppointmentsResponse.data);
    } catch (error) {
      console.log('❌ Error accessing all appointments:', error.response?.data || error.message);
    }

    console.log('\n🎯 Debugging Steps:');
    console.log('   1. Check if user 1 is properly authenticated');
    console.log('   2. Verify appointments exist in database for user 1');
    console.log('   3. Check API response structure');
    console.log('   4. Verify frontend is calling the correct API endpoint');
    console.log('   5. Check for any filtering or pagination issues');

    console.log('\n🔧 Frontend Debug Steps:');
    console.log('   1. Open browser DevTools');
    console.log('   2. Go to Network tab');
    console.log('   3. Navigate to /user/appointments');
    console.log('   4. Check the API call to /apis/user/appointments/my');
    console.log('   5. Verify the response data structure');
    console.log('   6. Check console for any JavaScript errors');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

// Run the debug
debugUserAppointments();
