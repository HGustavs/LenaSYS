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
}else{
	$userid="1";
}

$cid = getOP('cid');
$qid = getOP('qid');
$opt = getOP('opt');
$vid = getOP('vid');

$param = getOP('parameter');
$answer = getOP('variantanswer');
$disabled = getOP('disabled');

$uid = getOP('uid');

$id = getOP('id');
$name = getOP('nme');
$autograde = getOP('autograde');
$gradesys = getOP('gradesys');
$template = getOP('template');
$qstart = getOP('qstart');
$deadline = getOP('deadline');
$jsondeadline = getOP('jsondeadline');
$release = getOP('release');
$coursevers = getOP('coursevers');
$groupAssignment = false;

$coursecode=getOP('coursecode');
$coursename=getOP('coursename');

$debug="NONE!";

$log_uuid = getOP('log_uuid');
$info=$opt." ".$cid." ".$qid." ".$vid." ".$param." ".$answer." ".$disabled." ".$uid." ".$name;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "duggaedservice.php",$userid,$info);

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
$writeaccess = false;
if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))){
  $writeaccess = true;

  if(strcmp($opt,"SAVDUGGA")===0){
		$query=null;
		// Check if it is a group assignment
		if (strcmp($template, "group-assignment")==0){
			$groupAssignment = true;
		}
    if(is_null($qid)||strcmp($qid,"UNK")===0){
        $query = $pdo->prepare("INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) VALUES (:cid,:autograde,:gradesys,:qname,:template,:release,:deadline,:uid,:coursevers,:qstart,:jsondeadline,:group)");
        $query->bindParam(':cid', $cid);
        $query->bindParam(':uid', $userid);
        $query->bindParam(':coursevers', $coursevers);
    }else{
        $query = $pdo->prepare("UPDATE quiz SET qname=:qname,autograde=:autograde,gradesystem=:gradesys,quizFile=:template,qstart=:qstart,deadline=:deadline,qrelease=:release,jsondeadline=:jsondeadline,`group`=:group WHERE id=:qid;");
        $query->bindParam(':qid', $qid);
    }
    $query->bindParam(':qname', $name);
    $query->bindParam(':autograde', $autograde);
    $query->bindParam(':gradesys', $gradesys);
    $query->bindParam(':template', $template);
		$query->bindParam(':jsondeadline', $jsondeadline);
		if($groupAssignment) {
			$query->bindValue(':group', 1, PDO::PARAM_INT);
		} else {
			$query->bindValue(':group', 0, PDO::PARAM_INT);
		}

    if (strrpos("UNK",$deadline)!==false) $deadline = null;
    if (strrpos("UNK",$qstart)!==false) $qstart = null;
    if (strrpos("UNK",$release)!==false) $release = null;

    $query->bindParam(':release', $release);
    $query->bindParam(':deadline', $deadline);
    $query->bindParam(':qstart', $qstart);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug.="Error updating dugga ".$error[2];
		}
	}else if(strcmp($opt,"DELDU")===0){
        $query = $pdo->prepare("DELETE FROM quiz WHERE id=:qid");
		$query->bindParam(':qid', $qid);

		if(!$query->execute()) {
			if($query->errorInfo()[0] == 23000) {
				$debug = "The item could not be deleted because of a foreign key constraint.";
			} else {
				$debug = "The item could not be deleted.";
			}
		}

    }else if(strcmp($opt,"ADDVARI")===0){
		$querystring="INSERT INTO variant(quizID,creator,disabled,param,variantanswer) VALUES (:qid,:uid,:disabled,:param,:variantanswer)";
		$stmt = $pdo->prepare($querystring);
		$stmt->bindParam(':qid', $qid);
		$stmt->bindParam(':uid', $userid);
		$stmt->bindParam(':disabled', $disabled);
		$stmt->bindParam(':param', $param);
		$stmt->bindParam(':variantanswer', $answer);

		if(!$stmt->execute()) {
			$error=$stmt->errorInfo();
			$debug="Error updating entries".$error[2];
		}
	}else if(strcmp($opt,"SAVVARI")===0){
		$query = $pdo->prepare("UPDATE variant SET disabled=:disabled,param=:param,variantanswer=:variantanswer WHERE vid=:vid");
		$query->bindParam(':vid', $vid);
		$query->bindParam(':disabled', $disabled);
		$query->bindParam(':param', $param);
		$query->bindParam(':variantanswer', $answer);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating user".$error[2];
		}
	}else if(strcmp($opt,"DELVARI")===0){
		$query = $pdo->prepare("DELETE FROM variant WHERE vid=:vid;");
		$query->bindParam(':vid', $vid);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating user".$error[2];
		}
	}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------
$mass=array();
$entries=array();
$files=array();
$duggaPages = array();

//fethces the coursecode and coursename so they can be used as title on the browser tab.
//The variable is used in duggaed.js with the 'sectionedPageTitle' id
$query = $pdo->prepare("SELECT coursename,coursecode,cid FROM course WHERE cid=:cid LIMIT 1");
$query->bindParam(':cid', $cid);

$coursename = "Course not Found!";
$coursecode = "Coursecode not found!";

if($query->execute()) {
	foreach($query->fetchAll() as $row) {
		$coursename=$row['coursename'];
		$coursecode=$row['coursecode'];
	}
} else {
	$error=$query->errorInfo();
	$debug="Error reading entries".$error[2];
}


if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))){

	$query = $pdo->prepare("SELECT id,cid,autograde,gradesystem,qname,quizFile,qstart,deadline,qrelease,modified,vers,jsondeadline FROM quiz WHERE cid=:cid AND vers=:coursevers ORDER BY id;");
	$query->bindParam(':cid', $cid);
	$query->bindParam(':coursevers', $coursevers);
	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="Error updating entries".$error[2];
	}

	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){

		$queryz = $pdo->prepare("SELECT vid,quizID,param,variantanswer,modified,disabled FROM variant WHERE quizID=:qid ORDER BY vid;");
		$queryz->bindParam(':qid',  $row['id']);

		if(!$queryz->execute()){
			$error=$queryz->errorInfo();
			$debug="Error updating entries".$error[2];
		}

		$mass=array();
		foreach($queryz->fetchAll(PDO::FETCH_ASSOC) as $rowz){

			$entryz = array(
				'vid' => $rowz['vid'],
				'param' => html_entity_decode($rowz['param']),
				'variantanswer' => html_entity_decode($rowz['variantanswer']),
				'modified' => $rowz['modified'],
				'disabled' => $rowz['disabled'],
				'arrowVariant' => $rowz['vid'],
				'cogwheelVariant' => $rowz['vid'],
				'trashcanVariant' => $rowz['vid']
				);

			array_push($mass, $entryz);
		}

		$entry = array(
			'variants' => $mass,
			'did' => $row['id'],
			'qname' => html_entity_decode($row['qname']),
			'autograde' => $row['autograde'],
			'gradesystem' => $row['gradesystem'],
			'quizFile' => $row['quizFile'],
			'qstart' => $row['qstart'],
			'deadline' => $row['deadline'],
      'qrelease' => $row['qrelease'],
			'modified' => $row['modified'],
			'arrow' => $row['id'],
			'cogwheel' => $row['id'],
			'jsondeadline' => html_entity_decode($row['jsondeadline']),
			'trashcan' => $row['id']
			);

		array_push($entries, $entry);
	}
	$dir    = './templates';
	$giles = scandir($dir);
	$files=array();
	foreach ($giles as $value){
		if(endsWith($value,".html")){
			array_push($files,substr ( $value , 0, strlen($value)-5 ));
			$duggaPages[substr ( $value , 0, strlen($value)-5 )] = file_get_contents("templates/".$value);
		}
	}
}

$array = array(
	'entries' => $entries,
	'debug' => $debug,
	'writeaccess' => $writeaccess,
	'files' => $files,
	'duggaPages' => $duggaPages,
	'coursecode' => $coursecode,
	'coursename' => $coursename

);

echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "duggaedservice.php",$userid,$info);

?>
