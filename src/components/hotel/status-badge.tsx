import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_LABEL, ROOM_STATUS_LABEL } from "@/lib/hotel/format";
import type { BookingStatus, RoomStatus } from "@/lib/hotel/types";

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  return <Badge variant={status}>{ROOM_STATUS_LABEL[status]}</Badge>;
}
export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge variant={status}>{BOOKING_STATUS_LABEL[status]}</Badge>;
}
