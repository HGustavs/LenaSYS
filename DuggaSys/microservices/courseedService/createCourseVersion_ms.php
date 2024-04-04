<?php

date_default_timezone_set("Europe/Stockholm");
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
include ('../shared_microservices/getUid_ms.php');

// Connect to database and start session.
pdoConnect();
session_start();

getUid();

$opt=getOP('opt');
$cid=getOP('cid');
$coursecode=getOP('coursecode');
$coursename=getOP('coursename');
$coursenamealt=getOP('coursenamealt');
$versname=getOP('versname');
$versid=getOP('versid');
$motd=getOP('motd');

if(strcmp($opt,"NEWVRS")===0){
    $query = $pdo->prepare("INSERT INTO vers(cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate,motd) values(:cid,:coursecode,:vers,:versname,:coursename,:coursenamealt,:startdate,:enddate,:motd);");

    $query->bindParam(':cid', $cid);
    $query->bindParam(':coursecode', $coursecode);
    $query->bindParam(':vers', $versid);
    $query->bindParam(':versname', $versname);
    $query->bindParam(':coursename', $coursename);
    $query->bindParam(':coursenamealt', $coursenamealt);
    $query->bindParam(':motd', $motd);

}


            
?>   