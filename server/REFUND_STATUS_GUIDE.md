# 💰 Guide: Cara Melihat Status Refund

Setelah refund diproses, berikut cara untuk melihat dan memantau status refund:

## 📱 **1. User/Borrower - Melihat Status Refund**

### A. **Melalui Booking History**
```bash
GET /api/v1/bookings/history
Authorization: Bearer {user_token}
```

**Response akan include refund info:**
```json
{
  "status": "success",
  "message": "History booking berhasil diambil",
  "data": [
    {
      "bookingId": "booking-123",
      "buildingName": "Auditorium UNAND",
      "activityName": "Seminar Nasional",
      "startDate": "30-06-2025",
      "endDate": "30-06-2025",
      "status": "CANCELLED",
      "payment": {
        "paymentStatus": "PAID",
        "totalAmount": 1000000,
        "refund": {
          "refundAmount": 1000000,
          "refundStatus": "SUCCEEDED",
          "refundReason": "Booking ditolak oleh admin",
          "refundDate": "30-06-2025"
        }
      }
    }
  ]
}
```

### B. **Detail Refund Spesifik**
```bash
GET /api/v1/bookings/{bookingId}/refund
Authorization: Bearer {user_token}
```

**Response:**
```json
{
  "status": "success",
  "message": "Detail refund berhasil diambil",
  "data": {
    "bookingId": "booking-123",
    "buildingName": "Auditorium UNAND",
    "totalAmount": 1000000,
    "paymentStatus": "PAID",
    "refund": {
      "id": "refund-456",
      "refundAmount": 1000000,
      "refundStatus": "SUCCEEDED",
      "refundReason": "Booking ditolak oleh admin",
      "refundDate": "30-06-2025",
      "xenditRefundId": "refund-456"
    }
  }
}
```

### C. **Jika Belum Ada Refund**
```json
{
  "status": "success",
  "message": "Detail refund berhasil diambil",
  "data": {
    "bookingId": "booking-123",
    "buildingName": "Auditorium UNAND",
    "totalAmount": 1000000,
    "paymentStatus": "PAID",
    "refundStatus": "NO_REFUND",
    "message": "Tidak ada refund untuk booking ini"
  }
}
```

## 🏢 **2. Admin - Kelola dan Monitor Refund**

### A. **Lihat Booking List dengan Status Refund**
```bash
GET /api/v1/bookings/admin/list
Authorization: Bearer {admin_token}
```

**Response akan include refund info di setiap booking:**
```json
{
  "status": "success",
  "data": [
    {
      "bookingId": "booking-123",
      "status": "CANCELLED",
      "detail": {
        "payment": {
          "paymentStatus": "PAID",
          "totalAmount": 1000000,
          "refund": {
            "id": "refund-456",
            "refundAmount": 1000000,
            "refundStatus": "SUCCEEDED",
            "refundReason": "Booking ditolak oleh admin",
            "refundDate": "30-06-2025"
          }
        }
      }
    }
  ]
}
```

### B. **Proses Refund Baru**
```bash
POST /api/v1/bookings/admin/{bookingId}/refund
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "refundReason": "Alasan refund yang jelas"
}
```

### C. **Lihat Detail Refund (Admin)**
```bash
GET /api/v1/bookings/admin/{bookingId}/refund
Authorization: Bearer {admin_token}
```

**Response (lebih detail untuk admin):**
```json
{
  "status": "success",
  "message": "Detail refund berhasil diambil",
  "data": {
    "bookingId": "booking-123",
    "buildingName": "Auditorium UNAND",
    "borrowerName": "John Doe",
    "borrowerEmail": "john@example.com",
    "totalAmount": 1000000,
    "paymentStatus": "PAID",
    "refund": {
      "id": "refund-456",
      "refundAmount": 1000000,
      "refundStatus": "SUCCEEDED",
      "refundReason": "Booking ditolak oleh admin",
      "refundDate": "30-06-2025",
      "xenditRefundId": "refund-456"
    }
  }
}
```

## 🔔 **3. Notifikasi Otomatis**

### User akan menerima notifikasi ketika:
- ✅ Refund berhasil diproses
- ✅ Booking ditolak dan refund otomatis
- ✅ Booking expired dan refund otomatis

### Contoh notifikasi:
```json
{
  "title": "Refund Berhasil",
  "message": "Refund sebesar Rp1.000.000 untuk booking Auditorium UNAND telah berhasil diproses",
  "type": "PAYMENT"
}
```

## 📊 **4. Status Refund yang Tersedia**

| **Status** | **Arti** | **Keterangan** |
|------------|----------|----------------|
| `SUCCEEDED` | ✅ Berhasil | Refund telah berhasil diproses |
| `FAILED` | ❌ Gagal | Refund gagal diproses |
| `PENDING` | ⏳ Menunggu | Refund sedang diproses |
| `NO_REFUND` | ➖ Tidak Ada | Tidak ada refund untuk booking ini |

## 🔍 **5. Skenario Refund Otomatis**

### Refund akan dibuat otomatis ketika:
1. **Admin menolak booking** yang sudah dibayar
2. **Booking expired** (melewati tanggal) dan belum disetujui
3. **Webhook dari Xendit** konfirmasi refund berhasil

### Log yang akan muncul:
```
info: Automatic refund processed for booking: booking-123
info: Refund processed for booking: booking-123
```

## 🛠️ **6. Troubleshooting**

### Error yang mungkin terjadi:

#### **"Refund untuk booking ini sudah pernah diproses"**
- **Penyebab**: Mencoba refund booking yang sudah di-refund
- **Solusi**: Cek status refund dengan endpoint GET refund details

#### **"Booking tidak bisa direfund karena belum ada pembayaran yang berhasil"**
- **Penyebab**: Booking belum dibayar atau payment status bukan PAID
- **Solusi**: Pastikan booking sudah dibayar dulu

#### **"Booking yang sudah selesai tidak bisa direfund"**
- **Penyebab**: Booking status sudah COMPLETED
- **Solusi**: Booking yang sudah selesai tidak bisa di-refund

## 🎯 **Testing Endpoints**

```bash
# 1. Test refund details untuk user
curl -X GET "http://localhost:3000/api/v1/bookings/booking-123/refund" \
  -H "Authorization: Bearer user_token"

# 2. Test refund details untuk admin  
curl -X GET "http://localhost:3000/api/v1/bookings/admin/booking-123/refund" \
  -H "Authorization: Bearer admin_token"

# 3. Test booking history dengan refund info
curl -X GET "http://localhost:3000/api/v1/bookings/history" \
  -H "Authorization: Bearer user_token"

# 4. Test admin booking list dengan refund info
curl -X GET "http://localhost:3000/api/v1/bookings/admin/list" \
  -H "Authorization: Bearer admin_token"
```

## 💡 **Tips untuk Frontend Integration**

### Tampilkan badge refund status:
```javascript
// Contoh komponen React
const RefundBadge = ({ refund }) => {
  if (!refund) return <span className="badge-gray">No Refund</span>;
  
  const statusColors = {
    'SUCCEEDED': 'badge-green',
    'FAILED': 'badge-red', 
    'PENDING': 'badge-yellow'
  };
  
  return (
    <span className={statusColors[refund.refundStatus]}>
      Refund {refund.refundStatus}
    </span>
  );
};
```

### Filter booking berdasarkan refund:
```javascript
// Filter booking yang sudah di-refund
const refundedBookings = bookings.filter(booking => 
  booking.payment?.refund?.refundStatus === 'SUCCEEDED'
);
```

Sekarang user dan admin bisa dengan mudah melihat status refund di berbagai tempat! 🎉 