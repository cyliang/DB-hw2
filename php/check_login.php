<?php
require 'include/login.php';
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$login = new Login();
echo "retry: 5000" . PHP_EOL;
echo "data: " . $login . PHP_EOL . PHP_EOL;
flush();
?>
