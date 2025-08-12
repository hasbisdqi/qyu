<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        $stats = Queue::selectRaw("DATE(created_at) as date, 
                        SUM(status = 'waiting') as waiting,
                        SUM(status = 'serving') as serving,
                        SUM(status = 'done') as done,
                        SUM(status = 'skipped') as skipped,
                        COUNT(*) as total")
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        

        return Inertia::render('dashboard', [
            'stats' => $stats
        ]);
    }
}
