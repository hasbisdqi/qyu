<?php

use Inertia\Inertia;
use App\Models\Counter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CounterController;
use App\Http\Controllers\CounterOperatorController;
use App\Http\Controllers\QueueTicketUserController;

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
                'current' => $counter->queueTickets->firstWhere('status', 'serving'),
                'waiting' => $counter->queueTickets->where('status', 'waiting')->take(5)->values(),
            ];
        });

    return Inertia::render('welcome', [
        'counters' => $counters
    ]);
})->name('home');

Route::get('/queue/get', [QueueTicketUserController::class, 'create'])->name('queue.user.create');
Route::post('/queue/get', [QueueTicketUserController::class, 'store'])->name('queue.user.store');

Route::prefix('operator/{counter}')->group(function () {
    Route::get('/', [CounterOperatorController::class, 'show'])->name('operator.show');
    Route::post('/call', [CounterOperatorController::class, 'call'])->name('operator.call');
    Route::post('/recall', [CounterOperatorController::class, 'recall'])->name('operator.recall');
    Route::post('/skip', [CounterOperatorController::class, 'skip'])->name('operator.skip');
    Route::post('/next', [CounterOperatorController::class, 'next'])->name('operator.next');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('counter', CounterController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
