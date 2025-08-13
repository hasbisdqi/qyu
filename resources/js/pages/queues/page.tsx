"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Queue } from "@/types"
import { Head, Link, router } from "@inertiajs/react"
import { Button, buttonVariants } from "@/components/ui/button"
import { useState } from "react"
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { MoreVertical, Pencil, Trash } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { format } from "date-fns"

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Queue', href: '/queue' },
];

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    waiting: "secondary",
    serving: "default",
    done: "outline",
    skipped: "destructive"
}

export default function QueuePage({ queues }: { queues: Queue[] }) {
    const [queueStatus, setQueueStatus] = useState<Record<number, string>>(
        Object.fromEntries(queues.map(q => [q.id, q.status]))
    )
    const [loadingStatus, setLoadingStatus] = useState<Record<number, boolean>>({})

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [deleting, setDeleting] = useState(false)

    const updateStatus = async (id: number, newStatus: string) => {
        setQueueStatus(prev => ({ ...prev, [id]: newStatus }))
        setLoadingStatus(prev => ({ ...prev, [id]: true }))

        try {
            await router.put(route("queues.update", id),
                { status: newStatus },
                { preserveScroll: true, preserveState: true, showProgress: false }
            )
        } catch {
            alert("Gagal update status")
        } finally {
            setLoadingStatus(prev => ({ ...prev, [id]: false }))
        }
    }

    const confirmDelete = (id: number) => {
        setDeleteId(id)
        setOpenDeleteDialog(true)
    }

    const handleDelete = async () => {
        if (deleteId === null) return
        setDeleting(true)
        try {
            await router.delete(route("queues.destroy", deleteId), {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenDeleteDialog(false)
                }
            })
        } catch {
            alert("Gagal menghapus data")
        } finally {
            setDeleting(false)
        }
    }

    const columns: ColumnDef<Queue>[] = [
        {
            accessorKey: 'queue_number',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Queue No" />,
        },
        {
            accessorKey: 'service.name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Service" />,
        },
        {
            accessorKey: 'counter.name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Counter" />,
            cell: ({ row }) => row.original.counter?.name ?? "-"
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const id = row.original.id
                const status = queueStatus[id] ?? row.original.status
                const isLoading = loadingStatus[id] ?? false

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={isLoading}
                            >
                                <Badge variant={statusVariants[status] ?? "secondary"}>
                                    {status}
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {["waiting", "serving", "done", "skipped"].map(s => (
                                <DropdownMenuItem
                                    key={s}
                                    onClick={() => updateStatus(id, s)}
                                >
                                    {s}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
        {
            accessorKey: 'called_at',
            header: "Called At",
            cell: ({ row }) => row.original.called_at
                ? format(new Date(row.original.called_at), "yyyy-MM-dd HH:mm")
                : "-"
        },
        {
            accessorKey: 'finished_at',
            header: "Finished At",
            cell: ({ row }) => row.original.finished_at
                ? format(new Date(row.original.finished_at), "yyyy-MM-dd HH:mm")
                : "-"
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Actions">
                            <MoreVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem asChild>
                            <Link href={route('queues.edit', row.original.id)} className="flex items-center gap-2">
                                <Pencil className="w-4 h-4" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer text-red-600 hover:bg-red-50 flex items-center gap-2"
                            onClick={() => confirmDelete(row.original.id)}
                        >
                            <Trash className="w-4 h-4" /> Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Queue" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={queues}
                    action={
                        <Link
                            href={route('queues.create')}
                            className={buttonVariants({ size: 'sm' }) + ' ms-2'}
                        >
                            Add New Queue
                        </Link>
                    }
                    searchKey="queue_number"
                />

                <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Konfirmasi Hapus</DialogTitle>
                        </DialogHeader>
                        <p>Apakah Anda yakin ingin menghapus data ini?</p>
                        <DialogFooter className="mt-4 flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setOpenDeleteDialog(false)}
                                disabled={deleting}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Menghapus..." : "Hapus"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    )
}
