<?php
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";

//--------------------------------------------------------------------------------------------------
// newUpdateTime: Updates the MySQL database to save the latest update time
//--------------------------------------------------------------------------------------------------
function newUpdateTime ($pdo, $currentTime, $cid) {

    // Formats the UNIX timestamp into datetime
    $parsedTime = date("Y-m-d H:i:s", $currentTime); 

    // update the latest update timestamp of the course from the MySQL database
    $query = $pdo->prepare('UPDATE course SET updated = :parsedTime WHERE cid = :cid;');
    $query->bindParam(':cid', $cid);
    $query->bindParam(':parsedTime', $parsedTime);
    $query->execute();
}
