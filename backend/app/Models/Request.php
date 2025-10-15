<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $fillable = [
        'tourist_id', 'navigator_id', 'status', 'date', 'message'
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
