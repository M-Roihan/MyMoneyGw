<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    /**
     * Ambil semua kategori
     */
    public function index()
    {
        $categories = Category::where('user_id', Auth::id())->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Buat kategori baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|in:pemasukan,pengeluaran',
            'color' => 'nullable|string',
        ]);

        $category = Category::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'type' => $validated['type'],
            'color' => $validated['color'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Kategori berhasil dibuat'
        ], 201);
    }

    /**
     * Update kategori
     */
    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'type' => 'sometimes|in:pemasukan,pengeluaran',
            'color' => 'nullable|string',
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Kategori berhasil diupdate'
        ]);
    }

    /**
     * Hapus kategori
     */
    public function destroy(Category $category)
    {
        if ($category->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus'
        ]);
    }
}
