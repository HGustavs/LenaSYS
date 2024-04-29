<?php

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

//--------------------------------------------------------------------------------------------------
// newUpdateTime: Updates the MySQL database to save the latest update time
//--------------------------------------------------------------------------------------------------
function newUpdateTime ($currentTime, $cid) {
    // Connect to database and start session
    pdoConnect();
    session_start();

    // Formats the UNIX timestamp into datetime
    $parsedTime = date("Y-m-d H:i:s", $currentTime); 

    // Fetching the latest update of the course from the MySQL database
    global $pdo;
    $query = $pdo->prepare('UPDATE course SET updated = :parsedTime WHERE cid = :cid;');
    $query->bindParam(':cid', $cid);
    $query->bindParam(':parsedTime', $parsedTime);
    $query->execute();
}
