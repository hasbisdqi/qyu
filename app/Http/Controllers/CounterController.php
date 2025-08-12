<?php

namespace App\Http\Controllers;

use App\Models\Counter;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CounterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $counters = Counter::with('service')->get();
        return Inertia::render('counter/page', ['counters' => $counters]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('counter/form', ['services' => Service::get()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'service_id' => 'required|exists:services,id',
            'status' => 'required',
        ]);

        Counter::create($validated);
        return to_route('counters.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Counter $counter)
    {
        return Inertia::render('counter/form', ['counter' => $counter, 'services' => Service::get()]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Counter $counter)
    {
        $validated = $request->validate([
            'name' => 'string',
            'service_id' => 'exists:services,id',
            'status' => 'required',
        ]);

        $counter->update($validated);

        return to_route('counters.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Counter $counter)
    {
        $counter->delete();
        return to_route('counters.index');
    }
}
