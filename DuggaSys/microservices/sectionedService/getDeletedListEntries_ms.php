<?php
/*
* Retrieives ALL listentries with DELETED visibility (visible=3)
* returns an array containing the rows
*/

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../curlService.php";

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
$uid=getUid();

$results = array();

$query = $pdo->prepare("SELECT * FROM listentries WHERE visible = '3'");
if($query->execute()) {
    while ($row = $query->fetch(PDO::FETCH_ASSOC)){
        array_push($results, $row);
    }
}else{
    $debug="Failed to get listentries with visibility DELETED!";
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
