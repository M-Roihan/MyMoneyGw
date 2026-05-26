<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Category;

class InitializeCategoriesForUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:initialize-categories-for-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Buat default categories untuk semua user yang belum memiliki kategori';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $defaultCategories = [
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

        $users = User::all();
        $countUpdated = 0;

        foreach ($users as $user) {
            // Cek apakah user sudah memiliki kategori
            $categoryCount = Category::where('user_id', $user->id)->count();

            if ($categoryCount === 0) {
                // Buat kategori untuk user ini
                foreach ($defaultCategories as $category) {
                    Category::create([
                        'user_id' => $user->id,
                        'name' => $category['name'],
                        'type' => $category['type'],
                        'color' => $category['color'],
                    ]);
                }
                $countUpdated++;
                $this->info("✓ Kategori berhasil ditambahkan untuk user: {$user->email}");
            } else {
                $this->info("✗ User {$user->email} sudah memiliki kategori (skipped)");
            }
        }

        $this->line('');
        $this->info("✅ Total user yang diupdate: {$countUpdated}");
    }
}
