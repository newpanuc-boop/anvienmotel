import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { GuestChrome } from "@/components/hotel/shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/thiet-ke")({ component: DesignPage });

function DesignPage() {
  return (
    <GuestChrome>
      <article className="mx-auto max-w-3xl px-4 py-10 md:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Công nghệ phần mềm · CNTT</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">Thiết kế phần mềm Quản lý đặt phòng khách sạn</h1>
        <p className="mt-3 text-muted-foreground">An Viên — 6 hạng phòng, 24 phòng, hai cổng (khách và lễ tân), một mô hình dữ liệu.</p>
        <div className="mt-4">
          <Button asChild>
            <a href="/files/An_Vien_Danh_muc_phong_day_du.html" download>
              <Download className="size-4" /> Tải danh mục phòng đầy đủ
            </a>
          </Button>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-2xl">1. Mục tiêu</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            <li>Quản lý danh mục hạng phòng (diện tích, giường, hướng, tiện nghi, giá) và 24 phòng vật lý.</li>
            <li>Đặt phòng trực tuyến + walk-in, tránh chồng lịch.</li>
            <li>Nhận / trả phòng, dọn, bảo trì.</li>
            <li>Báo cáo công suất và doanh thu theo hạng.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">2. Hạng phòng</h2>
          <p className="mt-3 text-sm leading-relaxed">
            STD Twin, DLX King, BAL Ban công, FAM Gia đình, GSU Hướng vườn, HSU Heritage.
            Chi tiết đầy đủ nằm ở trang{" "}
            <Link to="/hang-phong" className="underline underline-offset-4">Hạng phòng</Link>
            {" "}và file HTML/CSV đính kèm.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">3. Mô hình dữ liệu</h2>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-card p-4 text-xs leading-relaxed shadow-border">{`room_types 1 ——< rooms 1 ——< bookings

room_types (code, name, tagline, description, capacity, extra_bed,
            area_m2, bed_type, view_type, price_per_night, weekend_price,
            amenities, facilities, policies)
rooms      (number, floor, type_id, status, view, connecting_to, accessible, notes)
bookings   (code, guest_name, guest_phone, guest_count, room_id,
            check_in, check_out, status, total_amount, paid, source)`}</pre>
        </section>

        <section className="mt-10 mb-8">
          <h2 className="font-display text-2xl">4. Ràng buộc</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            <li>Hai đơn confirmed/checked_in không giao nhau trên cùng phòng.</li>
            <li>Số khách không vượt capacity của hạng.</li>
            <li>Không đặt ngày quá khứ; số đêm tối thiểu 1 (check-out không tính đêm cuối).</li>
            <li>Không nhận phòng nếu phòng đang bảo trì.</li>
          </ul>
        </section>
      </article>
    </GuestChrome>
  );
}
