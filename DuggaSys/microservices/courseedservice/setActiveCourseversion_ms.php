<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
include_once '../shared_microservices/getUid_ms.php';

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$opt=getOP('opt');
$cid=getOP('cid');
$versid=getOP('versid');
$makeactive=getOP('makeactive');

getUid();

$query = $pdo->prepare("SELECT coursename,coursecode,cid,visibility,activeversion,activeedversion FROM course ORDER BY coursename");

if(strcmp($opt,"UPDATEVRS")===0){
    $query = $pdo->prepare("UPDATE vers SET versname=:versname WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':coursecode', $coursecode);
    $query->bindParam(':vers', $versid);
    $query->bindParam(':versname', $versname);

    if(!$query->execute()) {
            $error=$query->errorInfo();
            $debug="Error updating entries\n".$error[2];
    }
    if($makeactive==3){
            $query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
            $query->bindParam(':cid', $courseid);
            $query->bindParam(':vers', $versid);

            if(!$query->execute()) {
                    $error=$query->errorInfo();
                    $debug="Error updating entries\n".$error[2];
            }	
    }
}


?>