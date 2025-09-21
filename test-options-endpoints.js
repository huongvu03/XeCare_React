// Test the options endpoints to see what data they return
const API_BASE_URL = 'http://localhost:8080';

async function testOptionsEndpoints() {
  console.log('🔍 Testing Options Endpoints...\n');

  try {
    // Test services endpoint
    console.log('📋 Testing Services Endpoint');
    const servicesUrl = `${API_BASE_URL}/apis/garage/services/available`;
    console.log('URL:', servicesUrl);
    
    const servicesResponse = await fetch(servicesUrl);
    console.log('Status:', servicesResponse.status);
    console.log('Headers:', Object.fromEntries(servicesResponse.headers.entries()));
    
    if (servicesResponse.ok) {
      const servicesData = await servicesResponse.json();
      console.log('✅ Services Data:', servicesData);
    } else {
      const errorText = await servicesResponse.text();
      console.log('❌ Services Error:', errorText);
    }
    console.log('');

    // Test vehicle types endpoint
    console.log('🚗 Testing Vehicle Types Endpoint');
    const vehicleTypesUrl = `${API_BASE_URL}/apis/garage/vehicle-types/available`;
    console.log('URL:', vehicleTypesUrl);
    
    const vehicleTypesResponse = await fetch(vehicleTypesUrl);
    console.log('Status:', vehicleTypesResponse.status);
    console.log('Headers:', Object.fromEntries(vehicleTypesResponse.headers.entries()));
    
    if (vehicleTypesResponse.ok) {
      const vehicleTypesData = await vehicleTypesResponse.json();
      console.log('✅ Vehicle Types Data:', vehicleTypesData);
    } else {
      const errorText = await vehicleTypesResponse.text();
      console.log('❌ Vehicle Types Error:', errorText);
    }
    console.log('');

    // Test stats endpoint
    console.log('📊 Testing Stats Endpoint');
    const statsUrl = `${API_BASE_URL}/apis/garage/stats`;
    console.log('URL:', statsUrl);
    
    const statsResponse = await fetch(statsUrl);
    console.log('Status:', statsResponse.status);
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Stats Data:', statsData);
    } else {
      const errorText = await statsResponse.text();
      console.log('❌ Stats Error:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testOptionsEndpoints();

