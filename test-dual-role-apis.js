// Test script for Dual Role System APIs
const API_BASE_URL = 'http://localhost:8080';

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${endpoint}:`, response.status, data);
    return { success: true, data, status: response.status };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing Dual Role System APIs...\n');
  
  // Test 1: Get users by role
  console.log('1. Testing GET /apis/user/roles/by-role/USER');
  await testAPI('/apis/user/roles/by-role/USER');
  
  // Test 2: Get users who can book appointments
  console.log('\n2. Testing GET /apis/user/roles/can-book');
  await testAPI('/apis/user/roles/can-book');
  
  // Test 3: Get users who can manage garages
  console.log('\n3. Testing GET /apis/user/roles/can-manage-garages');
  await testAPI('/apis/user/roles/can-manage-garages');
  
  // Test 4: Get dual role users
  console.log('\n4. Testing GET /apis/user/roles/dual-role');
  await testAPI('/apis/user/roles/dual-role');
  
  // Test 5: Validate role combination
  console.log('\n5. Testing POST /apis/user/roles/validate');
  await testAPI('/apis/user/roles/validate', 'POST', {
    roles: ['USER', 'GARAGE']
  });
  
  // Test 6: Get role hierarchy
  console.log('\n6. Testing GET /apis/user/roles/hierarchy/GARAGE');
  await testAPI('/apis/user/roles/hierarchy/GARAGE');
  
  console.log('\n🎉 All tests completed!');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests();
}

module.exports = { testAPI, runTests };
