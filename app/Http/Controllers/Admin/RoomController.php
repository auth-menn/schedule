<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::latest()->get()->map(function ($room) {
            $room->photo_url = $room->photo ? asset('storage/' . $room->photo) : null;
            return $room;
        });

        return Inertia::render('Admin/Rooms/Index', [
            'rooms' => $rooms
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255|unique:rooms,name',
            'capacity'   => 'required|integer|min:1',
            'location'   => 'nullable|string|max:255',
            'facilities' => 'nullable|string',
            'photo'      => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('rooms', 'public');
        }

        Room::create($validated);

        return redirect()->route('admin.rooms.index')->with('success', 'Ruangan berhasil ditambahkan!');
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255|unique:rooms,name,' . $room->id,
            'capacity'   => 'required|integer|min:1',
            'location'   => 'nullable|string|max:255',
            'facilities' => 'nullable|string',
            'photo'      => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
            'current_photo' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            if ($room->photo) {
                Storage::disk('public')->delete($room->photo);
            }
            $validated['photo'] = $request->file('photo')->store('rooms', 'public');
        } elseif ($request->filled('current_photo')) {
            $validated['photo'] = $request->current_photo;
        }

        $room->update($validated);

        return redirect()->route('admin.rooms.index')->with('success', 'Ruangan berhasil diperbarui!');
    }

    public function destroy(Room $room)
    {
        if ($room->photo) {
            Storage::disk('public')->delete($room->photo);
        }
        $room->delete();

        return back()->with('success', 'Ruangan berhasil dihapus!');
    }
}