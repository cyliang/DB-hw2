<?php
require 'include/DB.php';
require 'include/flight.php';
require 'include/login.php';

$login = new Login();
$login->check(true);

$db = new DB();
$flight = new Flight($db);

if(!isset($_POST['id'])) {
	die(json_encode(array("status" => "miss_arguments")));
}

echo json_encode(array("status" => ($flight->delete($_POST['id']) ? "success" : "fail")));
?>
