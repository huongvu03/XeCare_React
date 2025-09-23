# 🚗 Tính năng Hành trình Emergency - Route Feature

## 📋 Tổng quan

Tính năng **Hành trình** được thêm vào trang chi tiết emergency để hiển thị thông tin khoảng cách, thời gian dự tính và cung cấp chỉ dẫn đường qua Google Maps.

## ✨ Tính năng chính

### 1. 📏 Tính toán khoảng cách
- Tự động tính khoảng cách từ garage đến vị trí sự cố
- Hiển thị với đơn vị km
- Sử dụng Google Maps API (hoặc mock data cho demo)

### 2. ⏱️ Thời gian dự tính
- Hiển thị thời gian ước tính để garage đến vị trí sự cố
- Giúp khách hàng biết được thời gian chờ đợi
- Hiển thị với đơn vị phút

### 3. 🗺️ Chỉ dẫn đường
- Tích hợp với Google Maps
- Mở chỉ dẫn đường trực tiếp từ garage đến vị trí sự cố
- Hỗ trợ cả tọa độ chính xác và địa chỉ

### 4. 📱 Giao diện thân thiện
- Thiết kế responsive
- UI/UX hiện đại với gradient và shadow
- Hiển thị trạng thái loading và error
- Nút sao chép thông tin và làm mới

## 🔧 Triển khai kỹ thuật

### Files đã chỉnh sửa:

1. **`app/emergency/[id]/page.tsx`**
   - Thêm tab "Hành trình" mới
   - Thêm state `routeInfo` để quản lý thông tin hành trình
   - Thêm hàm `calculateRoute()` để tính toán khoảng cách và thời gian
   - Thêm hàm `openGoogleMapsNavigation()` để mở Google Maps
   - Thêm UI hiển thị thông tin hành trình với các trạng thái khác nhau

2. **`lib/api/EmergencyApi.ts`**
   - Cập nhật interface `EmergencyRequest` và `EmergencyQuote`
   - Thêm `latitude?` và `longitude?` cho garage object

### Cấu trúc UI mới:

```typescript
// Tab "Hành trình" với các thành phần:
- Route Information Header
- Distance & Duration Cards
- Route Details với timeline
- Action Buttons (Google Maps, Copy, Refresh)
- Quick Navigation Section
```

## 🎯 Cách sử dụng

### 1. Truy cập trang chi tiết emergency
- Vào `/emergency/[id]`
- Click vào tab "Hành trình"

### 2. Xem thông tin hành trình
- Khoảng cách từ garage đến vị trí sự cố
- Thời gian dự tính
- Chi tiết điểm xuất phát và điểm đến

### 3. Sử dụng các nút chức năng
- **Mở Google Maps**: Mở chỉ dẫn đường
- **Sao chép thông tin**: Copy thông tin hành trình
- **Làm mới**: Tính toán lại khoảng cách và thời gian

### 4. Điều hướng nhanh
- **Vị trí Garage**: Mở vị trí garage trên Google Maps
- **Vị trí sự cố**: Mở vị trí sự cố trên Google Maps
- **Chỉ dẫn đường**: Mở chỉ dẫn đường từ garage đến sự cố

## 🔄 Trạng thái hiển thị

### 1. Loading State
```typescript
{
  distance: '',
  duration: '',
  status: 'loading'
}
```
- Hiển thị spinner loading
- Text "Đang tính toán hành trình..."

### 2. Loaded State
```typescript
{
  distance: '15 km',
  duration: '25 phút',
  status: 'loaded'
}
```
- Hiển thị thông tin khoảng cách và thời gian
- Các nút chức năng hoạt động

### 3. Error State
```typescript
{
  distance: 'N/A',
  duration: 'N/A',
  status: 'error'
}
```
- Hiển thị thông báo lỗi
- Nút "Thử lại" để tính toán lại

## 🚀 Tích hợp Google Maps API

### Hiện tại (Demo Mode):
- Sử dụng mock data để hiển thị khoảng cách và thời gian ngẫu nhiên
- Các nút Google Maps hoạt động với URL thực

### Để tích hợp thực tế:
1. Đăng ký Google Maps API key
2. Thay thế mock data trong `calculateRoute()` bằng Google Maps Distance Matrix API
3. Xử lý response từ API để lấy thông tin khoảng cách và thời gian thực

```typescript
// Ví dụ tích hợp Google Maps Distance Matrix API:
const response = await fetch(
  `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${API_KEY}`
);
const data = await response.json();
```

## 🎨 UI/UX Features

### 1. Responsive Design
- Grid layout tự động điều chỉnh theo màn hình
- Mobile-friendly với touch interactions

### 2. Visual Elements
- Gradient backgrounds
- Card-based layout
- Icon integration với Lucide React
- Loading animations
- Hover effects

### 3. Color Scheme
- **Distance**: Green gradient (10.762622,106.660172)
- **Duration**: Orange gradient (10.823099,106.629664)
- **Route**: Blue gradient
- **Error**: Red gradient

## 🔍 Testing

### Demo Files:
1. **`test-route-feature.html`**: Demo standalone với HTML/CSS/JS
2. **`EMERGENCY_ROUTE_FEATURE_README.md`**: Hướng dẫn chi tiết

### Test Cases:
- [x] Tab "Hành trình" hiển thị đúng
- [x] Loading state hoạt động
- [x] Mock data hiển thị
- [x] Google Maps navigation hoạt động
- [x] Copy functionality hoạt động
- [x] Error handling khi không có tọa độ garage
- [x] Responsive design trên mobile

## 📱 Screenshots

### Desktop View:
- Tab "Hành trình" với thông tin khoảng cách và thời gian
- Timeline hiển thị từ garage đến vị trí sự cố
- Các nút chức năng và điều hướng nhanh

### Mobile View:
- Layout responsive tự động điều chỉnh
- Touch-friendly buttons
- Optimized spacing và typography

## 🚀 Future Enhancements

### 1. Real-time Tracking
- Cập nhật vị trí garage real-time
- Hiển thị vị trí hiện tại của xe cứu hộ

### 2. Multiple Routes
- Hiển thị nhiều tuyến đường khác nhau
- So sánh thời gian và khoảng cách

### 3. Traffic Integration
- Tích hợp thông tin giao thông real-time
- Cập nhật thời gian dự tính theo tình trạng giao thông

### 4. Push Notifications
- Thông báo khi garage bắt đầu di chuyển
- Cập nhật tiến độ hành trình

## 📞 Support

Nếu có vấn đề hoặc cần hỗ trợ, vui lòng liên hệ:
- **Email**: support@xecare.com
- **Phone**: 1900-xxxx
- **Documentation**: [Link to docs]

---

**Tính năng Hành trình Emergency** - Giúp garage và khách hàng theo dõi tiến độ cứu hộ một cách trực quan và chính xác! 🚗💨
