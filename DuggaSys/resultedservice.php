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

$gradeupdated=false;

$entries=array();
$gentries=array();
$sentries=array();
$lentries=array();
$snus=array();
$files= array();

$debug="NONE!";

$log_uuid = getOP('log_uuid');
$info=$opt." ".$cid." ".$coursevers." ".$luid." ".$vers." ".$listentry." ".$mark;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "resultedservice.php",$userid,$info);

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {
	if(strcmp($opt,"CHGR")==0){
		if($ukind=="U"){
			$query = $pdo->prepare("UPDATE userAnswer SET grade=:mark,creator=:cuser,marked=NOW() WHERE cid=:cid AND moment=:moment AND vers=:vers AND uid=:uid");
			$query->bindParam(':mark', $mark);
			$query->bindParam(':cuser', $userid);

			$query->bindParam(':cid', $cid);
			$query->bindParam(':moment', $listentry);
			$query->bindParam(':vers', $vers);
			$query->bindParam(':uid', $luid);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating entries".$error[2];
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
						$debug="Error updating dugga feedback".$error[2];
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
				$debug="Error updating entries\n".$error[2];
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
							$debug="Error updating dugga feedback".$error[2];
						}
				}
			}
		}
		
	}

	if(strcmp($opt,"DUGGA")==0){

		// in this case moment refers to the listentry and not the parent moment listentry
		$query = $pdo->prepare("SELECT userAnswer.useranswer as aws,entryname,quizFile,qrelease,deadline,param,variant.variantanswer as facit,timeUsed,totalTimeUsed,stepsUsed,totalStepsUsed,link,feedback as duggaFeedback FROM userAnswer,listentries,quiz,variant WHERE variant.vid=userAnswer.variant AND userAnswer.cid=listentries.cid AND listentries.cid=quiz.cid AND userAnswer.vers=listentries.vers AND listentries.link=quiz.id AND listentries.lid=userAnswer.moment AND uid=:luid AND userAnswer.moment=:moment AND listentries.cid=:cid AND listentries.vers=:vers;");

		$query->bindParam(':cid', $cid);
		$query->bindParam(':vers', $vers);
		$query->bindParam(':moment', $listentry);
		$query->bindParam(':luid', $luid);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries".$error[2];
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
				$queryp = $pdo->prepare("SELECT quizFile,quizID,vid,param FROM quiz,listentries,variant WHERE listentries.cid=:cid AND listentries.vers=:vers AND lid=:moment AND listentries.link=variant.quizID AND variant.quizID=quiz.id LIMIT 1;");
				$queryp->bindParam(':cid', $cid);
				$queryp->bindParam(':vers', $vers);
				$queryp->bindParam(':moment', $listentry);
		
				if(!$queryp->execute()) {
					$error=$queryp->errorInfo();
					$debug="Error reading param".$error[2]." ". __LINE__;
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

			$query = $pdo->prepare("SELECT lastname,firstname,username FROM user WHERE uid=:uid");
			$query->bindParam(':uid', $luid);

			if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating entries".$error[2];
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
if(strcmp($opt,"DUGGA")!==0 && strcmp($opt,"CHGR")!==0){
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
		$query = $pdo->prepare("SELECT user_course.cid AS cid,user.uid AS uid,username,firstname,lastname,ssn,class FROM user,user_course WHERE user.uid=user_course.uid AND user_course.cid=:cid AND user_course.vers=:coursevers;");
		//		$query = $pdo->prepare("select user_course.cid as cid,user.uid as uid,username,firstname,lastname,ssn,access from user,user_course where user.uid=user_course.uid and user_course.cid=:cid;");
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
/*
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
		}

		// All results from current course and vers?
		$query = $pdo->prepare("select aid,quiz,variant,userAnswer.moment as dugga,grade,uid,useranswer,UNIX_TIMESTAMP(submitted)as submitted,userAnswer.vers,UNIX_TIMESTAMP(marked) as marked,timeUsed,totalTimeUsed,stepsUsed,totalStepsUsed,listentries.moment as moment,if((submitted > marked && !isnull(marked))||(isnull(marked) && !isnull(useranswer)), true, false) as needMarking from userAnswer,listentries where userAnswer.cid=:cid and userAnswer.vers=:vers and userAnswer.moment=listentries.lid;");
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
					'vers'=> $row['vers'],
					'marked' => $row['marked'],
					'timeUsed' => $row['timeUsed'],
					'totalTimeUsed' => $row['totalTimeUsed'],
					'stepsUsed' => $row['stepsUsed'],
					'totalStepsUsed' => $row['totalStepsUsed'],
					'needMarking' => (bool)$row['needMarking']
				)
			);
		}

		// All dugga/moment entries from current course version
		//$query = $pdo->prepare("SELECT listentries.*,quizFile FROM listentries,quiz WHERE listentries.cid=:cid and listentries.link=quiz.id and listentries.vers=:vers and (listentries.kind=3 or listentries.kind=4) ORDER BY pos");
		//$query = $pdo->prepare("SELECT listentries.*,quizFile,variant.vid as qvariant FROM listentries,quiz,variant WHERE quiz.id=variant.quizID AND listentries.cid=:cid and listentries.link=quiz.id and listentries.vers=:vers and (listentries.kind=3 or listentries.kind=4) GROUP BY lid ORDER BY pos;");
		$query = $pdo->prepare("SELECT listentries.*,quizFile,COUNT(variant.vid) as qvariant FROM listentries LEFT JOIN quiz ON  listentries.link=quiz.id LEFT JOIN variant ON quiz.id=variant.quizID WHERE listentries.cid=:cid and listentries.vers=:vers and (listentries.kind=3 or listentries.kind=4) GROUP BY lid ORDER BY pos;");
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
					'qvariant' => $row['qvariant']
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
	$query = $pdo->prepare("select subid,uid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment from submission where uid=:uid and vers=:vers and cid=:cid order by filename,updtime asc;");
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
	$query = $pdo->prepare("SELECT teacher, uid FROM user_course;");
	$query->bindParam(':cid', $cid);
	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="Error reading user entries".$error[2];
	}
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$teacher = array(
				'teacher' => $row['teacher'],
				'tuid' => $row['uid'],
			);
			array_push($teachers, $teacher);
		}
}

$array = array(
	'entries' => $entries,
	'moments' => $gentries,
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
	'benchmark' => $benchmark
);

echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "resultedservice.php",$userid,$info);
?>
