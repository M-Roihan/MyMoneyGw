<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RegisteredUserController extends Controller {
    public function create() {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request) {
        // Validasi input
        $request->validate([
            'name' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed|min:6',
        ]);

        // Simpan user dengan password yang sudah di-hash (Enkripsi)
        // UserObserver akan otomatis membuat default categories
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Redirect ke Login
        return redirect()->intended(route('login', absolute: false));
    }
}
