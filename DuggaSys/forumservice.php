<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

$log_uuid = getOP('log_uuid');
$log_timestamp = getOP('log_timestamp');

logServiceEvent($log_uuid, EventTypes::ServiceClientStart, "threadservice.php", $log_timestamp);
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "threadservice.php");

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="1";
}

$cid = getOP('cid');

$uid = getOP('uid');

$threadId = getOP('threadId');

$debug="NONE!";

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))){



	if(strcmp($opt,"GETCOMMENTS")===0){
		$querystring="SELECT * FROM thread WHERE threadID=:threadId";
		$stmt = $pdo->prepare($querystring);
		$stmt->bindParam(':threadId', $threadId);

		try{
			$stmt->execute();
			$comments = $stmt->fetchAll();
			echo "dwadawd";

		}catch (PDOException $e){
			echo "failure";

						// Error handling to $debug
		}
	}

}

//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------

if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))){


}

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "forumservice.php");

?>
