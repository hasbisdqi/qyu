import { Head, router } from '@inertiajs/react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
// import { useTheme } from "next-themes";
import { useEffect } from 'react'
import { useAppearance } from '@/hooks/use-appearance'
import { Counter, Queue, Service } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useEcho } from '@laravel/echo-react';


export default function Display({ services }: { services: Service[] }) {
    const counters = services.map(s => s.counters).flat();

    useEcho(
        'queue',
        "QueueUpdated",
        ({ queue }: { queue: Queue }) => {
            console.log("Queue updated event received:", queue);
            console.log("DEBUG status:", queue.status);
            if (queue.status == 'called') {
                console.log("🔔 Memanggil nomor antrian:", queue.queue_number);
                const synth = new SpeechSynthesisUtterance(
                    `Nomor antrian ${queue.queue_number}, silahkan menuju ke ${queue.counter?.name}`
                );
                synth.lang = 'id-ID';

                window.speechSynthesis.speak(synth);
            }


            router.reload({ only: ['services'] });
        },
    );
    return (
        <>
            <Head title="Display Antrian" />
            <div className="min-h-screen p-8">
                <h1 className="text-4xl font-bold mb-8 text-center">Antrian Loket</h1>
                <div className="grid md:grid-cols-5 gap-4">
                    <div className="grid gap-2">
                        {services.map((service) => {
                            return (
                                <Card key={service.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-2xl font-bold">{service.name}</CardTitle>
                                                <CardDescription>Antrian Saat Ini</CardDescription>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {service.counters?.filter(c => c.status === 'open').length} / {service.counters?.length} Open
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex items-center justify-between">
                                        <div>
                                            <p className="text-4xl font-bold text-primary">
                                                {service.queues[0]?.queue_number ?? 'No queue'}
                                            </p>
                                            {service.queues[0] && (
                                                <Badge variant="secondary" className="mt-1">
                                                    {service.queues[0]?.status}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                            )
                        })}
                    </div>
                    <div className="col-span-4 grid md:grid-cols-2 lg:grid-cols-4 gap-2 h-fit">
                        {counters.map((counter) => (
                            <Card key={counter?.id} className="p-4 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 shadow border relative">
                                <CardHeader className="flex justify-between items-center">
                                    <CardTitle className="text-lg font-bold">{counter?.name}</CardTitle>
                                    <Badge className="text-sm" variant={counter?.status === 'open' ? 'default' : 'secondary'}>
                                        {counter?.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center flex-col py-4">
                                        <span className="text-6xl font-bold">{counter?.queues[0]?.queue_number || 'N/A'}</span>
                                        {counter?.queues[0] && (
                                            <Badge variant="secondary" className="mt-2">
                                                {counter?.queues[0]?.status}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <p>Layanan: {counter?.service?.name || 'N/A'}</p>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
