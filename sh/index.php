<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
require 'course.php';
require 'query.php';

//Gets the parameter from the URL. If the parameter is not availble then return UNK
$course = getOPG("c");
$quizid = getOPG("a");
$hash = getOPG("h");

// Connect to database and start session
pdoConnect();
session_start();


function GoToAssignment ($quizid){ //Här gör vi ändringar för att kunna ladda in rätt assignment FÖR ATT LÄRAREN VILL DET?!?!
	global $pdo;

	// Defaults to 404 Error page if no there is no match in the database for the assignment(quiz.id) value
	$URL = "../errorpages/404.php";

	// Database request form
	$sql =	
	"SELECT userAnswer.cid, userAnswer.vers, userAnswer.quiz, userAnswer.moment, course.coursename, quiz.deadline
	FROM userAnswer 
	INNER JOIN course ON userAnswer.cid=course.cid
	INNER JOIN quiz ON userAnswer.quiz=quiz.id
	WHERE id='{$quizid}'";

	// There should only be one match to the hash value in database as the hash is unique
	foreach ($pdo->query($sql) as $row){
		$URL = "../DuggaSys/showDugga.php?coursename={$row["coursename"]}&&courseid={$row["cid"]}&cid={$row["cid"]}&coursevers={$row["vers"]}&did={$row["quiz"]}&moment={$row["moment"]}&deadline={$row["deadline"]}&hash=$hash";
	}	
	
	return $URL;
}
//We made the function below to save it in case of future use //If the load dugga doesn't work, this is the cause, revert to old code (Den hette GetAssignment förrut)
function LoadSavedAssignment ($hash){
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

if(($quizid != "UNK") &&($course == "UNK")){
	$quizidURL = GoToAssignment($quizid);
	header("Location: {$quizidURL}");

}else if(($course != "UNK") && ($quizid == "UNK")){
	GetCourse($course);
	
}else if(($quizid != "UNK") && ($course != "UNK")) {
	$courseAndquizidURL = queryToUrl($course, $quizid);
	header("Location: {$courseAndquizidURL}");
}
else {
	header("Location: ../errorpages/404.php");
}

if($hash != "UNK"){
	$hash = LoadSavedAssignment($hash);
	header("Location: {$hash}");
}

$pdo = null;

?>

