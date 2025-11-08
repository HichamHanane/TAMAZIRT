<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavigatorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'city',
        'bio',
        'languages',
        'verified',
        'phone_number',
        'average_rating',
    ];

    protected $casts = [
        'languages' => 'array',
        'verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
