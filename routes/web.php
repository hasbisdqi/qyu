<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CounterController;
use App\Http\Controllers\CounterOperatorController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\QueueTicketUserController;
use App\Http\Controllers\ServiceController;
use App\Models\Counter;
use App\Models\Service;

Route::get('/', function () {
    $services = Service::with([
        'queues' => function ($q) {
            $q->whereIn('status', ['waiting', 'called', 'serving'])
                ->orderBy('created_at')
                ->limit(1);
        },
        'counters.queues' => function ($q) {
            $q->whereIn('status', ['waiting', 'called', 'serving'])
                ->orderBy('created_at')
                ->limit(1);
        }
    ])->get();


    return Inertia::render('welcome', [
        'services' => $services
    ]);
})->name('home');

Route::get('/queue/get', [QueueTicketUserController::class, 'create'])->name('queue.user.create');
Route::post('/queue/get', [QueueTicketUserController::class, 'store'])->name('queue.user.store');

Route::prefix('operator')->group(function () {
    Route::get('/', [CounterOperatorController::class, 'index'])->name('operator.index');
    Route::get('/{counter}', [CounterOperatorController::class, 'show'])->name('operator.show');
    Route::post('/{counter}/next', [CounterOperatorController::class, 'next'])->name('operator.next');
    Route::get('/{counter}/recall', [CounterOperatorController::class, 'recall'])->name('operator.recall');
    Route::post('/{counter}/serve', [CounterOperatorController::class, 'serve'])->name('operator.serve');
    Route::post('/{counter}/done', [CounterOperatorController::class, 'done'])->name('operator.done');
    Route::post('/{counter}/skip', [CounterOperatorController::class, 'skip'])->name('operator.skip');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::resource('counters', CounterController::class);
    Route::resource('services', ServiceController::class);
    Route::resource('queues', QueueController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
