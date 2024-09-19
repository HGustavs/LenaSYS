<?php

//---------------------------------------------------------------------------------------------------------------
// editorService - Saves and Reads content for Code Editor
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
include_once "./gitfetchService.php";

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
$githubURL=getOP('githubURL');
$codeExampleData=getOP('codeExampleData');
$lid=getOP('lid');
$codeExampleName=getOP('codeExampleName');
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
	if(strcmp($opt,"GRP")===0) {
		$query = $pdo->prepare("SELECT user.uid,user.username,user.firstname,user.lastname,user.email,user_course.groups FROM user,user_course WHERE user.uid=user_course.uid AND cid=:cid AND vers=:vers");
		$query->bindParam(':cid', $courseid);
		$query->bindParam(':vers', $coursevers);
		/*
		$glst=array();
		if($showgrp!="UNK"){
			foreach($groups as $grptype){
				if(in_array($showgrp,$grptype)){
					$glst=$grptype;
					break;
				}
			}
		}
		*/
		if($query->execute()) {
			$showgrps=explode(',',$showgrps);
			$showgrp=$showgrps[0];
			if($ha || $studentTeacher)$showgrp=explode('_',$showgrp)[0];
			foreach($query->fetchAll() as $row) {
				$grpmembershp=$row['groups'];
				if (!empty($grpmembershp)){
					$grpletters = $grpmembershp[0] . $grpmembershp[1];
					if (strpos($showgrp, $grpletters)!==false){
						$email=$row['email'];
						if(is_null($email)){
							$email=$row['username']."@student.his.se";
						}
						array_push($grplst, array($row['groups'],$row['firstname'],$row['lastname'],$email));
					}
				}
			}
			sort($grplst);
			/*
			foreach($query->fetchAll() as $row) {
				if(isset($row['groups'])){
					$grpmembershp = explode(" ", $row['groups']);

					foreach($grpmembershp as $member){
						if($ha||in_array($member,$grplst)){
							foreach($groups as $groupKind=>$group){
							if(in_array($member,$group)){
								if(!isset($grplst[$groupKind])){
									$grplst[$groupKind]=array();
								}
								if(!isset($grplst[$groupKind][$member])){
									$grplst[$groupKind][$member]=array();
								}
								array_push($grplst[$groupKind][$member], array($row['firstname'],$row['lastname'],$row['email']));
							}
							}

						}

					}
				}
			}
			*/
		}else{
			$debug="Failed to get group members!";
		}
	}
	
	if($ha || $studentTeacher) {
		// The code for modification using sessions
		if(strcmp($opt,"DEL")===0) {
			// Delete foreign key references
			$query = $pdo->prepare("DELETE FROM useranswer WHERE moment=:lid");
			$query->bindParam(':lid', $sectid);

			if(!$query->execute()) {
				if($query->errorInfo()[0] == 23000) {
					$debug = "The item could not be deleted.";
				}
			}
			// Delete the listentry
			$query = $pdo->prepare("DELETE FROM listentries WHERE lid=:lid");
			$query->bindParam(':lid', $sectid);

			if(!$query->execute()) {
				if($query->errorInfo()[0] == 23000) {
					$debug = "The item could not be deleted because of a foreign key constraint.";
				} else {
					$debug = "The item could not be deleted.";
				}
			}

		}
		//This will change the visibility of a listentry to deleted instead of deleting the item from the database. This will enable restoring deleted items.
		if(strcmp($opt,"DELETED")===0) {
			$query = $pdo->prepare("UPDATE listentries SET visible = '3' WHERE lid=:lid");
			$query->bindParam(':lid', $sectid);

			if(!$query->execute()) {
				if($query->errorInfo()[0] == 23000) {
					$debug = "foreign key constraint.";
				} else {
					$debug = "Error.";
				}
			}
		}
		
		else if(strcmp($opt,"NEW")===0) {

			// Insert a new code example and update variables accordingly.
			if($link==-1) {
				$queryz2 = $pdo->prepare("SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1");
				if(!$queryz2->execute()) {
					$error=$queryz2->errorInfo();
					$debug="Error reading entries".$error[2];
				}
				foreach($queryz2->fetchAll() as $row) {
					$sname=$row['exampleid'] + 1;
				}
					$sname = $sectname . $sname;
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
			//Change position of elements one increment up to make space for insertion.
			$query = $pdo->prepare("UPDATE listentries SET pos = pos+1 WHERE cid = :cid and vers = :cvs and pos >= :pos");
			$query->bindParam(":cid", $courseid);
			$query->bindParam(":cvs", $coursevers);
			$query->bindParam(":pos", $pos);
			$query->execute();

			$query = $pdo->prepare("INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) 
														VALUES(:cid,:cvs,:entryname,:link,:kind,:pos,:visible,:usrid,:comment, :gradesys, :highscoremode, :groupkind)");
			
			if ($kind == 4) {
				$query->bindParam(':gradesys', $gradesys);
			} else {
				$query->bindParam(':gradesys', $tabs);
			}

			$query->bindParam(':cid', $courseid);
			$query->bindParam(':cvs', $coursevers);
			$query->bindParam(':usrid', $userid);
			$query->bindParam(':entryname', $sectname);
			$query->bindParam(':link', $link);
			$query->bindParam(':kind', $kind);
			$query->bindParam(':comment', $comments);
			$query->bindParam(':visible', $visibility);
			$query->bindParam(':highscoremode', $highscoremode);
			$query->bindParam(':pos', $pos);	

			if ($grptype != "UNK") {
				$query->bindParam(':groupkind', $grptype);
			} else {
				$query->bindValue(':groupkind', null, PDO::PARAM_STR);

				// Logging for newly added items
				$description=$sectname;
					logUserEvent($userid, $username, EventTypes::SectionItems,$sectname);

			}


			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating entries".$error[2];
			}

		} else if(strcmp($opt,"REORDER")===0) {
			$orderarr=explode(",",$order);

			foreach ($orderarr as $key => $value) {
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
		} else if(strcmp($opt,"UPDATE")===0) {

			// Insert a new code example and update variables accordingly.
			if($link==-1) {

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

			$query = $pdo->prepare("UPDATE listentries set highscoremode=:highscoremode, gradesystem=:gradesys, moment=:moment,entryname=:entryname,kind=:kind,link=:link,visible=:visible,comments=:comments,groupKind=:groupkind, feedbackenabled=:feedbackenabled, feedbackquestion=:feedbackquestion WHERE lid=:lid;");
		
			if ($kind == 4) {
				$query->bindParam(':gradesys', $gradesys);
			} else {
				$query->bindParam(':gradesys', $tabs);
			}

			$query->bindParam(':lid', $sectid);
			$query->bindParam(':entryname', $sectname);
			$query->bindParam(':comments', $comments);
			$query->bindParam(':highscoremode', $highscoremode);
			$query->bindParam(':feedbackenabled', $feedbackenabled);
			$query->bindParam(':feedbackquestion', $feedbackquestion);

			if ($grptype != "UNK") {
				$query->bindParam(':groupkind', $grptype);
			} else {
				$query->bindValue(':groupkind', null, PDO::PARAM_STR);
			}

			if($moment=="null") $query->bindValue(':moment', null,PDO::PARAM_INT);
			else $query->bindParam(':moment', $moment);

			$query->bindParam(':kind', $kind);
			$query->bindParam(':link', $link);
			$query->bindParam(':visible', $visibility);

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
		}else if(strcmp($opt,"UPDATEDEADLINE")===0){
			$deadlinequery = $pdo->prepare("UPDATE listentries SET handindeadline=:deadline WHERE lid=:lid;");
			$deadlinequery->bindParam(':deadline',$deadline);
			$deadlinequery->bindParam(':lid',$sectid);
			
			if(!$deadlinequery->execute()){
				$error=$deadlinequery->errorInfo();
				$debug="ERROR THE DEADLINE QUERY FAILED".$error[2];
			}
		}else if(strcmp($opt,"UPDATETABS")===0){
			$query = $pdo->prepare("UPDATE listentries SET gradesystem=:tabs WHERE lid=:lid;");
			$query->bindParam(':lid', $sectid);
			$query->bindParam(':tabs',$tabs);
			
			if(!$query->execute()){
				$error=$query->errorInfo();
				$debug="ERROR THE DEADLINE QUERY FAILED".$error[2];
			}
		}else if(strcmp($opt,"UPDATEVRS")===0) {
				// After column 'motd' exist on all releases this query can be merged with the original 'UPDATEVERS' below
				$query = $pdo->prepare("UPDATE vers SET motd=:motd WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
				$query->bindParam(':cid', $courseid);
				$query->bindParam(':coursecode', $coursecode);
				$query->bindParam(':vers', $versid);
				$query->bindParam(':motd', $motd);
				if(!$query->execute()){
					$error=$query->errorInfo();
					$debug="Error updating entries: Missing column 'motd' ".$error[2];
				}

				$query = $pdo->prepare("UPDATE vers SET versname=:versname,startdate=:startdate,enddate=:enddate WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
				$query->bindParam(':cid', $courseid);
				$query->bindParam(':coursecode', $coursecode);
				$query->bindParam(':vers', $versid);
				$query->bindParam(':versname', $versname);
				//$query->bindParam(':motd', $motd);
		// if start and end dates are null, insert mysql null value into database

				if($startdate=="null") $query->bindValue(':startdate', null,PDO::PARAM_INT);
				else $query->bindParam(':startdate', $startdate);
				if($enddate=="null") $query->bindValue(':enddate', null,PDO::PARAM_INT);
				else $query->bindParam(':enddate', $enddate);

				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating entries".$error[2];
				}
				if($makeactive==3){
						$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
						$query->bindParam(':cid', $courseid);
						$query->bindParam(':vers', $versid);

						if(!$query->execute()) {
							$error=$query->errorInfo();
							$debug="Error updating entries".$error[2];
						}
				}

				// Logging for editing course version
				$description=$courseid." ".$versid;
					logUserEvent($userid, $username, EventTypes::EditCourseVers, $description);	

		} else if(strcmp($opt,"CHGVERS")===0) {
			$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':vers', $versid);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating entries".$error[2];
			}
		} else if (strcmp($opt, "HIDDEN") === 0) {
			$visible = 0;
			$query = $pdo->prepare("UPDATE listentries SET visible=:visible WHERE lid=:lid");
			$query->bindParam(':lid', $sectid);
			$query->bindParam(':visible', $visible);
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating entries".$error[2]; 
			}
		} else if (strcmp($opt, "PUBLIC") === 0){
			$visible = 1;
			$query = $pdo->prepare("UPDATE listentries SET visible=:visible WHERE lid=:lid");
			$query->bindParam(':lid', $sectid);
			$query->bindParam(':visible', $visible);
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating entries".$error[2]; 
			}
		} else if(strcmp($opt,"REFGIT")===0) {
			class githubDB extends SQLite3 {
				function __construct() {
					$this->open("../../githubMetadata/metadata2.db");
				}
			}
			$query1 = $pdo->prepare("SELECT filename FROM box WHERE exampleid=:exampleid;");
			$query1->bindParam(":exampleid", $exampleid);
			$query1->execute();
			$query2 = $pdo->prepare("SELECT cid FROM codeexample WHERE exampleid=:exampleid;");
			$query2->bindParam(":exampleid", $exampleid);
			$query2->execute();
			$files = array();
			$row2 = $query2->fetchAll();
			$cid = $row2['cid'];
			foreach($query1->fetchAll() as $row1) {
				array_push($files, $row1['filename']);
			}
			$gdb = new githubDB();
			$downloads = array();
			foreach($files as $file) {
				$que = $gdb->query("SELECT downloadURL FROM gitFiles WHERE cid=".$cid." AND fileName=".$file.";");
				while($row = $que->fetchArray(SQLITE3_ASSOC) ) {
					array_push($downloads, $row['downloadURL']);
				}
			}
			$gdb->close();
			
		} else if(strcmp($opt,"CREGITEX")===0) {
			//Get cid
			$query = $pdo->prepare("SELECT cid FROM listentries WHERE lid=:lid;");
			$query->bindParam(":lid", $lid);
			$query->execute();
			$e = $query->fetchAll();
			$courseid = $e[0]['cid'];

			//Get dir from the listentrie that was clicked
			$query = $pdo->prepare("SELECT githubDir FROM listentries WHERE lid=:lid;");
			$query->bindParam(":lid", $lid);
			$query->execute();
			$e = $query->fetchAll();
			$githubDir = $e[0]['githubDir'];
			$dirPath = "../courses/".$courseid."/Github/" . $githubDir;	

			//Get the version of the course from where the button was pressed
			$query = $pdo->prepare("SELECT vers FROM listentries WHERE lid=:lid");
			$query->bindParam(":lid", $lid);
			$query->execute();
			$e = $query->fetchAll();
			$coursevers = $e[0]['vers'];

			$allFiles = array();
			$files = scandir($dirPath);
			foreach($files as $file) {
				if(is_file($dirPath."/".$file)) {
					$temp = array();
					foreach($files as $file2) {
						$n1 = explode(".", $file);
						$n2 = explode(".", $file2);
						if(is_file($dirPath."/".$file2) && $n1[0] == $n2[0]) {
							array_push($temp, $file2);
						}
					}
					array_push($allFiles, $temp);
				}
			}
			//Get active version of the course
			
			

			foreach($allFiles as $groupedFiles){	
				//get the correct examplename
				$explodeFiles = explode('.',$groupedFiles[0]);
				$exampleName = $explodeFiles[0];
				//count if there is already a codeexample or if we should create a new one on the current coursevers where the button was pressed.
				$query1 = $pdo->prepare("SELECT COUNT(*) AS count FROM codeexample  WHERE cid=:cid AND examplename=:examplename AND cversion=:vers;");
				$query1->bindParam(":cid", $courseid);
				$query1->bindParam(":examplename", $exampleName);
				$query1->bindParam(":vers", $coursevers);
				$query1->execute();
				$result = $query1->fetch(PDO::FETCH_OBJ);
				$counted = $result->count;

				//if no codeexample exist create a new one
				if ($counted == 0) {
					

					//Get the position of the related moment
					$query = $pdo->prepare("SELECT pos FROM listentries WHERE cid = :cid and lid = :lid");
					$query->bindParam(":cid", $courseid);
					$query->bindParam(":lid", $lid);
					$query->execute();
					$e = $query->fetchAll();
					$pos = $e[0]['pos'] + 1; //Get position under the moment

					//Move elements up from insertion.
					$query = $pdo->prepare("UPDATE listentries SET pos = pos+1 WHERE cid = :cid and vers = :cvs and pos >= :pos");
					$query->bindParam(":cid", $courseid);
					$query->bindParam(":cvs", $coursevers);
					$query->bindParam(":pos", $pos);
					$query->execute();

					//select the files that has should be in the codeexample
					$fileCount = count($groupedFiles);
					//Start create the codeexample
					if ($fileCount > 0 && $fileCount < 6) {
						//Select the correct template, only template for 1 up to 5 files exist
						switch ($fileCount) {
							case 1:
								$templateNumber = 10;
								break;
							case 2:
								$templateNumber = 1;
								break;
							case 3:
								$templateNumber = 3;
								break;
							case 4:
								$templateNumber = 5;
								break;
							case 5:
								$templateNumber = 9;
								break;
						}
						$examplename = $exampleName;
						$sectionname = $exampleName;
						//create codeexample
						$query = $pdo->prepare("INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion,templateid) values (:cid,:ename,:sname,1,:cversion,:templateid);");
						$query->bindParam(":cid", $courseid);
						$query->bindParam(":ename", $examplename);
						$query->bindParam(":sname", $sectionname);
						$query->bindParam(":cversion", $coursevers);
						$query->bindParam(":templateid", $templateNumber);
						$query->execute();

						//select the latest codeexample created to link boxes to this codeexample
						$query = $pdo->prepare("SELECT MAX(exampleid) as LatestExID FROM codeexample;");
						$query->execute();
						$result = $query->fetch(PDO::FETCH_OBJ);
						$exampleid = $result->LatestExID;

						//Add each file to a box and add that box to the codeexample and set the box to its correct content.
						for ($i = 0; $i < count($groupedFiles); $i++) {
							$filename = $groupedFiles[$i];
							$parts = explode('.', $filename);
							$filetype = "CODE";
							$wlid = 0;
							switch ($parts[1]) {
								case "js":
									$filetype = "CODE";
									$wlid = 1;
									break;
								case "php":
									$filetype = "CODE";
									$wlid = 2;
									break;
								case "html":
									$filetype = "CODE";
									$wlid = 3;
									break;
								case "txt":
									$filetype = "DOCUMENT";
									$wlid = 4;
									break;
								case "md":
									$filetype = "DOCUMENT";
									$wlid = 4;
									break;
								case "java":
									$filetype = "CODE";
									$wlid = 5;
									break;
								case "sr":
									$filetype = "CODE";
									$wlid = 6;
									break;
								case "sql":
									$filetype = "CODE";
									$wlid = 7;
									break;
								default:
									$filetype = "DOCUMENT";
									$wlid = 4;
									break;
							}

							$boxid = $i + 1;
							$fontsize = 9;
							$setting = "[viktig=1]";
							$boxtitle = substr($filename, 0, 20);
							$query = $pdo->prepare("INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, settings, wordlistid, fontsize) VALUES (:boxid, :exampleid, :boxtitle, :boxcontent, :filename, :settings, :wordlistid, :fontsize);");
							$query->bindParam(":boxid", $boxid);
							$query->bindParam(":exampleid", $exampleid);
							$query->bindParam(":boxtitle", $boxtitle);
							$query->bindParam(":boxcontent", $filetype);
							$query->bindParam(":filename", $filename);
							$query->bindParam(":settings", $setting);
							$query->bindParam(":wordlistid", $wlid);
							$query->bindParam(":fontsize", $fontsize);
							$query->execute();																																																
						}

						$link = "UNK";
						$kind = 2;
						$visible = 1;
						$uid = 1;
						$comment = null;
						$gradesys = null;
						$highscoremode = 0;
						$groupkind = null;
						//add the codeexample to listentries
						$query = $pdo->prepare("INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) 
																							VALUES(:cid,:cvs,:entryname,:link,:kind,:pos,:visible,:usrid,:comment, :gradesys, :highscoremode, :groupkind);");
						$query->bindParam(":cid", $courseid);
						$query->bindParam(":cvs", $coursevers);
						$query->bindParam(":entryname", $examplename);
						$query->bindParam(":link", $exampleid);
						$query->bindParam(":kind", $kind);
						$query->bindParam(":pos", $pos);
						$query->bindParam(":visible", $visible);
						$query->bindParam(":usrid", $uid);
						$query->bindParam(":comment", $comment);
						$query->bindParam(":gradesys", $gradesys);
						$query->bindParam(":highscoremode", $highscoremode);
						$query->bindParam(":groupkind", $groupkind);
						$query->execute();
					}
					
				} else {
					//Check for update
					//TODO: Implement update for already existing code-examples.
					
					$query1 = $pdo->prepare("SELECT exampleid AS eid FROM codeexample  WHERE cid=:cid AND examplename=:examplename AND cversion=:vers;");
					$query1->bindParam(":cid", $courseid);
					$query1->bindParam(":examplename", $exampleName);
					$query1->bindParam(":vers", $coursevers);
					$query1->execute();
					$result = $query1->fetch(PDO::FETCH_OBJ);
					$eid = $result->eid;

					$query1 = $pdo->prepare("SELECT COUNT(*) AS boxCount FROM box WHERE exampleid=:eid;");
					$query1->bindParam(":eid", $eid);
					$query1->execute();
					$result = $query1->fetch(PDO::FETCH_OBJ);
					$boxCount = $result->boxCount;

					$likePattern = $exampleName .'.%';
					$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
					$query = $pdolite->prepare("SELECT * FROM gitFiles WHERE cid = :cid AND fileName LIKE :fileName;"); 
					$query->bindParam(':cid', $courseid);
					$query->bindParam(':fileName', $likePattern);
					$query->execute();				
					$rows = $query->fetchAll();
					$exampleCount = count($rows);
					
					//Check if to be hidden
					if($exampleCount==0){
						$visible = 0;																								
						$query = $pdo->prepare("UPDATE listentries SET visible=:visible WHERE cid=:cid AND vers=:cvs AND entryname=:entryname;");
						$query->bindParam(":cid", $courseid);
						$query->bindParam(":cvs", $coursevers);
						$query->bindParam(":entryname", $exampleName);
						$query->bindParam(":visible", $visible);
						$query->execute();
					
					//Check if remove box
					}else if ($boxCount > $exampleCount){		
						$query = $pdo->prepare("SELECT filename FROM box WHERE exampleid = :eid;"); 
						$query->bindParam(':eid', $eid);				
						$query->execute();
						$boxRows = $query->fetchAll();

						foreach($boxRows as $bRow){
							$boxName = $bRow['filename'];
							$exist = false;
							foreach ($rows as $row) {
								$fileName = $row['fileName'];
								if(strcmp($boxName,$fileName)==0){
									$exist = true;
								}	
							}
							if($exist==false){										
								$query = $pdo->prepare("SELECT boxid AS bid FROM box WHERE exampleid = :eid AND filename=:boxName;");
								$query->bindParam(':eid', $eid); 
								$query->bindParam(':boxName', $boxName);
								$query->execute();
								$result = $query->fetch(PDO::FETCH_OBJ);
								$bid = $result->bid;

								$query = $pdo->prepare("DELETE FROM box WHERE exampleid = :eid AND filename=:boxName;");
								$query->bindParam(':eid', $eid); 
								$query->bindParam(':boxName', $boxName);
								$query->execute();
								
								for ($i =$bid; $i<$boxCount;$i++){
									$oldBoxID = $i+1;
									$query = $pdo->prepare("UPDATE box SET boxid=:newBoxID WHERE exampleid = :eid AND boxid=:oldBoxID;");
									$query->bindParam(':newBoxID', $i); 
									$query->bindParam(':eid', $eid); 
									$query->bindParam(':oldBoxID', $oldBoxID);
									$query->execute();
									
								}
								$boxCount--;
							}	
						}
						switch ($exampleCount) {
							case 1:
								$templateNumber = 10;
								break;
							case 2:
								$templateNumber = 1;
								break;
							case 3:
								$templateNumber = 3;
								break;
							case 4:
								$templateNumber = 5;
								break;
							case 5:
								$templateNumber = 9;
								break;
						}
						$query = $pdo->prepare("UPDATE codeexample SET templateid=:templateid WHERE exampleid=:eid;");
						$query->bindParam(":templateid", $templateNumber);
						$query->bindParam(":eid", $eid);
						$query->execute();
												
					//Check if adding box
					}else if ($boxCount < $exampleCount){

						$query = $pdo->prepare("SELECT filename FROM box WHERE exampleid = :eid;"); 
						$query->bindParam(':eid', $eid);				
						$query->execute();
						$boxRows = $query->fetchAll();

						foreach ($rows as $row) {
							$fileName = $row['fileName'];
							$exist=false;
							foreach($boxRows as $bRow){
								$boxName = $bRow['filename'];
								if(strcmp($boxName,$fileName)==0){
									$exist = true;
								}	

							}
							if($exist==false){
								$parts = explode('.', $fileName);
								$filetype = "CODE";
								$wlid = 0;
								switch ($parts[1]) {
									case "js":
										$filetype = "CODE";
										$wlid = 1;
										break;
									case "php":
										$filetype = "CODE";
										$wlid = 2;
										break;
									case "html":
										$filetype = "CODE";
										$wlid = 3;
										break;
									case "txt":
										$filetype = "DOCUMENT";
										$wlid = 4;
										break;
									case "md":
										$filetype = "DOCUMENT";
										$wlid = 4;
										break;
									case "java":
										$filetype = "CODE";
										$wlid = 5;
										break;
									case "sr":
										$filetype = "CODE";
										$wlid = 6;
										break;
									case "sql":
										$filetype = "CODE";
										$wlid = 7;
										break;
									default:
										$filetype = "DOCUMENT";
										$wlid = 4;
										break;
								}	

								$query = $pdo->prepare("SELECT MAX(boxid) FROM box WHERE exampleid = :eid;"); 
								$query->bindParam(':eid', $eid);				
								$query->execute();
								$boxid = $query->fetchColumn();
					
								$boxid = $boxid + 1;
								$fontsize = 9;
								$setting = "[viktig=1]";
								$boxtitle = substr($fileName, 0, 20);
								
								$query = $pdo->prepare("INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, settings, wordlistid, fontsize) VALUES (:boxid, :exampleid, :boxtitle, :boxcontent, :filename, :settings, :wordlistid, :fontsize);");
								$query->bindParam(":boxid", $boxid);
								$query->bindParam(":exampleid", $eid);
								$query->bindParam(":boxtitle", $boxtitle);
								$query->bindParam(":boxcontent", $filetype);
								$query->bindParam(":filename", $fileName);
								$query->bindParam(":settings", $setting);
								$query->bindParam(":wordlistid", $wlid);
								$query->bindParam(":fontsize", $fontsize);
								$query->execute();

							}
						}

						switch ($exampleCount) {
							case 1:
								$templateNumber = 10;
								break;
							case 2:
								$templateNumber = 1;
								break;
							case 3:
								$templateNumber = 3;
								break;
							case 4:
								$templateNumber = 5;
								break;
							case 5:
								$templateNumber = 9;
								break;
						}
						$query = $pdo->prepare("UPDATE codeexample SET templateid=:templateid WHERE exampleid=:eid;");
						$query->bindParam(":templateid", $templateNumber);
						$query->bindParam(":eid", $eid);
						$query->execute();
					}
				} 
			}
		
		} else if (strcmp($opt, "GITCODEEXAMPLE") === 0) {
			//$codeExampleData = $_POST['codeExampleData'];
			$content = $codeExampleData['codeExamplesContent'];
			$SHA = $codeExampleData['SHA'];
			$fileNames = $codeExampleData['fileNames'];
			$filePaths = $codeExampleData['filePaths'];
			$fileURLS = $codeExampleData['fileURLS'];
			$downloadURLS = $codeExampleData['downloadURLS'];
			$fileTypes = $codeExampleData['fileTypes'];
			$codeExamplesLinkParam = $codeExampleData['codeExamplesLinkParam'];
			$templateid = $codeExampleData['templateid'];
			$fileSizes = $codeExampleData['fileSizes'];
			$path = '../../LenaSYS/courses/' . $courseid;
			$pathCoursesRoot = '../../LenaSYS/courses';
			$pdoLite = new PDO('sqlite:../../githubMetadata/metadata2.db');

			//Creates courses directory in root if it doesnt exist and courses folder inside
			if(!is_dir($pathCoursesRoot)){
				mkdir($pathCoursesRoot, 0775, true);
			}
			// Creates the directory for the corresponding course if it doesnt exist.
			if (!file_exists($path)) {
				mkdir($path, 0775, true);
			}
			if(is_dir($path)){
				echo "Successfully created courses folder or it already exists!";
			}

			//Writes code example files to course directory
			$WriteFilesSuccess = true;
    		$success = true;
			$count = $content == null ? 0 : count($content);
    		for($i = 0; $i < $count; $i++){
        		$WriteFilesSuccess = file_put_contents($path . '/' . $fileNames[$i], $content[$i]);
        		if($WriteFilesSuccess === false){
          			echo "File failed to write: " . $fileNames[$i];
            		$success = false;
        		}else{
            		echo "File written successfully: " . $fileNames[$i];
        		}
    		}
    		if ($success) {
        		echo "All files written successfully!";
    		}
			//Insert into gitRepo DB
			//First query: Check if a row with same cid already exists. If not, insert into db.
			$query = $pdoLite->prepare("SELECT COUNT(*) FROM gitRepos WHERE cid = ?");
			$query->execute([$courseid]);
			$rowCount = $query->fetchColumn();

			if($rowCount > 0){
				//A repo with the same cid primary key already exists. Do nothing.
			} else {
				$query = $pdoLite->prepare("INSERT OR REPLACE INTO gitRepos (cid, repoURL) VALUES (:cid, :repoURL)"); 
				$query->bindParam(':cid', $cid);
				$query->bindParam(':repoURL', $githubURL);
				if (!$query->execute()) {
					$error = $query->errorInfo();
					echo "Error updating entry in gitRepos" . $error[2];
				}
			}
			//Insert files into gitFiles DB
			$successInsert = true;
    		$fileCount = $fileNames == null ? 0 : count($fileNames);
    		for($i = 0; $i < $count; $i++){
        		$query = $pdoLite->prepare('REPLACE INTO gitFiles (cid, fileName, fileType, fileURL, downloadURL, fileSHA, filePath) VALUES (:cid, :fileName, :fileType, :fileURL, :downloadURL, :fileSHA, :filePath)');
        		$query->bindParam(':cid', $courseid);
        		$query->bindParam(':fileName', $fileNames[$i]);
        		$query->bindParam(':fileType', $fileTypes[$i]);
        		$query->bindParam(':fileURL', $fileURLS[$i]);
        		$query->bindParam(':downloadURL', $downloadURLS[$i]);
        		$query->bindParam(':fileSHA', $SHA[$i]);
        		$query->bindParam(':filePath', $filePaths[$i]);
        		$success = $query->execute();
        		if(!$success){
            		$successInsert = false;
            		echo "Insertion into gitFiles failed. File: " . $fileNames[$i];
       			}
    		}
    		if($successInsert){
        		echo "All insertions into gitFiles were successful.";
    		}
			//Insert into fileLink Database
			for($i = 0; $i < $fileCount; $i ++) {
				$query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND UPPER(filename)=UPPER(:filename);");
				$query->bindParam(':filename', $fileNames[$i]);
				$query->bindParam(':cid', $courseid);
				$query->execute();
				$norows = $query->fetchColumn();
				if($norows == 0) {
					//TODO: Kind value should be fixed to dynamic
					$index = strpos($fileNames[$i],".");
					$ext = substr($fileNames[$i], $index + 1);
				    switch ($ext) {
                        case "txt":
                            $kind = "2";
                            break;
                        case "md":
                            $kind = "2";
                            break;
                        default:
                            $kind = "3";
                            break;
				    }
					$query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid,filesize) VALUES(:fileName,:kind,:cid,:filesize);");
					$query->bindParam(':cid', $courseid);
					$query->bindParam(':fileName', $fileNames[$i]);
					$query->bindParam(':filesize', $fileSizes[$i]);
					$query->bindParam(':kind', $kind);
					if (!$query->execute()) {
						$error = $query->errorInfo();
						echo "Error updating entries" . $error[2];
					} else {
						echo "File stored successfully in fileLink";
					}
				}
			}

			//Edit codeexample. Can update later to allow the Name input from user in gitpopup to update the codeExample here? also sectionname?
			$query = $pdo->prepare( "UPDATE codeexample SET runlink = :playlink, templateid = :templateno, examplename = :examplename WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
			$query->bindParam(':playlink', $fileNames[0]);
			$query->bindParam(':templateno', $templateid);
			$query->bindParam(':exampleid', $codeExamplesLinkParam[0]);
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':cvers', $codeExamplesLinkParam[3]);
			$query->bindParam('examplename', $codeExampleName);
			if(!$query->execute()) {
				$error=$query->errorInfo();
				echo "Error updating entries in codeexample" . $error[2];
			} else{
				echo "Row updated successfully in codeexample";
			}
			//Edit listentries to update list entry name.
			$query = $pdo->prepare( "UPDATE listentries SET entryname = :exampleName WHERE lid = :lid AND cid = :cid;");
			$query->bindParam(':exampleName', $codeExampleName);
			$query->bindParam(':lid', $codeExamplesLinkParam[4]);
			$query->bindParam(':cid', $courseid);
			if(!$query->execute()) {
				$error=$query->errorInfo();
				echo "Error updating listentry in listentries" . $error[2];
			} else{
				echo "Row updated successfully in listentries";
			}
			$y = 1;
			for($i = 0; $i < $count; $i++){
				//TODO: Change boxcontent to be named dynamicly.
				// Maybe change filenameNoExt to something better named. Also what is wordlistid?
				$index = strpos($fileNames[$i],".");
                $ext = substr($fileNames[$i], $index + 1);
				switch ($ext) {
                    case "txt":
                        $boxContent = "Document";
            			$wordlistID = "4";
            			break;
                    case "md":
                        $boxContent = "Document";
            			$wordlistID = "4";
            			break;
                    default:
                        $boxContent = "Code";
            			$wordlistID = "3";
            			break;
                }
				$query = $pdo->prepare('INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, settings, wordlistid, fontsize) VALUES (:boxid, :exampleid, :boxtitle, :boxcontent, :filename, "[viktig=1]", :wordlistid, "9") ON DUPLICATE KEY UPDATE boxtitle = VALUES(boxtitle), boxcontent = VALUES(boxcontent), filename = VALUES(filename), settings = VALUES(settings), wordlistid = VALUES(wordlistid), fontsize = VALUES(fontsize)');
				$query->bindParam(':boxid', $y);
				$query->bindParam(':exampleid', $codeExamplesLinkParam[0]);
				$filenameNoExt = preg_replace('/\.[^.]*$/', "", $fileNames[$i]);
				$query->bindParam(':boxtitle', $filenameNoExt);
				$query->bindParam(':boxcontent', $boxContent);
				$query->bindParam(':filename', $fileNames[$i]);
				$query->bindParam(':wordlistid', $wordlistID);
	    
				if (!$query->execute()) {
					$error = $query->errorInfo();
					echo "Error updating entries" . $error[2];
				} else {
					echo "File stored successfully in box";
				}
			$y++;
			}
		} else if (strcmp($coursevers, "null")!==0) {
			// Get every coursevers of courses so we seed groups to every courseversion
			$stmt = $pdo->prepare("SELECT vers FROM vers WHERE cid=:cid");
			$stmt->bindParam(":cid", $courseid);
			$stmt->execute();
			$courseversions = $stmt->fetchAll(PDO::FETCH_COLUMN);
			$totalGroups = 24 * count($courseversions);
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

try{
	$query = $pdo->prepare("SELECT id,qname,qrelease,deadline,relativedeadline FROM quiz WHERE cid=:cid AND vers=:vers ORDER BY qname");
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':vers', $coursevers);
	$query->execute();
}
catch(Exception $e){
	$query = $pdo->prepare("SELECT id,qname,qrelease,deadline FROM quiz WHERE cid=:cid AND vers=:vers ORDER BY qname");
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':vers', $coursevers);
}
try{
	$query->execute();
}
catch(Exception $e){
	$error=$query->errorInfo();
	$debug="Error reading entries".$error[2];
}
if(isset($row['relativedeadline'])){
	$relativedeadlineTemp = $row['relativedeadline'];
}
else{
	$relativedeadlineTemp = null;
}

// Create "duggor" array to store information about quizes and create "releases" to perform checks

foreach($query->fetchAll() as $row) {
	$releases[$row['id']]=array(
			'release' => $row['qrelease'],
			'deadline' => $row['deadline'],
			'relativedeadline' => $relativedeadlineTemp
	);
	array_push(
		$duggor,
		array(
			'id' => $row['id'],
			'qname' => $row['qname'],
			'release' => $row['qrelease'],
			'deadline' => $row['deadline'],
			'relativedeadline' => $relativedeadlineTemp
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
	$query = $pdo->prepare("SELECT lid,moment,entryname,pos,kind,link,handindeadline,visible,code_id,listentries.gradesystem,highscoremode,deadline,relativedeadline,qrelease,comments, qstart, jsondeadline, groupKind, 
		ts, listentries.gradesystem as tabs, feedbackenabled, feedbackquestion FROM listentries LEFT OUTER JOIN quiz ON listentries.link=quiz.id 
			WHERE listentries.cid=:cid and listentries.vers=:coursevers ORDER BY pos");
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':coursevers', $coursevers);
	try{
		$result=$query->execute();
	}
	catch(Exception $e){
		$query = $pdo->prepare("SELECT lid,moment,entryname,pos,kind,link,visible,code_id,listentries.gradesystem,highscoremode,deadline,qrelease,comments, qstart, jsondeadline, groupKind, 
			 ts, listentries.gradesystem as tabs, feedbackenabled, feedbackquestion FROM listentries LEFT OUTER JOIN quiz ON listentries.link=quiz.id 
			WHERE listentries.cid=:cid and listentries.vers=:coursevers ORDER BY pos");
		$query->bindParam(':cid', $courseid);
		$query->bindParam(':coursevers', $coursevers);
		$query->execute();
	}

	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading entries".$error[2];
	}

	foreach($query->fetchAll() as $row) {
		//only need to check one, since then we know if we are on old data or not
		if(isset($row['handindeadline'])){
			$handindeadlineTemp = $row['handindeadline'];
			$relativedeadlineTemp = $row['relativedeadline'];
		}
		else{
			$handindeadlineTemp = null;
			$relativedeadlineTemp = null;
		}
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
						'handindeadline'=> $handindeadlineTemp,
						'visible'=> $row['visible'],
						'highscoremode'=> $row['highscoremode'],
						'gradesys' => $row['gradesystem'],
						'code_id' => $row['code_id'],
						'deadline'=> $row['deadline'],
						'relativedeadline'=> $relativedeadlineTemp,
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
try{
	$query->execute();
}
catch(Exception $e){
	$query=$pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate FROM vers;");
	$query->execute();
}
foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
	if(isset($row['motd'])){
		$motdTemp = $row['motd'];
	}
	else{
		$motdTemp = null;
	}
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
			'motd' => $motdTemp
		)
	);
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
	try{
		$query->execute();
	}
	catch(Exception $e){
		$query=$pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate FROM vers;");
		$query->execute();
	}
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
		if(isset($row['motd'])){
			$motdTemp = $row['motd'];
		}
		else{
			$motdTemp = null;
		}	
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
				'motd' => $motdTemp
			)
		);
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
					global $pdo;
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
