const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/apis/v1';

async function checkUser2Garage() {
  try {
    console.log('🔍 Checking user2@gmail.com login and garage data...\n');

    // 1. Login with user2@gmail.com
    console.log('1️⃣ Logging in with user2@gmail.com...');
    const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
      email: 'user2@gmail.com',
      password: '123'
    });

    console.log('✅ Login successful!');
    console.log('📋 Login Response:');
    console.log('- User ID:', loginResponse.data.id);
    console.log('- Name:', loginResponse.data.name);
    console.log('- Email:', loginResponse.data.email);
    console.log('- Roles:', loginResponse.data.roles);
    console.log('- Garages count:', loginResponse.data.garages ? loginResponse.data.garages.length : 0);
    
    if (loginResponse.data.garages && loginResponse.data.garages.length > 0) {
      console.log('🏢 Garage details:');
      loginResponse.data.garages.forEach((garage, index) => {
        console.log(`  ${index + 1}. ${garage.name} (ID: ${garage.id})`);
        console.log(`     Status: ${garage.status}`);
        console.log(`     Address: ${garage.address}`);
      });
    }

    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    // 2. Get user profile
    console.log('\n2️⃣ Getting user profile...');
    try {
      const profileResponse = await axios.get(`${API_BASE_URL}/user/profile`, { headers });
      console.log('✅ Profile Response:');
      console.log('- Roles:', profileResponse.data.roles);
      console.log('- Garages:', profileResponse.data.garages ? profileResponse.data.garages.length : 0);
    } catch (error) {
      console.log('❌ Profile API error:', error.response?.status, error.response?.data);
    }

    // 3. Get user roles
    console.log('\n3️⃣ Getting user roles...');
    try {
      const rolesResponse = await axios.get(`${API_BASE_URL}/user/roles`, { headers });
      console.log('✅ Roles Response:');
      console.log('- Roles:', rolesResponse.data.roles);
      console.log('- Capabilities:', rolesResponse.data.capabilities);
    } catch (error) {
      console.log('❌ Roles API error:', error.response?.status, error.response?.data);
    }

    // 4. Get user garages
    console.log('\n4️⃣ Getting user garages...');
    try {
      const garagesResponse = await axios.get(`${API_BASE_URL}/user/garages`, { headers });
      console.log('✅ Garages Response:');
      console.log('- Garages count:', garagesResponse.data.length);
      if (garagesResponse.data.length > 0) {
        garagesResponse.data.forEach((garage, index) => {
          console.log(`  ${index + 1}. ${garage.name} (ID: ${garage.id})`);
        });
      }
    } catch (error) {
      console.log('❌ Garages API error:', error.response?.status, error.response?.data);
    }

    // 5. Get all garages (public API)
    console.log('\n5️⃣ Getting all garages (public API)...');
    try {
      const allGaragesResponse = await axios.get(`${API_BASE_URL}/garages/public`);
      console.log('✅ All Garages Response:');
      console.log('- Total garages:', allGaragesResponse.data.length);
      
      // Find garages owned by user2
      const user2Garages = allGaragesResponse.data.filter(garage => 
        garage.owner && garage.owner.id === loginResponse.data.id
      );
      console.log('- Garages owned by user2:', user2Garages.length);
      user2Garages.forEach((garage, index) => {
        console.log(`  ${index + 1}. ${garage.name} (ID: ${garage.id})`);
      });
    } catch (error) {
      console.log('❌ All Garages API error:', error.response?.status, error.response?.data);
    }

    console.log('\n🎯 Summary:');
    console.log('- User has roles:', loginResponse.data.roles);
    console.log('- User has garages:', loginResponse.data.garages ? loginResponse.data.garages.length : 0);
    console.log('- Should show "Quản lý Garage" card:', 
      loginResponse.data.roles && loginResponse.data.roles.includes('GARAGE') && 
      loginResponse.data.garages && loginResponse.data.garages.length > 0);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

checkUser2Garage();
