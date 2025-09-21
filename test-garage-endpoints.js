// Test script để kiểm tra các garage endpoints
const axios = require('axios');

async function testGarageEndpoints() {
  console.log('🔍 Testing Garage Endpoints...\n');

  const baseURL = 'http://localhost:8080';
  
  // Test các endpoint khác nhau
  const endpoints = [
    { name: 'Nearby', url: '/apis/garage/nearby', params: { latitude: 10.7769, longitude: 106.7009, radius: 10 } },
    { name: 'Active', url: '/apis/garage/active', params: {} },
    { name: 'All Garages', url: '/apis/garage', params: {} },
    { name: 'Garage Stats', url: '/apis/garage/stats', params: {} },
    { name: 'Available Services', url: '/apis/garage/services/available', params: {} },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`🧪 Testing ${endpoint.name} endpoint...`);
      
      const response = await axios.get(`${baseURL}${endpoint.url}`, {
        params: endpoint.params,
        timeout: 5000
      });

      console.log(`✅ ${endpoint.name}: Success! Status ${response.status}`);
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`   📊 Data: ${response.data.length} items`);
        
        if (response.data.length > 0 && endpoint.name === 'Active') {
          console.log('   📋 Sample garage:', response.data[0].name);
          console.log('   📞 Phone:', response.data[0].phone);
          console.log('   🚨 Services:', response.data[0].services?.length || 0);
        }
      } else if (response.data) {
        console.log(`   📊 Data:`, typeof response.data, Object.keys(response.data));
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Failed! Status ${error.response?.status}`);
      console.log(`   Error: ${error.response?.statusText || error.message}`);
    }
    
    console.log('');
  }

  // Test cụ thể endpoint nearby với các cách khác nhau
  console.log('🔬 Detailed Nearby Endpoint Test...\n');
  
  const nearbyTests = [
    { method: 'Direct axios', useAuth: false },
    { method: 'With Authorization header', useAuth: true },
  ];

  for (const test of nearbyTests) {
    try {
      console.log(`🧪 Testing nearby with ${test.method}...`);
      
      const config = {
        url: `${baseURL}/apis/garage/nearby`,
        params: { latitude: 10.7769, longitude: 106.7009, radius: 10 },
        timeout: 5000
      };

      if (test.useAuth) {
        config.headers = {
          'Authorization': 'Bearer fake-token-for-test'
        };
      }

      const response = await axios.get(config.url, config);
      console.log(`✅ ${test.method}: Success! ${response.data.length} garages`);
      
    } catch (error) {
      console.log(`❌ ${test.method}: Failed! Status ${error.response?.status}`);
      console.log(`   Error: ${error.response?.statusText}`);
    }
  }

  console.log('\n🎯 Recommendations:');
  console.log('- If nearby fails but active works: Use active endpoint as fallback');
  console.log('- If all fail: Check if backend server is running');
  console.log('- If 403 errors: Check SecurityConfiguration.java');
  console.log('- If timeout: Check network connectivity');
}

testGarageEndpoints().catch(console.error);
