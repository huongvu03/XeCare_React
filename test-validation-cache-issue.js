// Test script để kiểm tra vấn đề cache validation
const axios = require('axios');

async function testValidationCache() {
    console.log('🧪 Testing Validation Cache Issue...\n');
    
    const testAddresses = [
        '1093 Tạ Quang Bửu, Chánh Hưng, Chánh Hưng Ward, Ho Chi Minh City, 72400, Vietnam', // Database address
        '1093 Tạ Quang Bửu, Bình Đông, Bình Đông Ward, Ho Chi Minh City, 72400, Vietnam',  // Current frontend address
        '1093 Ta Quang Buu', // Short input
        '1093 Tạ Quang Bửu, Bình Đông, Bình Đông Ward, Ho Chi Minh City, 72400, Vietnam'  // Same as #2
    ];
    
    let lastValidatedAddress = '';
    
    for (let i = 0; i < testAddresses.length; i++) {
        const address = testAddresses[i];
        
        console.log(`\n🔍 Test ${i + 1}: "${address}"`);
        console.log(`   Last validated: "${lastValidatedAddress}"`);
        
        // Check if should skip validation (like frontend logic)
        if (address === lastValidatedAddress) {
            console.log(`   ⏭️ SKIPPING validation - same address already validated`);
            continue;
        }
        
        try {
            console.log(`   🔍 Calling API validation...`);
            const response = await axios.get(`http://localhost:8080/apis/garage/validation/address`, {
                params: { address }
            });
            
            const data = response.data;
            console.log(`   ✅ API Response:`, {
                address: data.address,
                isTaken: data.isTaken,
                exactMatch: data.exactMatch,
                normalizedMatch: data.normalizedMatch,
                similarMatch: data.similarMatch,
                message: data.message
            });
            
            if (data.isTaken) {
                console.log(`   ❌ DUPLICATE DETECTED: ${data.message}`);
            } else {
                console.log(`   ✅ ADDRESS AVAILABLE: ${data.message}`);
            }
            
            // Update last validated address (like frontend logic)
            lastValidatedAddress = address;
            
        } catch (error) {
            console.error(`   ❌ API Error: ${error.message}`);
        }
    }
    
    console.log('\n✅ Test completed!');
    console.log('🎯 Check if validation is being skipped incorrectly');
}

testValidationCache();
