<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../curlService.php";

pdoConnect();
session_start();

$opt=getOP('opt');
$vid=getOP('vid');
$cid=getOP('cid');

$userid=getUid();

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

$log_uuid=getOP('log__uuid');
$coursevers = getOP('coursevers');

header('Content-Type: application/json');

$dataToSend = [
  'debug' => $debug,
  'userid' => $userid,
  'cid' => $cid,
  'coursevers' => $coursevers,
  'log_uuid' => $log_uuid
];

echo callMicroservicePOST("duggaedService/retrieveDuggaedService_ms.php", $dataToSend, true);
