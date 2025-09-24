// Test script để kiểm tra emergency request với nhiều user khác nhau
// Chạy script này trong browser console

console.log('🧪 Testing Emergency Requests with Multiple Users');

// Test data cho các user khác nhau
const testUsers = [
    { id: 1, email: 'user1@example.com', name: 'User 1' },
    { id: 2, email: 'user2@example.com', name: 'User 2' },
    { id: 3, email: 'user3@example.com', name: 'User 3' },
    { id: 4, email: 'garage1@example.com', name: 'Garage Owner 1' }
];

async function testEmergencyWithUser(userInfo) {
    console.log(`\n🔍 Testing with User: ${userInfo.name} (ID: ${userInfo.id})`);
    
    try {
        // 1. Kiểm tra current user
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('❌ No token found');
            return;
        }
        
        const userResponse = await fetch('http://localhost:8080/apis/emergency/current-user', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (userResponse.ok) {
            const currentUser = await userResponse.json();
            console.log('✅ Current user from API:');
            console.log('   - ID:', currentUser.id);
            console.log('   - Email:', currentUser.email);
            console.log('   - Role:', currentUser.role);
            
            // 2. Tạo emergency request
            const requestData = {
                description: `Test request from ${userInfo.name} - should have ID ${userInfo.id}`,
                latitude: 10.762622,
                longitude: 106.660172,
                garageId: 1
            };
            
            const requestResponse = await fetch('http://localhost:8080/apis/emergency/request', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            if (requestResponse.ok) {
                const emergencyRequest = await requestResponse.json();
                console.log('✅ Emergency request created:');
                console.log('   - Request ID:', emergencyRequest.id);
                console.log('   - User ID in request:', emergencyRequest.user?.id);
                console.log('   - User name in request:', emergencyRequest.user?.name);
                
                // 3. Kiểm tra trong database
                const allRequestsResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
                if (allRequestsResponse.ok) {
                    const allRequests = await allRequestsResponse.json();
                    const ourRequest = allRequests.find(req => req.id === emergencyRequest.id);
                    
                    if (ourRequest) {
                        console.log('✅ Found in database:');
                        console.log('   - Request ID:', ourRequest.id);
                        console.log('   - User ID:', ourRequest.user?.id);
                        console.log('   - User name:', ourRequest.user?.name);
                        
                        // Kiểm tra User ID
                        if (ourRequest.user?.id === currentUser.id) {
                            console.log('🎉 SUCCESS: User ID matches current user!');
                        } else {
                            console.log('❌ FAILED: User ID mismatch!');
                            console.log('   Expected:', currentUser.id, 'Got:', ourRequest.user?.id);
                        }
                    }
                }
            } else {
                console.log('❌ Failed to create emergency request:', requestResponse.status);
            }
        } else {
            console.log('❌ Failed to get current user:', userResponse.status);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

async function runAllTests() {
    console.log('🚀 Starting tests for multiple users...');
    
    // Test với user hiện tại
    const currentUserInfo = localStorage.getItem('user');
    if (currentUserInfo) {
        const user = JSON.parse(currentUserInfo);
        await testEmergencyWithUser(user);
    } else {
        console.log('❌ No user info found in localStorage');
    }
    
    console.log('\n📋 Test completed. Check results above.');
    console.log('💡 To test with different users, login with different accounts and run this script again.');
}

// Chạy test
runAllTests();
