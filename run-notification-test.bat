@echo off
echo 🚀 Bắt đầu test hệ thống notification XeCare...
echo.

echo 📋 Kiểm tra các service cần thiết:
echo - Backend Spring Boot (port 8080)
echo - Frontend Next.js (port 3000)
echo - Database MySQL
echo.

echo ⏳ Chờ 3 giây để các service khởi động...
timeout /t 3 /nobreak >nul

echo.
echo 🧪 Chạy test script...
node test-notification-system.js

echo.
echo ✅ Test hoàn thành!
echo.
echo 📖 Để xem tài liệu chi tiết, mở file: NOTIFICATION_SYSTEM_README.md
echo.
pause
