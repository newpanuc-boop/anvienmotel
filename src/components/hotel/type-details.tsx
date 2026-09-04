import { formatMoney } from "@/lib/hotel/format";
import type { RoomType } from "@/lib/hotel/types";

export function TypeDetails({ type }: { type: RoomType }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <p className="text-muted-foreground">{type.description}</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Mã hạng</dt>
          <dd className="font-mono">{type.code}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Diện tích</dt>
          <dd>{type.areaM2} m²</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Sức chứa</dt>
          <dd>{type.capacity} khách{type.extraBed ? ` + ${type.extraBed} giường phụ` : ""}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Hướng</dt>
          <dd>{type.viewType}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Giường</dt>
          <dd>{type.bedType}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Ngày thường</dt>
          <dd className="tabular-nums">{formatMoney(type.pricePerNight)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Cuối tuần</dt>
          <dd className="tabular-nums">{formatMoney(type.weekendPrice)}</dd>
        </div>
      </dl>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Tiện nghi</p>
        <p className="mt-1">{type.amenities.join(" · ")}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Cơ sở vật chất</p>
        <p className="mt-1">{type.facilities.join(" · ")}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Chính sách</p>
        <p className="mt-1 text-muted-foreground">{type.policies}</p>
      </div>
    </div>
  );
}
