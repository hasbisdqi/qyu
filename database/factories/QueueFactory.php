<?php

namespace Database\Factories;

use App\Models\Counter;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Queue>
 */
class QueueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'queue_number' => strtoupper(fake()->bothify('Q###')),
            'service_id' => Service::inRandomOrder()->first()?->id ?? Service::factory(),
            'status' => fake()->randomElement(['waiting', 'serving', 'done', 'skipped']),
            'counter_id' => fake()->boolean(70) // 70% punya loket
                ? (Counter::inRandomOrder()->first()?->id ?? Counter::factory())
                : null,
        ];
    }
}
