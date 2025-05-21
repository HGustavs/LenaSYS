<?php

// Set the default timezone
date_default_timezone_set("Europe/Stockholm");

// Include necessary files
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../../../DuggaSys/microservices/curlService.php";
include_once "../curlService.php";

// Connect to the database and start the session
pdoConnect();
session_start();

$opt=getOP('opt');
$cid = getOP('cid');
$coursename = getOP('coursename');
$versid = getOP('versid');
$versname = getOP('versname');
$coursenamealt = getOP('coursenamealt');
$coursecode = getOP('coursecode');
$copycourse = getOP('copycourse');
$startdate = getOP('startdate');
$enddate = getOP('enddate');
$makeactive = getOP('makeactive');
$motd = getOP('motd');
$userid=getUid();

$data = callMicroserviceGET("sharedMicroservices/retrieveUsername_ms.php");
$username = $data['username'] ?? 'unknown';

$debug="NONE!";

// Permission checks
$haswrite = hasAccess($userid, $cid, 'w');
$isSuperUserVar = isSuperUser($userid);
$studentTeacher = hasAccess($userid, $cid, 'st');
$hasAccess = $haswrite || $isSuperUserVar;

header('Content-Type: application/json');

$dataToSend = [
	'ha' => $hasAccess,
	'debug' => $debug,
	'LastCourseCreated' => null,
	'isSuperUserVar' => $isSuperUserVar
];

if (!checklogin()){
	$dataToSend['debug'] = "User not logged in";
    echo callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true);
    return;
}

if (!($haswrite || $isSuperUserVar || $studentTeacher)) {
    $dataToSend['debug'] = "Access not granted";
    echo callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true);
    return;
}

if (strcmp($opt, "CPYVRS") !== 0) {
    $dataToSend['debug'] = "OPT does not match.";
    echo callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true);
    return;
}


$allOperationsSucceeded = true;
try {
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->beginTransaction();
	// Could use microservice createNewVersionOfCourse, but it is not implemented
	$query = $pdo->prepare("INSERT INTO vers(cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate,motd) values(:cid,:coursecode,:vers,:versname,:coursename,:coursenamealt,:startdate,:enddate,:motd);");

	$query->bindParam(':cid', $cid);
	$query->bindParam(':coursecode', $coursecode);
	$query->bindParam(':vers', $versid);
	$query->bindParam(':versname', $versname);
	$query->bindParam(':coursename', $coursename);
	$query->bindParam(':coursenamealt', $coursenamealt);
	$query->bindParam(':motd', $motd);

	// if start and end dates are null, insert mysql null value into database
	if ($startdate == "null"){
		$query->bindValue(':startdate', null, PDO::PARAM_INT);
	} else {
		$query->bindParam(':startdate', $startdate);
	}
	if ($enddate == "null") {
		$query->bindValue(':enddate', null, PDO::PARAM_INT);
	}else{
		$query->bindParam(':enddate', $enddate);
	} 

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
			$ruery = $pdo->prepare("INSERT INTO quiz (cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,relativedeadline,modified,creator,vers) SELECT cid,autograde,gradesystem,qname,quizFile,:qrel as qrelease,:deadl as deadline,relativedeadline,modified,creator,:newvers as vers from quiz WHERE id = :oldid;");
			$ruery->bindParam(':oldid', $row['id']);
			$ruery->bindParam(':newvers', $versid);
			$ruery->bindParam(':qrel', $startdate);
			$ruery->bindParam(':deadl', $enddate);
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
	$momentlist = array();
	$query = $pdo->prepare("SELECT * from listentries WHERE vers = :oldvers;");
	$query->bindParam(':oldvers', $copycourse);
	if (!$query->execute()) {
		$error = $query->errorInfo();
		$allOperationsSucceeded = false;
		$debug = "Error reading courses\n" . $error[2];
	} else {
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

	// Duplicate userAnswer
	$suery = $pdo->prepare("SELECT * from userAnswer WHERE vers = :oldvers;");
	$suery->bindParam(':oldvers', $copycourse);
	if (!$suery->execute()) {
		$error = $suery->errorInfo();
		$allOperationsSucceeded = false;
		$debug = "Error reading courses\n" . $error[2];
	} else {
		foreach ($suery->fetchAll(PDO::FETCH_ASSOC) as $row) {
			$ruery = $pdo->prepare("INSERT INTO userAnswer (cid,quiz,variant,moment,grade,uid,useranswer,submitted,marked,vers,creator,score) SELECT cid,quiz,variant,moment,grade,uid,useranswer,submitted,marked,:man AS vers,creator,score from userAnswer WHERE aid = :olaid;");
			$ruery->bindParam(':olaid', $row['aid']);
			$ruery->bindParam(':man', $versid);
			if (!$ruery->execute()) {
				$error = $ruery->errorInfo();
				$allOperationsSucceeded = false;
				$debug .= "Error copying entry\n" . $error[2];
			} else {
				$momentlist[$row['aid']] = $pdo->lastInsertId();
			}
		}
		// Update to correct moment
		foreach ($momentlist as $key => $value) {
			$ruery = $pdo->prepare("UPDATE userAnswer SET moment=:nyttmoment WHERE moment=:oldmoment AND vers=:updvers;");
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
			$puery = $pdo->prepare("UPDATE userAnswer SET quiz=:newquiz WHERE quiz=:oldquiz AND vers=:updvers;");
			$puery->bindParam(':newquiz', $value);
			$puery->bindParam(':oldquiz', $key);
			$puery->bindParam(':updvers', $versid);
			if (!$puery->execute()) {
				$error = $puery->errorInfo();
				$allOperationsSucceeded = false;
				$debug .= "Error updating entry\n" . $error[2];
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

// update data
$dataToSend = [
	'ha' => $hasAccess,
	'debug' => $debug,
	'LastCourseCreated' => null,
	'isSuperUserVar' => $isSuperUserVar
];

echo callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true);

