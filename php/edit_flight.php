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

if(!isset($_POST['id'], $_POST['number'], $_POST['departure'], $_POST['destination'], $_POST['departure_date'], $_POST['arrival_date'])) {
	die("miss_arguments");
}

echo $flight->edit($_POST) ? "success" : "fail";
?>