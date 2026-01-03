@echo off
echo ========================================
echo   Dayflow HR Pro - Server Status
echo ========================================
echo.
echo Checking servers...
echo.
echo Backend API: http://localhost:3001
curl -s http://localhost:3001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is RUNNING
) else (
    echo [X] Backend is NOT running
    echo     Start with: cd backend ^&^& npm run dev
)
echo.
echo Frontend App: http://localhost:8080
curl -s http://localhost:8080 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend is RUNNING
) else (
    echo [X] Frontend is NOT running
    echo     Start with: npm run dev
)
echo.
echo ========================================
echo   Open http://localhost:8080 in browser
echo ========================================
echo.
pause
