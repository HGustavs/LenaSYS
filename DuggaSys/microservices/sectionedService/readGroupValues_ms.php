<?php
/********************************************************************************

   readGroupValues_ms.php

*********************************************************************************

    This micro service is called upon when a group is clicked on.

-------------==============######## Documentation End ###########==============-------------
*/

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "./retrieveSectionedService_ms.php";
include_once "../curlService.php";

// Connect to database and start session
pdoConnect();
session_start();

$uid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");

$courseid = getOP('courseid');
$versid = getOP('vers');
$log_uuid=getOP('log_uuid');
$opt=getOP('opt');
$coursevers=getOP('coursevers');
$debug='NONE!';
$groups=array();
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

$data = retrieveSectionedService($debug, $opt, $pdo, $uid, $courseid, $coursevers, $log_uuid);
$data['groups']=$groups;
echo json_encode($data);
return;

