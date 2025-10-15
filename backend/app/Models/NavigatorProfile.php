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
        'contact_info'
    ];

    protected $casts = [
        'languages' => 'array',
        'tags' => 'array',
        'verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
