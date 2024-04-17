<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../shared_microservices/getUid_ms.php";

pdoConnect();
session_start();

$cid=getOP('cid');
$qid = getOP('qid');
$userid = getUid();
$coursevers = getOP('coursevers');
$name = getOP('nme');
$autograde = getOP('autograde');
$gradesys = getOP('gradesys');
$template = getOP('template');
$groupAssignment = false;
$debug="NONE!";
$jsondeadline = getOP('jsondeadline');

if(is_null($qid)||strcmp($qid,"UNK")===0){
    $query = $pdo->prepare("INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) VALUES (:cid,:autograde,:gradesys,:qname,:template,:release,:deadline,:uid,:coursevers,:qstart,:jsondeadline,:group)");
    $query->bindParam(':cid', $cid);
    $query->bindParam(':uid', $userid);
    $query->bindParam(':coursevers', $coursevers);
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

?>
