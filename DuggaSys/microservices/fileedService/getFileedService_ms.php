<?php
//---------------------------------------------------------------------------------------------------------------
// getFileedService_ms - Gets all fileLinks
//---------------------------------------------------------------------------------------------------------------

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "./retrieveFileedService_ms.php";

date_default_timezone_set("Europe/Stockholm");

pdoConnect();
session_start();

$opt = getOP('opt');
$courseid = getOP('courseid');
$coursevers = getOP('coursevers');
$fid = getOP('fid');
$log_uuid = getOP('log_uuid');
$userid = getUid();
$debug = "NONE!";

$retrieveArray = retrieveFileedService($debug, null, null, $pdo, $courseid, $coursevers, $userid, $log_uuid, $opt, $fid, $kind);
echo json_encode($retrieveArray);