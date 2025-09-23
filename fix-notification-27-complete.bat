@echo off
echo ========================================
echo    Fix Notification ID 27 Complete
echo ========================================
echo.

echo 1. Debugging Notification ID 27...
echo.
node debug-notification-27.js
echo.

echo 2. Fixing Notification ID 27...
echo.
node fix-notification-27.js
echo.

echo 3. Update Notification ID 27...
echo.
node update-notification-27.js
echo.

echo ========================================
echo    Fix completed!
echo ========================================
echo.
echo Next steps:
echo 1. Use SQL to update notification ID 27 recipientId
echo 2. Test the notification page in your frontend
echo 3. Try clicking the "Da doc" button on new notifications
echo 4. Check if the 403 error is gone
echo.
pause
