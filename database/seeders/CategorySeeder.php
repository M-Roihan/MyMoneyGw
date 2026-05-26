<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first(); // Ambil user pertama yang dibuat nanti

        $categories = [
            ['name' => 'Gaji', 'type' => 'pemasukan', 'color' => '#10b981'],
            ['name' => 'Bonus', 'type' => 'pemasukan', 'color' => '#3b82f6'],
            ['name' => 'Investasi', 'type' => 'pemasukan', 'color' => '#06b6d4'],
            ['name' => 'Makanan', 'type' => 'pengeluaran', 'color' => '#ef4444'],
            ['name' => 'Transportasi', 'type' => 'pengeluaran', 'color' => '#f59e0b'],
            ['name' => 'Hiburan', 'type' => 'pengeluaran', 'color' => '#8b5cf6'],
            ['name' => 'Belanja', 'type' => 'pengeluaran', 'color' => '#ec4899'],
            ['name' => 'Kesehatan', 'type' => 'pengeluaran', 'color' => '#f97316'],
            ['name' => 'Pendidikan', 'type' => 'pengeluaran', 'color' => '#6366f1'],
            ['name' => 'Tagihan', 'type' => 'pengeluaran', 'color' => '#64748b'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'user_id' => null,
                'name' => $category['name'],
                'type' => $category['type'],
                'color' => $category['color'],
            ]);
        }
    }
}