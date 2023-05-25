<?php
date_default_timezone_set("Europe/Stockholm");
include ("../../../Shared/sessions.php");
include('../shared_microservices/getUid_ms.php');

// Connect to database and start session
pdoConnect();
session_start();

$opt=getOP('opt');
$motd=getOP('motd');
$readonly=getOP('readonly');


// $cid=getOP('cid');
// $coursename=getOP('coursename');
// $visibility=getOP('visib');
// $activevers=getOP('activevers');
// $activeedvers=getOP('activeedvers');
// $versid=getOP('versid');
// $versname=getOP('versname');
// $coursenamealt=getOP('coursenamealt');
// $coursecode=getOP('coursecode');
// $copycourse=getOP('copycourse');
// $startdate=getOP('startdate');
// $enddate=getOP('enddate');
// $makeactive=getOP('makeactive');


// $courseGitURL=getOP('courseGitURL'); // for github url
// $LastCourseCreated=array();

// if(checklogin() && (hasAccess(getUid())=="w" || isSuperUser(getUid()))) {
// if(strcmp($opt,"SETTINGS")===0){
    $query = $pdo->prepare("INSERT INTO settings (motd,readonly) VALUES (:motd, :readonly);");

    $query->bindParam(':motd', hasAccess(getUid()));
    if($readonly == "UNK") {$readonly=0;}
    $query->bindParam(':readonly', $readonly);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating entries\n".$error[2];
    }
// }
// }
?>