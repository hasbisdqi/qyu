<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\QueueTicket;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QueueTicketUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function create()
    {
        $services = Service::get();
        return Inertia::render('Queue/UserCreate', [
            'services' => $services
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
        ]);

        $service = Service::findOrFail($validated['service_id']);

        // Ambil nomor terakhir
        $lastQueue = $service->queues()->latest('id')->first();
        $lastNumber = $lastQueue ? intval(substr($lastQueue->queue_number, 1)) : 0;
        $newQueueNumber = $service->code . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        // dd($newQueueNumber);

        // Simpan queue baru
        $queue = $service->queues()->create([
            'queue_number' => $newQueueNumber,
        ]);


        return back()->with('success', 'Your queue ticket has been created successfully.');
    }
}
