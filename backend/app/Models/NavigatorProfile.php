<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
        'profile_picture',
    ];

    protected $casts = [
        'languages' => 'array',
        'verified' => 'boolean',
    ];

    protected $appends = ['profile_picture_url'];

    public function getProfilePictureUrlAttribute()
    {
        if (!$this->profile_picture) {
            return null;
        }
        return Storage::url($this->profile_picture);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    
}
