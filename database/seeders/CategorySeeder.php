<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Buat kategori default yang shared untuk semua user (user_id = NULL)
        $categories = [
            ['name' => 'Gaji', 'type' => 'income', 'color' => '#10b981'],
            ['name' => 'Bonus', 'type' => 'income', 'color' => '#3b82f6'],
            ['name' => 'Investasi', 'type' => 'income', 'color' => '#06b6d4'],
            ['name' => 'Makanan', 'type' => 'expense', 'color' => '#ef4444'],
            ['name' => 'Transportasi', 'type' => 'expense', 'color' => '#f59e0b'],
            ['name' => 'Hiburan', 'type' => 'expense', 'color' => '#8b5cf6'],
            ['name' => 'Belanja', 'type' => 'expense', 'color' => '#ec4899'],
            ['name' => 'Kesehatan', 'type' => 'expense', 'color' => '#f97316'],
            ['name' => 'Pendidikan', 'type' => 'expense', 'color' => '#6366f1'],
            ['name' => 'Tagihan', 'type' => 'expense', 'color' => '#64748b'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'user_id' => null, // Kategori shared untuk semua user
                'name' => $category['name'],
                'type' => $category['type'],
                'color' => $category['color'],
            ]);
        }
    }
}