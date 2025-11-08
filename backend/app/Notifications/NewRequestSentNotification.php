<?php

namespace App\Notifications;

use App\Models\Request;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class NewRequestSentNotification extends Notification
{
    use Queueable;
    protected Request $tourist_request;
    /**
     * Create a new notification instance.
     */
    public function __construct(Request $tourist_request)
    {
        //
        $this->tourist_request = $tourist_request;
        Log::info("Tourist request data in the notification : {$tourist_request->tourist}");
        Log::info("Navigator request in the notification: {$tourist_request->navigator}");
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
            ->subject('New Request From TAMAZIRT Platform')
            ->line("Hello {$this->tourist_request->navigator->name}")
            ->line("{$this->tourist_request->tourist->name} Has Request you for a tour !")
            ->line("Please Logi to you account to see more information")
            ->action('Notification Action', url('/login'))
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
