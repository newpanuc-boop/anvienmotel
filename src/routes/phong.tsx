import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookingDialog } from "@/components/hotel/booking-dialog";
import { BookingStatusBadge, RoomStatusBadge } from "@/components/hotel/status-badge";
import { TypeDetails } from "@/components/hotel/type-details";
import { useBookings, useRoomAction, useRooms } from "@/components/hotel/query";
import { Shell } from "@/components/hotel/shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { coversDate, formatDateVN, todayVN } from "@/lib/hotel/format";
import type { Room, RoomStatus } from "@/lib/hotel/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/phong")({ component: RoomsPage });

const FILTERS: { id: "all" | RoomStatus; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "available", label: "Trống" },
  { id: "occupied", label: "Đang ở" },
  { id: "cleaning", label: "Dọn" },
  { id: "maintenance", label: "Bảo trì" },
];

function RoomsPage() {
  const roomsQ = useRooms();
  const bookings = useBookings();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [selected, setSelected] = useState<Room | null>(null);
  const [bookOpen, setBookOpen] = useState(false);
  const action = useRoomAction();
  const today = todayVN();

  const list = useMemo(() => {
    const all = roomsQ.data ?? [];
    return filter === "all" ? all : all.filter((r) => r.status === filter);
  }, [roomsQ.data, filter]);

  const floors = useMemo(() => {
    const map = new Map<number, Room[]>();
    for (const room of list) {
      const arr = map.get(room.floor) ?? [];
      arr.push(room);
      map.set(room.floor, arr);
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [list]);

  const currentBooking = selected
    ? (bookings.data ?? []).find(
        (b) => b.roomId === selected.id && (b.status === "confirmed" || b.status === "checked_in") && coversDate(b.checkIn, b.checkOut, today),
      )
    : undefined;

  return (
    <Shell title="Sơ đồ phòng">
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button key={f.id} size="sm" variant={filter === f.id ? "default" : "outline"} onClick={() => setFilter(f.id)}>
            {f.label}
          </Button>
        ))}
      </div>
      {roomsQ.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {floors.map(([floorNo, floorRooms]) => (
            <section key={floorNo}>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Tầng {floorNo}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {floorRooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelected(room)}
                    className={cn(
                      "flex min-h-24 flex-col items-start justify-between rounded-xl p-3 text-left shadow-border transition-colors duration-150",
                      room.status === "available" && "bg-card hover:bg-accent",
                      room.status === "occupied" && "bg-ink text-primary-foreground hover:bg-ink/90",
                      room.status === "cleaning" && "bg-clay/15 hover:bg-clay/20",
                      room.status === "maintenance" && "bg-destructive/10 hover:bg-destructive/15",
                    )}
                  >
                    <span className="font-display text-xl tracking-tight">{room.number}</span>
                    <span className={cn("text-xs", room.status === "occupied" ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {room.type.code} · {room.type.areaM2} m²
                    </span>
                    {room.status === "occupied" ? (
                      <span className="text-xs text-primary-foreground/80">Đang ở</span>
                    ) : (
                      <RoomStatusBadge status={room.status} />
                    )}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <Sheet open={Boolean(selected)} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="overflow-y-auto">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>Phòng {selected.number}</SheetTitle>
              </SheetHeader>
              <img src={selected.type.image} alt={selected.type.name} className="mt-4 aspect-[3/2] w-full rounded-lg object-cover" />
              <div className="mt-4 flex flex-col gap-3">
                <p className="font-display text-lg">{selected.type.name}</p>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div><dt className="text-xs text-muted-foreground">Tầng</dt><dd>{selected.floor}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Hướng phòng</dt><dd>{selected.view}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Thông phòng</dt><dd>{selected.connectingTo || "Không"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Tiếp cận</dt><dd>{selected.accessible ? "Có" : "Không"}</dd></div>
                </dl>
                <RoomStatusBadge status={selected.status} />
                {selected.notes ? <p className="text-sm text-muted-foreground">{selected.notes}</p> : null}
                <TypeDetails type={selected.type} />
                {currentBooking ? (
                  <Card className="rounded-lg">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{currentBooking.guestName}</CardTitle>
                      <p className="text-xs text-muted-foreground">{currentBooking.code} · {formatDateVN(currentBooking.checkIn)} → {formatDateVN(currentBooking.checkOut)}</p>
                    </CardHeader>
                    <CardContent className="p-4 pt-0"><BookingStatusBadge status={currentBooking.status} /></CardContent>
                  </Card>
                ) : (
                  <p className="text-sm text-muted-foreground">Không có khách ở đêm nay.</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {selected.status === "cleaning" ? (
                    <Button onClick={() => { action.mutate({ id: selected.id, status: "available", notes: "" }); setSelected(null); }}>Đã dọn xong</Button>
                  ) : null}
                  {selected.status === "available" ? (
                    <Button onClick={() => setBookOpen(true)}>Đặt phòng này</Button>
                  ) : null}
                  {selected.status !== "maintenance" ? (
                    <Button variant="outline" onClick={() => { action.mutate({ id: selected.id, status: "maintenance", notes: "Chuyển bảo trì từ sơ đồ phòng" }); setSelected(null); }}>Bảo trì</Button>
                  ) : (
                    <Button variant="outline" onClick={() => { action.mutate({ id: selected.id, status: "available", notes: "" }); setSelected(null); }}>Kết thúc bảo trì</Button>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
      <BookingDialog open={bookOpen} onOpenChange={setBookOpen} presetRoomId={selected?.id} />
    </Shell>
  );
}
