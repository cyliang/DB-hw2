<?php
require 'include/DB.php';
require 'include/flight.php';
require 'include/login.php';

$db = new DB();
$login = new Login($db);

$login->check();

$flight = new Flight($db);

$col_table = array("id", "flight_number", "departure", "departure_date", "destination", "arrival_date", "price");

if(isset($_POST['search_col'], $_POST['search_txt']) && in_array($_POST['search_col'], $col_table)) {
	$search_col = $_POST['search_col'];
	$search_txt = $_POST['search_txt'];
} else {
	$search_col = null;
	$search_txt = null;
}

if(isset($_POST['sort_col']) && in_array($_POST['sort_col'], $col_table)) {
	$sort_col = $_POST['sort_col'];
} else {
	$sort_col = null;
}

echo json_encode(array(
	'status' => 'success',
	'page_count' => $flight->get_page_count($_POST['sheet'], $search_col, $search_txt),
	'data' => $flight->get_page(
		$_POST['sheet'],
		isset($_POST['page']) ? $_POST['page'] : 1, 
		$sort_col,
		(isset($_POST['sort_ord1']) && $_POST['sort_ord1'] == 'ASC') ? "ASC" : "DESC",
		(isset($_POST['sort_ord2']) && $_POST['sort_ord2'] == 'ASC') ? "ASC" : "DESC",
		$search_col,
		$search_txt
	)
));
?>
