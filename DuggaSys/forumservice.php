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
$class = getOP('class');
$opt = getOP('opt');
$threadUID = getOP('threadUID');

$threadId = getOPG('threadId');
if ($threadId==="UNK"){
	$threadId = getOP('threadId');
}

$text = getOP('text');
$courseId = getOP('courseId');
$topic = getOP('topic');
$description = getOP('description');
$accessList = explode(',', getOP('accessList'));
$lockedStatus = getOP('lockedStatus');
$commentid = getOP('commentid');

$debug="NONE!";

if (($threadId && $threadId !== "UNK") || $opt){
	$threadAccess = getThreadAccess($pdo, $threadId, $uid);
}

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
		if (!$accessList) {
			$hidden = NULL;
		}else {
			$hidden = 1;
		}
		if ($lockedStatus==="open") {
			$locked = NULL;
		}else {
			$locked = 1;
		}

		$query = $pdo->prepare("INSERT INTO thread (cid, uid, topic, datecreated, hidden, description, locked, lastcommentedon) VALUES (:cid, :uid, :topic, current_timestamp, :hidden, :description, :locked, current_timestamp)");
		$query->bindParam(':cid', $cid);
		$query->bindParam(':uid', $uid);
		$query->bindParam(':topic', $topic);
		$query->bindParam(':hidden', $hidden);
		$query->bindParam(':description', $description);
		$query->bindParam(':locked', $locked);


		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);
		}else{
			$id = $pdo->lastInsertId();
			$thread = array(
				"threadid" => $id
			);

			// Give thread creator access
			$query = $pdo->prepare("INSERT INTO threadaccess (threadid, uid) VALUES (:threadid, :uid)");
			$query->bindParam(':threadid', $id);
			$query->bindParam(':uid', $uid);

			if(!$query->execute()){
				$error=$query->errorInfo();
				exit($debug);
			}

			if ($hidden){
				for ($i = 0; $i < count($accessList); $i++){
					$query = $pdo->prepare("INSERT INTO threadaccess (threadid, uid) VALUES (:threadid, :uid)");
					$query->bindParam(':threadid', $id);
					$query->bindParam(':uid', $accessList[$i]);

					if(!$query->execute()){
						$error=$query->errorInfo();
						exit($debug);
					}
				}
			}
		}
	}else{
		$accessDenied = "You must be logged in to create a thread.";
	}

}else if(strcmp($opt,"MAKECOMMENT")===0){
	// Access check
	if ($threadAccess==="normal" || $threadAccess==="super" || $threadAccess==="op"){
		if ($commentid && $commentid !== "UNK")
		{
			$query = $pdo->prepare("INSERT INTO threadcomment (threadid, uid, text, datecreated, replyid) VALUES (:threadID, :uid, :text, current_timestamp, :commentid)");
			$query->bindParam(':threadID', $threadId);
			$query->bindParam(':uid', $uid);
			$query->bindParam(':text', $text);
			$query->bindParam(':commentid', $commentid);
			if(!$query->execute()){
				$error=$query->errorInfo();
				exit($debug);
			}else{
				$comments = $query->fetch(PDO::FETCH_ASSOC);
				$query = $pdo->prepare("UPDATE thread SET lastcommentedon=current_timestamp WHERE threadid=:threadid");
				$query->bindParam(':threadid', $threadId);
				if(!$query->execute()){
					$error=$query->errorInfo();
					exit($debug);
				}else{
					$lastcommentedon = $query->fetch(PDO::FETCH_ASSOC);
				}
			}
		}
		else {
			$query = $pdo->prepare("INSERT INTO threadcomment (threadid, uid, text, datecreated) VALUES (:threadID, :uid, :text, current_timestamp)");
			$query->bindParam(':threadID', $threadId);
			$query->bindParam(':uid', $uid);
			$query->bindParam(':text', $text);
			if(!$query->execute()){
				$error=$query->errorInfo();
				exit($debug);
			}else{
				$comments = $query->fetch(PDO::FETCH_ASSOC);
				$query = $pdo->prepare("UPDATE thread SET lastcommentedon=current_timestamp WHERE threadid=:threadid");
				$query->bindParam(':threadid', $threadId);
				if(!$query->execute()){
					$error=$query->errorInfo();
					exit($debug);
				}else{
					$lastcommentedon = $query->fetch(PDO::FETCH_ASSOC);
				}
			}
		}

	}else {
		$accessDenied = "You must log in to comment.";
	}
}else if(strcmp($opt,"DELETECOMMENT")===0){
	// Access check
	if ($threadAccess){
		$query = $pdo->prepare("SELECT uid FROM threadcomment WHERE commentid=:commentid");
		$query->bindParam(':commentid', $commentid);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);

		}else{
			$comment = $query->fetch(PDO::FETCH_ASSOC);

			if ($comment["uid"]===$uid || $threadAccess==="op" || $threadAccess==="super"){
				$query = $pdo->prepare("DELETE FROM threadcomment WHERE commentid=:commentid");
				$query->bindParam(':commentid', $commentid);

				if(!$query->execute()){
					$error=$query->errorInfo();
					exit($debug);
				}
			}else{
				$accessDenied = "You can only delete your own comments.";
			}
		}
	}else{
		$accessDenied = "You do not have access to this thread.";
	}
}else if(strcmp($opt,"LOCKTHREAD")===0){
	// Access check
	if ($threadAccess==="op" || $threadAccess==="super"){
		$query = $pdo->prepare("UPDATE thread SET locked='1' WHERE threadid=:threadid");
		$query->bindParam(':threadid', $threadId);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);
		}
	}else{
		$accessDenied = "You do not have permission to lock this thread.";
	}
}else if(strcmp($opt,"DELETETHREAD")===0){
	// Access check
	if ($threadAccess==="op" || $threadAccess==="super"){
		$query = $pdo->prepare("DELETE FROM thread WHERE threadid=:threadid");
		$query->bindParam(':threadid', $threadId);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);
		}
	}else{
		$accessDenied = "You do not have permisson to delete this thread.";
	}
}else if(strcmp($opt,"UNLOCKTHREAD")===0){
	// Access check
	if ($threadAccess==="op" || $threadAccess==="super"){
		$query = $pdo->prepare("UPDATE thread SET locked=null WHERE threadid=:threadid");
		$query->bindParam(':threadid', $threadId);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);
		}
	}else{
		$accessDenied = "You do not have permisson to unlock this thread.";
	}
}else if(strcmp($opt,"EDITTHREAD")===0){
	// Access check
	if ($threadAccess==="op" || $threadAccess==="super"){
		$query = $pdo->prepare("UPDATE thread SET topic=:topic,description=:description WHERE threadid=:threadid");
		$query->bindParam(':threadid', $threadId);
		$query->bindParam(':topic', $topic);
		$query->bindParam(':description', $description);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);
		}
	}else{
		$accessDenied = "You do not have permisson to edit this thread.";
	}
}else if(strcmp($opt,"GETPRIVATETHREADMEMBERS")===0){
	// Access check
	if ($threadAccess){
		$query = $pdo->prepare("SELECT user.username FROM user,threadaccess WHERE (threadaccess.threadid=:threadid AND user.uid=threadaccess.uid)");
		$query->bindParam(':threadid', $threadId);

	if(!$query->execute()){
		$error=$query->errorInfo();
		exit($debug);
	}else{
		$privateMembers = $query->fetchAll(PDO::FETCH_ASSOC);
	}
	}else{
		$accessDenied = "You do not have permisson to edit this thread.";
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

			if (!$thread){
				$accessDenied = "Error, cannot find thread.";
			}
		}
	}else{
		$accessDenied = "You do not have access to the thread.";
	}
}else if(strcmp($opt,"GETCOMMENTS")===0){
	// Access check
	if ($threadAccess){
		$query = $pdo->prepare("SELECT threadcomment.text, threadcomment.datecreated, threadcomment.commentid, threadcomment.replyid, user.username, user.uid FROM threadcomment, user WHERE threadid=:threadId and user.uid=threadcomment.uid ORDER BY datecreated ASC;");

		$query->bindParam(':threadId', $threadId);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);

		}else{
			//fetches all the comments

			$comments = $query->fetchAll(PDO::FETCH_ASSOC);

		}
	}else{
		$accessDenied = "You do not have access to the thread.";
	}
}else if(strcmp($opt,"REPLYCOMMENT")===0){
	// Access check
	if ($threadAccess){
		$query = $pdo->prepare("SELECT text, replyid, commentid FROM threadcomment WHERE commentid=:commentID;");
		$query->bindParam(':commentID', $commentid);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);

		}else{
			$comments = $query->fetchAll(PDO::FETCH_ASSOC);
		}
	}else{
		$accessDenied = "You do not have access to the thread.";
	}
}else if(strcmp($opt,"GETCOURSES")===0){
	$query = $pdo->prepare("SELECT cid, coursecode, coursename FROM course");
	$query->bindParam(':threadid', $threadId);

	if(!$query->execute()){
		$error=$query->errorInfo();
		exit($debug);
	}else {
		$courses = $query->fetchAll(PDO::FETCH_ASSOC);
	}
}else if(strcmp($opt,"GETCLASSES")===0){
	$query = $pdo->prepare("SELECT class FROM programcourse WHERE cid=:cid");
	$query->bindParam(':cid', $cid);

	if(!$query->execute()){
		$error=$query->errorInfo();
		exit($debug);
	}else {
		$classes = $query->fetchAll(PDO::FETCH_ASSOC);
	}
}else if(strcmp($opt,"GETUSERS")===0){
	$query = $pdo->prepare("SELECT uid, username FROM user WHERE class=:class");
	$query->bindParam(':class', $class);

	if(!$query->execute()){
		$error=$query->errorInfo();
		exit($debug);
	}else {
		$users = $query->fetchAll(PDO::FETCH_ASSOC);
	}
}else if(strcmp($opt,"GETTHREADCREATOR")===0){
	$query = $pdo->prepare("SELECT user.username FROM user,thread WHERE (thread.threadid=:threadid AND thread.uid=user.uid AND user.uid=:threadUID)");
	$query->bindParam(':threadid', $threadId);
	$query->bindParam(':threadUID', $threadUID);

	if(!$query->execute()){
		$error=$query->errorInfo();
		exit($debug);
	}else {
		$courses = $query->fetchAll(PDO::FETCH_ASSOC);
	}
}



if ($opt!=="UNK"){
	$array = array(
		'accessDenied' => $accessDenied,
		'thread' => $thread,
		'comments' => $comments,
		'threadAccess' => $threadAccess,
		'uid' => $uid,
		'courses' => $courses,
		'classes' => $classes,
		'users' => $users,
		'privateMembers' => $privateMembers
	);
	echo json_encode($array);
}


logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "forumservice.php");
