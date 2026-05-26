<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Category;

class CleanupCategories extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cleanup-categories';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Hapus semua kategori yang ada dan buat ulang dengan struktur shared (user_id = NULL)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Disable foreign key check
        \DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // Hapus semua kategori
        Category::query()->delete();
        $this->info('✓ Semua kategori di database dihapus');

        // Enable foreign key check
        \DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Buat kategori default yang shared
        $defaultCategories = [
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

        foreach ($defaultCategories as $category) {
            Category::create([
                'user_id' => null,
                'name' => $category['name'],
                'type' => $category['type'],
                'color' => $category['color'],
            ]);
        }

        $this->line('');
        $this->info('✅ Kategori berhasil dibuat ulang dengan struktur shared (user_id = NULL)');
        $this->line('Setiap user sekarang dapat mengakses 10 kategori default yang sama!');
    }
}
