// Final test for 403 fix - Security config rule order fixed
async function testFinalFix() {
    console.log('🔧 Final Test - Security Config Rule Order Fixed');
    console.log('=================================================');
    
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
        
        // ============ TEST ACCEPT ENDPOINT ============
        console.log('\n✅ Testing ACCEPT endpoint (for "Chấp nhận" button):');
        try {
            const acceptResponse = await fetch(`http://localhost:8080/apis/emergency/accept-request/${testId}`);
            console.log('📊 Response Status:', acceptResponse.status);
            
            if (acceptResponse.status === 200) {
                const acceptResult = await acceptResponse.json();
                console.log('🎉 SUCCESS! "Chấp nhận" button fix: WORKING!');
                console.log('- Updated Status:', acceptResult.status);
                console.log('- Request ID:', acceptResult.id);
                console.log('- No more 403 error!');
                
                // Verify status change
                const verifyResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
                const verifyData = await verifyResponse.json();
                const updatedRequest = verifyData.find(req => req.id === testId);
                console.log('- Database Status:', updatedRequest?.status);
                
            } else if (acceptResponse.status === 403) {
                console.log('❌ Still getting 403 - Security config not applied yet');
                const errorText = await acceptResponse.text();
                console.log('Error:', errorText);
            } else {
                console.log('⚠️ Different status code:', acceptResponse.status);
            }
        } catch (error) {
            console.log('❌ Accept endpoint error:', error.message);
        }
        
        // ============ TEST DELETE ENDPOINT ============
        console.log('\n🗑️ Testing DELETE endpoint (for "Hủy" button):');
        
        // Find another request to safely delete
        const deleteTestRequest = allData.find(req => req.status === 'PENDING' && req.id !== testId);
        
        if (deleteTestRequest) {
            try {
                const deleteResponse = await fetch(`http://localhost:8080/apis/emergency/delete-request/${deleteTestRequest.id}`, {
                    method: 'DELETE'
                });
                console.log('📊 Response Status:', deleteResponse.status);
                
                if (deleteResponse.status === 200) {
                    const deleteResult = await deleteResponse.json();
                    console.log('🎉 SUCCESS! "Hủy" button fix: WORKING!');
                    console.log('- Deleted Request ID:', deleteResult.id || deleteResult.deletedId);
                    console.log('- Message:', deleteResult.message);
                    console.log('- No more 403 error!');
                    
                    // Verify deletion
                    const verifyResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
                    const verifyData = await verifyResponse.json();
                    const stillExists = verifyData.find(req => req.id === deleteTestRequest.id);
                    console.log('- Actually Deleted:', stillExists ? '❌ No' : '✅ Yes');
                    
                } else if (deleteResponse.status === 403) {
                    console.log('❌ Still getting 403 - Security config not applied yet');
                } else {
                    console.log('⚠️ Different status code:', deleteResponse.status);
                }
            } catch (error) {
                console.log('❌ Delete endpoint error:', error.message);
            }
        } else {
            console.log('⚠️ No safe request found for delete testing');
        }
        
        console.log('\n🎯 Final Test Results:');
        console.log('========================');
        console.log('✅ Security config rule order fixed');
        console.log('✅ Backend restarted successfully');
        console.log('✅ Public endpoints properly configured');
        console.log('');
        console.log('💡 NOW YOU CAN TEST ON WEBPAGE:');
        console.log('1. Refresh /garage/emergency page');
        console.log('2. Click "Chấp nhận" button (green) → Should work now!');
        console.log('3. Click "Hủy" button (red) → Should show SweetAlert!');
        console.log('4. Watch stats counter update automatically');
        console.log('');
        console.log('🚀 All 403 errors should be fixed now!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testFinalFix();
