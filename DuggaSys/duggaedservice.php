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

$arrow = getOP('id');
$name = getOP('nme');
$autograde = getOP('autograde');
$gradesys = getOP('gradesys');
$template = getOP('template');
$qstart = getOP('qstart');
$deadline = getOP('deadline');
$release = getOP('release');
$coursevers = getOP('coursevers');
$cogwheel = getOP('id');
$trashcan = getOP('id');

$debug="NONE!";

$log_uuid = getOP('log_uuid');
$info=$opt." ".$cid." ".$qid." ".$vid." ".$param." ".$answer." ".$disabled." ".$uid." ".$name;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "duggaedservice.php",$userid,$info);

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))){

	if(strcmp($opt,"ADDUGGA")===0){
		$querystring="INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers) VALUES (:cid,:autograde,:gradesystem,:qname,:template,:release,:deadline,:uid,:coursevers)";	
		$stmt = $pdo->prepare($querystring);
		$stmt->bindParam(':cid', $cid);
		$stmt->bindParam(':uid', $userid);
		$stmt->bindParam(':coursevers', $coursevers);
		$stmt->bindParam(':autograde', $autograde);
		$stmt->bindParam(':gradesystem', $gradesys);
		$stmt->bindParam(':qname', $name);
		$stmt->bindParam(':template', $template);
		$stmt->bindParam(':release', $release);
		$stmt->bindParam(':deadline', $deadline);
		
		try{
			$stmt->execute();
		}catch (PDOException $e){
						// Error handling to $debug		
		}
	}else if(strcmp($opt,"ADDVARI")===0){
		$querystring="INSERT INTO variant(quizID,creator,disabled) VALUES (:qid,:uid,0)";	
		$stmt = $pdo->prepare($querystring);
		$stmt->bindParam(':qid', $qid);
		$stmt->bindParam(':uid', $userid);
		
		if(!$stmt->execute()) {
			$error=$stmt->errorInfo();
			$debug="Error updating entries".$error[2];
		}
	}else if(strcmp($opt,"SAVVARI")===0){
		$query = $pdo->prepare("UPDATE variant SET param=:param, variantanswer=:variantanswer WHERE vid=:vid;");
		$query->bindParam(':vid', $vid);
		$query->bindParam(':param', $param);
		$query->bindParam(':variantanswer', $answer);
		
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating user".$error[2];
		}	
	}else if(strcmp($opt,"TOGGLEVARI")===0){
		$query = $pdo->prepare("UPDATE variant SET disabled=:disabled WHERE vid=:vid;");
		$query->bindParam(':vid', $vid);
		$query->bindParam(':disabled', $disabled, PDO::PARAM_INT);
		
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
	}else if(strcmp($opt,"SAVDUGGA")===0){
		$query = $pdo->prepare("UPDATE quiz SET qname=:name,autograde=:autograde,gradesystem=:gradesys,quizFile=:template,qstart=:qstart,deadline=:deadline,qrelease=:release WHERE id=:qid;");
		$query->bindParam(':qid', $qid);
		$query->bindParam(':name', $name);
		$query->bindParam(':autograde', $autograde);
		$query->bindParam(':gradesys', $gradesys);
		$query->bindParam(':template', $template);

		if($qstart=="null") $query->bindValue(':qstart', null,PDO::PARAM_INT);
		else $query->bindParam(':qstart', $qstart);

		if($deadline=="null") $query->bindValue(':deadline', null,PDO::PARAM_INT);
		else $query->bindParam(':deadline', $deadline);

        if($release=="null") $query->bindValue(':release', null,PDO::PARAM_INT);
		else $query->bindParam(':release', $release);
		
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating user".$error[2];
		}	
	}else if(strcmp($opt,"UPDATEAUTO")===0){
			$query = $pdo->prepare("UPDATE quiz SET autograde=:autograde WHERE id=:qid;");
			$query->bindParam(':qid', $qid);
			$query->bindParam(':autograde', $autograde);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating user".$error[2];
			}	
	}else if(strcmp($opt,"UPDATEDNAME")===0){
			$query = $pdo->prepare("UPDATE quiz SET qname=:name WHERE id=:qid;");
			$query->bindParam(':qid', $qid);
			$query->bindParam(':name', $name);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating user".$error[2];
			}	
	}else if(strcmp($opt,"UPDATEGRADE")===0){
			$query = $pdo->prepare("UPDATE quiz SET gradesystem=:gradesys WHERE id=:qid;");
			$query->bindParam(':qid', $qid);
			$query->bindParam(':gradesys', $gradesys);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating user".$error[2];
			}	
	}else if(strcmp($opt,"UPDATETEMPLATE")===0){
			$query = $pdo->prepare("UPDATE quiz SET quizFile=:template WHERE id=:qid;");
			$query->bindParam(':qid', $qid);
			$query->bindParam(':template', $template);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating user".$error[2];
			}	
	}else if(strcmp($opt,"SAVVARIANSWER")===0){
			$query = $pdo->prepare("UPDATE variant SET variantanswer=:variantanswer WHERE vid=:vid;");
			$query->bindParam(':vid', $vid);
			$query->bindParam(':variantanswer', $answer);
	
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating user".$error[2];
			}
	}
	else if(strcmp($opt,"SAVVARIPARA")===0){
			$query = $pdo->prepare("UPDATE variant SET  param=:param WHERE vid=:vid;");
			$query->bindParam(':vid', $vid);
			$query->bindParam(':param', $param);
	
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating user".$error[2];
			}
	}else if(strcmp($opt,"DELDU")===0){
        $query = $pdo->prepare("DELETE FROM quiz WHERE id=:qid");
        $query->bindParam(':qid', $qid);
        if(!$query->execute()) {
            $error=$query->errorInfo();
            $debug="Error deleting dugga".$error[2];
        }
    }
}

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

$entries=array();
$files=array();
$duggaPages = array();
if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))){

	$query = $pdo->prepare("SELECT id,cid,autograde,gradesystem,qname,quizFile,qstart,deadline,qrelease,modified,vers FROM quiz WHERE cid=:cid AND vers=:coursevers ORDER BY id;");
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
				);

			array_push($mass, $entryz);
		}

		$entry = array(
			'variants' => $mass,
			'arrow' => $row['id'],
			'qname' => $row['qname'],
			'autograde' => $row['autograde'],
			'gradesystem' => $row['gradesystem'],
			'quizFile' => $row['quizFile'],
			'qstart' => $row['qstart'],
			'deadline' => $row['deadline'],				
      		'qrelease' => $row['qrelease'],
			'modified' => $row['modified'],
			'cogwheel' => $row['id'],
			'trashcan' => $row['id']
			);

		array_push($entries, $entry);
	}

	$dir    = './templates';
	$giles = scandir($dir);
	$files =array();
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
	'files' => $files,
	'duggaPages' => $duggaPages
);

echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "duggaedservice.php",$userid,$info);

?>
