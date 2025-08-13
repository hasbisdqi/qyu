import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Counter } from '@/types';

export default function List({ counters }: { counters: Counter[] }) {

    return (
        <>
            <Head title="Operator List" />
            <div className="container mx-auto mt-12">

                <h1 className="text-2xl font-bold">Operator List</h1>
                <div className="grid my-4 gap-4">
                    {counters.map((counter) => (
                        <div key={counter.id} className=" p-4 rounded-lg bg-gradient-to-br from-primary/10 via-transparent to-primary/5 shadow border relative">
                            <Link href={`/operator/${counter.id}`} className="absolute inset-0" />
                            <h2 className="text-xl font-bold">{counter.name}</h2>
                            <p>Status: {counter.status ? 'Active' : 'Inactive'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
