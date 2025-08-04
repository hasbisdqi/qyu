"use client"

import { Head, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

export default function UserCreate({ types }: { types: { code: string, name: string }[] }) {
  const { data, setData, post } = useForm({ type: '' })
  const [loading, setLoading] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    post(route('queue.user.store'))
  }

  return (
    <>
      <Head title="Ambil Nomor Antrian" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-6">Ambil Nomor Antrian</h1>
        <form onSubmit={submit} className="space-y-4 w-full max-w-sm">
          <Select value={data.type} onValueChange={(val) => setData('type', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis antrian" />
            </SelectTrigger>
            <SelectContent>
              {types.map((t) => (
                <SelectItem key={t.code} value={t.code}>
                  {t.code} - {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" disabled={!data.type || loading}>
            {loading ? 'Memproses...' : 'Ambil Nomor'}
          </Button>
        </form>
      </div>
    </>
  )
}
