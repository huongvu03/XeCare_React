# Vehicle Selection Feature - Booking Page

## Tổng quan
Tính năng cho phép user chọn xe cụ thể từ danh sách xe của họ khi đặt lịch hẹn tại garage. Thông tin xe sẽ được lưu vào bảng `appointments` để garage có thể xem chi tiết.

## Luồng hoạt động

### 1. **Lọc loại xe theo user**
- Hệ thống chỉ hiển thị những loại xe mà:
  - Garage có thể phục vụ
  - User thực sự sở hữu xe thuộc loại đó

### 2. **Chọn loại xe**
- User chọn loại xe từ dropdown đã được lọc
- Hệ thống hiển thị thông tin chi tiết về loại xe

### 3. **Chọn xe cụ thể**
- Sau khi chọn loại xe, hiển thị dropdown "Chọn xe của bạn"
- Chỉ hiển thị những xe của user thuộc loại đã chọn và không bị khóa

### 4. **Hiển thị thông tin xe**
- Khi chọn xe, hiển thị card thông tin chi tiết:
  - Tên xe
  - Hãng và model
  - Năm sản xuất
  - Biển số
  - Màu sắc
  - Loại xe

### 5. **Lưu thông tin vào appointment**
- Khi submit form, thông tin xe được gửi kèm:
  - `vehicleBrand`
  - `vehicleModel`
  - `licensePlate`
  - `vehicleYear`

## Cấu trúc dữ liệu

### Frontend State
```typescript
// Vehicle type filtering
const [availableVehicleTypes, setAvailableVehicleTypes] = useState<GarageVehicleType[]>([])

// User vehicles
const [userVehicles, setUserVehicles] = useState<Vehicle[]>([])
const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])

// Selected items
const [selectedVehicleType, setSelectedVehicleType] = useState<number | null>(null)
const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
```

### Backend DTO
```java
// CreateAppointmentRequestDto
public class CreateAppointmentRequestDto {
    // ... existing fields ...
    
    // Vehicle Information
    private String vehicleBrand;
    private String vehicleModel;
    private String licensePlate;
    private Integer vehicleYear;
}
```

### Database Entity
```java
// Appointment entity (already existed)
@Entity
public class Appointment {
    // ... existing fields ...
    
    @Column(name = "vehicle_brand")
    private String vehicleBrand;
    
    @Column(name = "vehicle_model")
    private String vehicleModel;
    
    @Column(name = "license_plate")
    private String licensePlate;
    
    @Column(name = "vehicle_year")
    private Integer vehicleYear;
}
```

## Logic lọc và validation

### 1. **Lọc loại xe khả dụng**
```typescript
useEffect(() => {
  if (vehicleTypes.length > 0 && userVehicles.length > 0) {
    const userVehicleTypeIds = new Set(userVehicles.map(vehicle => vehicle.vehicleTypeId))
    const filtered = vehicleTypes.filter(garageVehicleType => 
      userVehicleTypeIds.has(garageVehicleType.vehicleTypeId)
    )
    setAvailableVehicleTypes(filtered)
  }
}, [vehicleTypes, userVehicles])
```

### 2. **Lọc xe theo loại**
```typescript
const handleVehicleTypeChange = (vehicleTypeId: string) => {
  const newVehicleTypeId = vehicleTypeId === "" ? null : Number(vehicleTypeId)
  setSelectedVehicleType(newVehicleTypeId)
  
  if (newVehicleTypeId) {
    const filtered = userVehicles.filter(vehicle => 
      vehicle.vehicleTypeId === newVehicleTypeId && !vehicle.locked
    )
    setFilteredVehicles(filtered)
  } else {
    setFilteredVehicles([])
  }
  
  setSelectedVehicle(null) // Reset selected vehicle
}
```

### 3. **Validation**
```typescript
// Check if user has vehicles of the selected type but hasn't selected a specific vehicle
if (filteredVehicles.length > 0 && !selectedVehicle) {
  setError("Vui lòng chọn xe cụ thể để đặt lịch hẹn.")
  return
}
```

## UI Components

### 1. **Vehicle Type Dropdown**
```tsx
<select
  id="vehicleType"
  value={selectedVehicleType || ""}
  onChange={(e) => handleVehicleTypeChange(e.target.value)}
  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  required
>
  <option value="">-- Chọn loại xe --</option>
  {availableVehicleTypes.map(vehicleType => (
    <option key={vehicleType.id} value={vehicleType.vehicleTypeId}>
      {vehicleType.vehicleTypeName}
    </option>
  ))}
</select>
```

### 2. **Vehicle Selection Dropdown**
```tsx
{selectedVehicleType && filteredVehicles.length > 0 && (
  <div className="space-y-2">
    <Label htmlFor="vehicle">Chọn xe của bạn *</Label>
    <select
      id="vehicle"
      value={selectedVehicle?.id || ""}
      onChange={(e) => handleVehicleChange(e.target.value)}
      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      required
    >
      <option value="">-- Chọn xe của bạn --</option>
      {filteredVehicles.map(vehicle => (
        <option key={vehicle.id} value={vehicle.id}>
          {vehicle.vehicleName} - {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
        </option>
      ))}
    </select>
  </div>
)}
```

### 3. **Vehicle Information Display**
```tsx
{selectedVehicle && (
  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
    <div>
      <div className="font-medium text-blue-900">{selectedVehicle.vehicleName}</div>
      <div className="text-sm text-blue-700 mt-1">
        {selectedVehicle.brand} {selectedVehicle.model} • {selectedVehicle.year} • {selectedVehicle.licensePlate}
      </div>
      <div className="text-sm text-blue-600 mt-1">
        Màu: {selectedVehicle.color} • Loại: {selectedVehicle.vehicleTypeName}
      </div>
    </div>
  </div>
)}
```

## Error Handling

### 1. **Không có loại xe phù hợp**
```tsx
{availableVehicleTypes.length === 0 && (
  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
    <div className="text-red-800">
      <strong>Không có loại xe phù hợp:</strong> Bạn không có xe nào thuộc các loại mà garage này phục vụ.
    </div>
    <div className="text-sm text-red-700 mt-1">
      Vui lòng thêm xe vào tài khoản hoặc chọn garage khác phù hợp với xe của bạn.
    </div>
  </div>
)}
```

### 2. **Không có xe thuộc loại đã chọn**
```tsx
{selectedVehicleType && filteredVehicles.length === 0 && userVehicles.length > 0 && (
  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
    <div className="text-yellow-800">
      <strong>Không có xe phù hợp:</strong> Bạn không có xe nào thuộc loại "{selectedVehicleTypeName}".
    </div>
    <div className="text-sm text-yellow-700 mt-1">
      Vui lòng thêm xe thuộc loại này hoặc chọn loại xe khác.
    </div>
  </div>
)}
```

## Submit Button State

```tsx
<Button
  type="submit"
  disabled={
    submitting || 
    garage.status !== "ACTIVE" || 
    availableVehicleTypes.length === 0 || 
    (filteredVehicles.length > 0 && !selectedVehicle)
  }
  className="bg-gradient-to-r from-blue-600 to-cyan-600 flex-1"
>
```

## API Integration

### 1. **Fetch User Vehicles**
```typescript
const fetchUserVehicles = async () => {
  try {
    const response = await VehicleApi.getAll()
    if (response.data && response.data.content) {
      setUserVehicles(response.data.content)
    } else if (Array.isArray(response.data)) {
      setUserVehicles(response.data)
    }
  } catch (err: any) {
    console.error("Error fetching user vehicles:", err)
  }
}
```

### 2. **Create Appointment with Vehicle Data**
```typescript
const appointmentData: CreateAppointmentRequest = {
  garageId: garage.id,
  vehicleTypeId: selectedVehicleType,
  appointmentDate,
  appointmentTime: "09:00",
  description,
  contactPhone,
  contactEmail,
  services: [selectedService],
  // Vehicle information
  vehicleBrand: selectedVehicle?.brand || "",
  vehicleModel: selectedVehicle?.model || "",
  licensePlate: selectedVehicle?.licensePlate || "",
  vehicleYear: selectedVehicle?.year || null
}
```

## Test Cases

### 1. **User có xe phù hợp**
- **Input**: User có xe Honda Civic (loại xe máy), Garage phục vụ xe máy
- **Expected**: Hiển thị dropdown loại xe, chọn xe, hiển thị thông tin xe
- **Result**: ✅ Hoạt động

### 2. **User không có xe phù hợp**
- **Input**: User chỉ có xe ô tô, Garage chỉ phục vụ xe máy
- **Expected**: Hiển thị thông báo không có loại xe phù hợp
- **Result**: ✅ Hoạt động

### 3. **User có loại xe nhưng không có xe cụ thể**
- **Input**: User có loại xe máy nhưng tất cả xe đều bị khóa
- **Expected**: Hiển thị thông báo không có xe phù hợp
- **Result**: ✅ Hoạt động

### 4. **Submit appointment với thông tin xe**
- **Input**: Chọn xe Honda Civic, submit appointment
- **Expected**: Appointment được tạo với thông tin xe đầy đủ
- **Result**: ✅ Hoạt động

## Lợi ích

1. **Trải nghiệm người dùng tốt hơn**: User có thể chọn xe cụ thể thay vì nhập thông tin thủ công
2. **Dữ liệu chính xác**: Thông tin xe được lấy từ database, tránh lỗi nhập liệu
3. **Tự động hóa**: Hệ thống tự động lọc và hiển thị xe phù hợp
4. **Validation mạnh mẽ**: Đảm bảo user chọn đúng xe trước khi submit
5. **Thông tin đầy đủ**: Garage nhận được thông tin chi tiết về xe cần sửa chữa

## Kết luận

Tính năng Vehicle Selection đã được triển khai thành công với:
- ✅ UI/UX thân thiện và trực quan
- ✅ Logic lọc thông minh
- ✅ Validation đầy đủ
- ✅ Integration với backend hoàn chỉnh
- ✅ Error handling toàn diện
- ✅ Test cases đầy đủ

Bây giờ user có thể dễ dàng chọn xe cụ thể khi đặt lịch hẹn, và garage sẽ nhận được thông tin chi tiết về xe cần sửa chữa.
