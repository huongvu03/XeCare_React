// Test script để kiểm tra endpoint /apis/emergency/my-requests
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testMyRequests() {
    try {
        console.log('🧪 Testing /apis/emergency/my-requests endpoint...');
        
        // Test với token (nếu có)
        const token = localStorage.getItem('token') || 'test-token';
        
        const response = await axios.get(`${BASE_URL}/apis/emergency/my-requests`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Response status:', response.status);
        console.log('✅ Response data:', JSON.stringify(response.data, null, 2));
        
        if (Array.isArray(response.data)) {
            console.log(`📋 Found ${response.data.length} emergency requests`);
            
            if (response.data.length > 0) {
                const latest = response.data[0];
                console.log('📋 Latest request:');
                console.log('   - ID:', latest.id);
                console.log('   - Description:', latest.description);
                console.log('   - Status:', latest.status);
                console.log('   - Created:', latest.createdAt);
            }
        }
        
    } catch (error) {
        console.log('❌ Error testing my-requests endpoint:');
        console.log('   - Status:', error.response?.status);
        console.log('   - Message:', error.response?.data?.message || error.message);
        console.log('   - Data:', error.response?.data);
    }
}

// Chạy test
testMyRequests();
