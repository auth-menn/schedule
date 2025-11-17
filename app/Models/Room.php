<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'capacity',
        'location',
        'facilities',
        'photo',
    ];

    public function getPhotoUrlAttribute()
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }
}