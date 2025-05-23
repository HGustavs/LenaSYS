<?php
//------------------------------------------------
// createDugga_ms.php - Used for creating a dugga.
//------------------------------------------------

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";
include_once "./retrieveDuggaedService_ms.php";

date_default_timezone_set("Europe/Stockholm");

pdoConnect();
session_start();

$opt = getOP('opt');
$cid = getOP('cid');
$coursevers = getOP('coursevers');
$name = getOP('nme');
$autograde = getOP('autograde');
$gradesys = getOP('gradesys');
$template = getOP('template');
$jsondeadline = getOP('jsondeadline');
$deadline = getOP('deadline');
$qstart = getOP('qstart');
$release = getOP('release');
$log_uuid = getOP('log__uuid');
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");
$debug = "NONE!";

if (!(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid) || hasAccess($userid, $cid, 'st')))) {
  $debug = "Access not granted";
  $retrievedData = retrieveDuggaedService($pdo, $debug, $userid, $cid, $coursevers, $log_uuid);
  echo json_encode($retrievedData);
  return;
}

if (strcmp($opt, "SAVDUGGA") !== 0) {
  $debug = "OPT does not match";
  $retrievedData = retrieveDuggaedService($pdo, $debug, $userid, $cid, $coursevers, $log_uuid);
  echo json_encode($retrievedData);
  return;
}

$query = $pdo->prepare("INSERT INTO quiz(cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, creator, vers, qstart, jsondeadline, `group`) VALUES (:cid, :autograde, :gradesys, :qname, :template, :release, :deadline, :uid, :coursevers, :qstart, :jsondeadline, :group)");

$query->bindParam(':cid', $cid);
$query->bindParam(':autograde', $autograde);
$query->bindParam(':gradesys', $gradesys);
$query->bindParam(':qname', $name);
$query->bindParam(':template', $template);
$query->bindParam(':uid', $userid);
$query->bindParam(':coursevers', $coursevers);
$query->bindParam(':jsondeadline', $jsondeadline);

// These need to be set this way for test.php to work correctly
if (strrpos("UNK", $release) !== false)
  $release = null;

if (strrpos("UNK", $deadline) !== false)
  $deadline = null;

if (strrpos("UNK", $qstart) !== false)
  $qstart = null;

$query->bindParam(':release', $release);
$query->bindParam(':deadline', $deadline);
$query->bindParam(':qstart', $qstart);

// Check if it is a group assignment
if (strcmp($template, "group-assignment") == 0) {
  $query->bindValue(':group', 1, PDO::PARAM_INT);
} else {
  $query->bindValue(':group', 0, PDO::PARAM_INT);
}

if (!$query->execute()) {
  $error = $query->errorInfo();
  $debug .= "Error updating dugga " . $error[2];
}

$retrievedData = retrieveDuggaedService($pdo, $debug, $userid, $cid, $coursevers, $log_uuid);
echo json_encode($retrievedData);
