<?php
//---------------------------------------------------------------------------------------------------------------
// Microservice readCourseGroupsAndMembers, returns a list of group member related to the provided 
// course id and course version
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";

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
$log_uuid=getOP('log_uuid');
/* Specified group to retrieve members from*/
$showgrp=getOP('showgrp'); 

$grplst=array();
$grpmembershp = null;
$debug = "NONE!";
$uid = "guest";

if(checklogin()){
	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
		$hasread=hasAccess($userid, $courseid, 'r');
		$studentTeacher=hasAccess($userid, $courseid, 'st');
		$haswrite=hasAccess($userid, $courseid, 'w');
	}else{
		$userid="guest";
	}

	if(strcmp($opt,"GRP")===0) {
		$query = $pdo->prepare("SELECT user.uid,user.username,user.firstname,user.lastname,user.email,user_course.groups FROM user,user_course WHERE user.uid=user_course.uid and user_course.cid=:cid AND user_course.vers=:vers;");
		$query->bindParam(':cid', $courseid);
		$query->bindParam(':vers', $coursevers);
		if($query->execute()) {
			foreach($query->fetchAll() as $row) {
		        $grpmembershp=$row['groups'];
				if (!empty($grpmembershp)){
					// just need two first letters for comparison
					$grpletters = $grpmembershp[0] . $grpmembershp[1];
					// Collect members part of the group specified in $showgrp
					if (strpos($showgrp, $grpletters)!==false){
						$email=$row['email'];
						if(is_null($email)){
							$email=$row['username']."@student.his.se";
						}
						array_push($grplst, array($row['groups'],$row['firstname'],$row['lastname'],$email));
					}
				}
			}
			sort($grplst);
		}else{
			$debug="Failed to get group members!";
		}
	} 	
}

$postData = [
    'debug' => $debug,
    'opt' => $opt,
    'uid' => $userid,
    'cid' => $courseid,
    'vers' => $coursevers,
    'log_uuid' => $log_uuid
];

header("Content-Type: application/json");
$response = callMicroservicePOST("sectionedService/retrieveSectionedService_ms.php", $postData, true );
$data = json_decode($response, true);
$data['grplst'] = $grplst;
$data['grpmembershp'] = $grpmembershp;
echo json_encode($data);
return;

?>
