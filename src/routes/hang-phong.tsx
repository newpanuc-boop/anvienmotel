import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { TypeDetails } from "@/components/hotel/type-details";
import { useRoomTypes, useRooms } from "@/components/hotel/query";
import { Shell } from "@/components/hotel/shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/hotel/format";

export const Route = createFileRoute("/hang-phong")({ component: TypesPage });

function TypesPage() {
  const types = useRoomTypes();
  const rooms = useRooms();

  return (
    <Shell
      title="Hạng phòng"
      action={
        <Button asChild variant="outline">
          <a href="/files/An_Vien_Danh_muc_phong_day_du.html" download>
            <Download className="size-4" />
            File đầy đủ
          </a>
        </Button>
      }
    >
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        Sáu hạng phòng của An Viên — diện tích, giường, hướng nhìn, tiện nghi, chính sách và giá.
        Tải file HTML/CSV đầy đủ để nộp bài hoặc in.
      </p>
      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        <Button asChild variant="secondary" size="sm">
          <a href="/files/An_Vien_Hang_phong.csv" download>CSV hạng phòng</a>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <a href="/files/An_Vien_Danh_muc_phong.csv" download>CSV 24 phòng</a>
        </Button>
      </div>
      {types.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {(types.data ?? []).map((type) => {
            const list = (rooms.data ?? []).filter((r) => r.type.id === type.id);
            return (
              <Card key={type.id} className="overflow-hidden rounded-xl">
                <img src={type.image} alt={type.name} className="aspect-[3/2] w-full object-cover" />
                <CardContent className="flex flex-col gap-3 p-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{type.code} · {type.tagline}</p>
                    <h2 className="font-display text-2xl">{type.name}</h2>
                    <p className="mt-1 font-display text-xl tabular-nums">
                      {formatMoney(type.pricePerNight)}
                      <span className="ml-1 font-sans text-sm text-muted-foreground">/ đêm</span>
                    </p>
                  </div>
                  <TypeDetails type={type} />
                  <p className="text-sm">
                    <span className="text-muted-foreground">Phòng thuộc hạng: </span>
                    {list.length ? list.map((r) => r.number).join(", ") : "—"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </Shell>
  );
}
