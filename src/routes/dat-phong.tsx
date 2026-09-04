import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DateRangeField } from "@/components/hotel/date-range-field";
import { GuestChrome } from "@/components/hotel/shell";
import { BookingStatusBadge } from "@/components/hotel/status-badge";
import { TypeDetails } from "@/components/hotel/type-details";
import { useAvailability, useCreateBooking, useLookup, useRoomTypes } from "@/components/hotel/query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateVN, formatMoney, nightsBetween } from "@/lib/hotel/format";
import type { Room } from "@/lib/hotel/types";

export const Route = createFileRoute("/dat-phong")({ component: GuestPage });

function GuestPage() {
  const types = useRoomTypes();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [searched, setSearched] = useState(false);
  const [picked, setPicked] = useState<Room | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const ready = Boolean(checkIn && checkOut && nightsBetween(checkIn, checkOut) >= 1);
  const avail = useAvailability(checkIn, checkOut, guests, searched && ready);
  const create = useCreateBooking();
  const nights = ready ? nightsBetween(checkIn, checkOut) : 0;

  return (
    <GuestChrome>
      <section className="relative">
        <img src="/hotel/courtyard.jpg" alt="Sân trong khách sạn An Viên" className="h-[min(72vw,28rem)] w-full object-cover md:h-[32rem]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-8 md:px-8">
          <p className="text-xs uppercase tracking-widest text-primary-foreground/80">Hội An · 6 hạng phòng · 24 phòng</p>
          <h1 className="mt-1 max-w-xl font-display text-4xl font-medium tracking-tight text-primary-foreground md:text-5xl">Ở chậm, trong một sân vườn.</h1>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <form
          className="grid gap-3 rounded-xl bg-card p-4 shadow-border md:grid-cols-12 md:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            if (!ready) { toast.error("Chọn ngày nhận và trả phòng."); return; }
            setSearched(true); setPicked(null); setCode("");
          }}
        >
          <div className="flex flex-col gap-2 md:col-span-6">
            <Label>Ngày ở</Label>
            <DateRangeField checkIn={checkIn} checkOut={checkOut || undefined} onChange={(range) => { setCheckIn(range?.checkIn ?? ""); setCheckOut(range?.checkOut ?? ""); setSearched(false); }} />
          </div>
          <div className="flex flex-col gap-2 md:col-span-3">
            <Label htmlFor="g">Số khách</Label>
            <Input id="g" type="number" min={1} max={8} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
          </div>
          <Button type="submit" className="md:col-span-3"><Search className="size-4" />Tìm phòng</Button>
        </form>

        {code ? (
          <Card className="mt-8 rounded-xl">
            <CardContent className="p-6 text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Đặt phòng thành công</p>
              <p className="mt-2 font-display text-4xl tracking-tight">{code}</p>
              <p className="mt-2 text-sm text-muted-foreground">Lưu mã này để tra cứu hoặc xuất trình khi nhận phòng.</p>
              <Button className="mt-4" variant="outline" onClick={() => setCode("")}>Đặt thêm</Button>
            </CardContent>
          </Card>
        ) : picked ? (
          <form
            className="mt-8 grid gap-6 rounded-xl bg-card p-5 shadow-border md:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const booking = await create.mutateAsync({
                  guestName: name, guestPhone: phone, guestCount: guests,
                  roomId: picked.id, checkIn, checkOut, source: "online",
                });
                setCode(booking.code); setPicked(null);
              } catch { /* toasted */ }
            }}
          >
            <img src={picked.type.image} alt={picked.type.name} className="aspect-[3/2] w-full rounded-lg object-cover" />
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-2xl">{picked.type.name} · {picked.number}</h2>
              <TypeDetails type={picked.type} />
              <p className="font-display text-2xl tabular-nums">{formatMoney(nights * picked.type.pricePerNight)}</p>
              <p className="text-xs text-muted-foreground">{nights} đêm · phòng {picked.number} · {picked.view}</p>
              <div className="flex flex-col gap-2">
                <Label htmlFor="n">Họ tên</Label>
                <Input id="n" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="p">Điện thoại</Label>
                <Input id="p" required minLength={8} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="mt-2 flex gap-2">
                <Button type="button" variant="outline" onClick={() => setPicked(null)}>Quay lại</Button>
                <Button type="submit" disabled={create.isPending}>{create.isPending ? "Đang giữ phòng…" : "Xác nhận đặt"}</Button>
              </div>
            </div>
          </form>
        ) : searched ? (
          <div className="mt-8">
            <h2 className="font-display text-2xl">Phòng còn trống</h2>
            {avail.isLoading ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2"><Skeleton className="h-56 rounded-xl" /><Skeleton className="h-56 rounded-xl" /></div>
            ) : (avail.data ?? []).length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Không còn phòng phù hợp. Thử đổi ngày hoặc giảm số khách.</p>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {(avail.data ?? []).map((room) => (
                  <button key={room.id} type="button" onClick={() => setPicked(room)} className="overflow-hidden rounded-xl bg-card text-left shadow-border transition-colors duration-150 hover:bg-accent">
                    <img src={room.type.image} alt="" className="aspect-[3/2] w-full object-cover" />
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">{room.type.code} · {room.type.areaM2} m² · {room.view}</p>
                      <p className="font-display text-lg">{room.type.name} · {room.number}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{room.type.tagline} · {room.type.bedType}</p>
                      <p className="mt-3 font-display text-xl tabular-nums">{formatMoney(room.type.pricePerNight)}<span className="ml-1 text-sm font-sans text-muted-foreground">/ đêm</span></p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-12">
            <h2 className="font-display text-2xl">Sáu hạng phòng</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {(types.data ?? []).map((t) => (
                <article key={t.id} className="overflow-hidden rounded-xl bg-card shadow-border">
                  <img src={t.image} alt={t.name} className="aspect-[3/2] w-full object-cover" />
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{t.code} · {t.areaM2} m² · {t.capacity} khách</p>
                    <h3 className="font-display text-xl">{t.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
                    <p className="mt-2 text-sm">{t.bedType} · {t.viewType}</p>
                    <p className="mt-2 font-display text-lg tabular-nums">{formatMoney(t.pricePerNight)}<span className="ml-1 font-sans text-sm text-muted-foreground">/ đêm</span></p>
                    <p className="mt-2 text-xs text-muted-foreground">{t.amenities.slice(0, 4).join(" · ")}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
        <LookupSection />
      </div>
    </GuestChrome>
  );
}

function LookupSection() {
  const [value, setValue] = useState("");
  const [code, setCode] = useState("");
  const lookup = useLookup(code, code.length >= 4);
  return (
    <section className="mt-14 border-t border-border pt-8">
      <h2 className="font-display text-2xl">Tra cứu đơn</h2>
      <p className="mt-1 text-sm text-muted-foreground">Nhập mã nhận được khi đặt (ví dụ AV-2503).</p>
      <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); setCode(value.trim().toUpperCase()); }}>
        <Input value={value} onChange={(e) => setValue(e.target.value.toUpperCase())} placeholder="AV-2503" className="max-w-xs font-mono" />
        <Button type="submit" variant="outline">Tra cứu</Button>
      </form>
      {code && lookup.isFetched ? (
        lookup.data ? (
          <Card className="mt-4 rounded-xl">
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono">{lookup.data.code}</p>
                <BookingStatusBadge status={lookup.data.status} />
              </div>
              <p className="text-sm">Phòng {lookup.data.roomNumber} · {lookup.data.roomTypeName}</p>
              <p className="text-sm text-muted-foreground">{formatDateVN(lookup.data.checkIn)} → {formatDateVN(lookup.data.checkOut)} · {lookup.data.nights} đêm</p>
              <p className="tabular-nums text-sm">{formatMoney(lookup.data.totalAmount)}</p>
            </CardContent>
          </Card>
        ) : <p className="mt-3 text-sm text-muted-foreground">Không tìm thấy mã này.</p>
      ) : null}
    </section>
  );
}
