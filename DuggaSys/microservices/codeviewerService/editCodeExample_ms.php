<?php

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
//include_once "./retrieveCodeviewerService_ms.php";

pdoConnect();
session_start();

$opt = getOP('opt');
$exampleId = getOP('exampleid');
$courseId = getOP('courseid');
$courseVersion = getOP('cvers');
$playlink = getOP('playlink');
$exampleName = getOP('examplename');
$sectionName = getOP('sectionname');
$beforeId = getOP('beforeid');
$afterId = getOP('afterid');
$debug = "NONE!";
$userid = getUid();

$query = $pdo->prepare("SELECT exampleid,sectionname,examplename,runlink,cid,cversion,beforeid,afterid,public FROM codeexample WHERE exampleid = :exampleid;");
$query->bindParam(':exampleid', $exampleId);
$query->execute();

while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
	$exampleId = $row['exampleid'];
	$exampleName = $row['examplename'];
	$courseId = $row['cid'];
	$cversion = $row['cversion'];
	$beforeId = $row['beforeid'];
	$afterId = $row['afterid'];
	$public = $row['public'];
	$sectionName = $row['sectionname'];
	$playlink = $row['runlink'];
}

if (strcmp('EDITEXAMPLE', $opt) === 0) {
	if (isset($_POST['playlink'])) {
		$playlink = $_POST['playlink'];
	}
	if (isset($_POST['examplename'])) {
		$exampleName = $_POST['examplename'];
	}
	if (isset($_POST['sectionname'])) {
		$sectionName = $_POST['sectionname'];
	}
	if (isset($_POST['beforeid'])) {
		$beforeId = $_POST['beforeid'];
	}
	if (isset($_POST['afterid'])) {
		$afterId = $_POST['afterid'];
	}

	// Change content of example
	$query = $pdo->prepare("UPDATE codeexample SET runlink = :playlink , examplename = :examplename, sectionname = :sectionname WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
	$query->bindParam(':playlink', $playlink);
	$query->bindParam(':examplename', $exampleName);
	$query->bindParam(':sectionname', $sectionName);
	$query->bindParam(':exampleid', $exampleId);
	$query->bindParam(':cid', $courseId);
	$query->bindParam(':cvers', $courseVersion);
	if (!$query->execute()) {
		$error = $query->errorInfo();
		$debug .= "Error updaring example: " . $error[2] . " " . __LINE__;
	}

	// TODO: Check for better way to get and set before/afterId
	if ($beforeId != "UNK") {
		$query = $pdo->prepare("UPDATE codeexample SET beforeid = :beforeid WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
		$query->bindParam(':beforeid', $beforeId);
		$query->bindParam(':exampleid', $exampleId);
		$query->bindParam(':cid', $courseId);
		$query->bindParam(':cvers', $courseVersion);
		if (!$query->execute()) {
			$error = $query->errorInfo();
			$debug .= "Error updaring example: " . $error[2] . " " . __LINE__;
		}
	}
	if ($afterId != "UNK") {
		$query = $pdo->prepare("UPDATE codeexample SET afterid = :afterid WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
		$query->bindParam(':afterid', $afterId);
		$query->bindParam(':exampleid', $exampleId);
		$query->bindParam(':cid', $courseId);
		$query->bindParam(':cvers', $courseVersion);
		if (!$query->execute()) {
			$error = $query->errorInfo();
			$debug .= "Error updaring example: " . $error[2] . " " . __LINE__;
		}
	}
	if (isset($_POST['addedWords'])) {
		// Converts to array
		$addedWords = explode(",", $_POST['addedWords']);

		// Loops through the array of added words and inserts them one by one.
		foreach ($addedWords as $word) {
			$query = $pdo->prepare("INSERT INTO impwordlist(exampleid,word,uid) VALUES (:exampleid,:word,:uid);");
			$query->bindParam(':exampleid', $exampleId);
			$query->bindParam(':word', $word);
			$query->bindParam(':uid', $userid);
			if (!$query->execute()) {
				$error = $query->errorInfo();
				$debug .= "Error updaring example: " . $error[2] . " " . __LINE__;
			}
		}
	}
	if (isset($_POST['removedWords'])) {
		// Converts to array
		$removedWords = explode(",", $_POST['removedWords']);

		// Loops through the array of removed words and deletes them one by one.
		foreach ($removedWords as $word) {
			$query = $pdo->prepare("DELETE FROM impwordlist WHERE word=:word AND exampleid=:exampleid;");
			$query->bindParam(':exampleid', $exampleId);
			$query->bindParam(':word', $word);
			if (!$query->execute()) {
				$error = $query->errorInfo();
				$debug .= "Error deleting impword: " . $error[2] . " " . __LINE__;
			}
		}
	}
}

//Re-engineer
$postData = [
    'opt' => $opt,
    'exampleid' => $exampleId,
    'courseid' => $courseId,
    'cvers' => $courseVersion
];

$response = callMicroservicePOST("codeviewerService/retrieveCodeviewerService_ms.php", $postData, true);
$link = json_decode($response, true);
echo json_encode($link);
return;
