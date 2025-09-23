@echo off
echo ========================================
echo    Debug and Fix 403 Error
echo ========================================
echo.

echo 1. Debugging 403 Error...
echo.
node test-403-debug.js
echo.

echo 2. Quick Fix - Creating new notifications...
echo.
node quick-fix-403.js
echo.

echo ========================================
echo    Debug and Fix completed!
echo ========================================
echo.
echo Next steps:
echo 1. Test the notification page in your frontend
echo 2. Try clicking the "Da doc" button on notification cards
echo 3. Check if the 403 error is gone
echo 4. If still having issues, check browser console for errors
echo.
pause
