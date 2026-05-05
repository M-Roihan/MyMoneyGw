<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat User Testing
        User::create([
            'name' => 'Admin FinanceKu',
            'email' => 'admin@financeku.com',
            'password' => Hash::make('password'), 
        ]);

        // 2. Panggil Seeder Lainnya
        $this->call([
            AccountSeeder::class,
            CategorySeeder::class,
        ]);
    }
}