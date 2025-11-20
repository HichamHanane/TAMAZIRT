<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SentCredentialsNotification extends Notification
{
    use Queueable;
    protected $user;
    protected $password;
    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, $password)
    {
        //
        $this->user = $user;
        $this->password = $password;
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
            ->subject('Your account credentials')
            ->line("Hello {$this->user->name}")
            ->line("We are happy to share with you that we create an account for and this is you credentials :")
            ->line("Login : {$this->user->email}")
            ->line("Password : {$this->password}")
            ->line("These credentials you can update them after you login to the application")
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
