<?php

    date_default_timezone_set("Europe/Stockholm");

    // Include basic application services!
    include_once "../../../Shared/sessions.php";
    include_once "../../../Shared/basic.php";
    include('../shared_microservices/getUid_ms.php');

    // Connect to database and start session
    pdoConnect();
    session_start();

    $userid = getUid();
    if (checklogin()) { //This entire checklogin should be working by using the getUid instead, but for the time being it doesn't.
        if(isSuperUser($userid)) {
            $sectid=getOP('lid');
            // Delete foreign key references
            $query = $pdo->prepare("DELETE FROM useranswer WHERE moment=:lid");
            $query->bindParam(':lid', $sectid);

            if(!$query->execute()) {
                if($query->errorInfo()[0] == 23000) {
                    $debug = "The item could not be deleted.";
                }
            }
            // Delete the listentry
            $query = $pdo->prepare("DELETE FROM listentries WHERE lid = :lid");
            $query->bindParam(':lid', $sectid);
            if (!$query->execute()) {
                if ($query->errorInfo()[0] == 23000) {
                    $debug = "The item could not be deleted because of a foreign key constraint.";
                } else {
                    $debug = "The item could not be deleted.";
                }
            }
        }
    }
        
?>
