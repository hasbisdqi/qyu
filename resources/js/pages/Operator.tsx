import React from 'react';
import { Head } from '@inertiajs/react';
import { Queue } from '@/types';
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConciergeBellIcon, SkipForward, Volume2 } from 'lucide-react';

export default function Dashboard({ queues }: { queues: Queue[] }) {
    return (
        <>
            <Head title="Operator Dashboard" />
            <div className="grid grid-cols-3 m-4 gap-4">
                <Card className='col-span-2'>
                    <CardHeader>
                        <CardTitle>Queues</CardTitle>
                        <CardAction>
                            <Badge>Serving</Badge>
                        </CardAction>
                    </CardHeader>
                    <CardContent className='flex items-center flex-col justify-center'>
                        <div className="aspect-square rounded-lg border bg-gradient-to-br from-primary/10 via-transparent to-primary/5 flex items-center justify-center w-fit p-4 mx-auto">
                            <span className='text-5xl font-bold'>A001</span>
                        </div>
                        <span className='pt-3 text-sm text-muted-foreground'>Service</span>
                        <span className='font-bold'>Payment</span>
                    </CardContent>
                    <CardFooter className='flex justify-between gap-3'>
                        <Button className='flex-1'><Volume2 /> Recall</Button>
                        <Button className='flex-1 bg-green-600 hover:bg-green-700 text-white'> <ConciergeBellIcon /> Serve</Button>
                        <Button className='flex-1 bg-red-600 hover:bg-red-700 text-white'> <SkipForward /> Skip</Button>
                    </CardFooter>
                </Card>
                <Card className=''>
                    <CardHeader>
                        <CardTitle>Queues</CardTitle>
                        <CardAction>
                            <Badge>Serving</Badge>
                        </CardAction>
                    </CardHeader>
                    <CardContent className='flex items-center flex-col justify-center'>
                        <div className="aspect-square rounded-lg border bg-gradient-to-br from-primary/10 via-transparent to-primary/5 flex items-center justify-center w-fit p-4 mx-auto">
                            <span className='text-5xl font-bold'>A001</span>
                        </div>
                        <span className='pt-3 text-sm text-muted-foreground'>Service</span>
                        <span className='font-bold'>Payment</span>
                    </CardContent>
                    <CardFooter className='flex justify-between gap-3'>
                        <Button className='flex-1'><Volume2 /> Recall</Button>
                        <Button className='flex-1 bg-green-600 hover:bg-green-700 text-white'> <ConciergeBellIcon /> Serve</Button>
                        <Button className='flex-1 bg-red-600 hover:bg-red-700 text-white'> <SkipForward /> Skip</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
