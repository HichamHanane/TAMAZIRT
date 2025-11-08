<?php

namespace App\Listeners;

use App\Notifications\ApplicationApprovedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class ApplicationApprovedListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        //
        Log::info("Application in the listenr{$event->application}");
        $event->application->notify(new ApplicationApprovedNotification($event->application));


    }
}
