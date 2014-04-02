<?php
require 'include/DB.php';
require 'include/flight.php';
require 'include/login.php';

$db = new DB();
$login = new Login($db);
$login->check(true);

$flight = new Flight($db);

if(!isset($_POST['number'], $_POST['departure'], $_POST['destination'], $_POST['departure_date'], $_POST['arrival_date'], $_POST['price']) || $_POST['number'] == "" || $_POST['departure'] == "" || $_POST['destination'] == "" || $_POST['arrival_date'] == "" || $_POST['departure_date'] == "" || $_POST['price'] == "") {
	die(json_encode(array('status' => "miss_arguments")));
}

if(strpos($_POST['number'].$_POST['departure'].$_POST['destination'], ' ') !== false) {
	die(json_encode(array('status' => "contain_space")));
}

echo json_encode(array('status' => ($flight->add($_POST) ? "success" : "fail")));
?>
