

<?php
//---------------------------------------------------------------------------------------------------------------
// Microservice updateQuizDeadline updates the deadline for a quiz (dugga)
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
include_once "../DuggaSys/gitfetchService.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="guest";
}

// Gets username based on uid, USED FOR LOGGING
$query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query-> execute();

// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
while ($row = $query->fetch(PDO::FETCH_ASSOC)){
	$username = $row['username'];
}


$opt=getOP('opt');
$courseid=getOP('courseid');
$coursevers=getOP('coursevers');
$moment=getOP('moment');
$sectid=getOP('lid');
$sectname=getOP('sectname');
$kind=getOP('kind');
$link=getOP('link');
$visibility=getOP('visibility');
$order=getOP('order');
$gradesys=getOP('gradesys');
$highscoremode=getOP('highscoremode');
$versid=getOP('versid');
$coursename=getOP('coursename');
$versname=getOP('versname');
$coursecode=getOP('coursecode');
$coursenamealt=getOP('coursenamealt');
$comments=getOP('comments');
$makeactive=getOP('makeactive');
$startdate=getOP('startdate');
$enddate=getOP('enddate');
$showgrps=getOP('showgrp');
$grptype=getOP('grptype');
$deadline=getOP('deadline');
$relativedeadline=getOP('relativedeadline');
$pos=getOP('pos');
$jsondeadline = getOP('jsondeadline');
$studentTeacher = false;
$feedbackenabled =getOP('feedback');
$feedbackquestion =getOP('feedbackquestion');
$motd=getOP('motd');
$tabs=getOP('tabs');
$exampelid=getOP('exampleid');
$url=getOP('url');

$lid=getOP('lid');
$visbile = 0;
$avgfeedbackscore = 0;

$grpmembershp="UNK";
$unmarked = 0;
$groups=array();
$grplst=array();

if($feedbackenabled != 1){
	$feedbackenabled = 0;
}

if($gradesys=="UNK") $gradesys=0;

		$today = date("Y-m-d H:i:s");

		$debug="NONE!";

		$info="opt: ".$opt." courseid: ".$courseid." coursevers: ".$coursevers." coursename: ".$coursename;
		$log_uuid = getOP('log_uuid');
		 logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "sectionedservice.php",$userid,$info);

		//------------------------------------------------------------------------------------------------
		// Services
		//------------------------------------------------------------------------------------------------

		
		$isSuperUserVar=false;

		$hasread=hasAccess($userid, $courseid, 'r');
		$studentTeacher=hasAccess($userid, $courseid, 'st');
		$haswrite=hasAccess($userid, $courseid, 'w');

		if(checklogin()){
			if(isset($_SESSION['uid'])){
				$userid=$_SESSION['uid'];
				$hasread=hasAccess($userid, $courseid, 'r');
				$studentTeacher=hasAccess($userid, $courseid, 'st');
				$haswrite=hasAccess($userid, $courseid, 'w');
			}else{
				$userid="guest";
			}
			
			if(strcmp($opt,"UPDATEDEADLINE")===0){
					$deadlinequery = $pdo->prepare("UPDATE quiz SET deadline=:deadline, relativedeadline=:relativedeadline WHERE id=:link;");
					$deadlinequery->bindParam(':deadline',$deadline);
					$deadlinequery->bindParam(':relativedeadline',$relativedeadline);
					$deadlinequery->bindParam(':link',$link);
					
					if(!$deadlinequery->execute()){
						$error=$deadlinequery->errorInfo();
						$debug="ERROR THE DEADLINE QUERY FAILED".$error[2];
					}
				}
			}
		}
?>
