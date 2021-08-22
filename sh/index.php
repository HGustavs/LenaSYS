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

// Connect to database and start session
pdoConnect();
session_start();

//To test this function, try and enter the following:
//http://localhost/lenasys/LenaSYS/sh/?a=<hash>
function GetAssignment ($hash){
	global $pdo;

	// Defaults to 404 Error page if no there is no match in the database for the hash value
	//$URL = "../errorpages/404.php";

	// Database request form
	$sql = "select * from userAnswer left join quiz on userAnswer.quiz=quiz.id left join course on course.cid=userAnswer.cid where hash=:hash;";
	$query = $pdo->prepare($sql);
	$query->bindParam(":hash", $hash,PDO::PARAM_STR);
	$query->execute();
	
	// There should only be one match to the hash value in database as the hash is unique
	foreach ($query->fetchAll() as $row){
		$cid = $row['cid'];
		$vers = $row['vers'];
		$coursename=$row['coursename'];
		$moment = $row['moment'];
		$did = $row['quiz'];
		//$highscoremode = $row['highscoremode'];
		$deadline = $row['deadline'];
		$variant = $row['variant'];
		$hashpwd = $row['password'];
	}
	
	// Redirect if no password is stored in session or if hash/hashpwd is incorrect
	if(	!isset($_SESSION["submission-password-$cid-$vers-$did"]) || 
		(isset($_SESSION["submission-password-$cid-$vers-$did"]) && $_SESSION["submission-password-$cid-$vers-$did"]!=$hashpwd)){
		$_SESSION['checkhash']=$hash;
		header("Location: ../DuggaSys/validateHash.php");
		exit();	
	}

	if(isset($cid)&&isset($coursename)&&isset($vers)&&isset($moment)&&isset($deadline)){	
		$_SESSION["submission-$cid-$vers-$did"]=$hash;
		$_SESSION["submission-password-$cid-$vers-$did"]=$hashpwd;
		$_SESSION["submission-variant-$cid-$vers-$did"]=$variant;	
		echo "../DuggaSys/showDugga.php?coursename={$coursename}&courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$did}&moment={$moment}&deadline={$deadline}&embed<br>";
		echo "|$hash|$hashpwd|<br>";
		header("Location: ../DuggaSys/showDugga.php?coursename={$coursename}&courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$did}&moment={$moment}&deadline={$deadline}&embed");
		exit();	
	}else{
		echo "../DuggaSys/showDugga.php?coursename={$coursename}&courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$did}&moment={$moment}&deadline={$deadline}&embed<br>";
		echo "|$hash|$hashpwd|<br>";
//		header("Location: ../errorpages/404.php");
		exit();	
	}
	
}

//------------------------------------------------------------------------------------------------
//
// GetCourse($course)
//
// Redirect to the active course that best reflects the input string $course. The input string is 
// split on SPACE and all substrings must be matched in the course name. If multiple courses matches
// the the function redirects to the first course in alphabetical order.
// 
// To test this function, try and enter the following:
// https://[your LenaSYS installation host]/DuggaSYS/sh/?c=datorgrafik
// https://[your LenaSYS installation host]/DuggaSYS/sh/?c=mobil prog
//
//------------------------------------------------------------------------------------------------
function GetCourse($course){
	global $pdo;
	$tmparr=explode(" ",$course);

	// Get current course version
	$sql="SELECT cid,activeversion AS vers,coursename FROM course WHERE visibility=1";
	foreach($tmparr as $i => $param){
		$sql .= " AND coursename LIKE CONCAT('%', :param{$i}, '%')";
	}
	$sql .= " ORDER BY coursename LIMIT 1;";
	$query = $pdo->prepare($sql);
	foreach($tmparr as $i => $param){
		$query->bindParam(":param{$i}", $tmparr[$i],PDO::PARAM_STR);
	}
	$query->execute();
	if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$cid = $row['cid'];
		$vers = $row['vers'];
	}
	if(isset($cid)&&isset($vers)){
		header("Location: /DuggaSys/sectioned.php?courseid={$cid}&coursevers={$vers}&embed");
		exit();			
	}else{
		header("Location: ../errorpages/404.php");
	}
}

//------------------------------------------------------------------------------------------------
//
// CourseAndAssignment($course, $assignment)
//
// Redirect to assignment and active course that best reflects the input strings $assignment and 
// $course. The input strings is split on SPACE and all substrings must be matched in the respective 
// parameters. If multiple courses matches the the function uses the first course in 
// alphabetical order in the redirection, likewise if multiple assignments matches the first 
// assignment in alphabetical order is used in the redirection.
// 
// To test this function, try and enter the following:
// https://[your LenaSYS installation host]/DuggaSYS/sh/?c=datorgrafik&a=bit 1
// https://[your LenaSYS installation host]/DuggaSYS/sh/?c=datorgrafik&a=bit 2
//
//------------------------------------------------------------------------------------------------
function CourseAndAssignment($course, $assignment) {	
	global $pdo;
	$sql="SELECT course.cid AS cid,course.activeversion AS vers, course.coursename AS coursename, listentries.entryname AS entryname, listentries.lid AS lid,listentries.link AS link,listentries.highscoremode AS highscoremode,quiz.deadline AS deadline FROM listentries JOIN course ON listentries.vers=course.activeversion AND listentries.cid=course.cid LEFT JOIN quiz ON listentries.link=quiz.id WHERE kind=3";
	$tmpcoursearr=explode(" ",$course);
	$tmpassignmentarr=explode(" ",$assignment);
	foreach($tmpcoursearr as $i => $cparam){
		$sql .= " AND coursename LIKE CONCAT('%', :cparam{$i}, '%')";
	}
	foreach($tmpassignmentarr as $i => $aparam){
		$sql .= " AND entryname LIKE CONCAT('%', :aparam{$i}, '%')";
	}
	$sql .= " ORDER BY coursename,entryname;";

	$query = $pdo->prepare($sql);
	foreach($tmpcoursearr as $i => $cparam){
		$query->bindParam(":cparam{$i}", $tmpcoursearr[$i],PDO::PARAM_STR);
	}
	foreach($tmpassignmentarr as $i => $aparam){
		$query->bindParam(":aparam{$i}", $tmpassignmentarr[$i],PDO::PARAM_STR);
	}

	$query->execute();
	if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$cid = $row['cid'];
		$vers = $row['vers'];
		$coursename=$row['coursename'];
		$moment = $row['lid'];
		$did = $row['link'];
		$highscoremode = $row['highscoremode'];
		$deadline = $row['deadline'];
	}

	// $tmparr=explode(" ",$course);

	// // Get current course version
	// $sql="SELECT cid,activeversion AS vers,coursename FROM course WHERE visibility=1";
	// foreach($tmparr as $i => $param){
	// 	$sql .= " AND coursename LIKE CONCAT('%', :param{$i}, '%')";
	// }
	// $sql .= " ORDER BY coursename LIMIT 1;";
	// $query = $pdo->prepare($sql);
	// foreach($tmparr as $i => $param){
	// 	$query->bindParam(":param{$i}", $param);
	// }
	// $query->execute();
	// if($row = $query->fetch(PDO::FETCH_ASSOC)){
	// 	$cid = $row['cid'];
	// 	$vers = $row['vers'];
	// 	$coursename=$row['coursename'];
	// }

	// // Get assignment for current course
	// if(isset($cid)&&isset($vers)&&isset($coursename)){
	// 	$tmparr=explode(" ",$assignment);
	// 	$sql="SELECT lid,link,highscoremode,quiz.deadline AS deadline FROM listentries LEFT JOIN quiz ON listentries.link=quiz.id WHERE kind=3 AND listentries.vers=:vers";
	// 	foreach($tmparr as $i => $param){
	// 		$sql .= " AND entryname LIKE CONCAT('%', :param{$i}, '%')";
	// 	}
	// 	$sql .= " ORDER BY entryname LIMIT 1;";
	
	// 	$query = $pdo->prepare($sql);
	// 	$query->bindParam(':vers', $vers);
	// 	foreach($tmparr as $i => $param){
	// 		$query->bindParam(":param{$i}", $param);
	// 	}
	
	// 	$query->execute();
	// 	if($row = $query->fetch(PDO::FETCH_ASSOC)){
	// 		$moment = $row['lid'];
	// 		$did = $row['link'];
	// 		$highscoremode = $row['highscoremode'];
	// 		$deadline = $row['deadline'];
	// 	}	
	// }

	if(isset($cid)&&isset($vers)&&isset($coursename)&&isset($moment)&&isset($deadline)){		
		header("Location: /DuggaSys/showDugga.php?coursename={$coursename}&courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$did}&moment={$moment}&deadline={$deadline}&embed");
		exit();	
	}else{
		header("Location: ../errorpages/404.php");
	}
}


if($submission != "UNK"){
	$assignmentURL = GetAssignment($submission);
}else if(($course != "UNK") && ($assignment == "UNK")){
	GetCourse($course);
}else if(($assignment != "UNK") && ($course != "UNK")) {
	CourseAndAssignment($course, $assignment);
}
else {
	header("Location: ../errorpages/404.php");
}
$pdo = null;

