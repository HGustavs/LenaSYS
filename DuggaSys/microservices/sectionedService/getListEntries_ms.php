<?php
/*
* Retrieives ALL listentries 
*/

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "retrieveSectionedService_ms.php";

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$uid = getUid();
$opt=getOP('opt');
$courseid = getOP('courseid');
$coursevers=getOP('coursevers');
$log_uuid=getOP('log_uuid');

echo json_encode(retrieveSectionedService($debug, $opt, $pdo, $uid, $courseid, $coursevers, $log_uuid));
