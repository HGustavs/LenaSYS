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
	$userid="guest";		
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
$comments=getOP('comments');
$unmarked = 0;

if($gradesys=="UNK") $gradesys=0;

// Store current day in string
$today = date("Y-m-d H:i:s");

$debug="NONE!";	

$info=$opt." ".$courseid." ".$coursevers." ".$coursename;
$log_uuid = getOP('log_uuid');
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "sectionedservice.php",$userid,$info);

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

$isSuperUserVar=false;

$hasread=hasAccess($userid, $courseid, 'r');
$haswrite=hasAccess($userid, $courseid, 'w');

if(checklogin()){
	$isSuperUserVar=isSuperUser($userid);

	$ha = $haswrite || $isSuperUserVar;

	if($ha){
		// The code for modification using sessions
		if(strcmp($opt,"DEL")===0){
			$query = $pdo->prepare("DELETE FROM listentries WHERE lid=:lid");
			$query->bindParam(':lid', $sectid);
			
			if(!$query->execute()) {
				$debug="Error updating entries";
			}
		}else if(strcmp($opt,"NEW")===0){
			$query = $pdo->prepare("INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments) VALUES(:cid,:cvs,:entryname,:link,:kind,'100',:visible,:usrid,:comment)"); 
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':cvs', $coursevers);
			$query->bindParam(':usrid', $userid);
			$query->bindParam(':entryname', $sectname); 
			$query->bindParam(':link', $link); 
			$query->bindParam(':kind', $kind); 
			$query->bindParam(':comment', $comment); 
			$query->bindParam(':visible', $visibility); 
			
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
					// kind 0 == Header || 1 == Section || 2 == Code  ||�3 == Test (Dugga)|| 4 == Moment�|| 5 == Link
					$sname = "UNK";
					$queryz = $pdo->prepare("SELECT entryname FROM listentries WHERE vers=:cversion AND cid=:cid AND (kind=1 or kind=0 or kind=4) AND (pos < (SELECT pos FROM listentries WHERE lid=:lid)) ORDER BY pos DESC LIMIT 1;");
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
						
			$query = $pdo->prepare("UPDATE listentries set highscoremode=:highscoremode, moment=:moment,entryname=:entryname,kind=:kind,link=:link,visible=:visible,gradesystem=:gradesys,comments=:comments WHERE lid=:lid;");
			$query->bindParam(':lid', $sectid);
			$query->bindParam(':entryname', $sectname);
			$query->bindParam(':comments', $comments);
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

$cvisibility=false;
if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
		if($isSuperUserVar||$row['visibility']==1||($row['visibility']==2&&($hasread||$haswrite))||($row['visibility']==0&&$haswrite)) $cvisibility=true;
}

$ha = (checklogin() && ($haswrite || $isSuperUserVar));

// Retrieve quiz entries including release and deadlines
$duggor=array();
$releases=array();

$query = $pdo->prepare("SELECT id,qname,qrelease,deadline FROM quiz WHERE cid=:cid AND vers=:vers ORDER BY qname");
$query->bindParam(':cid', $courseid);
$query->bindParam(':vers', $coursevers);

if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading entries".$error[2];
}

// Create "duggor" array to store information about quizes and create "releases" to perform checks 

foreach($query->fetchAll() as $row) {
	$releases[$row['id']]=array(
			'release' => $row['qrelease'],
			'deadline' => $row['deadline']
	);
	array_push(
		$duggor,
		array(
			'id' => $row['id'],
			'qname' => $row['qname'],
			'release' => $row['qrelease'],
			'deadline' => $row['deadline']
		)
	);
}
$resulties=array();
$query = $pdo->prepare("SELECT moment,quiz,grade,DATE_FORMAT(submitted, '%Y-%m-%dT%H:%i:%s') AS submitted,DATE_FORMAT(marked, '%Y-%m-%dT%H:%i:%s') AS marked,useranswer FROM userAnswer WHERE uid=:uid AND cid=:cid AND vers=:vers;");
$query->bindParam(':cid', $courseid);
$query->bindParam(':vers', $coursevers);
$query->bindParam(':uid', $userid);
$result=$query->execute();

if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading results".$error[2];
}

foreach($query->fetchAll() as $row) {
	if(isset($releases[$row['quiz']])){
			$release=$releases[$row['quiz']]['release'];
			if($release<$today){
					$resulty=$row['grade'];	
					$markedy=$row['marked'];
			}else{
					$resulty=-1;
					$markedy=null;
			}
	}else{
        	$resulty=$row['grade'];
        	$markedy=$row['marked'];
	}
	array_push(
		$resulties,
		array(
			'moment' => $row['moment'],
			'grade' => $resulty,
			'submitted' => $row['submitted'],
			'marked' => $markedy,
			'useranswer' => $row['useranswer']
		)
	);
}

$entries=array();

if($cvisibility){
	$query = $pdo->prepare("SELECT lid,moment,entryname,pos,kind,link,visible,code_id,listentries.gradesystem,highscoremode,deadline,qrelease,comments FROM listentries LEFT OUTER JOIN quiz ON listentries.link=quiz.id WHERE listentries.cid=:cid and listentries.vers=:coursevers ORDER BY pos");
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':coursevers', $coursevers);
	$result=$query->execute();
	
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading entries".$error[2];
	}
	
	foreach($query->fetchAll() as $row) {	
		// Push info
		if($isSuperUserVar||$row['visible']==1||($row['visible']==2&&($hasread||$haswrite))||($row['visible']==0&&$haswrite==true)){
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
						'qrelease' => $row['qrelease'],
						'comments' => $row['comments']
					)
				);
		}
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

	// Reading entries in file database
	$query = $pdo->prepare("SELECT fileid,filename,kind FROM fileLink WHERE (cid=:cid AND kind>1) or isGlobal='1' ORDER BY kind,filename");
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
	$query=$pdo->prepare("SELECT exampleid, cid, examplename, sectionname, runlink, cversion FROM codeexample WHERE cid=:cid ORDER BY examplename;");
	$query->bindParam(':cid', $courseid);
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
	'readaccess' => $cvisibility,
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

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "sectionedservice.php",$userid,$info);

?>
