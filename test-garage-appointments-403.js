// Test script for garage appointments 403 error
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// Test user credentials
const testUser = {
  email: "test1@garage.com",
  password: "password123"
};

async function testGarageAppointments403() {
  console.log('🔍 Testing garage appointments 403 error...\n');
  
  try {
    // 1. Login to get valid token
    console.log('📝 1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/apis/v1/login`, testUser);
    
    if (!loginResponse.data.token) {
      console.error('❌ Login failed');
      return;
    }
    
    const token = loginResponse.data.token;
    const loggedInUserId = loginResponse.data.id;
    console.log(`✅ Login successful - User ID: ${loggedInUserId}`);
    console.log(`✅ Token: ${token.substring(0, 50)}...`);
    
    // 2. Get user profile to verify token and user data
    console.log('\n📝 2. Getting user profile...');
    const profileResponse = await axios.get(`${BASE_URL}/apis/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Profile retrieved successfully');
    console.log('User data:', JSON.stringify(profileResponse.data, null, 2));
    
    // 3. Check if user has garages
    const userData = profileResponse.data;
    if (!userData.garages || userData.garages.length === 0) {
      console.log('❌ User has no garages!');
      return;
    }
    
    const firstGarage = userData.garages[0];
    console.log(`\n📝 3. Testing garage appointments for garage ID: ${firstGarage.id}`);
    console.log(`Garage name: ${firstGarage.name}`);
    console.log(`Garage status: ${firstGarage.status}`);
    
    // 4. Test garage appointments endpoint
    try {
      const appointmentsResponse = await axios.get(`${BASE_URL}/apis/user/appointments/garage/${firstGarage.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: 0,
          size: 100
        }
      });
      
      console.log('✅ Garage appointments retrieved successfully!');
      console.log('Appointments count:', appointmentsResponse.data.content?.length || 0);
      console.log('Total elements:', appointmentsResponse.data.totalElements || 0);
      
    } catch (error) {
      console.log('❌ Garage appointments API call failed!');
      console.log('Status:', error.response?.status);
      console.log('Status Text:', error.response?.statusText);
      console.log('Error message:', error.response?.data?.message || error.message);
      console.log('Response data:', error.response?.data);
      
      if (error.response?.status === 403) {
        console.log('\n🚨 403 Forbidden Error Analysis:');
        console.log('- User ID:', userData.id);
        console.log('- User role:', userData.role);
        console.log('- Garage ID being accessed:', firstGarage.id);
        console.log('- Garage owner ID:', firstGarage.ownerId || 'Not specified');
        console.log('- User owns garage:', userData.garages?.some(g => g.id === firstGarage.id));
        
        // Check if this is a role-based issue
        if (userData.role !== 'GARAGE' && userData.role !== 'ADMIN') {
          console.log('\n⚠️  Role Issue: User role is not GARAGE or ADMIN');
        }
        
        // Check if this is an ownership issue
        if (!userData.garages?.some(g => g.id === firstGarage.id)) {
          console.log('\n⚠️  Ownership Issue: User does not own this garage');
        }
      }
    }
    
    // 5. Test with a different garage ID (if available)
    if (userData.garages.length > 1) {
      const secondGarage = userData.garages[1];
      console.log(`\n📝 4. Testing with second garage ID: ${secondGarage.id}`);
      
      try {
        const appointmentsResponse2 = await axios.get(`${BASE_URL}/apis/user/appointments/garage/${secondGarage.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: 0,
            size: 100
          }
        });
        
        console.log('✅ Second garage appointments retrieved successfully!');
        console.log('Appointments count:', appointmentsResponse2.data.content?.length || 0);
        
      } catch (error) {
        console.log('❌ Second garage appointments failed!');
        console.log('Status:', error.response?.status);
        console.log('Error:', error.response?.data?.message || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testGarageAppointments403().catch(console.error);
