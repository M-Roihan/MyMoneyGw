<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\SavingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

Route::redirect('/', '/login');

// Rute Guest (Hanya untuk yang belum login)
Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // ===== HALAMAN BARU (Inertia) =====
    Route::get('/transaksi', fn() => Inertia::render('Transaksi'))->name('transaksi');
    Route::get('/dompetku', fn() => Inertia::render('DompetKu'))->name('dompetku');
    Route::get('/tabungan', fn() => Inertia::render('Tabungan'))->name('tabungan');
    Route::get('/laporan', fn() => Inertia::render('Laporan'))->name('laporan');
    Route::get('/about', fn() => Inertia::render('AboutUs'))->name('about');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Transaction Routes
    Route::get('/api/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/api/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('/api/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::put('/api/transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');
    Route::delete('/api/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');
    Route::get('/api/transactions/by-date-range', [TransactionController::class, 'byDateRange'])->name('transactions.byDateRange');

    // Category Routes
    Route::get('/api/categories', [CategoryController::class, 'index'])->name('categories.index');
    // ===== API CATEGORIES (CRUD lengkap) =====
    Route::post('/api/categories', [CategoryController::class, 'store']);
    Route::put('/api/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/api/categories/{category}', [CategoryController::class, 'destroy']);

    // Summary Routes
    Route::get('/api/summary/saldo', [TransactionController::class, 'saldo'])->name('summary.saldo');
    
    // ===== DASHBOARD SUMMARY =====
    Route::get('/api/dashboard/summary', [TransactionController::class, 'dashboardSummary']);

    // Savings Routes
    // ===== API SAVINGS =====
    Route::get('/api/savings', [SavingController::class, 'index'])->name('savings.index');
    Route::post('/api/savings', [SavingController::class, 'store']);
    Route::put('/api/savings/{saving}', [SavingController::class, 'update']);
    Route::delete('/api/savings/{saving}', [SavingController::class, 'destroy']);
    Route::post('/api/savings/{saving}/deposit', [SavingController::class, 'deposit']);

    // Account Routes
    Route::get('/api/accounts', [AccountController::class, 'index'])->name('accounts.index');
    // ===== API ACCOUNTS (CRUD lengkap) =====
    Route::post('/api/accounts', [AccountController::class, 'store']);
    Route::put('/api/accounts/{account}', [AccountController::class, 'update']);
    Route::delete('/api/accounts/{account}', [AccountController::class, 'destroy']);
});

// Rute Logout
Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

require __DIR__ . '/auth.php';
