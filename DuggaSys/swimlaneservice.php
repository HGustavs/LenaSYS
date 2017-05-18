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

// Parametres from AJAX
$opt = getOP('opt');
$course = getOP('courseid');
$vers = getOP('coursevers');

/* If uncommented, this will be default values if there are no valid input to the service
  if ($opt == "UNK") $opt = "olle";
  if ($course == "UNK") $course = 2;
  if ($vers == "UNK") $vers = 97732;
*/
if (isset($_SESSION['uid'])) {
  $userid = $_SESSION['uid'];
} else {
  $userid = "UNK";
}
$debug = "NONE!";

$log_uuid = getOP('log_uuid');
$info = $opt . " " . $course . " " . $vers;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "swimlaneservice.php", $userid, $info);

//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------

if ($course != "UNK" && $vers != "UNK") {
  $information = array();
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
  $information['numberofparts'] = $numberOfParts;

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
    $versStart = new DateTime($row['startdate']);
    $versEnd = new DateTime($row['enddate']);
  }

// Get start and end to week number and calculate length in weeks.
  $information['versstartweek'] = intval($versStart->format("W"));
  $information['versendweek'] = intval($versEnd->format("W"));
  $information['verslength'] = intval($information['versendweek']) - intval($information['versstartweek']) + 1;
  $thisDate = new DateTime(date('Y/m/d'));
  $information['thisweek'] = intval($thisDate->format('W'));
  $information['thisdate'] = $thisDate->format('jS F');

  $moments = array();
// Get parts and duggas.
  $querystring = "SELECT listentries.entryname, listentries.kind, quiz.qrelease, quiz.deadline FROM listentries LEFT JOIN quiz ON  listentries.link = quiz.id WHERE listentries.cid = :cid AND listentries.vers = :vers;";
  $stmt = $pdo->prepare($querystring);
  $stmt->bindParam(':cid', $course);
  $stmt->bindParam(':vers', $vers);

  try {
    $stmt->execute();
  } catch (PDOException $e) {
    // Error handling to $debug
  }

  foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
    if ($row['kind'] == 3) {
      $sqlDeadline = $row['deadline'];
      $sqlQrelease = $row['qrelease'];

      $deadlinedate = new DateTime($sqlDeadline);
      $startdate = new DateTime($sqlQrelease);
      $deadlineweek = $deadlinedate->format('W') - $information['versstartweek'] + 1;
      $startweek = $startdate->format('W') - $information['versstartweek'] + 1;

      $tempDateArray = explode(' ', $sqlQrelease);
      if ($tempDateArray[1] == '00:00:00') {
        $sqlQrelease = $tempDateArray[0];
      }
      $tempDateArray = explode(' ', $sqlDeadline);
      if ($tempDateArray[1] == '00:00:00') {
        $sqlDeadline = $tempDateArray[0];
      }

      $moments[] = array(
        'kind' => $row['kind'],
        'entryname' => $row['entryname'],
        'deadline' => $sqlDeadline,
        'qrelease' => $sqlQrelease,
        'startweek' => $startweek,
        'deadlineweek' => $deadlineweek
      );
    } else if ($row['kind'] == 4) {
      $moments[] = array(
        'kind' => $row['kind'],
        'entryname' => $row['entryname']
      );
    }
  }
  $returnMe = array(
    'information' => $information,
    'moments' => $moments,
    'returnvalue' => true
  );
} else { // Return some faulty information if there are no valid input
  $returnMe = array(
    'information' => "Input-data: courseid: " . $course . "courseid: " . $vers,
    'moments' => "",
    'returnvalue' => false
  );
}

echo json_encode($returnMe);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "swimlaneservice.php", $userid, $info);

?>