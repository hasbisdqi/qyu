import { Head } from '@inertiajs/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
// import { useTheme } from "next-themes";
import { useEffect } from 'react'
import { useAppearance } from '@/hooks/use-appearance'
import { Counter, Queue } from '@/types';

export default function Display({ counters, queue }: { counters: Counter[], queue: Queue }) {
    const { updateAppearance } = useAppearance();

    useEffect(() => {
        // Paksa light mode
        updateAppearance('light');
    }, [updateAppearance]);
    return (
        <>
            <Head title="Display Antrian" />
            <div className="min-h-screen p-8">
                <h1 className="text-4xl font-bold mb-8 text-center">Antrian Loket</h1>
                {queue?.number ?? ''}
                <div className="flex w-full justify-center gap-3">
                    {counters.map((c) => (
                        <Card className='w-full'>
                            <CardHeader>

                                <CardTitle>{c.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* {c.?.queue_number ?? ''} */}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}
