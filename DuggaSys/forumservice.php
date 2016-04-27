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
$threadUID = getOP('threadUID');

$threadId = getOPG('threadId');
if ($threadId==="UNK"){
	$threadId = getOP('threadId');
}

$text = getOP('text');
$courseId = getOP('courseId');
$topicT = getOP('topic');
$descriptionT = getOP('description');
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
		$query = $pdo->prepare("INSERT INTO thread (cid, uid, topic, datecreated, description) VALUES (:courseId, :uid, :topic, current_timestamp, :description)");
		$query->bindParam(':courseId', $courseId);
		$query->bindParam(':uid', $uid);
		$query->bindParam(':topic', $topicT);
		$query->bindParam(':description', $descriptionT);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);
		}else{
			$id = $pdo->lastInsertId();
			$thread = array(
				"threadid" => $id
			);
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
}
else if(strcmp($opt,"MAKEREPLYCOMMENT")===0){
	// Access check
	if ($threadAccess==="normal" || $threadAccess==="super" || $threadAccess==="op"){
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
		$query->bindParam(':topic', $topicT);
		$query->bindParam(':description', $descriptionT);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);
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
		}
	}else{
		$accessDenied = "You do not have access to the thread.";
	}
}else if(strcmp($opt,"GETCOMMENTS")===0){
	// Access check
	if ($threadAccess){
		$query = $pdo->prepare("SELECT threadcomment.text, threadcomment.datecreated, threadcomment.commentid, threadcomment.replyid, user.username, user.uid FROM threadcomment, user WHERE threadid=:threadId and user.uid=threadcomment.uid ORDER BY datecreated DESC;");

		$query->bindParam(':threadId', $threadId);

		if(!$query->execute()){
			$error=$query->errorInfo();
			exit($debug);

		}else{
			//fetches all the comments
			$comment = $query->fetchAll(PDO::FETCH_ASSOC);


			// Decodes special chars
			$comments = decodeComments($comment);






		}
	}else{
		$accessDenied = "You do not have access to the thread.";
	}
}else if(strcmp($opt,"REPLYCOMMENT")===0){
	// Access check
	if ($threadAccess){
		$query = $pdo->prepare("SELECT text, commentid FROM threadcomment WHERE commentid=:commentID;");
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
		'courses' => $courses
	);
	echo json_encode($array);
}

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "forumservice.php");





//------------------------------------------------------------------------------------------------
// Other Functions
//------------------------------------------------------------------------------------------------



// Simple function that decodes all the text from encoded chars e.g  "&lt;strong&gt;asda&lt;&#47;strong&gt" becomes "<strong>asd</asd>".
function decodeComments($encodedComments){

	$decodedComments = array();

	foreach ($encodedComments as $row)
	{

		// Decodes
		$tempText = html_entity_decode($row["text"]);

		// Replaces with the decoded string
		$row["text"] = $tempText;

		// pushes the updated row to the new $comments array
		array_push($decodedComments,$row);
	}

	return $decodedComments;

}

?>
