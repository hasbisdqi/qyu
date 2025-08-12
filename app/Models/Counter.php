<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Counter extends Model
{
    protected $fillable = [
        'name',
        'service_id',
        'status'
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
    public function queues(): HasMany
    {
        return $this->hasMany(Queue::class);
    }
}
