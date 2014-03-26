<?php
session_start();

function htmlsafe($str){
	return $str=htmlspecialchars($str,ENT_QUOTES,'UTF-8');
}

function logLogin($loginName, $success, $duggaNr, $courseName, $courseOccasion, $pdo){
	$insertString = "INSERT INTO userLoginsLog(loginName, userAgent, userIP, DateTime, success, quizNr, courseName, courseOccasion) VALUES(:LOGIN,:UAGENT,:IP,:DATETIME,:SUCCESS,:QNR,:CNAME,:COCCASION);";
	$insertStmt = $pdo->prepare($insertString);
	$insertStmt->bindParam(':LOGIN', $loginName);
	$insertStmt->bindParam(':UAGENT', $_SERVER['HTTP_USER_AGENT']);
	$now=new DateTime();
	$dateString=$now->format('Y-m-d H:i:s');
	$insertStmt->bindParam(':DATETIME', $dateString); // date and time formated to string e.g. "2012-08-23 08:59:00"
	$insertStmt->bindParam(':IP', $_SERVER['REMOTE_ADDR']);
	$insertStmt->bindParam(':SUCCESS', $success);
	$insertStmt->bindParam(':QNR', $duggaNr);
	$insertStmt->bindParam(':CNAME', $courseName);
	$insertStmt->bindParam(':COCCASION', $courseOccasion);
	$insertStmt->execute();	
}

$errorMsg = "";


//Returns the user login name if login is successfull else false
function checkLogin(&$errorMsg, $courseName, $courseOccasion, $duggaNr) {
    $loginName = "";
    $password = "";
	include "../dbconnect.php";
	
    if ((isset($_POST['loginName']) && isset($_POST['password']))) {
        $loginName = trim($_POST['loginName']);
        $password = $_POST['password'];
    } else if (isset($_SESSION['loginName']) && isset($_SESSION['password'])) {
        $loginName = $_SESSION['loginName'];
        $password = $_SESSION['password'];
    } elseif ($courseOccasion == "TEST") {
        $loginName = "a00nisse";
        $password = md5("123");
    }

    if ($loginName != "" && $password != "") {
		
		//Check if the student is a praticipant of the course
		$queryString="SELECT Student.loginName, Student.passw
					   FROM Student, StudentCourseRegistration 
					   WHERE Student.ssn=StudentCourseRegistration.studentSsn
					   AND Student.loginName=:LOGINN
					   AND Student.passw=:PASSW
					   AND courseName=:CNAME 
					   AND courseOccasion=:COCCASION;";
		$stmt = $pdo->prepare($queryString);
		$stmt->bindParam(':LOGINN', $loginName);
		$stmt->bindParam(':PASSW', $password);
		$stmt->bindParam(':CNAME', $courseName);
		$stmt->bindParam(':COCCASION', $courseOccasion);
		$stmt->execute();
		$result=$stmt->fetch();
		if ($stmt->rowCount() == 1) { //Student is a participant of this course and course occasion
			// foreach ($stmt->fetch() as $row) { $courseName, $courseOccasion, $duggaNr
                $_SESSION['loginName'] = $result['loginName'];
                $_SESSION['password'] = $result['passw'];
                $_SESSION['courseName'] = $courseName;
                $_SESSION['courseOccasion'] = $courseOccasion;
                $_SESSION['quizNr'] = $duggaNr;
            // }
            logLogin($loginName, "successful", $duggaNr, $courseName, $courseOccasion, $pdo);
			return $_SESSION['loginName'];
        } else {
			$errorMsg="Incorrect username or password";
			// CREATE TABLE logFailedUserLogins(
			// id INTEGER AUTO_INCREMENT,
			// loginName VARCHAR(30),
			// userAgent VARCHAR(1024), /*$_SERVER['HTTP_USER_AGENT']*/
			// userIP VARCHAR(20), /*$_SERVER['REMOTE_ADDR']*/
			// DateTime TIMESTAMP,
			// courseName VARCHAR(100),
			// courseOccasion VARCHAR(25),
			// quizNr INTEGER,
			// PRIMARY KEY(id)
			// ) ENGINE=INNODB CHARACTER SET utf8 COLLATE utf8_swedish_ci;
			/*$insertString = "INSERT INTO logFailedUserLogins(loginName, userAgent, userIP, courseName, courseOccasion, quizNr) VALUES(:LOGIN,:UAGENT,:UIP,:CNAME,:COCCASION,:QNR);";
			$insertStmt = $pdo->prepare($insertString);
			$insertStmt->bindParam(':LOGIN',  $loginName);
			$insertStmt->bindParam(':UAGENT', $_SERVER['HTTP_USER_AGENT']);
			$insertStmt->bindParam(':UIP', $_SERVER['REMOTE_ADDR']);
			$insertStmt->bindParam(':QNR', $duggaNr);
			$insertStmt->bindParam(':CNAME', $courseName);
			$insertStmt->bindParam(':COCCASION', $courseOccasion);
			$insertStmt->execute();*/
			logLogin($loginName, "failed - Incorrect username and/or password", $duggaNr, $courseName, $courseOccasion, $pdo);
			return false;
		}	
    }
	logLogin($loginName, "failed - No username and/or password given", $duggaNr, $courseName, $courseOccasion, $pdo);
    return false;
}

if (isset($_GET['logout'])) {
	session_destroy();
}



?>
