<?php
require 'include/DB.php';
require 'lib/password.php';

$alert_msg = "";

if(strlen($_POST['name']) < 3) {
	$alert_msg .= '必須輸入正確姓名！\n';
}

if(!preg_match("/^[\w\-]+\@[\w\-]+\.[\w\-]+$/",$_POST['email'])) {
	$alert_msg .= '必須輸入正確Email！\n';
}

if(!preg_match("/^[A-Za-z0-9_]{6,}$/",$_POST['username'])) {
	$alert_msg .= '必須輸入正確使用者名稱！\n';
}

if(!preg_match("/.{8,}/",$_POST['password'])) {
	$alert_msg .= '必須輸入正確密碼！\n';
}

$db = new DB();

if($db->check_user_exist($_POST['username'])) {
	$alert_msg .= "使用者名稱{$_POST['username']}已經存在，請輸入其他使用者名稱！";
}

if($alert_msg !== "") {
	die("regist_fail('{$alert_msg}');");
}

$stat = $db->prepare('INSERT INTO `flight_user` (`account`, `password`, `name`, `email`, `is_admin`) 
					VALUES ( :username , :password , :name , :email , :admin );');
$stat->execute(array(
	':username' => $_POST['username'],
	':name' => $_POST['name'],
	':email' => $_POST['email'],
	':admin' => ($_POST['admin'] == 'yes' ? 1 : 0),
	':password' => password_hash($_POST['password'].$_POST['username'], PASSWORD_DEFAULT)
));

if($stat->rowCount() === 1) {
	echo "regist_success();";
} else {
	echo "regist_fail('發生錯誤，已通報系統管理員，請稍後再重試');";
}

?>