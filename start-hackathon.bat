@echo off
echo ========================================
echo   Dayflow HR Pro - Hackathon Edition
echo ========================================
echo.
echo Starting Backend Server...
echo.
cd backend
start cmd /k "npm run dev"
cd ..
echo.
echo Backend started on http://localhost:3001
echo.
echo Starting Frontend Server...
echo.
start cmd /k "npm run dev"
echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Frontend: http://localhost:8080
echo Backend:  http://localhost:3001
echo.
echo Press any key to exit this window...
pause >nul
