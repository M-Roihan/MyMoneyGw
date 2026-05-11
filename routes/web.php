<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AccountController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

Route::get('/', function () {
    return Inertia::render('Dashboard');
});

Route::redirect('/', '/login');

// --- BAGIAN RUTE BARU (REGISTRASI) ---
// Kita letakkan di sini agar bisa diakses oleh pengunjung sebelum login
Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('register', [RegisteredUserController::class, 'store']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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

    // Account Routes
    Route::get('/api/accounts', [AccountController::class, 'index'])->name('accounts.index');
});

// Rute Guest (Hanya untuk yang belum login)
Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
    
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

// Rute Logout
Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

require __DIR__.'/auth.php';
