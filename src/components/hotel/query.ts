import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBooking,
  getAvailability,
  getCalendar,
  getDashboard,
  getReports,
  listBookings,
  listRoomTypes,
  listRooms,
  lookupBooking,
  updateBookingStatus,
  updateRoomStatus,
} from "@/lib/hotel/functions";

export const hotelKeys = {
  all: ["hotel"] as const,
  dashboard: ["hotel", "dashboard"] as const,
  rooms: ["hotel", "rooms"] as const,
  types: ["hotel", "types"] as const,
  bookings: ["hotel", "bookings"] as const,
  reports: ["hotel", "reports"] as const,
  calendar: (start?: string) => ["hotel", "calendar", start ?? "today"] as const,
  availability: (checkIn: string, checkOut: string, guests: number) =>
    ["hotel", "availability", checkIn, checkOut, guests] as const,
};

export function useInvalidateHotel() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: hotelKeys.all });
}

export function useDashboard() {
  return useQuery({ queryKey: hotelKeys.dashboard, queryFn: () => getDashboard() });
}
export function useRooms() {
  return useQuery({ queryKey: hotelKeys.rooms, queryFn: () => listRooms() });
}
export function useRoomTypes() {
  return useQuery({ queryKey: hotelKeys.types, queryFn: () => listRoomTypes() });
}
export function useBookings() {
  return useQuery({ queryKey: hotelKeys.bookings, queryFn: () => listBookings() });
}
export function useReports() {
  return useQuery({ queryKey: hotelKeys.reports, queryFn: () => getReports() });
}
export function useCalendar(start?: string) {
  return useQuery({ queryKey: hotelKeys.calendar(start), queryFn: () => getCalendar({ data: { start } }) });
}
export function useAvailability(checkIn: string, checkOut: string, guests: number, enabled: boolean) {
  return useQuery({
    queryKey: hotelKeys.availability(checkIn, checkOut, guests),
    queryFn: () => getAvailability({ data: { checkIn, checkOut, guests } }),
    enabled,
  });
}
export function useLookup(code: string, enabled: boolean) {
  return useQuery({
    queryKey: ["hotel", "lookup", code],
    queryFn: () => lookupBooking({ data: { code } }),
    enabled,
  });
}
export function useBookingAction() {
  const invalidate = useInvalidateHotel();
  return useMutation({
    mutationFn: (input: { id: number; action: "check_in" | "check_out" | "cancel" | "mark_paid" }) =>
      updateBookingStatus({ data: input }),
    onSuccess: () => invalidate(),
    onError: (err: Error) => toast.error(err.message),
  });
}
export function useCreateBooking() {
  const invalidate = useInvalidateHotel();
  return useMutation({
    mutationFn: (input: {
      guestName: string;
      guestPhone: string;
      guestCount: number;
      roomId: number;
      checkIn: string;
      checkOut: string;
      source: "walk_in" | "online";
      notes?: string;
      paid?: boolean;
    }) => createBooking({ data: input }),
    onSuccess: () => invalidate(),
    onError: (err: Error) => toast.error(err.message),
  });
}
export function useRoomAction() {
  const invalidate = useInvalidateHotel();
  return useMutation({
    mutationFn: (input: {
      id: number;
      status: "available" | "occupied" | "cleaning" | "maintenance";
      notes?: string;
    }) => updateRoomStatus({ data: input }),
    onSuccess: () => {
      invalidate();
      toast.success("Đã cập nhật phòng");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
