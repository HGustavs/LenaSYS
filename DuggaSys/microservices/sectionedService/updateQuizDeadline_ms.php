<?php
//---------------------------------------------------------------------------------------------------------------
// Microservice updateQuizDeadline updates the deadline for a quiz (dugga)
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
include_once "../DuggaSys/gitfetchService.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="guest";
}

// Gets username based on uid, USED FOR LOGGING
$query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query-> execute();

// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
while ($row = $query->fetch(PDO::FETCH_ASSOC)){
	$username = $row['username'];
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
$makeactive=getOP('makeactive');
$startdate=getOP('startdate');
$enddate=getOP('enddate');
$showgrps=getOP('showgrp');
$grptype=getOP('grptype');
$deadline=getOP('deadline');
$relativedeadline=getOP('relativedeadline');
$pos=getOP('pos');
$jsondeadline = getOP('jsondeadline');
$studentTeacher = false;
$feedbackenabled =getOP('feedback');
$feedbackquestion =getOP('feedbackquestion');
$motd=getOP('motd');
$tabs=getOP('tabs');
$exampelid=getOP('exampleid');
$url=getOP('url');

$lid=getOP('lid');
$visbile = 0;
$avgfeedbackscore = 0;

$grpmembershp="UNK";
$unmarked = 0;
$groups=array();
$grplst=array();

if($feedbackenabled != 1){
	$feedbackenabled = 0;
}

if($gradesys=="UNK") $gradesys=0;

		$today = date("Y-m-d H:i:s");

		$debug="NONE!";

		$info="opt: ".$opt." courseid: ".$courseid." coursevers: ".$coursevers." coursename: ".$coursename;
		$log_uuid = getOP('log_uuid');
		 logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "sectionedservice.php",$userid,$info);

		//------------------------------------------------------------------------------------------------
		// Services
		//------------------------------------------------------------------------------------------------

		
		$isSuperUserVar=false;

		$hasread=hasAccess($userid, $courseid, 'r');
		$studentTeacher=hasAccess($userid, $courseid, 'st');
		$haswrite=hasAccess($userid, $courseid, 'w');

		if(checklogin()){
			if(isset($_SESSION['uid'])){
				$userid=$_SESSION['uid'];
				$hasread=hasAccess($userid, $courseid, 'r');
				$studentTeacher=hasAccess($userid, $courseid, 'st');
				$haswrite=hasAccess($userid, $courseid, 'w');
			}else{
				$userid="guest";
			}
		    $stmt = $pdo->prepare("SELECT groupKind,groupVal FROM `groups`");

		    if (!$stmt->execute()) {
		        $error=$stmt->errorInfo();
		        $debug="Error getting groups " . $error[2];
		    } else {
		        foreach($stmt->fetchAll(PDO::FETCH_ASSOC) as $row){
		            if(!isset($groups[$row['groupKind']])){
		                $groups[$row['groupKind']]=array();
		            }
		            array_push($groups[$row['groupKind']],$row['groupVal']);
		        }
		    }

		    $isSuperUserVar=isSuperUser($userid);
		    $ha = $haswrite || $isSuperUserVar;
			
			if(strcmp($opt,"UPDATEDEADLINE")===0){
                $deadlinequery = $pdo->prepare("UPDATE quiz SET deadline=:deadline, relativedeadline=:relativedeadline WHERE id=:link;");
                $deadlinequery->bindParam(':deadline',$deadline);
                $deadlinequery->bindParam(':relativedeadline',$relativedeadline);
                $deadlinequery->bindParam(':link',$link);
                
                if(!$deadlinequery->execute()){
                    $error=$deadlinequery->errorInfo();
                    $debug="ERROR THE DEADLINE QUERY FAILED".$error[2];
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
				if($isSuperUserVar||$row['visibility']==1||($row['visibility']==2&&($hasread||$haswrite))||($row['visibility']==0&&($haswrite==true||$studentTeacher==true))) $cvisibility=true;
		}

		$ha = (checklogin() && ($haswrite || $isSuperUserVar));

		// Retrieve quiz entries including release and deadlines
		$duggor=array();
		$releases=array();

		$query = $pdo->prepare("SELECT id,qname,qrelease,deadline,relativedeadline FROM quiz WHERE cid=:cid AND vers=:vers ORDER BY qname");
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
					'deadline' => $row['deadline'],
					'relativedeadline' => $row['relativedeadline']
			);
			array_push(
				$duggor,
				array(
					'id' => $row['id'],
					'qname' => $row['qname'],
					'release' => $row['qrelease'],
					'deadline' => $row['deadline'],
					'relativedeadline' => $row['relativedeadline']
				)
			);
		}

		$query = $pdo->prepare("SELECT `groups` FROM user_course WHERE uid=:uid AND cid=:cid;");
		$query->bindParam(':cid', $courseid);
		$query->bindParam(':uid', $userid);
		$result=$query->execute();

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading results".$error[2];
		}

		foreach($query->fetchAll() as $row) {
		    if(is_null($row['groups'])){
		        $grpmembershp="UNK";
		    }else{
		        $grpmembershp=$row['groups'];
		    }

		    //$grpmembershp=trim($row['groups']);
		    //$grpmembershp=explode(" ", $grpmembershp);
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

		$today_dt=new DateTime($today);
		foreach($query->fetchAll() as $row) {
		    /*
		    if(isset($releases[$row['quiz']])){
		        if(is_null($releases[$row['quiz']]['release'])){
		            $release_dt=new DateTime();
		            $debug=$release_dt->format('Y-m-d\TH:i:s.u');
		        }else{
		            $release_dt=new DateTime($releases[$row['quiz']]['release']);
		        }
		        if($release_dt<$today_dt){
		            $resulty=$row['grade'];
		            $markedy=$row['marked'];
		        }else{
		            $resulty=-1;
		            $markedy=null;
		        }
		    }else{
		        $resulty=$row['grade'];
		        $markedy=$row['marked'];
		    }*/

		    $resulty=$row['grade'];
		    $markedy=$row['marked'];

		    // Remove grade and feedback if a release date is set and has not occured
		    if(isset($releases[$row['quiz']])){
		        if(!is_null($releases[$row['quiz']]['release'])){
		            $release_dt=new DateTime($releases[$row['quiz']]['release']);
		            if($release_dt>$today_dt){
		                $resulty=-1;
		                $markedy=null;
		            }
		        }
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
			$query = $pdo->prepare("SELECT lid,moment,entryname,pos,kind,link,visible,code_id,listentries.gradesystem,highscoremode,deadline,relativedeadline,qrelease,comments, qstart, jsondeadline, groupKind, 
			 ts, listentries.gradesystem as tabs, feedbackenabled, feedbackquestion FROM listentries LEFT OUTER JOIN quiz ON listentries.link=quiz.id 
					WHERE listentries.cid=:cid and listentries.vers=:coursevers ORDER BY pos");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':coursevers', $coursevers);
			$result=$query->execute();

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading entries".$error[2];
			}

			foreach($query->fetchAll() as $row) {
				if($isSuperUserVar||$row['visible']==1||($row['visible']==2&&($hasread||$haswrite))||($row['visible']==0&&($haswrite==true||$studentTeacher==true))){
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
								'relativedeadline'=> $row['relativedeadline'],
								'qrelease' => $row['qrelease'],
								'comments' => $row['comments'],
								'qstart' => $row['qstart'],
								'grptype' => $row['groupKind'],
								'tabs' => $row['tabs'],
								'feedbackenabled' => $row['feedbackenabled'],
								'feedbackquestion' => $row['feedbackquestion'],
								'ts' => $row['ts'],
							)
						);
				}
			}
		}

		$query = $pdo->prepare("SELECT coursename, coursecode FROM course WHERE cid=:cid LIMIT 1");
		$query->bindParam(':cid', $courseid);

		$coursename = "UNK";
		$coursecode = "UNK";

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
		$query=$pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate,motd FROM vers;");
		// After column 'motd' exist on all releases the outer if-statement can be removed.
		if(!$query->execute()) {
			$query=$pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate FROM vers;");
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
							'coursenamealt' => $row['coursenamealt'],
							'startdate' => $row['startdate'],
							'enddate' => $row['enddate'],
						)
					);
				}
			}
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
						'coursenamealt' => $row['coursenamealt'],
						'startdate' => $row['startdate'],
						'enddate' => $row['enddate'],
						'motd' => $row['motd']
					)
				);
			}
		}
		$codeexamples = array();

		if($ha || $studentTeacher){
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
			$query=$pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate,motd FROM vers;");
			// After column 'motd' exist on all releases the outer if-statement can be removed.
			if(!$query->execute()) {
				$query=$pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate FROM vers;");
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
								'coursenamealt' => $row['coursenamealt'],
								'startdate' => $row['startdate'],
								'enddate' => $row['enddate'],
							)
						);
					}
				}
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
							'coursenamealt' => $row['coursenamealt'],
							'startdate' => $row['startdate'],
							'enddate' => $row['enddate'],
							'motd' => $row['motd']
						)
					);
				}
			}
			$codeexamples=array();

			// New Example
			array_push($codeexamples,array('exampleid' => "-1",'cid' => '','examplename' => '','sectionname' => 'New Example','runlink' => "",'cversion' => ""));
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

		  $query=$pdo->prepare("select count(*) as unmarked from userAnswer where cid=:cid and ((grade = 1 and submitted > marked) OR (submitted is not null and useranswer is not null and grade is null));");
			$query->bindParam(':cid', $courseid);
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading number of unmarked duggas".$error[2];
			}else{
		    foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
		        $unmarked = $row["unmarked"];
		    }
			}

			$queryo=$pdo->prepare("SELECT startdate,enddate FROM vers WHERE cid=:cid AND vers=:vers LIMIT 1;");
			$queryo->bindParam(':cid', $courseid);
			$queryo->bindParam(':vers', $coursevers);
			if(!$queryo->execute()) {
				$error=$queryo->errorInfo();
				$debug="Error reading start/stopdate".$error[2];
			}else{
		    foreach($queryo->fetchAll(PDO::FETCH_ASSOC) as $row){
		      $startdate = $row["startdate"];
		      $enddate = $row["enddate"];
		    }
		  }
		}else{
			$query = $pdo->prepare("SELECT fileid,filename,kind FROM fileLink WHERE cid=:cid AND kind=1 ORDER BY filename");
			$query->bindParam(':cid', $courseid);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading entries".$error[2];
			}

			$queryo=$pdo->prepare("SELECT startdate,enddate FROM vers WHERE cid=:cid AND vers=:vers LIMIT 1;");
			$queryo->bindParam(':cid', $courseid);
			$queryo->bindParam(':vers', $coursevers);
			if(!$queryo->execute()) {
				$error=$queryo->errorInfo();
				$debug="Error reading start/stopdate".$error[2];
			}else{
		    foreach($queryo->fetchAll(PDO::FETCH_ASSOC) as $row){
		      $startdate = $row["startdate"];
		      $enddate = $row["enddate"];
		    }
		  }
		}

		$userfeedback=array();
		// Fetches All data from Userduggafeedback
		if(strcmp($opt,"GETUF")==0){
			$query = $pdo->prepare("SELECT * FROM userduggafeedback WHERE lid=:lid AND cid=:cid");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':lid', $moment);
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading courses".$error[2];
			}else{
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
					array_push(
						$userfeedback,
						array(
							'ufid' => $row['ufid'],
							'username' => $row['username'],
							'cid' => $row['cid'],
							'lid' => $row['lid'],
							'score' => $row['score'],
							'entryname' => $row['entryname']
						)
					);
				}
			}
			$query = $pdo->prepare("SELECT AVG(score) FROM userduggafeedback WHERE lid=:lid AND cid=:cid");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':lid', $moment);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading courses".$error[2];
			} else{
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
					$avgfeedbackscore = $row[0];
				}				
			}
		}
		$array = array(
			"entries" => $entries,
			"debug" => $debug,
			"writeaccess" => $ha,
			"studentteacher" => $studentTeacher,
			"readaccess" => $cvisibility,
			"coursename" => $coursename,
			"coursevers" => $coursevers,
			"coursecode" => $coursecode,
			"courseid" => $courseid,
			"links" => $links,
			"duggor" => $duggor,
			"results" => $resulties,
			"versions" => $versions,
			"codeexamples" => $codeexamples,
			"unmarked" => $unmarked,
			"startdate" => $startdate,
			"enddate" => $enddate,
			"groups" => $groups,
		  "grpmembershp" => $grpmembershp,
		  "grplst" => $grplst,
		  "userfeedback" => $userfeedback,
		  "feedbackquestion" => $feedbackquestion,
		  "avgfeedbackscore" => $avgfeedbackscore
		);

				function getDeletedEntries($opt){
					
					pdoConnect();
					session_start();
					//This will enable fetching every listentry with visibility DELETED and will enable restoring deleted items
				if(strcmp($opt,"DISPLAYDELETED")===0) {
					$resultArray = array();
					$query = $pdo->prepare("SELECT * FROM listentries WHERE visible = '3'");
					$query -> execute();
					$result = $query -> fetchAll();
					
					foreach( $result as $row ) {
    					$resultArray = array($row);
						}
						return $resultArray;
					if(!$query->execute()) {
						if($query->errorInfo()[0] == 23000) {
							$debug = "foreign key constraint.";
						} else {
							$debug = "Error.";
						}
					}
				}
			}

		echo json_encode($array);

		logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "sectionedservice.php",$userid,$info);


?>
