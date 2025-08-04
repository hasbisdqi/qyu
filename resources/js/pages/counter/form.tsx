"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { BreadcrumbItem } from "@/types"

export default function NewCounterPage() {
    //   const router = useRouter()
    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [status, setStatus] = useState("open")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // // Simpan data ke backend Laravel API
        // await fetch("/api/counters", {
        //   method: "POST",    
        //   body: JSON.stringify({ name, type, status }),
        //   headers: { "Content-Type": "application/json" }
        // })
        // router.push("/counters")
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
                    <div className="">

                        <h1 className="text-2xl font-bold">Tambah Loket</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nama Loket</Label>
                                <Input
                                    id="name"
                                    placeholder="Loket 1"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="type">Jenis Layanan</Label>
                                <Input
                                    id="type"
                                    placeholder="Customer Service / Pembayaran"
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
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
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
