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


}
	
	















?>