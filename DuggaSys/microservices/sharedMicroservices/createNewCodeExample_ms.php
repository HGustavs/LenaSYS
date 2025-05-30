<?php
include_once "./getUid_ms.php";
include_once "./logUserEvent_ms.php";
include_once "../curlService.php";
include_once "../../../DuggaSys/microservices/curlService.php";

// Connect to database and start session
pdoConnect();
session_start();


$userid = getUid();
// Microservice call to retrieve username
$data = callMicroserviceGET("sharedMicroservices/retrieveUsername_ms.php");

$username = $data['username'] ?? 'unknown';

$requiredKeys = [
	'exampleid',
	'courseid',
	'coursevers',
	'sectname',
	'link',
	'log_uuid',
	'templatenumber'
];

$receivedData = recieveMicroservicePOST($requiredKeys);

$exampleid = $receivedData['exampleid'];
$courseid = $receivedData['courseid'];
$coursevers = $receivedData['coursevers'];
$sectname = $receivedData['sectname'];
$link = $receivedData['link'];
$log_uuid  = $receivedData['log_uuid'];
$templateNumber = $receivedData['templatenumber'];

if (!is_null($exampleid)){
	$sname = $sectname . ($exampleid + 1);
}else{
	$sname= $sectname;
}
$debug="NONE!";
$query2 = $pdo->prepare("INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion,templateid) values (:cid,:ename,:sname,1,:cversion, :templateid);");
$query2->bindParam(':cid', $courseid);
$query2->bindParam(':cversion', $coursevers);
$query2->bindParam(':ename', $sectname);
$query2->bindParam(':sname', $sname);
$query2->bindParam(":templateid", $templateNumber);
if (!$query2->execute()) {
	$error = $query2->errorInfo();
	$debug = "Error updating entries" . $error[2];
}
$link = $pdo->lastInsertId();



logUserEvent($userid, $username, EventTypes::SectionItems, $sectname);

$result = array('debug'=>$debug,'link'=>$link);
header('Content-Type: application/json');
echo json_encode($result);

