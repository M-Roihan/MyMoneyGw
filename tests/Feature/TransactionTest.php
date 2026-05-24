<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_get_own_transactions()
    {
        $user = User::factory()->create();
        
        $category = Category::factory()->create(['user_id' => $user->id, 'type' => 'pengeluaran']);
        $account = Account::factory()->create(['user_id' => $user->id]);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'account_id' => $account->id,
            'type' => 'pengeluaran',
            'amount' => 100000,
            'description' => 'Makan',
            'transaction_date' => now()->toDateString()
        ]);

        // User lain (supaya tidak tercampur)
        $otherUser = User::factory()->create();
        Transaction::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->getJson('/api/transactions');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id', 'user_id', 'category_id', 'account_id', 'type', 'amount', 'transaction_date', 'description'
                ]
            ]
        ]);
        
        // Assert hanya mendapatkan 1 data
        $this->assertCount(1, $response->json('data'));
    }

    public function test_user_can_create_transaction()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id, 'type' => 'pemasukan']);
        $account = Account::factory()->create(['user_id' => $user->id]);

        $data = [
            'type' => 'pemasukan',
            'amount' => 500000,
            'category_id' => $category->id,
            'account_id' => $account->id,
            'transaction_date' => now()->toDateString(),
            'description' => 'Gaji'
        ];

        $response = $this->actingAs($user)->postJson('/api/transactions', $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'type' => 'pemasukan',
            'amount' => 500000,
            'description' => 'Gaji'
        ]);
    }

    public function test_create_transaction_requires_valid_data()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/transactions', []);

        $response->assertStatus(422);
    }

    public function test_user_can_update_own_transaction()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id, 'type' => 'pemasukan']);
        $account = Account::factory()->create(['user_id' => $user->id]);

        $transaction = Transaction::factory()->create([
            'user_id' => $user->id,
            'type' => 'pemasukan',
            'amount' => 100000
        ]);

        $updateData = [
            'type' => 'pemasukan',
            'amount' => 200000,
            'category_id' => $category->id,
            'account_id' => $account->id,
            'transaction_date' => now()->toDateString(),
            'description' => 'Gaji Update'
        ];

        $response = $this->actingAs($user)->putJson("/api/transactions/{$transaction->id}", $updateData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'amount' => 200000,
            'description' => 'Gaji Update'
        ]);
    }

    public function test_user_cannot_update_others_transaction()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $transaction = Transaction::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($user)->putJson("/api/transactions/{$transaction->id}", [
            'amount' => 200000
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_own_transaction()
    {
        $user = User::factory()->create();
        $transaction = Transaction::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/transactions/{$transaction->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('transactions', [
            'id' => $transaction->id
        ]);
    }

    public function test_user_cannot_delete_others_transaction()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $transaction = Transaction::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/transactions/{$transaction->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'deleted_at' => null
        ]);
    }

    public function test_saldo_endpoint_returns_correct_data()
    {
        $user = User::factory()->create();
        
        $categoryIn = Category::factory()->create(['user_id' => $user->id, 'type' => 'pemasukan']);
        $categoryOut = Category::factory()->create(['user_id' => $user->id, 'type' => 'pengeluaran']);
        $account = Account::factory()->create(['user_id' => $user->id]);

        // Pemasukan 500k
        Transaction::factory()->create([
            'user_id' => $user->id,
            'type' => 'pemasukan',
            'amount' => 500000,
            'category_id' => $categoryIn->id,
            'account_id' => $account->id,
        ]);

        // Pengeluaran 200k
        Transaction::factory()->create([
            'user_id' => $user->id,
            'type' => 'pengeluaran',
            'amount' => 200000,
            'category_id' => $categoryOut->id,
            'account_id' => $account->id,
        ]);

        $response = $this->actingAs($user)->getJson('/api/summary/saldo');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'pemasukan',
                'pengeluaran'
            ]
        ]);
        
        $response->assertJson([
            'success' => true,
            'data' => [
                'pemasukan' => 500000,
                'pengeluaran' => 200000
            ]
        ]);
    }
}
