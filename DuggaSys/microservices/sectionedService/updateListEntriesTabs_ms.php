<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "retrieveSectionedService_ms.php";

// Connect to database and start session.
pdoConnect();
session_start();

$opt=getOP('opt');
$sectid=getOP('lid');
$tabs=getOP('tabs');
$courseid = getOP('courseid');
$coursevers = getOP('coursevers');
$log_uuid=getOP('log_uuid');

$userid = getUid();
if (checklogin()) { //This entire checklogin should be working by using the getUid instead, but for the time being it doesn't.
    if (isSuperUser($userid)) {
        if(strcmp($opt,"UPDATETABS")===0){
            $query = $pdo->prepare("UPDATE listentries SET gradesystem=:tabs WHERE lid=:lid;");
            $query->bindParam(':lid', $sectid);
            $query->bindParam(':tabs',$tabs);

            if(!$query->execute()){
                $error=$query->errorInfo();
                $debug="ERROR: Failed to update gradesystem. Details: ".$error[2];
            }
        }
    }
}

$data = retrieveSectionedService($debug, $opt, $pdo, $userid, $courseid, $coursevers, $log_uuid);
echo json_encode($data);
return;