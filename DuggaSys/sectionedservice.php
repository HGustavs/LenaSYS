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
$makeactive=getOP('makeactive');
$startdate=getOP('startdate');
$enddate=getOP('enddate');
$showgrps=getOP('showgrp');
$grptype=getOP('grptype');
$deadline=getOP('deadline');
$pos=getOP('pos');
$jsondeadline = getOP('jsondeadline');
$studentTeacher = false;
$feedbackenabled =getOP('feedback');
$feedbackquestion =getOP('feedbackquestion');
$motd=getOP('motd');

$grpmembershp="UNK";
$unmarked = 0;
$groups=array();
$grplst=array();

if($gradesys=="UNK") $gradesys=0;

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
		$studentTeacher=hasAccess($userid, $courseid, 'st');
		$haswrite=hasAccess($userid, $courseid, 'w');

		if(checklogin()){

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
		                $idx=strpos($grpmembershp,$showgrp);
		                while($idx!==false){
		                    $grp=substr($grpmembershp,$idx,strpos($grpmembershp,' ',$idx)-$idx);
		                    $email=$row['email'];
		                    if(is_null($email)){
		                        $email=$row['username']."@student.his.se";
		                    }
		                    array_push($grplst, array($grp,$row['firstname'],$row['lastname'],$email));
		                    $idx=strpos($grpmembershp,$showgrp,$idx+1);
		                }
		            }
		            sort($grplst);
		            /*
		            foreach($query->fetchAll() as $row) {
		                if(isset($row['groups'])){
		                    $grpmembershp = explode(" ", $row['groups']);

		                    foreach($grpmembershp as $member){
		                        if($ha||in_array($member,$glst)){
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
					$query = $pdo->prepare("DELETE FROM listentries WHERE lid=:lid");
					$query->bindParam(':lid', $sectid);

					if(!$query->execute()) {
						if($query->errorInfo()[0] == 23000) {
							$debug = "The item could not be deleted because of a foreign key constraint.";
						} else {
							$debug = "The item could not be deleted.";
						}
					}

				} else if(strcmp($opt,"NEW")===0) {

					// Insert a new code example and update variables accordingly.
					if($link==-1) {

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

					$query = $pdo->prepare("INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) VALUES(:cid,:cvs,:entryname,:link,:kind,:pos,:visible,:usrid,:comment, :gradesys, :highscoremode, :groupkind)");
					$query->bindParam(':cid', $courseid);
					$query->bindParam(':cvs', $coursevers);
					$query->bindParam(':usrid', $userid);
					$query->bindParam(':entryname', $sectname);
					$query->bindParam(':link', $link);
					$query->bindParam(':kind', $kind);
					$query->bindParam(':gradesys', $gradesys);
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
                        logUserEvent($userid,EventTypes::SectionItems,$sectname);

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

					$query = $pdo->prepare("UPDATE listentries set highscoremode=:highscoremode, moment=:moment,entryname=:entryname,kind=:kind,link=:link,visible=:visible,gradesystem=:gradesys,comments=:comments,groupKind=:groupkind, feedbackenabled=:feedbackenabled, feedbackquestion=:feedbackquestion WHERE lid=:lid;");
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
				}else if(strcmp($opt,"UPDATEDEADLINE")===0){
					$deadlinequery = $pdo->prepare("UPDATE quiz SET deadline=:deadline WHERE id=:link;");
					$deadlinequery->bindParam(':deadline',$deadline);
					$deadlinequery->bindParam(':link',$link);

					if(!$deadlinequery->execute()){
						$error=$deadlinequery->errorInfo();
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
						logUserEvent($userid, EventTypes::EditCourseVers, $description);	

				} else if(strcmp($opt,"CHGVERS")===0) {
					$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
					$query->bindParam(':cid', $courseid);
					$query->bindParam(':vers', $versid);

					if(!$query->execute()) {
						$error=$query->errorInfo();
						$debug="Error updating entries".$error[2];
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
		  $query = $pdo->prepare("SELECT lid,moment,entryname,pos,kind,link,visible,code_id,listentries.gradesystem,highscoremode,deadline,qrelease,comments, qstart, jsondeadline, groupKind, feedbackenabled, feedbackquestion FROM listentries LEFT OUTER JOIN quiz ON listentries.link=quiz.id WHERE listentries.cid=:cid and listentries.vers=:coursevers ORDER BY pos");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':coursevers', $coursevers);
			$result=$query->execute();

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading entries".$error[2];
			}

			foreach($query->fetchAll() as $row) {
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
								'comments' => $row['comments'],
								'qstart' => $row['qstart'],
								'grptype' => $row['groupKind'],
								'feedbackenabled' => $row['feedbackenabled'],
								'feedbackquestion' => $row['feedbackquestion']
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
				$row = $query->fetch();
				$avgfeedbackscore = $row[0];
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

		echo json_encode($array);

		logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "sectionedservice.php",$userid,$info);


?>
