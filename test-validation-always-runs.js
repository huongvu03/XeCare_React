// Test script để kiểm tra validation luôn chạy
console.log('🧪 Testing Validation Always Runs Logic...\n');

// Simulate the new logic
function simulateAddressInput(address) {
    console.log(`\n📝 User input: "${address}"`);
    
    // Check if should geocode
    const shouldGeocode = address.length < 50;
    
    if (shouldGeocode) {
        console.log(`🗺️ Would trigger geocoding for: "${address}"`);
        
        // Simulate geocoding failure
        console.log(`❌ Geocoding failed: Cannot find coordinates for "${address}"`);
    } else {
        console.log(`⏭️ Would skip geocoding - address seems complete: "${address}"`);
    }
    
    // 🔥 NEW LOGIC: Always validate regardless of geocoding result
    console.log(`🔍 ALWAYS validating address: "${address}"`);
    
    // Simulate validation
    if (address.includes('1093 Tạ Quang Bửu, Chánh Hưng')) {
        console.log(`❌ Validation result: DUPLICATE DETECTED!`);
        console.log(`   Message: "Địa chỉ này đã được sử dụng bởi một garage khác"`);
        return { isTaken: true, message: 'Địa chỉ này đã được sử dụng bởi một garage khác' };
    } else {
        console.log(`✅ Validation result: AVAILABLE`);
        console.log(`   Message: "Địa chỉ có thể sử dụng"`);
        return { isTaken: false, message: 'Địa chỉ có thể sử dụng' };
    }
}

// Test cases
const testCases = [
    '1093', // Short input - should geocode
    '1093 Tạ Quang Bửu, Chánh Hưng, Chánh Hưng Ward, Ho Chi Minh City, 72400, Vietnam', // Full input - should skip geocoding but validate
    '48 Bui Thi Xuan', // Short input - should geocode
    '48 Bùi Thị Xuân, Phường Quy Nhơn Tây, Gia Lai Province, Vietnam' // Full input - should skip geocoding but validate
];

testCases.forEach(address => {
    const result = simulateAddressInput(address);
    
    if (result.isTaken) {
        console.log(`🚫 FINAL RESULT: DUPLICATE DETECTED - "${result.message}"`);
    } else {
        console.log(`✅ FINAL RESULT: ADDRESS AVAILABLE - "${result.message}"`);
    }
});

console.log('\n✅ Test completed!');
console.log('🎯 Key point: Validation now runs regardless of geocoding success/failure');
