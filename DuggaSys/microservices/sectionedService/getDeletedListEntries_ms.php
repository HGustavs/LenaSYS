<?php
/*
* Retrieives ALL listentries with DELETED visibility (visible=3)
* returns an array containing the rows
*/

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";
include_once "./retrieveSectionedService_ms.php";

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$opt=getOP('opt');
$courseid = getOP('courseid');
$coursevers=getOP('coursevers');
$versid = getOP('vers');
$log_uuid=getOP('log_uuid');
$debug='NONE!';

$uid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");

$results = array();

$query = $pdo->prepare("SELECT * FROM listentries WHERE visible = '3'");
if($query->execute()) {
    while ($row = $query->fetch(PDO::FETCH_ASSOC)){
        array_push($results, $row);
    }
}else{
    $debug="Failed to get listentries with visibility DELETED!";
}

echo json_encode(retrieveSectionedService($debug, $opt, $pdo, $uid, $courseid, $coursevers, $log_uuid));
