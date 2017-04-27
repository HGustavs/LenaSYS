<!-- PHP to set up variables and connect to database -->
<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

pdoConnect();
session_start();

$course = $_GET["courseid"];
$vers = $_GET["coursevers"];

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
  $coursecode = $row['coursecode'];
  $coursename = $row['coursename'];
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
$versStartWeek = $versStart->format("W");
$versEndWeek = $versEnd->format("W");

$versLength = $versEndWeek - $versStartWeek + 1;

?>

<!-- Swimlane Box Start! -->
<div id="swimlanebox" class="swimlanebox">
    <div id="weeks" style="position:absolute; background: white">
      <?php
      // Course information.
      echo '<svg width="250" height="' . (70 + (70 * $versLength)) . '">';
      echo '<rect y="0" x="0" width="250" height="70" style="fill:rgb(97,73,116)" />';
      echo '<text y="15" x="8" fill="white">' . $coursecode . '</text>';
      echo '<text y="35" x="8" fill="white">' . $coursename . '</text>';
      echo '<text y="55" x="8" fill="white">Version: ' . $vers . '</text>';

      // Add right amount of weeks to left column.
      for ($i = 1; $i <= $versLength; $i++) {
        echo '<rect x="0" y="' . ($i * 70) . '" width="250" height="70" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(0,0,0)" />';
        echo '<text x="95" y="' . (40 + ($i * 70)) . '" fill="black">Week ' . $i . '</text>';
      }
      ?>
        </svg>
    </div>
    <div id="duggas" style="background: white">
  <?php if (isset($_GET["courseid"]) && isset($_GET["coursevers"])) {
    // Total svg size + add heading.
    echo '<svg width="' . (200 * ($numberOfParts + 1) + 50) . '" height="' . (70 + (70 * $versLength)) . '">';
    echo '<rect y="0" x="0" width="' . (200 * ($numberOfParts + 1) + 50) . '" height="70" style="fill:rgb(146,124,157)" />';

    // Get parts and duggas.
    $querystring = "SELECT listentries.entryname, listentries.kind, quiz.qrelease, quiz.deadline 
                        FROM listentries LEFT JOIN quiz ON  listentries.link = quiz.id WHERE listentries.cid = :cid AND listentries.vers = :vers;";
    $stmt = $pdo->prepare($querystring);
    $stmt->bindParam(':cid', $course);
    $stmt->bindParam(':vers', $_GET["coursevers"]);

    try {
      $stmt->execute();
    } catch (PDOException $e) {
      // Error handling to $debug
    }

    /* Add all columns (parts) and duggas inside these */
    $white = true;
    $i = 0;
    $j = 0;
    $pos = 250;
    $oldWeek = 0;
    $id = 0;
    $duggaInfoArray = array();
    $hasCoursePart = false;
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
      if ($row['kind'] == 4) {
        $hasCoursePart = true;
        $j = 0;
        $pos = (($i * 200) + 250);
        echo '<text y="50" x="' . ($pos + 10) . '" fill="white">' . $row['entryname'] . '</text>';
        echo '<rect y="70" x="' . $pos . '" width="200" height="' . (70 * $versLength) . '" style="fill:rgb(';
        if ($white) {
          echo '250,250,250';
          $white = false;
        } else {
          echo '230,230,230';
          $white = true;
        }
        echo ')" />';
        $i++;
      } else if ($row['kind'] == 3) {
        $deadlineString = $row['deadline'];
        $startString = $row['qrelease'];

        $deadlinedate = new DateTime($deadlineString);
        $startdate = new DateTime($startString);
        $deadlineweek = $deadlinedate->format("W") - $versStartWeek + 1;
        $startweek = $startdate->format("W") - $versStartWeek + 1;
        if ($j == 0) {
          $oldWeek = $deadlineweek;
        }
        if (!$hasCoursePart) {
          echo '<text y="50" x="' . ($pos + 10) . '" fill="white">No course part</text>';
        }

        $tempDateArray = explode(" ", $startString);
        if ($tempDateArray[1] == '00:00:00') {
            $startString = $tempDateArray[0];
        }
        $tempDateArray = explode(" ", $deadlineString);
        if ($tempDateArray[1] == '00:00:00') {
          $deadlineString = $tempDateArray[0];
        }

        array_push($duggaInfoArray, ("<b>" . $row['entryname'] . "</b><br> Release date: " . $startString . "<br> Deadline: " .
          $deadlineString));
        echo '<line x1="' . ($pos + $j + 10) . '" y1="' . (100 + ($startweek - 1) * 70) .
          '" x2="' . ($pos + $j + 30) .
          '" y2="' . (100 + ($startweek - 1) * 70) .
          '" style="stroke:rgb(83,166,84);stroke-width:2" />';
        echo '<line x1="' . ($pos + $j + 20) . '" y1="' . (100 + ($startweek - 1) * 70) .
          '" x2="' . ($pos + $j + 20) .
          '" y2="' . (100 + ($deadlineweek - 1) * 70) . '" style="stroke:rgb(83,166,84);stroke-width:2" />';
        echo '<circle id="' . $id . '" onmouseover="mouseOverCircle(this,\'' . $duggaInfoArray[$id++] . '\')" onmouseout="mouseGoneFromCircle(this)" cx="' .
          ($pos + $j + 20) . '" cy="' . (100 + ($deadlineweek - 1) * 70) .
          '" r="10" stroke="rgb(83,166,84)" stroke-width="2" fill="rgb(253,203,96)" />';
        $j += 25;
        $oldWeek = $deadlineweek;

      }
    }
    /* End of add columns and duggas */

    // Add the line for current week.
    $thisDate = new DateTime(date("Y/m/d"));
    $thisWeek = $thisDate->format("W");

    echo '<line stroke-dasharray="5,5" x1="250" y1="' .
      (100 + ($thisWeek - $versStartWeek) * 70) .
      '" x2="' . (($numberOfParts * 200) + 250) .
      '" y2="' . (100 + ($thisWeek - $versStartWeek) * 70) .
      '" style="stroke:rgb(203,63,65);stroke-width:2" />';

    echo '<line onmouseover="mouseOverLine(\'Current date:<br>' . $thisDate->format("jS F") .
      '\')" onmouseout="mouseGoneFromLine()"' .
      ' x1="250" y1="' .
      (100 + ($thisWeek - $versStartWeek) * 70) .
      '" x2="' . (($numberOfParts * 200) + 250) .
      '" y2="' . (100 + ($thisWeek - $versStartWeek) * 70) .
      '" style="stroke:rgb(0,0,0);stroke-width:10;stroke-opacity:0" />';
  }
  ?>

    </svg>
    </div>
</div>

<!-- Box for dugga info on mouse over -->
<div id="duggainfo" class="duggainfo"
     style="display:none; position:absolute; background-color:white; border-style:solid; border-color:#3C3C3C; padding:5px">
    <span id="duggaInfoText"></span>
</div>

<!-- Box for current date info -->
<div id="currentDate" class="currentDate"
     style="display:none; position:absolute; background-color:white; border-style:solid; border-width:1px; border-color:red; padding:5px">
    <span id="currentDateText"></span>
</div>