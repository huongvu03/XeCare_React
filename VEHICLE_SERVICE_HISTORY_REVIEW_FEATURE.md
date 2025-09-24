# Vehicle Service History Review Feature

## Tổng quan
Đã thêm chức năng đánh giá garage trực tiếp trong trang "Lịch sử sửa xe" (Vehicle Service History). Người dùng có thể đánh giá các dịch vụ đã hoàn thành ngay từ lịch sử xe của họ.

## Vị trí hiển thị
- **Component**: `VehicleServiceHistory.tsx`
- **Vị trí**: Trong trang "My Vehicle Management" → Click vào xe → Modal "Lịch sử sửa xe"
- **Điều kiện**: Chỉ hiển thị cho appointments có status = "COMPLETED"

## Tính năng mới

### 1. Review Section
```tsx
{/* Review Button for Completed Appointments */}
{appointment.status === "COMPLETED" && appointmentReviewStatus[appointment.id] && (
  <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Star className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">
          Đánh giá dịch vụ
        </span>
      </div>
      {/* Review button hoặc status */}
    </div>
  </div>
)}
```

### 2. Các trạng thái hiển thị

#### A. Có thể đánh giá
- Hiển thị nút "Đánh giá" màu xanh
- Click để mở modal đánh giá
- Icon ⭐

#### B. Đã đánh giá
- Hiển thị "Đã đánh giá" màu xanh
- Icon ⭐ đã fill
- Không thể đánh giá lại

#### C. Không thể đánh giá
- Hiển thị "Không thể đánh giá" màu xám
- Có thể do không đủ điều kiện

### 3. Modal đánh giá
- Sử dụng `ReviewAppointmentModal` component đã tạo
- Star rating 1-5 sao
- Comment field với validation
- Form submission với API call

## Cập nhật Component

### Imports mới
```tsx
import { Star } from "lucide-react"
import { canUserReviewAppointment, type CanReviewResponse } from "@/lib/api/ReviewAppointmentApi"
import { ReviewAppointmentModal } from "@/components/review/ReviewAppointmentModal"
```

### State mới
```tsx
// Review Modal State
const [reviewModalOpen, setReviewModalOpen] = useState(false)
const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
const [appointmentReviewStatus, setAppointmentReviewStatus] = useState<Record<number, CanReviewResponse>>({})
```

### Functions mới
```tsx
// Load review status for completed appointments
useEffect(() => {
  const loadReviewStatus = async () => {
    if (!appointments) return
    
    const completedAppointments = appointments.filter(app => app.status === "COMPLETED")
    
    for (const appointment of completedAppointments) {
      try {
        const response = await canUserReviewAppointment(appointment.id)
        setAppointmentReviewStatus(prev => ({
          ...prev,
          [appointment.id]: response.data
        }))
      } catch (error) {
        console.error(`Error loading review status for appointment ${appointment.id}:`, error)
      }
    }
  }

  loadReviewStatus()
}, [appointments])

// Handle review functions
const handleReviewClick = (appointment: Appointment) => {
  setSelectedAppointment(appointment)
  setReviewModalOpen(true)
}

const handleReviewSubmitted = () => {
  // Refresh appointments to get updated data
  window.location.reload()
  
  // Update review status for this appointment
  if (selectedAppointment) {
    setAppointmentReviewStatus(prev => ({
      ...prev,
      [selectedAppointment.id]: {
        canReview: false,
        hasReviewed: true
      }
    }))
  }
}
```

## UI/UX Improvements

### 1. Visual Design
- Review section có background xanh nhạt (`bg-blue-50`)
- Border xanh (`border-blue-200`)
- Icon star màu xanh
- Button styling nhất quán

### 2. User Experience
- Review section chỉ hiện cho appointments hoàn thành
- Trạng thái rõ ràng (có thể đánh giá/đã đánh giá/không thể đánh giá)
- Modal popup thân thiện
- Auto-refresh sau khi đánh giá

### 3. Responsive Design
- Layout responsive trên mobile và desktop
- Button size phù hợp
- Text size readable

## Business Logic

### 1. Điều kiện đánh giá
- Appointment phải có status = "COMPLETED"
- User phải là owner của appointment
- Chưa được đánh giá trước đó

### 2. Validation
- Rating: 1-5 sao (bắt buộc)
- Comment: 10-500 ký tự (bắt buộc)
- Lọc từ ngữ không phù hợp

### 3. Security
- Yêu cầu authentication
- Kiểm tra quyền sở hữu appointment
- Validate input data

## Testing

### 1. Manual Testing
1. Truy cập "My Vehicle Management"
2. Click vào xe có lịch sử sửa chữa
3. Xem modal "Lịch sử sửa xe"
4. Tìm appointments có status "Hoàn thành"
5. Click nút "Đánh giá" (nếu có)
6. Điền rating và comment
7. Submit review

### 2. Test File
- `test-vehicle-service-history-review.html` - Test các scenario khác nhau

### 3. API Testing
```bash
# Test can review endpoint
GET /apis/review-appointment/can-review/{appointmentId}

# Test create review
POST /apis/review-appointment
{
  "appointmentId": 123,
  "rating": 5,
  "comment": "Dịch vụ rất tốt..."
}
```

## Integration Points

### 1. Existing Components
- Tích hợp với `VehicleServiceHistory` component
- Sử dụng `ReviewAppointmentModal` đã có
- Kế thừa API endpoints đã tạo

### 2. Data Flow
```
VehicleServiceHistory → Load Appointments → Check Review Status → Show Review UI → Open Modal → Submit Review → Update Status
```

### 3. State Management
- Local state cho review modal
- API calls cho review status
- Real-time updates sau khi đánh giá

## Performance Considerations

### 1. API Calls
- Chỉ load review status cho appointments COMPLETED
- Cache review status trong component state
- Optimistic updates sau khi submit

### 2. Rendering
- Conditional rendering cho review section
- Memoization có thể được thêm nếu cần
- Lazy loading cho modal

## Future Enhancements

### 1. Tính năng có thể thêm
- Hiển thị rating hiện tại trong review section
- Edit review (nếu chưa quá lâu)
- Review analytics cho garage

### 2. UI Improvements
- Animation cho review section
- Better loading states
- Toast notifications

## Troubleshooting

### 1. Lỗi thường gặp
- Review section không hiện: Kiểm tra appointment status
- Button không click được: Kiểm tra authentication
- Modal không mở: Kiểm tra component imports

### 2. Debug
- Console logs cho review status loading
- Network tab để check API calls
- Component state inspection

## Conclusion
Tính năng đánh giá đã được tích hợp thành công vào Vehicle Service History, cho phép người dùng đánh giá dịch vụ ngay từ lịch sử xe của họ. Điều này cải thiện đáng kể user experience và tăng engagement với hệ thống.
