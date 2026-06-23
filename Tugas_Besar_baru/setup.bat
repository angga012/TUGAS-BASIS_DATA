@echo off
REM Setup script untuk Futsal Booking System di Windows
REM Run this dari Command Prompt atau PowerShell

echo.
echo =========================================
echo Futsal Booking System - Setup (Windows)
echo =========================================
echo.

REM 1. Install dependencies
echo 1. Installing Node.js dependencies...
call npm install

REM 2. Create .env file
echo.
echo 2. Creating .env file...
if not exist .env (
    copy .env.example .env
    echo    * .env created. Please edit with your database credentials.
) else (
    echo    * .env already exists.
)

REM 3. Instructions
echo.
echo =========================================
echo Setup Complete!
echo =========================================
echo.
echo Next steps:
echo 1. Edit .env dengan kredensial PostgreSQL Anda
echo.
echo 2. Setup PostgreSQL database:
echo    - Buka pgAdmin atau psql
echo    - CREATE DATABASE booking_futsal;
echo    - Copy-paste SQL dari DataBase_booking_futsal\BOOKING_FUTSAL_FINAL.sql
echo.
echo 3. Start the backend server:
echo    npm run dev
echo.
echo 4. Open frontend:
echo    file:///^<full-path^>/index.html
echo.
echo API: http://localhost:3000/api
echo.
pause
