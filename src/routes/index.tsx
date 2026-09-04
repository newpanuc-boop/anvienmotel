import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, LogIn, LogOut, Plus } from "lucide-react";
import { useState } from "react";
import { BookingDialog } from "@/components/hotel/booking-dialog";
import { BookingStatusBadge } from "@/components/hotel/status-badge";
import { useBookingAction, useDashboard } from "@/components/hotel/query";
import { Shell } from "@/components/hotel/shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateVN, formatMoney, formatMoneyCompact } from "@/lib/hotel/format";
import type { Booking } from "@/lib/hotel/types";

export const Route = createFileRoute("/")({ component: Home });

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-2">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent>
        <p className="font-display text-3xl tabular-nums tracking-tight">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

function BookingRow({ booking, action }: { booking: Booking; action?: "check_in" | "check_out" }) {
  const mutate = useBookingAction();
  return (
    <li className="flex items-center gap-3 border-b border-border py-3 last:border-0">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted font-display text-sm">{booking.roomNumber}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{booking.guestName}</p>
        <p className="truncate text-xs text-muted-foreground">{booking.code} · {booking.roomTypeName}</p>
      </div>
      <BookingStatusBadge status={booking.status} />
      {action ? (
        <Button size="sm" variant={action === "check_out" ? "outline" : "default"} disabled={mutate.isPending}
          onClick={() => mutate.mutate({ id: booking.id, action })}>
          {action === "check_in" ? "Nhận" : "Trả"}
        </Button>
      ) : null}
    </li>
  );
}

function Home() {
  const { data, isLoading, isError } = useDashboard();
  const [open, setOpen] = useState(false);

  return (
    <Shell title="Tổng quan ngày" action={<Button onClick={() => setOpen(true)}><Plus className="size-4" /><span className="hidden sm:inline">Đặt phòng</span></Button>}>
      <BookingDialog open={open} onOpenChange={setOpen} />
      {isError ? (
        <p className="text-sm text-destructive">Không tải được dữ liệu. Thử tải lại trang.</p>
      ) : isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="rounded-xl sm:col-span-2 xl:col-span-1">
              <CardHeader className="pb-2">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Công suất đêm nay</p>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="relative size-20 shrink-0 rounded-full" style={{ background: `conic-gradient(var(--color-primary) ${data.occupancy}%, var(--color-muted) 0)` }} aria-hidden>
                  <div className="absolute inset-1.5 flex items-center justify-center rounded-full bg-card">
                    <span className="font-display text-lg tabular-nums">{data.occupancy}%</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{data.occupied} đang ở · {data.available} trống</p>
                  <p>{data.cleaning} dọn · {data.maintenance} bảo trì</p>
                  <p>{data.totalRooms} phòng toàn nhà</p>
                </div>
              </CardContent>
            </Card>
            <Kpi label="Nhận phòng hôm nay" value={String(data.arrivals.length)} hint={formatDateVN(data.today)} />
            <Kpi label="Trả phòng hôm nay" value={String(data.departures.length)} hint="Checkout trước 12:00" />
            <Kpi label="Doanh thu tháng" value={formatMoneyCompact(data.monthRevenue)} hint={`Đêm nay ~ ${formatMoneyCompact(data.todayRevenue)}`} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-xl">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base"><LogIn className="size-4" /> Đến hôm nay</CardTitle>
                <Button variant="ghost" size="sm" asChild><Link to="/don">Tất cả <ArrowUpRight className="size-3.5" /></Link></Button>
              </CardHeader>
              <CardContent>
                {data.arrivals.length === 0 ? <p className="py-6 text-sm text-muted-foreground">Không có lượt nhận phòng.</p> : (
                  <ul>{data.arrivals.map((b) => <BookingRow key={b.id} booking={b} action={b.status === "confirmed" ? "check_in" : undefined} />)}</ul>
                )}
              </CardContent>
            </Card>
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><LogOut className="size-4" /> Đi hôm nay</CardTitle>
              </CardHeader>
              <CardContent>
                {data.departures.length === 0 ? <p className="py-6 text-sm text-muted-foreground">Không có lượt trả phòng.</p> : (
                  <ul>{data.departures.map((b) => <BookingRow key={b.id} booking={b} action={b.status === "checked_in" ? "check_out" : undefined} />)}</ul>
                )}
              </CardContent>
            </Card>
          </div>
          <Card className="rounded-xl">
            <CardHeader><CardTitle className="text-base">Đơn gần đây</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="text-xs uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="pb-2 font-medium">Mã</th>
                    <th className="pb-2 font-medium">Khách</th>
                    <th className="pb-2 font-medium">Phòng</th>
                    <th className="pb-2 font-medium">Hạng</th>
                    <th className="pb-2 font-medium">Tiền</th>
                    <th className="pb-2 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="py-2.5 font-mono text-xs">{b.code}</td>
                      <td className="py-2.5">{b.guestName}</td>
                      <td className="py-2.5 tabular-nums">{b.roomNumber}</td>
                      <td className="py-2.5 text-muted-foreground">{b.roomTypeName}</td>
                      <td className="py-2.5 tabular-nums">{formatMoney(b.totalAmount)}</td>
                      <td className="py-2.5"><BookingStatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </Shell>
  );
}
