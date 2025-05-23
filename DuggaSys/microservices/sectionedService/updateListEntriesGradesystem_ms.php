<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../curlService.php";

// Connect to database and start session.
pdoConnect();
session_start();

$sectid = getOP('lid');
$gradesys = getOP('gradesys');
$courseid = getOP('courseid');
$coursevers = getOP('coursevers');
$log_uuid = getOP('log_uuid');
$opt = getOP('opt');
$debug = "NONE!";

$userid = getUid();
if (checklogin()) { //This entire checklogin should be working by using the getUid instead, but for the time being it doesn't.
    if (isSuperUser($userid)) {

        // need to be logged in and superuser
        $query = $pdo->prepare("UPDATE listentries SET gradesystem=:gradesys WHERE lid=:lid;");
        $query->bindParam(':lid', $sectid);
        $query->bindParam(':gradesys', $gradesys);

        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error failed to update the gradesystem for a listentry: " . $error[2];
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