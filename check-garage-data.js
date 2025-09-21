// Check actual garage data to understand the structure
const API_BASE_URL = 'http://localhost:8080';

async function checkGarageData() {
  console.log('🔍 Checking Garage Data Structure...\n');

  try {
    // Get all garages
    const allUrl = `${API_BASE_URL}/apis/garage/search/advanced`;
    const response = await fetch(allUrl);
    const garages = await response.json();
    
    console.log(`📊 Found ${garages.length} garages:\n`);
    
    garages.forEach((garage, index) => {
      console.log(`🏢 Garage ${index + 1}: ${garage.name}`);
      console.log(`   📍 Address: ${garage.address}`);
      console.log(`   🔧 Services: [${garage.serviceNames?.join(', ') || 'None'}]`);
      console.log(`   🚗 Vehicle Types: [${garage.vehicleTypeNames?.join(', ') || 'None'}]`);
      console.log(`   ⭐ Rating: ${garage.averageRating}`);
      console.log(`   ✅ Verified: ${garage.verified}`);
      console.log('');
    });

    // Get available services and vehicle types
    console.log('📋 Getting available options...\n');
    
    try {
      const servicesResponse = await fetch(`${API_BASE_URL}/apis/garage/options/services`);
      const services = await servicesResponse.json();
      console.log('🔧 Available Services:', services);
    } catch (e) {
      console.log('❌ Could not fetch services:', e.message);
    }
    
    try {
      const vehicleTypesResponse = await fetch(`${API_BASE_URL}/apis/garage/options/vehicle-types`);
      const vehicleTypes = await vehicleTypesResponse.json();
      console.log('🚗 Available Vehicle Types:', vehicleTypes);
    } catch (e) {
      console.log('❌ Could not fetch vehicle types:', e.message);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkGarageData();

