<?php
require 'include/login.php';

$login = new Login();
$login->logout();

echo json_encode(array("status" => "success"));
?>
