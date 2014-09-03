<?php 

function getOP($name)
{
		if(isset($_POST[$name]))	return htmlEntities($_POST[$name]);
		else return "UNK";			
}

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/courses.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
}else{
		$userid="1";		
} 

$opt = getOP('opt');

$cid = getOP('cid');

$uid = getOP('uid');
$vers = getOP('vers');
$moment = getOP('moment');
$mark = getOP('mark');
$ukind = getOP('ukind');

$debug="NONE!";	

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {

		if(strcmp($opt,"CHGR")===0){
				if($ukind=="U"){
						$query = $pdo->prepare("UPDATE userAnswer SET grade=:mark,creator=:cuser WHERE cid=:cid AND moment=:moment AND vers=:vers AND uid=:uid");
						$query->bindParam(':mark', $mark);
						$query->bindParam(':cuser', $userid);

						$query->bindParam(':cid', $cid);
						$query->bindParam(':moment', $moment);
						$query->bindParam(':vers', $vers);
						$query->bindParam(':uid', $uid);

						if(!$query->execute()) {
							$error=$query->errorInfo();
							$debug="Error updating entries".$error[2];
						}				
				}else if($ukind=="I"){
						$query = $pdo->prepare("INSERT INTO userAnswer(grade,creator,cid,moment,vers,uid) VALUES(:mark,:cuser,:cid,:moment,:vers,:uid);");
						$query->bindParam(':mark', $mark);
						$query->bindParam(':cuser', $userid);

						$query->bindParam(':cid', $cid);
						$query->bindParam(':moment', $moment);
						$query->bindParam(':vers', $vers);
						$query->bindParam(':uid', $uid);

						if(!$query->execute()) {
							$error=$query->errorInfo();
							$debug="Error updating entries".$error[2];
						}								
				}
		}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

$entries=array();
$gentries=array();
$sentries=array();
$lentries=array();

if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {

		// Users connected to the current course (irrespective of version)
		$query = $pdo->prepare("select user_course.cid as cid,user.uid as uid,username,firstname,lastname,ssn from user,user_course where user.uid=user_course.uid and user_course.cid=:cid;");
		$query->bindParam(':cid', $cid);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
		}
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			// Create array entry for each course participant
	
			$entry = array(
				'cid' => $row['cid'],
				'uid' => $row['uid'],
				'username' => $row['username'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname'],
				'ssn' => $row['ssn']
			);
			array_push($entries, $entry);
		}


		// All results from current course and vers?
		$query = $pdo->prepare("select aid,quiz,variant,moment,grade,uid,answer,submitted,vers from userAnswer where cid=:cid;");
		$query->bindParam(':cid', $cid);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
		}
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			if(!isset($lentries[$row['uid']])){
					$lentries[$row['uid']]=array();
			}
			array_push(
				$lentries[$row['uid']],
				array(
					'aid' => $row['quiz'],
					'variant' => $row['variant'],
					'moment' => $row['moment'],
					'grade' => $row['grade'],
					'uid' => $row['uid'],
					'answer' => $row['answer'],
					'submitted'=> $row['submitted'],
					'vers'=> $row['vers']
				)
			);

		}

		// All dugga/moment entries from all versions of course
		$query = $pdo->prepare("SELECT lid,moment,entryname,pos,kind,link,visible,code_id,vers,gradesystem FROM listentries WHERE listentries.cid=:cid and (listentries.kind=3 or listentries.kind=4) ORDER BY pos");
		$query->bindParam(':cid', $cid);
		$result=$query->execute();
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
		}
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			array_push(
				$gentries,
				array(
					'entryname' => $row['entryname'],
					'lid' => $row['lid'],
					'pos' => $row['pos'],
					'kind' => $row['kind'],
					'moment' => $row['moment'],
					'link'=> $row['link'],
					'visible'=> $row['visible'],
					'code_id' => $row['code_id'],
					'vers' => $row['vers'],
					'gradesystem' => $row['gradesystem']					
				)
			);
		}

		// All extant versions of course
		$query = $pdo->prepare("SELECT cid,coursecode,vers FROM vers");
		$result=$query->execute();
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
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
		
$array = array(
	'entries' => $entries,
	'moments' => $gentries,
	'versions' => $sentries,
	'debug' => $debug,
	'results' => $lentries
);


echo json_encode($array);

?>