<?php
require 'include/DB.php';
require 'include/flight.php';
require 'include/login.php';

$db = new DB();
$login = new Login($db);
$login->check(true);

$flight = new Flight($db);

if(!isset($_POST['id'])) {
	die(json_encode(array("status" => "miss_arguments")));
}

echo json_encode(array("status" => ($flight->delete($_POST['id']) ? "success" : "fail")));
?>
