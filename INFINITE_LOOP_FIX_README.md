# Infinite Loop Fix - User Appointments Page

## Vấn đề
Frontend gặp lỗi "Maximum update depth exceeded" trong trang User Appointments:

```
Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, 
but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.

at loadAppointments (app\user\appointments\page.tsx:101:7)
```

## Nguyên nhân
Infinite re-render loop xảy ra do:

1. **Circular Dependency**: `appointmentReviewStatus` được thêm vào dependency array của useEffect
2. **State Update Loop**: `appointmentReviewStatus` được update trong một useEffect khác
3. **Infinite Chain**: useEffect 1 → update appointmentReviewStatus → trigger useEffect 1 → infinite loop

### Code gây lỗi:
```tsx
// useEffect 1 - Load appointments
useEffect(() => {
  loadAppointments()
}, [currentPage, filterStatus, user, appointmentReviewStatus]) // ❌ appointmentReviewStatus dependency

// useEffect 2 - Load review status  
useEffect(() => {
  // Update appointmentReviewStatus
  setAppointmentReviewStatus(prev => ({ ...prev, [appointment.id]: response.data }))
}, [appointments]) // ❌ This triggers useEffect 1 again
```

## Giải pháp

### 1. Tách biệt State Management
```tsx
// Trước
const [appointments, setAppointments] = useState<Appointment[]>([])

// Sau
const [allAppointments, setAllAppointments] = useState<Appointment[]>([]) // Unfiltered data
const [appointments, setAppointments] = useState<Appointment[]>([]) // Filtered display data
```

### 2. Loại bỏ Circular Dependency
```tsx
// Trước
useEffect(() => {
  loadAppointments()
}, [currentPage, filterStatus, user, appointmentReviewStatus]) // ❌ Circular dependency

// Sau
useEffect(() => {
  loadAppointments()
}, [currentPage, filterStatus, user]) // ✅ No appointmentReviewStatus dependency
```

### 3. Tách Logic Filtering
```tsx
// Function riêng để filter appointments
const applyFilter = (appointmentsList: Appointment[]) => {
  if (!filterStatus) {
    setAppointments(appointmentsList)
    return
  }

  if (filterStatus === "REVIEW_PENDING") {
    // Filter for completed appointments that can be reviewed
    const filtered = appointmentsList.filter(apt => {
      return apt.status === "COMPLETED" && 
             appointmentReviewStatus[apt.id] && 
             appointmentReviewStatus[apt.id].canReview
    })
    setAppointments(filtered)
  } else {
    // Regular status filtering
    const filtered = appointmentsList.filter(apt => apt.status === filterStatus)
    setAppointments(filtered)
  }
}
```

### 4. Separate useEffect cho Filtering
```tsx
// Load appointments (no filtering)
useEffect(() => {
  loadAppointments()
}, [currentPage, filterStatus, user])

// Load review status
useEffect(() => {
  const loadReviewStatus = async () => {
    if (!allAppointments) return
    // Load review status for completed appointments
  }
  loadReviewStatus()
}, [allAppointments])

// Apply filter when data changes
useEffect(() => {
  applyFilter(allAppointments)
}, [allAppointments, filterStatus, appointmentReviewStatus])
```

## Files đã thay đổi

### `app/user/appointments/page.tsx`
- ✅ Thêm `allAppointments` state để lưu data không filter
- ✅ Tách logic filtering ra khỏi `loadAppointments`
- ✅ Tạo `applyFilter` function riêng
- ✅ Loại bỏ `appointmentReviewStatus` khỏi dependency array chính
- ✅ Sử dụng separate useEffect cho filtering
- ✅ Cập nhật `handleReviewSubmitted` để refresh đúng cách

## Data Flow mới

```
1. Load Appointments (API call)
   ↓
2. Set allAppointments (unfiltered data)
   ↓
3. Load Review Status (for completed appointments)
   ↓
4. Update appointmentReviewStatus
   ↓
5. Apply Filter (based on filterStatus + reviewStatus)
   ↓
6. Set appointments (filtered display data)
   ↓
7. Render UI
```

## Benefits

### 1. Performance
- ✅ No infinite re-renders
- ✅ Reduced API calls
- ✅ Better memory management
- ✅ Smoother UI interactions

### 2. Maintainability
- ✅ Clear separation of concerns
- ✅ Predictable data flow
- ✅ Easier debugging
- ✅ Better code organization

### 3. User Experience
- ✅ No page freezing
- ✅ Responsive filter buttons
- ✅ Smooth interactions
- ✅ Reliable functionality

## Testing

### 1. Manual Testing
- ✅ Open User Appointments page
- ✅ Check browser console for errors
- ✅ Test filter button switching
- ✅ Test review functionality
- ✅ Verify no infinite loops

### 2. Test File
- `test-infinite-loop-fix.html` - Comprehensive testing guide

### 3. Verification Points
- ✅ No "Maximum update depth exceeded" errors
- ✅ Reasonable number of API calls
- ✅ Filter buttons work correctly
- ✅ Review flow works end-to-end
- ✅ No memory leaks

## Prevention

### 1. Best Practices
- Avoid circular dependencies in useEffect
- Separate data loading from filtering logic
- Use separate state for raw vs. processed data
- Keep useEffect dependencies minimal

### 2. Code Review Checklist
- Check for circular dependencies in useEffect
- Verify state updates don't trigger infinite loops
- Ensure proper separation of concerns
- Test filter switching extensively

## Impact

### 1. Positive
- ✅ Infinite loop error resolved
- ✅ Better performance and user experience
- ✅ More maintainable code structure
- ✅ Reliable filter functionality

### 2. No Breaking Changes
- ✅ Same UI/UX behavior
- ✅ Same API endpoints
- ✅ Same functionality
- ✅ Better performance

## Conclusion
Lỗi infinite loop đã được sửa hoàn toàn bằng cách tách biệt state management và loại bỏ circular dependencies. User Appointments page hiện hoạt động mượt mà với filter "Chờ đánh giá" và review functionality hoạt động đúng cách.
