// Test script for Dual Role System APIs with authentication
const API_BASE_URL = 'http://localhost:8080';

// Test credentials (you may need to adjust these based on your database)
const TEST_CREDENTIALS = {
  email: 'admin@xecare.com',
  password: 'admin123'
};

async function login() {
  try {
    const response = await fetch(`${API_BASE_URL}/apis/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_CREDENTIALS)
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.token || data.accessToken;
    } else {
      console.log('❌ Login failed:', response.status);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return null;
  }
}

async function testAPI(endpoint, method = 'GET', body = null, token = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
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
  console.log('🧪 Testing Dual Role System APIs with Authentication...\n');
  
  // First, try to login
  console.log('🔐 Attempting to login...');
  const token = await login();
  
  if (!token) {
    console.log('⚠️  Login failed, testing without authentication...\n');
  } else {
    console.log('✅ Login successful, using authentication token\n');
  }
  
  // Test 1: Get users by role
  console.log('1. Testing GET /apis/user/roles/by-role/USER');
  await testAPI('/apis/user/roles/by-role/USER', 'GET', null, token);
  
  // Test 2: Get users who can book appointments
  console.log('\n2. Testing GET /apis/user/roles/can-book');
  await testAPI('/apis/user/roles/can-book', 'GET', null, token);
  
  // Test 3: Get users who can manage garages
  console.log('\n3. Testing GET /apis/user/roles/can-manage-garages');
  await testAPI('/apis/user/roles/can-manage-garages', 'GET', null, token);
  
  // Test 4: Get dual role users
  console.log('\n4. Testing GET /apis/user/roles/dual-role');
  await testAPI('/apis/user/roles/dual-role', 'GET', null, token);
  
  // Test 5: Validate role combination
  console.log('\n5. Testing POST /apis/user/roles/validate');
  await testAPI('/apis/user/roles/validate', 'POST', {
    roles: ['USER', 'GARAGE']
  }, token);
  
  // Test 6: Get role hierarchy
  console.log('\n6. Testing GET /apis/user/roles/hierarchy/GARAGE');
  await testAPI('/apis/user/roles/hierarchy/GARAGE', 'GET', null, token);
  
  // Test 7: Add role to user (if we have a user ID)
  console.log('\n7. Testing POST /apis/user/roles/1/add?role=GARAGE');
  await testAPI('/apis/user/roles/1/add?role=GARAGE', 'POST', null, token);
  
  console.log('\n🎉 All tests completed!');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests();
}

module.exports = { testAPI, runTests, login };
