<?php

namespace App\Jobs;

use App\Models\Request;
use App\Notifications\NewApplicationNotification;
use App\Notifications\NewRequestSentNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SentRequest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $tourist_request;
    /**
     * Create a new job instance.
     */
    public function __construct(Request $tourist_request)
    {
        //
        $this->tourist_request = $tourist_request;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        $this->tourist_request->load(['tourist:id,name,email', 'navigator:id,name,email']);
        Log::info("Tourest request on the job handler : {$this->tourist_request}");
        $this->tourist_request->notify(new NewRequestSentNotification($this->tourist_request));

    }
}
