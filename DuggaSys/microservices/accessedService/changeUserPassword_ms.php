<?php

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../shared_microservices/getUid_ms.php";

pdoConnect(); 
session_start();

$opt=getOP('opt');
$uid = getUid();
$pw = getOP('pw');
$username="UNK";

/* Change to microservice call after it is implemented */
// Gets username based on uid, USED FOR LOGGING
$query = $pdo->prepare("SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $uid);
$query->execute();

// This while is only performed if userid was set through getUid(), a guest will not have it's username set, USED FOR LOGGING
while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
    $username = $row['username'];
}

/* Changing password */
if(strcmp($opt,"CHPWD")==0){
    $query = $pdo->prepare("UPDATE user set password=:pwd, requestedpasswordchange=0 where uid=:uid;");
    $query->bindParam(':uid', $uid);
    $query->bindParam(':pwd', standardPasswordHash($pw));

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating user\n".$error[2];
    }
    //log for reset password.
}

logUserEvent($uid, $username, EventTypes::ResetPW, "");
?>
