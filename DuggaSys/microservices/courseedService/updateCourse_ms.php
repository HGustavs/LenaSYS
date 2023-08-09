<?php

//---------------------------------------------------------------------------------------------------------------
// updateCourse - Updates coursename, visibility, coursecode and courseGitURL of a given course
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../../../../coursesyspw.php";

// Connect to database and start session
pdoConnect();
session_start();

$cid = getOP('cid');
$coursename = getOP('coursename');
$visibility = getOP('visib');
$coursecode = getOP('coursecode');
$courseGitURL = getOP('courseGitURL');


if(checklogin()){
	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="UNK";
	}
	$isSuperUserVar=isSuperUser($userid);

	$ha = $isSuperUserVar;

	if($ha){
    $query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid;");

    $query->bindParam(':cid', $cid);
        $query->bindParam(':coursename', $coursename);
        $query->bindParam(':visibility', $visibility);
        $query->bindParam(':coursecode', $coursecode);
        $query->bindParam(':courseGitURL', $courseGitURL);

    if(!$query->execute()) {
      $error=$query->errorInfo();
      $debug="Error updating entries\n".$error[2];
    }
  }
}
?>