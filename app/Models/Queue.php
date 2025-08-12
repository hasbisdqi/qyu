<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'service_id',
        'number',
        'status',
        'called_at',
        'finished_at'
    ];
}
