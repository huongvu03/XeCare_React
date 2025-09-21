# Emergency Rescue Slider - Real Data Integration

## 📋 Tổng quan
Component `emergency-rescue-slider.tsx` đã được cập nhật để sử dụng dữ liệu garage thật từ API thay vì dữ liệu mock. Component này hiển thị các garage có dịch vụ cứu hộ gần nhất với ưu tiên yêu thích và khoảng cách.

## 🚀 Tính năng mới

### 1. **Dữ liệu thật từ API**
- Lấy danh sách garage gần nhất từ API `/apis/garage/nearby`
- Lọc garage có dịch vụ cứu hộ (tên dịch vụ chứa "cứu hộ", "emergency", "rescue")
- Sử dụng vị trí thật của người dùng qua Geolocation API

### 2. **Ưu tiên thông minh**
- **Yêu thích trước**: Garage được đánh dấu yêu thích sẽ hiển thị đầu tiên
- **Gần nhất sau**: Sắp xếp theo khoảng cách từ người dùng
- Chỉ hiển thị tối đa 5 garage để tối ưu hiệu suất

### 3. **Xử lý lỗi và fallback**
- Loading state khi đang tải dữ liệu
- Error handling khi không thể lấy vị trí hoặc API
- Fallback data khi không có garage cứu hộ
- Thông báo rõ ràng khi không tìm thấy garage

### 4. **Giao diện responsive**
- Hiển thị đẹp trên mọi kích thước màn hình
- Logo động từ tên garage
- Màu sắc ngẫu nhiên cho logo
- Thời gian phản hồi ước tính dựa trên khoảng cách

## 🔧 Cấu trúc API

### GarageApi.ts - Hàm mới
```typescript
export const getEmergencyRescueGarages = async (
  latitude: number, 
  longitude: number, 
  radius: number = 10
) => {
  // 1. Lấy garage gần nhất (public endpoint)
  // 2. Lọc garage có dịch vụ cứu hộ
  // 3. Lấy danh sách yêu thích (nếu có token)
  // 4. Sắp xếp theo ưu tiên
  // 5. Trả về danh sách đã sắp xếp
}
```

### Endpoints sử dụng
- `GET /apis/garage/nearby` - Public endpoint, không cần authentication
- `GET /apis/favorites` - Cần authentication (optional)

## 🛠️ Cách sử dụng

### 1. **Import component**
```tsx
import { EmergencyRescueSlider } from "@/components/emergency-rescue-slider"
```

### 2. **Sử dụng trong page**
```tsx
<EmergencyRescueSlider />
```

### 3. **Yêu cầu hệ thống**
- Browser hỗ trợ Geolocation API
- Backend server đang chạy tại `http://localhost:8080`
- Database có dữ liệu garage với services

## 📱 Trải nghiệm người dùng

### 1. **Loading State**
```
🔄 Đang tìm garage cứu hộ gần bạn...
```

### 2. **Garage Found**
```
🚨 CỨU HỘ KHẨN CẤP
[Garage Info with Logo, Distance, Rating, Phone]
[Call Button] [Navigation Indicators]
[Emergency Hotline Button]
```

### 3. **No Garage Found**
```
🚨 CỨU HỘ KHẨN CẤP
Không tìm thấy garage cứu hộ gần bạn
Vui lòng gọi hotline khẩn cấp
[Emergency Hotline Button]
```

## 🔍 Debug và Testing

### 1. **Test API riêng lẻ**
```bash
node test-public-garage-api.js
```

### 2. **Kiểm tra console logs**
- Geolocation errors
- API response data
- Garage filtering results
- Favorites integration

### 3. **Common Issues**
- **403 Error**: API endpoint cần authentication → Sử dụng public axios instance
- **No Location**: User từ chối geolocation → Sử dụng fallback data
- **No Emergency Garages**: Không có garage nào có dịch vụ cứu hộ → Hiển thị thông báo

## 📊 Data Flow

```
1. Component Mount
   ↓
2. Request User Location
   ↓
3. Call getEmergencyRescueGarages()
   ↓
4. Fetch Nearby Garages (Public API)
   ↓
5. Filter Emergency Services
   ↓
6. Get Favorites (if authenticated)
   ↓
7. Sort by Priority (Favorites → Distance)
   ↓
8. Transform Data for UI
   ↓
9. Render Slider
```

## 🎯 Kết quả

✅ **Hoàn thành**: Component đã được tích hợp hoàn toàn với dữ liệu thật
✅ **Ưu tiên**: Yêu thích và gần nhất được áp dụng chính xác  
✅ **UX**: Loading states và error handling đầy đủ
✅ **Performance**: Chỉ hiển thị 5 garage gần nhất
✅ **Responsive**: Hoạt động tốt trên mọi thiết bị

Component sẵn sàng sử dụng trong production với dữ liệu garage thật!
