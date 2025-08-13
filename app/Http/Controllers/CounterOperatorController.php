<?php

namespace App\Http\Controllers;

use App\Models\Counter;
use App\Models\Queue;
use App\Models\QueueTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CounterOperatorController extends Controller
{
    public function index()
    {
        $counters = Counter::all();
        return Inertia::render('operator/page', [
            'counters' => $counters
        ]);
    }
    public function show(Counter $counter)
    {
        $queues = Queue::with('service')
            ->where('service_id', $counter->service_id)
            ->where('status', 'waiting')
            ->orderBy('created_at')
            ->get();

        $currentQueue = Queue::where('counter_id', $counter->id)
            ->where('service_id', $counter->service_id) // tambahkan ini
            ->whereIn('status', ['called', 'serving'])
            ->first();



        return Inertia::render('operator/show', [
            'counter' => $counter->load('service'),
            'queues' => $queues,
            'currentQueue' => $currentQueue,
            'status' => $currentQueue ? ($currentQueue->status === 'serving' ? 'serving' : 'called') : 'idle'
        ]);
    }

    public function next(Counter $counter)
    {
        if ($counter->current_queue_id) {
            return back()->with('error', 'Masih ada queue aktif');
        }

        $queue = Queue::where('service_id', $counter->service_id)
            ->where('status', 'waiting')
            ->orderBy('created_at')
            ->first();

        if (!$queue) {
            return back()->with('error', 'Tidak ada antrian');
        }

        // dump($queue);
        $queue->update(['status' => 'called', 'counter_id' => $counter->id, 'called_at' => now()]);
        // dd($queue);

        // Event/broadcast ke display
        // event(new QueueCalled($queue, $counter));
        return 0;
    }
    public function recall(Counter $counter) {}
    public function serve(Counter $counter)
    {
        $queue = Queue::where('counter_id', $counter->id)
            ->whereIn('status', ['called'])
            ->first();

        if (!$queue) {
            return back()->with('error', 'Tidak ada antrian yang sedang dipanggil');
        }

        $queue->update(['status' => 'serving']);
        // Event/broadcast ke display
        // event(new QueueServed($queue, $counter));
        return 0;
    }
    public function done(Counter $counter)
    {
        $queue = Queue::where('counter_id', $counter->id)
            ->whereIn('status', ['serving'])
            ->first();

        if (!$queue) {
            return back()->with('error', 'Tidak ada antrian yang sedang dilayani');
        }

        $queue->update(['status' => 'done', 'finished_at' => now()]);
        // Event/broadcast ke display
        // event(new QueueDone($queue, $counter));
        return 0;
    }
    public function skip(Counter $counter)
    {
        $queue = Queue::where('counter_id', $counter->id)
            ->whereIn('status', ['called'])
            ->first();

        if (!$queue) {
            return back()->with('error', 'Tidak ada antrian yang sedang dipanggil');
        }

        $queue->update(['status' => 'skipped']);
        // Event/broadcast ke display
        // event(new QueueSkipped($queue, $counter));
        return 0;
    }
}
