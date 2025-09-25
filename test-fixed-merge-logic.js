// Test script để kiểm tra logic merge đã sửa
console.log('🧪 Testing Fixed Merge Logic...\n');

// Mock geocoding results
const mockGeocodingResults = {
    '1093 Ta Quang Buu': '1093 Tạ Quang Bửu, Phường Bình Đông, Ho Chi Minh City, 72400, Vietnam',
    '48 Bui Thi Xuan': 'Bùi Thị Xuân, Phường Quy Nhơn Tây, Gia Lai Province, Vietnam',
    '123 Nguyen Hue': '123 Nguyễn Huệ, Quận 1, Ho Chi Minh City, 70000, Vietnam'
};

// Fixed merge logic
function mergeAddressWithHouseNumber(userInput, geocodingResult) {
    console.log('Merging addresses:', { userInput, geocodingResult });
    
    // Tìm số nhà trong input của user (số ở đầu chuỗi)
    const houseNumberMatch = userInput.match(/^(\d+[a-zA-Z]?)\s*(.+)/);
    
    if (houseNumberMatch) {
        const houseNumber = houseNumberMatch[1]; // Số nhà
        const streetName = houseNumberMatch[2].trim(); // Tên đường
        
        console.log('Found house number:', houseNumber, 'Street name:', streetName);
        
        // 🔥 FIXED: Luôn thêm số nhà vào đầu geocoding result
        const mergedAddress = `${houseNumber} ${geocodingResult}`;
        console.log('Merged address (always preserve house number):', mergedAddress);
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
    
    const geocodingResult = mockGeocodingResults[userInput] || `${userInput} Street, Ho Chi Minh City, Vietnam`;
    console.log(`   Geocoding result: "${geocodingResult}"`);
    
    const mergedResult = mergeAddressWithHouseNumber(userInput, geocodingResult);
    console.log(`   Merged result: "${mergedResult}"`);
    
    // Check if house number is preserved
    const houseNumberMatch = userInput.match(/^(\d+[a-zA-Z]?)\s*/);
    if (houseNumberMatch) {
        const houseNumber = houseNumberMatch[1];
        const hasHouseNumber = mergedResult.startsWith(houseNumber);
        console.log(`   House number "${houseNumber}" preserved: ${hasHouseNumber ? '✅' : '❌'}`);
        
        if (!hasHouseNumber) {
            console.log(`   ❌ ERROR: House number lost!`);
        } else {
            console.log(`   ✅ SUCCESS: House number preserved!`);
        }
    }
});

console.log('\n✅ All tests completed!');
