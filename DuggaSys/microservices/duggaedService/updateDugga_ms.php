<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../curlService.php";

// Connect to database and start session.
pdoConnect();
session_start();

$userid=getUid();

$qid = getOP('qid');
$opt = getOP('opt');
$uid = getOP('uid');
$name = getOP('nme');
$autograde = getOP('autograde');
$gradesys = getOP('gradesys');
$template = getOP('template');
$qstart = getOP('qstart');
$deadline = getOP('deadline');
$jsondeadline = getOP('jsondeadline');
$release = getOP('release');
$groupAssignment = false;
$debug="NONE!";

if(strcmp($opt,"SAVDUGGA")===0){
    if (strcmp($template, "group-assignment")==0){
        $groupAssignment = true;
    }
    $query = $pdo->prepare("UPDATE quiz SET qname=:qname,autograde=:autograde,gradesystem=:gradesys,quizFile=:template,qstart=:qstart,deadline=:deadline,qrelease=:release,jsondeadline=:jsondeadline,`group`=:group WHERE id=:qid;");
    $query->bindParam(':qid', $qid);
    $query->bindParam(':qname', $name);
    $query->bindParam(':autograde', $autograde);
    $query->bindParam(':gradesys', $gradesys);
    $query->bindParam(':template', $template);
    $query->bindParam(':jsondeadline', $jsondeadline);
    if($groupAssignment) {
        $query->bindValue(':group', 1, PDO::PARAM_INT);
    } else {
        $query->bindValue(':group', 0, PDO::PARAM_INT);
    }
    if (strrpos("UNK",$deadline)!==false) $deadline = null;
    if (strrpos("UNK",$qstart)!==false) $qstart = null;
    if (strrpos("UNK",$release)!==false) $release = null;

    $query->bindParam(':release', $release);
    $query->bindParam(':deadline', $deadline);
    $query->bindParam(':qstart', $qstart);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug.="Error updating dugga ".$error[2];
    }

}

$log_uuid=getOP('log__uuid');
$cid = getOP('cid');
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
