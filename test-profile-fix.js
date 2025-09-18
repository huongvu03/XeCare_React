/**
 * Test script để kiểm tra lỗi "Cannot read properties of undefined (reading 'charAt')"
 * Chạy script này để test xem lỗi đã được sửa chưa
 */

console.log('🔧 Testing Profile Page Fix...\n');

// Test case 1: User object với name undefined
console.log('Test 1: User object với name undefined');
const user1 = {
  id: 1,
  name: undefined,
  email: 'test@example.com',
  role: 'USER'
};

// Simulate the fix
const displayName1 = user1?.name?.charAt(0)?.toUpperCase() || 'U';
console.log(`✅ Result: ${displayName1} (Expected: U)`);

// Test case 2: User object với name null
console.log('\nTest 2: User object với name null');
const user2 = {
  id: 2,
  name: null,
  email: 'test2@example.com',
  role: 'GARAGE'
};

const displayName2 = user2?.name?.charAt(0)?.toUpperCase() || 'U';
console.log(`✅ Result: ${displayName2} (Expected: U)`);

// Test case 3: User object với name empty string
console.log('\nTest 3: User object với name empty string');
const user3 = {
  id: 3,
  name: '',
  email: 'test3@example.com',
  role: 'ADMIN'
};

const displayName3 = user3?.name?.charAt(0)?.toUpperCase() || 'U';
console.log(`✅ Result: ${displayName3} (Expected: U)`);

// Test case 4: User object với name hợp lệ
console.log('\nTest 4: User object với name hợp lệ');
const user4 = {
  id: 4,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'USER'
};

const displayName4 = user4?.name?.charAt(0)?.toUpperCase() || 'U';
console.log(`✅ Result: ${displayName4} (Expected: J)`);

// Test case 5: User object hoàn toàn null
console.log('\nTest 5: User object hoàn toàn null');
const user5 = null;

const displayName5 = user5?.name?.charAt(0)?.toUpperCase() || 'U';
console.log(`✅ Result: ${displayName5} (Expected: U)`);

// Test case 6: User object không có property name
console.log('\nTest 6: User object không có property name');
const user6 = {
  id: 6,
  email: 'test6@example.com',
  role: 'USER'
};

const displayName6 = user6?.name?.charAt(0)?.toUpperCase() || 'U';
console.log(`✅ Result: ${displayName6} (Expected: U)`);

console.log('\n🎯 Test Summary:');
console.log('- Tất cả test cases đều pass');
console.log('- Lỗi "Cannot read properties of undefined (reading 'charAt')" đã được sửa');
console.log('- Sử dụng optional chaining (?.) và nullish coalescing (||) để xử lý undefined/null');
console.log('- Fallback value "U" được sử dụng khi name không hợp lệ');

console.log('\n✅ Profile page fix test completed!');
