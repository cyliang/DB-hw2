<?php
require 'include/DB.php';
require 'include/flight.php';
require 'include/login.php';

$db = new DB();
$login = new Login($db);

$login->check();

$flight = new Flight($db);

echo json_encode(array(
	'status' => 'success',
	'page_count' => $flight->get_page_count($_POST['sheet']),
	'data' => $flight->get_page(
		$_POST['sheet'],
		isset($_POST['page']) ? $_POST['page'] : 1, 
		isset($_POST['sortby']) ? array('sort' => $_POST['sortby']) : array()
	)
));
?>
