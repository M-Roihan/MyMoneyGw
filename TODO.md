# 📋 ROADMAP PENGEMBANGAN — FinanceKu
> Stack: **Laravel 11** + **Inertia.js** + **React 18** + **Tailwind CSS** + **MySQL**
> Metode: dikerjakan menggunakan **Antigravity AI**, satu tugas per prompt.

---

## ✅ SUDAH SELESAI
- [x] Setup project Laravel + Inertia + React
- [x] Auth: Login & Register (halaman Login sudah ada UI premium)
- [x] Migration: `users`, `categories`, `accounts`, `savings`, `transactions`
- [x] Model: `User`, `Category`, `Account`, `Saving`, `Transaction` (+ SoftDeletes + relasi)
- [x] Seeder: `DatabaseSeeder`, `CategorySeeder`, `AccountSeeder`
- [x] `TransactionController`: index, store, show, update, destroy, byDateRange, saldo
- [x] `AccountController`: index
- [x] `CategoryController`: index
- [x] Route API di dalam `web.php` (auth middleware)
- [x] Dashboard.jsx: layout sidebar, kartu saldo, modal tambah transaksi, fetch API

---

## 🚨 BUG & PERBAIKAN KRITIS (Kerjakan Pertama!)

### BUG-01 — CategoryController tidak filter per user
- **File:** `app/Http/Controllers/CategoryController.php`
- **Masalah:** `Category::all()` mengambil semua kategori semua user
- **Fix:** Ganti dengan `Category::where('user_id', Auth::id())->get()`

### BUG-02 — Tipe kategori tidak konsisten
- **File:** `database/seeders/CategorySeeder.php`
- **Masalah:** Seeder pakai `type: 'income'/'expense'` tapi TransactionController validasi `type: 'pemasukan'/'pengeluaran'`
- **Fix:** Standarisasi semua ke `'pemasukan'` / `'pengeluaran'` di seeder, migration, dan model

### BUG-03 — Kartu Pemasukan & Pengeluaran di Dashboard masih hardcode
- **File:** `resources/js/Pages/Dashboard.jsx`
- **Masalah:** Nilai `Rp 8.200.000` dan `Rp 3.150.000` ditulis manual, bukan dari API
- **Fix:** Gunakan data dari `saldo` state yang sudah di-fetch dari `/api/summary/saldo`

### BUG-04 — Target Tabungan di Dashboard masih hardcode
- **File:** `resources/js/Pages/Dashboard.jsx`
- **Masalah:** Data "MacBook Pro M3 65%" adalah dummy, tidak dari database
- **Fix:** Fetch dari endpoint `/api/savings` dan render dinamis

### BUG-05 — Route konflik Register
- **File:** `routes/web.php`
- **Masalah:** Route `register` didefinisikan dua kali (duplikasi)
- **Fix:** Hapus deklarasi duplikat di bagian atas file

### BUG-06 — Nama user di header Dashboard hardcode
- **File:** `resources/js/Pages/Dashboard.jsx`
- **Masalah:** Teks "Admin Finance" dan "Premium User" statis
- **Fix:** Gunakan `usePage().props.auth.user` dari Inertia

---

## 📦 FASE 1 — Fondasi Backend (Prioritas Tinggi)

### TASK-1.1 — Buat SavingController (CRUD Tabungan)
- [ ] **File baru:** `app/Http/Controllers/SavingController.php`
- [ ] Method: `index`, `store`, `update`, `destroy`, `deposit`
- [ ] Validasi dan ownership check di setiap method

### TASK-1.2 — Tambah Route API untuk Savings, Kategori, Akun
- [ ] **File:** `routes/web.php`
- [ ] Route savings: GET index, POST store, PUT update, DELETE destroy, POST deposit
- [ ] Route kategori: POST store, PUT update, DELETE destroy
- [ ] Route akun: POST store, PUT update, DELETE destroy

### TASK-1.3 — Lengkapi AccountController (CRUD)
- [ ] Tambah method: `store`, `update`, `destroy`
- [ ] Validasi: `name` required, `type` in:cash,bank,e-wallet, `balance` min:0

### TASK-1.4 — Lengkapi CategoryController (CRUD + fix user filter)
- [ ] Fix `index()` → filter by `Auth::id()`
- [ ] Tambah method: `store`, `update`, `destroy`

### TASK-1.5 — Filter periode di TransactionController & saldo
- [ ] Update `index()` → terima `?month=&year=`
- [ ] Update `saldo()` → terima `?period=month|week|year|all`
- [ ] Tambah method `summary()` → data per-kategori untuk pie chart

### TASK-1.6 — Endpoint Dashboard Summary
- [ ] Tambah method `dashboardSummary()` di TransactionController
- [ ] Return: total saldo, pemasukan bulan ini, pengeluaran bulan ini, 5 transaksi terbaru, pengeluaran per kategori, tren 6 bulan
- [ ] Route: `GET /api/dashboard/summary`

---

## 🎨 FASE 2 — Halaman & Komponen Frontend

### TASK-2.1 — Komponen Toast Notification
- [ ] **File:** `resources/js/Components/Toast.jsx`
- [ ] Animasi slide-in, auto-close 3 detik, tipe success/error/warning

### TASK-2.2 — Komponen ConfirmDialog
- [ ] **File:** `resources/js/Components/ConfirmDialog.jsx`
- [ ] Modal konfirmasi hapus dengan tombol merah dan batal

### TASK-2.3 — Perbaiki Dashboard.jsx
- [ ] Fix BUG-03 (saldo real dari API), BUG-04 (tabungan dari DB), BUG-06 (nama user)
- [ ] Greeting dinamis berdasarkan jam
- [ ] Filter periode di kartu ringkasan
- [ ] Skeleton loading, ganti semua `alert()` → Toast

### TASK-2.4 — Halaman Transaksi
- [ ] **File:** `resources/js/Pages/Transaksi.jsx`
- [ ] Tabel + filter (tipe, kategori, akun, periode) + search
- [ ] Modal edit, ConfirmDialog hapus, pagination

### TASK-2.5 — Halaman DompetKu
- [ ] **File:** `resources/js/Pages/DompetKu.jsx`
- [ ] Kartu akun (nama, tipe, saldo), tambah/edit/hapus akun

### TASK-2.6 — Halaman Tabungan
- [ ] **File:** `resources/js/Pages/Tabungan.jsx`
- [ ] Kartu tabungan + progress bar, modal tambah tabungan, modal setor dana

### TASK-2.7 — Halaman Laporan
- [ ] **File:** `resources/js/Pages/Laporan.jsx`
- [ ] Install recharts: `npm install recharts`
- [ ] Bar chart tren 6 bulan, pie chart pengeluaran per kategori, tabel ringkasan

### TASK-2.8 — Halaman Profil
- [ ] **File:** `resources/js/Pages/Profile/Edit.jsx`
- [ ] Form update nama/email, form ganti password, hapus akun

### TASK-2.9 — Halaman About Us
- [ ] **File:** `resources/js/Pages/AboutUs.jsx`
- [ ] Grid kartu anggota tim, visi-misi, tech stack
- [ ] Anggota: Alfi Adriansyah, Rifky Aditya Kamil, Muhammad Roihan, Aditya Maulana A

---

## 🧭 FASE 3 — Navigasi & Layout

### TASK-3.1 — AppLayout dengan Sidebar
- [ ] **File:** `resources/js/Layouts/AppLayout.jsx`
- [ ] Sidebar: menu aktif dari URL, user info bawah, tombol logout fungsional
- [ ] Mobile: hamburger menu + drawer sidebar

### TASK-3.2 — Hubungkan semua halaman ke AppLayout
- [ ] Wrap semua halaman dengan `<AppLayout>`
- [ ] `<Head title="..." />` di setiap halaman

### TASK-3.3 — Tambah route semua halaman baru
- [ ] **File:** `routes/web.php`
- [ ] Route: transaksi, dompetku, tabungan, laporan, about

---

## 🔒 FASE 4 — Keamanan & Error Handling

### TASK-4.1 — Ownership check di semua controller
- [ ] Semua akses data user wajib validasi `user_id === Auth::id()`

### TASK-4.2 — Helper `apiFetch()` di frontend
- [ ] **File:** `resources/js/utils/api.js`
- [ ] Auto pasang CSRF token & Accept header
- [ ] Handle 401 (redirect login), 422 (tampilkan errors), network error

### TASK-4.3 — Util format currency & date
- [ ] **File:** `resources/js/utils/format.js`
- [ ] `formatRupiah(value)` dan `formatDate(date)` — dipakai semua halaman

---

## 🎯 FASE 5 — Polish

### TASK-5.1 — Skeleton Loading
- [ ] `SkeletonCard.jsx` dan `SkeletonTable.jsx`

### TASK-5.2 — Empty State
- [ ] `EmptyState.jsx` dengan ilustrasi SVG sederhana

### TASK-5.3 — Responsive Mobile
- [ ] Sidebar collapse ke drawer di layar < 768px
- [ ] Tabel jadi card list di mobile

### TASK-5.4 — Pagination Backend
- [ ] Update `TransactionController::index()` → `paginate(15)`
- [ ] Handle response paginator di frontend

---

## 🧪 FASE 6 — Testing

### TASK-6.1 — Feature Test Auth
- [ ] `tests/Feature/AuthTest.php`: register, login, logout

### TASK-6.2 — Feature Test Transaction API
- [ ] `tests/Feature/TransactionTest.php`: CRUD + authorization

### TASK-6.3 — Feature Test Saving API
- [ ] `tests/Feature/SavingTest.php`: index, store, deposit, destroy

---

## 📝 RINGKASAN TEKNIS

| Komponen | Detail |
|---|---|
| Framework | Laravel 11 + Inertia.js v2 + React 18 |
| CSS | Tailwind CSS v3 — **standarisasi ke Tailwind, hindari inline style** |
| Auth | Session-based via Laravel Breeze (bukan JWT) |
| Font | Plus Jakarta Sans — unifikasi semua halaman |
| API prefix | `/api/...` di `routes/web.php` (bukan `routes/api.php`) |
| Soft Delete | Semua model sudah pakai `SoftDeletes` |
| Charts | Recharts (perlu install) |

---

## 🗂️ URUTAN PENGERJAAN

```
BUG-01 → 02 → 03 → 04 → 05 → 06
    ↓
TASK-1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6
    ↓
TASK-2.1 → 2.2 → 2.3
    ↓
TASK-3.1 → 3.2 → 3.3
    ↓
TASK-2.4 → 2.5 → 2.6 → 2.7 → 2.8 → 2.9
    ↓
TASK-4.1 → 4.2 → 4.3
    ↓
TASK-5.1 → 5.2 → 5.3 → 5.4
    ↓
TASK-6.1 → 6.2 → 6.3
```