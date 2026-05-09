<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    /**
     * Ambil semua akun milik user yang login
     */
    public function index()
    {
        $accounts = Account::where('user_id', Auth::id())->get();

        return response()->json([
            'success' => true,
            'data' => $accounts
        ]);
    }
}
