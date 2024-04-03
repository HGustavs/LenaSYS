<?php

//---------------------------------------------------------------------------------------------------------------
// editorService - Saves and Reads content for Code Editor
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../../../../coursesyspw.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="guest";
}

$opt=getOP('opt');
$courseid=getOP('courseid');
$coursevers=getOP('coursevers');
$coursename=getOP('coursename');
$versid=getOP('versid');
$showgrps=getOP('showgrp');
$studentTeacher = false;

$groups=array();
$grplst=array();

$isSuperUserVar=false;
$hasread=hasAccess($userid, $courseid, 'r');
$studentTeacher=hasAccess($userid, $courseid, 'st');
$haswrite=hasAccess($userid, $courseid, 'w');

if(checklogin()){
	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
		$hasread=hasAccess($userid, $courseid, 'r');
		$studentTeacher=hasAccess($userid, $courseid, 'st');
		$haswrite=hasAccess($userid, $courseid, 'w');
	}else{
		$userid="guest";
	}

	$ha = $haswrite || isSuperUser($userid);
	if(strcmp($opt,"GRP")===0) {
		$query = $pdo->prepare("SELECT user.uid,user.username,/*user.firstname,user.lastname,*/user.email,user_course.groups FROM user,user_course WHERE user.uid=user_course.uid AND cid=:cid AND vers=:vers;");
		$query->bindParam(':cid', $courseid);
		$query->bindParam(':vers', $coursevers);
		if($query->execute()) {
			$showgrps=explode(',',$showgrps);
			$showgrp=$showgrps[0];
			if($ha || $studentTeacher)$showgrp=explode('_',$showgrp)[0];
			foreach($query->fetchAll() as $row) {
				$grpmembershp=$row['groups'];
				$idx=strpos($grpmembershp,$showgrp);
				while($idx!==false){
					$grp=substr($grpmembershp,$idx,strpos($grpmembershp,' ',$idx)-$idx);
					$email=$row['email'];
					if(is_null($email)){
						$email=$row['username']."@student.his.se";
					}
					$idx=strpos($grpmembershp,$showgrp,$idx+1);
				}
			}
			sort($grplst);
		}else{
			$debug="Failed to get group members!";
		}
	} 	
}
//echo json_encode($grplst); <- use this ?
echo json_encode(array('grplst' => $grplst));
return;
?>
