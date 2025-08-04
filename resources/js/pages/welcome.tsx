import { Head } from '@inertiajs/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type QueueTicket = {
  id: number
  queue_number: string
}

type Counter = {
  id: number
  name: string
  type: string
  current?: QueueTicket
  waiting: QueueTicket[]
}

export default function Display({ counters }: { counters: Counter[] }) {
  return (
    <>
      <Head title="Display Antrian" />
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Antrian Loket</h1>
        <div className="grid grid-cols-3 gap-6">
          {counters.map((counter) => (
            <Card key={counter.id} className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl">
                  {counter.name} <span className="text-sm text-gray-400">({counter.type})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Sedang Dilayani:</p>
                  <p className="text-5xl font-bold">
                    {counter.current ? counter.current.queue_number : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Menunggu:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {counter.waiting.length > 0 ? (
                      counter.waiting.map((q) => (
                        <div
                          key={q.id}
                          className="bg-gray-800 rounded p-2 text-center text-lg"
                        >
                          {q.queue_number}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm col-span-2">Tidak ada</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
