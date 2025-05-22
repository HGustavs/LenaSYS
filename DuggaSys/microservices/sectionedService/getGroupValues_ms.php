<?php
/********************************************************************************

   getGroupValues_ms.php

*********************************************************************************

    This micro service is called upon when a group is clicked on.

-------------==============######## Documentation End ###########==============-------------
*/

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../curlService.php";
include_once "../sharedMicroservices/getUid_ms.php";

// Connect to database and start session
pdoConnect();
session_start();

$uid = getUid();
$courseid = getOP('courseid');
$versid = getOP('vers');
$log_uuid=getOP('log_uuid');
$opt=getOP('opt');
$coursevers=getOP('coursevers');
$debug='NONE!';

if(checklogin()){
	$stmt = $pdo->prepare("SELECT groupKind,groupVal FROM `groups`");

	if (!$stmt->execute()) {
		$error=$stmt->errorInfo();
		$debug="Error getting groups " . $error[2];
	} else {
		foreach($stmt->fetchAll(PDO::FETCH_ASSOC) as $row){
			if(!isset($groups[$row['groupKind']])){
				$groups[$row['groupKind']]=array();
			}
			array_push($groups[$row['groupKind']],$row['groupVal']);
		}
	}
}

$postData = [
    'debug' => $debug,
    'opt' => $opt,
    'uid' => $userid,
    'cid' => $courseid,
    'vers' => $coursevers,
    'log_uuid' => $log_uuid
];

header("Content-Type: application/json");
$data = callMicroservicePOST("sectionedService/retrieveSectionedService_ms.php", $postData, true );
echo $data;
return;

