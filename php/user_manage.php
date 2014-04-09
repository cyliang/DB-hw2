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
case "upgrade":
	result(isset($_POST['id']) && $login->edit($_POST['id'], array("admin" => "yes")));
	break;
case "add":
	$alert_msg = "";

	if(strlen($_POST['name']) < 3) {
		$alert_msg .= '必須輸入正確姓名！\n';
	}

	if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
		$alert_msg .= '必須輸入正確Email！\n';
	}

	if(!preg_match("/^[A-Za-z0-9_]{6,}$/",$_POST['username'])) {
		$alert_msg .= '必須輸入正確使用者名稱！\n';
	}

	if(!preg_match("/.{8,}/",$_POST['password'])) {
		$alert_msg .= '必須輸入正確密碼！\n';
	}

	if($db->check_user_exist($_POST['username'])) {
		$alert_msg .= "使用者名稱{$_POST['username']}已經存在，請輸入其他使用者名稱！";
	}

	if($alert_msg === "" && Login::regist($_POST, $db)) {
		echo json_encode(array("status" => "success"));
	} else {
		die(json_encode(array("status" => "fail", "msg" => $alert_msg)));
	}
	break;
}

?>
