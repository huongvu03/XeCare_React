@echo off
echo ========================================
echo    Fix Favorites Images
echo ========================================
echo.

echo 1. Debugging Favorites Images...
echo.
node debug-favorites-images.js
echo.

echo 2. Testing Favorites Images...
echo.
node test-favorites-images.js
echo.

echo 3. Checking Backend Images...
echo.
node check-backend-images.js
echo.

echo ========================================
echo    Fix completed!
echo ========================================
echo.
echo Next steps:
echo 1. Check browser console for image load logs
echo 2. Verify images display in favorites page
echo 3. Test fallback images when main images fail
echo 4. Check network tab for image requests
echo.
pause
