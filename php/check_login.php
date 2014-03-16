<?php
require 'include/login.php';
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$login = new Login();
echo "data: " . $login . PHP_EOL . PHP_EOL;
flush();
?>