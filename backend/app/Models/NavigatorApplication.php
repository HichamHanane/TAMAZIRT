<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class NavigatorApplication extends Model
{
    use Notifiable;
    protected $fillable = [
        'full_name',
        'email',
        'city',
        'motivation',
        'status',
        'phone_number'
    ];
}
