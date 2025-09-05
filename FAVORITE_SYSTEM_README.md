# 🚗 Hệ Thống Yêu Thích Garage - XeCare2

## 📋 Tổng Quan

Hệ thống yêu thích cho phép người dùng đã đăng nhập lưu trữ và quản lý danh sách các garage yêu thích. Người dùng có thể thêm/bỏ yêu thích garage từ trang tìm kiếm và xem danh sách yêu thích ở trang riêng biệt.

## 🏗️ Kiến Trúc Hệ Thống

### Backend (Spring Boot)
- **FavoriteController**: Xử lý các API endpoints
- **FavoriteRepository**: Truy vấn cơ sở dữ liệu
- **Favorite Entity**: Model dữ liệu
- **Security Configuration**: Bảo mật API

### Frontend (Next.js + React)
- **FavoriteButton**: Component nút yêu thích
- **FavoriteApi**: Gọi API từ frontend
- **FavoritesPage**: Trang hiển thị danh sách yêu thích
- **useAuth Hook**: Quản lý trạng thái đăng nhập

## 🔐 Bảo Mật

### Backend Security
```java
// SecurityConfiguration.java
.requestMatchers("/apis/favorites/**").hasAnyRole("USER", "GARAGE")
```

- Chỉ người dùng đã đăng nhập (USER, GARAGE) mới có thể truy cập
- JWT token được validate qua AuthTokenFilter
- CORS được cấu hình cho localhost:3000

### Frontend Authentication
- Kiểm tra token trong localStorage
- Tự động redirect về trang đăng nhập nếu token hết hạn
- Xử lý lỗi 401/403 một cách graceful

## 🚀 API Endpoints

### 1. Kiểm tra trạng thái yêu thích
```
GET /apis/favorites/check/{garageId}
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "garageId": 1,
  "isFavorited": true
}
```

### 2. Lấy danh sách yêu thích
```
GET /apis/favorites
Authorization: Bearer {jwt_token}
```

**Response:**
```json
[
  {
    "id": 1,
    "garageId": 1,
    "garageName": "Garage ABC",
    "garageAddress": "123 Đường ABC",
    "garagePhone": "0909123456",
    "garageEmail": "abc@garage.com",
    "garageDescription": "Mô tả garage",
    "garageImageUrl": "http://localhost:8080/uploads/garage1.jpg",
    "garageStatus": "ACTIVE",
    "garageIsVerified": true,
    "garageLatitude": 10.1234,
    "garageLongitude": 106.5678,
    "favoritedAt": "2024-01-15T10:30:00"
  }
]
```

### 3. Thêm vào yêu thích
```
POST /apis/favorites/{garageId}
Authorization: Bearer {jwt_token}
```

**Response:** 201 Created với thông tin favorite

### 4. Bỏ yêu thích
```
DELETE /apis/favorites/{garageId}
Authorization: Bearer {jwt_token}
```

**Response:** 204 No Content

## 🎯 Cách Sử Dụng

### 1. Thêm vào yêu thích
```tsx
import { FavoriteButton } from "@/components/ui/FavoriteButton";

<FavoriteButton 
  garageId={garage.id} 
  size="sm" 
  variant="ghost"
  onFavoriteChange={(isFavorited) => {
    console.log('Favorite status changed:', isFavorited);
  }}
/>
```

### 2. Kiểm tra trạng thái yêu thích
```tsx
import { checkFavoriteStatus } from "@/lib/api/FavoriteApi";

const checkStatus = async (garageId: number) => {
  try {
    const response = await checkFavoriteStatus(garageId);
    return response.data.isFavorited;
  } catch (error) {
    console.error('Error checking status:', error);
    return false;
  }
};
```

### 3. Lấy danh sách yêu thích
```tsx
import { getMyFavorites } from "@/lib/api/FavoriteApi";

const loadFavorites = async () => {
  try {
    const response = await getMyFavorites();
    setFavorites(response.data);
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
};
```

## 🛠️ Xử Lý Lỗi

### Lỗi 401 (Unauthorized)
- Token không tồn tại hoặc hết hạn
- Tự động xóa token và redirect về trang đăng nhập

### Lỗi 403 (Forbidden)
- Người dùng không có quyền truy cập
- Hiển thị thông báo lỗi phù hợp

### Lỗi 500 (Server Error)
- Lỗi từ backend
- Hiển thị thông báo "Thử lại sau"

### Lỗi Kết Nối
- Không thể kết nối đến server
- Kiểm tra kết nối mạng

## 🧪 Testing

### Test Script
```bash
# Cài đặt dependencies
npm install axios

# Chạy test
node test-favorite-api.js
```

### Manual Testing
1. Đăng nhập vào hệ thống
2. Vào trang tìm kiếm garage
3. Click nút trái tim để yêu thích
4. Vào trang favorites để xem danh sách
5. Click nút trái tim để bỏ yêu thích

## 🔧 Troubleshooting

### Lỗi 403 Forbidden
- Kiểm tra SecurityConfiguration có cho phép `/apis/favorites/**`
- Kiểm tra user có role USER hoặc GARAGE
- Kiểm tra JWT token có hợp lệ

### Lỗi 401 Unauthorized
- Kiểm tra token có trong localStorage
- Kiểm tra token có hết hạn
- Kiểm tra AuthTokenFilter có hoạt động

### Frontend không hiển thị
- Kiểm tra console browser có lỗi gì
- Kiểm tra Network tab có gọi API thành công
- Kiểm tra useAuth hook có trả về user

## 📱 Responsive Design

- **Mobile**: Nút yêu thích nhỏ gọn, dễ bấm
- **Tablet**: Layout tối ưu cho màn hình trung bình
- **Desktop**: Hiển thị đầy đủ thông tin và tương tác

## 🎨 UI/UX Features

- **Animation**: Hiệu ứng hover và click mượt mà
- **Tooltip**: Hướng dẫn cho người dùng chưa đăng nhập
- **Loading State**: Hiển thị trạng thái đang xử lý
- **Toast Notifications**: Thông báo kết quả thao tác
- **Error Handling**: Xử lý lỗi một cách user-friendly

## 🚀 Tương Lai

- [ ] Thêm tính năng chia sẻ danh sách yêu thích
- [ ] Thêm tính năng đánh giá garage yêu thích
- [ ] Thêm tính năng nhắc nhở bảo dưỡng
- [ ] Thêm tính năng so sánh garage yêu thích
- [ ] Thêm tính năng export danh sách yêu thích

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console browser
2. Kiểm tra Network tab
3. Kiểm tra backend logs
4. Liên hệ team development

---

**Lưu ý**: Hệ thống yêu thích chỉ hoạt động khi người dùng đã đăng nhập và có JWT token hợp lệ.
