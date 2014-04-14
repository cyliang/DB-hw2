<?php
class Airport {
	private $db;

	public function __construct($db) {
		$this->db = $db;
	}

	public function add($airport_info) {
		$stat = $this->db->prepare("INSERT INTO `flight_airport` (`name`, `longitude`, `latitude`)
						VALUES ( :name , :long , :lat );");
		$stat->execute(array(
			':name' => filter_var($flight_info['name'], FILTER_SANITIZE_SPECIAL_CHARS),
			':long' => $flight_info['longitude'],
			':lat' => $flight_info['latitude']
		));

		return $stat->rowCount() === 1;
	}

	public function edit($airport_info) {
		$stat = $this->db->prepare("UPDATE `flight_airport` SET `name` = :name , `longitude` = :long , 
						`latitude` = :lat WHERE `id` = :id ;");
		$stat->execute(array(
			':id' => $airport_info['id'],
			':name' => filter_var($airport_info['name'], FILTER_SANITIZE_SPECIAL_CHARS),
			':long' => $flight_info['longtitude'],
			':lat' => $flight_info['latitude']
		));
		
		return true;
	}
	
	public function delete($id) {
		$stat = $this->db->prepare("DELETE FROM `flight_airport` WHERE `id` = ? ;");
		$stat->execute(array($id));
		
		return $stat->rowCount() === 1;
	}

	public function get_page($page_no) {
		$limit = 10;
		$stat = $this->db->prepare("SELECT * FROM `flight_airport` LIMIT :pos , :rows ;");

		$stat->bindValue(":pos", ($page_no - 1) * 10, PDO::PARAM_INT);
		$stat->bindValue(":rows", $limit, PDO::PARAM_INT);
		$stat->execute();

		return $stat->fetchAll(PDO::FETCH_ASSOC);
	}
	
	public function get_page_count() {
		$count = $this->db->query("SELECT COUNT(*) FROM `flight_airport` ;")->fetchColumn();
		return ceil($count / 10);
	}
}
?>
