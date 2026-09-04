create table if not exists room_types (
  id               serial primary key,
  code             text not null unique,
  name             text not null,
  tagline          text not null,
  description      text not null,
  capacity         int not null,
  extra_bed        int not null default 0,
  area_m2          int not null,
  bed_type         text not null,
  view_type        text not null,
  price_per_night  numeric(12, 0) not null,
  weekend_price    numeric(12, 0) not null,
  image            text not null,
  amenities        text not null,
  facilities       text not null,
  policies         text not null
);

create table if not exists rooms (
  id            serial primary key,
  number        text not null unique,
  floor         int not null,
  type_id       int not null references room_types(id),
  status        text not null default 'available',
  view          text not null default '',
  connecting_to text not null default '',
  accessible    boolean not null default false,
  notes         text not null default ''
);

create table if not exists bookings (
  id            serial primary key,
  code          text not null unique,
  guest_name    text not null,
  guest_phone   text not null,
  guest_count   int not null,
  room_id       int not null references rooms(id),
  check_in      date not null,
  check_out     date not null,
  status        text not null default 'confirmed',
  total_amount  numeric(12, 0) not null,
  paid          boolean not null default false,
  source        text not null default 'walk_in',
  notes         text not null default '',
  created_at    timestamptz not null default now()
);

create index if not exists bookings_room_dates_idx on bookings (room_id, check_in, check_out);
create index if not exists bookings_status_idx on bookings (status);
create index if not exists rooms_floor_idx on rooms (floor);

insert into room_types (
  id, code, name, tagline, description, capacity, extra_bed, area_m2, bed_type, view_type,
  price_per_night, weekend_price, image, amenities, facilities, policies
) values
  (1, 'STD', 'Phòng Tiêu chuẩn Twin', 'Hai giường, ánh sáng sân trong',
   'Phòng 22 m² cho khách công tác hoặc bạn đồng hành. Hai giường đơn 1,2 m, cửa chớp thông thoáng ra sân trong, sàn terrazzo, đèn mây. Phù hợp lưu trú 1–3 đêm.',
   2, 0, 22, '2 giường đơn 1,2 × 2,0 m', 'Sân trong',
   1290000, 1450000, '/hotel/standard.jpg',
   'Wifi tốc độ cao, Điều hòa inverter, Nước khoáng, Máy sấy tóc, Két sắt laptop, TV 43 inch, Áo choàng tắm mỏng, Dép trong phòng',
   'Phòng tắm đứng, Vòi sen mưa, Đồ dùng vệ sinh refill, Bàn làm việc nhỏ, Ổ cắm USB, Rèm blackout',
   'Nhận phòng 14:00 · Trả phòng 12:00. Không hút thuốc. Không kê thêm giường. Trẻ em dưới 6 tuổi ở cùng không tính phí nếu không kê giường phụ.'),
  (2, 'DLX', 'Phòng Deluxe King', 'Giường king, bàn viết, sân trong',
   'Phòng 28 m², giường king 1,8 m, bàn viết gỗ teak, cửa sổ lớn ra sân. Ánh sáng chiều vàng, phù hợp cặp đôi hoặc khách lưu trú dài hơn.',
   2, 1, 28, '1 giường king 1,8 × 2,0 m', 'Sân trong',
   1890000, 2150000, '/hotel/deluxe.jpg',
   'Wifi tốc độ cao, Điều hòa inverter, Mini bar, Nước khoáng, Máy sấy, Két sắt, TV 50 inch, Áo choàng, Dép, Ấm đun + trà Việt',
   'Bồn tắm đứng, Vòi sen mưa, Bàn viết, Ghế đọc, Ổ USB-C, Rèm 2 lớp, Gối ôm / gối thấp theo yêu cầu',
   'Nhận phòng 14:00 · Trả phòng 12:00. Có thể kê 1 giường phụ (650.000đ/đêm). Không hút thuốc. Hủy miễn phí trước 48 giờ.'),
  (3, 'BAL', 'Phòng Deluxe Ban công', 'Cửa Pháp, nhìn phố cổ',
   'Phòng 32 m² mở cửa Pháp ra ban công riêng nhìn hẻm vôi vàng phố cổ. Hai ghế mây ngoài trời, gió chiều. Lý tưởng khách thích ngồi ngoài vào buổi tối.',
   2, 1, 32, '1 giường king 1,8 × 2,0 m', 'Phố cổ · ban công',
   2190000, 2490000, '/hotel/balcony.jpg',
   'Wifi, Điều hòa, Mini bar, Nước khoáng, Máy sấy, Két sắt, TV 50 inch, Áo choàng, Dép, Trà chiều trong phòng ngày đầu',
   'Ban công riêng 4 m², 2 ghế mây, Bồn tắm đứng, Bàn viết, Rèm 2 lớp, Ổ USB-C',
   'Nhận phòng 14:00 · Trả phòng 12:00. Ban công không dành cho trẻ không có người lớn. Giường phụ 650.000đ/đêm. Không hút thuốc.'),
  (4, 'FAM', 'Phòng Gia đình', 'King + daybed, đủ bốn người',
   'Phòng 38 m²: giường king và daybed teak (trải được thành giường 1,2 m). Bàn tròn, cửa sổ ra vườn. Phù hợp gia đình 3–4 người, có thể thêm nôi trẻ em.',
   4, 1, 38, '1 giường king 1,8 m + 1 daybed 1,2 m', 'Vườn',
   2490000, 2790000, '/hotel/family.jpg',
   'Wifi, Điều hòa 2 cục, Mini bar, Nước khoáng, Máy sấy, Két sắt, TV 50 inch, Áo choàng người lớn, Dép 4 đôi',
   'Nôi em bé theo yêu cầu, Ghế trẻ em, Bồn tắm đứng rộng, Bàn tròn 4 ghế, Ổ cắm gần giường phụ',
   'Nhận phòng 14:00 · Trả phòng 12:00. Nôi miễn phí (số lượng có hạn). Trẻ 6–11 tuổi: 350.000đ/đêm nếu ăn sáng. Không hút thuốc.'),
  (5, 'GSU', 'Suite Hướng vườn', 'Sân riêng, ghế mây, chậu đá',
   'Suite 46 m² mở thẳng ra sân riêng với chậu đá và cây nhiệt đới. Khu ngồi rattan trong phòng, xà gỗ. Ở chậm vài ngày, làm việc nhẹ hoặc nghỉ dưỡng.',
   3, 1, 46, '1 giường king 1,8 m + sofa bed 1,2 m', 'Sân vườn riêng',
   2890000, 3290000, '/hotel/suite.jpg',
   'Wifi, Điều hòa, Mini bar đầy, Máy pha cà phê, Nước khoáng, Máy sấy, Két sắt, TV 55 inch, Áo choàng, Dép, Khay trà chiều',
   'Sân riêng 12 m², Bồn tắm nằm, Sen mưa, Khu ngồi 2 ghế, Bàn viết, Loa Bluetooth',
   'Nhận phòng 14:00 · Trả phòng 12:00. Trà chiều ngày đầu gồm trong giá. Giường phụ 750.000đ/đêm. Không hút thuốc. Thú cưng không nhận.'),
  (6, 'HSU', 'Suite Heritage', 'Phòng khách riêng, nhìn hồ',
   'Suite 58 m²: phòng ngủ king ngăn vòm với phòng khách sofa thấp, cửa chớp cao nhìn hồ bơi. Trần vôi, rèm linen. Hạng cao nhất của nhà, phù hợp kỷ niệm hoặc khách lưu trú dài.',
   3, 1, 58, '1 giường king 2,0 m + sofa bed', 'Hồ bơi',
   3690000, 4190000, '/hotel/heritage.jpg',
   'Wifi, Điều hòa 2 zone, Mini bar cao cấp, Máy pha cà phê, Rượu vang chào, Nước khoáng, Máy sấy, Két sắt laptop, TV 55 inch × 2, Áo choàng, Dép',
   'Phòng khách riêng, Bồn tắm nằm + sen, Nhìn hồ bơi, Bàn ăn 2 ghế, Bàn viết, Loa Bluetooth, Dịch vụ thu hành lý',
   'Nhận phòng 14:00 · Trả phòng 12:00. Nâng giờ trả phòng đến 14:00 khi trống (không hứa trước). Chào rượu vang 1 chai. Giường phụ 750.000đ/đêm. Không hút thuốc.'
) on conflict (id) do nothing;

insert into rooms (id, number, floor, type_id, status, view, connecting_to, accessible, notes) values
  (1,  '101', 1, 1, 'occupied',    'Sân trong',   '102', false, ''),
  (2,  '102', 1, 1, 'cleaning',    'Sân trong',   '101', false, 'Trả phòng sáng nay'),
  (3,  '103', 1, 2, 'available',   'Sân trong',   '',    false, ''),
  (4,  '104', 1, 2, 'occupied',    'Sân trong',   '',    false, ''),
  (5,  '105', 1, 2, 'occupied',    'Sân trong',   '',    true,  'Phòng gần thang máy, cửa rộng'),
  (6,  '106', 1, 3, 'available',   'Phố cổ',      '',    false, ''),
  (7,  '107', 1, 1, 'available',   'Sân trong',   '',    false, ''),
  (8,  '201', 2, 1, 'available',   'Sân trong',   '202', false, ''),
  (9,  '202', 2, 1, 'available',   'Sân trong',   '201', false, ''),
  (10, '203', 2, 2, 'available',   'Sân trong',   '',    false, ''),
  (11, '204', 2, 2, 'available',   'Sân trong',   '',    false, ''),
  (12, '205', 2, 4, 'available',   'Vườn',        '',    false, ''),
  (13, '206', 2, 4, 'maintenance', 'Vườn',        '',    false, 'Hỏng điều hòa — chờ kỹ thuật 05/09'),
  (14, '301', 3, 2, 'available',   'Sân trong',   '',    false, ''),
  (15, '302', 3, 2, 'available',   'Sân trong',   '',    false, ''),
  (16, '303', 3, 3, 'available',   'Phố cổ',      '304', false, ''),
  (17, '304', 3, 3, 'available',   'Phố cổ',      '303', false, ''),
  (18, '305', 3, 4, 'available',   'Vườn',        '',    false, ''),
  (19, '306', 3, 2, 'available',   'Sân trong',   '',    true,  'Phòng gần thang máy'),
  (20, '401', 4, 5, 'occupied',    'Sân vườn riêng', '', false, ''),
  (21, '402', 4, 5, 'available',   'Sân vườn riêng', '', false, ''),
  (22, '403', 4, 6, 'available',   'Hồ bơi',      '',    false, ''),
  (23, '404', 4, 6, 'occupied',    'Hồ bơi',      '',    false, ''),
  (24, '405', 4, 5, 'available',   'Sân vườn riêng', '', false, '')
on conflict (id) do nothing;

-- Seed around 2026-09-04
insert into bookings (
  id, code, guest_name, guest_phone, guest_count, room_id,
  check_in, check_out, status, total_amount, paid, source, notes, created_at
) values
  (1,  'AV-2501', 'Trần Minh Khang',  '0912 384 201', 1, 1,
   '2026-09-02', '2026-09-06', 'checked_in',  5160000, true,  'walk_in', 'Yêu cầu gối thấp',            '2026-08-28 09:12:00+07'),
  (2,  'AV-2502', 'Lê Hoàng Yến',     '0983 221 445', 2, 4,
   '2026-09-03', '2026-09-04', 'checked_in',  1890000, true,  'online',  'Checkout trước 11h',          '2026-08-20 14:03:00+07'),
  (3,  'AV-2503', 'Phạm Đức Anh',     '0906 118 773', 1, 8,
   '2026-09-04', '2026-09-07', 'confirmed',   3870000, false, 'online',  'Đến sau 20h',                 '2026-08-30 11:40:00+07'),
  (4,  'AV-2504', 'Nguyễn Thu Hà',    '0934 667 812', 3, 12,
   '2026-09-04', '2026-09-08', 'confirmed',   9960000, true,  'walk_in', 'Có trẻ 5 tuổi, cần nôi',      '2026-09-01 16:22:00+07'),
  (5,  'AV-2505', 'Võ Nhật Nam',      '0971 550 309', 2, 20,
   '2026-09-01', '2026-09-06', 'checked_in', 14450000, true,  'online',  '',                            '2026-08-12 08:55:00+07'),
  (6,  'AV-2506', 'Đặng Phương Linh', '0888 214 660', 2, 22,
   '2026-09-06', '2026-09-09', 'confirmed',  11070000, false, 'online',  'Kỷ niệm cưới',                '2026-08-25 19:10:00+07'),
  (7,  'AV-2507', 'Bùi Quốc Huy',     '0945 003 128', 1, 2,
   '2026-08-29', '2026-09-01', 'cancelled',   3870000, false, 'online',  'Khách hủy vì đổi lịch bay',   '2026-08-18 10:00:00+07'),
  (8,  'AV-2508', 'Hoàng Mỹ An',      '0962 778 431', 2, 10,
   '2026-08-30', '2026-09-03', 'checked_out', 5670000, true,  'walk_in', '',                            '2026-08-27 13:45:00+07'),
  (9,  'AV-2509', 'Đỗ Thanh Tùng',    '0918 902 554', 2, 6,
   '2026-09-05', '2026-09-08', 'confirmed',   6570000, false, 'online',  'Muốn phòng yên, tầng 1',      '2026-08-31 21:18:00+07'),
  (10, 'AV-2510', 'Mai Ngọc Châu',    '0933 441 270', 2, 23,
   '2026-09-02', '2026-09-05', 'checked_in', 11070000, true,  'online',  'Dị ứng lông thú',             '2026-08-15 07:30:00+07'),
  (11, 'AV-2511', 'Lý Hải Đăng',      '0903 216 889', 1, 9,
   '2026-09-07', '2026-09-10', 'confirmed',   3870000, false, 'online',  '',                            '2026-09-01 09:05:00+07'),
  (12, 'AV-2512', 'Ngô Bảo Trâm',     '0987 654 012', 2, 16,
   '2026-09-08', '2026-09-11', 'confirmed',   6570000, true,  'walk_in', 'Xuất hóa đơn công ty',        '2026-09-02 10:40:00+07'),
  (13, 'AV-2513', 'Trịnh An Khang',   '0911 228 340', 2, 14,
   '2026-09-04', '2026-09-06', 'confirmed',   3780000, false, 'walk_in', 'Nhận sau họp 18h',            '2026-09-03 15:10:00+07'),
  (14, 'AV-2514', 'Cao Mỹ Duyên',     '0977 019 556', 1, 5,
   '2026-09-03', '2026-09-07', 'checked_in',  7560000, true,  'online',  'Cần phòng tiếp cận xe lăn',   '2026-08-22 11:20:00+07')
on conflict (id) do nothing;

select setval('room_types_id_seq', (select coalesce(max(id), 1) from room_types));
select setval('rooms_id_seq', (select coalesce(max(id), 1) from rooms));
select setval('bookings_id_seq', (select coalesce(max(id), 1) from bookings));
