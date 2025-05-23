<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../curlService.php";

// Connect to database and start session.
pdoConnect();
session_start();

$opt = getOP('opt');
$vid = getOP('vid');
$param = getOP('parameter');
$answer = getOP('variantanswer');
$disabled = getOP('disabled');

if(strcmp($opt,"SAVVARI")===0){
    $query = $pdo->prepare("UPDATE variant SET disabled=:disabled,param=:param,variantanswer=:variantanswer WHERE vid=:vid");
    $query->bindParam(':vid', $vid);
    $query->bindParam(':disabled', $disabled);
    $query->bindParam(':param', $param);
    $query->bindParam(':variantanswer', $answer);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating user".$error[2];
    }
}

$log_uuid=getOP('log__uuid');
$cid = getOP('cid');
$coursevers = getOP('coursevers');
$userid = getUid();

header('Content-Type: application/json');

$dataToSend = [
  'debug' => $debug,
  'userid' => $userid,
  'cid' => $cid,
  'coursevers' => $coursevers,
  'log_uuid' => $log_uuid
];

echo callMicroservicePOST("duggaedService/retrieveDuggaedService_ms.php", $dataToSend, true);
