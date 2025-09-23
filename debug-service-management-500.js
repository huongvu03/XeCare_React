// Debug Service Management 500 Error
const axios = require('axios');

const API_BASE = 'http://localhost:8080';

// Test endpoints
async function testEndpoints() {
    console.log('🔍 Testing Service Management Endpoints...\n');
    
    // Test 1: Simple test endpoint
    try {
        console.log('1. Testing simple test endpoint...');
        const response = await axios.get(`${API_BASE}/apis/garage-services/simple-test`);
        console.log('✅ Simple test success:', response.data);
    } catch (error) {
        console.log('❌ Simple test failed:', error.response?.status, error.response?.data);
    }
    
    // Test 2: Test JSON endpoint
    try {
        console.log('\n2. Testing JSON test endpoint...');
        const response = await axios.get(`${API_BASE}/apis/garage-services/test-json`);
        console.log('✅ JSON test success:', response.data);
    } catch (error) {
        console.log('❌ JSON test failed:', error.response?.status, error.response?.data);
    }
    
    // Test 3: Test auth endpoint (without token)
    try {
        console.log('\n3. Testing auth endpoint (no token)...');
        const response = await axios.get(`${API_BASE}/apis/garage-services/test-auth`);
        console.log('✅ Auth test success:', response.data);
    } catch (error) {
        console.log('❌ Auth test failed:', error.response?.status, error.response?.data);
    }
    
    // Test 4: Test garage management services endpoint (without token)
    try {
        console.log('\n4. Testing garage management services endpoint (no token)...');
        const response = await axios.get(`${API_BASE}/apis/garage/management/services`);
        console.log('✅ Garage services success:', response.data);
    } catch (error) {
        console.log('❌ Garage services failed:', error.response?.status, error.response?.data);
    }
    
    // Test 5: Test admin services endpoint (without token)
    try {
        console.log('\n5. Testing admin services endpoint (no token)...');
        const response = await axios.get(`${API_BASE}/apis/admin/services`);
        console.log('✅ Admin services success:', response.data);
    } catch (error) {
        console.log('❌ Admin services failed:', error.response?.status, error.response?.data);
    }
    
    // Test 6: Test garage services stats endpoint (without token)
    try {
        console.log('\n6. Testing garage services stats endpoint (no token)...');
        const response = await axios.get(`${API_BASE}/apis/garage/management/services/stats`);
        console.log('✅ Garage stats success:', response.data);
    } catch (error) {
        console.log('❌ Garage stats failed:', error.response?.status, error.response?.data);
    }
    
    console.log('\n🔍 Testing with mock token...');
    
    // Test with mock token
    const mockToken = 'mock-token-for-testing';
    
    // Test 7: Test garage management services with token
    try {
        console.log('\n7. Testing garage management services with token...');
        const response = await axios.get(`${API_BASE}/apis/garage/management/services`, {
            headers: {
                'Authorization': `Bearer ${mockToken}`
            }
        });
        console.log('✅ Garage services with token success:', response.data);
    } catch (error) {
        console.log('❌ Garage services with token failed:', error.response?.status, error.response?.data);
    }
    
    // Test 8: Test garage services stats with token
    try {
        console.log('\n8. Testing garage services stats with token...');
        const response = await axios.get(`${API_BASE}/apis/garage/management/services/stats`, {
            headers: {
                'Authorization': `Bearer ${mockToken}`
            }
        });
        console.log('✅ Garage stats with token success:', response.data);
    } catch (error) {
        console.log('❌ Garage stats with token failed:', error.response?.status, error.response?.data);
    }
    
    console.log('\n🏁 Testing completed!');
}

// Run tests
testEndpoints().catch(console.error);
