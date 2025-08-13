import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Counter, Queue } from '@/types';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, ConciergeBellIcon, InboxIcon, SkipForward, Volume2 } from 'lucide-react';

export default function Dashboard({ counter, queues, currentQueue, status }: { counter: Counter, queues: Queue[], currentQueue: Queue | null, status: "idle" | "called" | "serving" }) {
    const [queueStatus, setQueueStatus] = useState<"idle" | "called" | "serving">(status);
    const [disableNext, setDisableNext] = useState(false);

    function callNext() {
        if (queueStatus !== "idle" || queues.length === 0 || disableNext) return;
        setDisableNext(true);
        router.post(route('operator.next', counter.id), {}, {
            onSuccess: () => setQueueStatus("called"),
            preserveState: true,
        });
    }

    function handleRecall() {
        if (queueStatus !== "called") return;
        router.get(route('operator.recall', counter.id), {}, {
            onSuccess: () => setQueueStatus("called"),
            preserveState: true,
        })
    }

    function handleServe() {
        if (queueStatus !== "called") return;
        router.post(route('operator.serve', counter.id), {}, {
            onSuccess: () => setQueueStatus("serving"),
            preserveState: true,
        })
    }

    function handleSkip() {
        if (queueStatus !== "called") return;
        router.post(route('operator.skip', counter.id), {}, {
            onSuccess: () => {
                setQueueStatus("idle");
                setDisableNext(false);
            },
            preserveState: true,
        });
    }

    function handleDone() {
        if (queueStatus !== "serving") return;
        router.post(route('operator.done', counter.id), {}, {
            onSuccess: () => {
                setQueueStatus("idle")
                setDisableNext(false);
            },
            preserveState: true,
        });
    }
    return (
        <>
            <Head title="Operator Dashboard" />
            <div className="container mx-auto mt-12">
                <div className="flex items-center gap-4">
                    <h1 className='text-2xl font-bold'>Operator {counter.name}</h1>
                    <Badge>{counter.status}</Badge>
                </div>
                <p>Layanan : {counter.service?.name}</p>
                <div className="grid grid-cols-3 mt-4 gap-4">
                    <div className="col-span-2 gap-4 grid">
                        <Card>
                            <CardHeader>
                                <CardTitle>Call Queues</CardTitle>
                                <CardDescription className='text-sm text-muted-foreground'>Current queue being served</CardDescription>
                                <CardAction>
                                    <Badge>{queueStatus}</Badge>
                                </CardAction>
                            </CardHeader>
                            {queueStatus === "idle" ? (
                                <>
                                    <div className="flex items-center justify-center flex-col py-12">
                                        <InboxIcon strokeWidth={1} className='text-muted-foreground size-12' />
                                        <span className='text-muted-foreground'>No queue called</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <CardContent className='flex items-center flex-col justify-center'>
                                        <div className="aspect-square rounded-lg border bg-gradient-to-br from-primary/10 via-transparent to-primary/5 flex items-center justify-center w-fit p-4 mx-auto">
                                            <span className='text-5xl font-bold'>{currentQueue?.queue_number}</span>
                                        </div>
                                        <span className='pt-3 text-sm text-muted-foreground'>Service</span>
                                        <span className='font-bold'>{currentQueue?.service?.name}</span>
                                    </CardContent>
                                    <CardFooter className='flex justify-between gap-3'>
                                        {queueStatus === "called" && (
                                            <>
                                                <Button onClick={handleRecall} className='flex-1'><Volume2 /> Recall</Button>
                                                <Button onClick={handleServe} className='flex-1 bg-green-600 hover:bg-green-700 text-white'> <ConciergeBellIcon /> Serve</Button>
                                                <Button onClick={handleSkip} className='flex-1 bg-red-600 hover:bg-red-700 text-white'> <SkipForward /> Skip</Button>
                                            </>
                                        )}

                                        {queueStatus === "serving" && (
                                            <Button onClick={handleDone} className='w-full'> <CheckCircleIcon /> Done</Button>
                                        )}
                                    </CardFooter>
                                </>
                            )}
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Next Queues</CardTitle>
                                <CardDescription className='text-sm text-muted-foreground'>Next queue to be served</CardDescription>
                                <CardAction>
                                    <Button disabled={queueStatus !== "idle" || disableNext} onClick={callNext}>Call Next</Button>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {queues.map((queue) => (
                                        <Card className='w-full' key={queue.id}>
                                            <CardContent>
                                                <div className="flex items-center justify-between">
                                                    <span className='text-2xl font-bold'>{queue.queue_number}</span>
                                                    <Badge>{queue.status}</Badge>
                                                </div>
                                                <p className='text-sm text-muted-foreground'>Service: {queue.service?.name}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div >
                </div >
            </div >
        </>
    );
}
