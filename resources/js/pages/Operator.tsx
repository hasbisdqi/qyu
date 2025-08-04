import { Head, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function Operator({
  counter,
  current,
  next,
}: {
  counter: { id: number; name: string; type: string }
  current: any
  next: any
}) {
  return (
    <>
      <Head title={`Operator - ${counter.name}`} />
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-4">{counter.name} - {counter.type}</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Tiket Sedang Dilayani */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Sedang Dilayani</CardTitle>
            </CardHeader>
            <CardContent>
              {current ? (
                <p className="text-6xl font-bold text-blue-600">{current.queue_number}</p>
              ) : (
                <p className="text-gray-500">Belum ada antrian</p>
              )}
            </CardContent>
          </Card>

          {/* Tiket Berikutnya */}
          <Card>
            <CardHeader>
              <CardTitle>Berikutnya</CardTitle>
            </CardHeader>
            <CardContent>
              {next ? (
                <p className="text-4xl font-bold">{next.queue_number}</p>
              ) : (
                <p className="text-gray-500">Tidak ada</p>
              )}
            </CardContent>
          </Card>

          {/* Tombol Aksi */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                onClick={() => router.post(route('operator.call', counter.id))}
              >
                Panggil
              </Button>
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => router.post(route('operator.recall', counter.id))}
                disabled={!current}
              >
                Panggil Ulang
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => router.post(route('operator.skip', counter.id))}
                disabled={!current}
              >
                Skip
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => router.post(route('operator.next', counter.id))}
              >
                Next
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
