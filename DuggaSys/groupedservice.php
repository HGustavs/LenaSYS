<?php

// This is a work in progress for the group editor service. 

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
	$loginname=$_SESSION['loginname'];
	$lastname=$_SESSION['lastname'];
	$firstname=$_SESSION['firstname'];
}else{
	$userid=1;
	$loginname="UNK";		
	$lastname="UNK";
	$firstname="UNK";
} 	

$opt = getOP('opt');
$cid = getOP('cid');
$coursevers=getOP('coursevers');

$entries = array();
/* $gentries=array();
$sentries=array();
$lentries=array();
$snus=array(); */


/* $log_uuid = getOP('log_uuid');
$info=$opt." ".$cid." ".$coursevers." ".$luid." ".$vers." ".$listentry." ".$mark;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "groupedservice.php",$userid,$info); */

//------------------------------------------------------------------------------------------------
// Services ??? Here was a few things that updated a few things. Not needed as of now. 
//------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------
// Retrieve Information ??? Here is some SQL that retreives things. 
//------------------------------------------------------------------------------------------------

// Don't retreive all results if request was for a single dugga or a grade update
if(strcmp($opt,"DUGGA")!==0 && strcmp($opt,"CHGR")!==0){
	if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {
		$query = $pdo->prepare("SELECT user_course.cid AS cid,user.uid AS uid,username,firstname,lastname,ssn,class FROM user,user_course WHERE user.uid=user_course.uid AND user_course.cid=:cid AND user_course.vers=:coursevers;");

		$query->bindParam(':coursevers', $vers);
		$query->bindParam(':cid', $cid);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error retreiving users. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
		}

		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			// Create array entry for each course participant

			$entry = array(
				'cid' => (int)$row['cid'],
				'uid' => (int)$row['uid'],
				'username' => $row['username'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname'],
				'ssn' => $row['ssn'],
				'class' => $row['class']
			);

			$entry = array(
				'cid' => (int)$row['cid'],
				'uid' => (int)$row['uid'],
				'username' => $row['username'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname'],
				'ssn' => $row['ssn'],
				'role' => $row['access']
			);
			
			array_push($entries, $entry);
		}
	}
}

$array = array(
	'entries' => $entries, // listentry? 
	/* 'moments' => $gentries, // wut
	'versions' => $sentries,
	'debug' => $debug,
	'results' => $lentries,
	'teachers' => $teachers,
	'duggauser' => $duggauser,
	'duggaentry' => $duggaentry,
	'duggaid' => $duggaid,
	'duggapage' => $duggapage,
	'dugganame' => $dugganame,
	'duggaparam' => $duggaparam,
	'duggaanswer' => $duggaanswer,
	'useranswer' => $useranswer,
	'duggastats' => $duggastats,
	'duggafeedback' => $duggafeedback,
	'moment' => $listentry,
	'files' => $files,
	'gradeupdated' => $gradeupdated,
	'benchmark' => $benchmark */
);

echo json_encode($array);

// logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "groupedservice.php",$userid,$info);
?>
