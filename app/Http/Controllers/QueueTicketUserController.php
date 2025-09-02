<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\QueueTicket;
use App\Models\Service;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Mike42\Escpos\Printer;

class QueueTicketUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Queue/UserIndex');
    }

    public function create()
    {
        $services = Service::get();
        return Inertia::render('Queue/UserCreate', [
            'services' => $services
        ]);
    }

    public function show(Queue $queue)
    {
        return Inertia::render('Queue/UserResult', [
            'queue' => $queue->load('service'),
            'shouldPrint' => session('shouldPrint', false),
        ]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
        ]);
        $service = Service::findOrFail($validated['service_id']);

        $lastQueue = $service->queues()->latest('id')->first();

        if ($lastQueue) {
            // Ambil hanya angka di akhir
            preg_match('/\d+$/', $lastQueue->queue_number, $matches);
            $lastNumber = $matches ? intval($matches[0]) : 0;
        } else {
            $lastNumber = 0;
        }

        $newQueueNumber = $service->code . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);

        // Simpan queue baru
        $queue = $service->queues()->create([
            'queue_number' => $newQueueNumber,
        ]);

        return redirect()
            ->route('queue.show', $queue->id)
            ->with('shouldPrint', true);
        // return redirect()->route('queue.show', $queue->id);
    }
}
