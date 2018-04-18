<?php
//is called swinlane beacause of a drowning symbolic(if deadline is missed).
//This was once shown by a swinlane icon buts is now replaced by a clock icon.
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

// Returns the number of weeks between two dates
function datediffInWeeks($date1, $date2)
{
    if($date1 > $date2) return datediffInWeeks($date2, $date1);
    $first = DateTime::createFromFormat('Y-m-d', $date1->format('Y-m-d'));
    $second = DateTime::createFromFormat('Y-m-d', $date2->format('Y-m-d'));
    return ceil($first->diff($second)->days/7);
}

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
  $querystring = "SELECT kind FROM listentries WHERE (kind=4 OR kind=3) AND cid=:cid AND vers=:vers AND visible=1";
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
//  $information['verslength'] = intval($information['versendweek']) - intval($information['versstartweek']) + 1;
  $information['verslength'] = datediffInWeeks($versStart,$versEnd);
  $thisDate = new DateTime(date('Y/m/d'));
  $information['thisweek'] = intval($thisDate->format('W'));
  $information['thisdate'] = $thisDate->format('jS F');
  $information['weekprog'] = datediffInWeeks($versStart,$thisDate);

  $moments = array();
// Get parts and duggas.
  $querystring;
  $querystring = "SELECT listentries.entryname, listentries.kind, quiz.qstart, quiz.deadline, quiz.id FROM listentries LEFT JOIN quiz ON  listentries.link = quiz.id WHERE listentries.cid=:cid AND listentries.vers=:vers AND listentries.visible=1 ORDER BY pos;";
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
      $sqlQrelease = $row['qstart'];

      if($sqlQrelease == null){
          $sqlQrelease=$information['versstartweek'];
          $startweek=$information['versstartweek'];
      } else {
          $startdate = new DateTime($sqlQrelease);
          $startweek = $startdate->format('W') - $information['versstartweek'] + 1;
          $tempDateArray = explode(' ', $sqlQrelease);
          if ($tempDateArray[1] == '00:00:00') {
            $sqlQrelease = $tempDateArray[0];
          }
      }
      if($sqlDeadline == null){
          $sqlDeadline=$information['versstartweek'];
          $deadlineweek=$information['versstartweek'];
      } else {
          $deadlinedate = new DateTime($sqlDeadline);
          $deadlineweek = $deadlinedate->format('W') - $information['versstartweek'] + 1;

          $tempDateArray = explode(' ', $sqlDeadline);
          if ($tempDateArray[1] == '00:00:00') {
            $sqlDeadline = $tempDateArray[0];
          }
      }

      $moments[] = array(
        'kind' => $row['kind'],
        'entryname' => $row['entryname'],
        'quizid' => $row['id'],
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
  $userAnswers = array();
  if($userid != "UNK") {
    $querystring = "SELECT grade, quiz, feedback FROM userAnswer WHERE cid=:cid AND vers=:vers AND uid=:uid AND useranswer IS NOT NULL;";
    $stmt = $pdo->prepare($querystring);
    $stmt->bindParam(':cid', $course);
    $stmt->bindParam(':vers', $vers);
    $stmt->bindParam(':uid', $userid);
    try {
      $stmt->execute();
    } catch (PDOException $e) {
      // Error handling to $debug
    }
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
      // Determine what color the lamp should be.
      $grade = $row['grade'];
      if($grade != null) {
        if($grade >= 2) {
          $grade = "green";
        } else if($grade == 1) {
          $grade = "yellow";
        } else {
          $grade = "red";
        }
      }
      $userAnswers[] = array(
        'grade' => $grade,
        'quizid' => $row['quiz'],
        'feedback' => $row['feedback']
      );
    }
  }
  $returnMe = array(
    'information' => $information,
    'moments' => $moments,
    'userresults' => $userAnswers,
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
