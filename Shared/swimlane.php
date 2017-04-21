<!-- Overlay -->
<script src="js/jquery-1.11.0.min.js"></script>
<?php
    date_default_timezone_set("Europe/Stockholm");

    // Include basic application services!
    include_once "../Shared/sessions.php";
    include_once "../Shared/basic.php";

    pdoConnect();
    session_start();

    $course = $_GET["courseid"];
    $vers = $_GET["coursevers"];

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

    $querystring = "SELECT count(*) FROM listentries WHERE kind=4 AND cid=:cid AND vers=:vers";
    $stmt = $pdo->prepare($querystring);
    $stmt->bindParam(':cid',$course);
    $stmt->bindParam(':vers',$vers);

    try {
        $stmt->execute();
    } catch (PDOException $e) {
        // Error handling to $debug
    }

    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $numberOfParts = $row['count(*)'];
    }

    $querystring = "SELECT startdate, enddate FROM vers WHERE vers = :vers;";
    $stmt = $pdo->prepare($querystring);
    $stmt->bindParam(':vers',$vers);

    try {
        $stmt->execute();
    } catch (PDOException $e) {
        // Error handling to $debug
    }

    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $versStart = new DateTime($row['startdate']);
        $versEnd = new DateTime($row['enddate']);
    }

    $versStartWeek = $versStart->format("W");
    $versEndWeek = $versEnd->format("W");

    $versLength = $versEndWeek - $versStartWeek + 1;

?>

  <div id="overlay" style="display:none"></div>
  
	<!-- Swimlane Box Start! -->

  <div id="swimlanebox" class="swimlanebox" style="display:block">
      <div id="weeks" style="left: 5px; position:absolute; background: white">
              <?php
                  echo '<svg width="200" height="' . (70 + (70 * $versLength)) . '">';
                  echo '<rect y="0" x="0" width="200" height="70" style="fill:rgb(97,73,116)" />';
                  echo '<text y="15" x="8" fill="white">' . $coursecode . '</text>';
                  echo '<text y="35" x="8" fill="white">' . $coursename . '</text>';
                  echo '<text y="55" x="8" fill="white">Version: ' . $vers . '</text>';

                  for ($i = 1; $i <= $versLength; $i++){
                      echo '<rect x="0" y="' . ($i * 70) . '" width="200" height="70" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(0,0,0)" />';
                      echo '<text x="70" y="' . (40 + ($i*70)) . '" fill="black">Week ' . $i . '</text>';
                  }
              ?>
          </svg>
      </div>
      <script>
          $(window).scroll(function(){
              $('#weeks').css({
                  'left': $(this).scrollLeft() + 5
              });
          });
      </script>
          <?php if (isset($_GET["courseid"]) && isset($_GET["coursevers"])) {
              echo '<svg width="' . (200 * ($numberOfParts + 1) + 100) . '" height="' . (70 + (70 * $versLength)) . '">';
              echo '<rect y="0" x="0" width="' . 200 * ($numberOfParts + 1) . '" height="70" style="fill:rgb(146,124,157)" />';


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

              $white = true;
              $i = 0;
              $j = 0;
              $pos = 0;
              $oldWeek = 0;
              foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
                  if ($row['kind'] == 4) {
                      $j = 0;
                      $pos = (($i * 200) + 200);
                      echo '<text y="50" x="' . $pos . '" fill="white">' . $row['entryname'] . '</text>';
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
                      $deadlinedate = new DateTime($row['deadline']);
                      $startdate = new DateTime($row['qrelease']);
                      $deadlineweek = $deadlinedate->format("W") - $versStartWeek + 1;
                      $startweek = $startdate->format("W") - $versStartWeek + 1;
                      if ($j == 0) {
                          $oldWeek = $deadlineweek;
                      }

                      echo '<line x1="' . ($pos + $j + 10) . '" y1="' . (100 + ($startweek - 1) * 70) .
                          '" x2="' . ($pos + $j + 30) .
                          '" y2="' . (100 + ($startweek - 1) * 70) .
                          '" style="stroke:rgb(15,126,18);stroke-width:2" />';
                      echo '<line x1="' . ($pos + $j + 20) . '" y1="' . (100 + ($startweek - 1) * 70) .
                          '" x2="' . ($pos + $j + 20) .
                          '" y2="' . (100 + ($deadlineweek - 1) * 70) . '" style="stroke:rgb(15,126,18);stroke-width:2" />';
                      echo '<circle cx="' . ($pos + $j + 20) . '" cy="' . (100 + ($deadlineweek - 1) * 70) .
                          '" r="10" stroke="green" stroke-width="2" fill="yellow" />';
                      echo '<text y="' . (130 + (($oldWeek == $deadlineweek) ? $j : 0) + ($deadlineweek - 1) * 70) .
                          '" x="' . ($pos + $j + 20) . '" fill="black">' . $row['entryname'] . '</text>';
                      $j += 25;
                      $oldWeek = $deadlineweek;

                  }
              }

              $thisDate = new DateTime(date("Y/m/d"));
              $thisWeek = $thisDate->format("W");

              echo '<line stroke-dasharray="5,5" x1="200" y1="' . (100 + ($thisWeek - $versStartWeek) * 70) .
                  '" x2="' . (($numberOfParts * 200) + 200) .
                  '" y2="' . (100 + ($thisWeek - $versStartWeek) * 70) .
                  '" style="stroke:rgb(255,0,0);stroke-width:2" />';
              echo '<text y="' . (105 + ($thisWeek - $versStartWeek) * 70) .
                  '" x="' . (200 * ($numberOfParts + 1)) . '" fill="red">' . $thisDate->format("jS F") . '</text>';

          }
          ?>

      </svg>
  
  
  </div>

