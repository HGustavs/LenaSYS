<?php
//---------------------------------------------------------------------------------------------------------------
// changeActiveCourseVersion_sectioned_ms
//---------------------------------------------------------------------------------------------------------------
// Microservice that updates the active version of a course
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";

pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="guest";
}

$courseid = getOP('cid');
$versid = getOP('vers');

// Authorization
$isSuperUserVar = isSuperUser($userid);
$ha = (checklogin() && ($haswrite || $isSuperUserVar));

if($ha || $studentTeacher) {
    $query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':vers', $versid);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating entries".$error[2];
    }
}
