<?php

namespace App\Jobs;

use App\Models\NavigatorApplication;
use App\Notifications\NewApplicationNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NewApplication implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public NavigatorApplication $application;
    /**
     * Create a new job instance.
     */
    public function __construct(NavigatorApplication $application)
    {
        //
        $this->application = $application;

        Log::info("in the new application job : {$this->application}");
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        $this->application->notify(new NewApplicationNotification($this->application));
    }
}
