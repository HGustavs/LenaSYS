<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../curlService.php";

pdoConnect();
session_start();

$opt=getOP('opt');
$vid=getOP('vid');
$cid=getOP('cid');

$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");

if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid) || hasAccess($userid, $cid, 'st'))){

    if(strcmp($opt,"DELVARI")===0){
        $query = $pdo->prepare("DELETE FROM userAnswer WHERE variant=:vid;");
        $query->bindParam(':vid', $vid);

        if(!$query->execute()) {
            $error=$query->errorInfo();
            $debug="Error when trying to delete a user answer: ".$error[2];
        }

        $query = $pdo->prepare("DELETE FROM variant WHERE vid=:vid;");
        $query->bindParam(':vid', $vid);

        if(!$query->execute()) {
            $error=$query->errorInfo();
            $debug="Error when trying to delete a variant: ".$error[2];
        }
    }
}

include_once("retrieveDuggaedService_ms.php");
$log_uuid=getOP('log__uuid');
$coursevers = getOP('coursevers');
$retrievedData = retrieveDuggaedService($pdo, $debug, $userid, $cid, $coursevers, $log_uuid);
echo json_encode($retrievedData);

?>
