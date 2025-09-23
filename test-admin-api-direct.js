// Test Admin API trực tiếp
// Chạy script này trong browser console hoặc Node.js

const testAdminAPI = async () => {
    console.log('🔍 Testing Admin API...');
    
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('❌ No token found in localStorage');
            console.log('👉 Please login first');
            return;
        }
        
        console.log('✅ Token found:', token.substring(0, 50) + '...');
        
        // Decode token để xem payload
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('📋 Token Payload:', payload);
            
            // Kiểm tra role
            const roles = payload.roles || payload.authorities || [];
            console.log('🔐 Roles:', roles);
            
            const hasAdmin = Array.isArray(roles) ? 
                roles.includes('ADMIN') || roles.includes('ROLE_ADMIN') :
                roles.includes('ADMIN');
            
            console.log('✅ Has ADMIN role:', hasAdmin);
            
        } catch (e) {
            console.error('❌ Error decoding token:', e.message);
        }
        
        // Test Admin API
        console.log('🔄 Testing admin API...');
        const response = await fetch('http://localhost:8080/apis/admin/garages/stats', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📊 Response Status:', response.status, response.statusText);
        console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Admin API Success:', data);
        } else {
            const errorText = await response.text();
            console.error('❌ Admin API Failed:', errorText);
        }
        
        // Test Garage Status Update
        console.log('🔄 Testing garage status update...');
        const updateResponse = await fetch('http://localhost:8080/apis/admin/garages/1/status', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'INACTIVE',
                rejectionReason: 'Test reason from script'
            })
        });
        
        console.log('📊 Update Response Status:', updateResponse.status, updateResponse.statusText);
        
        if (updateResponse.ok) {
            const updateData = await updateResponse.json();
            console.log('✅ Garage Update Success:', updateData);
        } else {
            const updateErrorText = await updateResponse.text();
            console.error('❌ Garage Update Failed:', updateErrorText);
        }
        
    } catch (error) {
        console.error('❌ Network Error:', error.message);
    }
};

// Chạy test
testAdminAPI();
