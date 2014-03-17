<?php
require 'include/DB.php';
require 'include/login.php';

$db = new DB();
$login = new Login($db);
$login($_POST['username'], $_POST['password']);

echo $login;
?>