<?php
require 'include/login.php';
require 'include/DB.php';

$db = new DB();
$login = new Login($db);

$login->check(true);

function result($success) {
	echo json_encode($success === true ? array("status" => "success") : array("status" => "fail"));
}

switch($_POST['funct']) {
case "del":
	result(isset($_POST['id']) && $login->delete($_POST['id']));
	break;
}

?>
