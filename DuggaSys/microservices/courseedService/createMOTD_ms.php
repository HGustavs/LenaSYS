<?php
/********************************************************************************

   CreateMOTD_ms.php

*********************************************************************************

    This micro service is called upon when the message of the day is changed in the page associated with courseed.
    The user must be a super user to be able to do this!

-------------==============######## Documentation End ###########==============-------------
*/


date_default_timezone_set("Europe/Stockholm");
include ("../../../Shared/sessions.php");     
include('../shared_microservices/getUid_ms.php');

// Connect to database and start session
pdoConnect();
session_start();

$opt=getOP('opt');
$motd=getOP('motd');
$readonly=getOP('readonly');

// Updates the message of the day 
if(checklogin() && isSuperUser(getUid())) {

    $query = $pdo->prepare("INSERT INTO settings (motd,readonly) VALUES (:motd, :readonly);");

    $query->bindParam(':motd', $motd);
    if($readonly == "UNK") {$readonly=0;}
    $query->bindParam(':readonly', $readonly);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating entries\n".$error[2];
    }
}
?>