-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th10 19, 2025 lúc 01:22 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `ssb2`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `admins`
--

INSERT INTO `admins` (`admin_id`, `userid`, `full_name`) VALUES
(1, 13, 'Nguyễn Văn Admin');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attendance_logs`
--

CREATE TABLE `attendance_logs` (
  `log_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  `status` enum('picked_up','dropped_off','absent') NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `attendance_logs`
--

INSERT INTO `attendance_logs` (`log_id`, `student_id`, `schedule_id`, `status`, `timestamp`) VALUES
(1, 2, 1, 'picked_up', '2025-10-12 23:35:00'),
(2, 3, 2, 'absent', '2025-10-12 23:40:00'),
(3, 2, 2, 'picked_up', '2025-10-19 11:12:35'),
(4, 9, 2, 'picked_up', '2025-10-19 11:18:35'),
(5, 9, 2, 'dropped_off', '2025-10-19 11:19:27');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `drivers`
--

CREATE TABLE `drivers` (
  `driver_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` enum('active','on_leave','terminated') DEFAULT 'active',
  `userid` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `drivers`
--

INSERT INTO `drivers` (`driver_id`, `name`, `phone_number`, `email`, `status`, `userid`) VALUES
(1, 'minh', '01234561954', 'driver01@gmail.com', 'active', 9),
(2, 'Lê Văn Nam', '0912233445', 'driver02@gmail.com', 'active', 10),
(3, 'minh2025', NULL, 'minh2025@gmail.com', 'active', 17),
(4, 'pổ', NULL, 'driver@gmail.com', 'active', 19),
(5, 'driver10', NULL, 'driver10@gmail.com', 'active', 23),
(6, 'driver10', NULL, 'driver100@gmail.com', 'active', 24);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `driver_sessions`
--

CREATE TABLE `driver_sessions` (
  `session_id` int(11) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_time` timestamp NULL DEFAULT NULL,
  `status` enum('active','started','completed','') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `driver_sessions`
--

INSERT INTO `driver_sessions` (`session_id`, `driver_id`, `bus_id`, `schedule_id`, `start_time`, `end_time`, `status`) VALUES
(1, 1, 4, 1, '2025-10-15 04:56:25', '2025-10-15 04:56:39', 'completed'),
(2, 2, 2, 2, '2025-10-15 07:25:56', '2025-10-15 07:26:28', 'completed'),
(3, 1, 1, 1, '2025-10-13 23:00:00', '2025-10-14 00:30:00', 'active'),
(4, 2, 3, 2, '2025-10-13 23:00:00', '2025-10-14 00:30:00', 'active');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `live_tracking`
--

CREATE TABLE `live_tracking` (
  `tracking_id` int(11) NOT NULL,
  `bus_id` int(11) DEFAULT NULL,
  `driver_id` int(11) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `live_tracking`
--

INSERT INTO `live_tracking` (`tracking_id`, `bus_id`, `driver_id`, `latitude`, `longitude`, `timestamp`) VALUES
(1, 1, 1, 10.77690000, 106.70090000, '2025-10-16 13:25:20'),
(2, 1, 1, 10.77690000, 106.70090000, '2025-10-16 13:26:20'),
(3, 1, 1, 10.76270000, 106.68220000, '2025-10-16 13:26:20'),
(4, 1, 1, 10.73500000, 106.71000000, '2025-10-16 13:26:20'),
(5, 1, 1, 10.82000000, 106.63000000, '2025-10-16 13:26:20'),
(6, 1, 1, 10.76262200, 106.66017200, '2025-10-16 14:15:42');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `recipient_type` enum('parent','driver') NOT NULL,
  `recipient_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` varchar(50) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `is_read` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`notification_id`, `recipient_type`, `recipient_id`, `message`, `timestamp`, `type`, `sender_id`, `is_read`) VALUES
(1, 'parent', 11, 'Xe đã đón học sinh Nguyễn Minh thành công', '2025-10-12 23:48:10', 'pickup', 13, 0),
(2, 'driver', 9, 'Bạn có chuyến mới vào ngày 14/10/2025', '2025-10-12 23:48:10', 'schedule', 13, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reports`
--

CREATE TABLE `reports` (
  `report_id` int(11) NOT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `schedule_id` int(11) DEFAULT NULL,
  `report_type` enum('student_picked_up','student_dropped_off','incident') NOT NULL,
  `description` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `reports`
--

INSERT INTO `reports` (`report_id`, `driver_id`, `schedule_id`, `report_type`, `description`, `timestamp`) VALUES
(1, 1, 1, 'student_picked_up', 'Đón học sinh Nguyễn Minh thành công.', '2025-10-12 23:40:00'),
(2, 2, 2, 'incident', 'Xe bị kẹt đường gần Ngã tư Bình Phú.', '2025-10-12 23:45:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `routes`
--

CREATE TABLE `routes` (
  `route_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `routes`
--

INSERT INTO `routes` (`route_id`, `name`, `description`) VALUES
(2, 'Q8 - trường', 'đường có đại gia'),
(3, 'Q9 - trường', NULL),
(4, 'Q10 - trường', 'đường gồ ghề'),
(5, 'Q5 - Trường', 'Tuyến xe từ Quận 5 đến trường'),
(6, 'Q6 - Trường', 'Tuyến xe từ Quận 6 đến trường');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `schedules`
--

CREATE TABLE `schedules` (
  `schedule_id` int(11) NOT NULL,
  `route_id` int(11) DEFAULT NULL,
  `bus_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `status` enum('scheduled','in_progress','completed','canceled') DEFAULT 'scheduled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `schedules`
--

INSERT INTO `schedules` (`schedule_id`, `route_id`, `bus_id`, `driver_id`, `date`, `start_time`, `end_time`, `status`) VALUES
(1, 5, 4, 1, '2025-10-14', '06:30:00', '07:30:00', 'scheduled'),
(2, 6, 5, 2, '2025-10-14', '06:45:00', '07:40:00', 'scheduled');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `schedule_students`
--

CREATE TABLE `schedule_students` (
  `id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `pickup_status` enum('waiting','picked_up','absent') DEFAULT 'waiting',
  `dropoff_status` enum('waiting','dropped_off') DEFAULT 'waiting'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `schedule_students`
--

INSERT INTO `schedule_students` (`id`, `schedule_id`, `student_id`, `pickup_status`, `dropoff_status`) VALUES
(1, 1, 2, 'waiting', 'dropped_off'),
(2, 2, 3, 'picked_up', 'waiting'),
(3, 1, 4, 'picked_up', 'waiting'),
(4, 1, 5, 'picked_up', 'waiting'),
(5, 1, 6, 'picked_up', 'waiting'),
(6, 2, 4, 'picked_up', 'waiting'),
(7, 2, 5, 'picked_up', 'waiting'),
(8, 2, 6, 'picked_up', 'waiting'),
(14, 2, 9, 'picked_up', 'dropped_off'),
(15, 2, 2, 'picked_up', 'waiting');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `stop_points`
--

CREATE TABLE `stop_points` (
  `stop_id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  `stop_name` varchar(100) NOT NULL,
  `stop_order` int(11) NOT NULL,
  `longitude` varchar(255) NOT NULL,
  `latitude` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `stop_points`
--

INSERT INTO `stop_points` (`stop_id`, `route_id`, `stop_name`, `stop_order`, `longitude`, `latitude`) VALUES
(1, 5, 'Nhà Văn hóa Quận 5', 1, '106.6650', '10.7523'),
(2, 5, 'Cầu Chà Và', 2, '106.6701', '10.7550'),
(3, 6, 'Bến xe Quận 6', 1, '106.6350', '10.7420'),
(4, 6, 'Ngã tư Bình Phú', 2, '106.6400', '10.7450'),
(5, 2, 'Trạm A', 1, '106.660172', '10.762622'),
(6, 2, 'Trạm B', 2, '106.662', '10.765'),
(7, 3, 'Trạm A', 1, '106.660172', '10.762622'),
(8, 3, 'Trạm B', 2, '106.662', '10.765'),
(9, 4, 'Trạm A', 1, '106.660172', '10.762622'),
(10, 4, 'Trạm B', 2, '106.662', '10.765'),
(11, 5, 'Trạm A', 1, '106.660172', '10.762622'),
(12, 5, 'Trạm B', 2, '106.662', '10.765'),
(13, 6, 'Trạm A', 1, '106.660172', '10.762622'),
(14, 6, 'Trạm B', 2, '106.662', '10.765');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pickup_location` int(100) DEFAULT NULL,
  `dropoff_location` int(100) DEFAULT NULL,
  `className` varchar(50) DEFAULT NULL,
  `userid` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `students`
--

INSERT INTO `students` (`student_id`, `name`, `pickup_location`, `dropoff_location`, `className`, `userid`) VALUES
(1, 'minh22', '1', '2', '1A', 8),
(2, 'Nguyễn Minh', '1', '2', '5A', 11),
(3, 'Trần Thu Hà', '1', '2', '4B', 12),
(4, 'Nguyễn Văn A', '1', '2', '2A', 14),
(5, 'Nguyễn Văn B', '3', '2', '1B', 15),
(6, 'Nguyễn Văn c', '3', '4', '1C', 16),
(7, 'pổ', '2', '1', '1A', 21),
(8, 'pổ', '2', '1', '1A', 22),
(9, 'student10', '2', '1', '3A', 25);

-- --------------------------------------------------------



-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('student','admin','driver') NOT NULL,
  `isActive` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`userid`, `username`, `password`, `email`, `role`, `isActive`) VALUES
(1, 'minh07', '$2b$10$QjbTfAqpM/Lmh263ZIOim.eS75DhdNIsUMTdoxOT69h2nNYI8xDym', 'abc@gmail.com', 'admin', 1),
(2, 'minh01', '$2b$10$65rLx1VqqX81od9okTKHFumwWM8jgKuND.3dAIwl1/7vN2I0aOGjq', 'abcd@gmail.com', 'student', 0),
(3, 'minh06', '$2b$10$49iQ/kQaHBjzhx.lLNFEkeRFQp5GmwoGNcvqw9elb52DcwxVm2hCi', 'abcde@gmail.com', 'student', 0),
(4, 'minh', '$2b$10$z9Vp99m22xpzXJRiw7I9f.uDGDZkF2TytfWofOF7dTbJh5.28hcc2', 'abcdèg@gmail.com', 'student', 1),
(6, 'minh100', '$2b$10$DXgZS0OJRnsrzFyTWaWbJORNffhKARojxgvHGGVKFcH07q7eb5loi', 'abcdg@gmail.com', 'student', 1),
(8, 'minh22', '$2b$10$9XmS.nVE3oW6bMjLJFEiN.kxmxdg.94zJ0uuOIruzX2rnR7gWen5O', 'abcdefg@gmail.com', 'student', 1),
(9, 'driver01', '$2b$10$1234567890abcdefghiJKLmnopQRS', 'driver01@gmail.com', 'driver', 1),
(10, 'driver02', '$2b$10$abcdefghiJKLmnopQRSTUvwxYZ1234', 'driver02@gmail.com', 'driver', 1),
(11, 'student01', '$2b$10$xyz1234567890ABCDEFGHijklmno', 'student01@gmail.com', 'student', 1),
(12, 'student02', '$2b$10$mnopqrsTUV1234567890WXYZabcd', 'student02@gmail.com', 'student', 1),
(13, 'admin01', '$2b$10$AAABBBCCCDDDEEEFFF111222333444', 'admin01@gmail.com', 'admin', 1),
(14, 'Nguyễn Văn A', '$2b$10$WqWQ1b.VhB.HpjhNxogBQu13qjvG.yZGuuAAQBiCMysPoh9LIXM4G', 'n@gmail.com', 'student', 1),
(15, 'Nguyễn Văn B', '$2b$10$h5mRLu2V5zDcMT4Cxwi7FuivM1z6qRcxzfDZv9gNO5mER0.5hbgje', 'm@gmail.com', 'student', 1),
(16, 'Nguyễn Văn c', '$2b$10$Tj3vatidwvadSko968LLJOUMorkWmctGBICorPLqNkmz7rbXvzX7q', 'p@gmail.com', 'student', 1),
(17, 'minh2025', '$2b$10$tSHdcGDK9YEsKcl96JUA..CbjRs9E6m19d5bClfhzlZwTglPKf6n2', 'minh2025@gmail.com', 'driver', 1),
(19, 'pổ', '$2b$10$ECJ5l9.Pxgjo3xqO5EosAOUZJ7mPjbFZDmbPJ7iXboH1oNYRGwqgq', 'driver@gmail.com', 'driver', 1),
(21, 'pổ', '$2b$10$SKU/AZr3qTTwqst6WyPDoeax8E.CV3yms6vcpZxt/qcMoA2pZ.4Nq', 'student@gmail.com', 'student', 1),
(22, 'pổ', '$2b$10$fILQZgowjsnLFBc9MYLCUuW/TJ8/TYcxDbdy3YylLnqriS/KEJ.1m', 'admin@gmail.com', 'admin', 1),
(23, 'driver10', '$2b$10$TDsVdL3H/Zi7HthZIrdgIO8W1xrwiZ1Dk2FxLQVayHyZFRNHmX6D6', 'driver10@gmail.com', 'driver', 1),
(24, 'driver10', '$2b$10$IKbvFTShDo3eKWzefxbpSeb3t6RTnfJiZLFb/ZvL.eJ3PqXnBcX7i', 'driver100@gmail.com', 'driver', 1),
(25, 'student10', '$2b$10$ckkPV2iSKHTOELPiLol5ReZYxBE6hsCxEOZh5cMhncqTmiC6yOH3u', 'student100@gmail.com', 'student', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vehicles`
--

CREATE TABLE `vehicles` (
  `bus_id` int(11) NOT NULL,
  `license_plate` varchar(50) NOT NULL,
  `model` varchar(100) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `status` enum('active','inactive','maintenance') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vehicles`
--

INSERT INTO `vehicles` (`bus_id`, `license_plate`, `model`, `capacity`, `status`) VALUES
(1, '36a36363', 'mẹc', 40, 'active'),
(2, '36a36336', 'toyota', 40, 'active'),
(3, '46a36336', 'bmw', 40, 'inactive'),
(4, '51A-12345', 'Toyota Coaster', 25, 'active'),
(5, '51B-67890', 'Ford Transit', 20, 'maintenance'),
(6, '47AB-12345', 'Lambor', 50, 'active');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `userid` (`userid`);

--
-- Chỉ mục cho bảng `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `schedule_id` (`schedule_id`),
  ADD KEY `attendance_logs_ibfk_1` (`student_id`);

--
-- Chỉ mục cho bảng `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`driver_id`),
  ADD UNIQUE KEY `userid` (`userid`),
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `driver_sessions`
--
ALTER TABLE `driver_sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `bus_id` (`bus_id`),
  ADD KEY `schedule_id` (`schedule_id`);

--
-- Chỉ mục cho bảng `live_tracking`
--
ALTER TABLE `live_tracking`
  ADD PRIMARY KEY (`tracking_id`),
  ADD KEY `vehicle_id` (`bus_id`),
  ADD KEY `fk_live_tracking_driver` (`driver_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`);

--
-- Chỉ mục cho bảng `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `schedule_id` (`schedule_id`);

--
-- Chỉ mục cho bảng `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`route_id`);

--
-- Chỉ mục cho bảng `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `vehicle_id` (`bus_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Chỉ mục cho bảng `schedule_students`
--
ALTER TABLE `schedule_students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_schedule_student` (`schedule_id`,`student_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Chỉ mục cho bảng `stop_points`
--
ALTER TABLE `stop_points`
  ADD PRIMARY KEY (`stop_id`),
  ADD KEY `route_id` (`route_id`);

--
-- Chỉ mục cho bảng `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `userid` (`userid`),
  ADD KEY `fk_pickup_stop` (`pickup_location`),
  ADD KEY `fk_dropoff_stop` (`dropoff_location`);



--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`bus_id`),
  ADD UNIQUE KEY `license_plate` (`license_plate`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `attendance_logs`
--
ALTER TABLE `attendance_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `drivers`
--
ALTER TABLE `drivers`
  MODIFY `driver_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `driver_sessions`
--
ALTER TABLE `driver_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `live_tracking`
--
ALTER TABLE `live_tracking`
  MODIFY `tracking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `routes`
--
ALTER TABLE `routes`
  MODIFY `route_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `schedules`
--
ALTER TABLE `schedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `schedule_students`
--
ALTER TABLE `schedule_students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `stop_points`
--
ALTER TABLE `stop_points`
  MODIFY `stop_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;


--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `bus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD CONSTRAINT `attendance_logs_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_logs_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`schedule_id`);

--
-- Các ràng buộc cho bảng `drivers`
--
ALTER TABLE `drivers`
  ADD CONSTRAINT `fk_drivers_userid` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `driver_sessions`
--
ALTER TABLE `driver_sessions`
  ADD CONSTRAINT `driver_sessions_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`),
  ADD CONSTRAINT `driver_sessions_ibfk_2` FOREIGN KEY (`bus_id`) REFERENCES `vehicles` (`bus_id`),
  ADD CONSTRAINT `driver_sessions_ibfk_3` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`schedule_id`);

--
-- Các ràng buộc cho bảng `live_tracking`
--
ALTER TABLE `live_tracking`
  ADD CONSTRAINT `fk_live_tracking_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `live_tracking_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `vehicles` (`bus_id`);

--
-- Các ràng buộc cho bảng `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`),
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`schedule_id`);

--
-- Các ràng buộc cho bảng `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`),
  ADD CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`bus_id`) REFERENCES `vehicles` (`bus_id`),
  ADD CONSTRAINT `schedules_ibfk_3` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`),
  ADD CONSTRAINT `schedules_ibfk_4` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `schedules_ibfk_5` FOREIGN KEY (`bus_id`) REFERENCES `vehicles` (`bus_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `schedules_ibfk_6` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `schedule_students`
--
ALTER TABLE `schedule_students`
  ADD CONSTRAINT `schedule_students_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`schedule_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `schedule_students_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `stop_points`
--
ALTER TABLE `stop_points`
  ADD CONSTRAINT `stop_points_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_dropoff_stop` FOREIGN KEY (`dropoff_location`) REFERENCES `stop_points` (`stop_id`),
  ADD CONSTRAINT `fk_pickup_stop` FOREIGN KEY (`pickup_location`) REFERENCES `stop_points` (`stop_id`),
  ADD CONSTRAINT `fk_students_userid` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
--

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
