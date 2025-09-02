
"use client"

import { Head, router } from "@inertiajs/react"
import { useEffect, useState } from "react"
import qz from "qz-tray"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function QueueIndex() {
  const [printers, setPrinters] = useState<string[]>([])
  const [connected, setConnected] = useState(false)
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(() => {
    return localStorage.getItem("selected_printer")
  })

  // simpan printer pilihan ke localStorage
  useEffect(() => {
    if (selectedPrinter) {
      localStorage.setItem("selected_printer", selectedPrinter)
    }
  }, [selectedPrinter])

  // init QZ Tray
  useEffect(() => {
    async function initQZ() {
      try {
        if (!qz.websocket.isActive()) {
          await qz.websocket.connect()
          setConnected(true)
        }

        const list = await qz.printers.find()
        setPrinters(list)
      } catch (err) {
        console.error("QZ Tray error:", err)
      }
    }

    initQZ()

    return () => {
      if (qz.websocket.isActive()) {
        qz.websocket.disconnect()
        setConnected(false)
      }
    }
  }, [])

  const handleToCreate = () => {
    router.get('/queue/create')
  }

  return (
    <>
      <Head title="Pengaturan Printer" />
      <div className="container mx-auto mt-12 max-w-lg">
        <Card className="shadow-md">
          <CardContent className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center">
              Pengaturan Printer
            </h1>

            <Select
              value={selectedPrinter || ""}
              onValueChange={setSelectedPrinter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Printer" />
              </SelectTrigger>
              <SelectContent>
                {printers.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-center">
              <Button
                onClick={handleToCreate}
                disabled={!selectedPrinter || !connected}
                className="w-full"
              >
                Ambil Antrian
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
