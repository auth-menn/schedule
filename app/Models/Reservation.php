<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'user_id',
        'title',
        'start_time',
        'end_time',
        'status'
    ];

    protected $casts = [
        'user_id' => 'integer',
        'room_id' => 'integer',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_CANCELLED = 'cancelled';

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function belongsToUser($userId): bool
    {
        return $this->user_id === (int)$userId;
    }
}