<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include ('../shared_microservices/getUid_ms.php');

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$opt=getOP('opt');
$cid=getOP('cid');
$coursename=getOP('coursename');
$coursecode=getOP('coursecode');
$versid=getOP('versid');
$versname=getOP('versname');

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
}

?>