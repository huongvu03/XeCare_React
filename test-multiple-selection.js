// Test script for multiple selection functionality
const API_BASE_URL = 'http://localhost:8080';

async function testMultipleSelection() {
  console.log('🧪 Testing Multiple Selection API...\n');

  try {
    // Test 1: Search with multiple services
    console.log('📋 Test 1: Multiple Services');
    const servicesParams = new URLSearchParams();
    servicesParams.append('service', 'Sửa chữa');
    servicesParams.append('service', 'Bảo dưỡng');
    
    const servicesUrl = `${API_BASE_URL}/apis/garage/search/advanced?${servicesParams.toString()}`;
    console.log('URL:', servicesUrl);
    
    const servicesResponse = await fetch(servicesUrl);
    const servicesData = await servicesResponse.json();
    console.log('✅ Services Response:', servicesData.length, 'garages found');
    console.log('Sample garage services:', servicesData[0]?.serviceNames);
    console.log('');

    // Test 2: Search with multiple vehicle types
    console.log('🚗 Test 2: Multiple Vehicle Types');
    const vehicleParams = new URLSearchParams();
    vehicleParams.append('vehicleType', 'Xe máy');
    vehicleParams.append('vehicleType', 'Ô tô');
    
    const vehicleUrl = `${API_BASE_URL}/apis/garage/search/advanced?${vehicleParams.toString()}`;
    console.log('URL:', vehicleUrl);
    
    const vehicleResponse = await fetch(vehicleUrl);
    const vehicleData = await vehicleResponse.json();
    console.log('✅ Vehicle Types Response:', vehicleData.length, 'garages found');
    console.log('Sample garage vehicle types:', vehicleData[0]?.vehicleTypeNames);
    console.log('');

    // Test 3: Search with both multiple services and vehicle types
    console.log('🔄 Test 3: Multiple Services + Vehicle Types');
    const bothParams = new URLSearchParams();
    bothParams.append('service', 'Sửa chữa');
    bothParams.append('service', 'Bảo dưỡng');
    bothParams.append('vehicleType', 'Xe máy');
    bothParams.append('vehicleType', 'Ô tô');
    
    const bothUrl = `${API_BASE_URL}/apis/garage/search/advanced?${bothParams.toString()}`;
    console.log('URL:', bothUrl);
    
    const bothResponse = await fetch(bothUrl);
    const bothData = await bothResponse.json();
    console.log('✅ Combined Response:', bothData.length, 'garages found');
    console.log('');

    // Test 4: Search with no filters (should return all)
    console.log('🌐 Test 4: No Filters (All Garages)');
    const allUrl = `${API_BASE_URL}/apis/garage/search/advanced`;
    console.log('URL:', allUrl);
    
    const allResponse = await fetch(allUrl);
    const allData = await allResponse.json();
    console.log('✅ All Garages Response:', allData.length, 'garages found');
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMultipleSelection();

