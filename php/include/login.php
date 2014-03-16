<?php
require 'lib/password.php';

class User {
	public $id;
	public $name;
	public $email;
	public $password;
	public $is_admin;
	public $account;
}

class Login {
	// Session:
	//		login
	//		login_id
	//		login_admin
	private $is_login;
	private $login_id;
	private $is_admin;
	private $db;

	public function __construct($set_db = null) {
		$this->db = $set_db;
		session_start();
		
		if(isset($_SESSION['login']) && $_SESSION['login'] == 'yes' && isset($_SESSION['login_id']) && isset($_SESSION['login_admin'])) {
			$this->is_login = true;
			$this->is_admin = $_SESSION['login_admin'];
			$this->login_id = $_SESSION['login_id'];
		} else {
			$this->is_login = false;
			$this->login_id = null;
			$_SESSION['login'] = 'no';
			unset($_SESSION['login_id']);
			unset($_SESSION['login_admin']);
		}
	}
	
	public static function regist($user, $db) {
		$stat = $db->prepare('INSERT INTO `flight_user` (`account`, `password`, `name`, `email`, `is_admin`) 
					VALUES ( :username , :password , :name , :email , :admin );');
		$stat->execute(array(
			':username' => $user['username'],
			':name' => $user['name'],
			':email' => $user['email'],
			':admin' => ($user['admin'] == 'yes' ? 1 : 0),
			':password' => password_hash($user['password'].$user['username'], PASSWORD_DEFAULT)
		));

		return $stat->rowCount() === 1;
	}
	
	public function check_login() {
		return ($this->is_login ? $login_id : false);
	}
	
	public function logout() {
		$_SESSION['login'] = 'no';
		unset($_SESSION['login_id']);
		unset($_SESSION['login_admin']);
		$this->is_login = false;
		$this->login_id = null;
		$this->is_admin = null;
	}
	
	public function __invoke($username, $password) {
		if($this->db === null) {
			die("DB is not set!");
		}
		$this->logout();
		
		$stat = $this->db->prepare('SELECT `id`, `name`, `email`, `password`, `is_admin`
									FROM `flight_user` WHERE `account` = ? ;');
		$stat->execute(array($username));
		if(($user_obj = $stat->fetchObject("User")) && password_verify($password, $user_obj->password) {
			unset($user_obj->password);
			$_SESSION['login'] = 'yes';
			$_SESSION['login_id'] = $user_obj->id;
			$_SESSION['login_admin'] = $user_obj->is_admin ? 'yes' : 'no';
			
			return $user_obj;
		} else {
			return false;
		}
	}
}
?>