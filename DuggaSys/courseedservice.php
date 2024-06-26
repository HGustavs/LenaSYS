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
 
$opt = getOP('opt');
$cid = getOP('cid');
$coursename = getOP('coursename');
$visibility = getOP('visib');
$activevers = getOP('activevers');
$activeedvers = getOP('activeedvers');
$versid = getOP('versid');
$versname = getOP('versname');
$coursenamealt = getOP('coursenamealt');
$coursecode = getOP('coursecode');
$copycourse = getOP('copycourse');
$startdate = getOP('startdate');
$enddate = getOP('enddate');
$makeactive = getOP('makeactive');
$motd = getOP('motd');
$readonly = getOP('readonly');
$courseGitURL = getOP('courseGitURL'); // for github url 
$LastCourseCreated = array();

if (isset($_SESSION['uid'])) {
	$userid = $_SESSION['uid'];
} else {
	$userid = "UNK";
}
$ha = null;
$debug = "NONE!";



// Gets username based on uid, USED FOR LOGGING
$query = $pdo->prepare("SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query->execute();




// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
	$username = $row['username'];
}

$log_uuid = getOP('log_uuid');
$info = "opt: " . $opt . " cid: " . $cid . " coursename: " . $coursename . " versid: " . $versid . " visibility: " . $visibility . " courseGitUrl: " . $courseGitURL;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "courseedservice.php", $userid, $info);

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
$isSuperUserVar = false;

if (checklogin()) {
	if (isset($_SESSION['uid'])) {
		$userid = $_SESSION['uid'];
	} else {
		$userid = "UNK";
	}
	$isSuperUserVar = isSuperUser($userid);

	$ha = $isSuperUserVar;

	if ($ha) {


		// The code for modification using sessions
		if (strcmp($opt, "DEL") === 0) {
		} else if (strcmp($opt, "NEW") === 0) {
			$query = $pdo->prepare("INSERT INTO course (coursecode,coursename,visibility,creator,hp,courseGitURL) VALUES(:coursecode,:coursename,0,:usrid,7.5,:courseGitURL)");
			$query->bindParam(':usrid', $userid);
			$query->bindParam(':coursecode', $coursecode);
			$query->bindParam(':coursename', $coursename);
			$query->bindParam(':courseGitURL', $courseGitURL); // for github url
			try{
				$query->execute();
			}
			catch(Exception $e){
				$query = $pdo->prepare("INSERT INTO course (coursecode,coursename,visibility,creator, hp) VALUES(:coursecode,:coursename,0,:usrid, 7.5)");
				$query->bindParam(':usrid', $userid);
				$query->bindParam(':coursecode', $coursecode);
				$query->bindParam(':coursename', $coursename);
				try {
					$query->execute();
				}
				catch(Exception $e) {
					$error = $query->errorInfo();
					$debug = "Error updating entries\n" . $error[2];	
				}
			}

			// Logging for creating new course
			$description = $coursename . " " . $coursecode . " " . $courseGitURL . " " . "Hidden";
			logUserEvent($userid, $username, EventTypes::AddCourse, $description);

			//////////////////////////////
			// Gets username based on uid, USED FOR LOGGING
			$query_1 = $pdo->prepare("SELECT cid FROM course ORDER BY cid DESC LIMIT 1");
			$query_1->execute();

			if (!$query_1->execute()) {
				$error = $query_1->errorInfo();
				$debug = "Error reading courses\n" . $error[2];
			} else {
				foreach ($query_1->fetchAll(PDO::FETCH_ASSOC) as $row) {
					array_push(
						$LastCourseCreated,
						array(
							'LastCourseCreatedId' => $row['cid'],
						)
					);
				}
			}
			/////////////////////////////////

		} else if (strcmp($opt, "NEWVRS") === 0) {
			$query = $pdo->prepare("INSERT INTO vers(cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate,motd) values(:cid,:coursecode,:vers,:versname,:coursename,:coursenamealt,:startdate,:enddate,:motd);");

			$query->bindParam(':cid', $cid);
			$query->bindParam(':coursecode', $coursecode);
			$query->bindParam(':vers', $versid);
			$query->bindParam(':versname', $versname);
			$query->bindParam(':coursename', $coursename);
			$query->bindParam(':coursenamealt', $coursenamealt);
			$query->bindParam(':motd', $motd);

			// if start and end dates are null, insert mysql null value into database
			if ($startdate == "null") $query->bindValue(':startdate', null, PDO::PARAM_INT);
			else $query->bindParam(':startdate', $startdate);
			if ($enddate == "null") $query->bindValue(':enddate', null, PDO::PARAM_INT);
			else $query->bindParam(':enddate', $enddate);

			if (!$query->execute()) {
				$error = $query->errorInfo();
				$debug = "Error inserting entries\n" . $error[2];
			}

			if ($makeactive == 3) {
				$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
				$query->bindParam(':cid', $cid);
				$query->bindParam(':vers', $versid);
				if (!$query->execute()) {
					$error = $query->errorInfo();
					$debug = "Error updating entries\n" . $error[2];
				}
			}

			// Logging for create a fresh course version
			$description = $cid . " " . $versid;
			logUserEvent($userid, $username, EventTypes::AddCourseVers, $description);
		} else if (strcmp($opt, "UPDATEVRS") === 0) {
			$query = $pdo->prepare("UPDATE vers SET versname=:versname WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':coursecode', $coursecode);
			$query->bindParam(':vers', $versid);
			$query->bindParam(':versname', $versname);

			if (!$query->execute()) {
				$error = $query->errorInfo();
				$debug = "Error updating entries\n" . $error[2];
			}
			if ($makeactive == 3) {
				$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
				$query->bindParam(':cid', $courseid);
				$query->bindParam(':vers', $versid);

				if (!$query->execute()) {
					$error = $query->errorInfo();
					$debug = "Error updating entries\n" . $error[2];
				}
			}
		} else if (strcmp($opt, "CHGVERS") === 0) {
			$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':vers', $versid);
			if (!$query->execute()) {
				$error = $query->errorInfo();
				$debug = "Error updating entries\n" . $error[2];
			}
		} else if (strcmp($opt, "CPYVRS") === 0) {
			$allOperationsSucceeded = true;
			try {
				$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$pdo->beginTransaction();
				$query = $pdo->prepare("INSERT INTO vers(cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate,motd) values(:cid,:coursecode,:vers,:versname,:coursename,:coursenamealt,:startdate,:enddate,:motd);");

				$query->bindParam(':cid', $cid);
				$query->bindParam(':coursecode', $coursecode);
				$query->bindParam(':vers', $versid);
				$query->bindParam(':versname', $versname);
				$query->bindParam(':coursename', $coursename);
				$query->bindParam(':coursenamealt', $coursenamealt);
				$query->bindParam(':motd', $motd);
				// if start and end dates are null, insert mysql null value into database
				if ($startdate == "null") $query->bindValue(':startdate', null, PDO::PARAM_INT);
				else $query->bindParam(':startdate', $startdate);
				if ($enddate == "null") $query->bindValue(':enddate', null, PDO::PARAM_INT);
				else $query->bindParam(':enddate', $enddate);

				if (!$query->execute()) {
					$error = $query->errorInfo();
					$allOperationsSucceeded = false;
					$debug = "Error updating entries\n" . $error[2];
				}

				// Logging for creating a copy of course version
				$description = $cid . " " . $versid;
				logUserEvent($userid, $username, EventTypes::AddCourseVers, $description);

				// Duplicate duggas and dugga variants
				$duggalist = array();
				$query = $pdo->prepare("SELECT * from quiz WHERE cid=:cid AND vers = :oldvers;");
				$query->bindParam(':cid', $cid);
				$query->bindParam(':oldvers', $copycourse);
				if (!$query->execute()) {
					$error = $query->errorInfo();
					$allOperationsSucceeded = false;
					$debug = "Error reading quiz\n" . $error[2];
				} else {
					foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
						$ruery = $pdo->prepare("INSERT INTO quiz (cid,autograde,gradesystem,qname,quizFile,qrelease,relativedeadline,modified,creator,vers) SELECT cid,autograde,gradesystem,qname,quizFile,qrelease,relativedeadline,modified,creator,:newvers as vers from quiz WHERE id = :oldid;");
						$ruery->bindParam(':oldid', $row['id']);
						$ruery->bindParam(':newvers', $versid);
						if (!$ruery->execute()) {
							$error = $ruery->errorInfo();
							$allOperationsSucceeded = false;
							$debug .= "Error copying quiz entry\n" . $error[2];
						} else {
							$duggalist[$row['id']] = $pdo->lastInsertId();
						}
					}
					foreach ($duggalist as $key => $value) {
						$buery = $pdo->prepare("SELECT * from variant WHERE quizID=:quizid;");
						$buery->bindParam(':quizid', $key);
						if (!$buery->execute()) {
							$error = $buery->errorInfo();
							$allOperationsSucceeded = false;
							$debug = "Error reading variants: " . $error[2];
						} else {
							foreach ($buery->fetchAll(PDO::FETCH_ASSOC) as $rowz) {
								$ruery = $pdo->prepare("INSERT INTO variant (quizID,param,variantanswer,modified,creator,disabled) SELECT :newquizid as quizID,param,variantanswer,modified,creator,disabled FROM variant WHERE vid = :oldvid;");
								$ruery->bindParam(':oldvid', $rowz["vid"]);
								$ruery->bindParam(':newquizid', $value);
								if (!$ruery->execute()) {
									$error = $ruery->errorInfo();
									$allOperationsSucceeded = false;
									$debug .= "Error updating entry\n" . $error[2];
								}
							}
						}
					}
				}

				// Duplicate codeexamples and it's components box, improws, impwordlist
				$codeexamplelist = array();
				$query = $pdo->prepare("SELECT * from codeexample WHERE cid=:cid AND cversion = :oldvers;");
				$query->bindParam(':cid', $cid);
				$query->bindParam(':oldvers', $copycourse);
				if (!$query->execute()) {
					$error = $query->errorInfo();
					$allOperationsSucceeded = false;
					$debug = "Error reading codeexample: " . $error[2];
				} else {
					foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
						$ruery = $pdo->prepare("INSERT INTO codeexample (cid,examplename,sectionname,beforeid,afterid,runlink,cversion,public,updated,uid,templateid) SELECT cid,examplename,sectionname,beforeid,afterid,runlink,:newvers as cversion,public,updated,uid,templateid from codeexample WHERE exampleid = :oldid;");
						$ruery->bindParam(':oldid', $row['exampleid']);
						$ruery->bindParam(':newvers', $versid);
						if (!$ruery->execute()) {
							$error = $ruery->errorInfo();
							$allOperationsSucceeded = false;
							$debug .= "Error copying codeexample entry\n" . $error[2];
						} else {
							$codeexamplelist[$row['exampleid']] = $pdo->lastInsertId();
						}
					}
					/*
						 * Each code example has a number of associated boxes and potentially important rows (improw) and important words (impwordlist)
						 */
					foreach ($codeexamplelist as $key => $value) {
						$buery = $pdo->prepare("SELECT * from box WHERE exampleid=:exampleid;");
						$buery->bindParam(':exampleid', $key);
						if (!$buery->execute()) {
							$error = $buery->errorInfo();
							$allOperationsSucceeded = false;
							$debug = "Error reading boxes: " . $error[2];
						} else {
							foreach ($buery->fetchAll(PDO::FETCH_ASSOC) as $rowz) {
								// Make duplicate of all boxes for current code example and bind to the new copy
								$ruery = $pdo->prepare("INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,filename,settings,wordlistid,segment,fontsize) SELECT boxid,:newexampleid as exampleid,boxtitle,boxcontent,filename,settings,wordlistid,segment,fontsize FROM box WHERE boxid=:oldboxid and exampleid=:oldexampleid;");
								$ruery->bindParam(':oldboxid', $rowz["boxid"]);
								$ruery->bindParam(':oldexampleid', $key);
								$ruery->bindParam(':newexampleid', $value);
								if (!$ruery->execute()) {
									$error = $ruery->errorInfo();
									$allOperationsSucceeded = false;
									$debug .= "Error duplicating boxes\n" . $error[2];
								}
							}

							// Make duplicate of improws for current code example and bind to the new copy
							$pruery = $pdo->prepare("SELECT * FROM improw WHERE exampleid=:oldexampleid;");
							$pruery->bindParam(':oldexampleid', $key);
							if (!$pruery->execute()) {
								$error = $pruery->errorInfo();
								$allOperationsSucceeded = false;
								$debug .= "Error finding improws\n" . $error[2];
							}
							foreach ($pruery->fetchAll(PDO::FETCH_ASSOC) as $improwz) {
								if ($pruery->rowCount() > 0) {
									$qruery = $pdo->prepare("INSERT INTO improw (boxid,exampleid,istart,iend,irowdesc,updated,uid) SELECT boxid,:newexampleid as exampleid,istart,iend,irowdesc,updated,uid FROM improw WHERE exampleid=:oldexampleid and impid=:oldimpid and boxid=:oldboxid;");
									$qruery->bindParam(':oldboxid', $improwz["boxid"]);
									$qruery->bindParam(':oldimpid', $improwz["impid"]);
									$qruery->bindParam(':oldexampleid', $key);
									$qruery->bindParam(':newexampleid', $value);
									if (!$qruery->execute()) {
										$error = $qruery->errorInfo();
										$allOperationsSucceeded = false;
										$debug .= "Error duplicating improws\n" . $error[2];
									}
								}
							}

							// Make duplicate of impwordlist for current code example and bind to the new copy
							$zruery = $pdo->prepare("SELECT * FROM impwordlist WHERE exampleid=:oldexampleid;");
							$zruery->bindParam(':oldexampleid', $key);
							if (!$zruery->execute()) {
								$error = $zruery->errorInfo();
								$allOperationsSucceeded = false;
								$debug .= "Error finding impwords\n" . $error[2];
							}
							foreach ($zruery->fetchAll(PDO::FETCH_ASSOC) as $impwordz) {
								if ($zruery->rowCount() > 0) {
									$zzqruery = $pdo->prepare("INSERT INTO impwordlist (exampleid,word,label,updated,uid) SELECT :newexampleid as exampleid,word,label,updated,uid FROM impwordlist WHERE exampleid=:oldexampleid and wordid=:oldwordid;");
									$zzqruery->bindParam(':oldwordid', $impwordz["wordid"]);
									$zzqruery->bindParam(':oldexampleid', $key);
									$zzqruery->bindParam(':newexampleid', $value);
									if (!$zzqruery->execute()) {
										$error = $zzqruery->errorInfo();
										$allOperationsSucceeded = false;
										$debug .= "Error duplicating impwords: " . $error[2];
									}
								}
							}
						}
					}
				}

				// Duplicate listentries
				$query = $pdo->prepare("SELECT * from listentries WHERE vers = :oldvers;");
				$query->bindParam(':oldvers', $copycourse);
				if (!$query->execute()) {
					$error = $query->errorInfo();
					$allOperationsSucceeded = false;
					$debug = "Error reading courses\n" . $error[2];
				} else {
					$momentlist = array();
					foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
						$ruery = $pdo->prepare("INSERT INTO listentries (cid,entryname,link,kind,pos,creator,ts,code_id,visible,vers,moment,gradesystem,highscoremode) SELECT cid,entryname,link,kind,pos,creator,ts,code_id,visible,:gubbe AS vers,moment,gradesystem,highscoremode from listentries WHERE lid = :olid;");
						$ruery->bindParam(':olid', $row['lid']);
						$ruery->bindParam(':gubbe', $versid);
						if (!$ruery->execute()) {
							$error = $ruery->errorInfo();
							$allOperationsSucceeded = false;
							$debug .= "Error copying entry\n" . $error[2];
						} else {
							$momentlist[$row['lid']] = $pdo->lastInsertId();
						}
					}
					// Update to correct moment
					foreach ($momentlist as $key => $value) {
						$ruery = $pdo->prepare("UPDATE listentries SET moment=:nyttmoment WHERE moment=:oldmoment AND vers=:updvers;");
						$ruery->bindParam(':nyttmoment', $value);
						$ruery->bindParam(':oldmoment', $key);
						$ruery->bindParam(':updvers', $versid);
						if (!$ruery->execute()) {
							$error = $ruery->errorInfo();
							$allOperationsSucceeded = false;
							$debug .= "Error updating entry\n" . $error[2];
						}
					}
					// Update to correct dugga
					foreach ($duggalist as $key => $value) {
						$puery = $pdo->prepare("UPDATE listentries SET link=:newquiz WHERE link=:oldquiz AND vers=:updvers;");
						$puery->bindParam(':newquiz', $value);
						$puery->bindParam(':oldquiz', $key);
						$puery->bindParam(':updvers', $versid);
						if (!$puery->execute()) {
							$error = $puery->errorInfo();
							$allOperationsSucceeded = false;
							$debug .= "Error updating entry\n" . $error[2];
						}
					}

					// Update to correct codeexample
					foreach ($codeexamplelist as $key => $value) {
						$puery = $pdo->prepare("UPDATE listentries SET link=:newexample WHERE link=:oldexample AND vers=:updvers;");
						$puery->bindParam(':newexample', $value);
						$puery->bindParam(':oldexample', $key);
						$puery->bindParam(':updvers', $versid);
						if (!$puery->execute()) {
							$error = $puery->errorInfo();
							$allOperationsSucceeded = false;
							$debug .= "Error updating entry\n" . $error[2];
						}
					}
					// Update to correct before and after in codeexample
					foreach ($codeexamplelist as $key => $value) {
						$puery = $pdo->prepare("UPDATE codeexample SET beforeid=:newexample WHERE beforeid=:oldexample AND cversion=:updvers;");
						$puery->bindParam(':newexample', $value);
						$puery->bindParam(':oldexample', $key);
						$puery->bindParam(':updvers', $versid);
						if (!$puery->execute()) {
							$error = $puery->errorInfo();
							$allOperationsSucceeded = false;
							$debug .= "Error updating before link\n" . $error[2];
						}
					}
					foreach ($codeexamplelist as $key => $value) {
						$puery = $pdo->prepare("UPDATE codeexample SET afterid=:newexample WHERE afterid=:oldexample AND cversion=:updvers;");
						$puery->bindParam(':newexample', $value);
						$puery->bindParam(':oldexample', $key);
						$puery->bindParam(':updvers', $versid);
						if (!$puery->execute()) {
							$error = $puery->errorInfo();
							$allOperationsSucceeded = false;
							$debug .= "Error updating after link\n" . $error[2];
						}
					}
				}

				if ($makeactive == 3) {
					$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
					$query->bindParam(':cid', $cid);
					$query->bindParam(':vers', $versid);

					if (!$query->execute()) {
						$error = $query->errorInfo();
						$allOperationsSucceeded = false;
						$debug = "Error updating entries\n" . $error[2];
					}
				}

				if ($allOperationsSucceeded) {
					$pdo->commit();
				} else {
					$pdo->rollBack();
				}
			} catch (Exception $e) {
				$pdo->rollBack();

				$debug = "Error duplicate course name\n" . $error[2];
			}
		} else if (strcmp($opt, "UPDATE") === 0) {
			$query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode,courseGitURL=:courseGitURL WHERE cid=:cid;");
			$query->bindParam(':cid', $cid);
			$query->bindParam(':coursename', $coursename);
			$query->bindParam(':visibility', $visibility);
			$query->bindParam(':coursecode', $coursecode);
			$query->bindParam(':courseGitURL', $courseGitURL);
			try{
				$query->execute();
			}
			catch(Exception $e){
				$query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode WHERE cid=:cid;");
				$query->bindParam(':cid', $cid);
				$query->bindParam(':coursename', $coursename);
				$query->bindParam(':visibility', $visibility);
				$query->bindParam(':coursecode', $coursecode);
				//$query->execute();
			}
			if (!$query->execute()) {
				$error = $query->errorInfo();
				$debug = "Error updating entries\n" . $error[2];
			}

			// Belongs to Logging 
			if ($visibility == 0) {
				$visibilityName = "Hidden";
			} else if ($visibility == 1) {
				$visibilityName = "Public";
			} else if ($visibility == 2) {
				$visibilityName = "Login";
			} else if ($visibility == 3) {
				$visibilityName = "Deleted";
			}

			// Logging for editing of course
			$description = $coursename . " " . $coursecode . " " . $visibilityName . " " . $courseGitURL;
			logUserEvent($userid, $username, EventTypes::EditCourse, $description);
		} else if (strcmp($opt, "SETTINGS") === 0) {
			$query = $pdo->prepare("INSERT INTO settings (motd,readonly) VALUES (:motd, :readonly);");

			$query->bindParam(':motd', $motd);
			if ($readonly == "UNK") {
				$readonly = 0;
			}
			$query->bindParam(':readonly', $readonly);

			if (!$query->execute()) {
				$error = $query->errorInfo();
				$debug = "Error updating entries\n" . $error[2];
			}
		} else if (strcmp($opt, "SPECIALUPDATE") === 0) {
			$query = $pdo->prepare("SELECT * from course WHERE cid=:cid;");
			$query->bindParam(':cid', $cid);
			if (!$query->execute()) {
				$error = $query->errorInfo();
				$allOperationsSucceeded = false;
				$debug = "Error finding course specifics\n" . $error[2];
			} else {
				$momentlist = array();
				foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
					$query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid;");

					print_r($row['coursename'] . $row['visibility'] . $row['coursecode']);
					$query->bindParam(':cid', $cid);
					$query->bindParam(':coursename', $row['coursename']);
					$query->bindParam(':visibility', $row['visibility']);
					$query->bindParam(':coursecode', $row['coursecode']);
					$query->bindParam(':courseGitURL', $courseGitURL);
					try{
						$query->execute();
					}
					catch(Exception $e){
						$query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode WHERE cid=:cid;");
						$query->bindParam(':cid', $cid);
						$query->bindParam(':coursename', $row['coursename']);
						$query->bindParam(':visibility', $row['visibility']);
						$query->bindParam(':coursecode', $row['coursecode']);
						$query->execute();
					}

					if (!$query->execute()) {
						$error = $query->errorInfo();
						$debug = "Error updating entries\n" . $error[2];
					}
				}
			}
		}
	}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------

$entries = array();

$queryreg = $pdo->prepare("SELECT cid FROM user_course WHERE uid=:uid");
$queryreg->bindParam(':uid', $userid);

if (!$queryreg->execute()) {
	$error = $queryreg->errorInfo();
	$debug = "Error reading courses\n" . $error[2];
}

$userRegCourses = array();
foreach ($queryreg->fetchAll(PDO::FETCH_ASSOC) as $row) {
	$userRegCourses[$row['cid']] = $row['cid'];
}

$queryz = $pdo->prepare("SELECT cid,access FROM user_course WHERE uid=:uid;");
$queryz->bindParam(':uid', $userid);

if (!$queryz->execute()) {
	$error = $queryz->errorInfo();
	$debug = "Error reading courses\n" . $error[2];
}

$userCourse = array();
foreach ($queryz->fetchAll(PDO::FETCH_ASSOC) as $row) {
	$userCourse[$row['cid']] = $row['access'];
}

//------------------------------------------------------------------------------------------------
// Delete Information
//------------------------------------------------------------------------------------------------

//Delete course matterial from courses that have been marked as deleted.
$deleted = 3;

//announcement
$query = $pdo->prepare("DELETE announcement FROM course,announcement WHERE course.visibility=:deleted AND announcement.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
try {
	$query->execute();
}
catch(exception $e) {
	//has to be empty for old database, use code below for debugging
}
/*if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}*/

//announcementlog
$query = $pdo->prepare("DELETE ANNOUNCEMENTLOG FROM course,ANNOUNCEMENTLOG WHERE course.visibility=:deleted AND ANNOUNCEMENTLOG.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

$query = $pdo->prepare("DELETE improw FROM course,improw,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid AND improw.exampleid=codeexample.exampleid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

$query = $pdo->prepare("DELETE box FROM box,codeexample,course WHERE course.visibility=:deleted AND codeexample.cid = course.cid AND box.exampleid=codeexample.exampleid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

$query = $pdo->prepare("DELETE impwordlist FROM course,impwordlist,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid AND impwordlist.exampleid=codeexample.exampleid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//codeexample
$query = $pdo->prepare("DELETE codeexample FROM course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid;");
$query->bindParam(':deleted', $deleted);

if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//course_req
$query = $pdo->prepare("DELETE course_req FROM course,course_req WHERE course.visibility=:deleted AND course_req.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

$query = $pdo->prepare("DELETE course_req FROM course,course_req WHERE course.visibility=:deleted AND course_req.req_cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}
//coursekeys
$query = $pdo->prepare("DELETE coursekeys FROM course,coursekeys WHERE course.visibility=:deleted AND coursekeys.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//fileLink
$query = $pdo->prepare("DELETE fileLink FROM course,fileLink WHERE course.visibility=:deleted AND fileLink.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

$query = $pdo->prepare("DELETE userAnswer FROM course,listentries,userAnswer WHERE course.visibility=:deleted AND listentries.cid = course.cid AND userAnswer.moment = listentries.lid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//listentries
$query = $pdo->prepare("DELETE listentries FROM course,listentries WHERE course.visibility=:deleted AND listentries.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error reading courses\n" . $error[2];
}

//programcourse
$query = $pdo->prepare("DELETE programcourse FROM course,programcourse WHERE course.visibility=:deleted AND programcourse.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//partresult
$query = $pdo->prepare("DELETE partresult FROM course,partresult WHERE course.visibility=:deleted AND partresult.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//quiz
$query = $pdo->prepare("DELETE quiz FROM course,quiz WHERE course.visibility=:deleted AND quiz.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//sequence
$query = $pdo->prepare("DELETE sequence FROM course,sequence WHERE course.visibility=:deleted AND sequence.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//shregister
$query = $pdo->prepare("DELETE shregister FROM course,shregister WHERE course.visibility=:deleted AND shregister.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
try {
	$query->execute();
}
catch(Exception $e) {
	//has to be empty for old database, use code below for debugging
}
/*if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}*/

//submission 
$query = $pdo->prepare("DELETE submission FROM course,submission WHERE course.visibility=:deleted AND submission.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//subparts
$query = $pdo->prepare("DELETE subparts FROM course,subparts WHERE course.visibility=:deleted AND subparts.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//timesheet
$query = $pdo->prepare("DELETE timesheet FROM course,timesheet WHERE course.visibility=:deleted AND timesheet.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
try {
	$query->execute();
}
catch(Exception $e) {
	//has to be empty for old database, use code below for debugging
}
/*if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}*/

//user_participant
$query = $pdo->prepare("DELETE user_participant FROM user_participant,course,listentries WHERE course.visibility=:deleted AND listentries.cid = course.cid AND listentries.lid = user_participant.lid;");
$query->bindParam(':deleted', $deleted);
try{
    $query->execute();
}
catch(Exception $e){
    //as the column doesnt exist on any of the tables with old data this is left blank, uncomment for debugging
    //$error = $query->errorInfo();
    //$debug = "Error reading courses\n" . $error[2];
}

//useranswer
$query = $pdo->prepare("DELETE userAnswer FROM course,userAnswer WHERE course.visibility=:deleted AND userAnswer.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//userduggafeedback
$query = $pdo->prepare("DELETE userduggafeedback FROM course,userduggafeedback WHERE course.visibility=:deleted AND userduggafeedback.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
try {
	$query->execute();
}
catch(Exception $e) {
	//has to be empty for old database, use code below for debugging
}
/*if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}*/

//user_course
$query = $pdo->prepare("DELETE user_course FROM course,user_course WHERE course.visibility=:deleted AND user_course.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//vers
$query = $pdo->prepare("DELETE vers FROM course,vers WHERE course.visibility=:deleted AND vers.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}
//Delete Courses that have been marked as deleted.
$query = $pdo->prepare("DELETE course FROM course WHERE visibility=:deleted;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

try{
    $query = $pdo->prepare("SELECT coursename,coursecode,cid,visibility,activeversion,activeedversion,courseGitURL FROM course ORDER BY coursename");
    //$query->bindParam(':cid', $cid);
    $query->execute();
}
catch(Exception $e){
    $query = $pdo->prepare("SELECT coursename,coursecode,cid,visibility,activeversion,activeedversion FROM course ORDER BY coursename");
    $error = $query->errorInfo();
}


/*

0 == hidden
1 == public
2 == login
3 == deleted

*/


if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error reading courses\n" . $error[2];

} else {

	foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
		$writeAccess = false;
		if (isset($userCourse[$row['cid']])) {
			if ($userCourse[$row['cid']] == "W") $writeAccess = true;
		}
		if (
			$isSuperUserVar ||
			$row['visibility'] == 1 ||
			($row['visibility'] == 2 && (isset($userCourse[$row['cid']]))) ||
			($row['visibility'] == 0 && $writeAccess)
		) {
			$isRegisteredToCourse = false;
			foreach ($userRegCourses as $userRegCourse) {
				if ($userRegCourse == $row['cid']) {
					$isRegisteredToCourse = true;
					break;
				}
			}
			array_push(
				$entries,
				array(
					'cid' => $row['cid'],
					'coursename' => $row['coursename'],
					'coursecode' => $row['coursecode'],
					'visibility' => $row['visibility'],
					'activeversion' => $row['activeversion'],
					'activeedversion' => $row['activeedversion'],
					'registered' => $isRegisteredToCourse,
					'courseGitURL' => $row['courseGitURL']
				)
			);
		}
	}
}

$versions = array();
$query = $pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt FROM vers;");

if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error reading courses\n" . $error[2];
} else {
	foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
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


$query = $pdo->prepare("SELECT motd,readonly FROM settings;");

if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error reading settings\n" . $error[2];
} else {
	$motd = "UNK";
	$readonly = 0;
	foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
		$motd = $row["motd"];
		$readonly = $row["readonly"];
	}
}



$array = array(
	'LastCourseCreated' => $LastCourseCreated,
	'entries' => $entries,
	'versions' => $versions,
	"debug" => $debug,
	'writeaccess' => $ha,
	'motd' => $motd,
	'readonly' => $readonly
);

echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "courseedservice.php", $userid, $info);
