/**
 * Script kiểm tra backend có trả về đầy đủ thông tin hình ảnh không
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function checkBackendImages() {
  console.log('🔍 Checking Backend Images...\n');

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
    
    // 2. Kiểm tra endpoint favorites
    console.log('\n📝 2. Checking favorites endpoint...');
    try {
      const favoritesResponse = await axios.get(`${BASE_URL}/apis/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Favorites endpoint working');
      console.log(`📊 Response status: ${favoritesResponse.status}`);
      console.log(`📊 Response data length: ${favoritesResponse.data.length}`);
      
      if (favoritesResponse.data.length > 0) {
        console.log('\n📋 Sample favorite data:');
        const sample = favoritesResponse.data[0];
        console.log(JSON.stringify(sample, null, 2));
        
        // Kiểm tra các trường quan trọng
        console.log('\n🔍 Field analysis:');
        console.log(`   - garageImageUrl: ${sample.garageImageUrl || 'NULL'}`);
        console.log(`   - garageName: ${sample.garageName || 'NULL'}`);
        console.log(`   - garageAddress: ${sample.garageAddress || 'NULL'}`);
        console.log(`   - garagePhone: ${sample.garagePhone || 'NULL'}`);
        console.log(`   - garageEmail: ${sample.garageEmail || 'NULL'}`);
        console.log(`   - garageStatus: ${sample.garageStatus || 'NULL'}`);
        console.log(`   - garageIsVerified: ${sample.garageIsVerified}`);
        
        if (sample.garageImageUrl) {
          console.log(`   ✅ Has image URL: ${sample.garageImageUrl}`);
        } else {
          console.log(`   ❌ Missing image URL`);
        }
      }
      
    } catch (error) {
      console.error('❌ Favorites endpoint error:', error.response?.status, error.response?.data);
    }
    
    // 3. Kiểm tra endpoint garages (nếu có)
    console.log('\n📝 3. Checking garages endpoint...');
    try {
      const garagesResponse = await axios.get(`${BASE_URL}/apis/garages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Garages endpoint working');
      console.log(`📊 Response status: ${garagesResponse.status}`);
      console.log(`📊 Response data length: ${garagesResponse.data.length}`);
      
      if (garagesResponse.data.length > 0) {
        console.log('\n📋 Sample garage data:');
        const sample = garagesResponse.data[0];
        console.log(JSON.stringify(sample, null, 2));
        
        // Kiểm tra image URL trong garage data
        console.log('\n🔍 Garage image analysis:');
        console.log(`   - imageUrl: ${sample.imageUrl || 'NULL'}`);
        console.log(`   - image: ${sample.image || 'NULL'}`);
        console.log(`   - logo: ${sample.logo || 'NULL'}`);
        console.log(`   - photo: ${sample.photo || 'NULL'}`);
        
        // Tìm tất cả các trường có thể chứa image
        const imageFields = Object.keys(sample).filter(key => 
          key.toLowerCase().includes('image') || 
          key.toLowerCase().includes('photo') || 
          key.toLowerCase().includes('logo') ||
          key.toLowerCase().includes('picture')
        );
        
        console.log(`   - Image-related fields: ${imageFields.join(', ') || 'None found'}`);
      }
      
    } catch (error) {
      console.log('⚠️ Garages endpoint not available or error:', error.response?.status, error.response?.data);
    }
    
    // 4. Kiểm tra endpoint uploads/images
    console.log('\n📝 4. Checking uploads/images endpoint...');
    try {
      const uploadsResponse = await axios.get(`${BASE_URL}/uploads/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Uploads endpoint working');
      console.log(`📊 Response status: ${uploadsResponse.status}`);
      
    } catch (error) {
      console.log('⚠️ Uploads endpoint not available or error:', error.response?.status, error.response?.data);
    }
    
    // 5. Test image access
    console.log('\n📝 5. Testing image access...');
    const testImageUrls = [
      '/uploads/garages/',
      '/uploads/images/',
      '/static/images/',
      '/images/',
      '/uploads/'
    ];
    
    for (const testUrl of testImageUrls) {
      try {
        const fullUrl = `${BASE_URL}${testUrl}`;
        const response = await axios.head(fullUrl, { timeout: 3000 });
        console.log(`✅ ${testUrl} - Status: ${response.status}`);
      } catch (error) {
        console.log(`❌ ${testUrl} - ${error.response?.status || error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Backend check completed!');
  console.log('\n💡 Common issues and solutions:');
  console.log('   1. Backend not returning image URLs - check database and API');
  console.log('   2. Image URLs are relative - frontend now handles this');
  console.log('   3. Image files don\'t exist - upload images to server');
  console.log('   4. CORS issues - configure server for cross-origin requests');
  console.log('   5. File permissions - check server file access permissions');
}

// Chạy check
checkBackendImages();
