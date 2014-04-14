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
}
?>
