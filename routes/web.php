<?php

use Inertia\Inertia;
use App\Models\Counter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CounterController;
use App\Http\Controllers\CounterOperatorController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\QueueTicketUserController;
use App\Http\Controllers\ServiceController;
use App\Models\Queue;
use App\Models\QueueTicket;
use App\Models\Service;

Route::get('/', function () {
    $counters = Counter::with(['queueTickets' => function ($q) {
        $q->orderBy('created_at', 'asc');
    }])
        ->where('status', 'open')
        ->get()
        ->map(function ($counter) {
            return [
                'id' => $counter->id,
                'name' => $counter->name,
                'type' => $counter->type,
                'current' => $counter->queueTickets->firstWhere('status', 'serving')
            ];
        });
    $queue = QueueTicket::where('status', '=', 'serving')
        ->orderBy('created_at', 'desc')->first();

    return Inertia::render('welcome', [
        'counters' => $counters,
        'queue' => $queue
    ]);
})->name('home');

Route::get('/queue/get', [QueueTicketUserController::class, 'create'])->name('queue.user.create');
Route::post('/queue/get', [QueueTicketUserController::class, 'store'])->name('queue.user.store');

Route::prefix('operator/{counter}')->group(function () {
    Route::get('/', [CounterOperatorController::class, 'show'])->name('operator.show');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::resource('counters', CounterController::class);
    Route::resource('services', ServiceController::class);
    Route::resource('queues', QueueController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
