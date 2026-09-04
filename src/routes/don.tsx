import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BookingDialog } from "@/components/hotel/booking-dialog";
import { BookingStatusBadge } from "@/components/hotel/status-badge";
import { useBookingAction, useBookings } from "@/components/hotel/query";
import { Shell } from "@/components/hotel/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateVN, formatMoney, SOURCE_LABEL } from "@/lib/hotel/format";
import type { Booking, BookingStatus } from "@/lib/hotel/types";

export const Route = createFileRoute("/don")({ component: BookingsPage });

const FILTERS: { id: "all" | BookingStatus; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "confirmed", label: "Xác nhận" },
  { id: "checked_in", label: "Đang ở" },
  { id: "checked_out", label: "Đã trả" },
  { id: "cancelled", label: "Hủy" },
];

function Actions({ booking }: { booking: Booking }) {
  const act = useBookingAction();
  return (
    <div className="flex flex-wrap gap-2">
      {booking.status === "confirmed" ? <Button size="sm" disabled={act.isPending} onClick={() => act.mutate({ id: booking.id, action: "check_in" })}>Nhận phòng</Button> : null}
      {booking.status === "checked_in" ? <Button size="sm" disabled={act.isPending} onClick={() => act.mutate({ id: booking.id, action: "check_out" })}>Trả phòng</Button> : null}
      {booking.status === "confirmed" ? <Button size="sm" variant="outline" disabled={act.isPending} onClick={() => act.mutate({ id: booking.id, action: "cancel" })}>Hủy</Button> : null}
      {!booking.paid && booking.status !== "cancelled" ? <Button size="sm" variant="ghost" disabled={act.isPending} onClick={() => act.mutate({ id: booking.id, action: "mark_paid" })}>Đánh dấu đã thu</Button> : null}
    </div>
  );
}

function BookingsPage() {
  const { data, isLoading } = useBookings();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const list = useMemo(() => {
    let rows = data ?? [];
    if (filter !== "all") rows = rows.filter((b) => b.status === filter);
    const needle = q.trim().toLowerCase();
    if (needle) {
      rows = rows.filter((b) => b.code.toLowerCase().includes(needle) || b.guestName.toLowerCase().includes(needle) || b.roomNumber.includes(needle) || b.roomTypeName.toLowerCase().includes(needle));
    }
    return rows;
  }, [data, filter, q]);

  return (
    <Shell title="Đơn đặt phòng" action={<Button onClick={() => setOpen(true)}><Plus className="size-4" /><span className="hidden sm:inline">Đơn mới</span></Button>}>
      <BookingDialog open={open} onOpenChange={setOpen} />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Tìm mã, tên, số phòng, hạng…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Button key={f.id} size="sm" variant={filter === f.id ? "default" : "outline"} onClick={() => setFilter(f.id)}>{f.label}</Button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="flex flex-col gap-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : list.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Không có đơn phù hợp.</p>
      ) : (
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="pb-3 font-medium">Mã</th>
                <th className="pb-3 font-medium">Khách</th>
                <th className="pb-3 font-medium">Phòng / hạng</th>
                <th className="pb-3 font-medium">Ở</th>
                <th className="pb-3 font-medium">Tiền</th>
                <th className="pb-3 font-medium">Nguồn</th>
                <th className="pb-3 font-medium">Trạng thái</th>
                <th className="pb-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id} className="border-t border-border align-top">
                  <td className="py-3 font-mono text-xs">{b.code}</td>
                  <td className="py-3"><p className="font-medium">{b.guestName}</p><p className="text-xs text-muted-foreground">{b.guestPhone} · {b.guestCount} khách</p></td>
                  <td className="py-3">{b.roomNumber}<p className="text-xs text-muted-foreground">{b.roomTypeName}</p></td>
                  <td className="py-3 text-muted-foreground">{formatDateVN(b.checkIn)} → {formatDateVN(b.checkOut)}<p className="text-xs">{b.nights} đêm</p></td>
                  <td className="py-3 tabular-nums">{formatMoney(b.totalAmount)}<p className="text-xs text-muted-foreground">{b.paid ? "Đã thu" : "Chưa thu"}</p></td>
                  <td className="py-3">{SOURCE_LABEL[b.source]}</td>
                  <td className="py-3"><BookingStatusBadge status={b.status} /></td>
                  <td className="py-3"><Actions booking={b} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ul className="mt-3 flex flex-col gap-3 md:hidden">
        {list.map((b) => (
          <li key={b.id} className="rounded-xl bg-card p-4 shadow-border">
            <div className="flex items-start justify-between gap-2">
              <div><p className="font-medium">{b.guestName}</p><p className="font-mono text-xs text-muted-foreground">{b.code}</p></div>
              <BookingStatusBadge status={b.status} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Phòng {b.roomNumber} · {b.roomTypeName}</p>
            <div className="mt-3"><Actions booking={b} /></div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
