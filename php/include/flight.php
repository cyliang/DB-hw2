<?php
class Flight {
	private $db;

	public function __construct($db) {
		$this->db = $db;
	}

	public function add($flight_info) {
		$stat = $this->db->prepare("INSERT INTO `flight_flight` (`flight_number`, `departure`, `destination`, `departure_date`, `arrival_date`, `ticket_price`)
						VALUES ( :no , :from , :to , :fromtime , :totime , :price );");
		$stat->execute(array(
			':no' => filter_var($flight_info['number'], FILTER_SANITIZE_SPECIAL_CHARS),
			':from' => filter_var($flight_info['departure'], FILTER_SANITIZE_SPECIAL_CHARS),
			':to' => filter_var($flight_info['destination'], FILTER_SANITIZE_SPECIAL_CHARS),
			':fromtime' => $flight_info['departure_date'],
			':totime' => $flight_info['arrival_date'],
			':price' => $flight_info['price']
		));

		return $stat->rowCount() === 1;
	}

	public function add_sheet($user_id, $name) {
		$stat = $this->db->prepare("INSERT INTO `flight_compare_name` (`user_id`, `name`) VALUES ( :uid , :name );");
		$stat->execute(array(
			':uid' => $user_id,
			':name' => filter_var($name, FILTER_SANITIZE_SPECIAL_CHARS)
		));

		return $stat->rowCount() === 1;
	}

	public function list_sheet($id) {
		$stat = $this->db->prepare("SELECT `id`, `name` FROM `flight_compare_name` WHERE `user_id` = ? ;");
		$stat->execute(array($id));

		return $stat->fetchAll(PDO::FETCH_ASSOC);
	}

	public function check_sheet_able($id, $flight_id) {
		$stat = $this->db->prepare("SELECT `flight_compare_name`.`id` FROM 
						`flight_compare_name` INNER JOIN `flight_compare_content` 
						ON `flight_compare_name`.`id` = `flight_compare_content`.`sheet_id` 
						WHERE `flight_compare_name`.`user_id` = :uid AND `flight_compare_content`.`flight_id` = :fid ;");
		$stat->execute(array(
			':uid' => $id,
			':fid' => $flight_id
		));
		return $stat->fetchAll(PDO::FETCH_COLUMN | PDO::FETCH_UNIQUE, 0);
	}

	public function insert_sheet($flight_id, $sheet_ids) {
		$stat = $this->db->prepare("INSERT INTO `flight_compare_content` (`sheet_id`, `flight_id`)
					VALUES ( :sid , :fid );");

		$success_count = 0;
		foreach($sheet_ids as $id) {
			$stat->execute(array(
				':sid' => $id,
				':fid' => $flight_id
			));
			$success_count += $stat->rowCount();
		}

		return $success_count == count($sheet_ids);
	}
	
	public function edit($flight_info) {
		$stat = $this->db->prepare("UPDATE `flight_flight` SET `flight_number` = :no , `departure` = :from , 
			`destination` = :to , `departure_date` = :fromtime , `arrival_date` = :totime , `ticket_price` = :price WHERE `id` = :id ;");
		$stat->execute(array(
			':id' => $flight_info['id'],
			':no' => filter_var($flight_info['number'], FILTER_SANITIZE_SPECIAL_CHARS),
			':from' => filter_var($flight_info['departure'], FILTER_SANITIZE_SPECIAL_CHARS),
			':to' => filter_var($flight_info['destination'], FILTER_SANITIZE_SPECIAL_CHARS),
			':fromtime' => $flight_info['departure_date'],
			':totime' => $flight_info['arrival_date'],
			':price' => $flight_info['price']
		));
		
		return true;
	}
	
	public function delete($id) {
		$stat = $this->db->prepare("DELETE FROM `flight_flight` WHERE `id` = ? ;");
		$stat->execute(array($id));
		
		return $stat->rowCount() === 1;
	}

	public function get_page($page_no, $options = array()) {
		$order = (isset($options['descend']) && $options['descend'] === true) ? "DESC" : "ASC";
		$sort = (isset($options['sort']) && $options['sort'] == 'date') ? "departure_date" : "id";
		$limit = isset($options['limit']) ? $options['limit'] : 10;

		$stat = $this->db->prepare("SELECT * FROM `flight_flight` ORDER BY `{$sort}` {$order} LIMIT :pos , :rows ;");
		$stat->bindValue(":pos", ($page_no - 1) * 10, PDO::PARAM_INT);
		$stat->bindValue(":rows", $limit, PDO::PARAM_INT);
		$stat->execute();

		return $stat->fetchAll(PDO::FETCH_ASSOC);
	}
	
	public function get_page_count() {
		return ceil($this->db->query("SELECT COUNT(*) FROM `flight_flight` ;")->fetchColumn() / 10);
	}
}
?>
