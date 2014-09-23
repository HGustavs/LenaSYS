<?php 

//---------------------------------------------------------------------------------------------------------------
// editorService - Saves and Reads content for Code Editor
//---------------------------------------------------------------------------------------------------------------

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

$opt=getOP('opt');
$courseid=getOP('courseid');
$coursevers=getOP('coursevers');

$moment=getOP('moment');
$sectid=getOP('lid');
$sectname=getOP('sectname');
$kind=getOP('kind');
$link=getOP('link');
$visibility=getOP('visibility');
$order=getOP('order');

$debug="NONE!";	

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

if(checklogin()){
	$ha = hasAccess($_SESSION['uid'], $courseid, 'w') || isSuperUser($_SESSION["uid"]);

	if($ha){

			// The code for modification using sessions
			if(strcmp($opt,"DEL")===0){
					$query = $pdo->prepare("DELETE FROM listentries WHERE lid=:lid");
					$query->bindParam(':lid', $sectid);
					if(!$query->execute()) {
						$debug="Error updating entries";
					}
			}else if(strcmp($opt,"NEW")===0){
					$query = $pdo->prepare("INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator) VALUES(:cid,:cvs,'New Item','', '0', '100','0',:usrid)");
					$query->bindParam(':cid', $courseid);
					$query->bindParam(':cvs', $coursevers);
					$query->bindParam(':usrid', $userid);
					if(!$query->execute()) {
						$error=$query->errorInfo();
						$debug="Error updating entries".$error[2];
					}
			}else if(strcmp($opt,"REORDER")===0){
					$orderarr=explode(",",$order);
					foreach ($orderarr as $key => $value){
							$armin=explode("XX",$value);
							$query = $pdo->prepare("UPDATE listentries set pos=:pos WHERE lid=:lid;");
							$query->bindParam(':lid', $armin[1]);
							$query->bindParam(':pos', $armin[0]);
							if(!$query->execute()) {
								$error=$query->errorInfo();
								$debug="Error updating entries".$error[2];
							}
					}
			}else if(strcmp($opt,"UPDATE")===0){
					$query = $pdo->prepare("UPDATE listentries set moment=:moment,entryname=:entryname,kind=:kind,link=:link,visible=:visible WHERE lid=:lid;");
					$query->bindParam(':lid', $sectid);
					$query->bindParam(':entryname', $sectname);

					if($moment=="null") $query->bindValue(':moment', null,PDO::PARAM_INT);
					else $query->bindParam(':moment', $moment);
						
					$query->bindParam(':kind', $kind);
					$query->bindParam(':link', $link);
					$query->bindParam(':visible', $visibility);
			
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

$query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:cid");
$query->bindParam(':cid', $courseid);
if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading visibility ".$error[2];
}
if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
	$hr = ((checklogin() && hasAccess($_SESSION['uid'], $courseid, 'r')) || $row['visibility'] != 0);
	if (!$hr) {
		if (checklogin()) {
			$hr = isSuperUser($_SESSION['uid']);
		}
	}
}

$ha = (checklogin() && (hasAccess($_SESSION['uid'], $courseid, 'w') || isSuperUser($_SESSION["uid"])));

$entries=array();
// If user has read access!
if($hr){
		$query = $pdo->prepare("SELECT lid,moment,entryname,pos,kind,link,visible,code_id FROM listentries WHERE listentries.cid=:cid and vers=:coursevers ORDER BY pos");
		$query->bindParam(':cid', $courseid);
		$query->bindParam(':coursevers', $coursevers);
		$result=$query->execute();
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries".$error[2];
		}
		foreach($query->fetchAll() as $row) {
			array_push(
				$entries,
				array(
					'entryname' => $row['entryname'],
					'lid' => $row['lid'],
					'pos' => $row['pos'],
					'kind' => $row['kind'],
					'moment' => $row['moment'],
					'link'=> $row['link'],
					'visible'=> $row['visible'],
					'code_id' => $row['code_id']
				)
			);
		}
}

$query = $pdo->prepare("SELECT coursename FROM course WHERE cid=:cid LIMIT 1");
$query->bindParam(':cid', $courseid);
$coursename = "Course not Found!";
if($query->execute()) {
	foreach($query->fetchAll() as $row) {
			$coursename=$row['coursename'];		
	}
} else {
			$error=$query->errorInfo();
			$debug="Error reading entries".$error[2];
}

$duggor=array();
$links=array();

if($ha){

		$query = $pdo->prepare("SELECT id,qname FROM quiz WHERE cid=:cid ORDER BY qname");
		$query->bindParam(':cid', $courseid);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries".$error[2];
		}
		foreach($query->fetchAll() as $row) {
			array_push(
				$duggor,
				array(
					'id' => $row['id'],
					'qname' => $row['qname']
				)
			);
		}

		$query = $pdo->prepare("SELECT fileid,filename FROM fileLink WHERE cid=:cid ORDER BY filename");
		$query->bindParam(':cid', $courseid);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries".$error[2];
		}
		foreach($query->fetchAll() as $row) {
			array_push(
				$links,
				array(
					'fileid' => $row['fileid'],
					'filename' => $row['filename']
				)
			);
		}
}

$array = array(
	'entries' => $entries,
	"debug" => $debug,
	'writeaccess' => $ha,
	'readaccess' => $hr,
	'coursename' => $coursename,
	'coursevers' => $coursevers,
	'courseid' => $courseid,
	'links' => $links,
	'duggor' => $duggor
);

echo json_encode($array);
?>
