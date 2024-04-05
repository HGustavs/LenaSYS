<?php
session_start();
date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
require 'course.php';
require 'query.php';

//Gets the parameter from the URL. If the parameter is not availble then return UNK
$course = getOPG("c");
$assignment = getOPG("a");
$submission = getOPG("s");

// Connect to database and start session
pdoConnect();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="student";		
} 

//To test this function, try and enter the following:
//http://localhost/lenasys/LenaSYS/sh/?a=<hash>
function GetAssignment ($hash){
	global $pdo;
	global $userid;

	// Defaults to 404 Error page if no there is no match in the database for the hash value
	//$URL = "../errorpages/404.php";

	// Database request form
	$sql = "select * from userAnswer left join quiz on userAnswer.quiz=quiz.id left join course on course.cid=userAnswer.cid where hash=:hash;";
	$query = $pdo->prepare($sql);
	$query->bindParam(":hash", $hash,PDO::PARAM_STR);
	$query->execute();

	// Database update form
	$sql_1 = "UPDATE userAnswer SET last_Time_techer_visited=SYSDATE() where hash=:hash;";
	$query_1 = $pdo->prepare($sql_1);
	$query_1->bindParam(":hash", $hash,PDO::PARAM_STR);
	$query_1->execute();
	
	// There should only be one match to the hash value in database as the hash is unique
	foreach ($query->fetchAll() as $row){
		$cid = $row['cid'];
		$vers = $row['vers'];
		$coursename=$row['coursename'];
		$moment = $row['moment'];
		$did = $row['quiz'];
		//$highscoremode = $row['highscoremode'];
		$deadline = $row['deadline'];
		$variant = $row['variant'];
		$hashpwd = $row['password'];
	}
	
	// Redirect if no password is stored in session or if hash/hashpwd is incorrect 
	if(isSuperUser($userid)){
		// Never ask for pwd
	}else if(!isset($_SESSION["submission-password-$cid-$vers-$did-$moment"]) || (isset($_SESSION["submission-password-$cid-$vers-$did-$moment"]) && $_SESSION["submission-password-$cid-$vers-$did-$moment"]!=$hashpwd)){
		$_SESSION['checkhash']=$hash;
		header("Location: ../DuggaSys/validateHash.php");
		exit();	
	}

	if($_SESSION['should-validate'] == "FALSE" &&isset($cid)&&isset($coursename)&&isset($vers)&&isset($moment)&&isset($deadline)){
		$_SESSION['should-validate'] = "TRUE";	
		$_SESSION["submission-$cid-$vers-$did-$moment"]=$hash;
		$_SESSION["submission-password-$cid-$vers-$did-$moment"]=$hashpwd;
		$_SESSION["submission-variant-$cid-$vers-$did-$moment"]=$variant;	
		$_SESSION["hash"]=$hash;
		echo "../DuggaSys/showDugga.php?coursename={$coursename}&courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$did}&moment={$moment}&deadline={$deadline}&hash={$hash}<br>";
		echo "|$hash|$hashpwd|<br>";
		header("Location: ../DuggaSys/showDugga.php?coursename={$coursename}&courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$did}&moment={$moment}&deadline={$deadline}&hash={$hash}");
		exit();	
	}else{
		$_SESSION['checkhash']=$hash;
		header("Location: ../DuggaSys/validateHash.php");
		exit();	
		/*
		echo "../DuggaSys/showDugga.php?coursename={$coursename}&courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$did}&moment={$moment}&deadline={$deadline}<br>";
		echo "|$hash|$hashpwd|<br>";
		header("Location: ../errorpages/404.php");
		exit();	*/
	}
	
}

//------------------------------------------------------------------------------------------------
//
// GetCourse($course)
//
// Redirect to the course that uniquely reflects the input string $course. The input string 
// must be matched with course names. If multiple courses match with the input string
// the function does not redirects to any course.
// 
// To test this function, try and enter the following:
// https://[your LenaSYS installation host]/DuggaSYS/sh/?c=demo-course
// https://[your LenaSYS installation host]/DuggaSYS/sh/?c=webbprogrammering
//
//------------------------------------------------------------------------------------------------
function GetCourse($course){
	global $pdo;

	// Match parameters with SH identifiers
	$sql = "SELECT cid FROM shregister WHERE cparam = :cparam AND aparam = 'UNK';";
	$query = $pdo->prepare($sql);
	$query->bindParam(":cparam", $course,PDO::PARAM_STR);
	$query->execute();

	if($row = $query->fetch(PDO::FETCH_ASSOC)){ // Identifier recognized
		$cid = $row['cid'];

		// echo "<script>console.log('Console: An identifier was found');</script>";

		// Fetch corresponding course data
		$sql="SELECT cid,activeversion AS vers,coursename FROM course WHERE visibility = 1 AND cid = :courseid;";
		$query = $pdo->prepare($sql);
		$query->bindParam(":courseid", $cid,PDO::PARAM_INT);
		$query->execute();

		if($row = $query->fetch(PDO::FETCH_ASSOC)) { // Course data was found
			$cid = $row['cid'];
			$vers = $row['vers'];
			$coursename = $row['coursename'];

			// Check if the SH identifier have resemblance to coursename
			if (!(stristr($course, $coursename) || stristr($coursename, $course))) { // SH identifier do not resemble course name
				// Search for a course in course resembling parameter
				$sql="SELECT cid,activeversion AS vers,coursename FROM course WHERE visibility = 1 AND coursename LIKE CONCAT('%', :cparam, '%');";
				$query = $pdo->prepare($sql);
				$query->bindParam(":cparam", $course, PDO::PARAM_STR);
				$query->execute();

				if($row = $query->fetch(PDO::FETCH_ASSOC)) { // One  row resulted form query
					if (!$query->fetch()) { // Only one row
						$cid = $row['cid'];
						$vers = $row['vers'];
						$coursename = $row['coursename'];

						// echo "<script>console.log('Console: SH identifier is unique');</script>";

						$sql = "UPDATE shregister SET cid = :courseid WHERE cparam = :cparam AND aparam = 'UNK';";
						$query = $pdo->prepare($sql);
						$query->bindParam(":courseid", $cid,PDO::PARAM_INT);
						$query->bindParam(":cparam", $course, PDO::PARAM_STR);
						$query->execute();

						// echo "<script>console.log('Console: SH identifier updated');</script>";
					} else { // Multiple query results
						// echo "<script>console.log('Console: SH identifier is not unique');</script>";

						$sql = "DELETE FROM shregister WHERE cparam = :cparam AND aparam = 'UNK';";
						$query = $pdo->prepare($sql);
						$query->bindParam(":cparam", $course, PDO::PARAM_STR);
						$query->execute();

						unset($cid);
						unset($vers);
					}
				} else { // No query results
					// echo "<script>console.log('Console: SH identifier has no resembling query');</script>";

					$sql = "DELETE FROM shregister WHERE cparam = :cparam AND aparam = 'UNK';";
					$query = $pdo->prepare($sql);
					$query->bindParam(":cparam", $course, PDO::PARAM_STR);
					$query->execute();
					
					unset($cid);
					unset($vers);
				}
			} else { // SH identifier resemble course name
				// echo "<script>console.log('Console: SH identifier found');</script>";
			}
		} else { // No corresponding course data was found
			unset($cid);
			// Search for a course in course resembling parameter
			$sql="SELECT cid,activeversion AS vers,coursename FROM course WHERE visibility = 1 AND coursename LIKE CONCAT('%', :cparam, '%');";
			$query = $pdo->prepare($sql);
			$query->bindParam(":cparam", $course, PDO::PARAM_STR);
			$query->execute();

			if($row = $query->fetch(PDO::FETCH_ASSOC)) { // One  row resulted form query
				if (!$query->fetch()) { // Only one row
					$cid = $row['cid'];
					$vers = $row['vers'];
					$coursename = $row['coursename'];

					// echo "<script>console.log('Console: SH identifier is unique');</script>";

					$sql = "UPDATE shregister SET cid = :courseid WHERE cparam = :cparam AND aparam = 'UNK';";
					$query = $pdo->prepare($sql);
					$query->bindParam(":courseid", $cid,PDO::PARAM_INT);
					$query->bindParam(":cparam", $course, PDO::PARAM_STR);
					$query->execute();

					// echo "<script>console.log('Console: SH identifier updated');</script>";
				} else { // Multiple query results
					// echo "<script>console.log('Console: SH identifier is not unique');</script>";

					$sql = "DELETE FROM shregister WHERE cparam = :cparam AND aparam = 'UNK';";
					$query = $pdo->prepare($sql);
					$query->bindParam(":cparam", $course, PDO::PARAM_STR);
					$query->execute();
				}
			} else { // No query results
				// echo "<script>console.log('Console: SH identifier has no resembling query');</script>";

				$sql = "DELETE FROM shregister WHERE cparam = :cparam AND aparam = 'UNK';";
				$query = $pdo->prepare($sql);
				$query->bindParam(":cparam", $course, PDO::PARAM_STR);
				$query->execute();
			}
		}
	} else { // Identifier not recognized
		// echo "<script>console.log('Console: No identifier was found' );</script>";
		// Find a resembling coursename form course with parameters
		$sql="SELECT cid,activeversion AS vers,coursename FROM course WHERE visibility = 1 AND coursename LIKE CONCAT('%', :cparam, '%');";
		$query = $pdo->prepare($sql);
		$query->bindParam(":cparam", $course, PDO::PARAM_STR);
		$query->execute();

		if($row = $query->fetch(PDO::FETCH_ASSOC)) { // One  row resulted form query
			if (!$query->fetch()) { // Only one row
				$cid = $row['cid'];
				$vers = $row['vers'];
				$coursename = $row['coursename'];

				// Prevent SH links to be created for an course if that course already has an link to it
				$sql = "SELECT * FROM shregister WHERE cid = :courseid AND lid IS NULL;";
				$query = $pdo->prepare($sql);
				$query->bindParam(":courseid", $cid,PDO::PARAM_INT);
				$query->execute();
				
				if($row = $query->fetch(PDO::FETCH_ASSOC)) { // Course already has an associated SH link
					// echo "<script>console.log('Console: SH identifier already exists');</script>";
					unset($cid);
					unset($vers);
				} else { // Course does not have an associated SH link
					// echo "<script>console.log('Console: SH identifier is unique');</script>";

					$sql = "INSERT INTO shregister (cparam, aparam, cid) VALUES (?, ?, ?);";
					$query = $pdo->prepare($sql);
					$query->execute([$course, "UNK", $cid]);

					// echo "<script>console.log('Console: New SH identifier created');</script>";
				}
			} else { // Multiple query results
				// echo "<script>console.log('Console: SH identifier is not unique');</script>";
			}
		} else { // No query results
			// echo "<script>console.log('Console: SH identifier has no resembling query');</script>";
		}
	}

	if(isset($cid)) {
		header("Location: ../DuggaSys/sectioned.php?courseid={$cid}&coursevers={$vers}");
		exit();
	}else{
		header("Location: ../errorpages/404.php");
	}
}

//------------------------------------------------------------------------------------------------
//
// CourseAndAssignment($course, $assignment)
//
// Redirect to assignment and active course that uniquely reflects the input strings $assignment and 
// $course. The input strings is must be matched in the respective 
// parameters. If multiple courses matches the the function uses no course,
// likewise if multiple assignments matches the no assignment is used 
// 
// To test this function, try and enter the following:
// https://[your LenaSYS installation host]/DuggaSYS/sh/?c=demo-course&a=diagram dugga
// https://[your LenaSYS installation host]/DuggaSYS/sh/?c=demo-course&a=dugga 1
//
//------------------------------------------------------------------------------------------------
function CourseAndAssignment($course, $assignment) {	
	global $pdo;

	// Match parameters with SH identifiers
	$sql = "SELECT cid, lid FROM shregister WHERE cparam = :cparam AND aparam = :aparam;";
	$query = $pdo->prepare($sql);
	$query->bindParam(":cparam", $course,PDO::PARAM_STR);
	$query->bindParam(":aparam", $assignment,PDO::PARAM_STR);
	$query->execute();

	if($row = $query->fetch(PDO::FETCH_ASSOC)){ // Identifier recognized
		$cid = $row['cid'];
		$lid = $row['lid'];

		// echo "<script>console.log('Console: An identifier was found');</script>";

		// Fetch corresponding course and assignment data
		$sql="SELECT course.cid AS cid,course.activeversion AS vers, course.coursename AS coursename, listentries.entryname AS entryname, listentries.lid AS lid,listentries.link AS link,listentries.highscoremode AS highscoremode,quiz.deadline AS deadline FROM listentries JOIN course ON listentries.vers=course.activeversion AND listentries.cid=course.cid LEFT JOIN quiz ON listentries.link=quiz.id WHERE kind = 3 AND visible = 1 AND visibility = 1 AND course.cid = :courseid AND listentries.lid = :assignmentid;";
		$query = $pdo->prepare($sql);
		$query->bindParam(":courseid", $cid,PDO::PARAM_INT);
		$query->bindParam(":assignmentid", $lid,PDO::PARAM_INT);
		$query->execute();

		if($row = $query->fetch(PDO::FETCH_ASSOC)) { // Course and assignment data was found
			$cid = $row['cid'];
			$vers = $row['vers'];
			$coursename = $row['coursename'];
			$entryname = $row['entryname'];
			$lid = $row['lid'];
			$link = $row['link'];

			// Check if the SH identifiers have resemblance to coursename and assignmentname
			if (!(stristr($course, $coursename) || stristr($coursename, $course)) || !(stristr($assignment, $entryname) || stristr($entryname, $assignment))) { // SH identifiers do not resemble course and assignment names
				// Search for an course and assignment pair in listentries resembling with parameters
				$sql="SELECT course.cid AS cid,course.activeversion AS vers, course.coursename AS coursename, listentries.entryname AS entryname, listentries.lid AS lid,listentries.link AS link,listentries.highscoremode AS highscoremode,quiz.deadline AS deadline FROM listentries JOIN course ON listentries.vers=course.activeversion AND listentries.cid=course.cid LEFT JOIN quiz ON listentries.link=quiz.id WHERE kind = 3 AND visible = 1 AND visibility = 1 AND coursename LIKE CONCAT('%', :cparam, '%') AND entryname LIKE CONCAT('%', :aparam, '%');";
				$query = $pdo->prepare($sql);
				$query->bindParam(":cparam", $course, PDO::PARAM_STR);
				$query->bindParam(":aparam", $assignment, PDO::PARAM_STR);
				$query->execute();

				if($row = $query->fetch(PDO::FETCH_ASSOC)) { // One  row resulted form query
					if (!$query->fetch()) { // Only one row
						$cid = $row['cid'];
						$vers = $row['vers'];
						$coursename = $row['coursename'];
						$entryname = $row['entryname'];
						$lid = $row['lid'];
						$link = $row['link'];

						// echo "<script>console.log('Console: SH identifier is unique');</script>";

						$sql = "UPDATE shregister SET cid = :courseid, lid = :assignmentid WHERE cparam = :cparam AND aparam = :aparam;";
						$query = $pdo->prepare($sql);
						$query->bindParam(":courseid", $cid,PDO::PARAM_INT);
						$query->bindParam(":assignmentid", $lid,PDO::PARAM_INT);
						$query->bindParam(":cparam", $course, PDO::PARAM_STR);
						$query->bindParam(":aparam", $assignment, PDO::PARAM_STR);
						$query->execute();

						// echo "<script>console.log('Console: SH identifier updated');</script>";
					} else { // Multiple query results
						// echo "<script>console.log('Console: SH identifier is not unique');</script>";

						$sql = "DELETE FROM shregister WHERE cparam = :cparam AND aparam = :aparam;";
						$query = $pdo->prepare($sql);
						$query->bindParam(":cparam", $course, PDO::PARAM_STR);
						$query->bindParam(":aparam", $assignment, PDO::PARAM_STR);
						$query->execute();

						unset($cid);
						unset($vers);
						unset($link);
						unset($lid);
					}
				} else { // No query results
					// echo "<script>console.log('Console: SH identifier has no resembling query');</script>";

					$sql = "DELETE FROM shregister WHERE cparam = :cparam AND aparam = :aparam;";
					$query = $pdo->prepare($sql);
					$query->bindParam(":cparam", $course, PDO::PARAM_STR);
					$query->bindParam(":aparam", $assignment, PDO::PARAM_STR);
					$query->execute();

					unset($cid);
					unset($vers);
					unset($link);
					unset($lid);
				}
			} else { // SH identifier resemble course and assignment names
				// echo "<script>console.log('Console: SH identifier found');</script>";
			}
		} else { // No corresponding course and assignment data was found
			unset($cid);
			// Search for an course and assignment pair in listentries resembling with parameters
			$sql="SELECT course.cid AS cid,course.activeversion AS vers, course.coursename AS coursename, listentries.entryname AS entryname, listentries.lid AS lid,listentries.link AS link,listentries.highscoremode AS highscoremode,quiz.deadline AS deadline FROM listentries JOIN course ON listentries.vers=course.activeversion AND listentries.cid=course.cid LEFT JOIN quiz ON listentries.link=quiz.id WHERE kind = 3 AND visible = 1 AND visibility = 1 AND coursename LIKE CONCAT('%', :cparam, '%') AND entryname LIKE CONCAT('%', :aparam, '%');";
			$query = $pdo->prepare($sql);
			$query->bindParam(":cparam", $course, PDO::PARAM_STR);
			$query->bindParam(":aparam", $assignment, PDO::PARAM_STR);
			$query->execute();

			if($row = $query->fetch(PDO::FETCH_ASSOC)) { // One  row resulted form query
				if (!$query->fetch()) { // Only one row
					$cid = $row['cid'];
					$vers = $row['vers'];
					$coursename = $row['coursename'];
					$entryname = $row['entryname'];
					$lid = $row['lid'];
					$link = $row['link'];

					// echo "<script>console.log('Console: SH identifier is unique');</script>";

					$sql = "UPDATE shregister SET cid = :courseid, lid = :assignmentid WHERE cparam = :cparam AND aparam = :aparam;";
					$query = $pdo->prepare($sql);
					$query->bindParam(":courseid", $cid,PDO::PARAM_INT);
					$query->bindParam(":assignmentid", $lid,PDO::PARAM_INT);
					$query->bindParam(":cparam", $course, PDO::PARAM_STR);
					$query->bindParam(":aparam", $assignment, PDO::PARAM_STR);
					$query->execute();

					// echo "<script>console.log('Console: SH identifier updated');</script>";
				} else { // Multiple query results
					// echo "<script>console.log('Console: SH identifier is not unique');</script>";

					$sql = "DELETE FROM shregister WHERE cparam = :cparam AND aparam = :aparam;";
					$query = $pdo->prepare($sql);
					$query->bindParam(":cparam", $course, PDO::PARAM_STR);
					$query->bindParam(":aparam", $assignment, PDO::PARAM_STR);
					$query->execute();
				}
			} else { // No query results
				// echo "<script>console.log('Console: SH identifier has no resembling query');</script>";

				$sql = "DELETE FROM shregister WHERE cparam = :cparam AND aparam = :aparam;";
				$query = $pdo->prepare($sql);
				$query->bindParam(":cparam", $course, PDO::PARAM_STR);
				$query->bindParam(":aparam", $assignment, PDO::PARAM_STR);
				$query->execute();
			}
		}
	} else { // Identifier not recognized
		// echo "<script>console.log('Console: No identifier was found' );</script>";
		// Find a resembling course and assignment form listentries with parameters
		$sql="SELECT course.cid AS cid,course.activeversion AS vers, course.coursename AS coursename, listentries.entryname AS entryname, listentries.lid AS lid,listentries.link AS link,listentries.highscoremode AS highscoremode,quiz.deadline AS deadline FROM listentries JOIN course ON listentries.vers=course.activeversion AND listentries.cid=course.cid LEFT JOIN quiz ON listentries.link=quiz.id WHERE kind = 3 AND visible = 1 AND visibility = 1 AND coursename LIKE CONCAT('%', :cparam, '%') AND entryname LIKE CONCAT('%', :aparam, '%');";
		$query = $pdo->prepare($sql);
		$query->bindParam(":cparam", $course, PDO::PARAM_STR);
		$query->bindParam(":aparam", $assignment, PDO::PARAM_STR);
		$query->execute();

		if($row = $query->fetch(PDO::FETCH_ASSOC)) { // One  row resulted form query
			if (!$query->fetch()) { // Only one row
				$cid = $row['cid'];
				$vers = $row['vers'];
				$coursename = $row['coursename'];
				$entryname = $row['entryname'];
				$lid = $row['lid'];
				$link = $row['link'];

				// Prevent SH links to be created for an assignment if that assignment already has an link to it
				$sql = "SELECT * FROM shregister WHERE cid = :courseid AND lid = :assignmentid;";
				$query = $pdo->prepare($sql);
				$query->bindParam(":courseid", $cid,PDO::PARAM_INT);
				$query->bindParam(":assignmentid", $lid,PDO::PARAM_INT);
				$query->execute();
				
				if($row = $query->fetch(PDO::FETCH_ASSOC)) { // Assignment already has an associated SH link
					// echo "<script>console.log('Console: SH identifier already exists');</script>";
					unset($cid);
					unset($vers);
					unset($link);
					unset($lid);
				} else { // Assignment does not have an associated SH link
					// echo "<script>console.log('Console: SH identifier is unique');</script>";

					$sql = "INSERT INTO shregister (cparam, aparam, cid, lid) VALUES (?, ?, ?, ?);";
					$query = $pdo->prepare($sql);
					$query->execute([$course, $assignment, $cid, $lid]);

					// echo "<script>console.log('Console: New SH identifier created');</script>";
				}
			} else { // Multiple query results
				// echo "<script>console.log('Console: SH identifier is not unique');</script>";
			}
		} else { // No query results
			// echo "<script>console.log('Console: SH identifier has no resembling query');</script>";
		}
	}

	if(isset($cid)&&isset($vers)&&isset($link)&&isset($lid)) {
		header("Location: ../DuggaSys/showDugga.php?courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$link}&moment={$lid}");
		exit();
	}else{
		header("Location: ../errorpages/404.php");
	}
}


if($submission != "UNK"){
	$assignmentURL = GetAssignment($submission);
}else if(($course != "UNK") && ($assignment == "UNK")){
	GetCourse($course);
}else if(($assignment != "UNK") && ($course != "UNK")) {
	CourseAndAssignment($course, $assignment);
}
else {
	header("Location: ../errorpages/404.php");
}
$pdo = null;

