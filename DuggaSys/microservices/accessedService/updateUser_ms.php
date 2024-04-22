<?php
date_default_timezone_set("Europe/Stockholm");
// Include basic application services!
include_once "../../../Shared/sessions.php";     
include_once "../shared_microservices/getUid_ms.php";
// connect to database
pdoConnect();
session_start();
// get userId and courseId
$userid = getUid(); 

// get the rest of values
$uid = getOP('uid');
$firstname = getOP('firstname');
$lastname = getOP('lastname');
$ssn = getOP('ssn');
$username = getOP('username');
$className = getOP('className');




if(checklogin() && isSuperUser($userid) == true) {

    if($prop=="firstname"){
        
        $query = $pdo->prepare("UPDATE user SET firstname=:firstname WHERE uid=:uid;");
        $query->bindParam(':firstname', $firstname);
        $query->bindParam(':uid', $uid);
        
    }else if($prop=="lastname"){
            $query = $pdo->prepare("UPDATE user SET lastname=:lastname WHERE uid=:uid;");
            $query->bindParam(':lastname', $lastname);
            $query->bindParam(':uid', $uid);
    }else if($prop=="ssn"){
            $query = $pdo->prepare("UPDATE user SET ssn=:ssn WHERE uid=:uid;");
            $query->bindParam(':ssn', $ssn);
            $query->bindParam(':uid', $uid);
    }else if($prop=="username"){
            $query = $pdo->prepare("UPDATE user SET username=:username WHERE uid=:uid;");
            $query->bindParam(':username', $username);
            $query->bindParam(':uid', $uid);
    }else if($prop=="class"){
            $query = $pdo->prepare("UPDATE user SET class=:class WHERE uid=:uid;");
            $query->bindParam(':class', $className);
            $query->bindParam(':uid', $uid);
    }
   
    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating entries\n".$error[2];
    }
}


?>