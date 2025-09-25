// Simple test to check API endpoints
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

async function testAPI() {
    try {
        console.log('🧪 Testing API endpoints...');
        
        // Test health endpoint
        console.log('🏥 Testing health endpoint...');
        try {
            const healthResponse = await axios.get(`${API_BASE_URL}/apis/test/health`);
            console.log('✅ Health response:', healthResponse.data);
        } catch (error) {
            console.log('❌ Health error:', error.response?.data || error.message);
        }
        
        // Test admin services endpoint
        console.log('🔧 Testing admin services endpoint...');
        try {
            const servicesResponse = await axios.get(`${API_BASE_URL}/apis/admin/services`);
            console.log('✅ Services response:', servicesResponse.data);
        } catch (error) {
            console.log('❌ Services error:', error.response?.data || error.message);
        }
        
        // Test garage services endpoint with different IDs
        const garageIds = [1, 2, 3, 14];
        for (const garageId of garageIds) {
            console.log(`🏪 Testing garage services endpoint for garage ${garageId}...`);
            try {
                const response = await axios.get(`${API_BASE_URL}/apis/garage/management/services/${garageId}`);
                console.log(`✅ Garage ${garageId} services:`, response.data);
                break; // If successful, stop testing
            } catch (error) {
                console.log(`❌ Garage ${garageId} error:`, error.response?.status, error.response?.data || error.message);
            }
        }
        
    } catch (error) {
        console.error('❌ General error:', error.message);
    }
}

// Run test
testAPI();
