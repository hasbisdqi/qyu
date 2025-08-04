<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QueueTicket extends Model
{
    protected $fillable = [
        'queue_number',
        'type',
        'status',
        'counter_id',
        'called_at',
        'finished_at',
    ];
}
