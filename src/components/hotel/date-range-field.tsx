import { format } from "date-fns";
import { vi as viFns } from "date-fns/locale";
import { CalendarRange } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, type DateRange } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatISODate, parseISODate, todayVN } from "@/lib/hotel/format";
import { cn } from "@/lib/utils";

type Props = {
  checkIn?: string;
  checkOut?: string;
  onChange: (range: { checkIn: string; checkOut: string } | null) => void;
};

export function DateRangeField({ checkIn, checkOut, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const selected: DateRange | undefined =
    checkIn && checkOut
      ? { from: parseISODate(checkIn), to: parseISODate(checkOut) }
      : checkIn
        ? { from: parseISODate(checkIn), to: undefined }
        : undefined;
  const min = parseISODate(todayVN());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("h-11 w-full justify-start font-normal", !checkIn && "text-muted-foreground")}>
          <CalendarRange className="size-4" />
          {checkIn && checkOut ? (
            <span>
              {format(parseISODate(checkIn), "dd MMM yyyy", { locale: viFns })}
              {" → "}
              {format(parseISODate(checkOut), "dd MMM yyyy", { locale: viFns })}
            </span>
          ) : (
            <span>Chọn ngày nhận / trả phòng</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={(range) => {
            if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
              onChange({ checkIn: formatISODate(range.from), checkOut: formatISODate(range.to) });
              setOpen(false);
            } else if (range?.from) {
              onChange({ checkIn: formatISODate(range.from), checkOut: "" });
            } else {
              onChange(null);
            }
          }}
          disabled={{ before: min }}
          numberOfMonths={1}
          defaultMonth={selected?.from ?? min}
        />
      </PopoverContent>
    </Popover>
  );
}
