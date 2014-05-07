<?php
require_once('../Shared/database.php');
//---------------------------------------------------------------------------------------------------------------
// courseexists - Checks if a cerain course exists or not
//---------------------------------------------------------------------------------------------------------------
function courseexists($coursename)
{
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	if(is_string($coursename)) {
		$coursename = getCourseId($coursename);
	}

	$query = $pdo->prepare('SELECT COUNT(cid) FROM course WHERE cid=:course');
	$query->bindParam(':course', $coursename);
	$query->execute();

	return $query->rowCount() > 0;
}

function getCourseId($coursename)
{
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	$query = $pdo->prepare('SELECT cid FROM course WHERE coursename=:course LIMIT 1');
	$query->bindParam(':course', $coursename);

	if($query->execute() && $query->rowCount() > 0) {
		$course = $query->fetch();
		return $course['cid'];
	} else {
		return false;
	}
}
?>
