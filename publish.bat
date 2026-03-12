@echo off
echo ===================================================
echo   DEPLOYMENT SCRIPT FOR CNDES CALENDAR (WINDOWS)
echo ===================================================
echo.

echo [1/5] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing root dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/5] Installing server dependencies...
if exist "server" (
    cd server
    call npm install
    if %errorlevel% neq 0 (
        echo Error installing server dependencies.
        cd ..
        pause
        exit /b %errorlevel%
    )
    cd ..
) else (
    echo Server folder not found, skipping server dependencies.
)

echo.
echo [3/5] Building frontend application...
call npm run build
if %errorlevel% neq 0 (
    echo Error building frontend.
    pause
    exit /b %errorlevel%
)

echo.
echo [4/5] Checking PM2 installation...
where pm2 >nul 2>nul
if %errorlevel% neq 0 (
    echo PM2 is not installed. Installing PM2 globally...
    call npm install -g pm2
    if %errorlevel% neq 0 (
        echo Error installing PM2.
        pause
        exit /b %errorlevel%
    )
) else (
    echo PM2 is already installed.
)

echo.
echo [5/5] Starting/Reloading application with PM2...
call pm2 startOrReload ecosystem.config.cjs
if %errorlevel% neq 0 (
    echo Error starting PM2.
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo   DEPLOYMENT SUCCESSFUL
echo ===================================================
echo.
call pm2 status
echo.
pause
