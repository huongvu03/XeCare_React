# User Appointments Review Feature

## Tổng quan
Đã thêm chức năng đánh giá garage trực tiếp trong trang `/user/appointments` với filter đặc biệt "Chờ đánh giá" để lọc những appointments đã hoàn thành nhưng chưa được đánh giá.

## Vị trí hiển thị
- **URL**: `http://localhost:3000/user/appointments`
- **Component**: `app/user/appointments/page.tsx`
- **Tính năng**: Filter "Chờ đánh giá" và review section cho completed appointments

## Tính năng mới

### 1. Filter "Chờ đánh giá"
```tsx
<Button
  variant={filterStatus === "REVIEW_PENDING" ? "default" : "outline"}
  size="sm"
  onClick={() => setFilterStatus("REVIEW_PENDING")}
  className="bg-yellow-600 hover:bg-yellow-700 text-white"
>
  <Star className="h-4 w-4 mr-1" />
  Chờ đánh giá
</Button>
```

**Logic filtering:**
```tsx
if (filterStatus === "REVIEW_PENDING") {
  // Special filter for appointments that are completed but not yet reviewed
  filteredAppointments = appointmentsData.filter(apt => {
    return apt.status === "COMPLETED" && 
           appointmentReviewStatus[apt.id] && 
           appointmentReviewStatus[apt.id].canReview
  })
}
```

### 2. Review Section cho Completed Appointments
```tsx
{/* Review Section for Completed Appointments */}
{appointment.status === "COMPLETED" && appointmentReviewStatus[appointment.id] && (
  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Star className="h-5 w-5 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">
          Đánh giá dịch vụ
        </span>
      </div>
      {/* Review button hoặc status */}
    </div>
  </div>
)}
```

### 3. Các trạng thái hiển thị

#### A. Có thể đánh giá
- Hiển thị nút "Đánh giá ngay" màu xanh
- Click để mở modal đánh giá
- Icon ⭐

#### B. Đã đánh giá
- Hiển thị "Đã đánh giá" màu xanh
- Icon ⭐ đã fill
- Không xuất hiện trong filter "Chờ đánh giá"

#### C. Không thể đánh giá
- Hiển thị "Không thể đánh giá" màu xám
- Có thể do không đủ điều kiện

## Cập nhật Component

### Imports mới
```tsx
import { Star } from "lucide-react"
import { canUserReviewAppointment, type CanReviewResponse } from "@/lib/api/ReviewAppointmentApi"
import { ReviewAppointmentModal } from "@/components/review/ReviewAppointmentModal"
```

### State mới
```tsx
// Review modal state
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
  loadAppointments()
  
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

## Filter Logic

### 1. Filter "Chờ đánh giá"
- **Điều kiện**: `status === "COMPLETED"` AND `canReview === true`
- **Mục đích**: Hiển thị chỉ những appointments đã hoàn thành nhưng chưa được đánh giá
- **UI**: Button màu vàng với icon ⭐

### 2. Filter khác
- **Tất cả**: Hiển thị tất cả appointments
- **Hoàn thành**: Hiển thị appointments có status = "COMPLETED"
- **Chờ xác nhận**: Hiển thị appointments có status = "PENDING"
- **Đã xác nhận**: Hiển thị appointments có status = "CONFIRMED"
- **Đã hủy**: Hiển thị appointments có status = "CANCELLED"

## UI/UX Improvements

### 1. Visual Design
- Filter button "Chờ đánh giá" có màu vàng nổi bật
- Review section có background xanh nhạt
- Icon star consistent trong toàn bộ UI
- Button styling nhất quán

### 2. User Experience
- Filter giúp user dễ dàng tìm appointments cần đánh giá
- Review section chỉ hiện cho completed appointments
- Real-time updates sau khi đánh giá
- Clear status indicators

### 3. Performance
- Chỉ load review status cho completed appointments
- Optimistic updates cho better UX
- Efficient filtering logic

## Business Logic

### 1. Điều kiện hiển thị review section
- Appointment phải có status = "COMPLETED"
- Review status phải được load thành công
- User phải có quyền đánh giá

### 2. Filter "Chờ đánh giá"
- Chỉ hiển thị completed appointments
- Chỉ hiển thị appointments có thể đánh giá
- Loại bỏ appointments đã được đánh giá

### 3. State Management
- Review status được cache trong component state
- Auto-refresh khi có thay đổi
- Consistent state across filters

## Testing

### 1. Manual Testing
1. Truy cập `/user/appointments`
2. Xem filter buttons, đặc biệt là "Chờ đánh giá"
3. Click vào filter "Chờ đánh giá"
4. Kiểm tra chỉ hiển thị completed appointments chưa đánh giá
5. Click "Đánh giá ngay" trên appointment
6. Điền rating và comment
7. Submit review
8. Kiểm tra appointment không còn trong filter "Chờ đánh giá"

### 2. Test File
- `test-appointments-review-feature.html` - Test các scenario khác nhau

### 3. API Testing
```bash
# Test appointments endpoint
GET /apis/user/appointments/my?page=0&size=10

# Test review status
GET /apis/review-appointment/can-review/{appointmentId}

# Test create review
POST /apis/review-appointment
```

## Integration Points

### 1. Existing Components
- Tích hợp với `ReviewAppointmentModal` đã có
- Sử dụng API endpoints đã tạo
- Kế thừa appointment loading logic

### 2. Data Flow
```
Load Appointments → Load Review Status → Apply Filters → Show Review UI → Handle Review → Update Status → Refresh
```

### 3. State Dependencies
- `appointmentReviewStatus` affects filtering
- Review submission triggers data refresh
- Filter changes trigger re-render

## Performance Considerations

### 1. API Calls
- Chỉ load review status cho completed appointments
- Cache review status trong component state
- Batch API calls khi possible

### 2. Filtering
- Client-side filtering cho better UX
- Efficient filter logic
- Minimal re-renders

### 3. Memory Management
- Cleanup review status khi component unmount
- Optimize state updates
- Avoid unnecessary API calls

## Future Enhancements

### 1. Tính năng có thể thêm
- Bulk review actions
- Review reminders
- Review analytics
- Export review data

### 2. UI Improvements
- Advanced filters (date range, garage, etc.)
- Review progress indicator
- Better mobile experience
- Dark mode support

### 3. Performance
- Virtual scrolling cho large lists
- Lazy loading cho review status
- Caching strategies

## Troubleshooting

### 1. Lỗi thường gặp
- Filter "Chờ đánh giá" không hiện appointments: Kiểm tra review status loading
- Review section không hiện: Kiểm tra appointment status
- Modal không mở: Kiểm tra component imports

### 2. Debug
- Console logs cho filter logic
- Network tab để check API calls
- Component state inspection

### 3. Common Issues
- Review status không load: Check authentication
- Filter không work: Check appointmentReviewStatus state
- UI không update: Check state dependencies

## Conclusion
Tính năng review đã được tích hợp thành công vào User Appointments page với filter "Chờ đánh giá" đặc biệt. Điều này giúp user dễ dàng tìm và đánh giá các dịch vụ đã hoàn thành, cải thiện đáng kể user experience và tăng engagement với hệ thống đánh giá.
