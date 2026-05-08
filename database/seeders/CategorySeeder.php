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
            ['name' => 'Gaji', 'type' => 'income', 'color' => '#10b981'],
            ['name' => 'Bonus', 'type' => 'income', 'color' => '#3b82f6'],
            ['name' => 'Makanan', 'type' => 'expense', 'color' => '#ef4444'],
            ['name' => 'Transportasi', 'type' => 'expense', 'color' => '#f59e0b'],
            ['name' => 'Hiburan', 'type' => 'expense', 'color' => '#8b5cf6'],
            ['name' => 'Belanja', 'type' => 'expense', 'color' => '#ec4899'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'user_id' => $user->id,
                'name' => $category['name'],
                'type' => $category['type'],
                'color' => $category['color'],
            ]);
        }
    }
}