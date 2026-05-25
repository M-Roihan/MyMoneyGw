<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Saving;

class SavingTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_get_own_savings()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Saving::factory()->create(['user_id' => $user->id, 'name' => 'My Saving']);
        Saving::factory()->create(['user_id' => $otherUser->id, 'name' => 'Other Saving']);

        $response = $this->actingAs($user)->getJson('/api/savings');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         '*' => [
                             'id', 'user_id', 'name', 'target_amount', 'current_amount', 'target_date'
                         ]
                     ]
                 ]);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('My Saving', $data[0]['name']);
    }

    public function test_user_can_create_saving()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/savings', [
            'name' => 'Beli Motor',
            'target_amount' => 15000000,
            'target_date' => '2026-12-31'
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('savings', [
            'user_id' => $user->id,
            'name' => 'Beli Motor',
            'target_amount' => 15000000,
            'current_amount' => 0,
        ]);
    }

    public function test_create_saving_requires_name_and_target()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/savings', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'target_amount']);
    }

    public function test_user_can_deposit_to_saving()
    {
        $user = User::factory()->create();
        $saving = Saving::factory()->create([
            'user_id' => $user->id,
            'target_amount' => 1000000,
            'current_amount' => 0,
        ]);

        $response = $this->actingAs($user)->postJson("/api/savings/{$saving->id}/deposit", [
            'amount' => 500000
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('savings', [
            'id' => $saving->id,
            'current_amount' => 500000,
        ]);
    }

    public function test_deposit_cannot_exceed_target()
    {
        $user = User::factory()->create();
        $saving = Saving::factory()->create([
            'user_id' => $user->id,
            'target_amount' => 1000000,
            'current_amount' => 900000,
        ]);

        $response = $this->actingAs($user)->postJson("/api/savings/{$saving->id}/deposit", [
            'amount' => 200000
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('savings', [
            'id' => $saving->id,
            'current_amount' => 1000000,
        ]);
    }

    public function test_user_can_update_own_saving()
    {
        $user = User::factory()->create();
        $saving = Saving::factory()->create([
            'user_id' => $user->id,
            'name' => 'Nama Lama',
        ]);

        $response = $this->actingAs($user)->putJson("/api/savings/{$saving->id}", [
            'name' => 'Nama Baru',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('savings', [
            'id' => $saving->id,
            'name' => 'Nama Baru',
        ]);
    }

    public function test_user_cannot_update_others_saving()
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();

        $saving = Saving::factory()->create([
            'user_id' => $owner->id,
            'name' => 'Milik Owner',
        ]);

        $response = $this->actingAs($otherUser)->putJson("/api/savings/{$saving->id}", [
            'name' => 'Mencoba Bajak',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_own_saving()
    {
        $user = User::factory()->create();
        $saving = Saving::factory()->create([
            'user_id' => $user->id,
            'name' => 'Saving Untuk Dihapus',
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/savings/{$saving->id}");

        $response->assertStatus(200);

        $this->assertSoftDeleted('savings', [
            'id' => $saving->id,
        ]);
    }
}
