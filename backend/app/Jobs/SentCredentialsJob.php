<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\SentCredentialsNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SentCredentialsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $user;
    protected $password;
    /**
     * Create a new job instance.
     */
    public function __construct(User $user, $password)
    {
        //
        $this->user = $user;
        $this->password = $password;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        logger( $this->password);
        $this->user->notify(new SentCredentialsNotification($this->user , $this->password));
    }
}
