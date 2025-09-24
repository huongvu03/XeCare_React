// Final test script để kiểm tra User ID fix
// Chạy script này trong browser console sau khi đăng nhập với User ID = 1

console.log('🧪 Final Test: Emergency User ID Fix');

async function testEmergencyUserIDFix() {
    try {
        // 1. Kiểm tra token và user info
        console.log('\n1. Checking authentication info...');
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('user');
        
        if (token) {
            console.log('✅ Token found');
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('   - Email from token:', payload.sub);
                console.log('   - Roles from token:', payload.roles);
            } catch (e) {
                console.log('❌ Error decoding token:', e);
            }
        } else {
            console.log('❌ No token found');
            return;
        }
        
        if (userInfo) {
            const user = JSON.parse(userInfo);
            console.log('✅ User info found:');
            console.log('   - User ID:', user.id);
            console.log('   - Email:', user.email);
            console.log('   - Role:', user.role);
        }
        
        // 2. Test current user API
        console.log('\n2. Testing current user API...');
        const userResponse = await fetch('http://localhost:8080/apis/emergency/current-user', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (userResponse.ok) {
            const currentUser = await userResponse.json();
            console.log('✅ Current user API response:');
            console.log('   - User ID:', currentUser.id);
            console.log('   - Email:', currentUser.email);
            console.log('   - Role:', currentUser.role);
        } else {
            console.log('❌ Current user API failed:', userResponse.status);
        }
        
        // 3. Test emergency request creation
        console.log('\n3. Testing emergency request creation...');
        const requestData = {
            description: 'Final test - User ID should be 1',
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
            console.log('   - User ID:', emergencyRequest.user?.id);
            console.log('   - User Name:', emergencyRequest.user?.name);
            console.log('   - Description:', emergencyRequest.description);
            
            // 4. Verify in database
            console.log('\n4. Verifying in database...');
            const allRequestsResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
            
            if (allRequestsResponse.ok) {
                const allRequests = await allRequestsResponse.json();
                const ourRequest = allRequests.find(req => req.id === emergencyRequest.id);
                
                if (ourRequest) {
                    console.log('✅ Found in database:');
                    console.log('   - Request ID:', ourRequest.id);
                    console.log('   - User ID:', ourRequest.user?.id);
                    console.log('   - User Name:', ourRequest.user?.name);
                    
                    // Final check
                    if (ourRequest.user?.id === 1) {
                        console.log('🎉 SUCCESS: User ID is correct (1)!');
                        console.log('✅ The fix is working properly!');
                    } else {
                        console.log('❌ FAILED: User ID is still incorrect.');
                        console.log('   Expected: 1, Got:', ourRequest.user?.id);
                        console.log('   The fix needs more work.');
                    }
                } else {
                    console.log('❌ Request not found in database');
                }
            } else {
                console.log('❌ Failed to get all requests:', allRequestsResponse.status);
            }
            
        } else {
            console.log('❌ Failed to create emergency request:', requestResponse.status);
            const errorText = await requestResponse.text();
            console.log('   Error:', errorText);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Chạy test
testEmergencyUserIDFix();
