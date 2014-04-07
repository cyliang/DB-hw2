<?php
require 'include/DB.php';
require 'include/login.php';

$db = new DB();
$login = new Login($db);

$login->check(true);

echo json_encode(array(
	'status' => 'success',
	'page_count' => $login->list_page_count(),
	'data' => $login->list_page(
		isset($_POST['page']) ? $_POST['page'] : 1
	)
));
?>
