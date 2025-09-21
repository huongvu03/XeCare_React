// Test with correct service and vehicle type names from database
const API_BASE_URL = 'http://localhost:8080';

async function testWithCorrectNames() {
  console.log('🧪 Testing with Correct Names...\n');

  try {
    // Test 1: Search with correct service names
    console.log('📋 Test 1: Correct Service Names');
    const servicesParams = new URLSearchParams();
    servicesParams.append('service', 'Sửa lốp');
    servicesParams.append('service', 'Thay dầu');
    
    const servicesUrl = `${API_BASE_URL}/apis/garage/search/advanced?${servicesParams.toString()}`;
    console.log('URL:', servicesUrl);
    
    const servicesResponse = await fetch(servicesUrl);
    const servicesData = await servicesResponse.json();
    console.log('✅ Services Response:', servicesData.length, 'garages found');
    servicesData.forEach((garage, index) => {
      console.log(`   ${index + 1}. ${garage.name} - Services: [${garage.serviceNames.join(', ')}]`);
    });
    console.log('');

    // Test 2: Search with correct vehicle type names
    console.log('🚗 Test 2: Correct Vehicle Type Names');
    const vehicleParams = new URLSearchParams();
    vehicleParams.append('vehicleType', 'Xe máy số');
    vehicleParams.append('vehicleType', 'Xe tay ga');
    
    const vehicleUrl = `${API_BASE_URL}/apis/garage/search/advanced?${vehicleParams.toString()}`;
    console.log('URL:', vehicleUrl);
    
    const vehicleResponse = await fetch(vehicleUrl);
    const vehicleData = await vehicleResponse.json();
    console.log('✅ Vehicle Types Response:', vehicleData.length, 'garages found');
    vehicleData.forEach((garage, index) => {
      console.log(`   ${index + 1}. ${garage.name} - Vehicle Types: [${garage.vehicleTypeNames.join(', ')}]`);
    });
    console.log('');

    // Test 3: Search with both
    console.log('🔄 Test 3: Both Services + Vehicle Types');
    const bothParams = new URLSearchParams();
    bothParams.append('service', 'Sửa lốp');
    bothParams.append('service', 'Thay dầu');
    bothParams.append('vehicleType', 'Xe máy số');
    bothParams.append('vehicleType', 'Xe tay ga');
    
    const bothUrl = `${API_BASE_URL}/apis/garage/search/advanced?${bothParams.toString()}`;
    console.log('URL:', bothUrl);
    
    const bothResponse = await fetch(bothUrl);
    const bothData = await bothResponse.json();
    console.log('✅ Combined Response:', bothData.length, 'garages found');
    bothData.forEach((garage, index) => {
      console.log(`   ${index + 1}. ${garage.name}`);
      console.log(`      Services: [${garage.serviceNames.join(', ')}]`);
      console.log(`      Vehicle Types: [${garage.vehicleTypeNames.join(', ')}]`);
    });
    console.log('');

    // Test 4: Single service
    console.log('🔧 Test 4: Single Service');
    const singleServiceUrl = `${API_BASE_URL}/apis/garage/search/advanced?service=Sửa lốp`;
    console.log('URL:', singleServiceUrl);
    
    const singleServiceResponse = await fetch(singleServiceUrl);
    const singleServiceData = await singleServiceResponse.json();
    console.log('✅ Single Service Response:', singleServiceData.length, 'garages found');
    singleServiceData.forEach((garage, index) => {
      console.log(`   ${index + 1}. ${garage.name} - Services: [${garage.serviceNames.join(', ')}]`);
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testWithCorrectNames();

