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
	//		login_name
	//		login_email
	//		login_account
	private $is_login;
	private $login_user;
	private $db;

	public function __construct($set_db = null) {
		$this->db = $set_db;
		session_start();
		
		if(isset($_SESSION['login']) && $_SESSION['login'] == 'yes' && 
			isset($_SESSION['login_id'], $_SESSION['login_admin'], $_SESSION['login_name'], $_SESSION['login_email'], $_SESSION['login_account'])) {
			$this->is_login = true;
			
			$this->login_user = new User();
			$this->login_user->is_admin = $_SESSION['login_admin'];
			$this->login_user->id = $_SESSION['login_id'];
			$this->login_user->name = $_SESSION['login_name'];
			$this->login_user->email = $_SESSION['login_email'];
			$this->login_user->account = $_SESSION['login_account'];
			unset($this->login_user->password);
		} else {
			$this->logout();
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
	
	public function __toString() {
		return json_encode($this->is_login ? array('login' => 'yes', 'user' => $this->login_user) : array('login' => 'no'));
	}

	public function check($check_admin = false) {
		return $this->is_login && (!$check_admin || $this->login_user->is_admin);
	}
	
	public function logout() {
		$this->is_login = false;
		$this->login_user = null;
		$_SESSION['login'] = 'no';
		unset($_SESSION['login_id'], $_SESSION['login_admin'], $_SESSION['login_name'], $_SESSION['login_email'], $_SESSION['login_account']);
	}
	
	public function __invoke($username, $password) {
		if($this->db === null) {
			die("DB is not set!");
		}
		$this->logout();
		
		$stat = $this->db->prepare('SELECT `id`, `name`, `email`, `password`, `is_admin`, `account`
									FROM `flight_user` WHERE `account` = ? ;');
		$stat->execute(array($username));
		if(($this->login_user = $stat->fetchObject("User")) && password_verify($password.$username, $this->login_user->password)) {
			unset($this->login_user->password);
			$this->is_login = true;
			$_SESSION['login'] = 'yes';
			$_SESSION['login_id'] = $this->login_user->id;
			$_SESSION['login_admin'] = $this->login_user->is_admin;
			$_SESSION['login_name'] = $this->login_user->name;
			$_SESSION['login_email'] = $this->login_user->email;
			$_SESSION['login_account'] = $this->login_user->account;
			
			return true;
		} else {
			$this->login_user = null;
			return false;
		}
	}
}
?>
