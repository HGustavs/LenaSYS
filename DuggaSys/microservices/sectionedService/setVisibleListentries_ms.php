<?php


date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include ('../sharedMicroservices/getUid_ms.php');


// Connect to database and start session
pdoConnect();
session_start();


// Retrieve parameters from the request 
$listentryId = getOP('listentryId');
$visibility = getOP('visibility');


// Permissions Check

if (checklogin() && isSuperUser(getUid())){

    // prepare SQL query
    $query = $pdo->prepare("UPDATE listentries SET visible = :visible WHERE lid = :lid");


    // Bind Parameters
    $query->bindParam(':visible', $visibility);
    $query->bindParam(':lid', $listentryId);
    


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

?>