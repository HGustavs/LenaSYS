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
//http://localhost/lenasys/LenaSYS/sh/?c=Webbutveckling - datorgrafik IT118G HT15
function GetCourse($course){
	$courseArray = explode(" ", $course); //Transforms long string to array with a word in each element
	$versname = end($courseArray); //Gets last element, ex: "HT15"
	$coursecode = prev($courseArray); //Gets second-last element, ex: "IT118G"
	global $pdo;


	//$sql = "SELECT cid,activeversion AS vers FROM course WHERE coursecode=:coursecode;";
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
//http://localhost/lenasys/LenaSYS/sh/?c=Webbutveckling - datorgrafik IT118G HT15&a=Biträkningsdugga 1
function CourseAndAssignment($course, $assignment) {	
	$courseArray = explode(" ", $course); //Transforms long string to array with a word in each element
	$versname = end($courseArray); //Gets last element, ex: "HT15"
	$coursecode = prev($courseArray); //Gets second-last element, ex: "IT118G"

	global $pdo;

	//Get cid and vers
	$sql = "SELECT cid,vers FROM vers WHERE versname='{$versname}' AND coursecode='{$coursecode}'";
	$query = $pdo->prepare($sql);
	$query->execute();
	if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$cid = $row['cid'];
		$vers = $row['vers'];
	}
	//error_log("cid: ".$cid." vers: ".$vers);
	
	//Get coursename
	$sql = "SELECT coursename FROM course WHERE activeversion='{$vers}'";
	$query = $pdo->prepare($sql);
	$query->execute();
	if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$coursename = $row['coursename'];
	}
	//error_log("coursename: ".$coursename);

	//Get moment(lid), did(link), highscoremode
	$sql = "SELECT * FROM listentries WHERE entryname='{$assignment}'";
	$query = $pdo->prepare($sql);
	$query->execute();
	if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$moment = $row['lid'];
		$did = $row['link'];
		$highscoremode = $row['highscoremode'];
	}
	//error_log("moment: ".$moment." did: ".$did." highscoremode: ".$highscoremode);

	//Get deadline
	$sql = "SELECT deadline FROM quiz WHERE id='{$did}'";
	$query = $pdo->prepare($sql);
	$query->execute();
	if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$deadline = $row['deadline'];
	}
	//error_log("deadline: ".$deadline);

	$serverRoot = serverRoot();
	header("Location: {$serverRoot}/lenasys/DuggaSys/showDugga.php?coursename={$coursename}&courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$did}&moment={$moment}&deadline={$deadline}");
	exit();
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

