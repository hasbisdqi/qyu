"use client"

import { Head } from "@inertiajs/react"
import { useEffect } from "react"
import qz from "qz-tray"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function QueueShow({
  queue,
  shouldPrint,
}: {
  queue: any
  shouldPrint?: boolean
}) {
  const printer = localStorage.getItem("selected_printer")

  useEffect(() => {
    async function printTicket() {
      if (!printer || !shouldPrint) return

      try {
        if (!qz.websocket.isActive()) {
          await qz.websocket.connect()
        }

        const config = qz.configs.create(printer, { encoding: 'ISO-8859-1' })

        // The QR data
        var qr = route('queue.show', queue.id);

        // The dot size of the QR code
        var dots = '\x09';

        // Some proprietary size calculation
        var qrLength = qr.length + 3;
        var size1 = String.fromCharCode(qrLength % 256);
        var size0 = String.fromCharCode(Math.floor(qrLength / 256));

        var data = [
          '\x1B\x40', // Initialize printer

          // === HEADER ===
          '\x1B\x61\x01', // Center alignment
          '\x1C\x70\x01\x00', // Logo printer
          '=== ANTRIAN ===\x0A\x0A',

          // === QR CODE ===
          '\x1D\x28\x6B\x04\x00\x31\x41\x32\x00',        // Select model 2
          '\x1D\x28\x6B\x03\x00\x31\x43' + dots,         // Module size
          '\x1D\x28\x6B\x03\x00\x31\x45\x30',            // Error correction level
          '\x1D\x28\x6B' + size1 + size0 + '\x31\x50\x30' + qr, // Store QR data
          '\x1D\x28\x6B\x03\x00\x31\x51\x30',            // Print QR
          '\x0A\x0A',

          // === NOMOR ANTRIAN (x3 size + bold) ===
          '\x1B\x45\x01',        // Bold ON
          '\x1D\x21\x22',        // Font size width x3, height x3
          queue.queue_number + '\x0A',            // Nomor antrian
          '\x1D\x21\x00',        // Reset font size
          '\x1B\x45\x00',        // Bold OFF
          '\x0A\x0A',

          // === FOOTER ===
          'Silakan tunggu panggilan\x0A',
          'Terima kasih\x0A\x0A\x0A'
        ];

        await qz.print(config, data);

      } catch (err) {
        console.error("Print error:", err)
      }
    }

    printTicket()
  }, [queue, printer, shouldPrint])

  return (
    <>
      <Head title="Nomor Antrian" />
      <div className="container mx-auto mt-12 max-w-md">
        <Card>
          <CardContent className="p-6 space-y-6 text-center">
            <h1 className="text-3xl font-bold">Nomor Antrian</h1>
            <p className="text-5xl font-extrabold">{queue.queue_number}</p>

            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Cetak Ulang
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
