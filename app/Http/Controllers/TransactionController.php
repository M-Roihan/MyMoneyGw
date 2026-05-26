<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class TransactionController extends Controller
{
    /**
     * Ringkasan saldo (real-time via polling di frontend)
     */
    public function saldo()
    {
        $userId = Auth::id();

        // 1. Ambil Total Pemasukan & Pengeluaran dari Transaksi
        $pemasukan = Transaction::where('user_id', $userId)
            ->where('type', 'pemasukan')
            ->sum('amount');

        $pengeluaran = Transaction::where('user_id', $userId)
            ->where('type', 'pengeluaran')
            ->sum('amount');

        // 2. Ambil Total Saldo asli dari akumulasi seluruh akun di DompetKu
        $totalSaldo = Account::where('user_id', $userId)->sum('balance');

        return response()->json([
            'success' => true,
            'data' => [
                'pemasukan' => (float) $pemasukan,
                'pengeluaran' => (float) $pengeluaran,
                'total_saldo' => $totalSaldo,
            ],
        ]);
    }

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
            'category_id' => [
                'required',
                Rule::exists('categories', 'id')->where(function ($query) {
                    $query->where('user_id', Auth::id())
                          ->orWhereNull('user_id');
                }),
            ],
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
            'category_id' => [
                'sometimes',
                Rule::exists('categories', 'id')->where(function ($query) {
                    $query->where('user_id', Auth::id())
                          ->orWhereNull('user_id');
                }),
            ],
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

    /**
     * Data Summary untuk Dashboard
     */
    public function dashboardSummary(Request $request)
    {
        $userId = Auth::id();
        $filter = $request->query('filter', 'Bulan Ini');
        $now = Carbon::now();

        // Tentukan rentang tanggal berdasarkan filter
        if ($filter === 'Bulan Lalu') {
            $startDate = $now->copy()->subMonth()->startOfMonth();
            $endDate = $now->copy()->subMonth()->endOfMonth();
        } elseif ($filter === 'Tahun Ini') {
            $startDate = $now->copy()->startOfYear();
            $endDate = $now->copy()->endOfMonth();
        } else { // 'Bulan Ini' (default)
            $startDate = $now->copy()->startOfMonth();
            $endDate = $now->copy()->endOfMonth();
        }

        // 1. Pemasukan & Pengeluaran (Keseluruhan dari transaksi)
        $totalPemasukan = Transaction::where('user_id', $userId)->where('type', 'pemasukan')->sum('amount');
        $totalPengeluaran = Transaction::where('user_id', $userId)->where('type', 'pengeluaran')->sum('amount');
        
        // Saldo Total: Gabungan saldo real dari semua Akun
        $saldoTotal = Account::where('user_id', $userId)->sum('balance');

        // 2. Bulan Ini / Sesuai Filter
        $pemasukanBulanIni = Transaction::where('user_id', $userId)
            ->where('type', 'pemasukan')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        $pengeluaranBulanIni = Transaction::where('user_id', $userId)
            ->where('type', 'pengeluaran')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        // 3. Transaksi Terbaru
        $transaksiTerbaru = Transaction::where('user_id', $userId)
            ->with(['category', 'account'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // 4. Pengeluaran per Kategori (Sesuai Filter)
        $pengeluaranPerKategoriRaw = Transaction::where('user_id', $userId)
            ->where('type', 'pengeluaran')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->selectRaw('category_id, sum(amount) as total')
            ->groupBy('category_id')
            ->with('category')
            ->get();

        $pengeluaranPerKategori = $pengeluaranPerKategoriRaw->map(function ($item) {
            return [
                'kategori' => $item->category ? $item->category->name : 'Uncategorized',
                'total' => (float) $item->total,
                'warna' => $item->category ? $item->category->color : '#64748b'
            ];
        });

        // 5. Tren 6 Bulan
        $tren6Bulan = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = Carbon::now()->subMonths($i);
            
            // Format indonesia singkat: "Jan 2026"
            $bulanStr = $monthDate->translatedFormat('M Y');

            $in = Transaction::where('user_id', $userId)
                ->where('type', 'pemasukan')
                ->whereMonth('transaction_date', $monthDate->month)
                ->whereYear('transaction_date', $monthDate->year)
                ->sum('amount');
            
            $out = Transaction::where('user_id', $userId)
                ->where('type', 'pengeluaran')
                ->whereMonth('transaction_date', $monthDate->month)
                ->whereYear('transaction_date', $monthDate->year)
                ->sum('amount');

            $tren6Bulan[] = [
                'bulan' => $bulanStr,
                'pemasukan' => (float) $in,
                'pengeluaran' => (float) $out
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'saldo_total' => $saldoTotal,
                'pemasukan_bulan_ini' => (float)$pemasukanBulanIni,
                'pengeluaran_bulan_ini' => (float)$pengeluaranBulanIni,
                'transaksi_terbaru' => $transaksiTerbaru,
                'pengeluaran_per_kategori' => $pengeluaranPerKategori,
                'tren_6_bulan' => $tren6Bulan,
            ]
        ]);
    }
}
