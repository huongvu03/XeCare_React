// Test script để kiểm tra logic merge đã cải thiện
console.log('🧪 Testing Improved Merge Logic...\n');

// Mock geocoding results
const mockGeocodingResults = {
    '1093 Ta Quang Buu': '1093 Tạ Quang Bửu, Phường Bình Đông, Ho Chi Minh City, 72400, Vietnam',
    '48 Bui Thi Xuan': 'Bùi Thị Xuân, Phường Quy Nhơn Tây, Gia Lai Province, Vietnam',
    '123 Nguyen Hue': '123 Nguyễn Huệ, Quận 1, Ho Chi Minh City, 70000, Vietnam',
    '999 Le Loi': 'Le Loi Street, Ho Chi Minh City, Vietnam', // Không có số nhà
    '456 Tran Hung Dao': '456 Tran Hung Dao Street, Ho Chi Minh City, Vietnam' // Có số nhà
};

// Improved merge logic
function mergeAddressWithHouseNumber(userInput, geocodingResult) {
    console.log('Merging addresses:', { userInput, geocodingResult });
    
    // Tìm số nhà trong input của user (số ở đầu chuỗi)
    const houseNumberMatch = userInput.match(/^(\d+[a-zA-Z]?)\s*(.+)/);
    
    if (houseNumberMatch) {
        const houseNumber = houseNumberMatch[1]; // Số nhà
        const streetName = houseNumberMatch[2].trim(); // Tên đường
        
        console.log('Found house number:', houseNumber, 'Street name:', streetName);
        
        // 🔥 IMPROVED: Luôn giữ lại số nhà của user
        // Nếu geocoding result đã có số nhà, thay thế nó bằng số nhà của user
        // Nếu chưa có, thêm vào đầu
        let mergedAddress;
        if (/^\d+[a-zA-Z]?\s/.test(geocodingResult)) {
            // Geocoding result đã có số nhà, thay thế nó
            mergedAddress = geocodingResult.replace(/^\d+[a-zA-Z]?\s*/, `${houseNumber} `);
            console.log('Replaced house number in geocoding result:', mergedAddress);
        } else {
            // Geocoding result chưa có số nhà, thêm vào đầu
            mergedAddress = `${houseNumber} ${geocodingResult}`;
            console.log('Added house number to geocoding result:', mergedAddress);
        }
        return mergedAddress;
    }
    
    // Nếu không tìm thấy số nhà, trả về geocoding result
    console.log('No house number found, using geocoding result');
    return geocodingResult;
}

// Test cases
const testCases = [
    '1093 Ta Quang Buu',
    '48 Bui Thi Xuan', 
    '123 Nguyen Hue',
    '999 Le Loi',
    '456 Tran Hung Dao'
];

testCases.forEach(userInput => {
    console.log(`\n🔍 Testing: "${userInput}"`);
    
    const geocodingResult = mockGeocodingResults[userInput];
    if (!geocodingResult) {
        console.log(`   ❌ No mock geocoding result for: "${userInput}"`);
        return;
    }
    
    console.log(`   Geocoding result: "${geocodingResult}"`);
    
    const mergedResult = mergeAddressWithHouseNumber(userInput, geocodingResult);
    console.log(`   Merged result: "${mergedResult}"`);
    
    // Check if house number is preserved
    const houseNumberMatch = userInput.match(/^(\d+[a-zA-Z]?)\s*/);
    if (houseNumberMatch) {
        const houseNumber = houseNumberMatch[1];
        const hasHouseNumber = mergedResult.startsWith(houseNumber);
        console.log(`   House number "${houseNumber}" preserved: ${hasHouseNumber ? '✅' : '❌'}`);
        
        // Check for duplicate house numbers
        const houseNumberCount = (mergedResult.match(new RegExp(`\\b${houseNumber}\\b`, 'g')) || []).length;
        if (houseNumberCount > 1) {
            console.log(`   ⚠️  WARNING: House number appears ${houseNumberCount} times (duplicate detected)`);
        } else {
            console.log(`   ✅ No duplicate house numbers`);
        }
        
        if (!hasHouseNumber) {
            console.log(`   ❌ ERROR: House number lost!`);
        } else {
            console.log(`   ✅ SUCCESS: House number preserved correctly!`);
        }
    }
});

console.log('\n✅ All tests completed!');
