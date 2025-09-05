// Test emergency detail page API calls
async function testDetailPageAPI() {
    try {
        console.log('🧪 Testing Emergency Detail Page API...');
        
        // First, get list of available IDs
        const allResponse = await fetch('http://localhost:8080/apis/emergency/all-requests');
        const allData = await allResponse.json();
        
        if (allData.length > 0) {
            const testId = allData[0].id;
            console.log('📋 Testing with ID:', testId);
            
            // Test getRequestById
            console.log('\n🔍 Testing getRequestById...');
            const detailResponse = await fetch(`http://localhost:8080/apis/emergency/requests/${testId}`);
            console.log('- Status:', detailResponse.status);
            
            if (detailResponse.ok) {
                const detailData = await detailResponse.json();
                console.log('- Detail data loaded successfully');
                console.log('- ID:', detailData.id);
                console.log('- Description:', detailData.description?.substring(0, 50) + '...');
                console.log('- Status:', detailData.status);
                console.log('- User:', detailData.user?.name || 'NULL');
                console.log('- Garage:', detailData.garage?.name || 'NULL');
                
                // Test quotes
                console.log('\n💰 Testing getQuotes...');
                const quotesResponse = await fetch(`http://localhost:8080/apis/emergency/quotes/${testId}`);
                console.log('- Quotes status:', quotesResponse.status);
                
                if (quotesResponse.ok) {
                    const quotesData = await quotesResponse.json();
                    console.log('- Quotes count:', quotesData.length);
                } else {
                    console.log('- No quotes found (normal for most requests)');
                }
                
                console.log('\n✅ Detail page APIs working!');
                
            } else {
                console.log('❌ Detail API failed with status:', detailResponse.status);
            }
            
        } else {
            console.log('❌ No emergency requests found in database');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testDetailPageAPI();
