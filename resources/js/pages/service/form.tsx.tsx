"use client"

import { useForm } from "@inertiajs/react"
import { Head } from "@inertiajs/react"
import { BreadcrumbItem, Service } from "@/types"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect } from "react"

type FormData = {
  name: string
  code: string
}

export default function ServiceFormPage({ service }: { service?: Service }) {
  const isEdit = !!service

  const { data, setData, post, put, processing, errors } = useForm<FormData>({
    name: service?.name ?? "",
    code: service?.code ?? "",
  })

  useEffect(() => {
    document.title = isEdit ? `Edit Layanan: ${service?.name}` : "Tambah Layanan"
  }, [isEdit, service?.name])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      put(route("services.update", service!.id))
    } else {
      post(route("services.store"))
    }
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Services", href: "/services" },
    { title: isEdit ? "Edit" : "Create", href: isEdit ? `/services/${service?.id}/edit` : "/services/create" },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEdit ? `Edit Layanan: ${service?.name}` : "Tambah Layanan"} />
      <div className="max-w-lg p-6 rounded-lg shadow mt-8">
        <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Layanan" : "Tambah Layanan"}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Nama Layanan</Label>
            <Input
              id="name"
              placeholder="Contoh: Layanan Registrasi"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              required
              maxLength={100}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="code">Kode Layanan</Label>
            <Input
              id="code"
              placeholder="Contoh: REG01"
              value={data.code}
              onChange={(e) => setData("code", e.target.value.toUpperCase())} // kode pakai uppercase
              required
              maxLength={10}
              className="uppercase"
            />
            {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code}</p>}
          </div>

          <Button type="submit" disabled={processing}>
            {processing ? (isEdit ? "Menyimpan..." : "Membuat...") : "Simpan"}
          </Button>
        </form>
      </div>
    </AppLayout>
  )
}
