<?php
require 'lib/password.php';

class User {
	public $id;
	public $name;
	public $email;
	public $password;
	public $is_admin;
	public $account;
	public $FB_id;
}

class Login {
	// Session:
	//		login
	//		login_id
	//		login_admin
	//		login_name
	//		login_email
	//		login_account
	//		login_FB
	private $is_login;
	private $login_user;
	private $db;

	public function __construct($set_db = null) {
		$this->db = $set_db;
		session_start();
		
		if($this->db !== null && isset($_SESSION['login']) && $_SESSION['login'] == 'yes' && 
			isset($_SESSION['login_id'], $_SESSION['login_admin'], $_SESSION['login_name'], $_SESSION['login_email'], $_SESSION['login_account'], $_SESSION['login_FB'])) {
			$stat = $this->db->prepare('SELECT COUNT(*) FROM `flight_user` WHERE `id` = ?');
			$stat->execute(array($_SESSION['login_id']));

			if($stat->fetchColumn() == 1) {
				$this->is_login = true;
				
				$this->login_user = new User();
				$this->login_user->is_admin = $_SESSION['login_admin'];
				$this->login_user->id = $_SESSION['login_id'];
				$this->login_user->name = $_SESSION['login_name'];
				$this->login_user->email = $_SESSION['login_email'];
				$this->login_user->account = $_SESSION['login_account'];
				$this->login_user->FB_id = $_SESSION['login_FB'];
				unset($this->login_user->password);
			} else {
				$this->logout();
			}
		} else {
			$this->logout();
		}
	}
	
	public static function regist($user, $db) {
		$stat = $db->prepare('INSERT INTO `flight_user` (`account`, `password`, `name`, `email`, `is_admin`) 
					VALUES ( :username , :password , :name , :email , :admin );');
		$stat->execute(array(
			':username' => $user['username'],
			':name' => filter_var($user['name'], FILTER_SANITIZE_SPECIAL_CHARS),
			':email' => $user['email'],
			':admin' => (isset($user['admin']) && $user['admin'] == 'yes' ? 1 : 0),
			':password' => password_hash($user['password'].$user['username'], PASSWORD_DEFAULT)
		));

		return $stat->rowCount() === 1;
	}
	
	public function edit($id, $fields) {
		$field_ary = array();
		if($id === null) {
			$val_ary = array(':id' => $this->login_user->id);
		} else {
			$val_ary = array(':id' => $id);
		}
		
		if(isset($fields['name']) && $fields['name'] != "") {
			$field_ary[] = ('`name` = :name');
			$val_ary[':name'] = filter_var($fields['name'], FILTER_SANITIZE_SPECIAL_CHARS);
		}
		if(isset($fields['email']) && $fields['email'] != "") {
			$field_ary[] = ('`email` = :email');
			$val_ary[':email'] = $fields['email'];
		}
		if(isset($fields['password']) && $fields['password'] != "") {
			$field_ary[] = ('`password` = :pwd');
			$val_ary[':pwd'] = password_hash($fields['password'].$this->login_user->account, PASSWORD_DEFAULT);
		}
		if(isset($fields['admin'])) {
			$field_ary[] = ('`is_admin` = :admin');
			$val_ary[':admin'] = $fields['admin'] == "yes" ? 1 : 0;
		}
		
		$stat = $this->db->prepare("UPDATE `flight_user` SET ".join(" , ", $field_ary)." WHERE `id` = :id ;");
		$stat->execute($val_ary);
		
		return $stat->rowCount() === 1;
	}

	public function delete($id) {
		$stat = $this->db->prepare("DELETE FROM `flight_user` WHERE `id` = ? ;");
		$stat->execute(array($id));

		return $stat->rowCount() === 1;
	}

	public function list_page($page) {
		$stat = $this->db->prepare("SELECT `id`, `name`, `email`, `account`, `is_admin` FROM `flight_user` LIMIT :pos , 10;");
		$stat->bindValue(":pos", ($page - 1) * 10, PDO::PARAM_INT);
		$stat->execute();

		return $stat->fetchAll(PDO::FETCH_ASSOC);
	}

	public function list_page_count() {
		return ceil($this->db->query("SELECT COUNT(*) FROM `flight_user`;")->fetchColumn() / 10);
	}
	
	public function connect_FB($FB_id) {
		$stat = $this->db->prepare("UPDATE `flight_user` SET `FB_id` = ? WHERE `id` = ? ;");
		$stat->execute(array($FB_id, $this->login_user->id));

		$_SESSION['login_FB'] = $FB_id;
		return $stat->rowCount() === 1;
	}

	public function __toString() {
		return json_encode($this->is_login ? array('login' => 'yes', 'user' => $this->login_user) : array('login' => 'no'));
	}

	public function check($check_admin = false) {
		if(!$this->is_login) {
			die(json_encode(array("status" => "not_login")));
		}
		if($check_admin && !$this->login_user->is_admin) {
			die(json_encode(array("status" => "not_admin")));
		}

		return $this->login_user->id;
	}
	
	public function logout() {
		$this->is_login = false;
		$this->login_user = null;
		$_SESSION['login'] = 'no';
		unset($_SESSION['login_id'], $_SESSION['login_admin'], $_SESSION['login_name'], $_SESSION['login_email'], $_SESSION['login_account'], $_SESSION['login_FB']);
	}
	
	public function __invoke($username, $password) {
		$this->logout();
		
		$stat = $this->db->prepare('SELECT `id`, `name`, `email`, `password`, `is_admin`, `account`, `FB_id`
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
			$_SESSION['login_FB'] = $this->login_user->FB_id;
			
			return true;
		} else {
			$this->login_user = null;
			return false;
		}
	}
}
?>
