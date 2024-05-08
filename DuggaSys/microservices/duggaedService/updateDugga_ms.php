<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

// Connect to database and start session.
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="1";
}

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
?>
