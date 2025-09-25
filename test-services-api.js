// Test script to check services API
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

async function testServicesAPI() {
    try {
        console.log('🧪 Testing services API...');
        
        const response = await axios.get(`${API_BASE_URL}/apis/garage/management/services/14`);
        
        console.log('✅ Status:', response.status);
        console.log('📊 Services data:');
        console.log(JSON.stringify(response.data, null, 2));
        
        if (Array.isArray(response.data)) {
            console.log(`📋 Found ${response.data.length} services:`);
            response.data.forEach((service, index) => {
                console.log(`${index + 1}. ${service.serviceName} - $${service.price} - ${service.estimatedTimeMinutes}min - ${service.isActive ? 'Active' : 'Inactive'}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        console.error('📊 Status:', error.response?.status);
    }
}

// Run test
testServicesAPI();
