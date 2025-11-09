<?php

namespace App\Jobs;

use App\Models\Request;
use App\Notifications\NavigatorAcceptRequestNotification;
use App\Notifications\NavigatorRejectRequestNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NavigatorRequestResponse implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $requestModel;
    /**
     * Create a new job instance.
     */
    public function __construct(Request $requestModel)
    {
        //
        $this->requestModel = $requestModel;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        $this->requestModel->load(['tourist:id,name,email', 'navigator:id,name,email']);
        Log::info("The request in the navigator response job : {$this->requestModel}");

        if($this->requestModel->status == "HandOff") {
            $this->requestModel->tourist->notify(new NavigatorRejectRequestNotification($this->requestModel));
        }
        else{
            $this->requestModel->tourist->notify(new NavigatorAcceptRequestNotification($this->requestModel));
        }
    }
}
