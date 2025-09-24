// Debug script để kiểm tra User ID trong emergency requests
// Chạy script này trong browser console sau khi đăng nhập

console.log('🔍 Debugging Emergency User ID Issue...');

// 1. Kiểm tra token trong localStorage
console.log('\n1. Checking localStorage token:');
const token = localStorage.getItem('token');
if (token) {
    console.log('✅ Token found:', token.substring(0, 50) + '...');
    
    // Decode JWT token (chỉ phần payload)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('📋 Token payload:', payload);
        console.log('   - Subject (email):', payload.sub);
        console.log('   - Issued at:', new Date(payload.iat * 1000));
        console.log('   - Expires at:', new Date(payload.exp * 1000));
        console.log('   - Roles:', payload.roles);
    } catch (error) {
        console.log('❌ Error decoding token:', error);
    }
} else {
    console.log('❌ No token found in localStorage');
}

// 2. Kiểm tra user info trong localStorage
console.log('\n2. Checking localStorage user info:');
const userInfo = localStorage.getItem('user');
if (userInfo) {
    try {
        const user = JSON.parse(userInfo);
        console.log('✅ User info found:', user);
        console.log('   - User ID:', user.id);
        console.log('   - Email:', user.email);
        console.log('   - Role:', user.role);
    } catch (error) {
        console.log('❌ Error parsing user info:', error);
    }
} else {
    console.log('❌ No user info found in localStorage');
}

// 3. Test API call để kiểm tra current user
console.log('\n3. Testing current user API:');
fetch('http://localhost:8080/apis/emergency/current-user', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log('📡 Current user API response status:', response.status);
    return response.json();
})
.then(data => {
    console.log('✅ Current user API response:', data);
    console.log('   - User ID from API:', data.id);
    console.log('   - Email from API:', data.email);
    console.log('   - Role from API:', data.role);
})
.catch(error => {
    console.log('❌ Current user API error:', error);
});

// 4. Test tạo emergency request
console.log('\n4. Testing emergency request creation:');
const testRequestData = {
    description: 'Debug test request - should have correct user ID',
    latitude: 10.762622,
    longitude: 106.660172,
    garageId: 1
};

fetch('http://localhost:8080/apis/emergency/request', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(testRequestData)
})
.then(response => {
    console.log('📡 Emergency request API response status:', response.status);
    return response.json();
})
.then(data => {
    console.log('✅ Emergency request created:', data);
    console.log('   - Request ID:', data.id);
    console.log('   - User ID in request:', data.user?.id);
    console.log('   - User name in request:', data.user?.name);
    console.log('   - Description:', data.description);
    
    // Kiểm tra User ID
    if (data.user?.id === 1) {
        console.log('🎉 SUCCESS: User ID is correct (1)!');
    } else {
        console.log('❌ FAILED: User ID is incorrect. Expected: 1, Got:', data.user?.id);
    }
})
.catch(error => {
    console.log('❌ Emergency request API error:', error);
});

console.log('\n🔍 Debug completed. Check the results above.');
