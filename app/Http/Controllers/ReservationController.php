<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    public function home()
    {
        $rooms = Room::select('id', 'name', 'capacity', 'facilities', 'location', 'photo')->get();

        return Inertia::render('Reservations/Home', [
            'rooms' => $rooms
        ]);
    }

    public function showCalendar(Room $room)
    {
        $reservations = Reservation::where('room_id', $room->id)
            ->select('id', 'title', 'start_time', 'end_time', 'room_id', 'user_id')
            ->with('user:id,name') // optional: kalau mau tampilkan nama user
            ->get();

        return Inertia::render('Reservations/Calendar', [
            'selectedRoom' => $room,
            'rooms' => Room::select('id', 'name')->get(),
            'reservations' => $reservations,
            'flash' => session('success') ? ['success' => session('success')] : null,
        ]);
    }

    // FITUR BARU: Simpan reservasi + cek bentrok
    public function store(Request $request)
    {
        $request->validate([
            'room_id'    => 'required|exists:rooms,id',
            'title'      => 'required|string|max:255',
            'start_time' => 'required|date|after:now',
            'end_time'   => 'required|date|after:start_time',
        ]);

        // CEK BENTROK WAKTU
        $conflict = Reservation::where('room_id', $request->room_id)
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
            'user_id'    => Auth::id() ?? 1,
            'title'      => $request->title,
            'start_time' => $request->start_time,
            'end_time'   => $request->end_time,
        ]);
        return back()->with('success', 'Reservasi berhasil dibuat untuk "' . $request->title . '"!');
    }
}