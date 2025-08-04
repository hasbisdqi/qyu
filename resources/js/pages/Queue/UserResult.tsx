import { Head } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

export default function UserResult({ ticket }: { ticket: { queue_number: string, type: string } }) {
  return (
    <>
      <Head title="Nomor Antrian Anda" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-4">Nomor Antrian Anda</h1>
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <p className="text-gray-500">Nomor Anda</p>
          <p className="text-6xl font-bold text-blue-600">{ticket.queue_number}</p>
        </div>
        <Button className="mt-6" onClick={() => window.location.href = route('queue.user.create')}>
          Ambil Nomor Lagi
        </Button>
      </div>
    </>
  )
}
