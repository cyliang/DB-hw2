<?php
require 'include/DB.php';
require 'include/flight.php';
require 'include/login.php';

$login = new Login();
if(!$login->check(true)) {
	die("not_admin");
}

$db = new DB();
$flight = new Flight($db);

if(!isset($_POST['id'])) {
	die("miss_arguments");
}

echo $flight->delete($_POST['id']) ? "success" : "fail";
?>