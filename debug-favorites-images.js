/**
 * Script debug hình ảnh trong favorites
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function debugFavoritesImages() {
  console.log('🔍 Debugging Favorites Images...\n');

  // Thay đổi thông tin này theo user thật của bạn
  const testUser = {
    email: 'your-email@example.com',  // Thay bằng email thật
    password: 'your-password'         // Thay bằng password thật
  };

  try {
    // 1. Đăng nhập
    console.log('📝 1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/apis/v1/login`, testUser);
    
    if (!loginResponse.data.token) {
      console.error('❌ Login failed');
      return;
    }
    
    const token = loginResponse.data.token;
    const loggedInUserId = loginResponse.data.id;
    console.log(`✅ Login successful - User ID: ${loggedInUserId}`);
    
    // 2. Lấy danh sách favorites
    console.log('\n📝 2. Getting favorites...');
    const favoritesResponse = await axios.get(`${BASE_URL}/apis/favorites`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const favorites = favoritesResponse.data;
    console.log(`📊 Found ${favorites.length} favorites`);
    
    if (favorites.length === 0) {
      console.log('⚠️ No favorites found');
      return;
    }
    
    // 3. Phân tích từng favorite
    console.log('\n📝 3. Analyzing favorites...');
    favorites.forEach((favorite, index) => {
      console.log(`\n  ${index + 1}. Garage: ${favorite.garageName}`);
      console.log(`     - ID: ${favorite.id}`);
      console.log(`     - Garage ID: ${favorite.garageId}`);
      console.log(`     - Image URL: ${favorite.garageImageUrl || 'NULL'}`);
      console.log(`     - Address: ${favorite.garageAddress}`);
      console.log(`     - Phone: ${favorite.garagePhone || 'NULL'}`);
      console.log(`     - Email: ${favorite.garageEmail || 'NULL'}`);
      console.log(`     - Status: ${favorite.garageStatus}`);
      console.log(`     - Verified: ${favorite.garageIsVerified}`);
      
      // Kiểm tra hình ảnh
      if (favorite.garageImageUrl) {
        console.log(`     ✅ Has image URL: ${favorite.garageImageUrl}`);
        
        // Kiểm tra xem URL có đầy đủ không
        if (favorite.garageImageUrl.startsWith('http')) {
          console.log(`     ✅ Full URL (starts with http)`);
        } else {
          console.log(`     ⚠️ Relative URL - needs base URL`);
          console.log(`     💡 Should be: ${BASE_URL}${favorite.garageImageUrl}`);
        }
      } else {
        console.log(`     ❌ No image URL`);
      }
    });
    
    // 4. Test truy cập hình ảnh
    console.log('\n📝 4. Testing image access...');
    for (const favorite of favorites) {
      if (favorite.garageImageUrl) {
        console.log(`\n   Testing image for: ${favorite.garageName}`);
        
        let imageUrl = favorite.garageImageUrl;
        
        // Nếu là relative URL, thêm base URL
        if (!imageUrl.startsWith('http')) {
          imageUrl = `${BASE_URL}${imageUrl}`;
          console.log(`   Full URL: ${imageUrl}`);
        }
        
        try {
          const imageResponse = await axios.head(imageUrl, { timeout: 5000 });
          console.log(`   ✅ Image accessible - Status: ${imageResponse.status}`);
        } catch (error) {
          console.log(`   ❌ Image not accessible - ${error.response?.status || error.message}`);
        }
      }
    }
    
    // 5. Kiểm tra backend endpoint
    console.log('\n📝 5. Checking backend endpoint...');
    try {
      const backendResponse = await axios.get(`${BASE_URL}/apis/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Backend endpoint working');
      console.log('📊 Response structure:');
      console.log(JSON.stringify(backendResponse.data[0], null, 2));
      
    } catch (error) {
      console.error('❌ Backend endpoint error:', error.response?.status, error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Debug completed!');
  console.log('\n💡 Common issues and solutions:');
  console.log('   1. Image URL is relative - need to add base URL');
  console.log('   2. Image URL is null/empty - backend not returning image data');
  console.log('   3. Image file does not exist - file path incorrect');
  console.log('   4. CORS issues - image server not allowing cross-origin requests');
}

// Chạy debug
debugFavoritesImages();
