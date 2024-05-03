<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "retrieveSectionedService_ms.php";

// Connect to database and start session.
pdoConnect();
session_start();

$opt=getOP('opt');
$sectid=getOP('lid');
$tabs=getOP('tabs');

if(strcmp($opt,"UPDATETABS")===0){
    $query = $pdo->prepare("UPDATE listentries SET gradesystem=:tabs WHERE lid=:lid;");
    $query->bindParam(':lid', $sectid);
    $query->bindParam(':tabs',$tabs);

    if(!$query->execute()){
        $error=$query->errorInfo();
        $debug="ERROR: Failed to update gradesystem. Details: ".$error[2];
    }
}

echo json_encode(retrieveSectionedService($debug, $opt, $pdo, $uid, $courseid, $coursevers, $log_uuid));
