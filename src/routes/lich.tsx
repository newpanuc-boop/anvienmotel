import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { RoomStatusBadge } from "@/components/hotel/status-badge";
import { useCalendar } from "@/components/hotel/query";
import { Shell } from "@/components/hotel/shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { addDays, formatDateVN, todayVN } from "@/lib/hotel/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lich")({ component: CalendarPage });

function CalendarPage() {
  const [start, setStart] = useState(todayVN());
  const { data, isLoading } = useCalendar(start);

  return (
    <Shell
      title="Lịch phòng"
      action={
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" aria-label="Lùi 7 ngày" onClick={() => setStart(addDays(start, -7))}><ChevronLeft className="size-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setStart(todayVN())}>Hôm nay</Button>
          <Button variant="outline" size="icon" aria-label="Tới 7 ngày" onClick={() => setStart(addDays(start, 7))}><ChevronRight className="size-4" /></Button>
        </div>
      }
    >
      <p className="mb-4 text-sm text-muted-foreground">14 đêm từ {formatDateVN(start)}. Mỗi hàng là một phòng kèm mã hạng.</p>
      {isLoading || !data ? <Skeleton className="h-96 rounded-xl" /> : (
        <div className="overflow-x-auto rounded-xl bg-card shadow-border">
          <table className="min-w-[56rem] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="sticky left-0 z-10 w-32 bg-card px-3 py-3 font-medium">Phòng</th>
                {data.days.map((d) => (
                  <th key={d} className={cn("px-1 py-3 text-center font-medium", d === todayVN() && "text-primary")}>
                    <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                      {new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { weekday: "narrow" })}
                    </span>
                    <span className="tabular-nums">{d.slice(8)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.room.id} className="border-b border-border last:border-0">
                  <td className="sticky left-0 z-10 bg-card px-3 py-2">
                    <p className="font-display text-sm">{row.room.number} <span className="font-sans text-muted-foreground">{row.room.type.code}</span></p>
                    <RoomStatusBadge status={row.room.status} />
                  </td>
                  {row.cells.map((cell, i) => {
                    if (cell.booking && !cell.booking.isStart) return null;
                    if (cell.booking?.isStart) {
                      return (
                        <td key={cell.date} colSpan={cell.booking.span} className="px-0.5 py-1.5">
                          <div className={cn("truncate rounded-md px-2 py-1.5 text-xs text-primary-foreground", cell.booking.status === "checked_in" ? "bg-ink" : "bg-primary")} title={`${cell.booking.code} · ${cell.booking.guestName}`}>
                            {cell.booking.guestName}
                          </div>
                        </td>
                      );
                    }
                    return <td key={cell.date} className={cn("h-10 border-l border-border/60", i === 0 && "border-l-0")} />;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}
