// Test script to check create garage service API
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';
const GARAGE_ID = 14; // Replace with actual garage ID

async function testCreateService() {
    try {
        console.log('🧪 Testing create garage service API...');
        
        // Test data
        const serviceData = {
            serviceId: 1, // Replace with actual service ID
            price: 200,
            estimatedTimeMinutes: 30,
            isActive: true
        };
        
        console.log('📤 Sending request to:', `${API_BASE_URL}/apis/garage/management/services/${GARAGE_ID}`);
        console.log('📤 Request data:', serviceData);
        
        const response = await axios.post(
            `${API_BASE_URL}/apis/garage/management/services/${GARAGE_ID}`,
            serviceData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
                }
            }
        );
        
        console.log('✅ Success! Response:', response.data);
        console.log('📊 Status:', response.status);
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        console.error('📊 Status:', error.response?.status);
        console.error('📋 Headers:', error.response?.headers);
    }
}

// Run test
testCreateService();
