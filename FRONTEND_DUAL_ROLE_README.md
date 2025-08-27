# Frontend Dual Role System Implementation

## 🎯 **Tổng quan**

Frontend đã được cập nhật để support Dual Role System, cho phép user có nhiều vai trò cùng lúc và UI thích ứng theo capabilities.

## 🔧 **Frontend Changes**

### **1. API Client (`services/userRoleApi.ts`)**
- ✅ **UserRoleApiClient**: Real API client cho role management
- ✅ **Mock API Client**: Mock data cho development
- ✅ **Type Definitions**: `UserRole`, `RoleManagementRequest`, etc.
- ✅ **All CRUD Operations**: Add, remove, set roles, convert users

### **2. Custom Hook (`hooks/useUserRoles.ts`)**
- ✅ **State Management**: Users, dual role users, capability-based lists
- ✅ **Actions**: Add/remove roles, convert users, validate roles
- ✅ **Real-time Updates**: Auto-update all related lists
- ✅ **Error Handling**: Comprehensive error management

### **3. UI Components**

#### **UserRoleCard (`components/user/UserRoleCard.tsx`)**
- ✅ **Role Display**: Visual badges với icons và colors
- ✅ **Capability Display**: Show what user can do
- ✅ **Action Buttons**: Add/remove roles, convert users
- ✅ **Loading States**: Visual feedback during operations

#### **User Roles Management Page (`app/admin/user-roles/page.tsx`)**
- ✅ **Stats Dashboard**: Overview of user distribution
- ✅ **Search & Filter**: Find users by name, email, role
- ✅ **View Modes**: All users, dual role, capability-based
- ✅ **Bulk Operations**: Manage multiple users

### **4. Authentication Context (`hooks/use-auth.tsx`)**
- ✅ **Dual Role Support**: `roles` array field
- ✅ **Legacy Compatibility**: Backward compatibility với `role` field
- ✅ **New Helper Methods**: `hasRole()`, `canBookAppointments()`, etc.
- ✅ **Capability Checks**: Dynamic permission checking

### **5. Navigation Updates (`components/header.tsx`)**
- ✅ **Role Display**: Show multiple roles in header
- ✅ **Dual Role Indicator**: Visual indicator for dual role users
- ✅ **Dynamic Dashboard**: Route based on highest role

### **6. Unified Dashboard (`app/dashboard/page.tsx`)**
- ✅ **Role-Adaptive UI**: Different actions based on capabilities
- ✅ **Quick Actions**: Role-specific action buttons
- ✅ **Stats Display**: Role-relevant statistics
- ✅ **Profile & Capabilities**: User info and permissions

## 🚀 **Features**

### **Role Management**
```typescript
// Add role to user
await addRoleToUser(userId, 'GARAGE');

// Remove role from user  
await removeRoleFromUser(userId, 'ADMIN');

// Convert user to garage owner
await convertToGarageOwner(userId);
```

### **Capability Checking**
```typescript
// Check specific role
if (hasRole('GARAGE')) { /* ... */ }

// Check capabilities
if (canBookAppointments()) { /* ... */ }
if (canManageGarages()) { /* ... */ }
if (canManageSystem()) { /* ... */ }

// Check dual role
if (isDualRole()) { /* ... */ }
```

### **UI Adaptation**
- **User Actions**: Search garage, book appointments
- **Garage Actions**: Manage garages, register new garage
- **Admin Actions**: System management, user role management

## 📱 **User Interface**

### **Header Display**
```
Nguyen Văn A
user@gmail.com
🔵 USER 🟢 GARAGE (Dual)
```

### **Dashboard Actions**
- **USER**: Tìm kiếm Garage, Đặt lịch
- **GARAGE**: Quản lý Garage, Đăng ký Garage mới
- **ADMIN**: Quản lý Hệ thống, Quản lý User Roles

### **Role Management UI**
- **Role Badges**: Color-coded with icons
- **Capability Indicators**: Visual checkmarks
- **Action Buttons**: Add/remove roles
- **Quick Conversions**: Make garage owner, make admin

## 🔄 **Data Flow**

### **1. User Login**
```
Login → AuthContext → Check roles → Set capabilities
```

### **2. Role Management**
```
Admin Action → API Call → Update User → Refresh Lists → Update UI
```

### **3. UI Adaptation**
```
User Roles → Check Capabilities → Show/Hide Components → Update Navigation
```

## 🧪 **Testing**

### **Test Scenarios**
1. **User with USER role**: Can book appointments, cannot manage garages
2. **User with USER + GARAGE roles**: Can book appointments AND manage garages
3. **User with USER + ADMIN roles**: Can do everything
4. **Role conversion**: USER → USER + GARAGE
5. **Role removal**: Remove GARAGE role, keep USER role

### **Test Commands**
```bash
# Start development server
npm run dev

# Access pages
http://localhost:3000/dashboard
http://localhost:3000/admin/user-roles
http://localhost:3000/search/page1
```

## 🔧 **Configuration**

### **Environment Variables**
```typescript
// config/env.ts
export const config = {
  ENABLE_DUAL_ROLE_SYSTEM: true,
  USE_MOCK_DATA: true, // For development
  API_BASE_URL: 'http://localhost:8080',
};
```

### **Mock Data**
```typescript
// services/userRoleApi.ts
export const mockUserRoleData: UserRole[] = [
  {
    id: 1,
    name: "Nguyen Văn A",
    roles: ["USER", "GARAGE"],
    canBookAppointments: true,
    canManageGarages: true,
    isDualRole: true,
  }
];
```

## 🎨 **UI Components**

### **Role Badges**
- **USER**: Blue badge with user icon
- **GARAGE**: Green badge with wrench icon  
- **ADMIN**: Purple badge with crown icon

### **Capability Indicators**
- **Can Book**: Green checkmark
- **Can Manage Garages**: Green checkmark
- **Can Manage System**: Purple checkmark

### **Action Buttons**
- **Add Role**: Outline button with plus icon
- **Remove Role**: Outline button with minus icon (red)
- **Convert**: Solid button with role-specific color

## 🔒 **Security Considerations**

### **Frontend Security**
- ✅ **Role Validation**: Check roles before showing actions
- ✅ **Capability Checks**: Verify permissions before operations
- ✅ **Error Handling**: Graceful handling of permission errors
- ✅ **Loading States**: Prevent multiple simultaneous operations

### **API Security**
- ✅ **Authentication**: All API calls require authentication
- ✅ **Authorization**: Backend validates permissions
- ✅ **Input Validation**: Validate role names and combinations
- ✅ **Error Responses**: Proper error messages for security issues

## 📋 **Next Steps**

### **Immediate Tasks**
1. ✅ **Backend Integration**: Connect to real API endpoints
2. ✅ **Error Handling**: Improve error messages and recovery
3. ✅ **Loading States**: Add loading indicators for all operations
4. ✅ **Validation**: Client-side role validation

### **Future Enhancements**
1. **Role Workflows**: Approval process for role changes
2. **Audit Logging**: Track role changes in frontend
3. **Bulk Operations**: Manage multiple users at once
4. **Role Templates**: Predefined role combinations
5. **Advanced Filtering**: Filter by capabilities, creation date, etc.

## 🐛 **Troubleshooting**

### **Common Issues**
1. **Roles not updating**: Check API response format
2. **UI not adapting**: Verify capability checks
3. **Mock data issues**: Check mock data structure
4. **Authentication errors**: Verify token and permissions

### **Debug Commands**
```typescript
// Check user roles
console.log(user.roles);

// Check capabilities
console.log(canBookAppointments());
console.log(canManageGarages());

// Check API responses
console.log(await userRoleApi.getDualRoleUsers());
```

## 📞 **Support**

Nếu gặp vấn đề:
1. **Check browser console** for errors
2. **Verify API endpoints** are accessible
3. **Check user permissions** in AuthContext
4. **Validate role data** structure
5. **Test with mock data** first

## 🎉 **Success Metrics**

- ✅ **Dual Role Users**: Can book appointments AND manage garages
- ✅ **UI Adaptation**: Different actions based on capabilities
- ✅ **Role Management**: Admin can manage user roles
- ✅ **Backward Compatibility**: Old code still works
- ✅ **User Experience**: Smooth role transitions
