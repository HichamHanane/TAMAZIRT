<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavigatorApplication extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'city',
        'motivation',
        'status',
        'phone_number'
    ];
}
