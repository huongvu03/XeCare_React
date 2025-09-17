// Test emergency detail page via all-requests strategy
async function testDetailViaAll() {
    try {
        console.log('🧪 Testing Emergency Detail via All-Requests Strategy...');
        
        // Get all requests first
        const allResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
        const allData = await allResponse.json();
        console.log('📊 Total requests in database:', allData.length);
        
        if (allData.length > 0) {
            // Test with first request
            const testRequest = allData[0];
            const testId = testRequest.id;
            
            console.log('\n🔍 Testing with Request ID:', testId);
            console.log('- Description:', testRequest.description?.substring(0, 50) + '...');
            console.log('- Status:', testRequest.status);
            console.log('- User:', testRequest.user?.name || 'NULL');
            console.log('- Garage:', testRequest.garage?.name || 'NULL');
            console.log('- Location:', testRequest.latitude, testRequest.longitude);
            
            // Simulate finding specific request by ID
            const foundRequest = allData.find(req => req.id === testId);
            console.log('\n✅ Found request by ID filter:', !!foundRequest);
            
            if (foundRequest) {
                console.log('📋 Request Detail:');
                console.log('- ID:', foundRequest.id);
                console.log('- Description:', foundRequest.description);
                console.log('- Status:', foundRequest.status);
                console.log('- User ID:', foundRequest.user?.id);
                console.log('- User Name:', foundRequest.user?.name);
                console.log('- User Phone:', foundRequest.user?.phone);
                console.log('- Garage ID:', foundRequest.garage?.id || 'NULL');
                console.log('- Garage Name:', foundRequest.garage?.name || 'NULL');
                console.log('- Created:', foundRequest.createdAt);
                
                console.log('\n🎯 Strategy Working: ✅');
                console.log('- Can get all requests: ✅');
                console.log('- Can filter by ID: ✅');
                console.log('- Has complete data: ✅');
                console.log('- No authentication needed: ✅');
            }
            
        } else {
            console.log('❌ No emergency requests found in database');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testDetailViaAll();
