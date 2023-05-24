<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";


// Connect to database and start session
pdoConnect();
session_start();

$opt=getOP('opt');
$cid=getOP('cid');
$coursename=getOP('coursename');
$visibility=getOP('visib');
$activevers=getOP('activevers');
$activeedvers=getOP('activeedvers');
$versid=getOP('versid');
$versname=getOP('versname');
$coursenamealt=getOP('coursenamealt');
$coursecode=getOP('coursecode');
$copycourse=getOP('copycourse');
$startdate=getOP('startdate');
$enddate=getOP('enddate');
$makeactive=getOP('makeactive');
$motd=getOP('motd');
$readonly=getOP('readonly');
$courseGitURL=getOP('courseGitURL'); // for github url
$LastCourseCreated=array();


if(strcmp($opt,"CHGVERS")===0){
    $query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':vers', $versid);
    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating entries\n".$error[2];
    }
}


?>