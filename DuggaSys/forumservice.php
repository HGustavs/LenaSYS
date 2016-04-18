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
	$uid=$_SESSION['uid'];
}else{
	$uid="UNK";
}

$cid = getOP('cid');
$opt = getOP('opt');

$threadId = getOPG('threadId');
if ($threadId==="UNK"){
	$threadId = getOP('threadId');
}

$text = getOP('text');
$courseId = getOP('courseId');
$topicT = getOP('topic');
$descriptionT = getOP('description');

$debug="NONE!";

$threadAccess = getThreadAccess($pdo, $threadId, $uid);

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

function getThreadAccess($pdo, $threadId, $uid)
{
	$threadAccess = NULL;

	$query = $pdo->prepare("SELECT uid, hidden FROM thread WHERE threadid=:threadId");

	$query->bindParam(':threadId', $threadId);

	if(!$query->execute()){
		$error=$query->errorInfo();
		exit($debug);
	}else{
		$thread = $query->fetch(PDO::FETCH_ASSOC);
	}

	if (!$thread['hidden']){
		$threadAccess = "public";
	}

	if ($thread['uid']===$uid){
		$threadAccess = "op";
	}else {
		// Check if user is super
		if (isSuperUser($uid))
		{
			$threadAccess = "super";
		}else{
			// Check if user is super
			$query = $pdo->prepare("SELECT uid FROM threadaccess WHERE threadid=:threadId AND uid=:uid;");
			$query->bindParam(':threadId', $threadId);
			$query->bindParam(':uid', $uid);

			if(!$query->execute()){
				$error=$query->errorInfo();
				exit($debug);
			}else{
				if ($query->fetch(PDO::FETCH_ASSOC))
				{
					$threadAccess = "normal";
				}
			}
		}
	}
	return $threadAccess;
}

if(strcmp($opt,"CREATETHREAD")===0){
	// Access check
	if (checklogin()){
		$query = $pdo->prepare("INSERT INTO thread (cid, uid, topic, description) VALUES (:courseId, :uid, :topic, :description)");
		$query->bindParam(':courseId', $courseId);
		$query->bindParam(':uid', $uid);
		$query->bindParam(':topic', $topicT);
		$query->bindParam(':description', $descriptionT);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);
		}else{
			$thread = $query->fetch(PDO::FETCH_ASSOC);
		}
	}else{
		$accessDenied = "You must be logged in to create a thread.";
	}

}else if(strcmp($opt,"MAKECOMMENT")===0){
	// Access check
	if ($threadAccess==="normal" || $threadAccess==="super" || $threadAccess==="op"){
		$query = $pdo->prepare("INSERT INTO threadcomment (threadid, uid, text, datecreated) VALUES (:threadID, :uid, :text, current_timestamp)");
		$query->bindParam(':threadID', $threadId);
		$query->bindParam(':uid', $uid);
		$query->bindParam(':text', $text);
		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);
		}else{
			$comments = $query->fetch(PDO::FETCH_ASSOC);
		}
	}else {
		$accessDenied = "You must log in to comment.";
	}
}


//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------


else if(strcmp($opt,"GETTHREAD")===0){
	// Access check
	if ($threadAccess){
		$query = $pdo->prepare("SELECT * FROM thread WHERE threadid=:threadId");
		$query->bindParam(':threadId', $threadId);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);
		}else{
			$thread = $query->fetch(PDO::FETCH_ASSOC);
		}
	}else{
		$accessDenied = "You do not have access to the thread.";
	}
}else if(strcmp($opt,"GETCOMMENTS")===0){
	// Access check
	if ($threadAccess){
		$query = $pdo->prepare("SELECT threadcomment.text, threadcomment.datecreated, user.username FROM threadcomment, user WHERE threadid=:threadId and user.uid=threadcomment.uid ORDER BY datecreated ASC;");
		$query->bindParam(':threadId', $threadId);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);

		}else{
			$comments = $query->fetchAll(PDO::FETCH_ASSOC);
		}
	}else{
		$accessDenied = "You do not have access to the thread.";
	}
}

if ($opt!=="UNK"){
	$array = array(
		'accessDenied' => $accessDenied,
		'thread' => $thread,
		'comments' => $comments
	);
	echo json_encode($array);
}

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "forumservice.php");
?>
