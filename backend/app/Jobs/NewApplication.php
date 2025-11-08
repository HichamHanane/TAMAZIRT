<?php

namespace App\Jobs;

use App\Models\NavigatorApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class NewApplication implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public NavigatorApplication $application)
    {
        //
        $this->application = $application;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        
    }
}
