<?php
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
session_start();

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

	if(isset($cid)&&isset($coursename)&&isset($vers)&&isset($moment)&&isset($deadline)){	
		$_SESSION["submission-$cid-$vers-$did-$moment"]=$hash;
		$_SESSION["submission-password-$cid-$vers-$did-$moment"]=$hashpwd;
		$_SESSION["submission-variant-$cid-$vers-$did-$moment"]=$variant;	
		echo "../DuggaSys/showDugga.php?coursename={$coursename}&courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$did}&moment={$moment}&deadline={$deadline}&embed<br>";
		echo "|$hash|$hashpwd|<br>";
		header("Location: ../DuggaSys/showDugga.php?coursename={$coursename}&courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$did}&moment={$moment}&deadline={$deadline}&embed");
		exit();	
	}else{
		echo "../DuggaSys/showDugga.php?coursename={$coursename}&courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$did}&moment={$moment}&deadline={$deadline}&embed<br>";
		echo "|$hash|$hashpwd|<br>";
//		header("Location: ../errorpages/404.php");
		exit();	
	}
	
}

//------------------------------------------------------------------------------------------------
//
// GetCourse($course)
//
// Redirect to the active course that best reflects the input string $course. The input string is 
// split on SPACE and all substrings must be matched in the course name. If multiple courses matches
// the the function redirects to the first course in alphabetical order.
// 
// To test this function, try and enter the following:
// https://[your LenaSYS installation host]/DuggaSYS/sh/?c=datorgrafik
// https://[your LenaSYS installation host]/DuggaSYS/sh/?c=mobil prog
//
//------------------------------------------------------------------------------------------------
function GetCourse($course){
	global $pdo;

	// Match parameters with SH identifiers
	$sql = "SELECT cparam, aparam, cid FROM shregister WHERE cparam = :cparam AND aparam = 'UNK';";
	$query = $pdo->prepare($sql);
	$query->bindParam(":cparam", $course,PDO::PARAM_STR);
	$query->execute();

	if($row = $query->fetch(PDO::FETCH_ASSOC)){ // Identifier recognized
		$cparam = $row['cparam'];
		$cid = $row['cid'];

		// echo "<script>console.log('Console: An identifier was found');</script>";

		// Fetch corresponding course data
		$sql="SELECT cid,activeversion AS vers,coursename FROM course WHERE visibility=1 AND cid = :courseid;";
		$query = $pdo->prepare($sql);
		$query->bindParam(":courseid", $cid,PDO::PARAM_INT);
		$query->execute();

		if($row = $query->fetch(PDO::FETCH_ASSOC)) {
			$cid = $row['cid'];
			$vers = $row['vers'];
			$coursename = $row['coursename'];

			// TODO Implement handler for if couresname has no resemblance with SH parameters
			// Check if the SH identifiers have resemblance to coursename
			if ((stristr($cparam, $coursename) || stristr($coursename, $cparam))) {

			} else { // SH identifiers do not resemble course name

			}
		} else {
			// TODO Implement handler for deleted courses, changed id for courses and deletion of identifiers
		}
	} else { // Identifier not recognized (Create new identifier)
		// echo "<script>console.log('Console: No identifier was found' );</script>";
		// Find a resembling coursename form course with parameters
		$sql="SELECT cid,activeversion AS vers,coursename FROM course WHERE visibility=1 AND coursename LIKE CONCAT('%', :cparam, '%');";
		$query = $pdo->prepare($sql);
		$query->bindParam(":cparam", $course, PDO::PARAM_STR);
		$query->execute();

		if($row = $query->fetch(PDO::FETCH_ASSOC)) { // One  row resulted form query
			if (!$query->fetch()) {
				$cid = $row['cid'];
				$vers = $row['vers'];
				$coursename = $row['coursename'];

				// echo "<script>console.log('Console: SH identifier is unique');</script>";

				$sql = "INSERT INTO shregister (cparam, aparam, cid) VALUES (?, ?, ?);";
				$query = $pdo->prepare($sql);
				$query->execute([$course, "UNK", $cid]);

				// echo "<script>console.log('Console: New SH identifier created');</script>";
			} else { // Multiple query results
				// echo "<script>console.log('Console: SH identifier is not unique');</script>";
			}
		} else { // No query results
			// echo "<script>console.log('Console: SH identifier has no resembling query');</script>";
		}
	}

	if(isset($cid)&&isset($vers)) {
		header("Location: ../DuggaSys/sectioned.php?courseid={$cid}&coursevers={$vers}&embed");
		exit();
	}else{
		header("Location: ../errorpages/404.php");
	}
}

//------------------------------------------------------------------------------------------------
//
// CourseAndAssignment($course, $assignment)
//
// Redirect to assignment and active course that best reflects the input strings $assignment and 
// $course. The input strings is split on SPACE and all substrings must be matched in the respective 
// parameters. If multiple courses matches the the function uses the first course in 
// alphabetical order in the redirection, likewise if multiple assignments matches the first 
// assignment in alphabetical order is used in the redirection.
// 
// To test this function, try and enter the following:
// https://[your LenaSYS installation host]/DuggaSYS/sh/?c=datorgrafik&a=bit 1
// https://[your LenaSYS installation host]/DuggaSYS/sh/?c=datorgrafik&a=bit 2
//
//------------------------------------------------------------------------------------------------
function CourseAndAssignment($course, $assignment) {	
	global $pdo;

	// Match parameters with SH identifiers
	$sql = "SELECT cparam, aparam, cid, lid FROM shregister WHERE cparam = :cparam AND aparam = :aparam;";
	$query = $pdo->prepare($sql);
	$query->bindParam(":cparam", $course,PDO::PARAM_STR);
	$query->bindParam(":aparam", $assignment,PDO::PARAM_STR);
	$query->execute();

	if($row = $query->fetch(PDO::FETCH_ASSOC)){ // Identifier recognized
		$cparam = $row['cparam'];
		$aparam = $row['aparam'];
		$cid = $row['cid'];
		$lid = $row['lid'];

		// echo "<script>console.log('Console: An identifier was found');</script>";

		// Fetch corresponding course and assignment data
		$sql="SELECT course.cid AS cid,course.activeversion AS vers, course.coursename AS coursename, listentries.entryname AS entryname, listentries.lid AS lid,listentries.link AS link,listentries.highscoremode AS highscoremode,quiz.deadline AS deadline FROM listentries JOIN course ON listentries.vers=course.activeversion AND listentries.cid=course.cid LEFT JOIN quiz ON listentries.link=quiz.id WHERE kind=3 AND course.cid = :courseid AND listentries.lid = :assignmentid;";
		$query = $pdo->prepare($sql);
		$query->bindParam(":courseid", $cid,PDO::PARAM_INT);
		$query->bindParam(":assignmentid", $lid,PDO::PARAM_INT);
		$query->execute();

		if($row = $query->fetch(PDO::FETCH_ASSOC)) {
			$cid = $row['cid'];
			$vers = $row['vers'];
			$coursename = $row['coursename'];
			$entryname = $row['entryname'];
			$lid = $row['lid'];
			$link = $row['link'];
			$highscoremode = $row['highscoremode'];
			$deadline = $row['deadline'];

			// TODO Implement handler for if couresname and assignmentname has no resemblance with SH parameters
			// Check if the SH identifiers have resemblance to coursename and assignmentname
			if ((stristr($cparam, $coursename) || stristr($coursename, $cparam)) && (stristr($aparam, $entryname) || stristr($entryname, $aparam))) {

			} else { // SH identifiers do not resemble course and assignment names

			}
		} else {
			// TODO Implement handler for deleted courses and assignments, changed id for courses and assignments and deletion of identifiers
		}
	} else { // Identifier not recognized (Create new identifier)
		// echo "<script>console.log('Console: No identifier was found' );</script>";
		// Find a resembling coursename and assignmentname form listentry with parameters
		$sql="SELECT course.cid AS cid,course.activeversion AS vers, course.coursename AS coursename, listentries.entryname AS entryname, listentries.lid AS lid,listentries.link AS link,listentries.highscoremode AS highscoremode,quiz.deadline AS deadline FROM listentries JOIN course ON listentries.vers=course.activeversion AND listentries.cid=course.cid LEFT JOIN quiz ON listentries.link=quiz.id WHERE kind=3 AND coursename LIKE CONCAT('%', :cparam, '%') AND entryname LIKE CONCAT('%', :aparam, '%');";
		$query = $pdo->prepare($sql);
		$query->bindParam(":cparam", $course, PDO::PARAM_STR);
		$query->bindParam(":aparam", $assignment, PDO::PARAM_STR);
		$query->execute();

		if($row = $query->fetch(PDO::FETCH_ASSOC)) { // One  row resulted form query
			if (!$query->fetch()) {
				$cid = $row['cid'];
				$vers = $row['vers'];
				$coursename = $row['coursename'];
				$entryname = $row['entryname'];
				$lid = $row['lid'];
				$link = $row['link'];
				$highscoremode = $row['highscoremode'];
				$deadline = $row['deadline'];

				// echo "<script>console.log('Console: SH identifier is unique');</script>";

				$sql = "INSERT INTO shregister (cparam, aparam, cid, lid) VALUES (?, ?, ?, ?);";
				$query = $pdo->prepare($sql);
				$query->execute([$course, $assignment, $cid, $lid]);

				// echo "<script>console.log('Console: New SH identifier created');</script>";
			} else { // Multiple query results
				// echo "<script>console.log('Console: SH identifier is not unique');</script>";
			}
		} else { // No query results
			// echo "<script>console.log('Console: SH identifier has no resembling query');</script>";
		}
	}

	if(isset($cid)&&isset($vers)&&isset($link)&&isset($lid)) {
		header("Location: ../DuggaSys/showDugga.php?courseid={$cid}&cid={$cid}&coursevers={$vers}&did={$link}&moment={$lid}&embed");
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
	//header("Location: ../errorpages/404.php");
}
$pdo = null;

