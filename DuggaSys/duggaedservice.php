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

$cid = getOP('cid');
$qid = getOP('qid');
$opt = getOP('opt');
$vid = getOP('vid');

$param = getOP('parameter');
$answer = getOP('answer');

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

if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {

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
				$querystring='INSERT INTO variant(quizID,param,answer,creator) values (:qid,"New","Variant",:uid)';	
				$stmt = $pdo->prepare($querystring);
				$stmt->bindParam(':qid', $qid);
				$stmt->bindParam(':uid', $userid);
		
				if(!$stmt->execute()) {
					$error=$stmt->errorInfo();
					$debug="Error updating entries".$error[2];
				}
		}else if(strcmp($opt,"SAVVARI")===0){
				$query = $pdo->prepare("UPDATE variant SET param=:param, answer=:answer WHERE vid=:vid;");
				$query->bindParam(':vid', $vid);
				$query->bindParam(':param', $param);
				$query->bindParam(':answer', $answer);
		
				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}	
		}else if(strcmp($opt,"DELVARI")===0){
				$query = $pdo->prepare("DELETE FROM VARIANT WHERE vid=:vid;");
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

if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {

		$query = $pdo->prepare("SELECT id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified FROM quiz WHERE cid=:cid ORDER BY id;");
		$query->bindParam(':cid', $cid);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
		}
		
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			
			$queryz = $pdo->prepare("SELECT vid,quizID,param,answer,modified FROM variant WHERE quizID=:qid ORDER BY vid;");
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
					'answer' => $rowz['answer'],
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
		$files = scandir($dir);
		
}
		
$array = array(
	'entries' => $entries,
	'debug' => $debug,
	'files' => $files
);


echo json_encode($array);


?>
