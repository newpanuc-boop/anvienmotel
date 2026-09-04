export const ROOM_STATUSES = ["available", "occupied", "cleaning", "maintenance"] as const;
export type RoomStatus = (typeof ROOM_STATUSES)[number];

export const BOOKING_STATUSES = ["confirmed", "checked_in", "checked_out", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_SOURCES = ["walk_in", "online"] as const;
export type BookingSource = (typeof BOOKING_SOURCES)[number];

export type RoomType = {
  id: number;
  code: string;
  name: string;
  tagline: string;
  description: string;
  capacity: number;
  extraBed: number;
  areaM2: number;
  bedType: string;
  viewType: string;
  pricePerNight: number;
  weekendPrice: number;
  image: string;
  amenities: string[];
  facilities: string[];
  policies: string;
};

export type Room = {
  id: number;
  number: string;
  floor: number;
  status: RoomStatus;
  view: string;
  connectingTo: string;
  accessible: boolean;
  notes: string;
  type: RoomType;
};

export type Booking = {
  id: number;
  code: string;
  guestName: string;
  guestPhone: string;
  guestCount: number;
  roomId: number;
  roomNumber: string;
  roomTypeName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  status: BookingStatus;
  totalAmount: number;
  paid: boolean;
  source: BookingSource;
  notes: string;
  createdAt: string;
};

export type DashboardData = {
  today: string;
  occupancy: number;
  available: number;
  occupied: number;
  cleaning: number;
  maintenance: number;
  totalRooms: number;
  arrivals: Booking[];
  departures: Booking[];
  inHouse: Booking[];
  monthRevenue: number;
  todayRevenue: number;
  recent: Booking[];
};

export type DayOccupancy = {
  date: string;
  occupied: number;
  blocked: number;
  total: number;
  rate: number;
};

export type TypeRevenue = { typeName: string; nights: number; revenue: number };

export type ReportsData = {
  today: string;
  days: DayOccupancy[];
  byType: TypeRevenue[];
  monthRevenue: number;
  monthNights: number;
  avgStay: number;
  cancelRate: number;
};

export type CalendarCell = {
  date: string;
  booking: {
    id: number;
    code: string;
    guestName: string;
    status: BookingStatus;
    isStart: boolean;
    span: number;
  } | null;
};

export type CalendarRow = { room: Room; cells: CalendarCell[] };
