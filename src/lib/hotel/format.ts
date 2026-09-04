import type { BookingSource, BookingStatus, RoomStatus } from "./types";

export function todayVN(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return formatISODate(date);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round((parseISODate(checkOut).getTime() - parseISODate(checkIn).getTime()) / 86_400_000);
}

export function formatDateVN(iso: string): string {
  return parseISODate(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMoneyCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tr`;
  }
  return formatMoney(amount);
}

export const ROOM_STATUS_LABEL: Record<RoomStatus, string> = {
  available: "Trống",
  occupied: "Đang ở",
  cleaning: "Dọn phòng",
  maintenance: "Bảo trì",
};

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  confirmed: "Đã xác nhận",
  checked_in: "Đang nhận phòng",
  checked_out: "Đã trả phòng",
  cancelled: "Đã hủy",
};

export const SOURCE_LABEL: Record<BookingSource, string> = {
  walk_in: "Tại quầy",
  online: "Trực tuyến",
};

export function coversDate(checkIn: string, checkOut: string, date: string): boolean {
  return checkIn <= date && date < checkOut;
}

export function splitList(s: string): string[] {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}
