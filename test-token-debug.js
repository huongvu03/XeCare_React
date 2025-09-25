// Test script to debug token and role issues
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

async function testTokenAndRole() {
    try {
        console.log('🔍 Testing token and role...');
        
        // Get token from localStorage (you'll need to copy this manually)
        const token = localStorage.getItem('token'); // This won't work in Node.js, just for reference
        
        if (!token) {
            console.log('❌ No token found in localStorage');
            console.log('💡 Please copy your token from browser and paste it here');
            return;
        }
        
        // Test user profile to check role
        console.log('👤 Testing user profile...');
        const profileResponse = await axios.get(`${API_BASE_URL}/apis/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Profile response:', profileResponse.data);
        console.log('👤 User role:', profileResponse.data.role);
        
        // Test garage services endpoint
        console.log('🏪 Testing garage services endpoint...');
        const servicesResponse = await axios.get(`${API_BASE_URL}/apis/garage/management/services/14`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Services response:', servicesResponse.data);
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        console.error('📊 Status:', error.response?.status);
        
        if (error.response?.status === 403) {
            console.log('🔒 Access denied - check user role');
        } else if (error.response?.status === 401) {
            console.log('🔑 Unauthorized - check token');
        }
    }
}

// Run test
testTokenAndRole();
