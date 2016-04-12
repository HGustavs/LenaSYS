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
	$userid="0";
	
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
$highscoremode=getOP('highscoremode');
$versid=getOP('versid');
$coursename=getOP('coursename');
$versname=getOP('versname');
$coursecode=getOP('coursecode');
$coursenamealt=getOP('coursenamealt');
$log_uuid = getOP('log_uuid');
$log_timestamp = getOP('log_timestamp');
$unmarked = 0;

logServiceEvent($log_uuid, EventTypes::ServiceClientStart, "sectionedservice.php", $log_timestamp);
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "sectionedservice.php");

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
				
				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating entries".$error[2];
				}
			}
		}else if(strcmp($opt,"UPDATE")===0){

			// Insert a new code example and update variables accordingly.
			if($link==-1){

					// Find section name - Last preceding section name if none - assigns UNK - so we know that nothing was found
					$sname = "UNK";
					$queryz = $pdo->prepare("SELECT entryname FROM listentries WHERE vers=:cversion AND cid=:cid AND (kind=1 or kind=0) AND (pos < (SELECT pos FROM listentries WHERE lid=:lid)) ORDER BY pos DESC LIMIT 1;");
					$queryz->bindParam(':cid', $courseid);
					$queryz->bindParam(':cversion', $coursevers);
					$queryz->bindParam(':lid', $sectid);
					if(!$queryz->execute()) {
						$error=$queryz->errorInfo();
						$debug="Error reading entries".$error[2];
					}
					foreach($queryz->fetchAll() as $row) {
								$sname=$row['entryname'];
					}

					$query2 = $pdo->prepare("INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion) values (:cid,:ename,:sname,1,:cversion);");
			
					$query2->bindParam(':cid', $courseid);
					$query2->bindParam(':cversion', $coursevers);
					$query2->bindParam(':ename', $sectname);					
					$query2->bindParam(':sname', $sname);					
			
					if(!$query2->execute()) {
						$error=$query2->errorInfo();
						$debug="Error updating entries".$error[2];
					}

					$link=$pdo->lastInsertId();

			}			
						
			$query = $pdo->prepare("UPDATE listentries set highscoremode=:highscoremode, moment=:moment,entryname=:entryname,kind=:kind,link=:link,visible=:visible,gradesystem=:gradesys WHERE lid=:lid;");
			$query->bindParam(':lid', $sectid);
			$query->bindParam(':entryname', $sectname);
			$query->bindParam(':highscoremode', $highscoremode);
			
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
			
			// insert into list forthe specific course
			if($kind == 4){
				$query2 = $pdo->prepare("INSERT INTO list(listnr,listeriesid,responsible,course) values('23415',:lid,'Christina Sjogren',:cid);");

				$query2->bindParam(':cid', $courseid);
				$query2->bindParam(':lid', $sectid);

				if(!$query2->execute()) {
					$error=$query2->errorInfo();
					$debug="Error updating entries".$error[2];
				}
			}
		}else if(strcmp($opt,"NEWVRS")===0){
			$query = $pdo->prepare("INSERT INTO vers(cid,coursecode,vers,versname,coursename,coursenamealt) values(:cid,:coursecode,:vers,:versname,:coursename,:coursenamealt);");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':coursecode', $coursecode);
			$query->bindParam(':vers', $versid);
			$query->bindParam(':versname', $versname);				
			$query->bindParam(':coursename', $coursename);
			$query->bindParam(':coursenamealt', $coursenamealt);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating entries".$error[2];
			}
			
		}else if(strcmp($opt,"UPDATEVRS")===0){
			$query = $pdo->prepare("UPDATE vers SET versname=:versname WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':coursecode', $coursecode);
			$query->bindParam(':vers', $versid);
			$query->bindParam(':versname', $versname);				

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating entries".$error[2];
			}
		}else if(strcmp($opt,"CHGVERS")===0){
			$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':vers', $versid);		

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
$query = $pdo->prepare("SELECT moment,grade,DATE_FORMAT(submitted, '%Y-%m-%dT%H:%i:%s') AS submitted,DATE_FORMAT(marked, '%Y-%m-%dT%H:%i:%s') AS marked,useranswer FROM userAnswer WHERE uid=:uid AND cid=:cid AND vers=:vers;");
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
$reada = (checklogin() && (hasAccess($userid, $courseid, 'r')||isSuperUser($userid)));

if($reada || $userid == "guest"){
	$query = $pdo->prepare("SELECT lid,moment,entryname,pos,kind,link,visible,code_id,listentries.gradesystem,highscoremode,deadline,qrelease FROM listentries LEFT OUTER JOIN quiz ON listentries.link=quiz.id WHERE listentries.cid=:cid and vers=:coursevers ORDER BY pos");
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':coursevers', $coursevers);
	$result=$query->execute();
	
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading entries".$error[2];
	}
	
	foreach($query->fetchAll() as $row) {	
		// Push info
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
				'highscoremode'=> $row['highscoremode'],
				'gradesys' => $row['gradesystem'],
				'code_id' => $row['code_id'],
				'deadline'=> $row['deadline'],
				'qrelease' => $row['qrelease']
			)
		);
	}
}

$query = $pdo->prepare("SELECT coursename, coursecode FROM course WHERE cid=:cid LIMIT 1");
$query->bindParam(':cid', $courseid);

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

$duggor=array();
$links=array();

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
$codeexamples = array();

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

	$query = $pdo->prepare("SELECT fileid,filename,kind FROM fileLink WHERE isGlobal='1' ORDER BY filename");
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

	// Reading entries in file database
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
		array_push($links,array('fileid' => $row['fileid'],'filename' => $row['filename']));
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
	
	$codeexamples=array();

	// New Example
	array_push($codeexamples,array('exampleid' => "-1",'cid' => '','examplename' => '','sectionname' => '&laquo;New Example&raquo;','runlink' => "",'cversion' => ""));
	$query=$pdo->prepare("SELECT exampleid, cid, examplename, sectionname, runlink, cversion FROM codeexample;");
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading code examples".$error[2];
	}else{
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			array_push(
				$codeexamples,
				array(
					'exampleid' => $row['exampleid'],
					'cid' => $row['cid'],
					'examplename' => $row['examplename'],
					'sectionname' => $row['sectionname'],
					'runlink' => $row['runlink'],
					'cversion' => $row['cversion']
				)
			);
		}
	}

	// Should be optimized into one query!
	$query=$pdo->prepare("select count(*) as unmarked from userAnswer where cid=:cid and (submitted is not null and useranswer is not null and grade is null);");
	$query->bindParam(':cid', $courseid);
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading number of unmarked duggas".$error[2];
	}else{
		$row = $query->fetchAll(PDO::FETCH_ASSOC);
		$unmarked = $row[0]["unmarked"];

	}
	$query=$pdo->prepare("select count(*) as unmarked from userAnswer where cid=:cid and (grade = 1 and submitted > marked);");
	$query->bindParam(':cid', $courseid);
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading number of unmarked duggas".$error[2];
	}else{
		$row = $query->fetchAll(PDO::FETCH_ASSOC);
		$unmarked += $row[0]["unmarked"];

	}
}

$array = array(
	'entries' => $entries,
	"debug" => $debug,
	'writeaccess' => $ha,
	'readaccess' => $hr,
	'coursename' => $coursename,
	'coursevers' => $coursevers,
	'coursecode' => $coursecode,
	'courseid' => $courseid,
	'links' => $links,
	'duggor' => $duggor,
	'results' => $resulties,
	'versions' => $versions,
	'codeexamples' => $codeexamples,
	'unmarked' => $unmarked
);

echo json_encode($array);
logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "sectionedservice.php");
?>

