"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AppLayout from "@/layouts/app-layout"
import { Head, useForm } from "@inertiajs/react"
import { BreadcrumbItem, Counter, Service } from "@/types"

type FormData = {
    name: string
    service_id: string
    status: "open" | "closed"
}

export default function NewCounterPage({ counter, services }: { counter?: Counter, services: Service[] }) {
    const { data, setData, post, put, processing, errors } = useForm<FormData>({
        name: counter?.name ?? "",
        service_id: counter?.service_id?.toString() ?? "",
        status: counter?.status ?? "open"
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (counter) {
            put(route("counters.update", counter.id))
        } else {
            post(route("counters.store"))
        }
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Counter", href: "/counters" },
        { title: counter ? "Edit" : "Create", href: counter ? `/counters/${counter.id}/edit` : "/counters/create" }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={counter ? "Edit Counter" : "Tambah Counter"} />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div>
                        <h1 className="text-2xl font-bold">{counter ? "Edit Loket" : "Tambah Loket"}</h1>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nama Loket */}
                            <div>
                                <Label htmlFor="name">Nama Loket</Label>
                                <Input
                                    id="name"
                                    placeholder="Loket 1"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            {/* Jenis Layanan */}
                            <div>
                                <Label htmlFor="service_id">Jenis Layanan</Label>
                                <Select
                                    value={data.service_id}
                                    onValueChange={(value) => setData("service_id", value)}
                                >
                                    <SelectTrigger id="service_id">
                                        <SelectValue placeholder="Pilih service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.service_id && <p className="text-sm text-red-500">{errors.service_id}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value: "open" | "closed") => setData("status", value)}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>

                            {/* Submit */}
                            <Button type="submit" disabled={processing}>
                                {processing ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
