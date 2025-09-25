// Test script để debug validation issue
const axios = require('axios');

async function testValidation() {
    console.log('🧪 Testing validation API...');
    
    const testAddresses = [
        '1093',
        '1093 Tạ Quang Bửu, Phường Bình Đông, Ho Chi Minh City, 72400, Vietnam',
        '1093 Tạ Quang Bửu, Chánh Hưng, Chánh Hưng Ward, Ho Chi Minh City, 72400, Vietnam',
        '999 Nguyễn Huệ, Quận 1, Ho Chi Minh City, 70000, Vietnam'
    ];
    
    for (const address of testAddresses) {
        try {
            console.log(`\n🔍 Testing: "${address}"`);
            const response = await axios.get(`http://localhost:8080/apis/garage/validation/address`, {
                params: { address }
            });
            
            const data = response.data;
            console.log(`✅ Response:`, {
                address: data.address,
                isTaken: data.isTaken,
                exactMatch: data.exactMatch,
                normalizedMatch: data.normalizedMatch,
                similarMatch: data.similarMatch,
                message: data.message
            });
            
            if (data.isTaken) {
                console.log(`❌ DUPLICATE DETECTED: ${data.message}`);
            } else {
                console.log(`✅ ADDRESS AVAILABLE: ${data.message}`);
            }
            
        } catch (error) {
            console.error(`❌ Error testing "${address}":`, error.message);
        }
    }
}

testValidation();
