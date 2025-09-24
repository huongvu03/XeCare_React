// Debug script for 403 error in garage appointments
const axios = require('axios');

async function debug403Error() {
    console.log('🔍 Debugging 403 error in garage appointments...\n');
    
    // Check if we have token and user data
    console.log('1. Checking authentication data...');
    
    // Simulate browser environment
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MUBnYXJhZ2UuY29tIiwiaWF0IjoxNzM2NzQ5Njg3LCJleHAiOjE3MzY3NTMyODd9.9KzGzKzGzKzGzKzGzKzGzKzGzKzGzKzGzKzGzKzGz'; // This would be from localStorage
    const userData = {
        id: 2,
        email: "test1@garage.com",
        name: "Test Garage Owner",
        role: "GARAGE",
        garages: [
            {
                id: 1,
                name: "Test Garage",
                address: "123 Test Street",
                phone: "0123456789",
                email: "test1@garage.com",
                description: "Test garage description",
                imageUrl: "",
                status: "ACTIVE",
                isVerified: true,
                createdAt: "2024-01-01T00:00:00"
            }
        ]
    };
    
    console.log('Token exists:', !!token);
    console.log('User data:', JSON.stringify(userData, null, 2));
    
    // Test the API call that's failing
    console.log('\n2. Testing garage appointments API call...');
    
    try {
        const response = await axios.get('http://localhost:8080/apis/user/appointments/garage/1', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                page: 0,
                size: 100
            }
        });
        
        console.log('✅ API call successful!');
        console.log('Response status:', response.status);
        console.log('Appointments count:', response.data.content?.length || 0);
        
    } catch (error) {
        console.log('❌ API call failed!');
        console.log('Status:', error.response?.status);
        console.log('Status Text:', error.response?.statusText);
        console.log('Error message:', error.response?.data?.message || error.message);
        
        if (error.response?.status === 403) {
            console.log('\n🚨 403 Forbidden Error Analysis:');
            console.log('- User role:', userData.role);
            console.log('- User ID:', userData.id);
            console.log('- Garage ID being accessed:', 1);
            console.log('- User owns garage:', userData.garages?.some(g => g.id === 1));
            
            console.log('\nPossible causes:');
            console.log('1. User is not the owner of garage ID 1');
            console.log('2. Token is invalid or expired');
            console.log('3. Backend authorization logic has a bug');
            console.log('4. User role is not properly set');
        }
    }
    
    // Test user profile endpoint to verify token
    console.log('\n3. Testing user profile endpoint...');
    try {
        const profileResponse = await axios.get('http://localhost:8080/apis/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ Profile API call successful!');
        console.log('Profile data:', JSON.stringify(profileResponse.data, null, 2));
        
    } catch (error) {
        console.log('❌ Profile API call failed!');
        console.log('Status:', error.response?.status);
        console.log('Error:', error.response?.data?.message || error.message);
    }
}

debug403Error().catch(console.error);
