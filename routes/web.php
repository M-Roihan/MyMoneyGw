<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\SavingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/login');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // ===== HALAMAN BARU (Inertia) =====
    Route::get('/transaksi', fn() => Inertia::render('Transaksi'))->name('transaksi');
    Route::get('/dompetku', fn() => Inertia::render('DompetKu'))->name('dompetku');
    Route::get('/tabungan', fn() => Inertia::render('Tabungan'))->name('tabungan');
    Route::get('/laporan', fn() => Inertia::render('Laporan'))->name('laporan');
    Route::get('/about', fn() => Inertia::render('AboutUs'))->name('about');

    // ===== PROFILE PAGE (Modern UI with AppLayout) =====
    Route::get('/profile', fn() => Inertia::render('Profile/Profile'))->name('profile.show');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Transaction Routes
    Route::get('/api/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/api/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('/api/transactions/by-date-range', [TransactionController::class, 'byDateRange'])->name('transactions.byDateRange');
    Route::get('/api/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::put('/api/transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');
    Route::delete('/api/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

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

    // ===== API PROFILE (User Profile Management) =====
    Route::get('/api/profile', [ProfileController::class, 'getProfile'])->name('api.profile.show');
    Route::put('/api/profile/username', [ProfileController::class, 'updateUsername'])->name('api.profile.update-username');
    Route::put('/api/profile/password', [ProfileController::class, 'updatePassword'])->name('api.profile.update-password');
    Route::post('/api/profile/photo', [ProfileController::class, 'updatePhotoProfile'])->name('api.profile.update-photo');
});

require __DIR__ . '/auth.php';
