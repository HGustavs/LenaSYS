<?php

////////////////////////////////////////////////////////////////////////////
// This is a Micro Service for updating a user answer in the duggaservice //
////////////////////////////////////////////////////////////////////////////

date_default_timezone_set("Europe/Stockholm"); // Added default timezone. Not sure if it is used 

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

pdoConnect(); // Connect to database and start session
session_start();

$opt=getOP('opt');
$answer=getOP('answer');
$hash=getOP('hash');
$hashpwd=getOP('password');

if(strcmp($opt,"SAVDU")==0){
	// Log the dugga write
	makeLogEntry($userid,2,$pdo,$courseid." ".$coursevers." ".$duggaid." ".$moment." ".$answer);
	$discription = $courseid." ".$duggaid." ".$moment." ".$answer;
	if(checklogin() && !isSuperUser($userid)) {

		if(isset($grade)&&($grade > 1)){
			//if grade equal G, VG, 3, 4, 5, or 6 
			$debug="You have already passed this dugga. You are not required/allowed to submit anything new to this dugga.";
		}
		else {
			if(isset($dbpwd) && strcmp($hashpwd,$dbpwd) === 0){
				$query = $pdo->prepare("UPDATE userAnswer SET submitted=NOW(), useranswer=:useranswer, timesSubmitted=timesSubmitted+1 WHERE hash=:hash AND password=:hashpwd;");
				$query->bindParam(':hash', $hash);
				$query->bindParam(':hashpwd', $hashpwd);
				$query->bindParam(':useranswer', $answer);
				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating variant (row ".__LINE__.") Error code: ".$error[2];
				}
			}
		}
	}
}

?>