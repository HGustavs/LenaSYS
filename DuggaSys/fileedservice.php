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
$opt = getOP('opt');
$coursevers = getOP('coursevers');
$fid = getOP('fid');

$filename = getOP('filename');
$kind = getOP('kind');

$debug="NONE!";	

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {
		if(strcmp($opt,"DELFILE")===0){
				$querystring='DELETE FROM filelink WHERE fileid=:fid';	
				$query = $pdo->prepare($querystring);
				$query->bindParam(':fid', $fid);
				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating file list ".$error[2];
				}								
		}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

$entries=array();

$files=array();

if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {

		$query = $pdo->prepare("SELECT fileid,filename,kind FROM filelink WHERE cid=:cid ORDER BY filename;");
		$query->bindParam(':cid', $cid);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading files ".$error[2];
		}
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			
			$entry = array(
				'fileid' => $row['fileid'],
				'filename' => $row['filename'],
				'kind' => $row['kind']
			);

			array_push($entries, $entry);
		}

		$dir    = './templates';
		$gfiles =array();
		if (file_exists($dir)){
				$giles = scandir($dir);
				foreach ($giles as $value){
						array_push($gfiles,$value);
				}
		}

		$dir    = "./Courses/".$cid."/";
		$lfiles =array();
		if (file_exists($dir)){
				$giles = scandir($dir);
				foreach ($giles as $value){
						if(!is_dir("./Courses/".$cid."/".$value)){
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


?>
