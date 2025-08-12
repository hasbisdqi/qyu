<?php

namespace App\Http\Controllers;

use App\Models\Counter;
use App\Models\Queue;
use App\Models\QueueTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CounterOperatorController extends Controller
{
    public function show(Counter $counter)
    {

        $queues = Queue::with('service')
            ->whereIn('status', ['waiting', 'serving'])
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Operator', [
            'queues' => $queues,
        ]);
    }

    public function call(Request $request, $counterId)
    {
        // Pastikan counter open
        $counter = Counter::findOrFail($counterId);
        if ($counter->status !== 'open') {
            return response()->json(['message' => 'Counter is closed'], 400);
        }

        // Cari queue berikutnya yang waiting sesuai tipe counter
        $queue = QueueTicket::where('status', 'waiting')
            // ->when($counter->type, fn($q) => $q->where('type', $counter->type))
            ->orderBy('id') // nomor terkecil dulu
            ->first();

        if (!$queue) {
            return response()->json(['message' => 'No waiting queue found'], 404);
        }

        // Update queue menjadi serving
        $queue->update([
            'status'     => 'serving',
            'counter_id' => $counter->id,
            'called_at'  => now(),
        ]);

        return response()->json($queue);
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
