var querystring = parseGet();
var swimlaneInformation;
var swimBox;

$("a.linkSwimlane").click(function(){ swimlaneSetup(); });

function swimlaneSetup() {
  console.log("swimlaneSetup");
  swimBox = document.getElementById('swimlaneOverlay');
  swimBox.style.display = "block";
  AJAXService("GET", { cid : querystring['courseid'],vers : querystring['coursevers'] }, "SWIMLANE");
}

var circlePosX;
var circlePosY;
var mouseX;
var mouseY;

/* Get mouse position. */
$(document).mousemove(function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
});

/* Move left column with side scroll. */
$(window).scroll(function () {
    $('#weeks').css({
        'left': $(this).scrollLeft()
    });
});

function mouseOverCircle(circle, text) {
    circle.setAttribute("r", 15);
    circlePosY = parseInt(circle.getAttribute('cy')) - 70;
    circlePosX = parseInt(circle.getAttribute('cx')) + 20;
    document.getElementById("duggaInfoText").innerHTML = text;
    $('#duggainfo').css({'top': circlePosY, 'left': circlePosX}).fadeIn('fast');
}

function mouseGoneFromCircle(circle) {
    circle.setAttribute("r", 10);
    $('#duggainfo').fadeOut('fast');
}

function mouseOverLine(text) {
    document.getElementById("currentDateText").innerHTML = text;
    $('#currentDate').css({'top': mouseY, 'left': mouseX}).fadeIn('fast');
}

function mouseGoneFromLine() {
    $('#currentDate').fadeOut('fast');
}

var exitButton = document.getElementsByClassName("SwimClose")[0]; /* Get the button that opens the modal */

/* When the user clicks on <span> (x), close the modal */
exitButton.onclick = function() {
    swimBox.style.display = "none";
}

/* When the user clicks anywhere outside of the modal, close it */
window.onclick = function(event) {
    if (event.target == swimBox) {
        swimBox.style.display = "none";
    }
}

// -------------
// Renderer
// -------------
  
function swimlaneDrawLanes() {
  console.log("swimlaneDrawLanes");
  var str = "";
  str += "<div id='swimlanebox' class='swimlanebox'>";
  str += "<div id='weeks' style='position:absolute; background: white'>";
  // Course information.
  str += "<svg width='250' height='" + (70 + (70 * swimlaneInformation['verslength'] ) ) + "'>";
  str += "<rect y='0' x='0' width='250' height='70' style='fill:rgb(97,73,116)' />";
  str += "<text y='20' x='8' font-weight='bold' fill='white'>" + $coursecode + "</text>";
  str += "<text y='40' x='8' fill='white'>" + $coursename + "</text>";
  str += "<text y='60' x='8' fill='white'>Version: " + $vers + "</text>";
  
  // Add right amount of weeks to left column.
  str += "  $markRow = false;";
  str += "  for ($i = 1; $i <= $versLength; $i++) {";
  str += "    if ($markRow){";
  str += "      echo \"<rect x='0' y='\" . ($i * 70) . \"' width='250' height='70' fill-opacity='0.3' style='fill:rgb(146,125,156)' />\";";
  str += "      $markRow = false;";
  str += "    } else {";
  str += "      echo \"<rect x='0' y='\" . ($i * 70) . \"' width='250' height='70' style='fill:rgb(255,255,255)' />\";";
  str += "      $markRow = true;";
  str += "    }";
  str += "    echo \"<text x='95' y='\" . (40 + ($i * 70)) . \"' font-weight='bold' fill='black'>Week \" . $i . \"</text>\";";
  str += "  }";
  str += "?>";
  str += "</svg>";
  str += "</div>";
  str += "<div id='duggas' style='background: white'>";
  str += "<?php if (isset($_GET['courseid']) && isset($_GET['coursevers'])) {";
  // Total svg size + add heading.
  str += "  echo \"<svg width='\" . (200 * ($numberOfParts + 1) + 50) . \"' height='\" . (70 + (70 * $versLength)) . \"'>';\";";
  str += "  echo \"<rect y='0' x='0' width='\" . (200 * ($numberOfParts + 1) + 50) . \"' height='70' style='fill:rgb(146,124,157)' />\";";
  
  // Get parts and duggas.
  str += "  $querystring = 'SELECT listentries.entryname, listentries.kind, quiz.qrelease, quiz.deadline FROM listentries LEFT JOIN quiz ON  listentries.link = quiz.id WHERE listentries.cid = :cid AND listentries.vers = :vers;';"
  str += "  $stmt = $pdo->prepare($querystring);";
  str += "  $stmt->bindParam(':cid', $course);";
  str += "  $stmt->bindParam(':vers', $_GET['coursevers']);";
  
  str += "  try {";
  str += "    $stmt->execute();";
  str += "  } catch (PDOException $e) {";
  // Error handling to $debug
  str += "  }";
  
  // Add all columns (parts) and duggas inside these
  str += "  $white = true;";
  str += "  $i = 0;";
  str += "  $j = 0;";
  str += "  $pos = 250;";
  str += "  $oldWeek = 0;";
  str += "  $id = 0;";
  str += "  $duggaInfoArray = array();";
  str += "  $hasCoursePart = false;";
  str += "  foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {";
  str += "    if ($row['kind'] == 4) {";
  str += "      $hasCoursePart = true;";
  str += "      $j = 0;";
  str += "      $pos = (($i * 200) + 250);";
  str += "      echo \"<text y='50' x='\" . ($pos + 10) . \"' font-weight='bold' fill='white'>\" . $row['entryname'] . \"</text>';\";";
  str += "      echo \"<rect y='70' x=\"' . $pos . \"' width='200' height='\" . (70 * $versLength) . \"' style='fill:rgb(\";";
  str += "      if ($white) {";
  str += "        echo '250,250,250';";
  str += "        $white = false;";
  str += "      } else {";
  str += "        echo '230,230,230';";
  str += "        $white = true;";
  str += "      }";
  str += "      echo \")' />\";";
  str += "      $i++;";

  str += "        $markRow = false;";
  str += "        for ($iter = 1; $iter <= $versLength; $iter++) {";
  str += "          if ($markRow) {";
  str += "            echo \"<rect x='\" . ($pos) .";
  str += "              \"' y='\" . ($iter * 70) .";
  str += "              \"' width='200' height='70' fill-opacity='0.1' style='fill:rgb(146,125,156);'' />\";";
  str += "            $markRow = false;";
  str += "          } else {";
  str += "            $markRow = true;";
  str += "          }";
  str += "        }";
  str += "      } else if ($row['kind'] == 3) {";
  str += "        $deadlineString = $row['deadline'];";
  str += "        $startString = $row['qrelease'];";

  str += "        $deadlinedate = new DateTime($deadlineString);";
  str += "        $startdate = new DateTime($startString);";
  str += "        $deadlineweek = $deadlinedate->format('W') - $versStartWeek + 1;";
  str += "        $startweek = $startdate->format('W') - $versStartWeek + 1;";
  str += "        if ($j == 0) {";
  str += "          $oldWeek = $deadlineweek;";
  str += "        }";
  str += "        if (!$hasCoursePart) {";
  str += "          echo \"<text y='50' x='\" . ($pos + 10) . \"' fill='white'>No course part</text>\";";
  str += "        }";

  str += "        $tempDateArray = explode(' ', $startString);";
  str += "        if ($tempDateArray[1] == '00:00:00') {";
  str += "            $startString = $tempDateArray[0];";
  str += "        }";
  str += "        $tempDateArray = explode(' ', $deadlineString);";
  str += "        if ($tempDateArray[1] == '00:00:00') {";
  str += "          $deadlineString = $tempDateArray[0];";
  str += "        }";

  str += "        array_push($duggaInfoArray, ('<b>' . $row['entryname'] . '</b><br> Release date: ' . $startString . '<br> Deadline: ' .";
  str += "          $deadlineString));";
  str += "        echo \"<line x1='\" . ($pos + $j + 10) . \"' y1='\" . (100 + ($startweek - 1) * 70) .";
  str += "          \"' x2='\" . ($pos + $j + 30) .";
  str += "          \"' y2='\" . (100 + ($startweek - 1) * 70) .";
  str += "          \"' style='stroke:rgb(83,166,84);stroke-width:3' />\";";
  str += "        echo \"<line x1='\" . ($pos + $j + 20) . \"' y1='\" . (100 + ($startweek - 1) * 70) .";
  str += "          \"' x2='\" . ($pos + $j + 20) .";
  str += "          \"' y2='\" . (100 + ($deadlineweek - 1) * 70) . \"' style='stroke:rgb(83,166,84);stroke-width:3' />\";";
  str += "        echo \"<circle id='\" . $id . \"' onmouseover='mouseOverCircle(this,\'\" . $duggaInfoArray[$id++] . \"\')' onmouseout='mouseGoneFromCircle(this)' cx='\" .";
  str += "          ($pos + $j + 20) . \"' cy='\" . (100 + ($deadlineweek - 1) * 70) .";
  str += "          \"' r='10' stroke='rgb(83,166,84)' stroke-width='3' fill='rgb(253,203,96)' />\";";
  str += "        $j += 25;";
  str += "        $oldWeek = $deadlineweek;";

  str += "      }";
  str += "    }";
          // End of add columns and duggas

          // Add the line for current week.
  str += "    $thisDate = new DateTime(date('Y/m/d'));";
  str += "    $thisWeek = $thisDate->format('W');";
  str +=
  str += "    echo \"<line stroke-dasharray='5,5' x1='250' y1='\" . (100 + ($thisWeek - $versStartWeek) * 70) . \"' x2='\" . (($numberOfParts * 200) + 250) . \"' y2='\" . (100 + ($thisWeek - $versStartWeek) * 70) . \"' style='stroke:rgb(203,63,65);stroke-width:2' />\";";
  str +=
  str += "    echo \"<line onmouseover='mouseOverLine(\'Current date:<br>\" . $thisDate->format('jS F') . \"\')' onmouseout='mouseGoneFromLine()' x1='250' y1='\" . (100 + ($thisWeek - $versStartWeek) * 70) . \"' x2='\" . (($numberOfParts * 200) + 250) . \"' y2='\" . (100 + ($thisWeek - $versStartWeek) * 70) . \"' style='stroke:rgb(0,0,0);stroke-width:10;stroke-opacity:0' />\";";
  str += "  }";
*/
  str += "    </svg>";
  str += "    </div>";
  str += "</div>";

  str += "<!-- Box for dugga info on mouse over -->";
  str += "<div id='duggainfo' class='duggainfo' style='display:none; position:absolute; background-color:white; border-style:solid; border-color:#3C3C3C; padding:5px'>";
  str += "    <span id='duggaInfoText'></span>";
  str += "</div>";
  str +=
  str += "<!-- Box for current date info -->";
  str += "<div id='currentDate' class='currentDate' style='display:none; position:absolute; background-color:white; border-style:solid; border-width:1px; border-color:red; padding:5px'>";
  str += "    <span id='currentDateText'></span>";
  str += "</div>";
  swimBox.innerHTML=str;
}

function returnedSwimlane(swimlaneData) {
	swimlaneInformation = swimlaneData;
  console.log(swimlaneInformation);
	swimlaneDrawLanes();
}