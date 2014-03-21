<?php
require 'include/DB.php';
require 'include/login.php';

$db = new DB();
$login = new Login($db);

if(!$login->check()) {
	die("not_login");
}

echo $login->connect_FB($_POST['fb']) ? "success" : "fail";
?>
