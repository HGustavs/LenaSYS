<?php
require_once(dirname(__FILE__) . '/../Shared/database.php');

//---------------------------------------------------------------------------------------------------------------
// courseexists - Checks if a cerain course exists or not
//---------------------------------------------------------------------------------------------------------------
function courseexists($coursename)
{
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	if(!is_numeric($coursename)) {
		$coursename = getCourseId($coursename);
	}

	$query = $pdo->prepare('SELECT COUNT(cid) FROM course WHERE cid=:course');
	$query->bindParam(':course', $coursename);
	if($query->execute() && $query->rowCount() > 0) {
		$res = $query->fetch(PDO::FETCH_NUM);
		return $res[0] > 0;
	} else {
		return false;
	}
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

function getCourseName($courseid)
{
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	$query = $pdo->prepare("SELECT coursename FROM course WHERE cid=:cid LIMIT 1");
	$query->bindParam(':cid', $courseid);

	if($query->execute() && $query->rowCount() > 0) {
		$course = $query->fetch();
		return $course["coursename"];
	} else {
		return false;
	}
}
?>
