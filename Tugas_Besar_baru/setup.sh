#!/bin/bash
# Setup script untuk Futsal Booking System
# Run this script dari root folder project untuk setup otomatis

echo "========================================="
echo "Futsal Booking System - Setup Script"
echo "========================================="

# 1. Install dependencies
echo ""
echo "1. Installing Node.js dependencies..."
npm install

# 2. Create .env file
echo ""
echo "2. Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "   ✓ .env created. Please edit with your database credentials."
else
    echo "   ✓ .env already exists."
fi

# 3. Instructions
echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env with your PostgreSQL credentials"
echo "2. Setup PostgreSQL database:"
echo "   - psql -U postgres"
echo "   - CREATE DATABASE booking_futsal;"
echo "   - \\c booking_futsal"
echo "   - (Copy-paste content from DataBase_booking_futsal/BOOKING_FUTSAL_FINAL.sql)"
echo ""
echo "3. Start the backend server:"
echo "   npm run dev"
echo ""
echo "4. Open frontend in browser:"
echo "   file:///<path-to-project>/index.html"
echo ""
echo "API will be available at: http://localhost:3000/api"
echo ""
