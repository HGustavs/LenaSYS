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

    if($prop=="firstname"){
        $query = $pdo->prepare("UPDATE user SET firstname=:firstname WHERE uid=:uid;");
        $query->bindParam(':firstname', $val);
    }else if($prop=="lastname"){
            $query = $pdo->prepare("UPDATE user SET lastname=:lastname WHERE uid=:uid;");
            $query->bindParam(':lastname', $val);
    }else if($prop=="ssn"){
            $query = $pdo->prepare("UPDATE user SET ssn=:ssn WHERE uid=:uid;");
            $query->bindParam(':ssn', $val);
    }else if($prop=="username"){
            $query = $pdo->prepare("UPDATE user SET username=:username WHERE uid=:uid;");
            $query->bindParam(':username', $val);
    }else if($prop=="class"){
            $query = $pdo->prepare("UPDATE user SET class=:class WHERE uid=:uid;");
            $query->bindParam(':class', $val);
    }

}



?>