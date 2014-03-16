<?php
class Login {
	private $is_login;
	private $login_id;
	private $db;

	public function __construct($set_db = null) {
		$this->db = $set_db;
		session_start();
		
		if(isset($_SESSION['login']) && $_SESSION['login'] == 'yes' && isset($_SESSION['login_id'])) {
			$this->is_login = true;
			$this->login_id = $_SESSION['login_id'];
		} else {
			$this->is_login = false;
			$this->login_id = null;
			$_SESSION['login'] = 'no';
			if(isset($_SESSION['login_id'])) {
				unset($_SESSION['login_id']);
			}
		}
	}
	
	public function check_login() {
		return ($this->is_login ? $login_id : false);
	}
}
?>