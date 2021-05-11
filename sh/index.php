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

function GetCourse(){
	global $pdo;

	$sql = "SELECT coursename FROM course";
	
	$courses = array();

	foreach($pdo->query($sql) as $c) {
		array_push($courses, str_replace($c["coursename"], " ", "_"));
	}

	if (in_array($course, $courses)) {
		$course = str_replace($course, "_", " ");
		$sql = "SELECT activeversion, cid FROM course WHERE coursename='".$course."'";
		foreach ($pdo->query($sql) as $row) {
			$cid = $row["cid"];
			$activeversion = $row["activeversion"];
		}
		$serverRoot = serverRoot();
		header("Location: {$serverRoot}/DuggaSys/sectioned.php?courseid={$cid}&coursevers={$activeversion}");
		exit();
	}
	
}

//Här vill vi ändra
if(($assignment != "UNK") &&($course == "UNK")){
	$assignmentURL = GetAssignment($assignment);
	header("Location: {$assignmentURL}");

}else if(($course != "UNK") && ($assignment == "UNK")){
	GetCourse();
	
}else if(($assignment != "UNK") && ($course != "UNK")) {
	$courseAndAssignmentURL = queryToUrl($course, $assignment);
	header("Location: {$courseAndAssignmentURL}");
}
else {
	header("Location: ../errorpages/404.php");
}

/*
else {//Här vill vi ändra, tror jag... kanske...
	header("Location: ../errorpages/404.php");
}*/

$pdo = null;
?>

