<?php

namespace App\Models;

use App\Observers\QueueObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([QueueObserver::class])]
class Queue extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'service_id',
        'queue_number',
        'status',
        'counter_id',
        'called_at',
        'finished_at'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function counter()
    {
        return $this->belongsTo(Counter::class);
    }
}
