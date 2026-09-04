import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DateRangeField } from "@/components/hotel/date-range-field";
import { useAvailability, useCreateBooking } from "@/components/hotel/query";
import { formatMoney, nightsBetween } from "@/lib/hotel/format";

export function BookingDialog({
  open, onOpenChange, presetRoomId,
}: { open: boolean; onOpenChange: (v: boolean) => void; presetRoomId?: number }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [roomId, setRoomId] = useState<string>(presetRoomId ? String(presetRoomId) : "");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paid, setPaid] = useState(false);
  const ready = Boolean(checkIn && checkOut && nightsBetween(checkIn, checkOut) >= 1);
  const avail = useAvailability(checkIn, checkOut, guestCount, open && ready);
  const create = useCreateBooking();
  const rooms = avail.data ?? [];
  const selected = useMemo(() => rooms.find((r) => String(r.id) === roomId), [rooms, roomId]);
  const nights = ready ? nightsBetween(checkIn, checkOut) : 0;
  const total = selected ? nights * selected.type.pricePerNight : 0;

  function reset() {
    setCheckIn(""); setCheckOut(""); setGuestCount(2);
    setRoomId(presetRoomId ? String(presetRoomId) : "");
    setGuestName(""); setGuestPhone(""); setNotes(""); setPaid(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo đơn đặt phòng</DialogTitle>
          <DialogDescription>Walk-in tại quầy. Phòng trống theo ngày đã chọn.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!selected || !checkIn || !checkOut) return;
            try {
              const booking = await create.mutateAsync({
                guestName, guestPhone, guestCount, roomId: selected.id,
                checkIn, checkOut, source: "walk_in", notes, paid,
              });
              toast.success(`Đã tạo đơn ${booking.code}`);
              onOpenChange(false);
              reset();
            } catch { /* toasted */ }
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Ngày ở</Label>
              <DateRangeField
                checkIn={checkIn}
                checkOut={checkOut || undefined}
                onChange={(range) => {
                  setCheckIn(range?.checkIn ?? "");
                  setCheckOut(range?.checkOut ?? "");
                  setRoomId(presetRoomId ? String(presetRoomId) : "");
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="guests">Số khách</Label>
              <Input id="guests" type="number" min={1} max={8} value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Phòng trống</Label>
              <Select value={roomId || undefined} onValueChange={setRoomId} disabled={!ready}>
                <SelectTrigger>
                  <SelectValue placeholder={ready ? (avail.isLoading ? "Đang tải…" : "Chọn phòng") : "Chọn ngày trước"} />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={String(room.id)}>
                      {room.number} · {room.type.code} · {formatMoney(room.type.pricePerNight)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Tên khách</Label>
              <Input id="name" required minLength={2} value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Nguyễn Văn A" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Điện thoại</Label>
              <Input id="phone" required minLength={8} value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="09xx xxx xxx" />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="size-4 accent-primary" />
            Đã thanh toán tại quầy
          </label>
          {selected ? (
            <p className="text-xs text-muted-foreground">
              {selected.type.name} · {selected.type.areaM2} m² · {selected.type.bedType} · {selected.view}
            </p>
          ) : null}
          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Tạm tính</p>
              <p className="font-display text-xl tabular-nums">{total ? formatMoney(total) : "—"}</p>
            </div>
            <Button type="submit" disabled={!selected || create.isPending || !guestName || !guestPhone}>
              {create.isPending ? "Đang lưu…" : "Tạo đơn"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
