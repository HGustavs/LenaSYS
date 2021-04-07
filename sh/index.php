<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";

// Connect to database and start session
pdoConnect();
session_start();

//Gets the parameter from the URL. If the parameter is not availble then return UNK
$url = getOPG("c");
$assignment = getOPG("a");

if($assignment != "UNK"){
	// Check if it's an URL shorthand for assignments
	if($url == "UNK"){
		foreach($pdo->query( 'SELECT * FROM passwordURL;' ) as $row){
			if($assignment == $row["shortURL"]){
				header("Location: " + $row['URL']);
				}
		}
	} elseif ($url == "Databaskonstruktion" || $url == "dbk"){
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

?>
