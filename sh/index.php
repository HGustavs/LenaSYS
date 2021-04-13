<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
require 'course.php';

//Gets the parameter from the URL. If the parameter is not availble then return UNK
$course = getOPG("c");
$assignment = getOPG("a");

// Connect to database and start session
pdoConnect();
session_start();

function courseQuery($course){
	global $pdo;
	$c = '"%' . $course . '%"';
	$sql = "SELECT cid, coursename, activeversion, coursecode 
	 FROM course 
	 WHERE (cid LIKE " . $c . " OR coursename LIKE " . $c . 
	 " OR activeversion LIKE " . $c . 
	 " OR coursecode LIKE " . $c . ")
	 AND visibility=1";
	$array = array();

	foreach ($pdo->query($sql) as $row) {
		$cid = $row['cid'];
		$coursename = $row['coursename'];
		$coursecode = $row['coursecode'];
		$courseservers = $row['activeversion'];
		$course = new Course($cid, $coursename, $coursecode, $courseservers);
		$array[] = $course;
	}
	return $array;
}

/*
echo "|".$course."|".$assignment."|";

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
*/
function queryToUrl($course, $assignment){
	global $pdo;	
	$array = courseQuery($course);
	$count = count($array);

	if($count != 1){
		echo "Try a more narrow query, these were your matches:<br>";
		for($i=0; $i<$count;$i++){
		$array[$i]->test();
		}
		return 'UNK';
	} 
	
	$c = $array[0];

	if($course == 'UNK')
		echo "Unknown Course";

	if($assignment != 'UNK'){
		$a = assignmentQuery($assignment);
		$url = "/LenasSYS/DuggaSys/showdoc.php?cid=" . 
			$a['cid'] ."&coursevers=" . 
			$c['courseservers'] ."&fname=" . 
			$a['filename'];
	}
	else $url = "/LenaSYS/DuggaSys/sectioned.php?courseid=" . 
		$c->getCid() ."&coursename=" . 
		$c->getCoursename() . "&coursevers=" .  
		$c->getCourseserver();

	return $url; 
}

$q = queryToUrl($course, $assignment);

if($q != 'UNK'){
	header("Location: ". queryToUrl($course, $assignment));
	exit();
}

$pdo = null;
?>

