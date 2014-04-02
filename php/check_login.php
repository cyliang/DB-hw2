<?php
require 'include/login.php';
require 'include/DB.php';
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');


$db = new DB();
$login = new Login($db);
echo "retry: 5000" . PHP_EOL;
echo "data: " . $login . PHP_EOL . PHP_EOL;
flush();
?>
