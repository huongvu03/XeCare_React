# Hệ thống Cứu hộ Khẩn cấp XeCare2

## Tổng quan

Hệ thống cứu hộ khẩn cấp được phát triển để kết nối người dùng gặp sự cố xe với các garage gần nhất, cung cấp dịch vụ cứu hộ 24/7.

## Tính năng chính

### 🚨 Cho người dùng (User)

#### 1. **Yêu cầu cứu hộ mới**
- Xác định vị trí tự động hoặc thủ công
- Upload ảnh sự cố (tối đa 5 ảnh)
- Chọn loại xe và loại sự cố
- Mô tả chi tiết tình trạng
- Gửi yêu cầu cứu hộ

#### 2. **Tìm garage gần nhất**
- Hiển thị danh sách garage trong bán kính 10km
- Sắp xếp theo khoảng cách gần nhất
- Thông tin chi tiết: địa chỉ, số điện thoại, giờ mở cửa
- Trạng thái hoạt động (đang mở/đã đóng)
- Dịch vụ cung cấp

#### 3. **Lịch sử cứu hộ**
- Xem tất cả yêu cầu cứu hộ đã gửi
- Theo dõi trạng thái: Chờ xử lý → Có báo giá → Đã chấp nhận → Hoàn thành
- Xem và chấp nhận báo giá từ garage
- Chi tiết từng yêu cầu

#### 4. **Tính năng khẩn cấp**
- Nút gọi hotline 24/7
- Gọi trực tiếp garage
- Chỉ đường đến garage

### 🔧 Cho garage

#### 1. **Quản lý yêu cầu cứu hộ**
- Xem danh sách yêu cầu theo trạng thái
- Thông tin chi tiết khách hàng và sự cố
- Ảnh sự cố từ khách hàng
- Vị trí chính xác (GPS)

#### 2. **Tạo báo giá**
- Đặt giá dịch vụ
- Thời gian dự kiến đến
- Ghi chú chi tiết
- Gửi báo giá cho khách hàng

#### 3. **Theo dõi trạng thái**
- Chờ xử lý (PENDING)
- Đã báo giá (QUOTED)
- Đã chấp nhận (ACCEPTED)
- Hoàn thành (COMPLETED)

#### 4. **Tương tác với khách hàng**
- Gọi điện trực tiếp
- Chỉ đường đến vị trí
- Xem lịch sử báo giá

## Cấu trúc Backend

### Entities

#### EmergencyRequest
```java
- id: Long
- user: User
- garage: Garage (optional)
- description: String
- latitude: Double
- longitude: Double
- status: EmergencyStatus
- createdAt: LocalDateTime
- images: List<EmergencyRequestImage>
```

#### EmergencyQuote
```java
- id: Long
- emergencyRequest: EmergencyRequest
- garage: Garage
- price: Double
- message: String
- accepted: Boolean
- createdAt: LocalDateTime
```

#### EmergencyStatus
```java
PENDING, QUOTED, ACCEPTED, CANCELLED, COMPLETED
```

### API Endpoints

#### User APIs
- `POST /apis/emergency/request` - Tạo yêu cầu cứu hộ
- `POST /apis/emergency/upload-image` - Upload ảnh sự cố
- `GET /apis/emergency/my-requests` - Lấy danh sách yêu cầu
- `GET /apis/emergency/quotes/{requestId}` - Lấy báo giá
- `POST /apis/emergency/quotes/{quoteId}/accept` - Chấp nhận báo giá

#### Garage APIs
- `POST /apis/emergency/quote` - Tạo báo giá
- `GET /apis/garage/nearby` - Tìm garage gần nhất

## Cấu trúc Frontend

### Components

#### 1. **EmergencyApi.ts**
- Kết nối với backend APIs
- TypeScript interfaces
- Error handling

#### 2. **EmergencyHistory.tsx**
- Hiển thị lịch sử yêu cầu cứu hộ
- Quản lý trạng thái
- Chấp nhận báo giá

#### 3. **NearbyGarages.tsx**
- Tìm và hiển thị garage gần nhất
- Tính toán khoảng cách
- Tương tác với garage

#### 4. **ImageUpload.tsx**
- Upload ảnh sự cố
- Preview và quản lý ảnh
- Validation file

#### 5. **Emergency Page (User)**
- Form tạo yêu cầu cứu hộ
- Tabs: Yêu cầu mới, Garage gần nhất, Lịch sử
- Tracking trạng thái

#### 6. **Garage Emergency Dashboard**
- Quản lý yêu cầu cứu hộ
- Tạo báo giá
- Theo dõi trạng thái

## Workflow

### 1. User tạo yêu cầu cứu hộ
```
User → Xác định vị trí → Upload ảnh → Điền thông tin → Gửi yêu cầu
```

### 2. Garage xử lý yêu cầu
```
Garage nhận yêu cầu → Xem chi tiết → Tạo báo giá → Gửi cho user
```

### 3. User chấp nhận báo giá
```
User nhận báo giá → So sánh → Chấp nhận → Trạng thái ACCEPTED
```

### 4. Garage thực hiện cứu hộ
```
Garage → Gọi khách → Chỉ đường → Thực hiện cứu hộ → Hoàn thành
```

## Tính năng nâng cao

### 1. **Real-time tracking**
- Cập nhật vị trí garage real-time
- Thời gian đến dự kiến
- Push notifications

### 2. **Auto-detect nearby garages**
- Tự động tìm garage gần nhất
- Gợi ý garage phù hợp
- Sắp xếp theo rating và khoảng cách

### 3. **Emergency contacts**
- Lưu số điện thoại khẩn cấp
- SOS button
- Gọi nhanh

### 4. **Analytics & Reporting**
- Thống kê yêu cầu cứu hộ
- Báo cáo hiệu suất garage
- Phân tích xu hướng

## Cài đặt và sử dụng

### Backend
```bash
# Đảm bảo database có các bảng:
- Emergency_Requests
- Emergency_Quotes
- Emergency_Request_Images
```

### Frontend
```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### Environment Variables
```env
# Backend
app.upload.path=uploads/garages

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Bảo mật

- Authentication required cho tất cả APIs
- Role-based access control (USER, GARAGE, ADMIN)
- File upload validation
- GPS location validation
- Rate limiting cho API calls

## Performance

- Lazy loading cho danh sách garage
- Image compression và optimization
- Caching cho location data
- Pagination cho large datasets

## Testing

### Unit Tests
- API endpoints testing
- Component testing
- Business logic validation

### Integration Tests
- End-to-end workflow testing
- Database integration
- File upload testing

## Deployment

### Backend
- Spring Boot application
- MySQL/PostgreSQL database
- File storage (local/cloud)

### Frontend
- Next.js application
- Vercel/Netlify deployment
- CDN cho static assets

## Monitoring

- Error tracking (Sentry)
- Performance monitoring
- User analytics
- API usage metrics

## Roadmap

### Phase 1 ✅ (Đã hoàn thành)
- Basic emergency request system
- Garage management
- Image upload
- Status tracking

### Phase 2 🚧 (Đang phát triển)
- Real-time notifications
- Advanced tracking
- Payment integration
- Rating system

### Phase 3 📋 (Kế hoạch)
- AI-powered diagnostics
- Predictive maintenance
- Insurance integration
- Multi-language support
