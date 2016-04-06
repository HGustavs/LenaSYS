<?php
require_once(dirname(__FILE__) . '/../Shared/database.php');

	echo"<p style ='color: black'>hej</p>";
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	$query = $pdo->prepare("SELECT distinct coursename FROM course ");
	if($query->execute() && $query->rowCount() > 0) {
		for($i=0; $i<$query->rowCount(); $i++){
			$course = $query->fetch();
			echo $course["coursename"];
			echo"<br/>";
		}
	} else {

	}
?>