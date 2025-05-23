<?php

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../curlService.php";

date_default_timezone_set("Europe/Stockholm");

// Connect to database and start session
pdoConnect();
session_start();

$opt=getOP('opt');
$qid=getOP('qid');
$cid=getOP('cid');
$debug = "NONE!";
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");

if(!(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid) || hasAccess($userid, $cid, 'st')))){
	$debug = "The current user do not have permission to perform this action";
	echo json_encode($debug);
	return;
}

if(strcmp($opt,"DELDU")===0){
	$query = $pdo->prepare("DELETE FROM userAnswer WHERE quiz=:qid;");
	$query->bindParam(':qid', $qid);
	if(!$query->execute()) {
		$debug = "Useranswer could not be deleted.";
	}

	$query = $pdo->prepare("DELETE FROM quiz WHERE id=:qid;");
	$query->bindParam(':qid', $qid);
 
	if(!$query->execute()) {
		$debug = "Quiz could not be deleted.";
	}
}

include_once("retrieveDuggaedService_ms.php");
$log_uuid=getOP('log__uuid');
$coursevers = getOP('coursevers');
$retrievedData = retrieveDuggaedService($pdo, $debug, $userid, $cid, $coursevers, $log_uuid);
echo json_encode($retrievedData);

