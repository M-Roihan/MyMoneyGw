<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 
        'category_id', 
        'account_id', 
        'saving_id', 
        'type', 
        'amount', 
        'description', 
        'transaction_date'
    ];

    // Transaksi ini dibuat oleh satu User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Transaksi ini masuk ke satu Kategori
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Transaksi ini dilakukan lewat satu Akun (Bank/Cash)
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    // Transaksi ini (jika ada) terhubung ke satu target Tabungan
    public function saving(): BelongsTo
    {
        return $this->belongsTo(Saving::class);
    }
}