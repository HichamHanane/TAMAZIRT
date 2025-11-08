<?php

namespace App\Notifications;

use App\Models\NavigatorApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewApplicationNotification extends Notification
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
                    ->subject('New Navigator send an Application to join us ')
                    ->line('Hello Support Team')
                    ->line("Please Check the Admin panel , new navigatore sent an application with name ,{$this->application->full_name}")
                    ->line("Please Contact ,{$this->application->full_name} , To confirm the application")
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
