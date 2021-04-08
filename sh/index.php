<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../Shared/basic.php";

$course = getOPG("c");
$assignment = getOPG("a");

//====================================================//
//database values needed are: cid, coursename, activeversion
//
//====================================================//

echo "|".$course."|".$assignment."|";

switch ($course) {
	case ("dg"):
	header("Location: /LenaSYS/DuggaSys/sectioned.php?courseid=3&coursename=Datorns%20grunder&coursevers=1337");
	exit();

	case ("demo"):
	header("Location: /LenaSYS/DuggaSys/sectioned.php?courseid=1894&coursename=Demo-Course&coursevers=52432");
	exit();

	case ("se"):
	header("Location: /LenaSYS/DuggaSys/sectioned.php?courseid=4&coursename=Software%20Engineering&coursevers=1338");
	exit();

	case ("wp"):
	header("Location: /LenaSYS/DuggaSys/sectioned.php?courseid=1&coursename=Webbprogrammering&coursevers=45656");
	exit();

	case ("dgfk"):
	header("Location: /LenaSYS/DuggaSys/sectioned.php?courseid=2&coursename=Webbutveckling%20-%20datorgrafik&coursevers=97732");
	exit();

}


/*if($assignment != "UNK"){
	if(($course == "Databaskonstruktion" || $course == "dbk")){
		if($assignment=="a1"){
			header("Location: https://dugga.iit.his.se/DuggaSys/showdoc.php?cid=4&coursevers=82452&fname=minimikrav_m1a.md");
			exit();		
		}else{
			header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=4&coursevers=82452");
			exit();		
		}
	}
}else{
	if(($course == "Databaskonstruktion" || $course == "dbk")){
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=4&coursevers=82452");
		exit();	
	}
}*/

echo "404 Course/Assignment does not exist!";
