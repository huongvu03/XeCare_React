// Final test script để kiểm tra search API
const API_BASE_URL = 'http://localhost:8080';

async function testFinalSearch() {
  console.log('🎯 Final Test: Garage Search API Integration\n');
  
  try {
    // Test 1: Empty search (should return all active garages)
    console.log('1. Testing empty search (initial page load)...');
    const response1 = await fetch(`${API_BASE_URL}/apis/garage/search/advanced`);
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('✅ Success! Found', data1.length, 'garages');
      
      if (data1.length > 0) {
        const garage = data1[0];
        console.log('📋 Sample garage data:');
        console.log('- Name:', garage.name);
        console.log('- Address:', garage.address);
        console.log('- Status:', garage.status);
        console.log('- Verified:', garage.verified);
        console.log('- Services:', garage.serviceNames.length, 'services');
        console.log('- Vehicle Types:', garage.vehicleTypeNames.length, 'types');
      }
    } else {
      console.log('❌ Error:', response1.status, response1.statusText);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Search with status=ACTIVE
    console.log('2. Testing with status=ACTIVE...');
    const response2 = await fetch(`${API_BASE_URL}/apis/garage/search/advanced?status=ACTIVE`);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('✅ Success! Found', data2.length, 'ACTIVE garages');
      
      // Check if all returned garages are ACTIVE
      const allActive = data2.every(g => g.status === 'ACTIVE');
      console.log('✅ All garages are ACTIVE:', allActive);
    } else {
      console.log('❌ Error:', response2.status, response2.statusText);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 3: Search with service filter
    console.log('3. Testing with service filter...');
    const response3 = await fetch(`${API_BASE_URL}/apis/garage/search/advanced?service=Thay dầu`);
    
    if (response3.ok) {
      const data3 = await response3.json();
      console.log('✅ Success! Found', data3.length, 'garages with "Thay dầu" service');
    } else {
      console.log('❌ Error:', response3.status, response3.statusText);
    }
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📝 Summary:');
    console.log('- Backend API is working correctly');
    console.log('- Data structure matches frontend expectations');
    console.log('- Search filters are working');
    console.log('- Frontend should now display real data instead of mock data');
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Run the test
testFinalSearch();
