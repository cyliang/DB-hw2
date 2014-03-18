<?php
require 'include/DB.php';
require 'include/flight.php';
require 'include/login.php';

$login = new Login();

if(!$login->check()) {
	die(json_encode(array('status' => 'not_login')));
}

$db = new DB();
$flight = new Flight($db);

echo json_encode(array(
	'status' => 'OK',
	'page_count' => $flight->get_page_count(),
	'data' => $flight->get_page(
		isset($_POST['page']) ? $_POST['page'] : 1, 
		isset($_POST['sortby']) ? array('sort' => $_POST['sortby']) : array()
	)
));
?>
