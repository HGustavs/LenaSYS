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
$vers = getOP('vers');
$listentry = getOP('moment');
$qvariant=getOP("qvariant");
$gentries=array();



$debug="NONE!";

// Don't retreive all results if request was for a single dugga or a grade update
if(strcmp($opt,"GET")==0){
	if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {
		
		//$query = $pdo->prepare("SELECT usergroup.name FROM `usergroup` INNER JOIN user_usergroup ON user_usergroup.ugid=usergroup.ugid;");
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
					'kind' => (int)$row['kind'],
					'moment' => (int)$row['moment'],
					'visible'=> (int)$row['visible']
				)
			);
		}
		
		$query = $pdo->prepare("SELECT name FROM `usergroup`;");

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error retreiving moments and duggas. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
		}

		$currentMoment=null;
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			array_push(
				$gentries,
				array(
					'name' =>$row['name']
				)
			);
		}
	}
}



if(isset($_SERVER["REQUEST_TIME_FLOAT"])){
		$serviceTime = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];	
		$benchmark =  array('totalServiceTime' => $serviceTime);
}else{
		$benchmark="-1";
}

$array = array(
	'moments' => $gentries,
	'debug' => $debug,
	'moment' => $listentry,
	'benchmark' => $benchmark
);

echo json_encode($array);
// logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "resultedservice.php",$userid,$info);
?>
