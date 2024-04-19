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

//no idea what these do
$prop=getOP('prop');
$val=getOP('val');
$vers = getOP('vers');

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
				$query->bindParam(':access', $val);
                $query->bindParam(':uid', $userid);
				$query->bindParam(':cid', $cid);

		}else if($prop=="group"){
				$query = $pdo->prepare("UPDATE user_course SET groups=:groups WHERE uid=:uid AND cid=:cid;");
                // wait on this one.
				$query->bindParam(':groups', $val);
                $query->bindParam(':uid', $userid);
				$query->bindParam(':cid', $cid);
		}

        if(!$query->execute()) {
                $error=$query->errorInfo();
                $debug="Error updating user\n".$error[2];
        }


}
	
	















?>