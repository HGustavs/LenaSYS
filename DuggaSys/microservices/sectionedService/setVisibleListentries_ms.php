<?php


date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";
include_once "./retrieveSectionedService_ms.php";


// Connect to database and start session
pdoConnect();
session_start();


// Retrieve parameters from the request 
$lid = getOP('lid');
$visible = getOP('visible');
$courseid = getOP('courseid');
$coursevers = getOP('coursevers');
$versid = getOP('vers');

$userData = callMicroserviceGET("sharedMicroservices/getUid_ms.php");
$uid = $userData['uid'] ?? 'guest';

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
$data = retrieveSectionedService($debug, $opt, $pdo, $uid, $courseid, $versid, $log_uuid);
echo json_encode($data);
return;