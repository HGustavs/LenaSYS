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

if($assignment != "UNK"){
	// Check if it's an URL shorthand for assignments
	if($course == "UNK"){
		foreach($pdo->query( 'SELECT * FROM passwordURL;' ) as $row){
			if($assignment == $row["shortURL"]){
				header("Location: " + $row['URL']);
				}
		}
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

