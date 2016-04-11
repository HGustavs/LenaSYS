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

$debug="NONE!";

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))){

	if(strcmp($opt,"ADDUGGA")===0){
		$querystring="INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,creator) VALUES (:cid,1,1,'New Dugga','test.html',:uid)";
		$stmt = $pdo->prepare($querystring);
		$stmt->bindParam(':cid', $cid);
		$stmt->bindParam(':uid', $userid);

		try{
			$stmt->execute();
		}catch (PDOException $e){
						// Error handling to $debug
		}

}

//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------

if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))){


}

$array = array(
	'entries' => $entries,
	'debug' => $debug,
	'files' => $files,
	'duggaPages' => $duggaPages
	);
/*$t = json_encode($array);
if (!$t){
	echo "Failed: ". $t;
} else {
	echo "success: ". $t;
}*/
echo json_encode($array);
logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "duggaedservice.php");

?>
