/**
 * Script test và fix hình ảnh trong favorites
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testFavoritesImages() {
  console.log('🧪 Testing Favorites Images...\n');

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
      console.log('\n💡 To test images, you need to:');
      console.log('   1. Add some garages to favorites first');
      console.log('   2. Make sure garages have images');
      console.log('   3. Check if backend is returning image URLs');
      return;
    }
    
    // 3. Test hình ảnh
    console.log('\n📝 3. Testing images...');
    let workingImages = 0;
    let brokenImages = 0;
    let noImages = 0;
    
    for (const favorite of favorites) {
      console.log(`\n   Testing: ${favorite.garageName}`);
      console.log(`   - Garage ID: ${favorite.garageId}`);
      console.log(`   - Image URL: ${favorite.garageImageUrl || 'NULL'}`);
      
      if (!favorite.garageImageUrl) {
        console.log('   ❌ No image URL');
        noImages++;
        continue;
      }
      
      // Test image URL
      let imageUrl = favorite.garageImageUrl;
      
      // If it's a relative URL, add base URL
      if (!imageUrl.startsWith('http')) {
        imageUrl = `${BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        console.log(`   - Full URL: ${imageUrl}`);
      }
      
      try {
        const imageResponse = await axios.head(imageUrl, { timeout: 5000 });
        console.log(`   ✅ Image accessible - Status: ${imageResponse.status}`);
        workingImages++;
      } catch (error) {
        console.log(`   ❌ Image not accessible - ${error.response?.status || error.message}`);
        brokenImages++;
      }
    }
    
    // 4. Tổng kết
    console.log('\n📊 Results Summary:');
    console.log(`   - Total favorites: ${favorites.length}`);
    console.log(`   - Working images: ${workingImages}`);
    console.log(`   - Broken images: ${brokenImages}`);
    console.log(`   - No images: ${noImages}`);
    
    // 5. Đề xuất giải pháp
    console.log('\n💡 Solutions:');
    
    if (noImages > 0) {
      console.log('\n🔧 For favorites without images:');
      console.log('   1. Check if garages have images in database');
      console.log('   2. Update garage records with image URLs');
      console.log('   3. Upload images to server');
    }
    
    if (brokenImages > 0) {
      console.log('\n🔧 For broken images:');
      console.log('   1. Check if image files exist on server');
      console.log('   2. Verify image URLs in database');
      console.log('   3. Check server file permissions');
      console.log('   4. Ensure CORS is configured for images');
    }
    
    if (workingImages > 0) {
      console.log('\n✅ Working images should display correctly in frontend');
    }
    
    // 6. Test frontend image handling
    console.log('\n📝 4. Frontend Image Handling:');
    console.log('   - Frontend now handles relative URLs by adding base URL');
    console.log('   - Fallback images shown when main image fails to load');
    console.log('   - Console logs show image load success/failure');
    console.log('   - Error handling prevents broken images from breaking UI');
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Test completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Check browser console for image load logs');
  console.log('   2. Verify images display in favorites page');
  console.log('   3. Test fallback images when main images fail');
  console.log('   4. Check network tab for image requests');
}

// Chạy test
testFavoritesImages();
