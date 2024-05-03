<?php


date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Share/basic.php";
include_once "../Share/sessions.php";
include ('../shareMicroservices/getUid_ms.php');
include_once "retrieveSectionedService_ms.php";


// Connect to database and start session
pdoConnect();
session_start();


// Retrieve parameters from the request 
$listentryId = getOP('listentryId');
$visibility = getOP('visibility');


// Permissions Check

if (checklogin() && isSuperUser(getUid())){

    // prepare SQL query
    $query = $pdo->prepare("UPDATE listentries Set visibility = :listentryId");

    // Bind Parameters
    $query->bindParam(':cisiblity', $visibility);
    $query->bindParam(':listentryId', $listentryId);


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