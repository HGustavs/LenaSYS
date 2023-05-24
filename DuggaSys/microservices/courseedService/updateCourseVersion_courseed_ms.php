<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";


// Connect to database and start session
pdoConnect();
session_start();

$cid=getOP('cid');
$coursename=getOP('coursename');
$visibility=getOP('visib');
$coursecode=getOP('coursecode');
$courseGitURL=getOP('courseGitURL');

// will be changed to ms
if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="UNK";
}

// will also be changed to ms (getting username)
// Gets username based on uid, USED FOR LOGGING
$query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query-> execute();

// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
while ($row = $query->fetch(PDO::FETCH_ASSOC)){
	$username = $row['username'];
}
if(strcmp($opt,"UPDATE")===0){
    $query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid;");

    $query->bindParam(':cid', $cid);
    $query->bindParam(':coursename', $coursename);
    $query->bindParam(':visibility', $visibility);
    $query->bindParam(':coursecode', $coursecode);
    $query->bindParam(':courseGitURL', $courseGitURL);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating entries\n".$error[2];
    }

    // Belongs to Logging 
    if($visibility==0){
        $visibilityName = "Hidden";
    }
    else if($visibility==1){
        $visibilityName = "Public";
    }
    else if($visibility==2){
        $visibilityName = "Login";
    }
    else if($visibility==3){
        $visibilityName = "Deleted";
    }

    
    // Logging for editing of course
    $description=$coursename." ".$coursecode." ".$visibilityName;
    logUserEvent($userid, $username, EventTypes::EditCourse, $description);
}
?>