<?php 

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "basic.php";

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

$uid = getOP('uid');

$name = getOP('nme');
$autograde = getOP('autograde');
$gradesys = getOP('gradesys');
$template = getOP('template');
$release = getOP('release');
$deadline = getOP('deadline');

$debug="NONE!";	

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {

		if(strcmp($opt,"ADDUGGA")===0){
				$querystring='insert into quiz(cid,autograde,gradesystem,qname,quizFile,creator) values (:cid,1,1,"New Dugga","test.html",:uid)';	
				$stmt = $pdo->prepare($querystring);
				$stmt->bindParam(':cid', $cid);
				$stmt->bindParam(':uid', $userid);
		
				try {
					$stmt->execute();
				} catch (PDOException $e) {
						// Error handling to $debug		
				}
		}else if(strcmp($opt,"ADDVARI")===0){
				$querystring='INSERT INTO variant(quizID,param,variantanswer,creator) values (:qid,"New","Variant",:uid)';	
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
		}else if(strcmp($opt,"DELVARI")===0){
				$query = $pdo->prepare("DELETE FROM variant WHERE vid=:vid;");
				$query->bindParam(':vid', $vid);

				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}
		}else if(strcmp($opt,"SAVDUGGA")===0){
				$query = $pdo->prepare("UPDATE quiz SET qname=:name,autograde=:autograde,gradesystem=:gradesys,quizFile=:template,qrelease=:release,deadline=:deadline WHERE id=:qid;");
				$query->bindParam(':qid', $qid);
				$query->bindParam(':name', $name);
				$query->bindParam(':autograde', $autograde);
				$query->bindParam(':gradesys', $gradesys);
				$query->bindParam(':template', $template);

				if($release=="null") $query->bindValue(':release', null,PDO::PARAM_INT);
				else $query->bindParam(':release', $release);

				if($deadline=="null") $query->bindValue(':deadline', null,PDO::PARAM_INT);
				else $query->bindParam(':deadline', $deadline);
		
				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}	
		}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

$entries=array();

$files=array();

if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {

		$query = $pdo->prepare("SELECT id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified FROM quiz WHERE cid=:cid ORDER BY id;");
		$query->bindParam(':cid', $cid);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
		}
		
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			
			$queryz = $pdo->prepare("SELECT vid,quizID,param,variantanswer,modified FROM variant WHERE quizID=:qid ORDER BY vid;");
			$queryz->bindParam(':qid',  $row['id']);

			if(!$queryz->execute()) {
				$error=$queryz->errorInfo();
				$debug="Error updating entries".$error[2];
			}

			$mass=array();
			foreach($queryz->fetchAll(PDO::FETCH_ASSOC) as $rowz){

				$entryz = array(
					'vid' => $rowz['vid'],
					'param' => $rowz['param'],
					'variantanswer' => $rowz['variantanswer'],
					'modified' => $rowz['modified'],
				);

				array_push($mass, $entryz);
			}
			
			$entry = array(
				'variants' => $mass,
				'did' => $row['id'],
				'cid' => $row['cid'],
				'autograde' => $row['autograde'],
				'gradesystem' => $row['gradesystem'],
				'name' => $row['qname'],
				'template' => $row['quizFile'],
				'release' => $row['qrelease'],	
				'deadline' => $row['deadline'],				
				'modified' => $row['modified']				
			);

			array_push($entries, $entry);
		}

		$dir    = './templates';
		$giles = scandir($dir);
		$files =array();
		foreach ($giles as $value){
				if(endsWith($value,".html")){
						array_push($files,substr ( $value , 0, strlen($value)-5 ));
				}		
		}
}
		
$array = array(
	'entries' => $entries,
	'debug' => $debug,
	'files' => $files
);


echo json_encode($array);


?>
