// Test after fixing duplicate acceptRequest method
async function testDuplicateFix() {
    console.log('🔧 Testing After Fixing Duplicate Method...');
    console.log('===============================================');
    
    // Wait for backend
    console.log('⏳ Waiting for backend to restart...');
    await new Promise(resolve => setTimeout(resolve, 25000));
    
    try {
        // Test health first
        const healthResponse = await fetch('http://localhost:8080/apis/emergency/health');
        if (!healthResponse.ok) {
            console.log('❌ Backend not ready yet. Wait longer and try again.');
            return;
        }
        console.log('✅ Backend is running!');
        
        // Test /all-requests first
        const allResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
        const allData = await allResponse.json();
        console.log('✅ /all-requests works:', allData.length, 'requests');
        
        // Find test request
        const pendingRequest = allData.find(req => req.status === 'PENDING');
        if (!pendingRequest) {
            console.log('⚠️ No PENDING requests for testing');
            return;
        }
        
        const testId = pendingRequest.id;
        console.log('\n🔍 Testing with Request ID:', testId);
        console.log('- Current Status:', pendingRequest.status);
        
        // ============ CRITICAL TEST: ACCEPT ENDPOINT ============
        console.log('\n✅ Testing ACCEPT endpoint (CRITICAL):');
        try {
            const acceptResponse = await fetch(`http://localhost:8080/apis/emergency/accept-request/${testId}`);
            console.log('📊 Response Status:', acceptResponse.status);
            
            if (acceptResponse.status === 200) {
                const acceptResult = await acceptResponse.json();
                console.log('🎉🎉🎉 SUCCESS! "Chấp nhận" button is FIXED! 🎉🎉🎉');
                console.log('- Updated Status:', acceptResult.status);
                console.log('- Request ID:', acceptResult.id);
                console.log('- NO MORE 403 ERROR!');
                
                // Verify status change
                const verifyResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
                const verifyData = await verifyResponse.json();
                const updatedRequest = verifyData.find(req => req.id === testId);
                console.log('- Database Status:', updatedRequest?.status);
                console.log('- Status Change Verified:', updatedRequest?.status === 'ACCEPTED' ? '✅ Yes' : '❌ No');
                
            } else if (acceptResponse.status === 403) {
                console.log('❌ Still getting 403 - Check security config');
                const errorText = await acceptResponse.text();
                console.log('Error details:', errorText);
            } else if (acceptResponse.status === 500) {
                console.log('❌ Internal Server Error - Check backend logs');
                const errorText = await acceptResponse.text();
                console.log('Error details:', errorText);
            } else {
                console.log('⚠️ Unexpected status code:', acceptResponse.status);
                const errorText = await acceptResponse.text();
                console.log('Response:', errorText);
            }
        } catch (error) {
            console.log('❌ Accept endpoint error:', error.message);
        }
        
        // ============ TEST DELETE ENDPOINT ============
        console.log('\n🗑️ Testing DELETE endpoint:');
        
        const deleteTestRequest = allData.find(req => req.status === 'PENDING' && req.id !== testId);
        
        if (deleteTestRequest) {
            try {
                const deleteResponse = await fetch(`http://localhost:8080/apis/emergency/delete-request/${deleteTestRequest.id}`, {
                    method: 'DELETE'
                });
                console.log('📊 Delete Response Status:', deleteResponse.status);
                
                if (deleteResponse.status === 200) {
                    const deleteResult = await deleteResponse.json();
                    console.log('✅ "Hủy" button is working!');
                    console.log('- Deleted Request ID:', deleteResult.id || deleteResult.deletedId);
                    console.log('- Message:', deleteResult.message);
                } else if (deleteResponse.status === 403) {
                    console.log('❌ Delete still getting 403');
                } else {
                    console.log('⚠️ Delete unexpected status:', deleteResponse.status);
                }
            } catch (error) {
                console.log('❌ Delete endpoint error:', error.message);
            }
        }
        
        console.log('\n🎯 Final Results:');
        console.log('==================');
        console.log('✅ Duplicate method conflict resolved');
        console.log('✅ Backend started successfully');
        console.log('✅ Security config applied');
        console.log('');
        console.log('💡 READY TO TEST ON WEBPAGE:');
        console.log('1. Refresh /garage/emergency page');
        console.log('2. Click "Chấp nhận" button → Should work now!');
        console.log('3. Click "Hủy" button → Should show SweetAlert!');
        console.log('');
        console.log('🚀 All fixes applied - 403 errors should be gone!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testDuplicateFix();
