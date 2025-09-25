// Test script to check frontend API call
const axios = require('axios');

async function testFrontendAPI() {
    try {
        console.log('🧪 Testing frontend API call...');
        
        // Simulate the frontend API call
        const response = await axios.get('http://localhost:8080/apis/garage/management/services/14');
        
        console.log('✅ Status:', response.status);
        console.log('📊 Response data:');
        console.log(JSON.stringify(response.data, null, 2));
        
        if (Array.isArray(response.data)) {
            console.log(`📋 Found ${response.data.length} services`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        console.error('📊 Status:', error.response?.status);
        console.error('📋 Headers:', error.response?.headers);
    }
}

// Run test
testFrontendAPI();
