@echo off
echo ========================================
echo    Fix Notification Button Issues
echo ========================================
echo.

echo 1. Testing Mark As Read 403 Fix...
echo.
node test-mark-as-read-403-fix.js
echo.

echo 2. Fixing User ID Mismatch...
echo.
node fix-user-id-mismatch.js
echo.

echo ========================================
echo    Fix completed!
echo ========================================
echo.
echo Next steps:
echo 1. Test the notification page in your frontend
echo 2. Try clicking the "Da doc" button on notification cards
echo 3. Check if the unread count decreases
echo 4. If still having issues, check browser console for errors
echo.
pause
