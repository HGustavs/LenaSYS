<?php

date_default_timezone_set("Europe/Stockholm");
// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
// connect to database
pdoConnect();
session_start();
// get userId and courseId
$userid = getUid(); 
$cid = getOP('courseid');


if (hasAccess($userid, $cid, 'w') || isSuperUser($userid)) {
	$hasAccess = true;
} else {
	$hasAccess = false;
} 


if(checklogin() && $hasAccess) {

    if(strcmp($opt,"UPDATE")==0){

		// User_Course Table Updates
		if($prop=="examiner"){
				$query = $pdo->prepare("UPDATE user_course SET examiner=:examiner WHERE uid=:uid AND cid=:cid;");
				//Saves if the user changes examiner to none.
				if($val == "None"){
					$val = NULL;
				}
				$query->bindParam(':examiner', $val);
		}else if($prop=="vers"){
				$query = $pdo->prepare("UPDATE user_course SET vers=:vers WHERE uid=:uid AND cid=:cid;");
				$query->bindParam(':vers', $val);
		}else if($prop=="access"){
				$query = $pdo->prepare("UPDATE user_course SET access=:access WHERE uid=:uid AND cid=:cid;");
				$query->bindParam(':access', $val);
		}else if($prop=="group"){
				$query = $pdo->prepare("UPDATE user_course SET `groups`=:groups WHERE uid=:uid AND cid=:cid;");
				$query->bindParam(':groups', $val);
		}

		if($prop=="examiner"||$prop=="vers"||$prop=="access"||$prop=="group"){
				$query->bindParam(':cid', $cid);
		}

		if(/*$prop=="firstname"||$prop=="lastname"||$prop=="ssn"||*/$prop=="username"||$prop=="class"||$prop=="examiner"||$prop=="vers"||$prop=="access"||$prop=="group"){
				$query->bindParam(':uid', $uid);
				if(!$query->execute()) {
						$error=$query->errorInfo();
						$debug="Error updating user\n".$error[2];
				}
		}else{
				$debug="Failed to update property ".$prop." with value ".$val;
		}
	}




}
	
	















?>