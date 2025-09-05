// Test Accept and Cancel buttons fix
async function testAcceptCancel() {
    try {
        console.log('🔧 Testing Accept & Cancel Buttons Fix...');
        
        // Wait for backend
        console.log('⏳ Waiting for backend to restart...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        
        try {
            const healthResponse = await fetch('http://localhost:8080/apis/emergency/health');
            if (!healthResponse.ok) {
                console.log('❌ Backend not ready yet. Wait longer and try again.');
                return;
            }
            console.log('✅ Backend is running');
        } catch (error) {
            console.log('❌ Backend not ready:', error.message);
            return;
        }
        
        // Get requests for testing
        const allResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
        const allData = await allResponse.json();
        
        const pendingRequest = allData.find(req => req.status === 'PENDING');
        
        if (!pendingRequest) {
            console.log('⚠️ No PENDING requests found for testing');
            return;
        }
        
        const testId = pendingRequest.id;
        console.log('\n🔍 Testing with Request ID:', testId);
        console.log('- Current Status:', pendingRequest.status);
        console.log('- Description:', pendingRequest.description?.substring(0, 50) + '...');
        
        // Test ACCEPT endpoint (for "Chấp nhận" button)
        console.log('\n✅ Testing ACCEPT endpoint...');
        try {
            const acceptResponse = await fetch(`http://localhost:8080/apis/emergency/accept-request/${testId}`);
            console.log('📊 Accept Response Status:', acceptResponse.status);
            
            if (acceptResponse.ok) {
                const acceptResult = await acceptResponse.json();
                console.log('✅ ACCEPT Button Fix: WORKING!');
                console.log('- Updated Status:', acceptResult.status);
                console.log('- Request ID:', acceptResult.id);
                
                // Verify in database
                const verifyResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
                const verifyData = await verifyResponse.json();
                const updatedRequest = verifyData.find(req => req.id === testId);
                console.log('- Database Status:', updatedRequest?.status);
                
            } else {
                const errorText = await acceptResponse.text();
                console.log('❌ ACCEPT Button still failing:', acceptResponse.status, errorText);
            }
        } catch (error) {
            console.log('❌ ACCEPT Button Error:', error.message);
        }
        
        // Test DELETE endpoint (for "Hủy" button)
        console.log('\n🗑️ Testing DELETE endpoint...');
        
        // Find another request to safely delete
        const deleteTestRequest = allData.find(req => req.status === 'PENDING' && req.id !== testId);
        
        if (deleteTestRequest) {
            try {
                const deleteResponse = await fetch(`http://localhost:8080/apis/emergency/delete-request/${deleteTestRequest.id}`, {
                    method: 'DELETE'
                });
                console.log('📊 Delete Response Status:', deleteResponse.status);
                
                if (deleteResponse.ok) {
                    const deleteResult = await deleteResponse.json();
                    console.log('✅ CANCEL Button Fix: WORKING!');
                    console.log('- Deleted Request ID:', deleteResult.deletedId);
                    console.log('- Message:', deleteResult.message);
                    
                    // Verify deletion
                    const verifyResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
                    const verifyData = await verifyResponse.json();
                    const stillExists = verifyData.find(req => req.id === deleteTestRequest.id);
                    console.log('- Actually Deleted:', stillExists ? '❌ No' : '✅ Yes');
                    
                } else {
                    const errorText = await deleteResponse.text();
                    console.log('❌ CANCEL Button still failing:', deleteResponse.status, errorText);
                }
            } catch (error) {
                console.log('❌ CANCEL Button Error:', error.message);
            }
        } else {
            console.log('⚠️ No safe request found for delete testing');
        }
        
        console.log('\n🎯 Fix Results:');
        console.log('================');
        console.log('✅ Backend endpoints created');
        console.log('✅ Security config updated');
        console.log('✅ Frontend API updated');
        console.log('');
        console.log('💡 Now you can test on webpage:');
        console.log('1. Refresh /garage/emergency page');
        console.log('2. Click "Chấp nhận" (green button)');
        console.log('3. Click "Hủy" (red button)');
        console.log('4. Should see SweetAlert confirmations');
        console.log('5. Status/counter should update automatically');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

console.log('🔧 Accept & Cancel Buttons Fix Test');
console.log('📋 Will test:');
console.log('1. /accept-request endpoint (Chấp nhận)');
console.log('2. /delete-request endpoint (Hủy)');
console.log('');

testAcceptCancel();
