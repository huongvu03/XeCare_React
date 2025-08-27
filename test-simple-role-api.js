// Simple test for Dual Role System APIs
const API_BASE_URL = 'http://localhost:8080';

async function testRoleAPI() {
  console.log('🧪 Testing Dual Role System APIs (Simple)...\n');
  
  const endpoints = [
    '/apis/user/roles/by-role/USER',
    '/apis/user/roles/can-book',
    '/apis/user/roles/can-manage-garages',
    '/apis/user/roles/dual-role',
    '/apis/user/roles/hierarchy/GARAGE'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const text = await response.text();
        console.log(`Response length: ${text.length} characters`);
        console.log(`First 200 chars: ${text.substring(0, 200)}...`);
      } else {
        console.log(`Error: ${response.statusText}`);
      }
      console.log('---\n');
    } catch (error) {
      console.log(`Error: ${error.message}\n`);
    }
  }
  
  // Test POST endpoint
  try {
    console.log('Testing POST /apis/user/roles/validate');
    const response = await fetch(`${API_BASE_URL}/apis/user/roles/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roles: ['USER', 'GARAGE']
      })
    });
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const text = await response.text();
      console.log(`Response: ${text}`);
    } else {
      console.log(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

testRoleAPI();
