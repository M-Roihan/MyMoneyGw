<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'account_id' => Account::factory(),
            'type' => fake()->randomElement(['pemasukan', 'pengeluaran']),
            'amount' => fake()->randomFloat(0, 1000, 1000000),
            'description' => fake()->sentence(),
            'transaction_date' => fake()->date(),
        ];
    }
}
