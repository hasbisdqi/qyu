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

        try {
            // koneksi ke printer langsung
            $connector = new FilePrintConnector("/dev/usb/lp0");
            $printer = new Printer($connector);

            // teks yang mau dicetak
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->setTextSize(3, 3);
            $printer->text($queue->queue_number);
            $printer->feed(3);
            $printer->cut();

            $printer->close();
        } catch (Exception $e) {
            echo "❌ Print gagal: " . $e->getMessage() . "\n";
        }

        return back()->with('success', 'Your queue ticket has been created successfully.');
    }
}
