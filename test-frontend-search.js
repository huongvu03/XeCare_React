// Test frontend search functionality by simulating the API calls
const API_BASE_URL = 'http://localhost:8080';

async function testFrontendSearch() {
  console.log('🔍 Testing Frontend Search Simulation...\n');

  try {
    // Simulate what frontend should send when user selects multiple services and vehicle types
    console.log('📋 Simulating Frontend Multiple Selection Search');
    
    // This is what the frontend should send when user selects:
    // Services: "Sửa lốp", "Thay dầu" 
    // Vehicle Types: "Xe máy số", "Xe tay ga"
    const searchParams = new URLSearchParams();
    searchParams.append('service', 'Sửa lốp');
    searchParams.append('service', 'Thay dầu');
    searchParams.append('vehicleType', 'Xe máy số');
    searchParams.append('vehicleType', 'Xe tay ga');
    
    const searchUrl = `${API_BASE_URL}/apis/garage/search/advanced?${searchParams.toString()}`;
    console.log('Frontend would call:', searchUrl);
    console.log('Query string:', searchParams.toString());
    console.log('');
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    console.log('✅ Search Results:', data.length, 'garages found');
    data.forEach((garage, index) => {
      console.log(`   ${index + 1}. ${garage.name}`);
      console.log(`      Services: [${garage.serviceNames.join(', ')}]`);
      console.log(`      Vehicle Types: [${garage.vehicleTypeNames.join(', ')}]`);
      console.log(`      Address: ${garage.address}`);
      console.log('');
    });

    // Test with empty arrays (should return all garages)
    console.log('🌐 Testing Empty Arrays (Should Return All)');
    const emptyParams = new URLSearchParams();
    emptyParams.append('service', ''); // Empty string
    emptyParams.append('vehicleType', ''); // Empty string
    
    const emptyUrl = `${API_BASE_URL}/apis/garage/search/advanced?${emptyParams.toString()}`;
    console.log('Empty params URL:', emptyUrl);
    
    const emptyResponse = await fetch(emptyUrl);
    const emptyData = await emptyResponse.json();
    console.log('✅ Empty Arrays Result:', emptyData.length, 'garages found');
    console.log('');

    // Test with no parameters (should return all garages)
    console.log('🌐 Testing No Parameters (Should Return All)');
    const noParamsUrl = `${API_BASE_URL}/apis/garage/search/advanced`;
    console.log('No params URL:', noParamsUrl);
    
    const noParamsResponse = await fetch(noParamsUrl);
    const noParamsData = await noParamsResponse.json();
    console.log('✅ No Parameters Result:', noParamsData.length, 'garages found');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFrontendSearch();

