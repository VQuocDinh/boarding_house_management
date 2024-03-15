-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2023 at 04:47 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quanliphongtro`
--

-- --------------------------------------------------------

--
-- Table structure for table `area`
--

CREATE TABLE `area` (
  `id` int(11) NOT NULL,
  `idUser` int(11) DEFAULT NULL,
  `idHouse` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `area`
--

INSERT INTO `area` (`id`, `idUser`, `idHouse`) VALUES
(48, 38, 7),
(49, 38, 11),
(51, 41, 3),
(52, 41, 7),
(53, 41, 14);

-- --------------------------------------------------------

--
-- Table structure for table `arise`
--

CREATE TABLE `arise` (
  `id` int(11) NOT NULL,
  `idUser` int(11) DEFAULT NULL,
  `nameUser` varchar(50) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `time` date DEFAULT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `arise`
--

INSERT INTO `arise` (`id`, `idUser`, `nameUser`, `price`, `time`, `note`) VALUES
(12, 3, 'Long Vũ', 1000000, '2023-02-15', 'Làm các xét nghiệm covid'),
(13, 21, 'Diệp Vấn', 300000, '2023-02-14', 'Đóng tiền tổ chức văn nghệ 2'),
(14, 3, 'Long Vũ', 10000000, '2023-03-13', 'Test'),
(15, 3, 'Long Vũ', 1000000, '2023-03-16', 'Đóng tiền phát sinh khi đăng kí trọ'),
(16, 3, 'Long Vũ', 1000000, '2023-03-16', 'Phí phát sinh'),
(17, 3, 'Long Vũ', 1000000, '2023-06-21', ''),
(18, 3, 'Long Vũ', 2000000, '2023-06-25', 'Sửa đồ dùng'),
(19, 41, 'Lê Anh Tuấn', 15000, '2023-06-25', 'Bàn ghế');

-- --------------------------------------------------------

--
-- Table structure for table `arise_detail`
--

CREATE TABLE `arise_detail` (
  `id` int(11) NOT NULL,
  `arise_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `arise_detail`
--

INSERT INTO `arise_detail` (`id`, `arise_id`, `room_id`) VALUES
(28, 12, 7),
(30, 14, 11),
(31, 15, 11),
(32, 13, 7),
(33, 16, 12),
(35, 17, 11),
(36, 17, 8),
(38, 18, 15),
(41, 19, 19),
(42, 19, 18);

-- --------------------------------------------------------

--
-- Table structure for table `asset`
--

CREATE TABLE `asset` (
  `id` int(11) NOT NULL,
  `idUser` int(11) DEFAULT NULL,
  `nameUser` varchar(50) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `number` int(11) DEFAULT NULL,
  `number_now` int(11) DEFAULT NULL,
  `time_update` date DEFAULT NULL,
  `day_start` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  `isEnd` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `asset`
--

INSERT INTO `asset` (`id`, `idUser`, `nameUser`, `room_id`, `name`, `price`, `number`, `number_now`, `time_update`, `day_start`, `note`, `isEnd`) VALUES
(17, 3, 'Long Vũ', 7, 'Ghế mát xa 2', 10000000, 3, 3, '2023-06-22', '2023-01-17', '', 1),
(19, 3, 'Long Vũ', 11, 'Ghế dài', 1000000, 2, 3, '2023-06-25', '2023-06-22', '', 1),
(21, 3, 'Long Vũ', 18, 'Bàn', 300000, 2, 2, '2023-06-25', '2023-06-25', '', 1),
(22, 41, 'Lê Anh Tuấn', 19, 'Ghế nhựa', 300000, 2, 2, NULL, '2023-06-25', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `contract`
--

CREATE TABLE `contract` (
  `id` int(11) NOT NULL,
  `idUser` int(11) DEFAULT NULL,
  `nameUser` varchar(50) DEFAULT NULL,
  `member_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `contract_day` date DEFAULT NULL,
  `contract_time` int(11) DEFAULT NULL,
  `contract_end` date DEFAULT NULL,
  `deposit` int(11) DEFAULT NULL,
  `isOnTime` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contract`
--

INSERT INTO `contract` (`id`, `idUser`, `nameUser`, `member_id`, `room_id`, `contract_day`, `contract_time`, `contract_end`, `deposit`, `isOnTime`) VALUES
(12, 3, 'Long Vũ', 20, 7, '2023-02-15', 12, '2023-06-25', 2000000, 0),
(13, 3, 'Long Vũ', 22, 11, '2023-03-15', 12, '2023-03-31', 2000000, 1),
(14, 3, 'Long Vũ', 23, 12, '2023-03-15', 12, '2023-06-25', 1000000, 0),
(15, 3, 'Long Vũ', 25, 6, '2023-06-21', 2, '2023-06-21', 100000000, 0),
(16, 3, 'Long Vũ', 26, 6, '2023-06-21', 1, '2023-06-21', 100000000, 0),
(17, 38, 'Beginer-1710', 28, 6, '2023-06-21', 1, '2023-06-21', 100000000, 0),
(18, 38, 'Beginer-1710', 29, 6, '2023-06-21', 1, '2023-06-21', 100000000, 0),
(19, 38, 'Beginer-1710', 30, 6, '2023-06-21', 1, '2023-06-21', 100000000, 0),
(20, 3, 'Long Vũ', 31, 6, '2023-06-21', 1, '2023-06-21', 100000000, 0),
(21, 3, 'Long Vũ', 32, 5, '2002-06-25', 1, '2023-06-25', 200000, 1),
(22, 3, 'Long Vũ', 33, 17, '2023-06-25', 1, '0000-00-00', 200000, 1),
(23, 3, 'Long Vũ', 34, 17, '2023-06-25', 1, '2023-06-25', 200000, 1),
(24, 3, 'Long Vũ', 35, 16, '2023-06-25', 1, '2023-06-25', 200000, 1),
(25, 3, 'Long Vũ', 36, 5, '2023-06-25', 1, '2023-06-25', 200000, 1),
(26, 3, 'Long Vũ', 37, 18, '2023-06-25', 1, '2023-06-25', 200000, 1),
(27, 3, 'Long Vũ', 38, 12, '2023-06-25', 1, '2023-06-25', 2000, 1),
(28, 3, 'Long Vũ', 40, 7, '2023-06-25', 1, '2023-06-25', 2000000, 1),
(29, 3, 'Long Vũ', 42, 19, '2023-06-25', 3, '2023-06-25', 3000000, 1),
(30, 3, 'Long Vũ', 43, 6, '2023-06-25', 1, '2023-06-25', 200000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `deposit`
--

CREATE TABLE `deposit` (
  `id` int(11) NOT NULL,
  `idUser` int(11) DEFAULT NULL,
  `nameUser` varchar(50) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `name_person` varchar(50) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `time` date DEFAULT current_timestamp(),
  `money_deposit` int(11) DEFAULT NULL,
  `day_come` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  `status` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `deposit`
--

INSERT INTO `deposit` (`id`, `idUser`, `nameUser`, `room_id`, `name_person`, `phone_number`, `time`, `money_deposit`, `day_come`, `note`, `status`) VALUES
(15, 3, 'Long Vũ', 6, 'Nguyễn Văn A', '0877676545', '2023-03-15', 10000000, '2023-03-15', '', 2),
(18, 3, 'Long Vũ', 11, 'Long Vũ', '1234567890', '2023-06-22', 10000000, '2023-06-22', '', 2),
(20, 3, 'Long Vũ', 8, 'Nam Nguyễn', '0966397027', '2023-06-22', 10000000, '2023-06-22', '', 3),
(21, 3, 'Long Vũ', 5, 'Võ Thịnh', '0399967453', '2023-06-25', 100000, '2023-06-25', '', 2),
(22, 3, 'Long Vũ', 7, 'Võ Quốc', '0989987675', '2023-06-25', 100000, '2023-06-25', '', 2),
(23, 3, 'Long Vũ', 6, 'Võ Quốc Dinh', '0399967453', '2023-06-25', 100000, '2023-06-25', '', 2);

-- --------------------------------------------------------

--
-- Table structure for table `deposit_status`
--

CREATE TABLE `deposit_status` (
  `id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `deposit_status`
--

INSERT INTO `deposit_status` (`id`, `status`) VALUES
(1, 'Đang chờ'),
(2, 'Đã nhận phòng'),
(3, 'Đã hủy');

-- --------------------------------------------------------

--
-- Table structure for table `electric_bill`
--

CREATE TABLE `electric_bill` (
  `id` int(11) NOT NULL,
  `idUser` int(11) DEFAULT NULL,
  `nameUser` varchar(50) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `old` int(11) DEFAULT NULL,
  `new` int(11) DEFAULT NULL,
  `from_time` date DEFAULT NULL,
  `to_time` date DEFAULT NULL,
  `current_time` date DEFAULT NULL,
  `price` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `electric_bill`
--

INSERT INTO `electric_bill` (`id`, `idUser`, `nameUser`, `room_id`, `old`, `new`, `from_time`, `to_time`, `current_time`, `price`) VALUES
(23, 3, 'Long Vũ', 7, 12, 25, '2023-02-01', '2023-02-28', '2023-02-28', 100000),
(24, 3, 'Long Vũ', 11, 12, 25, '2023-03-15', '2023-03-31', '2023-03-30', 1000000),
(25, 38, 'Beginer-1710', 11, 12, 25, '2023-03-01', '2023-03-14', '2023-03-15', 1000000),
(26, 3, 'Long Vũ', 8, 12, 24, '2023-06-15', '2023-06-30', '2023-06-21', 150000),
(27, 3, 'Long Vũ', 15, 12, 24, '2023-06-25', '2023-07-25', '2023-06-25', 30000),
(28, 3, 'Long Vũ', 15, 12, 24, '2023-07-25', '2023-07-27', '2023-06-25', 300000),
(29, 41, 'Lê Anh Tuấn', 19, 12, 24, '2023-06-25', '2023-07-12', '2023-06-25', 30000);

-- --------------------------------------------------------

--
-- Table structure for table `galery_room`
--

CREATE TABLE `galery_room` (
  `id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `galery` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `galery_room`
--

INSERT INTO `galery_room` (`id`, `room_id`, `galery`) VALUES
(19, 11, 'http://localhost:3001/img/ImgRoom/ba4881b1fca7d2138d7f11400.jpg'),
(20, 11, 'http://localhost:3001/img/ImgRoom/ba4881b1fca7d2138d7f11401.jpg'),
(21, 11, 'http://localhost:3001/img/ImgRoom/ba4881b1fca7d2138d7f11402.jpg'),
(22, 12, 'http://localhost:3001/img/ImgRoom/3036013c49b5ef53ad6ceb900.jpg'),
(23, 12, 'http://localhost:3001/img/ImgRoom/3036013c49b5ef53ad6ceb901.jpg'),
(24, 12, 'http://localhost:3001/img/ImgRoom/3036013c49b5ef53ad6ceb902.jpg'),
(25, 13, 'http://localhost:3001/img/ImgRoom/0636cc2ca22d8767c2109bc00.jpg'),
(26, 14, 'http://localhost:3001/img/ImgRoom/0636cc2ca22d8767c2109bc01.jpg'),
(27, 14, 'http://localhost:3001/img/ImgRoom/0636cc2ca22d8767c2109bc02.jpg'),
(28, 15, 'http://localhost:3001/img/ImgRoom/094b59af15e2abdffe341fa00.jpg'),
(29, 16, 'http://localhost:3001/img/ImgRoom/094b59af15e2abdffe341fa02.jpg'),
(30, 16, 'http://localhost:3001/img/ImgRoom/094b59af15e2abdffe341fa01.jpg'),
(31, 17, 'http://localhost:3001/img/ImgRoom/094b59af15e2abdffe341fa03.jpg'),
(32, 18, 'http://localhost:3001/img/ImgRoom/6cb4b20ba207aa2b41795e700.jpg'),
(33, 19, 'http://localhost:3001/img/ImgRoom/12c6ab8a962f68b1ca464f700.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `house`
--

CREATE TABLE `house` (
  `id` int(11) NOT NULL,
  `name_house` varchar(100) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `house`
--

INSERT INTO `house` (`id`, `name_house`, `address`, `status`) VALUES
(2, 'Nhà A', '35/24 hai bà chưng , quận 10', 1),
(3, 'Nhà B', '35/24 hai bà chưng , quận 1155', 1),
(7, 'Nhà I', '97 Man Thiện, quận 9', 1),
(9, 'Nhà E', 'Trần Hưng Đạo , Quận 9 2', 0),
(11, 'Nhà H', 'Không có địa chỉ', 1),
(14, 'Nhà D', 'Tuy Phong, Bình Thuận', 1),
(15, 'Nhà F', '92 Man Thiện, Quận 9', 0),
(18, 'Nhà G', 'hẻm 60, Quận 9', 1);

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `CMND` varchar(30) DEFAULT NULL,
  `CMND_day` date DEFAULT NULL,
  `CMND_place` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `birth_place` varchar(150) DEFAULT NULL,
  `time_start` date DEFAULT current_timestamp(),
  `time_end` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`id`, `room_id`, `name`, `phone_number`, `CMND`, `CMND_day`, `CMND_place`, `email`, `permanent_address`, `birth`, `birth_place`, `time_start`, `time_end`, `note`, `status`) VALUES
(20, 7, 'Long Vũ ', '0966574876', '2784878247', '2023-01-10', 'Biên Hòa', 'gamehay@gmail.com', '97 Man thiện / P.Hiệp Phú', '2000-03-14', 'Biên Hòa', '2023-03-15', '2023-06-25', '', 0),
(21, 7, 'Dinh ', '0856868654', '127361823', NULL, NULL, 'Dinh@gmail.com', '97 Man thiện / P.Hiệp Phú', '2000-03-15', NULL, '2023-03-15', '2023-06-25', NULL, 0),
(22, 11, 'Nguyễn Văn B', '0966765678', '787876545', '2017-03-15', 'Biên Hòa', 'B@gmail.com', '97 Man thiện / P.Hiệp Phú', '1998-03-15', 'Biên Hòa', '2023-03-15', '2023-06-20', '', 0),
(23, 12, 'Long Vũ 1234567', '0977876567', '878878908', '2009-03-10', 'Biên Hòa', 'gamehay@gmail.com', 'Biên Hòa', '2000-03-15', 'Biên Hòa', '2023-03-15', '2023-06-25', '', 0),
(24, 12, 'Lý tiểu long', '787567654', '123456789', NULL, NULL, 'gamehay@gmail.com', '97 Man thiện / P.Hiệp Phú', '2002-03-15', NULL, '2023-03-15', '2023-06-25', NULL, 0),
(25, 6, 'Diệp Vấn', '0966397027', '123123123', '2023-06-21', 'Biên Hòa', 'gamehay@gmail.com', '97 Man thiện / P.Hiệp Phú', '2023-06-21', 'Biên Hòa', '2023-06-21', '2023-06-21', '', 0),
(26, 6, 'Long', '123456', '123123123', '2023-06-21', 'Bien Hoa', 'gamehay@gmail.com', '97 Man thiện / P.Hiệp Phú', '2023-06-21', 'Biên Hòa', '2023-06-21', '2023-06-21', 'sdasd', 0),
(27, 6, 'Long', '123123', '123123123', '2023-06-22', '123123123', 'gma@gmail.com', 'Biên Hòa', '2023-06-22', 'Biên Hòa', '2023-06-21', '2023-06-21', 'hmmmmm', 0),
(28, 6, 'Long', '123123', '123123123123', '2023-06-21', 'Bien Hoa', 'hahaha@gmail.com', 'Biên Hòa2', '2023-06-21', 'ádasd', '2023-06-21', '2023-06-21', 'zxczc', 0),
(29, 6, 'Long', '123123', '123123123', '2023-06-21', 'Bien Hoa', 'gamehay@gmail.com', '97 Man thiện / P.Hiệp Phú', '2023-06-21', 'Biên Hòa', '2023-06-21', '2023-06-21', 'ádasd', 0),
(30, 6, 'Long', '123123', '123123333', '2023-06-21', 'Bien Hoa', 'gamehay@gmail.com', '97 Man thiện / P.Hiệp Phú', '2023-06-21', 'Biên Hòa', '2023-06-21', '2023-06-21', 'ádasd', 0),
(31, 6, 'Long', '123456', '2323232323', '2023-06-21', 'Bien Hoa', 'gamehay@gmail.com', 'Biên Hòa', '2023-06-21', 'Biên Hòa', '2023-06-21', '2023-06-21', 'fss', 0),
(32, 5, 'Võ Quốc Dinh', '0399967453', '234554345', '2023-06-07', 'Bình Thuận', 'abc@gmail.com', 'Hồ Chí Minh', '2023-06-25', 'Bình Thuận', '2023-06-25', NULL, '', 1),
(33, 17, 'Võ Dinh', '0399967453', '261655305', '2009-06-25', 'Bình Thuận', 'abc@gmail.com', 'Hồ Chí Minh', '2002-06-25', 'Bình Thuận', '2023-06-25', NULL, '', 1),
(34, 17, 'Nguyễn Văn A', '0987786765', '787665454', '2012-06-25', 'Bình Thuận', 'vqdinh2202@gmail.com', 'Hồ Chí Minh', '2002-06-25', 'Bình Thuận', '2023-06-25', NULL, '', 1),
(35, 16, 'Lê Văn Anh', '1234567890', '090099876', '2023-06-25', 'Bình Thuận', 'nn20dccn091@student.ptithcm.edu.vn', 'Hồ Chí Minh', '2023-06-25', 'Bình Thuận', '2023-06-25', NULL, '', 1),
(36, 5, 'Lê An', '0990098786', '9899988766', '2023-06-25', 'Bình Thuận', 'abc@gmail.com', 'Hồ Chí Minh', '2023-06-25', 'Bình Thuận', '2023-06-25', NULL, '', 1),
(37, 18, 'ưeqwe', '0399967453', '090000990', '2023-06-25', 'Bình Thuận', 'vqdinh2202@gmail.com', 'Hồ Chí Minh', '2023-06-25', 'Bình Thuận', '2023-06-25', NULL, '', 1),
(38, 12, 'ds', '0966397027', '3214424114', '2023-06-25', 'bt', 'nb@gmail.com', 'bt', '2023-06-25', 'bt', '2023-06-25', NULL, '', 1),
(40, 7, 'Lê Quang', '0998876565', '876776543', '2023-06-25', 'Bình Thuận', 'abc@gmail.com', 'Hồ Chí Minh', '2002-06-25', 'Bình Thuận', '2023-06-25', NULL, '', 1),
(41, 7, 'Đào Xuân Cường', '1234567890', '899877656', NULL, NULL, 'vqdinh2202@student.ptithcm.edu.vn', 'Hồ Chí Minh', '2023-06-25', NULL, '2023-06-25', NULL, NULL, 1),
(42, 19, 'Võ Văn Vũ', '0999987675', '989999866', '2023-06-25', 'Bình Thuận', 'vqdinh2202@hhgmail.com', 'Hồ Chí Minh', '2023-06-25', 'Bình Thuận', '2023-06-25', NULL, '', 1),
(43, 6, 'Lê Quy', '6667780987', '9098765654', '2023-06-25', 'Bình Thuận', 'vqdinh2202@gmail.com', 'Hồ Chí Minh', '2023-06-25', 'Bình Thuận', '2023-06-25', NULL, '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `receive_bill`
--

CREATE TABLE `receive_bill` (
  `id` int(11) NOT NULL,
  `idUser` int(11) DEFAULT NULL,
  `nameUser` varchar(50) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `time` date DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `receiver` varchar(50) DEFAULT NULL,
  `reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `receive_bill`
--

INSERT INTO `receive_bill` (`id`, `idUser`, `nameUser`, `room_id`, `time`, `price`, `receiver`, `reason`) VALUES
(8, 3, 'Long Vũ', 7, '2023-02-22', 1000000, 'Chủ nhà 45', 'Tiền cho thuê quạt'),
(9, 3, 'Long Vũ', 11, '2023-03-24', 1000000, 'Chủ phòng i95', 'Thu tiền kiểm tra nhà toàn thể '),
(10, 3, 'Long Vũ', 12, '2023-03-23', 1000000, 'Chủ nhà n14', 'Mua bàn ghê mới '),
(11, 3, 'Long Vũ', 19, '2023-06-25', 300000, 'Dinh', ''),
(12, 3, 'Long Vũ', 13, '2023-06-25', 2000000, 'Dinh', ''),
(13, 3, 'Long Vũ', 19, '2023-06-25', 300000, 'Vũ', 'Sữa chữa'),
(14, 3, 'Long Vũ', 19, '2023-06-25', 10000, 'Vũ', 'Vệ sinh'),
(15, 41, 'Lê Anh Tuấn', 11, '2023-06-25', 300000, 'Dinh', '');

-- --------------------------------------------------------

--
-- Table structure for table `rent`
--

CREATE TABLE `rent` (
  `id` int(11) NOT NULL,
  `idUser` int(11) DEFAULT NULL,
  `nameUser` varchar(50) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `from_time` date DEFAULT NULL,
  `to_time` date DEFAULT NULL,
  `current_time` date DEFAULT NULL,
  `money_need` int(11) DEFAULT NULL,
  `money_do` int(11) DEFAULT 0,
  `arise` int(11) NOT NULL DEFAULT 0,
  `discount_reason` text DEFAULT NULL,
  `isDone` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rent`
--

INSERT INTO `rent` (`id`, `idUser`, `nameUser`, `room_id`, `from_time`, `to_time`, `current_time`, `money_need`, `money_do`, `arise`, `discount_reason`, `isDone`) VALUES
(45, 3, 'Long Vũ', 7, '2023-02-01', '2023-02-28', NULL, 2955000, 0, 100000, 'Khuyễn mãi tháng đầu ', 0),
(46, 3, 'Long Vũ', 11, '2023-03-15', '2023-03-31', NULL, 4900000, 0, 1000000, 'Tăng giá ưu đãi tháng 3', 0),
(47, 3, 'Long Vũ', 12, '2023-03-15', '2023-03-31', NULL, 2415000, 0, -1000000, 'Tăng', 0),
(48, 3, 'Long Vũ', 11, '2023-06-01', '2023-06-14', '2023-06-21', 800000, 500000, -200000, 'Dịch covid-19', 0),
(53, 3, 'Long Vũ', 19, '2023-06-25', '2023-07-14', '2023-06-25', 2013000, 2000000, -12000, 'Ủng hộ', 0),
(54, 3, 'Long Vũ', 19, '2023-04-21', '2023-05-10', NULL, 2025000, 0, 0, NULL, 0),
(55, 3, 'Long Vũ', 18, '2023-06-25', '2023-07-13', '2023-06-25', 1975000, 10000, -100000, 'Dịch covid-19', 0);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'User');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` int(11) NOT NULL,
  `status_room` int(11) DEFAULT NULL,
  `House_id` int(11) DEFAULT NULL,
  `room_number` varchar(20) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `length` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `people_number` int(11) DEFAULT NULL,
  `describe` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `status_room`, `House_id`, `room_number`, `price`, `length`, `width`, `people_number`, `describe`) VALUES
(5, 2, 3, 'n14', 2000000, 12, 24, 5, 'abc\r\nxyz'),
(6, 2, 7, 'm13', 1000000, 12, 24, 2, 'sadasdasdasd'),
(7, 2, 3, 'n13', 1000000, 12, 24, 2, 'asdasdasd'),
(8, 1, 2, 'p3', 1000000, 12, 24, 2, 'a,sdasldkalksjdlasdlk'),
(10, 1, 9, 'l3', 1000000, 12, 24, 2, 'bchsldaksd;lak'),
(11, 1, 7, 'm10', 1000000, 12, 50, 2, 'Nhà sạch sẽ thoáng mát , đối diện trường học và các cửa hàng tiện lợi '),
(12, 2, 3, 'n12', 1000000, 12, 25, 2, 'Nhà đẹp'),
(13, 1, 14, 'o1', 2000000, 12, 12, 4, 'Phòng sạch sẽ thoáng mát'),
(14, 1, 15, 'i12', 2000000, 14, 12, 3, 'Nhà sạch sẽ'),
(15, 1, 18, 'u7', 2000000, 12, 12, 3, 'Nhà sạch đẹp'),
(16, 2, 3, 'n4', 2000000, 12, 12, 4, 'Nhà sạch đẹp'),
(17, 5, 3, 'n5', 2000000, 12, 12, 3, 'Nhà sạch đẹp'),
(18, 2, 3, 'n6', 2000000, 12, 12, 3, 'Nhà sạch đẹp'),
(19, 2, 3, 'n9', 2000000, 12, 12, 4, 'Nhà sạch đẹp');

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`id`, `name`, `price`, `note`, `status`) VALUES
(4, 'Gửi xe', 10000, 'Gửi xe an toàn ', 1),
(5, 'Dọn rác ', 5000, 'Dọn rác sạch ', 1),
(7, 'Giặc sấy', 100000, '', 1),
(8, 'Khám xe định kỳ', 200000, '', 1),
(10, 'Phun thuốc diệt muỗi', 50000, '', 0),
(11, 'Thức ăn trưa', 25000, '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `service_detail`
--

CREATE TABLE `service_detail` (
  `id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_detail`
--

INSERT INTO `service_detail` (`id`, `room_id`, `service_id`, `number`) VALUES
(34, 18, 11, 1),
(35, 18, 10, 1),
(36, 12, 11, 1),
(37, 7, 11, 2),
(38, 7, 10, 1),
(39, 7, 8, 1),
(40, 19, 11, 1);

-- --------------------------------------------------------

--
-- Table structure for table `spend_bill`
--

CREATE TABLE `spend_bill` (
  `id` int(11) NOT NULL,
  `idUser` int(11) DEFAULT NULL,
  `nameUser` varchar(50) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `time` date DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `receiver` varchar(50) DEFAULT NULL,
  `reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `spend_bill`
--

INSERT INTO `spend_bill` (`id`, `idUser`, `nameUser`, `room_id`, `time`, `price`, `receiver`, `reason`) VALUES
(12, 3, 'Long Vũ', 7, '2023-02-20', 1000000, 'Chủ phòng n123', 'Sửa chữa 1 số thứ'),
(13, 3, 'Long Vũ', 11, '2023-03-20', 300000, 'Chủ cửa hàng ', 'Mua các vật dụng cần '),
(14, 3, 'Long Vũ', 6, '2023-06-22', 1000000, 'Chủ tiệm ', ''),
(15, 3, 'Long Vũ', 19, '2023-06-25', 2000000, 'Dinh', 'Khen Thưởng');

-- --------------------------------------------------------

--
-- Table structure for table `status_room`
--

CREATE TABLE `status_room` (
  `id` int(11) NOT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `status_room`
--

INSERT INTO `status_room` (`id`, `status`) VALUES
(1, 'Còn trống'),
(2, 'Đang cho thuê'),
(3, 'Được đặt cọc trước'),
(4, 'Đang tu sửa'),
(5, 'Khóa');

-- --------------------------------------------------------

--
-- Table structure for table `todolist`
--

CREATE TABLE `todolist` (
  `id` int(11) NOT NULL,
  `todolist_status` int(11) DEFAULT NULL,
  `time` date DEFAULT NULL,
  `describe` text DEFAULT NULL,
  `solution` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `done_time` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `todolist`
--

INSERT INTO `todolist` (`id`, `todolist_status`, `time`, `describe`, `solution`, `note`, `done_time`) VALUES
(12, 1, '2023-03-30', 'Thu tiền và xem xet những thứ cần sửa', 'Đi xem ', '', '2023-06-22'),
(13, 2, '2023-03-16', 'Sửa nhà 2', 'Tiền', '', '2023-03-16'),
(14, 2, '2023-03-14', 'Sửa nhà ', 'Gọi thợ cũ', 'Khách yêu cầu sửa nhanh nhất có thể !!', '2023-06-21'),
(16, 2, '2023-06-25', 'Lau nhà', 'Lau thật sạch', '', '2023-06-25');

-- --------------------------------------------------------

--
-- Table structure for table `todolist_detail`
--

CREATE TABLE `todolist_detail` (
  `id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `todo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `todolist_detail`
--

INSERT INTO `todolist_detail` (`id`, `room_id`, `todo_id`) VALUES
(40, 7, 12),
(41, 5, 12),
(45, 12, 13),
(46, 7, 13),
(47, 5, 13),
(48, 11, 14),
(55, 19, 16);

-- --------------------------------------------------------

--
-- Table structure for table `todolist_status`
--

CREATE TABLE `todolist_status` (
  `id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `todolist_status`
--

INSERT INTO `todolist_status` (`id`, `status`) VALUES
(1, 'Đang thực hiện'),
(2, 'Hoàn tất');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `user_id` int(11) NOT NULL,
  `token` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`user_id`, `token`) VALUES
(38, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsInVzZXIiOiIwOTY2Nzg2NzY0IiwiaXNBZG1pbiI6MiwiaWF0IjoxNjg3NDA0NjMyfQ.Bvp-RAO5RiiTDQzvqJwKLS5dQ4bYgehPQfwkstaKrHY'),
(39, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzksInVzZXIiOm51bGwsImlzQWRtaW4iOjIsImlhdCI6MTY4NTY2OTM2Nn0.ytceVAuNcsOYKNFF3O1IF2x80OQav80dmPWa0sp8BSE'),
(41, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDEsInVzZXIiOiIwMzk5OTY3NDUzIiwiaXNBZG1pbiI6MiwiaWF0IjoxNjg3NzAzMzA1fQ.iBS9ZQod3evc7eixChfnDXGKyAghNs_vDvxk_MJ_3uc');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `user_img` text DEFAULT NULL,
  `fullname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `role_id` int(11) DEFAULT 2,
  `isActive` tinyint(1) DEFAULT 0,
  `googleId` varchar(50) DEFAULT NULL,
  `githubId` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `user_img`, `fullname`, `email`, `phone_number`, `address`, `password`, `role_id`, `isActive`, `googleId`, `githubId`) VALUES
(3, 'http://localhost:3001/img/avatars/bc3b88723af764ed23440d300.png', 'Long Vũ', 'gamehay@gmail.com', '0966397027', '97 Man Thiện, quận 9', '$2b$10$..n/3AbJclAusNHgZKcZ5.Xu6KlM4UBjlCwyvZX.ww0a9SBEzWp9y', 1, 1, NULL, NULL),
(10, NULL, 'Hoàng Thông', 'gamehay@gmail.com', '0966397028', 'Không có địa chỉ', '$2b$10$jMA4QsaCGBUFz6s2Y.0gr.COZ7lJgJbr0KBW7DjUEcbKdaFWWXXDi', 2, 0, NULL, NULL),
(13, NULL, 'Long Tứ', 'hahaha@gmail.com', '0966397029', 'Không có địa chỉ', '$2b$10$dCTHWek/WussytkBLv3kk.kctexhClwI1mMvuRJsvWC6mTrddT0CO', 2, 0, NULL, NULL),
(21, 'http://localhost:3001/img/avatars/9ef749a10de83227da76f1100.png', 'Diệp Vấn', 'gamehay@gmail.com', '0966397021', '98 Man thiện', '$2b$10$oR4sryqJDnZD4hcSF3ITbOsm2Sf1L4kTFg0T2VIiaj/s.qawvdMMu', 2, 1, NULL, NULL),
(22, NULL, 'Thập Chí Khang', 'gamehay@gmail.com', '0966397528', 'Không có địa chỉ', '$2b$10$1rmAOymBru1MnT9ScbjfM.tPi.qBdFFTDtE5Yfi1SmPRi3dd3fE/O', 2, 0, NULL, NULL),
(23, NULL, 'Ly Tieu Long', 'hahaha@gmail.com', '0965397028', '90 Man Thiện', '$2b$10$7JiJSthADtUs/ywWXI13SeP3QG./H0ORqSpdZnckKlJFq0HCSTO82', 2, 0, NULL, NULL),
(24, NULL, 'Nam Nguyễn', 'gamehay@gmail.com', '0966797028', '99 Man Thiện', '$2b$10$nloIDhGjto5wnjUgYJ0VGOjbbMUv/UsSrz6vMDxwnsn74Cx2WWMmW', 2, 1, NULL, NULL),
(26, NULL, 'Nam Nguyễn 2', 'gamehay24@gmail.com', '0976397028', '96 Man Thiện', '$2b$10$T/byw/ppPwB6UszSWLW2UuLhkVbsfaJylGHUNGzpWs4ZWtMpYCFMy', 2, 0, NULL, NULL),
(36, 'https://lh3.googleusercontent.com/a/AGNmyxZwRF6tIAE7dFucfM-RPbuZfrKHZnI9U2RgsT3g=s96-c', 'Long Vũ', 'gamehay17102000@gmail.com', '08778755575', '92 Man Thiện', NULL, 2, 1, '112064342165016971584', NULL),
(38, 'https://avatars.githubusercontent.com/u/63004598?v=4', 'Quốc Thịnh', 'gma@gmail.com', '0966786764', '91 Man Thiện2', '$2b$10$3cpQc/yKopYqWeO4ONBlbekkoCOUTUpFe8uEs9fBDfs7bn8/Wi/eW', 2, 1, NULL, '63004598'),
(39, 'https://lh3.googleusercontent.com/a/AAcHTtfqCOM1HMgrWuZ7ZpsQnAIEi5-G9j9Las_jLnyj=s96-c', 'Quang Vũ', 'gamehay741852963@gmail.com', NULL, NULL, NULL, 2, 1, '111550298259087968506', NULL),
(40, NULL, 'Nguyễn Văn An', NULL, '01234567890', NULL, '$2b$10$Rb8rallGzY1mQ6X.yC/CT.fgalUm3WlEAPwBEEeZA5Jbh04LpsJZ2', 2, 1, NULL, NULL),
(41, NULL, 'Lê Anh Tuấn', 'vqdinh2202@gmail.com', '0399967453', 'hẻm 60', '$2b$10$71YP82aTmZBcYn70efHLZuoMohauZDLfq9L/J9lSgOqo319nqtPQe', 2, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `water_bill`
--

CREATE TABLE `water_bill` (
  `id` int(11) NOT NULL,
  `idUser` int(11) DEFAULT NULL,
  `nameUser` varchar(50) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `old` int(11) DEFAULT NULL,
  `new` int(11) DEFAULT NULL,
  `from_time` date DEFAULT NULL,
  `to_time` date DEFAULT NULL,
  `current_time` date DEFAULT NULL,
  `price` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `water_bill`
--

INSERT INTO `water_bill` (`id`, `idUser`, `nameUser`, `room_id`, `old`, `new`, `from_time`, `to_time`, `current_time`, `price`) VALUES
(9, 3, 'Long Vũ', 7, 12, 55, '2023-02-01', '2023-02-28', '2023-02-27', 100000),
(10, 3, 'Long Vũ', 11, 6, 33, '2023-03-15', '2023-03-31', '2023-03-30', 200000),
(11, 3, 'Long Vũ', 12, 12, 25, '2023-03-15', '2023-03-31', '2023-03-30', 1000000),
(12, 3, 'Long Vũ', 8, 12, 25, '2023-03-14', '2023-03-15', '2023-03-31', 1000000),
(13, 3, 'Long Vũ', 15, 12, 23, '2023-06-25', '2023-07-21', '2023-06-25', 2333000);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `area`
--
ALTER TABLE `area`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUser` (`idUser`),
  ADD KEY `idHouse` (`idHouse`);

--
-- Indexes for table `arise`
--
ALTER TABLE `arise`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUser` (`idUser`);

--
-- Indexes for table `arise_detail`
--
ALTER TABLE `arise_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `arise_id` (`arise_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `asset`
--
ALTER TABLE `asset`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `asset_ibfk_2` (`idUser`);

--
-- Indexes for table `contract`
--
ALTER TABLE `contract`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `idUser` (`idUser`);

--
-- Indexes for table `deposit`
--
ALTER TABLE `deposit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `idUser` (`idUser`),
  ADD KEY `deposit_ibfk_3` (`status`);

--
-- Indexes for table `deposit_status`
--
ALTER TABLE `deposit_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `electric_bill`
--
ALTER TABLE `electric_bill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `idUser` (`idUser`);

--
-- Indexes for table `galery_room`
--
ALTER TABLE `galery_room`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `house`
--
ALTER TABLE `house`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `receive_bill`
--
ALTER TABLE `receive_bill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `idUser` (`idUser`);

--
-- Indexes for table `rent`
--
ALTER TABLE `rent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `idUser` (`idUser`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD KEY `House_id` (`House_id`),
  ADD KEY `status_room` (`status_room`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_detail`
--
ALTER TABLE `service_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `spend_bill`
--
ALTER TABLE `spend_bill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `idUser` (`idUser`);

--
-- Indexes for table `status_room`
--
ALTER TABLE `status_room`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `todolist`
--
ALTER TABLE `todolist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `todolist_status` (`todolist_status`);

--
-- Indexes for table `todolist_detail`
--
ALTER TABLE `todolist_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `todo_id` (`todo_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `todolist_status`
--
ALTER TABLE `todolist_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`user_id`,`token`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `water_bill`
--
ALTER TABLE `water_bill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `idUser` (`idUser`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `area`
--
ALTER TABLE `area`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `arise`
--
ALTER TABLE `arise`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `arise_detail`
--
ALTER TABLE `arise_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `asset`
--
ALTER TABLE `asset`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `contract`
--
ALTER TABLE `contract`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `deposit`
--
ALTER TABLE `deposit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `deposit_status`
--
ALTER TABLE `deposit_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `electric_bill`
--
ALTER TABLE `electric_bill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `galery_room`
--
ALTER TABLE `galery_room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `house`
--
ALTER TABLE `house`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `receive_bill`
--
ALTER TABLE `receive_bill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `rent`
--
ALTER TABLE `rent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `service_detail`
--
ALTER TABLE `service_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `spend_bill`
--
ALTER TABLE `spend_bill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `status_room`
--
ALTER TABLE `status_room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `todolist`
--
ALTER TABLE `todolist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `todolist_detail`
--
ALTER TABLE `todolist_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `todolist_status`
--
ALTER TABLE `todolist_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `water_bill`
--
ALTER TABLE `water_bill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `area`
--
ALTER TABLE `area`
  ADD CONSTRAINT `area_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `area_ibfk_2` FOREIGN KEY (`idHouse`) REFERENCES `house` (`id`);

--
-- Constraints for table `arise`
--
ALTER TABLE `arise`
  ADD CONSTRAINT `arise_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`);

--
-- Constraints for table `arise_detail`
--
ALTER TABLE `arise_detail`
  ADD CONSTRAINT `arise_detail_ibfk_1` FOREIGN KEY (`arise_id`) REFERENCES `arise` (`id`),
  ADD CONSTRAINT `arise_detail_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`);

--
-- Constraints for table `asset`
--
ALTER TABLE `asset`
  ADD CONSTRAINT `asset_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `asset_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`);

--
-- Constraints for table `contract`
--
ALTER TABLE `contract`
  ADD CONSTRAINT `contract_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `contract_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`),
  ADD CONSTRAINT `contract_ibfk_3` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`);

--
-- Constraints for table `deposit`
--
ALTER TABLE `deposit`
  ADD CONSTRAINT `deposit_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `deposit_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `deposit_ibfk_3` FOREIGN KEY (`status`) REFERENCES `deposit_status` (`id`);

--
-- Constraints for table `electric_bill`
--
ALTER TABLE `electric_bill`
  ADD CONSTRAINT `electric_bill_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `electric_bill_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`);

--
-- Constraints for table `galery_room`
--
ALTER TABLE `galery_room`
  ADD CONSTRAINT `galery_room_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`);

--
-- Constraints for table `member`
--
ALTER TABLE `member`
  ADD CONSTRAINT `member_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`);

--
-- Constraints for table `receive_bill`
--
ALTER TABLE `receive_bill`
  ADD CONSTRAINT `receive_bill_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `receive_bill_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`);

--
-- Constraints for table `rent`
--
ALTER TABLE `rent`
  ADD CONSTRAINT `rent_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `rent_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`);

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`House_id`) REFERENCES `house` (`id`),
  ADD CONSTRAINT `room_ibfk_2` FOREIGN KEY (`status_room`) REFERENCES `status_room` (`id`);

--
-- Constraints for table `service_detail`
--
ALTER TABLE `service_detail`
  ADD CONSTRAINT `service_detail_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `service_detail_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`);

--
-- Constraints for table `spend_bill`
--
ALTER TABLE `spend_bill`
  ADD CONSTRAINT `spend_bill_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `spend_bill_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`);

--
-- Constraints for table `todolist`
--
ALTER TABLE `todolist`
  ADD CONSTRAINT `todolist_ibfk_1` FOREIGN KEY (`todolist_status`) REFERENCES `todolist_status` (`id`);

--
-- Constraints for table `todolist_detail`
--
ALTER TABLE `todolist_detail`
  ADD CONSTRAINT `todolist_detail_ibfk_1` FOREIGN KEY (`todo_id`) REFERENCES `todolist` (`id`),
  ADD CONSTRAINT `todolist_detail_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`);

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Constraints for table `water_bill`
--
ALTER TABLE `water_bill`
  ADD CONSTRAINT `water_bill_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `water_bill_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
