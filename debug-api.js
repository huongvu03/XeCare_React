// Debug script for API testing
const API_BASE_URL = 'http://localhost:8080';

async function testSimpleAPI() {
  console.log('🔍 Testing simple API endpoints...\n');
  
  // Test 1: Basic connectivity
  try {
    const response = await fetch(`${API_BASE_URL}/apis/test/hello`);
    console.log('✅ Test endpoint status:', response.status);
    if (response.ok) {
      const data = await response.text();
      console.log('✅ Test endpoint response:', data);
    }
  } catch (error) {
    console.log('❌ Test endpoint error:', error.message);
  }
  
  // Test 2: User roles API
  try {
    const response = await fetch(`${API_BASE_URL}/apis/user/roles/by-role/USER`);
    console.log('\n✅ User roles API status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ User roles API response:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ User roles API error response:', errorText);
    }
  } catch (error) {
    console.log('❌ User roles API error:', error.message);
  }
  
  // Test 3: Check if backend is responding
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    console.log('\n✅ Root endpoint status:', response.status);
  } catch (error) {
    console.log('❌ Root endpoint error:', error.message);
  }
}

testSimpleAPI();
