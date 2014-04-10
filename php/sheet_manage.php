<?php
require 'include/DB.php';
require 'include/flight.php';
require 'include/login.php';

$db = new DB();
$login = new Login($db);
$id = $login->check();

$flight = new Flight($db);

switch($_POST['funct']) {
case "add":
	if(!isset($_POST['name'])) {
		die(json_encode(array('status' => 'miss_arguments')));
	}

	echo json_encode(array(
		'status' => ($flight->add_sheet($id, $_POST['name']) ? "success" : "fail")
	));
	break;
case "list":
	echo json_encode(array(
		'status' => "success",
		'data' => $flight->list_sheet($id)
	));
	break;
case "insert_able":
	if(!isset($_POST['id'])) {
		die(json_encode(array('status' => 'miss_arguments')));
	}

	echo json_encode(array(
		'status' => 'success',
		'data' => $flight->check_sheet_able($id, $_POST['id'])
	));
	break;
}
?>
