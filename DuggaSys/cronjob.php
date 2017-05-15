<?php
// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();


if (isset($argc) && $argc == 2) {
	if ($argv[1] == "quizreminders") {
		set_time_limit(0);
		//$querystring = "SELECT listentries.entryname, listentries.kind, quiz.qrelease, quiz.deadline 
		//								FROM listentries LEFT JOIN quiz ON  listentries.link = quiz.id";
		$querystring = "SELECT course.coursecode, course.coursename, course.cid, course.activeversion, listentries.entryname, quiz.qname, quiz.deadline, user_course.uid
										FROM course, listentries, quiz, user_course
										WHERE course.cid = listentries.cid
											AND course.activeversion = listentries.vers
											AND listentries.link = quiz.id
											AND user_course.cid = course.cid
											AND user_course.vers = course.activeversion
											AND quiz.deadline >= (:deadline + INTERVAL 1 DAY)
											AND quiz.deadline < (:deadline + INTERVAL 2 DAY)";
		$query = $pdo->prepare($querystring);
		$todaysDate = date("Y-m-d");
		$todaysDate = "2015-01-29"; // Test value
		$query->bindParam(':deadline', $todaysDate);
		if(!$query->execute()) {
			$error = $query->errorInfo();
			$debug = "Error finding duggas ".$error[2];
		} else {
			$rows = $query->fetchAll(PDO::FETCH_ASSOC);
			foreach($rows as $row) {
				echo "Send to user ".$row['uid'].": Deadline at ".$row['deadline']." for ".$row['entryname']." in course [".$row['coursecode']."] ".$row['coursename']."\n";
			}
		}
	} else {
		echo "No cronjob for ".$argv[1]."\n";
	}
} else {
	echo "Usage: php cronjob.php JOB\n";
	echo "JOB can be any of following:\n";
	echo "  quizreminders - This will send reminders about deadlines for quizes expiring next day\n";
}

?>