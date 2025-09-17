# XeCare Frontend Features - Hướng Dẫn Sử Dụng

## 🚀 Các Chức Năng Mới Đã Thêm

### 1. 🖤 Hệ Thống Yêu Thích (Favorites)

#### Tính năng:
- **Thêm/Bỏ yêu thích garage**: Click vào nút trái tim trên mỗi garage card
- **Xem danh sách yêu thích**: Truy cập `/favorites` hoặc từ menu dropdown
- **Quản lý garage yêu thích**: Xóa garage khỏi danh sách yêu thích

#### Cách sử dụng:
1. Trên trang tìm kiếm garage, click vào nút trái tim để yêu thích
2. Truy cập `/favorites` để xem tất cả garage đã yêu thích
3. Click vào nút trái tim đỏ để bỏ yêu thích

#### API Endpoints:
- `GET /apis/favorites` - Lấy danh sách yêu thích
- `POST /apis/favorites/{garageId}` - Thêm vào yêu thích
- `DELETE /apis/favorites/{garageId}` - Bỏ yêu thích
- `GET /apis/favorites/check/{garageId}` - Kiểm tra trạng thái yêu thích

---

### 2. 🔔 Hệ Thống Thông Báo (Notifications)

#### Tính năng:
- **Hiển thị thông báo real-time**: Icon chuông với số thông báo chưa đọc
- **Quản lý thông báo**: Đánh dấu đã đọc từng thông báo hoặc tất cả
- **Phân loại thông báo**: Theo loại người nhận (USER/GARAGE)

#### Cách sử dụng:
1. Click vào icon chuông trên header để xem thông báo
2. Click vào thông báo để đánh dấu đã đọc
3. Sử dụng nút "Đánh dấu tất cả đã đọc" để xử lý hàng loạt
4. Truy cập `/notifications` để xem tất cả thông báo

#### API Endpoints:
- `GET /apis/notifications/me` - Lấy thông báo của user
- `POST /apis/notifications/{id}/read` - Đánh dấu đã đọc

---

### 3. 🎁 Hệ Thống Điểm Thưởng (Reward Points)

#### Tính năng:
- **Tích lũy điểm tự động**: Khi thực hiện các hành động
- **Xem tổng điểm**: Dashboard hiển thị tổng điểm và số giao dịch
- **Lịch sử giao dịch**: Theo dõi chi tiết từng lần nhận điểm
- **Hướng dẫn tích điểm**: Hiển thị cách kiếm điểm thưởng

#### Cách kiếm điểm:
- **Đặt lịch dịch vụ**: +50 điểm
- **Đánh giá garage**: +20 điểm  
- **Đặt lịch đầu tiên**: +100 điểm (bonus)
- **Thêm xe mới**: +15 điểm
- **Yêu cầu cứu hộ**: +25 điểm
- **Hoàn thành hồ sơ**: +30 điểm
- **Đăng nhập hàng tuần**: +10 điểm
- **Giới thiệu bạn bè**: +200 điểm

#### Cách sử dụng:
1. Truy cập `/reward-points` để xem tổng điểm và lịch sử
2. Thực hiện các hành động để tự động tích điểm
3. Xem hướng dẫn chi tiết cách kiếm điểm

#### API Endpoints:
- `GET /apis/reward-points/me` - Lấy danh sách điểm thưởng
- `GET /apis/reward-points/me/summary` - Lấy tổng quan điểm thưởng
- `POST /apis/reward-points/add` - Thêm điểm thưởng (admin)

---

## 🛠️ Cài Đặt và Chạy

### Backend (XeCare2):
```bash
cd XeCare2
./gradlew bootRun
```

### Frontend (XeCare_React):
```bash
cd XeCare_React
npm install
npm run dev
```

---

## 📁 Cấu Trúc File

### Backend:
```
src/main/java/com/group3/xecare2/user/
├── controllers/
│   ├── FavoriteController.java      # Quản lý yêu thích
│   ├── NotificationController.java  # Quản lý thông báo
│   └── RewardPointController.java   # Quản lý điểm thưởng
├── entities/
│   ├── Favorite.java                # Entity yêu thích
│   └── RewardPoint.java             # Entity điểm thưởng
└── repositories/
    ├── FavoriteRepository.java      # Repository yêu thích
    └── RewardPointRepository.java   # Repository điểm thưởng
```

### Frontend:
```
XeCare_React/
├── app/
│   ├── favorites/page.tsx           # Trang garage yêu thích
│   ├── notifications/page.tsx       # Trang thông báo
│   └── reward-points/page.tsx       # Trang điểm thưởng
├── components/ui/
│   ├── FavoriteButton.tsx           # Nút yêu thích
│   └── NotificationBell.tsx         # Icon thông báo
├── lib/
│   ├── api/
│   │   ├── FavoriteApi.ts           # API yêu thích
│   │   ├── NotificationApi.ts       # API thông báo
│   │   └── RewardPointApi.ts        # API điểm thưởng
│   └── services/
│       └── RewardPointService.ts    # Service điểm thưởng
└── types/Users/
    ├── favorite.ts                   # Types yêu thích
    ├── notification.ts               # Types thông báo
    └── rewardPoint.ts                # Types điểm thưởng
```

---

## 🔧 Tích Hợp Vào Hệ Thống Hiện Có

### 1. Header Component:
- Thêm NotificationBell cho user đã đăng nhập
- Cập nhật dropdown menu với các link mới

### 2. Dashboard:
- Thêm các card mới cho Favorite, Notification, Reward Points
- Tích hợp với hệ thống hiện có

### 3. Garage Cards:
- Thêm FavoriteButton vào mỗi garage card
- Tự động cập nhật trạng thái yêu thích

---

## 🎯 Các Tính Năng Nâng Cao

### 1. Tự Động Tích Điểm:
- Điểm được cộng tự động khi user thực hiện hành động
- Sử dụng RewardPointService để quản lý

### 2. Real-time Updates:
- NotificationBell cập nhật số thông báo real-time
- FavoriteButton cập nhật trạng thái ngay lập tức

### 3. Responsive Design:
- Tất cả trang đều responsive cho mobile và desktop
- Sử dụng Tailwind CSS và Radix UI components

---

## 🚨 Lưu Ý Quan Trọng

### 1. Authentication:
- Tất cả API đều yêu cầu JWT token
- User phải đăng nhập để sử dụng các chức năng

### 2. Database:
- Cần có các bảng: `Favorites`, `Reward_Points`, `Notifications`
- Đảm bảo foreign key constraints đúng

### 3. Performance:
- Sử dụng React hooks để tối ưu re-render
- API calls được debounce và error handling

---

## 🔮 Tính Năng Tương Lai

### 1. Push Notifications:
- Thông báo real-time qua browser
- Mobile push notifications

### 2. Gamification:
- Badges và achievements
- Leaderboard điểm thưởng
- Challenges hàng tuần/tháng

### 3. Social Features:
- Chia sẻ garage yêu thích
- Review và rating system
- Community forum

---

## 📞 Hỗ Trợ

Nếu có vấn đề hoặc cần hỗ trợ, vui lòng:
1. Kiểm tra console logs
2. Xem network requests trong DevTools
3. Kiểm tra database connections
4. Liên hệ team development

---

**XeCare Team** 🚗🔧
*Xây dựng tương lai của dịch vụ xe hơi*
