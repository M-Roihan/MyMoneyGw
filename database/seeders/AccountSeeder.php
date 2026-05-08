<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\User;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        Account::create([
            'user_id' => $user->id,
            'name' => 'Dompet Tunai',
            'type' => 'cash',
            'balance' => 0,
        ]);

        Account::create([
            'user_id' => $user->id,
            'name' => 'Bank Utama',
            'type' => 'bank',
            'balance' => 0,
        ]);
    }
}