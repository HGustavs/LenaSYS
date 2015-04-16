<?php 

//---------------------------------------------------------------------------------------------------------------
// editorService - Saves and Reads content for Code Editor
//---------------------------------------------------------------------------------------------------------------

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
$gradesys=getOP('gradesys');
if($gradesys=="UNK") $gradesys=0;

$debug="NONE!";	

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

if(checklogin()){
	$ha = hasAccess($userid, $courseid, 'w') || isSuperUser($userid);

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
							$query = $pdo->prepare("UPDATE listentries set pos=:pos,moment=:moment WHERE lid=:lid;");
							$query->bindParam(':lid', $armin[1]);
							$query->bindParam(':pos', $armin[0]);
							$query->bindParam(':moment', $armin[2]);
							//$query->bindParam(':moment', $moment);
							if(!$query->execute()) {
								$error=$query->errorInfo();
								$debug="Error updating entries".$error[2];
							}
					}
			}else if(strcmp($opt,"ORDERUPDATE")===0){
					$orderarr=explode(",",$order);
					foreach ($orderarr as $key => $value){
							$armin=explode("XX",$value);
							$query = $pdo->prepare("UPDATE listentries set pos=:pos,moment=:moment WHERE lid=:lid;");
							$query->bindParam(':lid', $armin[1]);
							$query->bindParam(':pos', $armin[0]);
							$query->bindParam(':moment', $armin[2]);
							//$query->bindParam(':moment', $moment);
							if(!$query->execute()) {
								$error=$query->errorInfo();
								$debug="Error updating entries".$error[2];
							}
					}
			}else if(strcmp($opt,"UPDATE")===0){
					$query = $pdo->prepare("UPDATE listentries set moment=:moment,entryname=:entryname,kind=:kind,link=:link,visible=:visible,gradesystem=:gradesys WHERE lid=:lid;");
					$query->bindParam(':lid', $sectid);
					$query->bindParam(':entryname', $sectname);

					if($moment=="null") $query->bindValue(':moment', null,PDO::PARAM_INT);
					else $query->bindParam(':moment', $moment);
						
					$query->bindParam(':kind', $kind);
					$query->bindParam(':link', $link);
					$query->bindParam(':visible', $visibility);
					$query->bindParam(':gradesys', $gradesys);
			
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
	$hr = ((checklogin() && hasAccess($userid, $courseid, 'r')) || $row['visibility'] != 0);
	if (!$hr) {
		if (checklogin()) {
			$hr = isSuperUser($userid);
		}
	}
}

$ha = (checklogin() && (hasAccess($userid, $courseid, 'w') || isSuperUser($userid)));

$resulties=array();
$query = $pdo->prepare("SELECT moment,grade,submitted,marked,useranswer FROM userAnswer WHERE uid=:uid AND cid=:cid AND vers=:vers;");
$query->bindParam(':cid', $courseid);
$query->bindParam(':vers', $coursevers);
$query->bindParam(':uid', $userid);

$result=$query->execute();
if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading results".$error[2];
}
foreach($query->fetchAll() as $row) {
	array_push(
		$resulties,
		array(
			'moment' => $row['moment'],
			'grade' => $row['grade'],
			'submitted' => $row['submitted'],
			'marked' => $row['marked'],
			'useranswer' => $row['useranswer']
		)
	);
}





$entries=array();
// If user has read access!
if($hr){
		$query = $pdo->prepare("SELECT lid,moment,entryname,pos,kind,link,visible,code_id,gradesystem FROM listentries WHERE listentries.cid=:cid and vers=:coursevers ORDER BY pos");
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
					'gradesys' => $row['gradesystem'],
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

		$query = $pdo->prepare("SELECT fileid,filename,kind FROM fileLink WHERE cid=:cid AND kind=1 ORDER BY filename");
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

		$query = $pdo->prepare("SELECT fileid,filename,kind FROM fileLink WHERE cid=:cid AND kind>1 ORDER BY kind,filename");
		$query->bindParam(':cid', $courseid);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries".$error[2];
		}
		$oldkind=-1;
		foreach($query->fetchAll() as $row) {
			if($row['kind']!=$oldkind){
					array_push($links,array('fileid' => -1,'filename' => "---===######===---"));
			}
			$oldkind=$row['kind'];
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
	'duggor' => $duggor,
	'results' => $resulties
);

echo json_encode($array);
?>
