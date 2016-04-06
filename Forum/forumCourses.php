<?php
require_once(dirname(__FILE__) . '../Shared/database.php');

function getCourseName($courseid)
{
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	$query = $pdo->prepare("SELECT distinct coursename FROM course ");

	if($query->execute() && $query->rowCount() > 0) {
		$course = $query->fetch();
		echo $course["coursename"];
		return $course["coursename"];
	} else {
		return false;
	}
}
?>