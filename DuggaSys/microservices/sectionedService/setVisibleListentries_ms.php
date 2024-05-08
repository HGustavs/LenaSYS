<?php


date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include ('../sharedMicroservices/getUid_ms.php');
include_once "retrieveSectionedService_ms.php";


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

        echo "Visibility update successfully.";
    } else {
        echo "Error updating visibility.";
    }
} else {
    echo "insufficient permissions.";
}

$data = retrieveSectionedService($debug, $opt, $pdo, $uid, $courseid, $coursevers, $log_uuid);
echo json_encode($data);
return;

?>