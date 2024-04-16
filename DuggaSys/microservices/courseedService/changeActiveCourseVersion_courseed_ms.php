<?php

//---------------------------------------------------------------------------------------------------------------
// The microservice changeActiveVersion_ms.php takes an existing course and changes content of the activeversion column.
// I am unsure where on Lenasys this function is used or if it even is used. If someone implements a feature to edit the 
// course version this Microservice can be used.
//---------------------------------------------------------------------------------------------------------------

// Set the correct time zone
date_default_timezone_set("Europe/Stockholm");

// Basic includes for this ms to work
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include "../../../shared_microservices/getUid_ms.php";



// Connect to database and start session.
pdoConnect();
session_start();



// Get attributes from db
$opt=getOP('opt');
$courseid=getOP('cid');
$versid=getOP('vers');


// Login is checked for function to run
if(checklogin() && isSuperUser(getUid()) == true) {

	if(strcmp($opt,"CHGVERS")===0) {

		$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
		$query->bindParam(':cid', $courseid);
		$query->bindParam(':vers', $versid);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
		}
    }
}


?>