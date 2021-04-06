<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../../Shared/basic.php";

$url = getOPG("c");
$assignment = getOPG("a");


$old_url = $_SERVER['REQUEST_URI'];
$course = end(explode("/", $old_url));


echo "|".$url."|".$assignment."|";

if ($course == "Databaskonstruktion") {
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=4&coursevers=82452");
	exit();
} else if ($course == "ExamensarbeteWebbprogrammering"){
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=25&coursename=Examensarbete%20med%20inriktning%20mot%20webbprogrammering&coursevers=95081");
	exit();
} else if ($course == "ProjektSoftwareEngineering"){
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=17&coursename=Projekt%20i%20software%20engineering&coursevers=92641");
	exit();
} else if ($course == "Shaderprogrammering"){
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=16&coursename=Shaderprogrammering&coursevers=92622");
	exit();
} else if ($course == "Webbprogrammering"){
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=7&coursename=Webbprogrammering&coursevers=2020lp5");
	exit();
} else if ($course == "WebbutvecklingContentManagement"){
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=5&coursename=Webbutveckling%20-%20content%20management%20och%20drift&coursevers=84261");
	exit();
} else if ($course == "WebbutvecklingDatorgrafik"){
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=3&coursename=Webbutveckling%20-%20datorgrafik%20&coursevers=81508");
	exit();
} else if ($course == "WebbutvecklingForskningOchUtveckling"){
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=8&coursename=Webbutveckling%20-%20Forskning%20och%20Utveckling&coursevers=2020lp5");
	exit();
} else if ($course == "WebbutvecklingMobilapplikationsdesign"){
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=15&coursename=Webbutveckling%20-%20Mobilapplikationsdesign&coursevers=92625");
	exit();
} else if ($course == "WebbutvecklingProgrammeringAvMobilaApplikationer"){
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=1&coursename=Webbutveckling%20-%20Programmering%20av%20mobila%20applikationer&coursevers=92642");
	exit();
} else if ($course == "WebbutvecklingWebbplatsdesign"){
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=14&coursename=Webbutveckling%20-%20Webbplatsdesign&coursevers=91428");
	exit();
} else if ($course == "XMLAPI"){
	header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=13&coursename=XML%20API&coursevers=2021lp2");
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
