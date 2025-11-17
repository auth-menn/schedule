<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            [
                'name'       => 'Ruang Meeting A',
                'capacity'   => 12,
                'location'   => 'Lantai 3 Gedung A',
                'facilities' => 'Proyektor HD, TV 55", Whiteboard, AC, WiFi 100 Mbps',
                'photo'      => 'meeting-a.jpg', 
            ],
            [
                'name'       => 'Ruang Meeting B',
                'capacity'   => 25,
                'location'   => 'Lantai 5',
                'facilities' => 'Proyektor 4K, Sound System Bose, Video Conference Zoom, Meja Oval, AC 2PK',
                'photo'      => 'rapat-utama.jpg',
            ],
            [
                'name'       => 'Ruang Meeting C',
                'capacity'   => 40,
                'location'   => 'Lantai 2 Gedung B',
                'facilities' => '2 Proyektor, Whiteboard 3 meter, Meja Modular, AC 2PK, Mic Wireless',
                'photo'      => 'training.jpg',
            ],
        ];

        foreach ($rooms as $room) {
            Room::updateOrCreate(
                ['name' => $room['name']], 
                $room
            );
        }
    }
}