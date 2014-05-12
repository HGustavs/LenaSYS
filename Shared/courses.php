<?php
require_once(dirname(__FILE__) . '/../Shared/database.php');

//---------------------------------------------------------------------------------------------------------------
// courseexists - Checks if a cerain course exists or not
//---------------------------------------------------------------------------------------------------------------
function courseexists($coursename)
{
	if(is_string($coursename)) {
		$coursename = getCourseId($coursename);
	}

	$guf=false;
	$querystring="SELECT * FROM course WHERE cid='$coursename';";
	$result=mysql_query($querystring);
	if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
	while ($row = mysql_fetch_assoc($result)){
		$guf=true;
	}
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
