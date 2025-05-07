<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

pdoConnect(); // Connect to database and start session
session_start();

if(isset($_SESSION['uid'])){
	$userid = $_SESSION['uid'];
	$loginname = $_SESSION['loginname'];
	$lastname = $_SESSION['lastname'];
	$firstname = $_SESSION['firstname'];
}else{
	$userid = "guest";		
}

$opt = getOP('opt');
$courseid = getOP('courseid');
$coursevers = getOP('coursevers');
$duggaid = getOP('did');
$moment = getOP('moment');
$segment = getOP('segment');
$answer = getOP('answer');
$highscoremode = getOP('highscoremode');
$hash = getOP('hash');
$hashpwd = getOP('password');
$variantvalue = getOP('variant');
$password = $hashpwd;
$AUtoken = getOP('AUtoken');
$log_uuid = getOP('log_uuid');

$debug = "NONE!";
$score = 0;
$grade = "UNK";
$submitted = "";
$marked = "";
$group = "UNK";
$duggainfo = ['deadline' => "UNK", 'qrelease' => "UNK"];
$userfeedback = "UNK";
$feedbackquestion = "UNK";
$savedvariant = "UNK";
$ishashindb = false;
$variantsize = "UNK";
$variantvalue = "UNK";
$hashvariant = "UNK";
$isFileSubmitted = "UNK";
$variants = [];
$active = [];
$files = [];

if ($courseid !== "UNK" && $coursevers !== "UNK" && $duggaid !== "UNK" && $moment !== "UNK") {
	if ((isset($_POST["submission-$courseid-$coursevers-$duggaid-$moment"]) && 
		isset($_POST["submission-password-$courseid-$coursevers-$duggaid-$moment"]) && 
		isset($_POST["submission-variant-$courseid-$coursevers-$duggaid-$moment"]))) {

		$hash = $_POST["submission-$courseid-$coursevers-$duggaid-$moment"];
		$hashpwd = $_POST["submission-password-$courseid-$coursevers-$duggaid-$moment"];
		$variant = $_POST["submission-variant-$courseid-$coursevers-$duggaid-$moment"];
	} else {
		$hash = $_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"];
		$hashpwd = $_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"];
		$variant = $_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"];
	}
} else {
	$debug = "Could not find the requested dugga!";
}

logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "saveDugga_ms.php", $userid, "opt=$opt, courseid=$courseid, duggaid=$duggaid, moment=$moment");

if (strcmp($opt, "SAVDU") == 0) {
	makeLogEntry($userid, 2, $pdo, "$courseid $coursevers $duggaid $moment $answer");

	if (!isSuperUser($userid) &&
		isset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]) &&
		isset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"])) {

		$query = $pdo->prepare("SELECT password, grade FROM userAnswer WHERE hash=:hash;");
		$query->bindParam(':hash', $hash);
		$query->execute();
		$row = $query->fetch();

		if (isset($row['grade']) && $row['grade'] > 1) {
			$debug = "You have already passed this dugga. You are not required/allowed to submit anything new.";
		} elseif (isset($row['password']) && strcmp($hashpwd, $row['password']) === 0) {
			$query = $pdo->prepare("UPDATE userAnswer SET submitted=NOW(), useranswer=:useranswer, timesSubmitted=timesSubmitted+1 WHERE hash=:hash AND password=:hashpwd;");
			$query->bindParam(':hash', $hash);
			$query->bindParam(':hashpwd', $hashpwd);
			$query->bindParam(':useranswer', $answer);
			if (!$query->execute()) {
				$error = $query->errorInfo();
				$debug = "Error updating variant. Error code: " . $error[2];
			}
		} elseif (isset($row['password']) && strcmp($hashpwd, $row['password']) !== 0) {
			$debug = "The hash/password combination is not valid.";
		} else {
			$query = $pdo->prepare("INSERT INTO userAnswer(cid, quiz, moment, vers, variant, hash, password, timesSubmitted, timesAccessed, useranswer, submitted)
									VALUES(:cid, :did, :moment, :coursevers, :variant, :hash, :password, 1, 1, :useranswer, NOW());");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':coursevers', $coursevers);
			$query->bindParam(':did', $duggaid);
			$query->bindParam(':moment', $moment);
			$query->bindParam(':variant', $variant);
			$query->bindParam(':hash', $hash);
			$query->bindParam(':password', $hashpwd);
			$query->bindParam(':useranswer', $answer);
			if (!$query->execute()) {
				$error = $query->errorInfo();
				$debug = "Error inserting variant. Error: " . $error[2];
			}
		}
	} else {
		$debug = "Unable to save dugga!";
	}
}

// === Microservice call to retrieveShowDuggaService_ms.php ===
$baseURL = "http://" . $_SERVER['HTTP_HOST'];
$url = $baseURL . "/LenaSYS/DuggaSys/microservices/showDuggaService/retrieveShowDuggaService_ms.php";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
	'moment' => $moment,
	'courseid' => $courseid,
	'hash' => $hash,
	'hashpwd' => $hashpwd,
	'coursevers' => $coursevers,
	'duggaid' => $duggaid,
	'opt' => $opt,
	'group' => $group,
	'score' => $score,
	'highscoremode' => $highscoremode,
	'grade' => $grade,
	'submitted' => $submitted,
	'duggainfo' => json_encode($duggainfo),
	'marked' => $marked,
	'userfeedback' => json_encode($userfeedback),
	'feedbackquestion' => $feedbackquestion,
	'files' => json_encode($files),
	'savedvariant' => $savedvariant,
	'ishashindb' => $ishashindb,
	'variantsize' => $variantsize,
	'variantvalue' => $variantvalue,
	'password' => $password,
	'hashvariant' => $hashvariant,
	'isFileSubmitted' => $isFileSubmitted,
	'variants' => json_encode($variants),
	'active' => json_encode($active),
	'debug' => $debug
]));

$response = curl_exec($ch);
curl_close($ch);

// Output the JSON
header("Content-Type: application/json");
echo $response;
