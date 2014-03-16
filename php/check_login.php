<?php
require 'include/login.php';
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$login = new Login();
$id = $login->check_login();
echo "data: " . (id === false ? "no" : id) . PHP_EOL . PHP_EOL
flush();
?>