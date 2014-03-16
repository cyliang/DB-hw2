<?php
require 'include/DB.php';

$db = new DB();
echo ($db->check_user_exist($_POST['username']) ? "true" : "false");
?>