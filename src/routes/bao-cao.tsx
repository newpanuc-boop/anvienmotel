import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Shell } from "@/components/hotel/shell";
import { useReports } from "@/components/hotel/query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateVN, formatMoney, formatMoneyCompact } from "@/lib/hotel/format";

export const Route = createFileRoute("/bao-cao")({ component: ReportsPage });

function ReportsPage() {
  const { data, isLoading } = useReports();
  return (
    <Shell title="Báo cáo">
      {isLoading || !data ? (
        <div className="grid gap-4 md:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="rounded-xl"><CardHeader className="pb-2"><p className="text-xs uppercase tracking-widest text-muted-foreground">Doanh thu tháng</p></CardHeader><CardContent><p className="font-display text-3xl tabular-nums">{formatMoneyCompact(data.monthRevenue)}</p><p className="mt-1 text-xs text-muted-foreground">{data.monthNights} đêm phòng</p></CardContent></Card>
            <Card className="rounded-xl"><CardHeader className="pb-2"><p className="text-xs uppercase tracking-widest text-muted-foreground">Lưu trú TB</p></CardHeader><CardContent><p className="font-display text-3xl tabular-nums">{data.avgStay}</p><p className="mt-1 text-xs text-muted-foreground">đêm / đơn</p></CardContent></Card>
            <Card className="rounded-xl"><CardHeader className="pb-2"><p className="text-xs uppercase tracking-widest text-muted-foreground">Tỷ lệ hủy</p></CardHeader><CardContent><p className="font-display text-3xl tabular-nums">{data.cancelRate}%</p></CardContent></Card>
          </div>
          <Card className="rounded-xl">
            <CardHeader><CardTitle className="text-base">Công suất 14 ngày</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.days} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(8)} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip cursor={{ fill: "var(--color-muted)" }} content={({ payload, label }) => {
                    const row = payload?.[0]?.payload as { rate: number; occupied: number; total: number } | undefined;
                    if (!row) return null;
                    return <div className="rounded-lg bg-card px-3 py-2 text-xs shadow-border"><p className="font-medium">{formatDateVN(String(label))}</p><p className="tabular-nums text-muted-foreground">{row.occupied}/{row.total} phòng · {row.rate}%</p></div>;
                  }} />
                  <Bar dataKey="rate" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardHeader><CardTitle className="text-base">Doanh thu theo hạng phòng</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {data.byType.length === 0 ? <p className="text-sm text-muted-foreground">Chưa có đơn trong tháng.</p> : data.byType.map((row) => (
                <div key={row.typeName} className="flex items-center justify-between gap-3">
                  <div><p className="text-sm font-medium">{row.typeName}</p><p className="text-xs text-muted-foreground">{row.nights} đêm</p></div>
                  <p className="tabular-nums text-sm">{formatMoney(row.revenue)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </Shell>
  );
}
