<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../../Shared/basic.php";

$url = getOPG("c");
$assignment = getOPG("a");


$old_url = $_SERVER['REQUEST_URI'];
$course = end(explode("/", $old_url));


echo "|".$url."|".$assignment."|";

if ($course = "Databaskonstruktion") {
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=4&coursevers=82452");
	exit();
}

if($assignment != "UNK"){
	if(($url == "Databaskonstruktion" || $url == "dbk")){
		if($assignment=="a1"){
			header("Location: https://dugga.iit.his.se/DuggaSys/showdoc.php?cid=4&coursevers=82452&fname=minimikrav_m1a.md");
			exit();		
		}else{
			header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=4&coursevers=82452");
			exit();		
		}
	}
}else{
	if(($url == "Databaskonstruktion" || $url == "dbk")){
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=4&coursevers=82452");
		exit();	
	}
}

echo "404 Course/Assignment does not exist!";

// RedirectMatch "/sh/[^(index.php)]" "/LenaSYS/lenaSYS/sh/index.php"
