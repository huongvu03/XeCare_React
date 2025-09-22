# Hero Component - Links Debug Guide

## 🚨 Vấn đề
Đường link trong `hero.tsx` không hoạt động. Người dùng click vào các button nhưng không được chuyển hướng đến trang đích.

## 🔍 Nguyên nhân có thể

### 1. **Button với asChild + Slot**
```tsx
<Button asChild>
  <Link href="/search">Tìm kiếm</Link>
</Button>
```
- **Vấn đề**: Radix UI Slot có thể gây xung đột với Next.js Link
- **Giải pháp**: Sử dụng `useRouter` thay vì Link

### 2. **Next.js Link không hoạt động**
- **Vấn đề**: Link component có thể bị conflict với routing
- **Giải pháp**: Sử dụng `router.push()` trực tiếp

### 3. **CSS hoặc JavaScript blocking**
- **Vấn đề**: CSS `pointer-events: none` hoặc JavaScript prevent default
- **Giải pháp**: Kiểm tra CSS và event handlers

## 🛠️ Giải pháp

### **Giải pháp 1: Sử dụng useRouter (Khuyến nghị)**

```tsx
"use client"
import { useRouter } from "next/navigation"

export function Hero() {
  const router = useRouter()

  const handleSearchClick = () => {
    router.push("/search")
  }

  const handleEmergencyClick = () => {
    router.push("/emergency")
  }

  return (
    <Button onClick={handleSearchClick}>
      <MapPin className="mr-2 h-4 w-4" />
      Đặt lịch ngay
    </Button>
  )
}
```

### **Giải pháp 2: Sử dụng Link trực tiếp (không qua Button)**

```tsx
import Link from "next/link"

<Link 
  href="/search" 
  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
>
  <MapPin className="mr-2 h-4 w-4" />
  Đặt lịch ngay
</Link>
```

### **Giải pháp 3: Sử dụng window.location (fallback)**

```tsx
const handleClick = (path: string) => {
  window.location.href = path
}
```

## 🧪 Cách test

### **Bước 1: Test với component đơn giản**
```
http://localhost:3000/test-hero-simple
```

### **Bước 2: Test với debug component**
```
http://localhost:3000/test-hero-links
```

### **Bước 3: Kiểm tra console logs**
1. Mở Developer Tools (F12)
2. Click vào các button
3. Xem console logs
4. Kiểm tra Network tab

## 📋 Checklist Debug

### ✅ **Kiểm tra Button Component**
- [ ] Button có `onClick` handler không
- [ ] Không có `disabled` attribute
- [ ] CSS không có `pointer-events: none`

### ✅ **Kiểm tra Link Component**
- [ ] Link có `href` attribute
- [ ] Đường dẫn tồn tại trong app router
- [ ] Không có JavaScript errors

### ✅ **Kiểm tra Routing**
- [ ] `/search` page tồn tại
- [ ] `/emergency` page tồn tại
- [ ] Next.js router hoạt động bình thường

### ✅ **Kiểm tra Console**
- [ ] Không có JavaScript errors
- [ ] Click events được trigger
- [ ] Router navigation logs

## 🎯 Files đã tạo

### **1. HeroSimple Component**
- `components/hero-simple.tsx`
- Sử dụng `useRouter` thay vì Link
- Test page: `/test-hero-simple`

### **2. HeroDebug Component**
- `components/hero-debug.tsx`
- Test nhiều cách navigation
- Test page: `/test-hero-links`

## 🚀 Cách sử dụng

### **Option 1: Thay thế Hero component**
```tsx
// Thay vì
import { Hero } from "@/components/hero"

// Sử dụng
import { HeroSimple } from "@/components/hero-simple"
```

### **Option 2: Sửa Hero component gốc**
```tsx
// Thay đổi từ
<Button asChild>
  <Link href="/search">Tìm kiếm</Link>
</Button>

// Thành
<Button onClick={() => router.push("/search")}>
  Tìm kiếm
</Button>
```

## 🔧 Quick Fix

Nếu muốn sửa nhanh Hero component gốc:

1. **Import useRouter**:
```tsx
import { useRouter } from "next/navigation"
```

2. **Thêm router hook**:
```tsx
const router = useRouter()
```

3. **Thay thế Button + Link**:
```tsx
// Từ
<Button asChild>
  <Link href="/search">Tìm kiếm</Link>
</Button>

// Thành
<Button onClick={() => router.push("/search")}>
  Tìm kiếm
</Button>
```

## ✅ Kết quả mong đợi

Sau khi áp dụng fix:
- ✅ Click button → Navigation hoạt động
- ✅ Console logs hiển thị click events
- ✅ Không có JavaScript errors
- ✅ User được chuyển đến trang đúng

## 📞 Support

Nếu vẫn gặp vấn đề:
1. Kiểm tra console errors
2. Test với các component debug
3. Kiểm tra Next.js version
4. Kiểm tra browser compatibility
