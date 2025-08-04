<?php

namespace App\Http\Controllers;

use App\Models\QueueTicket;
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
        // Daftar type antrian
        $types = [
            ['code' => 'A', 'name' => 'Customer Service'],
            ['code' => 'B', 'name' => 'Pembayaran'],
        ];

        return Inertia::render('Queue/UserCreate', [
            'types' => $types
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:A,B'
        ]);

        // Ambil nomor terakhir dari type ini
        $lastTicket = QueueTicket::where('type', $request->type)
            ->orderBy('created_at', 'desc')
            ->first();

        $lastNumber = $lastTicket
            ? (int) substr($lastTicket->queue_number, 1)
            : 0;

        $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        $queueNumber = $request->type . $newNumber;

        $ticket = QueueTicket::create([
            'queue_number' => $queueNumber,
            'type' => $request->type,
            'status' => 'waiting'
        ]);

        return Inertia::render('Queue/UserResult', [
            'ticket' => $ticket
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(QueueTicket $queueTicket)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(QueueTicket $queueTicket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, QueueTicket $queueTicket)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QueueTicket $queueTicket)
    {
        //
    }
}
