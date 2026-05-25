<?php

namespace App\Http\Controllers;

use App\Models\Saving;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SavingController extends Controller
{
    /**
     * Ambil semua tabungan milik user
     */
    public function index()
    {
        $savings = Saving::where('user_id', Auth::id())->get();

        return response()->json([
            'success' => true,
            'data' => $savings
        ]);
    }

    /**
     * Buat tabungan baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'target_amount' => 'required|numeric|min:1',
            'target_date' => 'nullable|date',
        ]);

        $saving = Saving::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'target_amount' => $validated['target_amount'],
            'current_amount' => 0,
            'target_date' => $validated['target_date'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $saving,
            'message' => 'Tabungan berhasil dibuat'
        ], 201);
    }

    /**
     * Update tabungan
     */
    public function update(Request $request, Saving $saving)
    {
        if ($saving->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'target_amount' => 'sometimes|numeric|min:1',
            'target_date' => 'nullable|date',
        ]);

        $saving->update($validated);

        return response()->json([
            'success' => true,
            'data' => $saving,
            'message' => 'Tabungan berhasil diupdate'
        ]);
    }

    /**
     * Hapus tabungan (soft delete)
     */
    public function destroy(Saving $saving)
    {
        if ($saving->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $saving->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tabungan berhasil dihapus'
        ]);
    }

    /**
     * Tambah setoran ke tabungan
     */
    public function deposit(Request $request, Saving $saving)
    {
        if ($saving->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        $newAmount = $saving->current_amount + $validated['amount'];

        // Pastikan current_amount tidak melebihi target_amount
        if ($newAmount > $saving->target_amount) {
            $newAmount = $saving->target_amount;
        }

        $saving->update([
            'current_amount' => $newAmount
        ]);

        return response()->json([
            'success' => true,
            'data' => $saving,
            'message' => 'Setoran berhasil ditambahkan'
        ]);
    }
}
