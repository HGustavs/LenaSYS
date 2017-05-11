<?php
//-----------------------------------------------------
// Swimlaneservice - Reads data for the Swimlane
//-----------------------------------------------------
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";

pdoConnect();
session_start();

$opt=getOP('opt');
$course=getOP('courseid');
$vers=getOP('coursevers');

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="UNK";
}
$debug="NONE!";

$log_uuid = getOP('log_uuid');
$info=$opt." ".$course." ".$vers;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "swimlaneservice.php",$userid,$info);

//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------

$information=array();
// Get current course.
$querystring = "SELECT coursecode, coursename FROM course WHERE cid=:cid";
$stmt = $pdo->prepare($querystring);
$stmt->bindParam(':cid', $course);
try {
  $stmt->execute();
} catch (PDOException $e) {
  // Error handling to $debug
}
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
  $information['coursecode'] = $row['coursecode'];
  $information['coursename'] = $row['coursename'];
}

// Get amount of course parts.
$querystring = "SELECT kind FROM listentries WHERE (kind=4 OR kind=3) AND cid=:cid AND vers=:vers";
$stmt = $pdo->prepare($querystring);
$stmt->bindParam(':cid', $course);
$stmt->bindParam(':vers', $vers);
try {
  $stmt->execute();
} catch (PDOException $e) {
  // Error handling to $debug
}

$numberOfParts = 0;
$hasDuggas = false;
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
  if ($row['kind'] == 4) {
      $numberOfParts++;
  } else if ($row['kind'] == 3) {
      $hasDuggas = true;
  }
}
if ($numberOfParts == 0 && $hasDuggas) {
    $numberOfParts = 1;
}
information['numberofparts'] = $numberOfParts;

// Get start and end of course.
$querystring = "SELECT startdate, enddate FROM vers WHERE vers = :vers;";
$stmt = $pdo->prepare($querystring);
$stmt->bindParam(':vers', $vers);
try {
  $stmt->execute();
} catch (PDOException $e) {
  // Error handling to $debug
}
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
  $information['versstart'] = new DateTime($row['startdate']),
  $information['versend'] = new DateTime($row['enddate'])
}

// Get start and end to week number and calculate length in weeks.
$information['versstartweek'] = $information['versstart']->format("W");
$information['versendweek'] = $information['versend']->format("W");

$information['verslength'] = $versEndWeek - $versStartWeek + 1;

$moments = array();
// Get parts and duggas.
$querystring = "SELECT listentries.entryname, listentries.kind, quiz.qrelease, quiz.deadline 
                    FROM listentries LEFT JOIN quiz ON  listentries.link = quiz.id WHERE listentries.cid = :cid AND listentries.vers = :vers;";
$stmt = $pdo->prepare($querystring);
$stmt->bindParam(':cid', $course);
$stmt->bindParam(':vers', $vers]);

try {
  $stmt->execute();
} catch (PDOException $e) {
  // Error handling to $debug
}

foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
  if($row['kind'] == 3) {
    $moments[] = array(
      'entryname' => $row['entryname'],
      'deadline' => $row['deadline'],
      'qrelease' => $row['qrelease']
    )
  } else if($row['kind'] == 4) {
    $moments[] = array(
      'entryname' => $row['entryname']
    )
  }
}
$returnMe = array(
	'information' => $information,
	'moments' => $moments
);

echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "swimlaneservice.php",$userid,$info);

?>