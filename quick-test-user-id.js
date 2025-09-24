// Quick test script để kiểm tra User ID fix
// Chạy script này trong browser console

console.log('🚀 Quick Test: Emergency User ID Fix');

async function quickTest() {
    try {
        // 1. Kiểm tra user hiện tại
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
        
        // 2. Test current user API
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
            
            // 3. Tạo emergency request
            console.log('\n🚨 Creating emergency request...');
            const requestData = {
                description: `Quick test - User ID should be ${currentUser.id}`,
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
                console.log('   - User name:', emergencyRequest.user?.name);
                
                // 4. Kiểm tra kết quả
                if (emergencyRequest.user?.id === currentUser.id) {
                    console.log('🎉 SUCCESS: User ID is correct!');
                    console.log('✅ The fix is working properly!');
                } else {
                    console.log('❌ FAILED: User ID mismatch!');
                    console.log('   Expected:', currentUser.id, 'Got:', emergencyRequest.user?.id);
                }
            } else {
                console.log('❌ Failed to create emergency request:', requestResponse.status);
                const errorText = await requestResponse.text();
                console.log('   Error:', errorText);
            }
        } else {
            console.log('❌ Failed to get current user:', userResponse.status);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Chạy test
quickTest();
