<?php
//---------------------------------------------------------------------------------------------------------------
// Microservice updateQuizDeadline updates the deadline for a quiz (dugga)
// Microservice does not currently work...
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
include_once "../DuggaSys/gitfetchService.php";

// Connect to database and start session
pdoConnect();
session_start();

$opt=getOP('opt');

$link=getOP('link');
$deadline=getOP('deadline');
$relativedeadline=getOP('relativedeadline');

if(checklogin()){
	
	if(strcmp($opt,"UPDATEDEADLINE")===0){
		$deadlinequery = $pdo->prepare("UPDATE quiz SET deadline=:deadline, relativedeadline=:relativedeadline WHERE id=:link;");
		$deadlinequery->bindParam(':deadline',$deadline);
		$deadlinequery->bindParam(':relativedeadline',$relativedeadline);
		$deadlinequery->bindParam(':link',$link);
		
		if(!$deadlinequery->execute()){
			$error=$deadlinequery->errorInfo();
			$debug="ERROR THE DEADLINE QUERY FAILED".$error[2];
		}
	}
}
?>