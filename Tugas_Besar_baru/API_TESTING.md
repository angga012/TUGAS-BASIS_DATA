# API Testing Guide

## Prerequisites
- Backend running: `npm run dev` (http://localhost:3000)
- PostgreSQL database setup dan populated dengan SQL script
- Postman atau cURL untuk testing

## Test Endpoints

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```
Expected: `{"status":"ok"}`

### 2. Get All Bookings
```bash
curl http://localhost:3000/api/bookings
```
Expected: Array of booking objects

### 3. Create Booking (POST)
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "Test Customer",
    "field": "A1",
    "date": "2026-06-10",
    "time": "16:00",
    "duration": 2,
    "total": "Rp 200.000",
    "status": "Booked"
  }'
```

### 4. Get Booking by ID
```bash
curl http://localhost:3000/api/bookings/BK-1001
```

### 5. Update Booking (PUT)
```bash
curl -X PUT http://localhost:3000/api/bookings/BK-1001 \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "Updated Name",
    "field": "B2",
    "date": "2026-06-11",
    "time": "17:00",
    "duration": 1,
    "total": "Rp 100.000",
    "status": "Confirmed"
  }'
```

### 6. Delete Booking
```bash
curl -X DELETE http://localhost:3000/api/bookings/BK-1001
```
Expected: `{"success":true}`

### 7. Get All Payments
```bash
curl http://localhost:3000/api/payments
```

### 8. Create Payment (POST)
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "booking": "BK-1001",
    "method": "Transfer",
    "date": "2026-06-10",
    "amount": "Rp 100.000",
    "status": "Lunas"
  }'
```

### 9. Get Payment by ID
```bash
curl http://localhost:3000/api/payments/PY-001
```

### 10. Update Payment (PUT)
```bash
curl -X PUT http://localhost:3000/api/payments/PY-001 \
  -H "Content-Type: application/json" \
  -d '{
    "booking": "BK-1001",
    "method": "Cash",
    "date": "2026-06-10",
    "amount": "Rp 120.000",
    "status": "Lunas"
  }'
```

### 11. Delete Payment
```bash
curl -X DELETE http://localhost:3000/api/payments/PY-001
```

## Testing Frontend Integration

1. **Open booking page**: `file:///path/to/booking.html`
2. **Check DevTools Console** (F12):
   - Should see `fetchBookingsFromApi` called
   - Network tab → should see GET request to `http://localhost:3000/api/bookings`
3. **Test CRUD actions**:
   - ✓ Tambah Booking → should POST to /api/bookings
   - ✓ Edit Booking → should PUT to /api/bookings/{id}
   - ✓ Hapus Booking → should DELETE to /api/bookings/{id}
   - ✓ Refresh → should fetch latest data
4. **Test fallback** (if API down):
   - Close backend server
   - Refresh page → should still work with seed data
   - Toast should show "API tidak tersedia"

## Troubleshooting

### "Cannot GET /api/bookings"
- Pastikan Express server sudah running
- Check `backend/routes/bookingRoutes.js` sudah di-import di `server.js`

### "ECONNREFUSED" on database query
- Pastikan PostgreSQL running
- Check `.env` credentials: PG_HOST, PG_USER, PG_PASSWORD
- Check database `booking_futsal` sudah dibuat

### CORS error in browser console
- Pastikan `cors()` middleware aktif di `server.js`
- Check API_BASE di `js/booking.js` sesuai dengan backend URL

### Data tidak muncul di frontend
- Check DevTools Network tab → see fetch requests
- Check Response content di Network tab
- Pastikan database punya data (cek dengan `SELECT * FROM tb_booking`)

## Example cURL workflow

```bash
# 1. Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"customer":"John","field":"A1","date":"2026-06-10","time":"16:00","duration":2,"total":"Rp 200.000","status":"Booked"}'

# 2. Get all bookings
curl http://localhost:3000/api/bookings

# 3. Get specific booking (copy ID from step 1 response)
curl http://localhost:3000/api/bookings/1

# 4. Update booking
curl -X PUT http://localhost:3000/api/bookings/1 \
  -H "Content-Type: application/json" \
  -d '{"customer":"John Doe","field":"B2","date":"2026-06-11","time":"17:00","duration":1,"total":"Rp 100.000","status":"Confirmed"}'

# 5. Delete booking
curl -X DELETE http://localhost:3000/api/bookings/1
```

## Performance Notes

- API returns max 100 records per query (see `LIMIT 100` in controllers)
- Pagination handled on frontend (`bookingPerPage = 5`)
- Add indexes on `tb_booking.id`, `tb_payment.booking_id` untuk query speed
- Consider adding caching untuk GET requests di production
