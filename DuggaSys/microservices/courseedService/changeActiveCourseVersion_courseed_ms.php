<?php

//---------------------------------------------------------------------------------------------------------------
// The microservice changeActiveVersion_ms.php takes an existing course and changes the activeversion
//---------------------------------------------------------------------------------------------------------------

// Set the correct time zone
date_default_timezone_set("Europe/Stockholm");

// Basic includes for this ms to work
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";



// Connect to database and start session.
pdoConnect();
session_start();



// Get attributes from db
$cid=getOP('cid');
$vers=getOP('vers');


// Login is checked for function to run
if(checklogin() && isSuperUser(getUid()) == true) {

if(strcmp($opt,"CHGVERS")===0) {


	if ($makeactive == 3) {
		$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
		$query->bindParam(':cid', $cid);
		$query->bindParam(':vers', $versid);
		if (!$query->execute()) {
			$error = $query->errorInfo();
			$debug = "Error updating entries\n" . $error[2];
		}
	}
	

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