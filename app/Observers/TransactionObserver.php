<?php

namespace App\Observers;

use App\Models\Transaction;
use App\Models\Account;

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
     * Update saldo akun. Jika pemasukan bertambah, jika pengeluaran berkurang.
     */
    private function updateAccountBalance($accountId, $amount, $type): void
    {
        if (!$accountId) return;

        $account = Account::find($accountId);
        if ($account) {
            if ($type === 'pemasukan') {
                $account->balance += $amount;
            } else if ($type === 'pengeluaran') {
                $account->balance -= $amount;
            }
            $account->save();
        }
    }

    /**
     * Revert efek transaksi pada saldo akun.
     */
    private function revertAccountBalance($accountId, $amount, $type): void
    {
        if (!$accountId) return;

        $account = Account::find($accountId);
        if ($account) {
            if ($type === 'pemasukan') {
                $account->balance -= $amount;
            } else if ($type === 'pengeluaran') {
                $account->balance += $amount;
            }
            $account->save();
        }
    }
}
