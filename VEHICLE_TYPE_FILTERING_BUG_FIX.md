# Vehicle Type Filtering Bug Fix

## Vấn đề được báo cáo
User 1 có loại xe 2, garage 1 cũng có xe 2 nhưng không hiển thị xe đó lên trong dropdown loại xe.

## Nguyên nhân gốc rễ

### 1. **Thiếu `vehicleTypeId` trong UserVehicleTypeResponseDto**
- **Vấn đề**: Backend DTO `UserVehicleTypeResponseDto` không có field `vehicleTypeId`
- **Hậu quả**: Frontend không thể so sánh `user.vehicleTypeId` với `garage.vehicleTypeId`
- **Kết quả**: Logic lọc không hoạt động, không hiển thị loại xe phù hợp

### 2. **Cấu trúc dữ liệu không khớp**
```typescript
// Garage Vehicle Type
interface GarageVehicleType {
  id: number;
  vehicleTypeId: number;  // ✅ Có vehicleTypeId
  vehicleTypeName: string;
}

// User Vehicle (trước khi sửa)
interface UserVehicle {
  id: number;
  vehicleTypeName: string;  // ❌ Chỉ có tên, không có ID
  // Thiếu vehicleTypeId
}
```

## Giải pháp đã thực hiện

### 1. **Cập nhật Backend DTO**
```java
// UserVehicleTypeResponseDto.java
@Data
@Builder
public class UserVehicleTypeResponseDto {
    private Integer id;
    private String vehicleName;
    private String brand;
    private String model;
    private String color;
    private String licensePlate;
    private Integer year;
    private Integer categoryId;        // ✅ Thêm categoryId
    private String categoryName;
    private Long vehicleTypeId;        // ✅ Thêm vehicleTypeId
    private String vehicleTypeName;
    private boolean isLocked;
    private String lockReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 2. **Cập nhật fromEntity method**
```java
public static UserVehicleTypeResponseDto fromEntity(UserVehicleType entity) {
    return UserVehicleTypeResponseDto.builder()
            .id(entity.getId())
            .vehicleName(entity.getVehicleName())
            .brand(entity.getBrand())
            .model(entity.getModel())
            .color(entity.getColor())
            .licensePlate(entity.getLicensePlate())
            .year(entity.getYear())
            .categoryId(entity.getCategory().getId())           // ✅ Thêm
            .categoryName(entity.getCategory().getName())
            .vehicleTypeId(entity.getVehicleType().getId())     // ✅ Thêm
            .vehicleTypeName(entity.getVehicleType().getName())
            .isLocked(entity.isLocked())
            .lockReason(entity.getLockReason())
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
}
```

### 3. **Cập nhật Frontend Interface**
```typescript
// types/users/userVehicle.ts
export interface UserVehicleTypeResponseDto {
  id: number;
  vehicleName: string;
  brand: string;
  model: string;
  color: string;
  licensePlate: string;
  year: number;
  categoryId: number;        // ✅ Thêm
  categoryName: string;
  vehicleTypeId: number;     // ✅ Thêm
  vehicleTypeName: string;
  isLocked: boolean;
  lockReason: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### 4. **Thêm Debug Logging**
```typescript
// app/booking/[garageId]/page.tsx
useEffect(() => {
  console.log("🔍 Debug Vehicle Type Filtering:")
  console.log("  - vehicleTypes (garage):", vehicleTypes)
  console.log("  - userVehicles:", userVehicles)
  
  if (vehicleTypes.length > 0 && userVehicles.length > 0) {
    const userVehicleTypeIds = new Set(userVehicles.map(vehicle => vehicle.vehicleTypeId))
    console.log("  - userVehicleTypeIds:", Array.from(userVehicleTypeIds))
    
    const filtered = vehicleTypes.filter(garageVehicleType => {
      const hasMatch = userVehicleTypeIds.has(garageVehicleType.vehicleTypeId)
      console.log(`  - Checking garage vehicle type ${garageVehicleType.vehicleTypeId} (${garageVehicleType.vehicleTypeName}): ${hasMatch}`)
      return hasMatch
    })
    
    console.log("  - filtered vehicle types:", filtered)
    setAvailableVehicleTypes(filtered)
  }
}, [vehicleTypes, userVehicles])
```

## Kết quả sau khi sửa

### Trước khi sửa:
```javascript
// Logic lọc không hoạt động vì thiếu vehicleTypeId
const userVehicleTypeIds = new Set(userVehicles.map(vehicle => vehicle.vehicleTypeId))
// vehicleTypeId = undefined → Set rỗng → không có match
```

### Sau khi sửa:
```javascript
// Logic lọc hoạt động chính xác
const userVehicleTypeIds = new Set(userVehicles.map(vehicle => vehicle.vehicleTypeId))
// vehicleTypeId = 2 → Set có [2] → match với garage.vehicleTypeId = 2
```

## Test Cases

### Test Case 1: User có xe loại 2, Garage phục vụ loại 2
- **Input**: 
  - User 1 có xe với `vehicleTypeId = 2`
  - Garage 1 có vehicle type với `vehicleTypeId = 2`
- **Expected**: Hiển thị loại xe 2 trong dropdown
- **Result**: ✅ Hoạt động

### Test Case 2: User có xe loại 1, Garage chỉ phục vụ loại 2
- **Input**:
  - User 1 có xe với `vehicleTypeId = 1`
  - Garage 1 chỉ có vehicle type với `vehicleTypeId = 2`
- **Expected**: Không hiển thị loại xe nào, thông báo không phù hợp
- **Result**: ✅ Hoạt động

### Test Case 3: User chưa có xe
- **Input**: User 1 chưa có xe nào
- **Expected**: Không hiển thị loại xe nào, thông báo chưa có xe
- **Result**: ✅ Hoạt động

## Debug Tools

### 1. **Console Logging**
- Thêm debug logging trong frontend để theo dõi dữ liệu
- Hiển thị garage vehicle types, user vehicles, và kết quả lọc

### 2. **Test Scripts**
- `debug-booking-vehicle-types.js`: Kiểm tra API endpoints
- `test-vehicle-type-matching.js`: Kiểm tra ID matching

### 3. **API Testing**
```bash
# Test garage vehicle types
curl http://localhost:8080/apis/garage/1/vehicle-types

# Test user vehicles (cần authentication)
curl -H "Authorization: Bearer TOKEN" http://localhost:8080/apis/user/vehicles

# Test all vehicle types
curl http://localhost:8080/apis/v1/vehicle
```

## Lưu ý quan trọng

1. **Kiểu dữ liệu**: `vehicleTypeId` trong garage là `Long`, trong user cũng là `Long`
2. **Authentication**: User vehicles API cần JWT token
3. **Data consistency**: Đảm bảo vehicle type IDs khớp giữa garage và user
4. **Error handling**: Xử lý trường hợp không có dữ liệu hoặc lỗi API

## Kết luận

Vấn đề đã được giải quyết hoàn toàn bằng cách:
1. ✅ Thêm `vehicleTypeId` vào backend DTO
2. ✅ Cập nhật frontend interface
3. ✅ Thêm debug logging
4. ✅ Tạo test scripts để verify

Bây giờ logic lọc vehicle types sẽ hoạt động chính xác, chỉ hiển thị những loại xe mà user thực sự sở hữu và garage có thể phục vụ.
