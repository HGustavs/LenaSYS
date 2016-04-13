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

logServiceEvent($log_uuid, EventTypes::ServiceClientStart, "forumservice.php", $log_timestamp);
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "forumservice.php");

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="1";
}

$cid = getOP('cid');
$uid = getOP('uid');
$opt = getOP('opt');
$threadId = getOP('threadId');
$userID = getOP('userID');
$text = getOP('text');

$debug="NONE!";

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

if(checklogin())
{


}

//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------

if(checklogin()){

	if(strcmp($opt,"GETUSER")===0){
		$query = $pdo->prepare("SELECT * FROM threadcomment WHERE threadid=:threadId ORDER BY datecreated ASC;");
		$query->bindParam(':threadId', $threadId);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);

		}else{
			$comments = $query->fetchAll(PDO::FETCH_ASSOC);
		}
	}else if(strcmp($opt,"GETTHREAD")===0){
		$query = $pdo->prepare("SELECT * FROM thread WHERE threadid=:threadId");
		$query->bindParam(':threadId', $threadId);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);

		}else{
			$thread = $query->fetch(PDO::FETCH_ASSOC);
		}
	}else if(strcmp($opt,"MAKECOMMENT")===0){
		$query = $pdo->prepare("INSERT INTO threadcomment (threadid, uid, text) VALUES (:threadID, :userID, :text)");
		$query->bindParam(':threadID', $threadId);
		$query->bindParam(':userID', $userID);
		$query->bindParam(':text', $text);
		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);

		}else{
			$thread = $query->fetch(PDO::FETCH_ASSOC);
		}
	}else if(strcmp($opt,"GETCOMMENTS")===0){
		$query = $pdo->prepare("SELECT * FROM threadcomment WHERE threadid=:threadId ORDER BY datecreated ASC;");
		$query->bindParam(':threadId', $threadId);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);

		}else{
			$comments = $query->fetchAll(PDO::FETCH_ASSOC);
		}
	}
}

$array = array(
	'user' => $user,
	'thread' => $thread,
	'comments' => $comments
	);



/*$t = json_encode($array);
if (!$t){
	echo "Failed: ". $t;
} else {
	echo "success: ". $t;
}*/
echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "forumservice.php");

?>
