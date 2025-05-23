<?php
/*
* Retrieives ALL serviceData 
*/

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";
include_once "./retrieveAccessedService_ms.php";

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");
$opt=getOP('opt');
$cid = getOP('courseid');
$log_uuid=getOP('log_uuid');
$debug="NONE!";

echo json_encode(retrieveAccessedService($pdo, $debug, $userid, $cid, $log_uuid, $opt="", $newusers=""));
