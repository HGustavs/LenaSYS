<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
require 'course.php';
require 'query.php';

//Gets the parameter from the URL. If the parameter is not availble then return UNK
$course = getOPG("c");
$assignment = getOPG("a");
$submission = getOPG("s");
$submission_code = getOPG("sc");

// Connect to database and start session
pdoConnect();
session_start();

//To test this function, try and enter the following:
//http://localhost/lenasys/LenaSYS/sh/?a=<hash>
function GetAssignment ($hash){
	global $pdo;

	// Defaults to 404 Error page if no there is no match in the database for the hash value
	$URL = "../errorpages/404.php";

	// Database request form
	$sql =	
	"SELECT userAnswer.cid, userAnswer.vers, userAnswer.quiz, userAnswer.moment, course.coursename, quiz.deadline
	FROM userAnswer 
	INNER JOIN course ON userAnswer.cid=course.cid
	INNER JOIN quiz ON userAnswer.quiz=quiz.id
	WHERE hash='{$hash}'";

	// There should only be one match to the hash value in database as the hash is unique
	foreach ($pdo->query($sql) as $row){
		$URL = "../DuggaSys/showDugga.php?coursename={$row["coursename"]}&&courseid={$row["cid"]}&cid={$row["cid"]}&coursevers={$row["vers"]}&did={$row["quiz"]}&moment={$row["moment"]}&deadline={$row["deadline"]}&hash=$hash";
	}
	return $URL;
}
//To test this function, try and enter the following:
//http://localhost/DuggaSYS/sh/?c=datorgrafik
function GetCourse($course){
	global $pdo;

	$sql = "SELECT cid,activeversion AS vers FROM course WHERE coursename LIKE CONCAT('%', :coursename, '%') LIMIT 1;";
	$query = $pdo->prepare($sql);
	$query->bindParam(':coursename', $course);
	$query->execute();
	if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$cid = $row['cid'];
		$vers = $row['vers'];
	}
	
	if(isset($cid)&&isset($vers)){
		header("Location: /DuggaSys/sectioned.php?courseid={$cid}&coursevers={$vers}");
		exit();			
	}else{
		header("Location: ../errorpages/404.php");
	}
}

//To test this function, try and enter the following:
//http://localhost/DuggaSYS/sh/?c=datorgrafik&a=bit-dugga, lvl 1
function CourseAndAssignment($course, $assignment) {	
	global $pdo;

	// Get current course version
	$sql = "SELECT cid,activeversion AS vers,coursename FROM course WHERE coursename LIKE CONCAT('%', :coursename, '%') LIMIT 1;";
	$query = $pdo->prepare($sql);
	$query->bindParam(':coursename', $course);
	$query->execute();
	if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$cid = $row['cid'];
		$vers = $row['vers'];
		$coursename=$row['coursename'];
	}

	// Get assignment for current course
	if(isset($cid)&&isset($vers)&&isset($coursename)){
		$sql = "SELECT lid,link,highscoremode,quiz.deadline AS deadline FROM listentries LEFT JOIN quiz ON listentries.link=quiz.id WHERE entryname LIKE CONCAT('%', :assignment, '%') AND listentries.vers=:vers LIMIT 1;";
		$query = $pdo->prepare($sql);
		$query->bindParam(':assignment', $assignment);
		$query->bindParam(':vers', $vers);
		$query->execute();
		if($row = $query->fetch(PDO::FETCH_ASSOC)){
			$moment = $row['lid'];
			$did = $row['link'];
			$highscoremode = $row['highscoremode'];
			$deadline = $row['deadline'];
		}	
	}

	if(isset($cid)&&isset($vers)&&isset($coursename)&&isset($moment)&&isset($deadline)){		
		header("Location: /DuggaSys/showDugga.php?coursename={$coursename}&courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$did}&moment={$moment}&deadline={$deadline}");
		exit();	
	}else{
		header("Location: ../errorpages/404.php");
	}
}


if(($assignment != "UNK") &&($course == "UNK")){
	$assignmentURL = GetAssignment($assignment);
	header("Location: {$assignmentURL}");

}else if(($course != "UNK") && ($assignment == "UNK")){
	GetCourse($course);
	
}else if(($assignment != "UNK") && ($course != "UNK")) {
	CourseAndAssignment($course, $assignment);
}
else {
	header("Location: ../errorpages/404.php");
}

$pdo = null;

?>

