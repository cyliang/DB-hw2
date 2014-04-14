<?php
require 'include/DB.php';
require 'include/airport.php';
require 'include/login.php';

$db = new DB();
$login = new Login($db);

$login->check(true);

$airport = new Airport($db);

switch($_POST['funct']) {
case 'list':
	echo json_encode(array(
		'status' => 'success',
		'page_count' => $airport->get_page_count(),
		'data' => $airport->get_page(
			isset($_POST['page']) ? $_POST['page'] : 1 
		)
	));
	break;
case 'add':
	if(!isset($_POST['name'], $_POST['longitude'], $_POST['latitude']) || 
		$_POST['name'] == "" || $_POST['longitude'] == "" || $_POST['latitude'] == "") {
		die(json_encode(array('status' => "miss_arguments")));
	}

	if(strpos($_POST['name'], ' ') !== false) {
		die(json_encode(array('status' => "contain_space")));
	}

	echo json_encode(array('status' => ($airport->add($_POST) ? "success" : "fail")));
	break;
case 'delete':
	if(!isset($_POST['id'])) {
		die(json_encode(array("status" => "miss_arguments")));
	}

	echo json_encode(array("status" => ($airport->delete($_POST['id']) ? "success" : "fail")));
	break;
case 'edit':
	if(!isset($_POST['id'], $_POST['name'], $_POST['longitude'], $_POST['latitude']) || 
		$_POST['id'] == "" || $_POST['name'] == "" || $_POST['longitude'] == "" || $_POST['latitude'] == "") {
		die(json_encode(array("status" => "miss_arguments")));
	}

	if(strpos($_POST['name'], ' ') !== false) {
		die(json_encode(array('status' => "contain_space")));
	}

	echo json_encode(array("status" => ($airport->edit($_POST) ? "success" : "fail")));
	break;
case 'all':
	echo json_encode(array(
		"status" => "success",
		"data" => $airport->list_all()
	));
	break;
default:
	echo json_encode(array("status" => "fail"));
	break;
}
?>
