<?php
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

$requestType = getOP('requestType');
$visibleUserIDs = gettheOP('visibleuserids');
if(is_array($visibleUserIDs)){
    $lenghtOfVisibleUserIDs = sizeof(gettheOP('visibleuserids'));
}
$courseid = getOP('courseid');
$opt = getOP('opt');
$cid = getOP('cid');
$luid = getOP('luid');
$vers = getOP('vers');
$listentry = getOP('moment');
$mark = getOP('mark');
$ukind = getOP('ukind');
$newDuggaFeedback = getOP('newFeedback');
$coursevers=getOP('coursevers');
$qvariant=getOP("qvariant");
$quizId=getOP("quizId");
$teacher = getOP('teacher');
$gradeLastExported=getOP('gradeLastExported');
$responsetext=getOP('resptext');
$responsefile=getOP('respfile');

$duggaid = getOP('duggaid');

$duggapage="";
$dugganame="";
$duggaparam="";
$duggaanswer="";
$useranswer="";
$duggastats="";
$duggaentry="";
$duggauser="";
$duggafeedback="";
$duggaexpire="";
$duggatimesgraded="";
$duggagrade="";
$gradeupdated=false;

const updateunexported_service_name = "updateunexported";
const getunexported_service_name = "getunexported";

$entries=array();

//$entriesNoSSN=array();
$gentries=array();
$sentries=array();
$lentries=array();
$snus=array();
$files= array();

$debug="NONE!";

$log_uuid = getOP('log_uuid');
$info=$opt." ".$cid." ".$coursevers." ".$luid." ".$vers." ".$listentry." ".$mark;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "resultedservice.php",$userid,$info);

// checks if the user is logged in and has access to send mail, only admins (superusers) will be able to mail
if($requestType == "mail" && checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))){
	$emailsArray = array();

	for($i = 0; $i < $lenghtOfVisibleUserIDs; $i++) {
		$studentID = $visibleUserIDs[$i];
		$mailQuery = $pdo->prepare("SELECT user.email FROM user INNER JOIN user_course ON user.uid = user_course.uid WHERE user_course.cid=:cid AND user_course.vers=:cvers AND user.username =:studentid");

		$mailQuery->bindParam(':studentid', $studentID);
		$mailQuery->bindParam(':cid', $courseid);
		$mailQuery->bindParam(':cvers', $coursevers);

		if(!$mailQuery->execute()) {
			$error=$mailQuery->errorInfo();
			$debug="Error reading user entries".$error[2];
		}

		array_push($emailsArray, $mailQuery->fetch()[0]);
	}

	// Seperates the emails with a ;.
	$implodedEmails=implode('; ',$emailsArray);
	// Returns the emails in a string representation.
	echo json_encode($implodedEmails);
	} else {

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {

	// Check if opt == updateunexported
	if ($opt === getunexported_service_name) {
		$statement = $pdo->prepare("	UPDATE userAnswer SET gradeLastExported = :gradeLastExported");
		$statement->bindParam(':gradeLastExported', $gradeLastExported);
		
		if ($statement === false) {
			// Failed to prepare query, log and return an error message
			$info = $opt . ' ' . $cid . ' ' . $coursevers . ' failed to prepare query';
			logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "resultedservice.php", $userid, $info);
			// return an error to the user and exit
			echo json_encode(array('error' => 'Could not retrieve unexported grades'));
			return;
		}
		
		// Statement successfully prepared, attempt to execute it
		if (!$statement->execute()) {
			// Failed to execute query, log and return an error message
			$error = $statement->errorInfo();
			$info = $opt . ' ' . $cid . ' ' . $coursevers . ' failed to execute query. PDO status and message: ' . error[1] . ' ' . error[2];
			logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "resultedservice.php", $userid, $info);
			// return an error to the user and exit
			echo json_encode(array('error' => 'Could not retrieve unexported grades'));
			return;
		} else {
			// Success, log and return results as JSON.
			// get all rows with fields indexed only by the same names as
			// they were addressed by in the query
			$resultRows = $statement->fetchAll(PDO::FETCH_ASSOC);
			echo json_encode($resultRows);
			// log success and exit
			$info = $opt . ' ' . $cid . ' ' . $coursevers . ' completed successfully';
			logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "resultedservice.php", $userid, $info);
			return;
		}
	}
	// Check if opt == getunexported
	if ($opt === getunexported_service_name) {
		// Get all answers where the result has never been exported or has changed.
		// This is the case when the result:
		// * has never been graded
		// * has never been exported
		// * was updated since it was last exported
		/*$rawSqlQuery = 'SELECT aid, cid, vers, moment, quiz, uid, marked, gradeLastExported
		from userAnswer
		where marked is null or gradeLastExported is null or marked > gradeLastExported';

		*/
		$statement = $pdo->prepare("SELECT * FROM userAnswer");
		
		if ($statement === false) {
			// Failed to prepare query, log and return an error message
			$info = $opt . ' ' . $cid . ' ' . $coursevers . ' failed to prepare query';
			logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "resultedservice.php", $userid, $info);
			// return an error to the user and exit
			echo json_encode(array('error' => 'Could not retrieve unexported grades'));
			return;
		}
		
		// Statement successfully prepared, attempt to execute it
		if (!$statement->execute()) {
			// Failed to execute query, log and return an error message
			$error = $statement->errorInfo();
			$info = $opt . ' ' . $cid . ' ' . $coursevers . ' failed to execute query. PDO status and message: ' . error[1] . ' ' . error[2];
			logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "resultedservice.php", $userid, $info);
			// return an error to the user and exit
			echo json_encode(array('error' => 'Could not retrieve unexported grades'));
			return;
		} else {
			// Success, log and return results as JSON.
			// get all rows with fields indexed only by the same names as
			// they were addressed by in the query
			$resultRows = $statement->fetchAll(PDO::FETCH_ASSOC);
			echo json_encode($resultRows);
			// log success and exit
			$info = $opt . ' ' . $cid . ' ' . $coursevers . ' completed successfully';
			logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "resultedservice.php", $userid, $info);
			return;
		}
	}

	if(strcmp($opt,"CHGR")===0){
		if($ukind=="U"){
			if ($mark == "UNK"){
				$mark = null;
				$query = $pdo->prepare("UPDATE userAnswer SET grade=:mark,creator=:cuser,marked=NULL,timesGraded=timesGraded + 1,gradeExpire=CURRENT_TIMESTAMP WHERE cid=:cid AND moment=:moment AND vers=:vers AND uid=:uid");
			} else {
				$query = $pdo->prepare("UPDATE userAnswer SET grade=:mark,creator=:cuser,marked=NOW(),timesGraded=timesGraded + 1,gradeExpire=CURRENT_TIMESTAMP WHERE cid=:cid AND moment=:moment AND vers=:vers AND uid=:uid");
			}
			$query->bindParam(':mark', $mark);
			$query->bindParam(':cuser', $userid);

			$query->bindParam(':cid', $cid);
			$query->bindParam(':moment', $listentry);
			$query->bindParam(':vers', $vers);
			$query->bindParam(':uid', $luid);



			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating entries\n".$error[2];
			} else {
				$gradeupdated=true;
				$duggauser=$luid;
				$duggaid=$listentry;
				$lentries=$mark;
			}
			if ($newDuggaFeedback != "UNK"){
					$query = $pdo->prepare('UPDATE userAnswer SET feedback = CASE WHEN feedback IS NULL THEN :newDuggaFeedback ELSE concat(feedback, concat("||",:newDuggaFeedback)) END WHERE cid=:cid AND moment=:moment AND vers=:vers AND uid=:uid;');
					$newDuggaFeedback = date("Y-m-d h:i") . "%%" . $newDuggaFeedback;
					$query->bindParam(':newDuggaFeedback', $newDuggaFeedback);
					$query->bindParam(':cid', $cid);
					$query->bindParam(':moment', $listentry);
					$query->bindParam(':vers', $vers);
					$query->bindParam(':uid', $luid);
					if(!$query->execute()) {
						$error=$query->errorInfo();
						$debug="Error updating dugga feedback\n".$error[2];
					}
			}
		}else if($ukind=="I"){
			$query = $pdo->prepare("INSERT INTO userAnswer(grade,creator,cid,moment,vers,uid,marked) VALUES(:mark,:cuser,:cid,:moment,:vers,:uid,NOW());");
			$query->bindParam(':mark', $mark);
			$query->bindParam(':cuser', $userid);

			$query->bindParam(':cid', $cid);
			$query->bindParam(':moment', $listentry);
			$query->bindParam(':vers', $vers);
			$query->bindParam(':uid', $luid);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error inserting userAnswer\n".$error[2];
			} else {
				$gradeupdated=true;
				$duggauser=$luid;
				$duggaid=$listentry;
				$lentries=$mark;
			}
		}else if($ukind=="IFeedback"){
			$query = $pdo->prepare("INSERT INTO userAnswer(grade,creator,cid,moment,vers,uid,marked,quiz,variant) VALUES(:mark,:cuser,:cid,:moment,:vers,:uid,NOW(),:quizid,:variant);");
			$query->bindParam(':mark', $mark);
			$query->bindParam(':cuser', $userid);

			$query->bindParam(':cid', $cid);
			$query->bindParam(':moment', $listentry);
			$query->bindParam(':vers', $vers);
			$query->bindParam(':uid', $luid);
      $query->bindParam(':quizid', $quizId);
      if(!is_int($qvariant)){$qvariant=-1;}
			$query->bindParam(':variant', $qvariant);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating entries\n".$error[2];
			} else {
				$gradeupdated=true;
				$duggauser=$luid;
				$duggaid=$listentry;
				$lentries=$mark;
				if ($newDuggaFeedback != "UNK"){
						$query = $pdo->prepare('UPDATE userAnswer SET feedback = CASE WHEN feedback IS NULL THEN :newDuggaFeedback ELSE concat(feedback, concat("||",:newDuggaFeedback)) END WHERE cid=:cid AND moment=:moment AND vers=:vers AND uid=:uid;');
						$newDuggaFeedback = date("Y-m-d h:i") . "%%" . $newDuggaFeedback;
						$query->bindParam(':newDuggaFeedback', $newDuggaFeedback);
						$query->bindParam(':cid', $cid);
						$query->bindParam(':moment', $listentry);
						$query->bindParam(':vers', $vers);
						$query->bindParam(':uid', $luid);
						if(!$query->execute()) {
							$error=$query->errorInfo();
							$debug="Error updating dugga feedback\n".$error[2];
						}
				}
			}
		}

		if ($gradeupdated) {
			include_once "../Shared/pushnotificationshelper.php";
			$query = $pdo->prepare("SELECT listentries.entryname, course.coursename FROM listentries,course WHERE listentries.lid = :lid and listentries.cid = course.cid");
			$query->bindParam(':lid', $listentry);
			if($query->execute()) {
				if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
					$listname = $row['entryname'];
					$coursename = $row['coursename'];
					// $results = sendPushNotification($luid, "$listname for $coursename has been graded");
					// Ignore results of whether the push notification was sent or not, as this notification is only for user convenience
				}
			}
			// Get gradeExpire and timesGraded in order to update the local arrays of resulted.js whenever a grade is updated.
			$query = $pdo->prepare("SELECT gradeExpire, timesGraded FROM userAnswer WHERE uid=:luid AND moment=:moment AND cid=:cid AND vers=:vers LIMIT 1");
			$query->bindParam(':cid', $cid);
			$query->bindParam(':vers', $vers);
			$query->bindParam(':moment', $listentry);
			$query->bindParam(':luid', $luid);
			if($query->execute()) {
				if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
					$duggaexpire = $row['gradeExpire'];
					$duggatimesgraded = $row['timesGraded'];
				}
			}
		}

	}

	if(strcmp($opt,"DUGGA")==0){

		// in this case moment refers to the listentry and not the parent moment listentry
		$query = $pdo->prepare("
      SELECT userAnswer.useranswer AS aws,entryname,quizFile,qrelease,deadline,param,variant.variantanswer AS facit,timeUsed,totalTimeUsed,stepsUsed,totalStepsUsed,link,feedback AS duggaFeedback
      FROM userAnswer,listentries,quiz,variant
      WHERE variant.vid=userAnswer.variant AND userAnswer.cid=listentries.cid AND listentries.cid=quiz.cid AND userAnswer.vers=listentries.vers AND listentries.link=quiz.id AND listentries.lid=userAnswer.moment AND uid=:luid AND userAnswer.moment=:moment AND listentries.cid=:cid AND listentries.vers=:vers;
    ");

		$query->bindParam(':cid', $cid);
		$query->bindParam(':vers', $vers);
		$query->bindParam(':moment', $listentry);
		$query->bindParam(':luid', $luid);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries\n".$error[2];
		}

		if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
			$duggatitle=$row['entryname'];
			$duggafile=$row['quizFile'];
			$duggarel=$row['qrelease'];
			$duggadead=$row['deadline'];

			$duggaid=$row['link'];
			$duggauser=$luid;
			$duggaentry=$listentry;

			$useranswer=$row['aws'];
			$useranswer = str_replace("*##*", '"', $useranswer);
			$useranswer = str_replace("*###*", '&cap;', $useranswer);
			if(strcmp($useranswer,"") == 0){$useranswer = "UNK";} // Return UNK if we have not submitted any user answer

			$duggaparam=html_entity_decode($row['param']);

			$duggaanswer=html_entity_decode($row['facit']);

			$duggastats = array($row['timeUsed'],$row['totalTimeUsed'],$row['stepsUsed'],$row['totalStepsUsed']);

			$dugganame="templates/".$duggafile.".js";

			$duggafeedback = html_entity_decode($row['duggaFeedback']);

			if(file_exists ( "templates/".$duggafile.".html")) {
				$duggapage=file_get_contents("templates/".$duggafile.".html");
			}
		} else {
				//we need the paramters for the variant
				$queryp = $pdo->prepare("
          SELECT quizFile,quizID,vid,param
          FROM quiz,listentries,variant
          WHERE listentries.cid=:cid AND listentries.vers=:vers AND lid=:moment AND listentries.link=variant.quizID AND variant.quizID=quiz.id LIMIT 1;
        ");
				$queryp->bindParam(':cid', $cid);
				$queryp->bindParam(':vers', $vers);
				$queryp->bindParam(':moment', $listentry);

				if(!$queryp->execute()) {
					$error=$queryp->errorInfo();
					$debug="Error reading param\n".$error[2]." ". __LINE__;
				}
				if ($row = $queryp->fetch(PDO::FETCH_ASSOC)) {
					$duggaparam=html_entity_decode($row["param"]);
					$duggaid=$row["quizID"];
				}
				$duggaanswer=html_entity_decode("{}");
				$duggauser=$luid;
				$duggaentry=$listentry;
				$dugganame="templates/".$row["quizFile"].".js";
				$duggapage=file_get_contents("templates/".$row["quizFile"].".html");

		}
	}

	if(strcmp($opt,"RESP")==0){

			$currcvd=getcwd();
			$duggafeedback = $responsetext;
			$duggaentry=$listentry;
			$duggauser=$luid;

			$query = $pdo->prepare("
        SELECT lastname,firstname,username
        FROM user
        WHERE uid=:uid
      ");
			$query->bindParam(':uid', $luid);

			if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating entries\n".$error[2];
			}

			if ($row = $query->fetch(PDO::FETCH_ASSOC)) {

					// Create a file area with format Lastname-Firstname-Login
					$userdir = $row["lastname"]."_".$row["firstname"]."_".$row["username"];

					// First replace a predefined list of national characters
					// Then replace any additional character that is not a-z, a number, period or underscore
					$national = array("&ouml;", "&Ouml;", "&auml;", "&Auml;", "&aring;", "&Aring;","&uuml;","&Uuml;");
					$nationalReplace = array("o", "O", "a", "A", "a", "A","u","U");
					$userdir = str_replace($national, $nationalReplace, $userdir);
					$userdir=preg_replace("/[^a-zA-Z0-9._]/", "", $userdir);

					if(!file_exists ($currcvd."/submissions/".$cid."/".$vers."/".$duggaid."/".$userdir)){
							if(!mkdir($currcvd."/submissions/".$cid."/".$vers."/".$duggaid."/".$userdir)){
									echo "Error creating folder: ".$currcvd."/submissions/cid/vers/duggaid/".$userdir;
									$error=true;
							}
					}

					$movname=$currcvd."/submissions/".$cid."/".$vers."/".$duggaid."/".$userdir."/".$responsefile."_FB.txt";
					file_put_contents($movname,$responsetext);
		}
	}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------

// Don't retreive all results if request was for a single dugga or a grade update
if(strcmp($opt,"CHGR")!==0){
	if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {
		// Users connected to the current course version
		/*
		$q = $pdo->prepare("SELECT user_course.cid AS cid,user.uid AS uid,username,firstname,lastname,ssn,aid,quiz,variant,moment,grade,useranswer,submitted,user_course.vers as vers,marked,timeUsed,totalTimeUsed,stepsUsed,totalStepsUsed FROM user,user_course,userAnswer WHERE user.uid=user_course.uid AND user_course.cid=:cid AND user.uid=userAnswer.uid AND user_course.vers=:coursevers order by lastname,quiz;");
		$q->bindParam(':coursevers', $vers);
		$q->bindParam(':cid', $cid);

		if(!$q->execute()) {
			$error=$q->errorInfo();
			$debug="Error retreiving users. (row ".__LINE__.") ".$q->rowCount()." row(s) were found. Error code: ".$error[2];
		}

		foreach($q->fetchAll(PDO::FETCH_ASSOC) as $row){
				if (array_key_exists($row['uid'], $snus){

				} else {

				}

		}
		*/
		$query = $pdo->prepare("SELECT user_course.cid AS cid,user.uid AS uid,username,firstname,lastname,ssn,class,user_course.access,user_course.examiner FROM user,user_course WHERE user.uid=user_course.uid AND user_course.cid=:cid AND user_course.vers=:coursevers;");
		//		$query = $pdo->prepare("select user_course.cid as cid,user.uid as uid,username,firstname,lastname,ssn,access from user,user_course where user.uid=user_course.uid and user_course.cid=:cid;");
		$query->bindParam(':coursevers', $vers);
		$query->bindParam(':cid', $cid);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error retreiving users. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
		}

		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			// Create array entry for each course participant

			// This is unused in resulted, but kept if needed elsewhere / some other time
			$entry = array(
				'cid' => (int)$row['cid'],
				'uid' => (int)$row['uid'],
				'username' => $row['username'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname'],
				'ssn' => $row['ssn'],
				'class' => $row['class'],
				'access' => $row['access'],
				'examiner' => $row['examiner']
			);

			// The array which is displayed on resulted without SSN
			//keeping this array until verified that changes made does not break anything.
			/*
			$entryNoSSN = array(
				'cid' => (int)$row['cid'],
				'uid' => (int)$row['uid'],
				'username' => $row['username'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname'],
				'class' => $row['class'],
				'access' => $row['access'],
				'examiner' => $row['examiner']
			);
			*/
/*
//This array seems like and old duplicate and could possibly be removed
			$entry = array(
				'cid' => (int)$row['cid'],
				'uid' => (int)$row['uid'],
				'username' => $row['username'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname'],
				'ssn' => $row['ssn'],
				'role' => $row['access']
			);
			*/
			array_push($entries, $entry);
			//array_push($entriesNoSSN, $entryNoSSN);
		}

		// All results from current course and vers?
		//$query = $pdo->prepare("SELECT aid,quiz,variant,userAnswer.moment AS dugga,grade,uid,useranswer,submitted,UNIX_TIMESTAMP(submitted) AS submittedts,userAnswer.vers,marked,UNIX_TIMESTAMP(marked) AS markedts,timeUsed,totalTimeUsed,stepsUsed,totalStepsUsed,listentries.moment AS moment,if((UNIX_TIMESTAMP(submitted) > UNIX_TIMESTAMP(marked) && !isnull(marked))||(isnull(marked) && !isnull(useranswer)), true, false) AS needMarking,timesGraded,gradeExpire,deadline,UNIX_TIMESTAMP(deadline) AS deadlinets FROM userAnswer,listentries,quiz WHERE listentries.link=quiz.id AND userAnswer.cid=:cid AND userAnswer.vers=:vers AND userAnswer.moment=listentries.lid GROUP BY listentries.lid;");
		$query = $pdo->prepare("SELECT aid,quiz,variant,userAnswer.moment AS dugga,grade,uid,useranswer,submitted,UNIX_TIMESTAMP(submitted) AS submittedts,userAnswer.vers,marked,UNIX_TIMESTAMP(marked) AS markedts,timeUsed,totalTimeUsed,stepsUsed,totalStepsUsed,listentries.moment AS moment,if((UNIX_TIMESTAMP(submitted) > UNIX_TIMESTAMP(marked) && !isnull(marked))||(isnull(marked) && !isnull(useranswer)), true, false) AS needMarking,timesGraded,gradeExpire,deadline,UNIX_TIMESTAMP(deadline) AS deadlinets FROM userAnswer,listentries LEFT OUTER JOIN quiz ON listentries.link=quiz.id WHERE userAnswer.cid=:cid AND userAnswer.vers=:vers AND userAnswer.moment=listentries.lid GROUP BY uid,listentries.lid,aid;");
		$query->bindParam(':cid', $cid);
		$query->bindParam(':vers', $vers);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error retreiving userAnswers. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
		}

		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			if(!isset($lentries[$row['uid']])){
					$lentries[$row['uid']]=array();
			}

			array_push(
				$lentries[$row['uid']],
				array(
					'aid' => (int)$row['quiz'],
					'variant' => (int)$row['variant'],
					'dugga' => (int)$row['dugga'],
					'moment' => (int)$row['moment'],
					'grade' => (int)$row['grade'],
					'uid' => (int)$row['uid'],
					'useranswer' => $row['useranswer'],
					'submitted'=> $row['submitted'],
					'submittedts'=> $row['submittedts'],
					'vers'=> $row['vers'],
					'marked' => $row['marked'],
					'markedts' => $row['markedts'],
					'timeUsed' => $row['timeUsed'],
					'totalTimeUsed' => $row['totalTimeUsed'],
					'stepsUsed' => $row['stepsUsed'],
					'totalStepsUsed' => $row['totalStepsUsed'],
					'needMarking' => (bool)$row['needMarking'],
					'timesGraded' => (int)$row['timesGraded'],
          'gradeExpire' => $row['gradeExpire'],
          'deadline' => $row['deadline'],
          'deadlinets' => $row['deadlinets']
				)
			);
		}

		// All dugga/moment entries from current course version
		//$query = $pdo->prepare("SELECT listentries.*,quizFile FROM listentries,quiz WHERE listentries.cid=:cid and listentries.link=quiz.id and listentries.vers=:vers and (listentries.kind=3 or listentries.kind=4) ORDER BY pos");
		//$query = $pdo->prepare("SELECT listentries.*,quizFile,variant.vid as qvariant FROM listentries,quiz,variant WHERE quiz.id=variant.quizID AND listentries.cid=:cid and listentries.link=quiz.id and listentries.vers=:vers and (listentries.kind=3 or listentries.kind=4) GROUP BY lid ORDER BY pos;");
		$query = $pdo->prepare("
      SELECT listentries.*,quizFile,COUNT(variant.vid) AS qvariant, quiz.deadline,UNIX_TIMESTAMP(quiz.deadline) as deadlinets
      FROM listentries
      LEFT JOIN quiz ON listentries.link=quiz.id
      LEFT JOIN variant ON quiz.id=variant.quizID
      WHERE listentries.cid=:cid AND listentries.vers=:vers AND (listentries.kind=3 OR listentries.kind=4) GROUP BY lid ORDER BY pos;
    ");
		$query->bindParam(':cid', $cid);
		$query->bindParam(':vers', $vers);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error retreiving moments and duggas. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
		}

		$currentMoment=null;
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			array_push(
				$gentries,
				array(
					'entryname' => $row['entryname'],
					'lid' => (int)$row['lid'],
					'pos' => (int)$row['pos'],
					'kind' => (int)$row['kind'],
					'moment' => (int)$row['moment'],
					'link'=> $row['link'],
					'visible'=> (int)$row['visible'],
					'code_id' => $row['code_id'],
					'vers' => $row['vers'],
					'quizfile' => $row['quizFile'],
					'gradesystem' => (int)$row['gradesystem'],
					'qvariant' => $row['qvariant'],
					'deadline' => $row['deadline'],
					'deadlinets' => $row['deadlinets']
				)
			);
		}

		// All extant versions of course
		$query = $pdo->prepare("SELECT cid,coursecode,vers FROM vers");

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error retreiving. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
		}

		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			array_push(
				$sentries,
				array(
					'cid' => $row['cid'],
					'coursecode' => $row['coursecode'],
					'vers' => $row['vers']
				)
			);
		}
	}
}

// Get the files for the dugga we are marking
if(strcmp($opt,"DUGGA")===0){
	$query = $pdo->prepare("
    SELECT subid,uid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment
    FROM submission
    WHERE uid=:uid AND vers=:vers AND cid=:cid
    ORDER BY filename,updtime asc;
  ");
	$query->bindParam(':uid', $luid);
	$query->bindParam(':cid', $cid);
	$query->bindParam(':vers', $vers);

	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error retreiving submissions. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
	}


	foreach($query->fetchAll() as $row) {
			$content = "UNK";
			$feedback = "UNK";

			$currcvd=getcwd();

			$fedbname=$currcvd."/".$row['filepath'].$row['filename'].$row['seq']."_FB.txt";
			if(!file_exists($fedbname)) {
					$feedback="UNK";
			} else {
					$feedback=file_get_contents($fedbname);
			}


			if($row['kind']=="3"){
					// Read file contents
					$movname=$currcvd."/".$row['filepath']."/".$row['filename'].$row['seq'].".".$row['extension'];

					if(!file_exists($movname)) {
							$content="UNK!";
					} else {
							$content=file_get_contents($movname);
					}
			}	else if($row['kind']=="2"){
					// File content is an URL
					$movname=$currcvd."/".$row['filepath']."/".$row['filename'].$row['seq'];

					if(!file_exists($movname)) {
							$content="UNK URL!";
					} else {
							$content=file_get_contents($movname);
					}
			}else{
					$content="Not a text-submit or URL";
			}

			$entry = array(
				'uid' => $row['uid'],
				'subid' => $row['subid'],
				'vers' => $row['vers'],
				'did' => $row['did'],
				'fieldnme' => $row['fieldnme'],
				'filename' => $row['filename'],
				'filepath' => $row['filepath'],
				'extension' => $row['extension'],
				'mime' => $row['mime'],
				'updtime' => $row['updtime'],
				'kind' => $row['kind'],
				'seq' => $row['seq'],
				'segment' => $row['segment'],
				'content' => $content,
				'feedback' => $feedback
			);

			// If the filednme key isn't set, create it now
			if (!isset($files[$row['segment']])) $files[$row['segment']] = array();
			array_push($files[$row['segment']], $entry);
		}

}

if (sizeof($files) === 0) {$files = (object)array();} // Force data type to be object

if(isset($_SERVER["REQUEST_TIME_FLOAT"])){
		$serviceTime = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];
		$benchmark =  array('totalServiceTime' => $serviceTime);
}else{
		$benchmark="-1";
}

$teachers=array();
if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {
	$query = $pdo->prepare("
    SELECT user.uid, user.firstname, user.lastname, user.username
		FROM user_course 
		INNER JOIN user ON user_course.examiner = user.uid
		WHERE user_course.cid=:cid AND user_course.vers=:cvers;
  ");
	$query->bindParam(':cid', $cid);
	$query->bindParam(':cvers', $vers);
	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="Error reading user entries\n".$error[2];
	}
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$teacher = array(
				'id' => $row['uid'],
				'username' => $row['username'],
				'firstname' => $row['firstname'],		
				'lastname' => $row['lastname']
			);
			array_push($teachers, $teacher);
		}
}

$courseteachers=array();
if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {
	$query = $pdo->prepare("
    SELECT DISTINCT examiner
    FROM user_course where cid=:cid;
  ");
	$query->bindParam(':cid', $cid);
	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="Error reading user entries\n".$error[2];
	}
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$teacher = array(
				'teacher' => $row['examiner'],
			);
			array_push($courseteachers, $teacher);
		}
}

$array = array(
	//'entriesNoSSN' => $entriesNoSSN,
	'entries' => $entries,
	'moments' => $gentries,
	'versions' => $sentries,
	'debug' => $debug,
	'results' => $lentries,
	'teachers' => $teachers,
	'courseteachers' => $courseteachers,

	'duggauser' => $duggauser,
	'duggaentry' => $duggaentry,
	'duggaid' => $duggaid,
	'duggapage' => $duggapage,
	'dugganame' => $dugganame,
	'duggaparam' => $duggaparam,
	'duggaanswer' => $duggaanswer,
	'duggaexpire' => $duggaexpire,
	'duggatimesgraded' => $duggatimesgraded,
	'useranswer' => $useranswer,
	'duggastats' => $duggastats,
	'duggafeedback' => $duggafeedback,
	'moment' => $listentry,
	'files' => $files,
	'gradeupdated' => $gradeupdated,
	'benchmark' => $benchmark
);

echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "resultedservice.php",$userid,$info);
}

?>
