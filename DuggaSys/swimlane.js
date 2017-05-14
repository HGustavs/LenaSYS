var querystring = parseGet();
var swimlaneInformation;
var swimBox;
var courseId = querystring['courseid'];
var courseVers = querystring['coursevers'];

$("a.linkSwimlane").click(function(){ swimlaneSetup(); });

function swimlaneSetup() {
  console.log("swimlaneSetup");
  swimBox = document.getElementById('swimlaneOverlay');
  swimBox.style.display = "block";
  AJAXService("GET", { cid : courseId,vers : courseVers }, "SWIMLANE");
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
    circle.setAttribute("r", '15');
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
  var info = swimlaneInformation['information'];
  var moments = swimlaneInformation['moments']
  console.log("swimlaneDrawLanes");
  var str = "";
  str += "<div id='swimlanebox' class='swimlanebox'>";
  str += "<div id='weeks' style='position:absolute; background: white'>";
  // Course information.
  str += "<svg width='250' height='" + (70 + (70 * info['verslength'] ) ) + "'>";
  str += "<rect y='0' x='0' width='250' height='70' style='fill:rgb(97,73,116)' />";
  str += "<text y='20' x='8' font-weight='bold' fill='white'>" + info['coursecode'] + "</text>";
  str += "<text y='40' x='8' fill='white'>" + info['coursename'] + "</text>";
  str += "<text y='60' x='8' fill='white'>Version: " + courseVers + "</text>";
  
  // Add right amount of weeks to left column.
  var markRow = false;
  for (var i = 1; i <= info['verslength']; i++) {
    if (markRow){
      str += "<rect x='0' y='" + (i * 70) + "' width='250' height='70' fill-opacity='0.3' style='fill:rgb(146,125,156)' />";
      markRow = false;
    } else {
      str += "<rect x='0' y='" + (i * 70) + "' width='250' height='70' style='fill:rgb(255,255,255)' />";
      markRow = true;
    }
    str += "<text x='95' y='" + (40 + (i * 70)) + "' font-weight='bold' fill='black'>Week " + i + "</text>";
  }
  str += "</svg>";
  str += "</div>";

  str += "<div id='duggas' style='background: white'>";

  // Total svg size + add heading.
  str += "<svg width='" + (200 * (info['numberofparts']  + 1) + 50) + "' height='" + (70 + (70 * info['verslength'])) + "'>';";
  str += "<rect y='0' x='0' width='" + (200 * (info['numberofparts'] + 1) + 50) + "' height='70' style='fill:rgb(146,124,157)' />";
  
  // Add all columns (parts) and duggas inside these
  var white = true;
  var j = 0;
  var k = 0;
  var pos = 250;
  var oldWeek = 0;
  var id = 0;
  var duggaInfoArray = array();
  var hasCoursePart = false;
  for(i = 0; i < moments.length; i++) {
    var moment = moments[i];
    if (moment['kind'] === 4) {
      hasCoursePart = true;
      k = 0;";
      pos = ((j * 200) + 250);
      str += "<text y='50' x='" + (pos + 10) + "' font-weight='bold' fill='white'>" + moment['entryname'] + "</text>";
      str += "<rect y='70' x='" + pos + "' width='200' height='" + (70 * info['verslength']) + "' style='fill:rgb(";
      if (white) {
        str += '250,250,250';
        white = false;
      } else {
        str += '230,230,230';
        white = true;
      }
      str += ")' />";
      str += j++;

      markRow = false;
      for (var iter = 1; iter <= info['verslength']; iter++) {
        if (markRow) {
          str += "<rect x='" + (pos) + "' y='" + (iter * 70) + "' width='200' height='70' fill-opacity='0.1' style='fill:rgb(146,125,156);' />";
          markRow = false;
        } else {
          markRow = true;
        }
      }
    } else if (moment['kind'] === 3) {
      array_push(duggaInfoArray, ("<b>" + swimlaneInformation['moments'][i]['entryname'] + "</b><br> Release date: " + startString + "<br> Deadline: ";
      deadlineString));";
      str += "<line x1='" + (pos + j + 10) + "' y1='" + (100 + (startweek - 1) * 70) + "' x2='" + (pos + j + 30) + "' y2='" + (100 + (startweek - 1) * 70) + "' style='stroke:rgb(83,166,84);stroke-width:3' />";
      str += "<line x1='" + (pos + j + 20) + "' y1='" + (100 + (startweek - 1) * 70) + "' x2='" + (pos + j + 20) + "' y2='" + (100 + (deadlineweek - 1) * 70) + "' style='stroke:rgb(83,166,84);stroke-width:3' />";
      str += "<circle id='" + id + "' onmouseover='mouseOverCircle(this,\"" + duggaInfoArray[id++] + "\")' onmouseout='mouseGoneFromCircle(this)' cx='" + (pos + j + 20) + "' cy='" + (100 + (deadlineweek - 1) * 70) + "' r='10' stroke='rgb(83,166,84)' stroke-width='3' fill='rgb(253,203,96)' />";
      k += 25;
      oldWeek = deadlineweek;
    }
  }
    // End of add columns and duggas

    // Add the line for current week.
    thisDate = new DateTime(date('Y/m/d'));
    thisWeek = thisDate->format('W');
    str += "<line stroke-dasharray='5,5' x1='250' y1='" + (100 + (thisWeek - versStartWeek) * 70) + "' x2='" + ((numberOfParts * 200) + 250) + "' y2='" + (100 + (thisWeek - versStartWeek) * 70) + "' style='stroke:rgb(203,63,65);stroke-width:2' />";
    str += "<line onmouseover='mouseOverLine(\"Current date:<br>" + $thisDate->format('jS F') + "\")' onmouseout='mouseGoneFromLine()' x1='250' y1='" + (100 + (thisWeek - versStartWeek) * 70) + "' x2='" + ((numberOfParts * 200) + 250) + "' y2='" + (100 + (thisWeek - versStartWeek) * 70) + "' style='stroke:rgb(0,0,0); stroke-width:10; stroke-opacity:0' />";
  }

  str += "</svg>";
  str += "</div>";
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