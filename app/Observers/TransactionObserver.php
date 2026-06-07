<?php

namespace App\Observers;

use App\Models\Transaction;
use App\Models\Account;
use Illuminate\Support\Facades\DB;

class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        $this->updateAccountBalance($transaction->account_id, $transaction->amount, $transaction->type);
    }

    /**
     * Handle the Transaction "updated" event.
     */
    public function updated(Transaction $transaction): void
    {
        // Jika ada perubahan pada account, type, atau amount, revert yang lama dan aplikasikan yang baru.
        if ($transaction->wasChanged(['account_id', 'type', 'amount'])) {
            $oldAccountId = $transaction->getOriginal('account_id');
            $oldAmount = $transaction->getOriginal('amount');
            $oldType = $transaction->getOriginal('type');
            
            // Revert efek lama
            $this->revertAccountBalance($oldAccountId, $oldAmount, $oldType);

            // Terapkan efek baru
            $this->updateAccountBalance($transaction->account_id, $transaction->amount, $transaction->type);
        }
    }

    /**
     * Handle the Transaction "deleted" event.
     */
    public function deleted(Transaction $transaction): void
    {
        $this->revertAccountBalance($transaction->account_id, $transaction->amount, $transaction->type);
    }

    /**
     * Handle the Transaction "restored" event.
     */
    public function restored(Transaction $transaction): void
    {
        $this->updateAccountBalance($transaction->account_id, $transaction->amount, $transaction->type);
    }

    /**
     * Update saldo akun menggunakan raw query untuk menghindari casting issues
     */
    private function updateAccountBalance($accountId, $amount, $type): void
    {
        if (!$accountId) return;

        if ($type === 'income' || $type === 'pemasukan') {
            // Pemasukan: tambah balance
            DB::table('accounts')
                ->where('id', $accountId)
                ->increment('balance', $amount);
        } else if ($type === 'expense' || $type === 'pengeluaran') {
            // Pengeluaran: kurangi balance
            DB::table('accounts')
                ->where('id', $accountId)
                ->decrement('balance', $amount);
        }
    }

    /**
     * Revert efek transaksi pada saldo akun menggunakan raw query
     */
    private function revertAccountBalance($accountId, $amount, $type): void
    {
        if (!$accountId) return;

        if ($type === 'income' || $type === 'pemasukan') {
            // Balik pemasukan: kurangi balance
            DB::table('accounts')
                ->where('id', $accountId)
                ->decrement('balance', $amount);
        } else if ($type === 'expense' || $type === 'pengeluaran') {
            // Balik pengeluaran: tambah balance
            DB::table('accounts')
                ->where('id', $accountId)
                ->increment('balance', $amount);
        }
    }
}

