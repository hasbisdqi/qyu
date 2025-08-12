// components/ui/date-picker.tsx
import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function DatePicker({ date, onChange }: { date: string, onChange: (date: string) => void }) {
  const [selected, setSelected] = React.useState<Date | undefined>(new Date(date))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {selected ? format(selected, "yyyy-MM-dd") : "Pilih tanggal"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (d) {
              setSelected(d)
              onChange(format(d, "yyyy-MM-dd"))
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
