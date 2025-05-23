<?php
//---------------------------------------------------------------------------------------------------------------
// getFileedService_ms - Gets all fileLinks
//---------------------------------------------------------------------------------------------------------------

header('Content-Type: application/json');

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
//include_once "./retrieveFileedService_ms.php";
include_once "../curlService.php";

date_default_timezone_set("Europe/Stockholm");

pdoConnect();
session_start();

$opt = getOP('opt');
$courseid = getOP('courseid');
$coursevers = getOP('coursevers');
$fid = getOP('fid');
$log_uuid = getOP('log_uuid');
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");
$debug = "NONE!";

$kind = getOP('kind');

$retrieveArray = callMicroserviceGET(
    "sectionedService/retrieveFileedService_ms.php?" .
    "courseid=" . urlencode($courseid) . 
    "&coursevers=" . urlencode($coursevers) . 
    "&fid=" . urlencode($fid) . 
    "&opt=" . urlencode($opt) . 
    "&log_uuid=" . urlencode($log_uuid) . 
    "&kind=" . urlencode($kind)
);

echo json_encode($retrieveArray);