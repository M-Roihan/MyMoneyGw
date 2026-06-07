<?php

namespace App\Console\Commands;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Console\Command;

class RecalculateBalance extends Command
{
    protected $signature = 'app:recalculate-balance';
    protected $description = 'Recalculate account balance based on transactions';

    public function handle()
    {
        // Reset semua balance ke 0
        Account::all()->each(function($account) {
            $account->update(['balance' => 0]);
        });

        $this->info('Reset all balances to 0');

        // Recalculate balance dari transaksi
        foreach(Transaction::all() as $transaction) {
            $account = Account::find($transaction->account_id);
            if ($account) {
                if ($transaction->type === 'income') {
                    $account->balance += $transaction->amount;
                } else {
                    $account->balance -= $transaction->amount;
                }
                $account->save();
            }
        }

        $this->info('Balance recalculated successfully!');
    }
}
