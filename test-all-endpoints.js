// Test all emergency endpoints fix
async function testAllEndpoints() {
    try {
        console.log('🔧 Testing All Emergency Endpoints Fix...');
        
        // Wait for backend
        console.log('⏳ Waiting for backend to restart...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        
        try {
            const healthResponse = await fetch('http://localhost:8080/apis/emergency/health');
            if (!healthResponse.ok) {
                console.log('❌ Backend not ready yet. Please wait longer and try again.');
                return;
            }
            console.log('✅ Backend is running');
        } catch (error) {
            console.log('❌ Backend not ready:', error.message);
            return;
        }
        
        // Test all-requests endpoint (should work)
        console.log('\n📊 Testing /all-requests endpoint...');
        try {
            const allResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
            const allData = await allResponse.json();
            console.log('✅ /all-requests working:', allData.length, 'requests found');
            
            const pendingRequest = allData.find(req => req.status === 'PENDING');
            const quotedRequest = allData.find(req => req.status === 'QUOTED');
            
            if (!pendingRequest) {
                console.log('⚠️ No PENDING requests found for testing');
                return;
            }
            
            const testId = pendingRequest.id;
            console.log('- Test Request ID:', testId);
            console.log('- Status:', pendingRequest.status);
            
            // Test accept-request endpoint (for "Chấp nhận" button)
            console.log('\n✅ Testing /accept-request endpoint...');
            try {
                const acceptResponse = await fetch(`http://localhost:8080/apis/emergency/accept-request/${testId}`);
                console.log('📊 Accept Response Status:', acceptResponse.status);
                
                if (acceptResponse.ok) {
                    const acceptResult = await acceptResponse.json();
                    console.log('✅ Accept Request Working!');
                    console.log('- Updated Status:', acceptResult.status);
                } else {
                    const errorText = await acceptResponse.text();
                    console.log('❌ Accept Request Failed:', acceptResponse.status, errorText);
                }
            } catch (error) {
                console.log('❌ Accept Request Error:', error.message);
            }
            
            // Test update-status endpoint (for other status updates)
            console.log('\n🔄 Testing /update-status endpoint...');
            try {
                const updateResponse = await fetch(`http://localhost:8080/apis/emergency/update-status/${testId}?status=PENDING`, {
                    method: 'PUT'
                });
                console.log('📊 Update Status Response:', updateResponse.status);
                
                if (updateResponse.ok) {
                    const updateResult = await updateResponse.json();
                    console.log('✅ Update Status Working!');
                    console.log('- Updated Status:', updateResult.status);
                } else {
                    const errorText = await updateResponse.text();
                    console.log('❌ Update Status Failed:', updateResponse.status, errorText);
                }
            } catch (error) {
                console.log('❌ Update Status Error:', error.message);
            }
            
            // Test delete-request endpoint (for "Hủy" button)
            console.log('\n🗑️ Testing /delete-request endpoint...');
            
            // Find a request we can safely delete
            const deleteTestRequest = allData.find(req => req.status === 'PENDING' && req.id !== testId);
            
            if (deleteTestRequest) {
                try {
                    const deleteResponse = await fetch(`http://localhost:8080/apis/emergency/delete-request/${deleteTestRequest.id}`, {
                        method: 'DELETE'
                    });
                    console.log('📊 Delete Response Status:', deleteResponse.status);
                    
                    if (deleteResponse.ok) {
                        console.log('✅ Delete Request Working!');
                        console.log('- Deleted Request ID:', deleteTestRequest.id);
                    } else {
                        const errorText = await deleteResponse.text();
                        console.log('❌ Delete Request Failed:', deleteResponse.status, errorText);
                    }
                } catch (error) {
                    console.log('❌ Delete Request Error:', error.message);
                }
            } else {
                console.log('⚠️ No safe request found for delete testing');
            }
            
            // Test create-quote endpoint (for "Báo giá" button) 
            console.log('\n💰 Testing /create-quote endpoint...');
            
            const quoteData = {
                emergencyRequestId: testId,
                price: 500000,
                message: "Dịch vụ test báo giá - kiểm tra endpoint"
            };
            
            try {
                const quoteResponse = await fetch('http://localhost:8080/apis/emergency/create-quote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(quoteData)
                });
                
                console.log('📊 Quote Response Status:', quoteResponse.status);
                
                if (quoteResponse.ok) {
                    const quoteResult = await quoteResponse.json();
                    console.log('✅ Create Quote Working!');
                    console.log('- Quote ID:', quoteResult.id);
                    console.log('- Price:', quoteResult.price?.toLocaleString('vi-VN'), 'VNĐ');
                } else {
                    const errorText = await quoteResponse.text();
                    console.log('❌ Create Quote Failed:', quoteResponse.status, errorText);
                }
            } catch (error) {
                console.log('❌ Create Quote Error:', error.message);
            }
            
            console.log('\n🎯 Summary of Endpoint Tests:');
            console.log('=====================================');
            console.log('✅ /all-requests - Working (data loads)');
            console.log('? /accept-request - Check status above');
            console.log('? /update-status - Check status above');
            console.log('? /delete-request - Check status above'); 
            console.log('? /create-quote - Check status above');
            console.log('');
            console.log('💡 Frontend Actions Should Now Work:');
            console.log('1. "Chấp nhận" button (uses accept-request)');
            console.log('2. "Hủy" button (uses delete-request)');
            console.log('3. "Báo giá" button (uses create-quote)');
            console.log('4. Page loads data (uses all-requests)');
            
        } catch (error) {
            console.error('❌ Error testing all-requests:', error.message);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Instructions
console.log('🔧 All Emergency Endpoints Test');
console.log('📋 This will test:');
console.log('1. /all-requests (data loading)');
console.log('2. /accept-request (Chấp nhận button)');
console.log('3. /update-status (other status changes)');
console.log('4. /delete-request (Hủy button)');
console.log('5. /create-quote (Báo giá button)');
console.log('');

testAllEndpoints();
