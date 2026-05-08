<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Saving extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'name', 'target_amount', 'current_amount', 'target_date'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Melacak riwayat transaksi yang masuk ke tabungan ini
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}