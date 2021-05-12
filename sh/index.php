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

// Connect to database and start session
pdoConnect();
session_start();

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

function GetCourse($course){
	global $pdo;

	$sql = "SELECT activeversion, cid FROM course WHERE cid='{$course}'";

	foreach ($pdo->query($sql) as $row) {
		$cid = $row["cid"];
		$activeversion = $row["activeversion"];
	}
	$serverRoot = serverRoot();
	header("Location: {$serverRoot}/lenasys/DuggaSys/sectioned.php?courseid={$cid}&coursevers={$activeversion}");
	exit();
}

function CourseAndAssignment($course, $assignment) {	
	$courseArray = explode(" ", $course); //Transforms long string to array with a word in each element
	$versname = end($courseArray); //Gets last element, ex: "HT15"
	$coursecode = prev($courseArray); //Gets second-last element, ex: "IT118G"

	global $pdo;

	//Get vers.vers
	$sql = "SELECT * FROM vers WHERE versname='{$versname}' AND coursecode='{$coursecode}'";
	$query = $pdo->prepare($sql);
	$query->execute();
	//$result = $query->fetch();
	if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$cid = $row['cid'];
		$coursename = $row['coursename'];
		$coursecode = $row['coursecode'];
	}
	error_log("cid: ".$cid." coursename: ".$coursename." coursecode: ".$coursecode);
	
	//Get id.quiz
	$sql = "SELECT id FROM quiz WHERE qname='{$assignment}' AND vers='{$vers}'";
	$query = $pdo->prepare($sql);
	$query->execute();
	$result = $query->fetch();
	$did = $result[0];

	//Create URL
	//$URL = "../DuggaSys/showDugga.php?coursename={$row["coursename"]}&&courseid={$row["cid"]}&cid={$row["cid"]}&coursevers={$row["vers"]}&did={$row["quiz"]}&moment={$row["moment"]}&deadline={$row["deadline"]}&hash=$hash";

	//error_log("versname: ".$versname);
	//error_log("coursecode: ".$coursecode);
	//error_log("assignment: ".$assignment);
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

