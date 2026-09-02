# my-finance-app

API keuangan sederhana dengan Express + MySQL (XAMPP Free): autentikasi, CRUD transaksi, dan filter bulanan.

## Struktur

```
server.js                   entry point
schema.sql                  skema database (users, transactions)
.env.example                contoh konfigurasi
src/
  db.js                     koneksi MySQL pool
  routes/auth.js            register & login
  routes/transactions.js    CRUD transaksi + filter bulan
  middlewares/auth.js middleware JWT
  middlewares/asyncHandrer.js
```

## Setup

1. Nyalakan MySQL di XAMPP (port 3306, user `root` / password `` (kosong))
2. Import skema ke database `keuangan`:
   ```
   mysql -h 127.0.0.1 -P 3306 -u root -p keuangan < schema.sql
   ```
   Jika database sudah punya table lama, drop dulu supaya kolom cocok:
   ```
   mysql -h 127.0.0.1 -P 3306 -u root -p -e "DROP DATABASE db_finance; CREATE DATABASE db_finance;"
   mysql -h 127.0.0.1 -P 3306 -u root -p db_finance < schema.sql
   ```
3. Siapkan environment:
   ```
   cp .env.example .env
   ```
4. Install & jalankan:
   ```
   npm install
   npm run dev
   ```

## Endpoint

Semua route `/transaction` butuh header `Authorization: Bearer <token>`.

Semua route API diawali `/api`.

| Method | Endpoint | Keterangan |
| | | |
| POST | `/api/auth/register` | daftar user |
| POST | `/api/auth/login` | login, dapat token |
| GET | `/api/transactions?month=2026-09` | list transaksi (filter bulan opsional) |
| GET | `/api/transactions/:id` | detail transaksi |
| POST | `/api/transactions` | tambah transaksi |
| PUT | `/api/transactions/:id` | ubah transaksi |
| DELETE | `/api/transactions/:id` | hapus transaksi |

Contoh transaksi:

```
{
    "type": "income",
    "amount": 100000,
    "description": "gaji",
    "tx_date": "2026-09-01"
}
```
