<?php

namespace App\Notifications;

use App\Models\Request;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NavigatorRejectRequestNotification extends Notification
{
    use Queueable;
    protected $requestModel;
    /**
     * Create a new notification instance.
     */
    public function __construct(Request $requestModel)
    {
        //
        $this->requestModel = $requestModel;
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
            ->subject('Your Request For a Tour Response')
            ->line("Hello, {$this->requestModel->tourist->name}")
            ->line("You have Been sent a request to {$this->requestModel->navigator->name} , We are Sorry to tell you the navigator he can not take this trip with you.")
            ->line(" Please do not disappointed you can search for another navigator ")
            ->action('Login and choose one', url('/'))
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
