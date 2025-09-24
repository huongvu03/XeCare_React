// Test script để kiểm tra User ID trong emergency requests
// Chạy script này sau khi đã đăng nhập với User ID = 1

const API_BASE_URL = 'http://localhost:8080';

async function testEmergencyUserID() {
    console.log('🧪 Testing Emergency User ID Fix...');
    
    try {
        // 1. Kiểm tra current user info
        console.log('\n1. Checking current user info...');
        const userResponse = await fetch(`${API_BASE_URL}/apis/emergency/current-user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (userResponse.ok) {
            const userInfo = await userResponse.json();
            console.log('✅ Current user info:', userInfo);
            console.log('   - User ID:', userInfo.id);
            console.log('   - Email:', userInfo.email);
            console.log('   - Role:', userInfo.role);
        } else {
            console.log('❌ Failed to get current user info:', userResponse.status);
        }
        
        // 2. Tạo emergency request
        console.log('\n2. Creating emergency request...');
        const emergencyData = {
            description: 'Test emergency request - User ID should be 1',
            latitude: 10.762622,
            longitude: 106.660172,
            garageId: 1
        };
        
        const emergencyResponse = await fetch(`${API_BASE_URL}/apis/emergency/request`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emergencyData)
        });
        
        if (emergencyResponse.ok) {
            const emergencyRequest = await emergencyResponse.json();
            console.log('✅ Emergency request created:', emergencyRequest);
            console.log('   - Request ID:', emergencyRequest.id);
            console.log('   - User ID:', emergencyRequest.user?.id);
            console.log('   - User Name:', emergencyRequest.user?.name);
            console.log('   - Description:', emergencyRequest.description);
            
            // 3. Kiểm tra request trong database
            console.log('\n3. Checking request in database...');
            const allRequestsResponse = await fetch(`${API_BASE_URL}/apis/emergency/all-requests`);
            
            if (allRequestsResponse.ok) {
                const allRequests = await allRequestsResponse.json();
                const ourRequest = allRequests.find(req => req.id === emergencyRequest.id);
                
                if (ourRequest) {
                    console.log('✅ Found our request in database:');
                    console.log('   - Request ID:', ourRequest.id);
                    console.log('   - User ID:', ourRequest.user?.id);
                    console.log('   - User Name:', ourRequest.user?.name);
                    console.log('   - Description:', ourRequest.description);
                    
                    // Kiểm tra User ID
                    if (ourRequest.user?.id === 1) {
                        console.log('🎉 SUCCESS: User ID is correct (1)!');
                    } else {
                        console.log('❌ FAILED: User ID is incorrect. Expected: 1, Got:', ourRequest.user?.id);
                    }
                } else {
                    console.log('❌ Could not find our request in database');
                }
            } else {
                console.log('❌ Failed to get all requests:', allRequestsResponse.status);
            }
            
        } else {
            console.log('❌ Failed to create emergency request:', emergencyResponse.status);
            const errorText = await emergencyResponse.text();
            console.log('   Error:', errorText);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Chạy test
testEmergencyUserID();
