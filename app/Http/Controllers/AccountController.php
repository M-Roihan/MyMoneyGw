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

    /**
     * Buat akun baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|in:cash,bank,e-wallet',
            'balance' => 'nullable|numeric|min:0',
        ]);

        $account = Account::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'type' => $validated['type'],
            'balance' => $validated['balance'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'data' => $account,
            'message' => 'Akun berhasil dibuat'
        ], 201);
    }

    /**
     * Update akun
     */
    public function update(Request $request, Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'type' => 'sometimes|in:cash,bank,e-wallet',
            'balance' => 'sometimes|numeric|min:0',
        ]);

        $account->update($validated);

        return response()->json([
            'success' => true,
            'data' => $account,
            'message' => 'Akun berhasil diupdate'
        ]);
    }

    /**
     * Hapus akun
     */
    public function destroy(Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $account->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil dihapus'
        ]);
    }
}
