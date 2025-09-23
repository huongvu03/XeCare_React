// Test with real token from localStorage
const axios = require('axios');

const API_BASE = 'http://localhost:8080';

async function testWithRealToken() {
    console.log('🔍 Testing with real token...\n');
    
    // Get token from browser localStorage (you need to copy this manually)
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW52YW5hQGdtYWlsLmNvbSIsImlhdCI6MTczNzY0NzQ0MCwiZXhwIjoxNzM3NjUxMDQwfQ.abc123'; // Replace with real token
    
    try {
        console.log('Testing garage management services with real token...');
        const response = await axios.get(`${API_BASE}/apis/garage/management/services`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Success:', response.data);
    } catch (error) {
        console.log('❌ Failed:', error.response?.status, error.response?.data);
    }
}

testWithRealToken();
