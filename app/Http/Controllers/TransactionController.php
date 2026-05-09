<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /**
     * Ambil semua transaksi user yang login
     */
    public function index()
    {
        $transactions = Transaction::where('user_id', Auth::id())
            ->with(['category', 'account', 'savingTarget'])
            ->orderBy('transaction_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    /**
     * Buat transaksi baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'account_id' => 'required|exists:accounts,id',
            'type' => 'required|in:pemasukan,pengeluaran',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date',
            'saving_id' => 'nullable|exists:savings,id',
        ]);

        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'category_id' => $validated['category_id'],
            'account_id' => $validated['account_id'],
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'description' => $validated['description'],
            'transaction_date' => $validated['transaction_date'],
            'saving_id' => $validated['saving_id'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $transaction->load(['category', 'account', 'savingTarget']),
            'message' => 'Transaksi berhasil dibuat'
        ], 201);
    }

    /**
     * Tampilkan detail transaksi
     */
    public function show(Transaction $transaction)
    {
        // Pastikan transaksi milik user yang login
        if ($transaction->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $transaction->load(['category', 'account', 'savingTarget'])
        ]);
    }

    /**
     * Update transaksi
     */
    public function update(Request $request, Transaction $transaction)
    {
        // Pastikan transaksi milik user yang login
        if ($transaction->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'account_id' => 'sometimes|exists:accounts,id',
            'type' => 'sometimes|in:pemasukan,pengeluaran',
            'amount' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'transaction_date' => 'sometimes|date',
            'saving_id' => 'nullable|exists:savings,id',
        ]);

        $transaction->update($validated);

        return response()->json([
            'success' => true,
            'data' => $transaction->load(['category', 'account', 'savingTarget']),
            'message' => 'Transaksi berhasil diupdate'
        ]);
    }

    /**
     * Hapus transaksi
     */
    public function destroy(Transaction $transaction)
    {
        // Pastikan transaksi milik user yang login
        if ($transaction->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $transaction->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus'
        ]);
    }

    /**
     * Ambil transaksi berdasarkan range tanggal
     */
    public function byDateRange(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);

        $transactions = Transaction::where('user_id', Auth::id())
            ->whereBetween('transaction_date', [$validated['start_date'], $validated['end_date']])
            ->with(['category', 'account', 'savingTarget'])
            ->orderBy('transaction_date', 'desc')
            ->get()
            ->groupBy(function ($transaction) {
                return $transaction->transaction_date->format('Y-m-d');
            });

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }
}
