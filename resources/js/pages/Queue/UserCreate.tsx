"use client"
import { Head, router } from '@inertiajs/react'
import { Card, CardContent } from '@/components/ui/card'
import { Service } from '@/types'
import { useState } from 'react'

export default function AddQueue({ services }: { services: Service[] }) {
    const [processing, setProcessing] = useState(false)

    const handleClick = (service_id: string) => {
        if (processing) return
        setProcessing(true)
        router.post(route('queue.user.store'), { service_id }, {
            onFinish: () => setProcessing(false),
            onError: (errors) => {
                // Handle errors, e.g., show a notification or alert
                console.error('Failed to create queue:', errors);
            }
        })
    }

    return (
        <>
            <Head title="Ambil Nomor Antrian" />
            <div className="container mx-auto mt-12">
                <h1 className="text-2xl font-bold mb-6 text-center">Pilih Layanan</h1>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    {services.map((service) => (
                        <Card
                            key={service.id}
                            className="cursor-pointer border hover:bg-primary/5 transition"
                            onClick={() => handleClick(String(service.id))}
                        >
                            <CardContent>
                                <h2 className="font-bold text-lg text-center">{service.name}</h2>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}
