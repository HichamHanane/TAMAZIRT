<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Request extends Model
{
    use Notifiable;
    protected $fillable = [
        'tourist_id',
        'navigator_id',
        'status',
        'date',
        'message',
        'destination',
        'number_of_people'
    ];

    public function tourist()
    {
        return $this->belongsTo(User::class, 'tourist_id');
    }

    public function navigator()
    {
        return $this->belongsTo(User::class, 'navigator_id');
    }
}
