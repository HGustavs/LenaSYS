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


function GetAssigment ($hash){
	global $pdo;

	// Defaults to 404 Error page if no there is no match in the database for the hash value
	$URL = "../errorpages/404.php";

	// Database request form
	$sql =	
	"SELECT useranswer.cid, useranswer.vers, useranswer.quiz, useranswer.moment, course.coursename
	FROM useranswer 
	INNER JOIN course ON useranswer.cid=course.cid
	WHERE hash='{$hash}'";	

	// There should only be one match to the hash value in database as the hash is uniqe
	foreach ($pdo->query($sql) as $row){
		$URL = "../DuggaSys/showDugga.php?coursename={$row["coursename"]}&&courseid={$row["cid"]}&cid={$row["cid"]}&coursevers={$row["vers"]}&did={$row["quiz"]}&moment={$row["moment"]}&hash=$hash";
	}	
	
	return $URL;
}



if($assignment != "UNK"){
	// Check if it's an URL shorthand for assignments
	if($course == "UNK"){
		$assignmentURL = GetAssigment($assignment);
		header("Location: {$assignmentURL}");
	}elseif(($course == "Databaskonstruktion" || $course == "dbk")){
		if($assignment=="a1"){
			header("Location: https://dugga.iit.his.se/DuggaSys/showdoc.php?cid=4&coursevers=82452&fname=minimikrav_m1a.md");
			exit();		
		}else{
			header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=4&coursevers=82452");
			exit();		
		}
	}
	return $array;
}

$q = queryToUrl($course, $assignment);

if($q != 'UNK'){
	header("Location: ". $q);
	exit();

}

$pdo = null;
?>

