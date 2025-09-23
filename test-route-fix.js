/**
 * Test script để kiểm tra tính năng hành trình đã được sửa
 * Chạy: node test-route-fix.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080/apis/emergency';

async function testRouteFeature() {
    console.log('🚀 Testing Route Feature Fix...\n');

    try {
        // 1. Lấy tất cả emergency requests
        console.log('📡 Step 1: Getting all emergency requests...');
        const allRequestsResponse = await axios.get(`${BASE_URL}/all-requests`);
        const requests = allRequestsResponse.data;
        
        if (requests.length === 0) {
            console.log('❌ No emergency requests found. Please create some requests first.');
            return;
        }

        console.log(`✅ Found ${requests.length} emergency requests`);

        // 2. Tìm request có garage
        let testRequest = null;
        for (const request of requests) {
            if (request.garage) {
                testRequest = request;
                break;
            }
        }

        if (!testRequest) {
            console.log('❌ No emergency requests with garage found.');
            return;
        }

        console.log(`✅ Testing with request ID: ${testRequest.id}`);
        console.log(`📍 Emergency location: ${testRequest.latitude}, ${testRequest.longitude}`);
        
        // 3. Kiểm tra thông tin garage
        if (testRequest.garage) {
            console.log(`🏢 Garage: ${testRequest.garage.name}`);
            console.log(`📞 Phone: ${testRequest.garage.phone}`);
            console.log(`📍 Address: ${testRequest.garage.address}`);
            
            // Kiểm tra tọa độ garage
            if (testRequest.garage.latitude && testRequest.garage.longitude) {
                console.log(`✅ Garage coordinates: ${testRequest.garage.latitude}, ${testRequest.garage.longitude}`);
                
                // 4. Tính khoảng cách (Haversine formula)
                const distance = calculateDistance(
                    testRequest.garage.latitude, testRequest.garage.longitude,
                    testRequest.latitude, testRequest.longitude
                );
                
                const estimatedTime = Math.round((distance / 30) * 60); // 30km/h average
                
                console.log(`\n🎯 Route Calculation Results:`);
                console.log(`📏 Distance: ${distance.toFixed(1)} km`);
                console.log(`⏱️ Estimated time: ${estimatedTime} minutes`);
                
                // 5. Tạo Google Maps URL
                const mapsUrl = `https://www.google.com/maps/dir/${testRequest.garage.latitude},${testRequest.garage.longitude}/${testRequest.latitude},${testRequest.longitude}`;
                console.log(`🗺️ Google Maps URL: ${mapsUrl}`);
                
            } else {
                console.log(`⚠️ Garage coordinates not available, using address instead`);
                
                // Sử dụng địa chỉ thay vì tọa độ
                const mapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(testRequest.garage.address)}/${testRequest.latitude},${testRequest.longitude}`;
                console.log(`🗺️ Google Maps URL (address): ${mapsUrl}`);
            }
        }

        // 6. Test frontend URL
        const frontendUrl = `http://localhost:3000/emergency/${testRequest.id}`;
        console.log(`\n🌐 Frontend URL: ${frontendUrl}`);
        console.log(`💡 Open this URL to test the route feature in the browser`);

        console.log('\n✅ Route feature test completed successfully!');

    } catch (error) {
        console.error('❌ Error testing route feature:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Hàm tính khoảng cách giữa hai điểm (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Chạy test
testRouteFeature();
