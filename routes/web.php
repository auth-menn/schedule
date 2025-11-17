<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    // HOME: Admin ke dashboard, user biasa ke reservasi
    Route::get('/', function () {
        if (auth()->user()->role === 'admin') {
            // Redirect ke route admin.dashboard yang punya data
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('rooms.index');
    })->name('home');

    // === USER BIASA ===
    Route::get('/rooms', [ReservationController::class, 'home'])->name('rooms.index');
    Route::get('/room/{room}', [ReservationController::class, 'showCalendar'])
        ->name('room.calendar');
    Route::post('/reservations', [ReservationController::class, 'store'])
        ->name('reservations.store');

    // === ADMIN ===
    Route::prefix('admin')
        ->middleware('admin:admin')
        ->as('admin.')
        ->group(function () {
            Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])
                ->name('dashboard');
            Route::patch('/reservations/{reservation}/status', [App\Http\Controllers\Admin\DashboardController::class, 'updateStatus'])
                ->name('reservations.status');
        });

    // Profile semua user
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';