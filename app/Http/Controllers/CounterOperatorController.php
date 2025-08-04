<?php

namespace App\Http\Controllers;

use App\Models\Counter;
use App\Models\QueueTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CounterOperatorController extends Controller
{
    public function show(Counter $counter)
    {
        // Tiket yang sedang dilayani
        $current = QueueTicket::where('status', 'serving')
            ->first();

        // Tiket berikutnya
        $next = QueueTicket::where('status', 'waiting')
            ->orderBy('created_at', 'asc')
            ->first();

        return Inertia::render('Operator', [
            'counter' => $counter,
            'current' => $current,
            'next' => $next,
        ]);
    }

    public function call(Counter $counter)
    {
        // Kalau belum ada yang serving → ambil dari waiting
        $ticket = QueueTicket::where('type', substr($counter->type, 0, 1))
            ->where('status', 'waiting')
            ->orderBy('created_at', 'asc')
            ->first();

        if ($ticket) {
            $ticket->update([
                'status' => 'serving',
                'counter_id' => $counter->id,
                'called_at' => now(),
            ]);
        }

        return back();
    }

    public function recall(Counter $counter)
    {
        $ticket = QueueTicket::where('counter_id', $counter->id)
            ->where('status', 'serving')
            ->first();

        if ($ticket) {
            // Di sistem nyata mungkin trigger suara/pengumuman di sini
        }

        return back();
    }

    public function skip(Counter $counter)
    {
        $ticket = QueueTicket::where('counter_id', $counter->id)
            ->where('status', 'serving')
            ->first();

        if ($ticket) {
            $ticket->update(['status' => 'skipped']);
        }

        return back();
    }

    public function next(Counter $counter)
    {
        // Selesaikan yang sekarang
        QueueTicket::where('counter_id', $counter->id)
            ->where('status', 'serving')
            ->update(['status' => 'done', 'finished_at' => now()]);

        // Panggil yang berikutnya
        $ticket = QueueTicket::where('type', substr($counter->type, 0, 1))
            ->where('status', 'waiting')
            ->orderBy('created_at', 'asc')
            ->first();

        if ($ticket) {
            $ticket->update([
                'status' => 'serving',
                'counter_id' => $counter->id,
                'called_at' => now(),
            ]);
        }

        return back();
    }
}
