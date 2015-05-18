<?php

//---------------------------------------------------------------------------------------------------------------
// editorService - Saves and Reads content for Code Editor
//---------------------------------------------------------------------------------------------------------------

// Missing Functionality
//		New Code Example + New Dugga
//		Graying link accordingly

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";


// Connect to database and start session
pdoConnect();
session_start();

$opt=getOP('opt');
$cid=getOP('cid');
$coursename=getOP('coursename');
$visibility=getOP('visib');
$activevers=getOP('activevers');
$activeedvers=getOP('activeedvers');
$versid=getOP('versid');
$versname=getOP('versname');
$coursenamealt=getOP('coursenamealt');
$coursecode=getOP('coursecode');

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="UNK";		
} 

$hr="";
if(isSuperUser($userid)){
	$ha=true;
}else{
	$ha=false;
}

$debug="NONE!";	

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

if($ha){
	// The code for modification using sessions
	if(strcmp($opt,"DEL")===0){
	
	}else if(strcmp($opt,"NEW")===0){
		$query = $pdo->prepare("INSERT INTO course (coursecode,coursename,visibility,creator) VALUES(:coursecode,:coursename,0,:usrid)");
		
		$query->bindParam(':usrid', $userid);
		$query->bindParam(':coursecode', $coursecode);
		$query->bindParam(':coursename', $coursename);
		
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
		}
	}else if(strcmp($opt,"NEWVRS")===0){
		$query = $pdo->prepare("INSERT INTO vers(cid,coursecode,vers,versname,coursename,coursenamealt) values(:cid,:coursecode,:vers,:versname,:coursename,:coursenamealt);");
		
		$query->bindParam(':cid', $cid);
		$query->bindParam(':coursecode', $coursecode);
		$query->bindParam(':vers', $versid);
		$query->bindParam(':versname', $versname);				
		$query->bindParam(':coursename', $coursename);
		$query->bindParam(':coursenamealt', $coursenamealt);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
		}
	}else if(strcmp($opt,"UPDATE")===0){
		$query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode WHERE cid=:cid;");
		
		$query->bindParam(':cid', $cid);
		$query->bindParam(':coursename', $coursename);
		$query->bindParam(':visibility', $visibility);
		$query->bindParam(':coursecode', $coursecode);
		
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
		}
	}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

$entries=array();

if($ha){
	$query = $pdo->prepare("SELECT coursename,coursecode,cid,visibility,activeversion,activeedversion FROM course WHERE visibility<3 ORDER BY coursename");
}else{
	$query = $pdo->prepare("SELECT coursename,coursecode,cid,visibility,activeversion,activeedversion FROM course WHERE visibility>0 and visibility<3 ORDER BY coursename");
}

if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses".$error[2];
}else{
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
		array_push(
			$entries,
			array(
				'cid' => $row['cid'],
				'coursename' => $row['coursename'],
				'coursecode' => $row['coursecode'],
				'visibility' => $row['visibility'],
				'activeversion' => $row['activeversion'],
				'activeedversion' => $row['activeedversion']
				)
			);
	}
} 

$versions=array();
$query=$pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt FROM vers;");

if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses".$error[2];
}else{
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
		array_push(
			$versions,
			array(
				'cid' => $row['cid'],
				'coursecode' => $row['coursecode'],
				'vers' => $row['vers'],
				'versname' => $row['versname'],
				'coursename' => $row['coursename'],
				'coursenamealt' => $row['coursenamealt']
			)
		);
	}
}

$array = array(
	'entries' => $entries,
	'versions' => $versions,
	"debug" => $debug,
	'writeaccess' => $ha,
	'readaccess' => $hr,
	);

echo json_encode($array);

?>

