# 🔔 Hệ Thống Thông Báo XeCare

## Tổng Quan

Hệ thống thông báo XeCare cung cấp một cách hiệu quả để thông báo cho người dùng về các hoạt động quan trọng trong ứng dụng, bao gồm:

- ✅ **Đăng nhập thành công** - Chào mừng người dùng quay trở lại
- ❤️ **Garage yêu thích** - Thêm/xóa garage khỏi danh sách yêu thích  
- 🚨 **Cứu hộ khẩn cấp** - Tạo yêu cầu cứu hộ, nhận báo giá, cập nhật trạng thái
- 📅 **Lịch hẹn** - Đặt lịch, xác nhận, hủy, hoàn thành lịch hẹn
- ⚙️ **Hệ thống** - Cập nhật hệ thống, bảo trì, tính năng mới

## 🏗️ Kiến Trúc Hệ Thống

### Backend (Spring Boot)

#### 1. Entity - Notification
```java
@Entity
@Table(name = "Notifications")
public class Notification {
    private Long id;
    private RecipientType recipientType; // USER, GARAGE
    private Long recipientId;
    private NotificationType type;
    private String title;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private Long relatedId; // ID của entity liên quan
    private String relatedType; // Loại entity liên quan
    private String actionUrl; // URL để navigate
    private String priority; // HIGH, MEDIUM, LOW
    private String category; // EMERGENCY, FAVORITE, APPOINTMENT, SYSTEM
}
```

#### 2. Service - NotificationService
```java
@Service
public class NotificationService {
    // Tạo thông báo khẩn cấp
    public void createEmergencyNotification(Long recipientId, NotificationType type, 
                                          String title, String message, Long relatedId);
    
    // Tạo thông báo yêu thích
    public void createFavoriteNotification(Long recipientId, NotificationType type, 
                                         String title, String message, Long relatedId);
    
    // Tạo thông báo lịch hẹn
    public void createAppointmentNotification(Long recipientId, NotificationType type, 
                                            String title, String message, Long relatedId);
    
    // Tạo thông báo hệ thống
    public void createSystemNotification(Long recipientId, NotificationType type, 
                                       String title, String message);
}
```

#### 3. Controller - NotificationController
```java
@RestController
@RequestMapping("/apis/notifications")
public class NotificationController {
    @GetMapping("/me") // Lấy tất cả thông báo của user
    @GetMapping("/me/unread-count") // Số thông báo chưa đọc
    @GetMapping("/me/type/{type}") // Thông báo theo loại
    @GetMapping("/me/category/{category}") // Thông báo theo danh mục
    @PostMapping("/{id}/read") // Đánh dấu đã đọc
    @PostMapping("/mark-all-read") // Đánh dấu tất cả đã đọc
    @PostMapping("/cleanup") // Dọn dẹp thông báo cũ
}
```

### Frontend (React/Next.js)

#### 1. Hook - useNotifications
```typescript
export function useNotifications() {
  const { notifications, unreadCount, isLoading, refreshNotifications } = useNotifications();
  
  return {
    notifications,
    unreadCount,
    isLoading,
    refreshNotifications,
    markAsRead,
    markAllAsRead
  };
}
```

#### 2. Component - NotificationBell
```typescript
export function NotificationBell({ className }) {
  const { unreadCount, isLoading } = useNotifications();
  
  return (
    <Button onClick={() => router.push("/notifications")}>
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
    </Button>
  );
}
```

#### 3. Page - Notifications
- Hiển thị danh sách thông báo với giao diện đẹp
- Tìm kiếm và lọc thông báo
- Đánh dấu đã đọc/đánh dấu tất cả đã đọc
- Thống kê thông báo (tổng, chưa đọc, ưu tiên cao, hôm nay)

## 🚀 Cách Sử Dụng

### 1. Tạo Thông Báo Mới

#### Từ Backend Controller:
```java
@Autowired
private NotificationService notificationService;

// Tạo thông báo khi đăng nhập thành công
notificationService.createSystemNotification(
    user.getId().longValue(),
    NotificationType.SYSTEM_UPDATE,
    "Đăng nhập thành công! 👋",
    "Chào mừng bạn quay trở lại!"
);

// Tạo thông báo khi đặt lịch thành công
notificationService.createAppointmentNotification(
    userId,
    NotificationType.APPOINTMENT_CREATED,
    "Đặt lịch hẹn thành công! 📅",
    "Bạn đã đặt lịch hẹn thành công với garage.",
    appointmentId
);
```

### 2. Hiển Thị Thông Báo

#### Trong Component:
```typescript
import { useNotifications } from '@/hooks/use-notifications';

function MyComponent() {
  const { notifications, unreadCount } = useNotifications();
  
  return (
    <div>
      <NotificationBell />
      <p>Số thông báo chưa đọc: {unreadCount}</p>
    </div>
  );
}
```

### 3. Đánh Dấu Đã Đọc

```typescript
import { markNotificationAsRead } from '@/lib/api/NotificationApi';

const handleMarkAsRead = async (notificationId: number) => {
  await markNotificationAsRead(notificationId);
  // UI sẽ tự động cập nhật
};
```

## 📱 Giao Diện Người Dùng

### 1. Chuông Thông Báo (Header)
- Hiển thị số thông báo chưa đọc
- Animation khi có thông báo mới
- Click để chuyển đến trang thông báo

### 2. Trang Thông Báo
- **Header đẹp** với gradient và icon
- **Thống kê** tổng cộng, chưa đọc, ưu tiên cao, hôm nay
- **Tìm kiếm** theo tiêu đề và nội dung
- **Danh sách thông báo** với:
  - Icon theo loại (🚨, ❤️, 📅, ⚙️)
  - Badge "Mới" cho thông báo chưa đọc
  - Priority và category badges
  - Thời gian tương đối (2 phút trước, 1 giờ trước...)
  - Nút "Đã đọc" cho thông báo chưa đọc

### 3. Responsive Design
- Mobile-friendly
- Animation mượt mà
- Loading states
- Empty states

## 🔧 Tích Hợp Vào Các Tính Năng

### 1. Đăng Nhập (UserLoginController)
```java
// Tạo notification chào mừng đăng nhập thành công
String welcomeMessage = user.isGarageOwner() 
    ? "Chào mừng bạn quay trở lại! Bạn có thể quản lý garage và lịch hẹn của mình."
    : "Chào mừng bạn quay trở lại! Hãy khám phá các dịch vụ cứu hộ xe tốt nhất.";

notificationService.createSystemNotification(
    user.getId().longValue(),
    NotificationType.SYSTEM_UPDATE,
    "Đăng nhập thành công! 👋",
    welcomeMessage
);
```

### 2. Yêu Thích Garage (FavoriteController)
```java
// Khi thêm vào yêu thích
notificationService.createFavoriteNotification(
    currentUser.getId().longValue(),
    NotificationType.FAVORITE_ADDED,
    "Đã thêm vào yêu thích",
    "Bạn đã thêm garage " + garage.getName() + " vào danh sách yêu thích",
    garage.getId().longValue()
);

// Khi xóa khỏi yêu thích
notificationService.createFavoriteNotification(
    currentUser.getId().longValue(),
    NotificationType.FAVORITE_REMOVED,
    "Đã xóa khỏi yêu thích",
    "Bạn đã xóa garage " + garage.getName() + " khỏi danh sách yêu thích",
    garage.getId().longValue()
);
```

### 3. Cứu Hộ Khẩn Cấp (EmergencyController)
```java
// Khi tạo yêu cầu cứu hộ
notificationService.createEmergencyNotification(
    currentUser.getId().longValue(),
    NotificationType.EMERGENCY_REQUEST_CREATED,
    "Yêu cầu cứu hộ mới",
    "Yêu cầu cứu hộ của bạn đã được tạo thành công. ID: #" + saved.getId(),
    saved.getId()
);
```

### 4. Lịch Hẹn (AppointmentController)
```java
// Khi đặt lịch hẹn
notificationService.createAppointmentNotification(
    response.getUserId().longValue(),
    NotificationType.APPOINTMENT_CREATED,
    "Đặt lịch hẹn thành công! 📅",
    "Bạn đã đặt lịch hẹn thành công với garage. Vui lòng chờ garage xác nhận.",
    response.getId().longValue()
);
```

## 🧪 Testing

### 1. Test Script
```bash
# Chạy test script
node test-notification-system.js
```

### 2. Test Endpoints
```bash
# Tạo test notifications
curl -X POST http://localhost:8080/apis/notifications/create-test \
  -H "Authorization: Bearer YOUR_TOKEN"

# Lấy thông báo
curl -X GET http://localhost:8080/apis/notifications/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Đánh dấu đã đọc
curl -X POST http://localhost:8080/apis/notifications/1/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎨 Customization

### 1. Thêm Loại Thông Báo Mới
```java
// Trong NotificationType enum
NEW_TYPE,

// Trong NotificationService
public void createNewTypeNotification(Long recipientId, String title, String message, Long relatedId) {
    createNotification(RecipientType.USER, recipientId, NotificationType.NEW_TYPE, 
                      title, message, relatedId, "newtype", "MEDIUM", "NEW_CATEGORY");
}
```

### 2. Thêm Icon Mới
```typescript
// Trong notification.ts
export const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.NEW_TYPE:
      return '🆕';
    // ... existing cases
  }
};
```

### 3. Thêm Màu Sắc Mới
```typescript
export const getNotificationColor = (type: NotificationType, priority?: string) => {
  switch (type) {
    case NotificationType.NEW_TYPE:
      return 'text-cyan-600 bg-cyan-50 border-cyan-200';
    // ... existing cases
  }
};
```

## 📊 Performance & Optimization

### 1. Database Indexing
```sql
-- Index cho performance
CREATE INDEX idx_notifications_recipient ON Notifications(recipientType, recipientId);
CREATE INDEX idx_notifications_unread ON Notifications(recipientType, recipientId, isRead);
CREATE INDEX idx_notifications_created ON Notifications(createdAt);
```

### 2. Caching
- Unread count được cache trong frontend
- Auto-refresh mỗi 10 giây
- Real-time updates qua custom events

### 3. Cleanup
- Tự động xóa thông báo cũ hơn 30 ngày
- API cleanup endpoint cho manual cleanup

## 🔒 Security

### 1. Authorization
- Chỉ user có thể xem thông báo của mình
- JWT token validation
- Role-based access control

### 2. Data Validation
- Input validation cho tất cả endpoints
- XSS protection cho message content
- SQL injection prevention

## 🚀 Deployment

### 1. Environment Variables
```bash
# Backend
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/xecare2
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 2. Database Migration
```sql
-- Tạo bảng Notifications
CREATE TABLE Notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipientType VARCHAR(20) NOT NULL,
    recipientId BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    relatedId BIGINT,
    relatedType VARCHAR(50),
    actionUrl VARCHAR(500),
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    category VARCHAR(50) DEFAULT 'GENERAL'
);
```

## 📈 Monitoring & Analytics

### 1. Metrics
- Số lượng thông báo được tạo theo loại
- Tỷ lệ đọc thông báo
- Thời gian phản hồi của notification API

### 2. Logging
```java
@Slf4j
public class NotificationService {
    public void createNotification(...) {
        log.info("Created notification: {} for {} ID: {} with priority: {}", 
                type, recipientType, recipientId, priority);
    }
}
```

## 🤝 Contributing

### 1. Thêm Tính Năng Mới
1. Tạo branch mới từ `main`
2. Implement tính năng theo pattern hiện có
3. Thêm tests
4. Update documentation
5. Tạo pull request

### 2. Code Style
- Follow existing patterns
- Use meaningful variable names
- Add proper error handling
- Include JSDoc/JavaDoc comments

## 📞 Support

Nếu bạn gặp vấn đề với hệ thống notification:

1. **Kiểm tra logs** trong console browser và server
2. **Test API endpoints** bằng Postman hoặc curl
3. **Verify database** có bảng Notifications và data
4. **Check authentication** JWT token còn hợp lệ

---

**🎉 Chúc bạn sử dụng hệ thống notification hiệu quả!**
