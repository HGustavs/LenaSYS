<?php


date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include "../sharedMicroservices/getUid_ms.php";
include_once "../curlService.php";


// Connect to database and start session
pdoConnect();
session_start();


// Retrieve parameters from the request 
$lid = getOP('lid');
$visible = getOP('visible');
$courseid = getOP('courseid');
$coursevers = getOP('coursevers');
$versid = getOP('vers');
$uid = getUid();
$log_uuid=getOP('log_uuid');
$opt=getOP('opt');
$debug='NONE!';

// Permissions Check

if (checklogin() && isSuperUser($uid)){

    // prepare SQL query
    $query = $pdo->prepare("UPDATE listentries SET visible = :visible WHERE lid = :lid");

    // Bind Parameters
    $query->bindParam(':visible', $visible);
    $query->bindParam(':lid', $lid);

    // Query Execution
    if ($query->execute()){

        // Optionally log to event
        // logUserEvent($userid, $username, EventTypes::UpdateListentryVisibility, $listentryId);

        $debug = "Visibility update successfully.";
    } else {
        $debug = "Error updating visibility.";
    }
} else {
    $debug = "insufficient permissions.";
}

  $postData = [
    'debug' => $debug,
    'opt' => $opt,
    'uid' => $uid,
    'cid' => $courseid,
    'vers' => $versid,
    'log_uuid' => $log_uuid
];

header("Content-Type: application/json");
$data = callMicroservicePOST("sectionedService/retrieveSectionedService_ms.php", $postData, true );
echo $data;
return;