"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { BreadcrumbItem } from "@/types"
type Counter = {
  id: number
  name: string
  type: string
}
export default function NewCounterPage() {
    //   const router = useRouter()
    const [queueNumber, setQueueNumber] = useState("")
    const [type, setType] = useState("")
    const [status, setStatus] = useState("waiting")
    const [counterId, setCounterId] = useState<string | null>(null)
    const [counters, setCounters] = useState<Counter[]>([])
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
    }
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Counter',
            href: '/counter',
        },
        {
            title: 'Create',
            href: '/counter/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div className="max-w-md mx-auto space-y-6">
                        <h1 className="text-2xl font-bold">Tambah Tiket Antrian</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="queueNumber">Nomor Antrian</Label>
                                <Input
                                    id="queueNumber"
                                    placeholder="A001"
                                    value={queueNumber}
                                    onChange={(e) => setQueueNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="type">Jenis Antrian</Label>
                                <Input
                                    id="type"
                                    placeholder="A / B"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="waiting">Waiting</SelectItem>
                                        <SelectItem value="serving">Serving</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                        <SelectItem value="skipped">Skipped</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Loket (opsional)</Label>
                                <Select value={counterId ?? ""} onValueChange={setCounterId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih loket" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Tanpa Loket</SelectItem>
                                        {counters.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.name} - {c.type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit">Simpan</Button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
