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
$opt = getOP('opt');
$coursevers = getOP('coursevers');
$fid = getOP('fid');

$filename = getOP('filename');
$kind = getOP('kind');

$debug="NONE!";	

$log_uuid = getOP('log_uuid');
$info=$opt." ".$cid." ".$coursevers." ".$fid." ".$filename." ".$kind;
logServiceEvent($userid, EventTypes::ServiceServerStart, "fileedservice.php",$userid,$info);

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {
	if(strcmp($opt,"DELFILE")===0){
		// Remove from database
		$querystring='DELETE FROM fileLink WHERE fileid=:fid';
		$query = $pdo->prepare($querystring);
		$query->bindParam(':fid', $fid);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating file list ".$error[2];
		}						
		// Remove from filesystem? Only for local files ... Course-wide and Global files could be used elsewhere
		// TODO:		
	}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

$entries=array();

$files=array();
$lfiles =array();
$gfiles =array();
if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {
	$query = $pdo->prepare("SELECT fileid,filename,kind, filesize, uploaddate FROM fileLink WHERE (cid=:cid or isGlobal='1') ORDER BY filename;");
	$query->bindParam(':cid', $cid);
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading files ".$error[2];
	}
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
		
		$entry = array(
			'fileid' => $row['fileid'],
			'filename' => $row['filename'],
			'kind' => $row['kind'],
			'filesize' => $row['filesize'],
			'uploaddate' => $row['uploaddate']
		);

		array_push($entries, $entry);
	}

	// Start at the "root-level"
	chdir('../');
	$currcvd=getcwd();

	$dir = $currcvd."/templates/";
	
	if (file_exists($dir)){
		$files = scandir($dir);
		foreach ($files as $value){
			if(!is_dir($currcvd."/templates/".$value)){
				array_push($gfiles,$value);
			}
		}
	}

	$dir = $currcvd."/courses/".$cid."/";

	if (file_exists($dir)){
		$gtiles = scandir($dir);
		foreach ($gtiles as $value){
			if(!is_dir($currcvd."/courses/".$cid."/".$value)){
				array_push($lfiles,$value);
			}
		}
	}
}
		
$array = array(
	'entries' => $entries,
	'debug' => $debug,
	'gfiles' => $gfiles,
	'lfiles' => $lfiles
);

echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "fileedservice.php",$userid,$info);

?>
