<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // NONAKTIFKAN FOREIGN KEY CHECK sementara (BIAR BISA TRUNCATE)
        Schema::disableForeignKeyConstraints();

        // Hapus semua user (sekarang boleh karena FK dimatikan)
        DB::table('users')->truncate();

        // Admin Kantor
        DB::table('users')->insert([
            'name' => 'Admin Kantor',
            'email' => 'admin@kantor.com',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
            'role' => 'admin', // <-- ADMIN
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Manager
        DB::table('users')->insert([
            'name' => 'Budi Manager',
            'email' => 'budi@kantor.com',
            'password' => Hash::make('budi123'),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Karyawan
        DB::table('users')->insert([
            'name' => 'Siti Karyawan',
            'email' => 'siti@kantor.com',
            'password' => Hash::make('siti123'),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 7 User Random
        $names = ['Ahmad', 'Rina', 'Dedi', 'Laras', 'Fajar', 'Intan', 'Rudi'];
        foreach ($names as $index => $name) {
            DB::table('users')->insert([
                'name' => $name . ' ' . ($index < 3 ? 'Staff' : 'Intern'),
                'email' => strtolower($name) . '@kantor.com',
                'password' => Hash::make('user123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // AKTIFKAN LAGI FOREIGN KEY CHECK
        Schema::enableForeignKeyConstraints();

        $this->command->info('10 User berhasil dibuat!');
        $this->command->info('Login admin → admin@kantor.com / admin123');
        $this->command->info('Lainnya → nama@kantor.com / user123');
    }
}