<?php
class Flight {
	private $db;

	public function __construct($db) {
		$this->db = $db;
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
		return $this->db->query("SELECT COUNT(*) FROM `flight_flight` ;")->fetchColumn();
	}
}
?>
