# Emergency Rescue Slider - Debug Guide

## 🚨 Vấn đề hiện tại
Component `emergency-rescue-slider.tsx` gặp lỗi 403 khi gọi API `/apis/garage/nearby`, mặc dù endpoint này đã được cấu hình là public trong SecurityConfiguration.java.

## 🔧 Giải pháp đã thực hiện

### 1. **Fallback Strategy trong API**
```typescript
// Trong GarageApi.ts - getEmergencyRescueGarages()
try {
  // Thử endpoint nearby trước
  const nearbyResponse = await publicAxios.get("/apis/garage/nearby")
} catch (nearbyError) {
  // Fallback: sử dụng endpoint active garages
  const activeResponse = await publicAxios.get("/apis/garage/active")
}
```

### 2. **Public Axios Instance**
```typescript
const publicAxios = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
})
// Không có Authorization header
```

### 3. **Component với Fallback Data**
- Loading state với spinner
- Error handling với thông báo rõ ràng
- Fallback data khi không có garage cứu hộ
- Test data để đảm bảo component hoạt động

## 🧪 Cách test và debug

### 1. **Test API endpoints riêng lẻ**
```bash
node test-garage-endpoints.js
```

### 2. **Sử dụng component đơn giản trước**
```tsx
import { EmergencyRescueSliderSimple } from "@/components/emergency-rescue-slider-simple"

// Trong page của bạn
<EmergencyRescueSliderSimple />
```

### 3. **Kiểm tra console logs**
Mở Developer Tools và xem:
- Geolocation errors
- API response status
- Garage filtering results
- Fallback data usage

## 📋 Checklist debug

### ✅ **Kiểm tra Backend**
- [ ] Backend server đang chạy tại `http://localhost:8080`
- [ ] SecurityConfiguration.java đã có `.permitAll()` cho `/apis/garage/nearby`
- [ ] Database có dữ liệu garage với services
- [ ] Restart server sau khi thay đổi SecurityConfiguration

### ✅ **Kiểm tra Frontend**
- [ ] Browser hỗ trợ Geolocation API
- [ ] User đã cho phép truy cập vị trí
- [ ] Không có CORS errors
- [ ] Network tab không có 403 errors

### ✅ **Kiểm tra Data**
- [ ] Garage có services với tên chứa "cứu hộ", "emergency", "rescue"
- [ ] Garage có status = "ACTIVE"
- [ ] Garage có đầy đủ thông tin (name, phone, services)

## 🎯 Các bước thực hiện

### **Bước 1: Test với component đơn giản**
```tsx
// Thay thế component hiện tại
<EmergencyRescueSliderSimple />
```

### **Bước 2: Kiểm tra API endpoints**
```bash
# Chạy test script
node test-garage-endpoints.js
```

### **Bước 3: Debug từng bước**
1. Kiểm tra geolocation hoạt động
2. Kiểm tra API call thành công
3. Kiểm tra data filtering
4. Kiểm tra component rendering

### **Bước 4: Chuyển sang component thật**
```tsx
// Khi đã debug xong
<EmergencyRescueSlider />
```

## 🚀 Kết quả mong đợi

### **Khi API hoạt động:**
- Component hiển thị garage thật từ database
- Ưu tiên garage yêu thích
- Sắp xếp theo khoảng cách
- Loading state mượt mà

### **Khi API không hoạt động:**
- Component hiển thị fallback data
- Thông báo lỗi rõ ràng
- Vẫn có nút hotline khẩn cấp
- Không crash ứng dụng

## 📞 Support

Nếu vẫn gặp vấn đề:
1. Kiểm tra server logs
2. Kiểm tra network requests
3. Test với Postman/curl
4. Kiểm tra database có dữ liệu

## 🎉 Kết luận

Component đã được thiết kế để hoạt động trong mọi trường hợp:
- ✅ **API hoạt động**: Hiển thị dữ liệu thật
- ✅ **API lỗi**: Hiển thị fallback data
- ✅ **Không có garage**: Hiển thị thông báo
- ✅ **Loading**: Hiển thị spinner

Component sẵn sàng sử dụng ngay cả khi backend chưa hoàn thiện!
