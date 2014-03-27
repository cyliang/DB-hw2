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

if(!isset($_POST['number'], $_POST['departure'], $_POST['destination'], $_POST['departure_date'], $_POST['arrival_date'], $_POST['price']) || $_POST['number'] == "" || $_POST['departure'] == "" || $_POST['destination'] == "" || $_POST['arrival_date'] == "" || $_POST['departure_date'] == "" || $_POST['price'] == "") {
	die("miss_arguments");
}

if(strpos($_POST['number'].$_POST['departure'].$_POST['destination'], ' ') !== false) {
	die("contain_space");
}

echo $flight->add($_POST) ? "success" : "fail";
?>