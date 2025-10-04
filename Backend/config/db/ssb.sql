-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th10 04, 2025 lúc 11:21 AM
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
-- Cơ sở dữ liệu: `ssb`
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
  `status` enum('active','completed') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'Q7 - trường', NULL),
(2, 'Q8 - trường', 'đường có đại gia'),
(3, 'Q9 - trường', NULL),
(4, 'Q10 - trường', 'đường gồ ghề');

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
  `status` enum('scheduled','in_progress','completed','canceled') DEFAULT 'scheduled',
  `student_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `stop_points`
--

CREATE TABLE `stop_points` (
  `stop_id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  `stop_name` varchar(100) NOT NULL,
  `stop_order` int(11) NOT NULL,
  `lng` varchar(255) NOT NULL,
  `lt` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pickup_location` varchar(255) DEFAULT NULL,
  `dropoff_location` varchar(255) DEFAULT NULL,
  `className` varchar(50) DEFAULT NULL,
  `userid` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `students`
--

INSERT INTO `students` (`student_id`, `name`, `pickup_location`, `dropoff_location`, `className`, `userid`) VALUES
(1, 'minh22', NULL, NULL, NULL, 8);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `student_route_assignments`
--

CREATE TABLE `student_route_assignments` (
  `assignment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  `pickup_stop_id` int(11) NOT NULL,
  `dropoff_stop_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(8, 'minh22', '$2b$10$9XmS.nVE3oW6bMjLJFEiN.kxmxdg.94zJ0uuOIruzX2rnR7gWen5O', 'abcdefg@gmail.com', 'student', 1);

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
(3, '46a36336', 'bmw', 40, 'inactive');

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
  ADD KEY `student_id` (`student_id`),
  ADD KEY `schedule_id` (`schedule_id`);

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
  ADD KEY `driver_id` (`driver_id`),
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
  ADD UNIQUE KEY `userid` (`userid`);

--
-- Chỉ mục cho bảng `student_route_assignments`
--
ALTER TABLE `student_route_assignments`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `pickup_stop_id` (`pickup_stop_id`),
  ADD KEY `dropoff_stop_id` (`dropoff_stop_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `username` (`username`),
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
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `attendance_logs`
--
ALTER TABLE `attendance_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `drivers`
--
ALTER TABLE `drivers`
  MODIFY `driver_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `driver_sessions`
--
ALTER TABLE `driver_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `live_tracking`
--
ALTER TABLE `live_tracking`
  MODIFY `tracking_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `routes`
--
ALTER TABLE `routes`
  MODIFY `route_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `schedules`
--
ALTER TABLE `schedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `stop_points`
--
ALTER TABLE `stop_points`
  MODIFY `stop_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `student_route_assignments`
--
ALTER TABLE `student_route_assignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `bus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  ADD CONSTRAINT `attendance_logs_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
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
  ADD CONSTRAINT `schedules_ibfk_6` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `schedules_ibfk_7` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `stop_points`
--
ALTER TABLE `stop_points`
  ADD CONSTRAINT `stop_points_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_students_userid` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `student_route_assignments`
--
ALTER TABLE `student_route_assignments`
  ADD CONSTRAINT `student_route_assignments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  ADD CONSTRAINT `student_route_assignments_ibfk_2` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`),
  ADD CONSTRAINT `student_route_assignments_ibfk_3` FOREIGN KEY (`pickup_stop_id`) REFERENCES `stop_points` (`stop_id`),
  ADD CONSTRAINT `student_route_assignments_ibfk_4` FOREIGN KEY (`dropoff_stop_id`) REFERENCES `stop_points` (`stop_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
