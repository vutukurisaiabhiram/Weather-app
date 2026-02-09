@echo off
echo.
echo =========================================
echo   Weather App Backend Server Startup
echo =========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo.
    echo ⚠️  .env file not found!
    echo Creating default .env file...
    echo.
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/weather-app
        echo JWT_SECRET=your_jwt_secret_key_change_this_in_production
        echo JWT_EXPIRE=7d
        echo NODE_ENV=development
    ) > .env
    echo ✅ .env file created. Please update it with your MongoDB connection URI.
    echo.
)

echo Starting MongoDB (if running locally)...
echo.
echo =========================================
echo   Starting Backend Server...
echo =========================================
echo.

call npm run dev

pause
