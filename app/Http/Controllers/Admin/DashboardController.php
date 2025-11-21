<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Reservation;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_rooms' => Room::count(),
            'today_reservations' => Reservation::whereDate('start_time', today())->count(),
            'total_users' => \App\Models\User::count(),
            'pending_reservations' => Reservation::where('status', 'pending')->count(),
        ];

        $reservations = Reservation::with(['user', 'room'])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'title' => $r->title,
                'room' => $r->room->name,
                'user' => $r->user->name,
                'start' => $r->start_time,
                'end' => $r->end_time,
                'status' => $r->status,
            ]);

        $events = Reservation::with(['user', 'room'])->get()->map(function($r) {
            $backgroundColor = match($r->status) {
                'approved' => '#10b981', 
                'rejected' => '#ef4444',  
                'cancelled' => '#6b7280',
                default => '#f59e0b',     
            };

            return [
                'id' => $r->id,
                'title' => "{$r->title} - {$r->user->name}",
                'start' => $r->start_time,
                'end' => $r->end_time,
                'backgroundColor' => $backgroundColor,
                'borderColor' => $backgroundColor,
                'extendedProps' => [
                    'room' => $r->room->name,
                    'user' => $r->user->name,
                    'status' => $r->status,
                ],
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'reservations' => $reservations,
            'events' => $events,
        ]);
    }

    public function updateStatus(Request $request, Reservation $reservation)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $reservation->update(['status' => $request->status]);

        $message = $request->status === 'approved' 
            ? 'Reservasi Anda telah disetujui oleh admin.' 
            : 'Reservasi Anda ditolak oleh admin.';

        Notification::create([
            'user_id' => $reservation->user_id,
            'title' => $reservation->title,
            'room' => $reservation->room->name,
            'status' => $request->status,
            'message' => $message,
            'read' => false
        ]);

        return back()->with('success', 'Status reservasi diperbarui dan notifikasi telah dikirim!');
    }
}