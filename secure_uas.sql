-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 22, 2025 at 02:42 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `secure_uas`
--

-- --------------------------------------------------------

--
-- Table structure for table `img_content`
--

CREATE TABLE `img_content` (
  `id` int NOT NULL,
  `content_id` int NOT NULL,
  `img` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `img_content`
--

INSERT INTO `img_content` (`id`, `content_id`, `img`) VALUES
(5, 4, '0b1e163016624e1ef3b2d9fc122cc102865be320edfcf3cd1d56bec35a8f7856802790f9c4fc8ca8b6493769182100a7'),
(6, 10, 'c34ae6f0732bd9bc52f1807a2b616053aaa2c9bd37369569c6b977093137575b948a0a9718369ef440323c703a66e567'),
(7, 11, '0f35dce3a16ee8ca274fee15a97582c4c3e67eba5a940f76a9ae45c5539339ee0fc6674d61409883f2715815c73c272ca7823473105ecf8ed58e881e0d9b09f6'),
(8, 12, '07615b4f2fd40774c22073804718495b5e0aa3bc5cac95b6f306d2dcde045eb746b8dfc06fc2a5f6c3dfcad08e5e35065fc09dd84b05bc0812425808d1d8ad1b'),
(9, 12, 'a21aaaa2dfcb1d3843e301d4d48a03fe017af4f453099e425b4d98be8e7dcfc200bcdf7491dd83a673e37c281531dba2'),
(10, 13, 'bc7029f6e8d552396ec3fbd4a8d3c1d1abbc720a322597d3e3532e95b8d0adcee6ce488386d8a0b71fd1a8b475f47be8'),
(11, 13, 'aa51195185cd760a5175fa1df1eee9b88df6ed34adca23a72a394acaf57370ce06df1d926731c2ffc99c145a309eb47f'),
(12, 13, '621f3da3a7e372b4b40f3a108715f474d303c60f5f8eba058d0009a69de9fa36de5cd405add4bf47e3e2dc8b34352903576b8348acd0efd6f3a342821b3e53b7');

-- --------------------------------------------------------

--
-- Table structure for table `membership`
--

CREATE TABLE `membership` (
  `id` int NOT NULL,
  `nama_membership` text NOT NULL,
  `harga` text NOT NULL,
  `img` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `membership`
--

INSERT INTO `membership` (`id`, `nama_membership`, `harga`, `img`) VALUES
(12, 'fef4a1c13d73e1cf58693f36a523ab9f', 'a6b54722d9aa228c0c6c9621d4db4207', '2fa62f7ea5bdff358167d237c2b76db38f2b1134a354211a22c29ed768da5aeed6d5cac5dcd07cbe9bc256a32f96de04b2d93f2badefe88e8cdc9e2bf84f3357'),
(13, '3b282bd50027e9be64d523123e062d4c422e7b95b88e43bb7a99bcd5cf066626', '7a07abcbec6ede159aa9f7f7bb14231a', '1e1b63c1c4ddeaeedd5a432ebef2fcf381c88cf236173e6d43af1e94b63f922b8747f5886542580e8b655e66f6448da9d4b5f168176bcf4b7e63399e3d940425'),
(14, 'd8245d62caa97c7c7855fdcf8fac4f0084bb0a1e12004371e663cfb5302e448c', 'bbdae54363f1c09e1979895f495c5cff', '62decbc081d7d413ad2f397a4f68e702425a1d4d3942b43477935be94a99af50563b290a9bf3ceee8eac50a54bf0a413'),
(15, '06c2f16de5dd79b8fa0c6f3372ad96f9', '6614cb8e04db8bed5aa51296d54468aa', 'a15b53f0d5de6c7b1d5a538ed71f6ad68918407fd01022e8161690d07af64f5749499af3e735b56237d01a92ee838bb2');

-- --------------------------------------------------------

--
-- Table structure for table `membership_content`
--

CREATE TABLE `membership_content` (
  `id` int NOT NULL,
  `membership_id` int NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `membership_content`
--

INSERT INTO `membership_content` (`id`, `membership_id`, `title`, `description`) VALUES
(4, 12, '882a9f7d2c08f4e1eb47f27160784020c8e06d67ba8a853a34734abb60c1229e', '43422ca8123ba024ba5e241b77baeb21ad3ef337bdcebfee49f58dae6c3d165c'),
(7, 12, '368c4bb896ed5ff6a814b0fb69ba1478dd451cc081a784ecdce7bdcd2b02cfd2', '534ad93b30c25487688952ca740bf031abe489ea83cb20e6baebfe3473f5cb82'),
(9, 12, '4abf1b217f1234612ff43b5864034076676df696d1a9280dd9937f977359a6f4', '3ff0796c842bc9dafe8aa952df6899b70d26cac2cfd82d487387bbc62176a5df'),
(10, 12, '6a7ea4569cf16626977433b8dbcf7c0d9c73f8b5e2a0e26b72536d6e6b73345a', '76a4f9f2071181ab102701b3093f296947f23cc656da5a71a70f5f3cee7a84d6'),
(11, 13, 'c3f15eb72f979f6faeb6d4bf74752063a05e684639229fc0350a2e3b8052c545', 'fbf33369a35d05ec884b1deb98067043d98acc8adb0be073ab1cca4037e0e125'),
(12, 13, '8ab2ce78e25959371960e1d44b91867d47633421c4433e2df9bc6366b06b72f7', '867a48a96b3f3e44b182f8b9b471e2dec5cd2641a40ca4ba20a5345cbdc6850d'),
(13, 14, '129454cc202fd87e5e89345e7d24638d', '624a40b46fc13304f5e3efa9621e342ce4fd013e8aed443af6b08f84c7bc8689d941ff0a098fd3fbcce4d9e2e3cb3cb52315bfe5457cbb9cbf95aeb21eead301d128979b7bb5df3768283b59c8688fd2742487cf475d45a58b56bab8ba2d608b');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `email` text COLLATE utf8mb4_general_ci NOT NULL,
  `password` text COLLATE utf8mb4_general_ci NOT NULL,
  `nama` text COLLATE utf8mb4_general_ci NOT NULL,
  `nohp` text COLLATE utf8mb4_general_ci NOT NULL,
  `alamatweb` text COLLATE utf8mb4_general_ci NOT NULL,
  `tempatlahir` text COLLATE utf8mb4_general_ci NOT NULL,
  `tanggallahir` text COLLATE utf8mb4_general_ci NOT NULL,
  `kk` text COLLATE utf8mb4_general_ci NOT NULL,
  `ktp` text COLLATE utf8mb4_general_ci NOT NULL,
  `foto` text COLLATE utf8mb4_general_ci NOT NULL,
  `is_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `nama`, `nohp`, `alamatweb`, `tempatlahir`, `tanggallahir`, `kk`, `ktp`, `foto`, `is_admin`) VALUES
(6, 'ba0b21815087b878372bcc1fa5cd6a8a', '$2b$10$QOUdHmfbXp70TDuo/KRGXuDi5xT5nsM/bIkvH6C3xa3JRx8QrIETW', 'de729588b71494c67d5a800ca88b08d6', 'c71695600f1b7a85c0682d0ddbfe03ee', '449ddcadf6ae9b349ea533e7db9a4bd45b67b1768c9a56826e9ba6a088a65ac0', '30a91ac09243589ff2ebf71bfc55af13d1f17d32a19b3cb06c6ca9c9f1a9f91b', 'aec82bacd3991761dde9aa921c05ec4212da70b8ad163bae6bfeb59cb44d496fb09ba5ef9088fdffe3ef055134bbd48d27a452afca9a8fcd8884acc4632b11d7', '82e5fef5b279281432ba5a10fb37523c443e465b6d23330caec58af1278f9575', 'd47f483fb3eb3eb1b94bc46b47418eee64037e5dcae23d3251435ee27b0c3566', 'afab2810c4dc5652c747b4c9d5d448e18a47db1d2835dca9808121a5c9d236a3734d846db0ab60d6a1d48a9de5e801f9', 1),
(7, '12615a395be260e6ee4bbb6a4814bd2b', '$2b$10$Ww3Wlu2BbNy6v01i.THbsei1BQqBcbthf6W6msQWz/L0CmwupphR6', '757924d093a67688aa8422ae9fec0ff36eddd4ff850ed0b8cea6049b1a28601a', '70d72ecbc90b0ee1cfac43df42752c61', '449ddcadf6ae9b349ea533e7db9a4bd45b67b1768c9a56826e9ba6a088a65ac0', 'b20ff6166ca08f14632880e6a62b0e366c1dc283de98d56405281f298486ed61', '3b382c6b05a7928c09e45ddaa985ab471c85a634d359fdbd30aaee4273cdf4e9b98a3792b28e4626e2b69de3cb4290ec55a59ced1ffc57e14c82beac66e92839', '82e5fef5b279281432ba5a10fb37523c443e465b6d23330caec58af1278f9575', 'd47f483fb3eb3eb1b94bc46b47418eee64037e5dcae23d3251435ee27b0c3566', '3c18048e649b0b708814eebd10532bdfe89d58b32a735ddc4e623301e3641d65cff76230b8a80f8cf74ee304194710c5dcd08bdff52c710350e9271109cb7736', 0),
(8, 'e3869cc6660ddfb6c20cea24ffcc5f661454828c7b56bd092b338fd800f59dab', '$2b$10$9knQrrM81v2wUFRygIOZY.kx3P1LiQdHAUcCcqOZkexokR.cuja7u', '99ccba3a10bd8317e72fca5ba18000e48ae3665cde3cebf550508ec68e03e162', '65b751ddfe92fb50a2c1f3450ac03dfa', '449ddcadf6ae9b349ea533e7db9a4bd45b67b1768c9a56826e9ba6a088a65ac0', 'ff7f15ae92ee880ef9664e1cabbad1869e0bcf500a0589ef3fd931f7dc1e552e', '03146fe7ed3926cd7b4d8266a6ebaff8de8662cda534b4af1841e5c5428ed357c1b41262bc0671eaba1eadfa46e6478578986d5b7b81f8616bda54fbef631ea5', '82e5fef5b279281432ba5a10fb37523c443e465b6d23330caec58af1278f9575', 'd47f483fb3eb3eb1b94bc46b47418eee64037e5dcae23d3251435ee27b0c3566', 'e2cfc8afdb9f1ec527faefc7eae45adbdde29d67fd83a8a37439ae339e15d587b7ad74fe1c3be112dd95a7eaa276772d', 0),
(9, 'de92f9d617a683aa460fdb5a9525d415f8c07090be4dc5ae5ea6300cca78398e', '$2b$10$/t4Unrx6GGXvm9H0MGnHf.ec/rjzrGFwOtrgJSBv4u0p8.4qo51ii', '319e6ef9a157c6205d4204ebdefc56f548879ac5f413209e9fb5d2b7c4dc67ed', '41d95316bc19b883945ab0a009a44602', '449ddcadf6ae9b349ea533e7db9a4bd45b67b1768c9a56826e9ba6a088a65ac0', '3e175751b55870c948f4d6cb6b0fe0594deaec66e0cec6c40f93b9c6dda31e67', '9e0867c69193ca88a7313efe630280f5873741c84e1fefbef57823b7450b38e1d57c4dcc8fd43483f472646d5c1095e08e5e7ca3e131b45f4303f5f31526f191', '82e5fef5b279281432ba5a10fb37523c443e465b6d23330caec58af1278f9575', 'd47f483fb3eb3eb1b94bc46b47418eee64037e5dcae23d3251435ee27b0c3566', 'ba4c039ba5d962dfd1aa558cb7717da66c830442aab7cf81b354fdb7de6ad8a0fc3913f0591062c86c101d9976c653e3', 0),
(10, '3db3b2ef9d78e78da95dac846b5de1970e6a818c7f66b6052eced13a712dcae9', '$2b$10$3w0noJD2dOQiL/rhl2mjSuq4QJuTTA57fq6fslMmR4x8Xn7FqJlky', '9dda9bbf8bd16c303fe2a86662c974fc44e9ef3a2bb7fdb11becfb002c96e92b', '9c792b8a6f419abe9222dd320923cda3', '449ddcadf6ae9b349ea533e7db9a4bd45b67b1768c9a56826e9ba6a088a65ac0', 'a0ae54c69fd2ce04e0114722dcbaebbf9ae3ae9186889d1df2030f23825fb0f7', 'c40ed8307df3385521c26cfac4031f1c910a6752ddc1ba67fc26f0547c4871fa0a9dd26417ca5f058382ab09a35fc21d7322118559aee7b3de5eeee11855edbc', '82e5fef5b279281432ba5a10fb37523c443e465b6d23330caec58af1278f9575', 'ee47abbdf46d78dc0a41d7c2cea5393873e6b63f0fe91e9eb72b83b501bc86bf', 'bb022f7e2f4fe718364ff3846951f9f27137d86e3aa5ad0d444ede3bba2cdb98297a4d90252f0a28e6cd8e428ddc8f10', 0),
(11, '0a34b97b9544112e9f4501d3d9863e472a5037b2dd6f1d3f324a29bdd2476343', '$2b$10$OL5DOYMvg3ZVr8ur5E93D.zRdDfA9twcAXyUYr43wp6S2q0SHGbEG', '72d723ff06a0593cae06a53e1028f22a8ac00a596936e1b070c04efa94039a3b', '41d95316bc19b883945ab0a009a44602', '449ddcadf6ae9b349ea533e7db9a4bd45b67b1768c9a56826e9ba6a088a65ac0', '0ec3474498c42ae8b8e0db9827c671f797949ba8458051cf8cf3316818d6d4d9', '8be72c74cd4992d0b3893f4e157f76ab5cffb197bb28bb2426f0c0de19856556766db99f8b10b2026d2947432f0facd37867fddc0ce67ad5ea27862b1c23188e', '82e5fef5b279281432ba5a10fb37523c443e465b6d23330caec58af1278f9575', '82e5fef5b279281432ba5a10fb37523c443e465b6d23330caec58af1278f9575', '4efc3c129e0d6b3dc923c154eeb37f3d98647f50f298a611e7a37909c0dce2eaaff549f8709412402abd24f16bae19ff', 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_membership`
--

CREATE TABLE `user_membership` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `membership_id` int NOT NULL,
  `status` enum('pending','paid','failed','cancelled') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `order_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_membership`
--

INSERT INTO `user_membership` (`id`, `user_id`, `membership_id`, `status`, `order_id`, `transaction_id`) VALUES
(26, 7, 12, 'paid', '0811dadbf874b3dc245cdf909373389bce62ebdd74d7c603555f850d209ff7cb', '14e523d568b7c4a47d0d8ef2836320adc095cd386fa3bba971b3b03dc0df26662c1462aa78673416e4641648abc3645ce80f6ccc492711330d29455bd679ffc76638207a9703ef7fa56459dc5fa43f9187692d779f2a49314f9c72262c76748c'),
(27, 7, 14, 'paid', '30f6b979e35a307fa75547ea45a2e3d1ffcc120c1f0ce374bf9eb8650ef2a26a', '14e523d568b7c4a47d0d8ef2836320adc095cd386fa3bba971b3b03dc0df26662c1462aa78673416e4641648abc3645c003786aea548cfd0f17986dfc046810d03eb52950326c0ac60cae7c7c9d025431f76466eaa31984b5f45d87e8633bb53'),
(28, 7, 15, 'pending', '8823311ab028d4d88f8525e750299140ee7ef92bef76189aaa0d0116bbd64055', '14e523d568b7c4a47d0d8ef2836320adc095cd386fa3bba971b3b03dc0df26662c1462aa78673416e4641648abc3645cf4eb3e7ca4a7f4374eb693d804ae780aff1ff085ca1e72ae891e4d37ed2ecb63cc93d68c04ce3217b3011c6baa477ff8');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `img_content`
--
ALTER TABLE `img_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_content_id` (`content_id`);

--
-- Indexes for table `membership`
--
ALTER TABLE `membership`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `membership_content`
--
ALTER TABLE `membership_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_membership_id` (`membership_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_membership`
--
ALTER TABLE `user_membership`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_membership_ibfk_1` (`user_id`),
  ADD KEY `user_membership_ibfk_2` (`membership_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `img_content`
--
ALTER TABLE `img_content`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `membership`
--
ALTER TABLE `membership`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `membership_content`
--
ALTER TABLE `membership_content`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_membership`
--
ALTER TABLE `user_membership`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `img_content`
--
ALTER TABLE `img_content`
  ADD CONSTRAINT `fk_content_id` FOREIGN KEY (`content_id`) REFERENCES `membership_content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `membership_content`
--
ALTER TABLE `membership_content`
  ADD CONSTRAINT `fk_membership_id` FOREIGN KEY (`membership_id`) REFERENCES `membership` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_membership`
--
ALTER TABLE `user_membership`
  ADD CONSTRAINT `user_membership_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_membership_ibfk_2` FOREIGN KEY (`membership_id`) REFERENCES `membership` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
