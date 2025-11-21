<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Reservation;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
class ReservationController extends Controller
{
    public function home()
    {
        $rooms = Room::select('id', 'name', 'capacity', 'facilities', 'location', 'photo')->get();

        $notifications = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function($notif) {
                return [
                    'id' => $notif->id,
                    'title' => $notif->title,
                    'room' => $notif->room,
                    'status' => $notif->status,
                    'message' => $notif->message,
                    'created_at' => $notif->created_at,
                    'read' => $notif->read
                ];
            });
        
        $reservations = Reservation::where('user_id', Auth::id())
            ->with('room')
            ->orderBy('created_at', 'desc')
            ->limit(20) 
            ->get()
            ->map(function($res) {
                return [
                    'id' => $res->id,
                    'title' => $res->title,
                    'room' => $res->room->name,
                    'start' => $res->start_time,
                    'end' => $res->end_time,
                    'status' => $res->status
                ];
            });

        return Inertia::render('Reservations/Home', [
            'rooms' => $rooms,
            'notifications' => $notifications,
            'reservations' => $reservations
        ]);
    }

    public function showCalendar(Room $room)
    {
        $userId = Auth::id();
        $reservations = Reservation::where('room_id', $room->id)
            ->where(function($query) use ($userId) {
                $query->where('status', 'approved') 
                      ->orWhere(function($q) use ($userId) {
                          $q->where('user_id', $userId)
                            ->where('status', 'pending'); 
                      });
            })
            ->select('id', 'title', 'start_time', 'end_time', 'room_id', 'user_id', 'status')
            ->with('user:id,name')
            ->get();

        return Inertia::render('Reservations/Calendar', [
            'selectedRoom' => $room,
            'rooms' => Room::select('id', 'name')->get(),
            'reservations' => $reservations,
            'flash' => session('success') ? ['success' => session('success')] : null,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_id'    => 'required|exists:rooms,id',
            'title'      => 'required|string|max:255',
            'start_time' => 'required|date|after:now',
            'end_time'   => 'required|date|after:start_time',
        ]);

        $conflict = Reservation::where('room_id', $request->room_id)
            ->where('status', 'approved')
            ->where(function ($q) use ($request) {
                $q->whereBetween('start_time', [$request->start_time, $request->end_time])
                  ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                  ->orWhere(function ($q) use ($request) {
                      $q->where('start_time', '<=', $request->start_time)
                        ->where('end_time', '>=', $request->end_time);
                  });
            })->exists();

        if ($conflict) {
            return back()->withErrors(['start_time' => 'Waktu tersebut sudah dibooking! Silakan pilih waktu lain.']);
        }
        
        Reservation::create([
            'room_id'    => $request->room_id,
            'user_id'    => Auth::id(),
            'title'      => $request->title,
            'start_time' => $request->start_time,
            'end_time'   => $request->end_time,
            'status'     => 'pending', 
        ]);
        
        return back()->with('success', 'Reservasi berhasil dibuat untuk "' . $request->title . '"!');
    }

    public function cancel(Reservation $reservation)
    {
        $authUserId = Auth::id();
        $reservationUserId = $reservation->user_id;
        
        Log::info('Cancel Reservation Attempt', [
            'reservation_id' => $reservation->id,
            'reservation_user_id' => $reservationUserId,
            'reservation_user_id_type' => gettype($reservationUserId),
            'auth_user_id' => $authUserId,
            'auth_user_id_type' => gettype($authUserId),
            'strict_match' => ($reservationUserId === $authUserId),
            'loose_match' => ($reservationUserId == $authUserId),
            'int_match' => ((int)$reservationUserId === (int)$authUserId),
        ]);
        
        if ((int)$reservationUserId !== (int)$authUserId) {
            Log::error('Authorization Failed', [
                'reservation_user_id' => $reservationUserId,
                'auth_user_id' => $authUserId,
            ]);
            abort(403, 'Anda tidak memiliki akses untuk membatalkan reservasi ini.');
        }
        
        if (!in_array($reservation->status, ['pending', 'approved'])) {
            return back()->with('error', 'Reservasi tidak dapat dibatalkan. Status: ' . $reservation->status);
        }
        
        $reservation->update(['status' => 'cancelled']);
        
        Notification::create([
            'user_id' => $reservation->user_id,
            'title' => $reservation->title,
            'room' => $reservation->room->name,
            'status' => 'cancelled',
            'message' => 'Anda telah membatalkan reservasi ini.',
            'read' => false
        ]);
        
        return back()->with('success', 'Reservasi berhasil dibatalkan');
    }
}