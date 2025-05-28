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
$userid=getUid();

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

$log_uuid=getOP('log__uuid');
$coursevers = getOP('coursevers');

header('Content-Type: application/json');

$dataToSend = [
  'debug' => $debug,
  'userid' => $userid,
  'cid' => $cid,
  'coursevers' => $coursevers,
  'log_uuid' => $log_uuid
];

echo callMicroservicePOST("duggaedService/retrieveDuggaedService_ms.php", $dataToSend, true);

