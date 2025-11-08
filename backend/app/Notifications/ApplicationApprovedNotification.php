<?php

namespace App\Notifications;

use App\Models\NavigatorApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class ApplicationApprovedNotification extends Notification
{
    use Queueable;
    protected $application;
    /**
     * Create a new notification instance.
     */
    public function __construct(NavigatorApplication $application)
    {
        //
        $this->application = $application;

        Log::info("Application in the notification : {$this->application->full_name}");
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Hello There! Application Approved.')
            ->greeting("Hello, {$this->application->full_name}!")
            ->line('We are thrilled to Tell you That the Your application To join TAMAZIRT community has been Approved !.')
            ->line('Will Contact You soon to get you email and password to Login to the Application and start the journy')
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
