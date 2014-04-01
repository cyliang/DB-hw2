<?php
require 'include/DB.php';
require 'include/login.php';

$db = new DB();
$login = new Login($db);

$login->check();

echo json_encode(array("status" => ($login->connect_FB($_POST['fb']) ? "success" : "fail")));
?>
