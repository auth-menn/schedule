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
        $rooms = Room::latest()->get();

        return Inertia::render('Admin/Rooms/Index', [
            'rooms' => $rooms
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Rooms/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255|unique:rooms,name',
            'capacity'   => 'required|integer|min:1',
            'location'   => 'nullable|string|max:255',
            'facilities' => 'nullable|string',
            'photo'      => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('rooms', 'public');
        }

        Room::create($validated);

        return redirect()->route('admin.rooms.index')->with('success', 'Ruangan berhasil ditambahkan!');
    }

    public function edit(Room $room)
    {
        return Inertia::render('Admin/Rooms/Edit', [
            'room' => $room
        ]);
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255|unique:rooms,name,' . $room->id,
            'capacity'   => 'required|integer|min:1',
            'location'   => 'nullable|string|max:255',
            'facilities' => 'nullable|string',
            'photo'      => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($room->photo) {
                Storage::disk('public')->delete($room->photo);
            }
            $validated['photo'] = $request->file('photo')->store('rooms', 'public');
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