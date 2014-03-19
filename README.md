DB-hw2
======

資料庫的homework2 - 航班系統

安裝方式 - Installation
=======================

系統需求 - Requirement
----------------------

使用者端：
- 最新版的Google Chrome/Chromium或Opera瀏覽器（若使用IE或Safari將有部分功能無法使用！）

伺服器端：
- 夠新的網頁伺服器(Ex: `Apache2`, `Nginx`, `IIS`...)
- PHP 5.3以上的版本
- PHP的網頁伺服器module
- MySQL或其他PDO可支援的資料庫Server

資料庫設定 - Config Database
----------------------------

利用下列SQL指令在MySQL資料庫中建立table `flight_user` 與 `flight_flight` ：
```SQL
CREATE TABLE `flight_flight` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `flight_number` varchar(255) NOT NULL,
  `departure` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `departure_date` datetime NOT NULL,
  `arrival_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `flight_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL COMMENT 'True for admin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`)
) ;
```
並在`php/include/secret/DB_account.php`裡設定資料庫的host、user、driver、name、password等等後，透過網頁伺服器在瀏覽器上打開index.html即可使用。

使用說明 - Usage
================

使用者制度
----------

用戶需以姓名、Email註冊一個帳號方可使用，其中在註冊頁面時可自由選擇成為管理員或一般使用者。
- 一般使用者只能檢視航班資料。
- 管理員需管理航班資料，因此擁有新增、更改、刪除航班的權限。

功能
----

目前尚只有航班檢視、管理的功能，首頁及使用者設定尚未完成。

Library Dependencies
====================

- [Password_compat](https://github.com/ircmaxell/password_compat), which provides forward compatibility with the password_* functions being worked on for PHP 5.5.
- [jQuery](http://jquery.com/), a fast, small, and feature-rich JavaScript library.
- [IcoMoon](http://icomoon.io/), an icon solution, providing three main services: Vector Icon Packs, The IcoMoon App, and font hosting.
 
參考資料 - Reference
====================

- [PHP Reference](http://www.php.net/manual/en/funcref.php)
- [jQuery API Documentaion](http://api.jquery.com/)
- [W3Schools](http://www.w3schools.com/)
