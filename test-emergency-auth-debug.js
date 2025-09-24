// Debug script để kiểm tra authentication cho emergency requests
// Chạy script này trong browser console sau khi đăng nhập với user ID = 1

console.log('🔍 Debug: Emergency Request Authentication');

async function debugEmergencyAuth() {
    try {
        // 1. Kiểm tra token và user info
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('user');
        
        if (!token || !userInfo) {
            console.log('❌ No token or user info found. Please login first.');
            return;
        }
        
        const user = JSON.parse(userInfo);
        console.log('👤 Current logged-in user:');
        console.log('   - ID:', user.id);
        console.log('   - Email:', user.email);
        console.log('   - Role:', user.role);
        
        // 2. Decode JWT token
        console.log('\n🔍 JWT Token Analysis:');
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('   - Subject (email):', payload.sub);
            console.log('   - Roles:', payload.roles);
            console.log('   - Issued at:', new Date(payload.iat * 1000));
            console.log('   - Expires at:', new Date(payload.exp * 1000));
        } catch (e) {
            console.log('❌ Error decoding token:', e);
        }
        
        // 3. Test current user API
        console.log('\n🔍 Testing current user API...');
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
            
            // 4. Test emergency request creation
            console.log('\n🚨 Testing emergency request creation...');
            const requestData = {
                description: `Debug test - User ID should be ${currentUser.id}`,
                latitude: 10.762622,
                longitude: 106.660172,
                garageId: 1
            };
            
            console.log('📤 Sending request with data:', requestData);
            console.log('📤 Authorization header:', `Bearer ${token.substring(0, 50)}...`);
            
            const requestResponse = await fetch('http://localhost:8080/apis/emergency/request', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            console.log('📡 Response status:', requestResponse.status);
            console.log('📡 Response headers:', Object.fromEntries(requestResponse.headers.entries()));
            
            if (requestResponse.ok) {
                const emergencyRequest = await requestResponse.json();
                console.log('✅ Emergency request created:');
                console.log('   - Request ID:', emergencyRequest.id);
                console.log('   - User ID:', emergencyRequest.user?.id);
                console.log('   - User name:', emergencyRequest.user?.name);
                console.log('   - Description:', emergencyRequest.description);
                
                // 5. Kiểm tra kết quả
                if (emergencyRequest.user?.id === currentUser.id) {
                    console.log('🎉 SUCCESS: User ID is correct!');
                    console.log('✅ Authentication is working properly!');
                } else {
                    console.log('❌ FAILED: User ID mismatch!');
                    console.log('   Expected:', currentUser.id, 'Got:', emergencyRequest.user?.id);
                    console.log('   This indicates authentication is not working properly.');
                }
            } else {
                console.log('❌ Failed to create emergency request:', requestResponse.status);
                const errorText = await requestResponse.text();
                console.log('   Error:', errorText);
            }
        } else {
            console.log('❌ Failed to get current user:', userResponse.status);
            const errorText = await userResponse.text();
            console.log('   Error:', errorText);
        }
        
    } catch (error) {
        console.error('❌ Debug failed:', error);
    }
}

// Chạy debug
debugEmergencyAuth();
