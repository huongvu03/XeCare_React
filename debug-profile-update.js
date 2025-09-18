/**
 * Debug script để kiểm tra vấn đề update profile
 * Chạy script này trong browser console để debug
 */

console.log('🔍 Debug Profile Update...\n');

// Kiểm tra token
const token = localStorage.getItem('token');
console.log('Token:', token ? 'Có' : 'Không');
if (token) {
  console.log('Token preview:', token.substring(0, 50) + '...');
}

// Kiểm tra user data
const user = localStorage.getItem('user');
console.log('User data:', user ? 'Có' : 'Không');
if (user) {
  try {
    const userObj = JSON.parse(user);
    console.log('User info:', {
      id: userObj.id,
      name: userObj.name,
      email: userObj.email,
      role: userObj.role
    });
  } catch (e) {
    console.log('User data không hợp lệ');
  }
}

// Test API call
async function testProfileAPI() {
  console.log('\n🧪 Testing Profile API...');
  
  try {
    const response = await fetch('http://localhost:8080/apis/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Profile data:', data);
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.log('API call error:', error);
  }
}

// Test update API call
async function testUpdateAPI() {
  console.log('\n🧪 Testing Update API...');
  
  try {
    const response = await fetch('http://localhost:8080/apis/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Name',
        email: 'test@example.com'
      })
    });
    
    console.log('Update response status:', response.status);
    console.log('Update response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Update success:', data);
    } else {
      const errorText = await response.text();
      console.log('Update error response:', errorText);
    }
  } catch (error) {
    console.log('Update API call error:', error);
  }
}

// Chạy tests
testProfileAPI();
testUpdateAPI();

console.log('\n📋 Debug Checklist:');
console.log('1. Kiểm tra token có hợp lệ không');
console.log('2. Kiểm tra user data có đầy đủ không');
console.log('3. Kiểm tra API response status');
console.log('4. Kiểm tra error messages');
console.log('5. Kiểm tra network tab trong DevTools');
