// Test script để kiểm tra public garage API
const axios = require('axios');

async function testPublicGarageAPI() {
  console.log('🔍 Testing Public Garage API...\n');

  try {
    // Test 1: Kiểm tra garage nearby API (public endpoint)
    console.log('1️⃣ Testing /apis/garage/nearby (public endpoint)...');
    
    const latitude = 10.7769; // HCM coordinates
    const longitude = 106.7009;
    const radius = 15;

    const response = await axios.get('http://localhost:8080/apis/garage/nearby', {
      params: { latitude, longitude, radius },
      timeout: 10000
    });

    console.log(`✅ Success! Found ${response.data.length} garages`);
    
    if (response.data.length > 0) {
      console.log('\n📋 Sample Garage Data:');
      const sampleGarage = response.data[0];
      console.log('   ID:', sampleGarage.id);
      console.log('   Name:', sampleGarage.name);
      console.log('   Address:', sampleGarage.address);
      console.log('   Phone:', sampleGarage.phone);
      console.log('   Distance:', sampleGarage.distance, 'km');
      console.log('   Services:', sampleGarage.services?.length || 0, 'services');
      
      if (sampleGarage.services && sampleGarage.services.length > 0) {
        console.log('   Service Names:', sampleGarage.services.map(s => s.serviceName).join(', '));
      }
    }

    // Test 2: Kiểm tra garage có dịch vụ cứu hộ
    console.log('\n2️⃣ Checking for Emergency Services...');
    const emergencyGarages = response.data.filter(garage => 
      garage.services?.some(service => 
        service.serviceName.toLowerCase().includes('cứu hộ') || 
        service.serviceName.toLowerCase().includes('emergency') ||
        service.serviceName.toLowerCase().includes('rescue')
      )
    );

    console.log(`✅ Found ${emergencyGarages.length} garages with emergency services`);
    
    if (emergencyGarages.length > 0) {
      console.log('\n🚨 Emergency Garages:');
      emergencyGarages.forEach((garage, index) => {
        console.log(`${index + 1}. ${garage.name} (${garage.distance?.toFixed(2)}km)`);
        const emergencyServices = garage.services.filter(s => 
          s.serviceName.toLowerCase().includes('cứu hộ') || 
          s.serviceName.toLowerCase().includes('emergency') ||
          s.serviceName.toLowerCase().includes('rescue')
        );
        emergencyServices.forEach(service => {
          console.log(`   - ${service.serviceName}: ${service.basePrice?.toLocaleString()}đ`);
        });
      });
    } else {
      console.log('⚠️ No garages with emergency services found');
      console.log('💡 This might be normal if no garages offer emergency services');
    }

    console.log('\n✅ Public Garage API Test Completed Successfully!');
    console.log('🎯 Component should now work with real data');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.status, error.response?.statusText);
    console.error('Error details:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      console.log('\n💡 403 Error suggests the endpoint might require authentication');
      console.log('🔧 Check SecurityConfiguration.java for permitAll() settings');
    }
  }
}

testPublicGarageAPI().catch(console.error);
