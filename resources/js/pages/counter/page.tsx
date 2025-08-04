"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from "@/types"
import { Head, router } from "@inertiajs/react"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontalIcon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Counter',
        href: '/counter',
    },
];
type Counter = {
    id: number
    name: string
    type: string
    status: string
}
export default function CounterPage({ counters }: { counters: Counter[] }) {
    const columns: ColumnDef<Counter>[] = [
        { accessorKey: 'name', header: 'Nama Loket' },
        { accessorKey: 'type', header: 'Jenis Layanan' },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const counter = row.original
                const [status, setStatus] = useState(row.original.status)

                const toggleStatus = async (checked: boolean) => {
                    const newStatus = checked ? "open" : "closed"
                    setStatus(newStatus)

                    router.put(
                        route("counter.update", counter.id),
                        { status: newStatus },
                        { preserveScroll: true, preserveState: true }
                    )
                }

                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={status === "open"}
                            onCheckedChange={toggleStatus}
                        />
                        <Badge variant={status === "open" ? "default" : "secondary"}>
                            {status}
                        </Badge>
                    </div>
                )
            },
        },
    ]
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">

                <DataTable
                    columns={columns}
                    data={counters}
                    searchKey="nama"
                />
            </div>
        </AppLayout>
    )
}
