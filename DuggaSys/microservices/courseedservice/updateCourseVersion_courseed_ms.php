<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
include ('../shared_microservices/getUid_ms.php');

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$opt=getOP('opt');
$cid=getOP('cid');
$coursename=getOP('coursename');
$coursecode=getOP('coursecode');
$versid=getOP('versid');
$versname=getOP('versname');

getUid();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="UNK";
}
$ha=null;
$debug="NONE!";

// Gets username based on uid, USED FOR LOGGING
$query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query-> execute();

// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
while ($row = $query->fetch(PDO::FETCH_ASSOC)){
	$username = $row['username'];
}


$query = $pdo->prepare("SELECT coursename,coursecode,cid,visibility,activeversion,activeedversion FROM course ORDER BY coursename");

if(strcmp($opt,"UPDATEVRS")===0){
    $query = $pdo->prepare("UPDATE vers SET versname=:versname WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':coursecode', $coursecode);
    $query->bindParam(':vers', $versid);
    $query->bindParam(':versname', $versname);

    if(!$query->execute()) {
            $error=$query->errorInfo();
            $debug="Error updating entries\n".$error[2];
    }

}

?>