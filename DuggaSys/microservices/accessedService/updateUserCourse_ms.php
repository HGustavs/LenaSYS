<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/sessions.php";     
include_once "../curlService.php";

// connect to database
pdoConnect();
session_start();
// get userId and courseId
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php"); 
$cid = getOP('courseid');

// What change will be done
$prop=getOP('prop');


//values that will be changed 
$groups=getOP('group');
$vers = getOP('vers');
$access = getOP('access');;

if (hasAccess($userid, $cid, 'w') || isSuperUser($userid)) {
	$hasAccess = true;
} else {
	$hasAccess = false;
} 

if(checklogin() && $hasAccess) {
		// User_Course Table Updates
		if($prop=="examiner"){
				$query = $pdo->prepare("UPDATE user_course SET examiner=:examiner WHERE uid=:uid AND cid=:cid;");
				//Saves if the user changes examiner to none.
				if($examinerValue == "None"){
					$examinerValue = NULL;
				}
				$query->bindParam(':examiner', $examinerValue);
                $query->bindParam(':uid', $userid);
				$query->bindParam(':cid', $cid);

		}else if($prop=="vers"){
				$query = $pdo->prepare("UPDATE user_course SET vers=:vers WHERE uid=:uid AND cid=:cid;");
				$query->bindParam(':vers', $vers);
                $query->bindParam(':uid', $userid);
				$query->bindParam(':cid', $cid);

		}else if($prop=="access"){
				$query = $pdo->prepare("UPDATE user_course SET access=:access WHERE uid=:uid AND cid=:cid;");
                // wait on this one.
				$query->bindParam(':access', $access);
                $query->bindParam(':uid', $userid);
				$query->bindParam(':cid', $cid);

		}else if($prop=="group"){
				$query = $pdo->prepare("UPDATE user_course SET groups=:groups WHERE uid=:uid AND cid=:cid;");
                // wait on this one.
				$query->bindParam(':groups', $groups);
                $query->bindParam(':uid', $userid);
				$query->bindParam(':cid', $cid);
		}

        if(!$query->execute()) {
                $error=$query->errorInfo();
                $debug="Error updating user\n".$error[2];
        }
}

?>