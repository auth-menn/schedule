<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Reservation;
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

        $events = Reservation::with(['user', 'room'])->get()->map(fn($r) => [
            'id' => $r->id,
            'title' => "{$r->title} - {$r->user->name}",
            'start' => $r->start_time,
            'end' => $r->end_time,
            'backgroundColor' => $r->status === 'approved' ? '#10b981' : '#f59e0b',
            'borderColor' => $r->status === 'approved' ? '#10b981' : '#f59e0b',
            'extendedProps' => [
                'room' => $r->room->name,
                'user' => $r->user->name,
                'status' => $r->status,
            ],
        ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'reservations' => $reservations,
            'events' => $events,
        ]);
    }

    public function updateStatus(Request $request, Reservation $reservation)
    {
        $reservation->update(['status' => $request->status]);
        return back()->with('success', 'Status reservasi diperbarui!');
    }
}