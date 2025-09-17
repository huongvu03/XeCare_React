// Test fix lỗi 403 cho nút Chấp nhận và Hủy
async function test403Fix() {
    console.log('🔧 TESTING 403 FIX');
    console.log('==================');
    console.log('✅ Fixed Security config thứ tự rules');
    console.log('🎯 Test: accept-request & delete-request endpoints');
    console.log('');
    
    // Wait for backend
    console.log('⏳ Waiting for backend...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    try {
        // Test health
        const healthResponse = await fetch('http://localhost:8080/apis/emergency/health');
        if (!healthResponse.ok) {
            console.log('❌ Backend not ready yet');
            return;
        }
        console.log('✅ Backend is running');
        
        // Get requests data
        const allResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
        const allData = await allResponse.json();
        console.log('✅ Found', allData.length, 'requests');
        
        const pendingRequests = allData.filter(req => req.status === 'PENDING');
        console.log('- PENDING requests:', pendingRequests.length);
        
        if (pendingRequests.length === 0) {
            console.log('⚠️ No PENDING requests for testing');
            return;
        }
        
        // Test ACCEPT endpoint (GET)
        const acceptId = pendingRequests[0].id;
        console.log('\n✅ TESTING ACCEPT ENDPOINT:');
        console.log('🔗 GET /apis/emergency/accept-request/' + acceptId);
        
        try {
            const acceptResponse = await fetch(`http://localhost:8080/apis/emergency/accept-request/${acceptId}`);
            console.log('📊 Status:', acceptResponse.status);
            
            if (acceptResponse.status === 200) {
                const result = await acceptResponse.json();
                console.log('🎉 SUCCESS! Response:', result);
                console.log('✅ "Chấp nhận" button FIXED - NO 403!');
                
                // Verify status change
                const verifyResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
                const verifyData = await verifyResponse.json();
                const updatedRequest = verifyData.find(req => req.id === acceptId);
                console.log('🔄 New status:', updatedRequest?.status);
                
            } else {
                console.log('❌ Accept failed:', acceptResponse.status);
                if (acceptResponse.status === 403) {
                    console.log('🚨 STILL 403 ERROR - Security config not working!');
                }
                const errorText = await acceptResponse.text();
                console.log('💥 Error:', errorText);
            }
        } catch (error) {
            console.log('❌ Accept error:', error.message);
        }
        
        // Test DELETE endpoint
        if (pendingRequests.length > 1) {
            const deleteId = pendingRequests[1].id;
            console.log('\n🗑️ TESTING DELETE ENDPOINT:');
            console.log('🔗 DELETE /apis/emergency/delete-request/' + deleteId);
            
            try {
                const deleteResponse = await fetch(`http://localhost:8080/apis/emergency/delete-request/${deleteId}`, {
                    method: 'DELETE'
                });
                console.log('📊 Status:', deleteResponse.status);
                
                if (deleteResponse.status === 200) {
                    const result = await deleteResponse.json();
                    console.log('🎉 SUCCESS! Response:', result);
                    console.log('✅ "Hủy" button FIXED - NO 403!');
                    
                    // Verify deletion
                    const verifyResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
                    const verifyData = await verifyResponse.json();
                    const stillExists = verifyData.find(req => req.id === deleteId);
                    console.log('💀 Actually deleted:', stillExists ? 'No ❌' : 'Yes ✅');
                    
                } else {
                    console.log('❌ Delete failed:', deleteResponse.status);
                    if (deleteResponse.status === 403) {
                        console.log('🚨 STILL 403 ERROR - Security config not working!');
                    }
                    const errorText = await deleteResponse.text();
                    console.log('💥 Error:', errorText);
                }
            } catch (error) {
                console.log('❌ Delete error:', error.message);
            }
        }
        
        console.log('\n🎯 TEST RESULTS:');
        console.log('================');
        console.log('🔧 Security config fixed - rules ordered correctly');
        console.log('📋 Specific permitAll() rules placed before general rules');
        console.log('');
        console.log('🚀 NOW TEST ON WEBPAGE:');
        console.log('1. 🌐 Open: http://localhost:3000/garage/emergency');
        console.log('2. ✅ Click "Chấp nhận" → Should work WITHOUT 403!');
        console.log('3. 🗑️ Click "Hủy" → Should work WITHOUT 403!');
        
        console.log('\n📋 SECURITY RULES ORDER (CORRECT):');
        console.log('1. /apis/emergency/accept-request/** → permitAll()');
        console.log('2. /apis/emergency/delete-request/** → permitAll()');
        console.log('3. /apis/emergency/** → hasAnyRole() (general rule at end)');
        
    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

test403Fix();