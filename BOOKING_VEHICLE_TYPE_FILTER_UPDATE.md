# Booking Page Vehicle Type Filter Update

## Vấn đề đã được giải quyết
Trước đây, trang booking (`http://localhost:3000/booking/1`) hiển thị tất cả các loại xe mà garage phục vụ, không lọc theo xe của user đăng nhập. Điều này gây nhầm lẫn vì user có thể chọn loại xe mà họ không sở hữu.

## Thay đổi đã thực hiện

### 1. Thêm State Management
```typescript
const [availableVehicleTypes, setAvailableVehicleTypes] = useState<GarageVehicleType[]>([])
```

### 2. Logic Lọc Vehicle Types
Thêm useEffect để lọc vehicle types dựa trên xe của user:
```typescript
useEffect(() => {
  if (vehicleTypes.length > 0 && userVehicles.length > 0) {
    // Lấy danh sách vehicle type IDs mà user có xe
    const userVehicleTypeIds = new Set(userVehicles.map(vehicle => vehicle.vehicleTypeId))
    
    // Lọc vehicle types của garage chỉ giữ lại những loại mà user có xe
    const filtered = vehicleTypes.filter(garageVehicleType => 
      userVehicleTypeIds.has(garageVehicleType.vehicleTypeId)
    )
    
    setAvailableVehicleTypes(filtered)
  } else if (vehicleTypes.length > 0 && userVehicles.length === 0) {
    // Nếu user chưa có xe nào, không hiển thị loại xe nào
    setAvailableVehicleTypes([])
  }
}, [vehicleTypes, userVehicles])
```

### 3. Cập nhật UI
- Thay thế `vehicleTypes` bằng `availableVehicleTypes` trong dropdown
- Thêm thông báo khi không có loại xe phù hợp
- Cập nhật validation logic

### 4. Thông báo cho User
- **Không có loại xe phù hợp**: Hiển thị thông báo đỏ khi user không có xe nào thuộc loại mà garage phục vụ
- **Chưa có xe**: Thông báo xanh khi user chưa thêm xe nào vào tài khoản
- **Không có xe phù hợp với loại đã chọn**: Thông báo vàng khi user chọn loại xe nhưng không có xe cụ thể

### 5. Validation Updates
```typescript
// Chỉ yêu cầu chọn loại xe nếu có loại xe phù hợp
if (availableVehicleTypes.length > 0 && !selectedVehicleType) {
  setError("Vui lòng chọn loại xe.")
  return
}

// Thông báo lỗi nếu không có loại xe phù hợp
if (availableVehicleTypes.length === 0) {
  setError("Bạn không có xe nào phù hợp với garage này. Vui lòng thêm xe vào tài khoản hoặc chọn garage khác.")
  return
}
```

### 6. Disable Submit Button
```typescript
disabled={submitting || garage.status !== "ACTIVE" || availableVehicleTypes.length === 0}
```

## Kết quả

### Trước khi sửa:
- Hiển thị tất cả loại xe mà garage phục vụ
- User có thể chọn loại xe mà họ không sở hữu
- Gây nhầm lẫn và trải nghiệm không tốt

### Sau khi sửa:
- ✅ Chỉ hiển thị loại xe mà user thực sự sở hữu
- ✅ Thông báo rõ ràng khi không có loại xe phù hợp
- ✅ Hướng dẫn user thêm xe hoặc chọn garage khác
- ✅ Validation chính xác và user-friendly
- ✅ Submit button được disable khi không thể đặt lịch

## Luồng hoạt động mới

1. **User truy cập booking page**
2. **Hệ thống tải:**
   - Thông tin garage
   - Dịch vụ của garage
   - Loại xe mà garage phục vụ
   - Xe của user đăng nhập
3. **Lọc loại xe:**
   - Chỉ giữ lại loại xe mà user có xe thuộc loại đó
   - Nếu user chưa có xe → không hiển thị loại xe nào
4. **Hiển thị UI:**
   - Nếu có loại xe phù hợp → hiển thị dropdown
   - Nếu không có → hiển thị thông báo và disable submit
5. **User chọn loại xe:**
   - Hệ thống lọc xe của user theo loại đã chọn
   - Hiển thị dropdown chọn xe cụ thể (nếu có)
6. **Validation:**
   - Kiểm tra user đã chọn loại xe (nếu có)
   - Kiểm tra user đã chọn xe cụ thể (nếu có xe phù hợp)
   - Cho phép submit nếu tất cả điều kiện đều thỏa mãn

## Lợi ích

1. **Trải nghiệm người dùng tốt hơn**: User chỉ thấy những lựa chọn có ý nghĩa
2. **Giảm lỗi**: Không thể chọn loại xe không phù hợp
3. **Thông tin rõ ràng**: User hiểu tại sao không thể đặt lịch
4. **Hướng dẫn hành động**: User biết cần làm gì để có thể đặt lịch
5. **Tính nhất quán**: Dữ liệu hiển thị luôn chính xác với xe của user

## Test Cases

### Test Case 1: User có xe phù hợp
- **Input**: User có xe Honda Civic (loại Sedan), garage phục vụ Sedan
- **Expected**: Hiển thị "Sedan" trong dropdown, user có thể chọn và đặt lịch

### Test Case 2: User không có xe phù hợp
- **Input**: User chỉ có xe máy, garage chỉ phục vụ ô tô
- **Expected**: Hiển thị thông báo đỏ, submit button bị disable

### Test Case 3: User chưa có xe
- **Input**: User chưa thêm xe nào vào tài khoản
- **Expected**: Hiển thị thông báo xanh, submit button bị disable

### Test Case 4: User có xe nhưng bị khóa
- **Input**: User có xe phù hợp nhưng xe bị khóa
- **Expected**: Hiển thị loại xe nhưng không hiển thị xe cụ thể, thông báo xe bị khóa
