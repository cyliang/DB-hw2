<?php
require 'include/DB.php';
require 'include/flight.php';
require 'include/login.php';

$login = new Login();
$login->check(true);

$db = new DB();
$flight = new Flight($db);

if(!isset($_POST['id'], $_POST['number'], $_POST['departure'], $_POST['destination'], $_POST['departure_date'], $_POST['arrival_date'], $_POST['price']) || $_POST['number'] == "" || $_POST['departure'] == "" || $_POST['destination'] == "" || $_POST['arrival_date'] == "" || $_POST['departure_date'] == "" || $_POST['price'] == "") {
	die(json_encode(array("status" => "miss_arguments")));
}

if(strpos($_POST['number'].$_POST['departure'].$_POST['destination'], ' ') !== false) {
	die(json_encode(array("status" => "contain_space")));
}

echo json_encode(array("status" => ($flight->edit($_POST) ? "success" : "fail")));
?>
