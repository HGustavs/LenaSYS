//is called swinlane beacause of a drowning symbolic(if deadline is missed).
//This was once shown by a swinlane icon buts is now replaced by a clock icon.

var querystring = parseGet(); // Get the current courseid and coursevers
var courseId = querystring['courseid'];
var courseVers = querystring['coursevers'];
var swimlaneInformation; // The container for returnData
var swimBox; // This is the box that gets toggled (display: block/none)
var swimContent; // Here be the content of the swimlane

// Initialize swim-content, and fetching data from the database
function swimlaneSetup() {
  swimBox = document.getElementById('swimlaneOverlay');
  swimContent = document.getElementById('SwimContent');
  // Since the box is filled when clicking the swimmer icon, this is activated on initialization
  swimBox.style.display = "block";
  AJAXService("GET", {cid: courseId, vers: courseVers}, "SWIMLANE");
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

// Display information about the deadline when hoovering over the deadline circle
function mouseOverCircle(circle, text) {
  document.getElementById("duggaInfoText").innerHTML = text;
  var column = circle.parentNode.parentNode;
  circle.setAttribute("r", '13');
  circlePosY = column.offsetTop+parseInt(circle.getAttribute('cy')) - 70;
  if(column.parentNode.offsetWidth > (column.offsetLeft + (column.offsetWidth / 2) + parseInt(circle.getAttribute('cx')) + $('#duggainfo').width())) {
    circlePosX = column.offsetLeft+parseInt(circle.getAttribute('cx')) + column.offsetWidth / 2;
  } else {
    circlePosX = column.offsetLeft + (column.offsetWidth / 2) - (parseInt(circle.getAttribute('cx')) * 2) - $('#duggainfo').width();
  }
  $('#duggainfo').css({'top': circlePosY, 'left': circlePosX}).fadeIn('fast');
}

function mouseGoneFromCircle(circle) {
  circle.setAttribute("r", 10);
  $('#duggainfo').fadeOut('fast');
}

// Display the current date when hoovering over the line which represents the current date
function mouseOverLine(text) {
  document.getElementById("currentDateText").innerHTML = text;
  $('#currentDate').css({'top': mouseY, 'left': mouseX}).fadeIn('fast');
}

function mouseGoneFromLine() {
  $('#currentDate').fadeOut('fast');
}

// Get the button that opens the modal
var exitButton = document.getElementsByClassName("SwimClose")[0];

// When the user clicks on <span> (x), close the modal
exitButton.onclick = function () {
  swimBox.style.display = "none";
}

/* When the user clicks anywhere outside of the modal, close it */
window.onclick = function (event) {
  if (event.target == swimBox) {
    swimBox.style.display = "none";
  }
}

// -------------
// Renderer
// -------------

// This function prints the pie Chart in the swimlane that shows a brief overview
// over the student's quizes/tests.
function createPieChart() {
  var c = document.getElementById('pieChart');
  var ctx = c.getContext('2d');
  var width = c.width;
  var height = c.height;
  var pieChartRadius = height / 2;
  var overviewBlockSize = 11;

  var totalQuizes = 0;
  var passedQuizes = 0;
  var notGradedQuizes = 0;
  var failedQuizes = 0;
  var notSubmittedQuizes = 0;

  // Calculate total quizes.
  for(var i = 0; i < swimlaneInformation['moments'].length; i++) {
    if(swimlaneInformation['moments'][i].kind == "3") {
      totalQuizes++;
    }
  }

  // Calculate passed, failed and not graded quizes.
  for(var i = 0; i < swimlaneInformation['userresults'].length; i++) {
    if(swimlaneInformation['userresults'][i].grade == "green") {
      passedQuizes++;
    } else if(swimlaneInformation['userresults'][i].grade == "yellow") {
      failedQuizes++;
    }
    else {
      notGradedQuizes++;
    }
  }

  // Calculate non submitted quizes.
  notSubmittedQuizes = totalQuizes - (passedQuizes + failedQuizes + notGradedQuizes);

  // PCT = Percentage
  var passedPCT = 100 * (passedQuizes / totalQuizes);
  var notGradedPCT = 100 * (notGradedQuizes / totalQuizes);
  var failedPCT = 100 * (failedQuizes / totalQuizes);
  var notSubmittedPCT = 100 * (notSubmittedQuizes / totalQuizes);

  // Only use 2 decimal places and round up if necessary
  passedPCT = Math.round(passedPCT * 100) / 100;
  notGradedPCT = Math.round(notGradedPCT * 100) / 100;
  failedPCT = Math.round(failedPCT * 100) / 100;
  notSubmittedPCT = Math.round(notSubmittedPCT * 100) / 100;

  var lastend = -1.57; /* Chart start point. -1.57 is a quarter the number of
                          radians in a circle, i.e. start at 12 o'clock */
  var data = [passedQuizes, notGradedQuizes, failedQuizes, notSubmittedQuizes];
  var colors = {
    'passedQuizes': '#00E676',        // Green
    'notGradedQuizes': '#FFEB3B',     // Yellow
    'failedQuizes': '#E53935',        // Red
    'notSubmittedQuizes': '#BDBDBD'   // Grey
  }

  for (var i = 0; i < data.length; i++) {

    if(i == 0) {
      ctx.fillStyle = colors['passedQuizes'];
    } else if(i == 1) {
      ctx.fillStyle = colors['notGradedQuizes'];
    } else if(i == 2) {
      ctx.fillStyle = colors['failedQuizes'];
    } else {
      ctx.fillStyle = colors['notSubmittedQuizes'];
    }

    ctx.beginPath();
    ctx.moveTo(pieChartRadius, height / 2);

    // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
    ctx.arc(pieChartRadius, height / 2, height / 2, lastend,lastend
    + (Math.PI * 2 * (data[i] / totalQuizes)), false);

    //Parameter for lineTo: x,y
    ctx.lineTo(pieChartRadius, height / 2);
    ctx.fill();

    lastend += Math.PI * 2 * (data[i] / totalQuizes);
  }

  // Pie chart overview
  ctx.save();
  ctx.translate(pieChartRadius*2 + 20, 2);

  ctx.fillStyle = colors['passedQuizes'];
  ctx.fillRect(0, 0, overviewBlockSize, overviewBlockSize);

  ctx.fillStyle = colors['notGradedQuizes'];
  ctx.fillRect(0, 20, overviewBlockSize, overviewBlockSize);

  ctx.fillStyle = colors['failedQuizes'];
  ctx.fillRect(0, 40, overviewBlockSize, overviewBlockSize);

  ctx.fillStyle = colors['notSubmittedQuizes'];
  ctx.fillRect(0, 60, overviewBlockSize, overviewBlockSize);

  ctx.font = "12px Arial";
  ctx.fillStyle = "#000";

  ctx.translate(20, 10);
  ctx.fillText("Passed (" + passedPCT + "%)", 0, 0);
  ctx.fillText("Not Graded (" + notGradedPCT + "%)", 0, 20);
  ctx.fillText("Failed (" + failedPCT + "%)", 0, 40);
  ctx.fillText("Not Submitted (" + notSubmittedPCT + "%)", 0, 60);

  ctx.restore();
}

// Draw the content of the SwimContent container
function swimlaneDrawLanes() {
  var info = swimlaneInformation['information'];
  var moments = swimlaneInformation['moments'];
  var userResults = swimlaneInformation['userresults'];
  var bgcol="#EEE";
  var str = "";

  str+="<div id='swimlanebox' class='swimlanebox'>";

  /* The next div is a container div containing a description of the swim lanes
     and a pie chart giving an overview of course progress by a student. */
  str+="<div style='background-color:#FFF; height:100px;'>";
  str+="<canvas id='pieChart' width='250px' height='75px' style='padding:10px;'></canvas>"; // Contains pie chart.
  // str+="<div><p>Swim lane description</p></div>";
  str+="</div>";

  str+="<svg style='width:100%;height:100%;position:absolute;pointer-events:none;'>";
  str+="<line stroke-dasharray='5,5' x1='75' y1='" + (35 + info['weekprog'] * 70) + "' x2='" + (3000) + "' y2='" + (35 + info['weekprog'] * 70) + "' style='stroke:rgb(203,63,65); stroke-width:2;' />";
  str+="</svg>";
  str+="<table><thead><tr style='height:70px;background-color:#FFF'><th>&nbsp;</th>"

  var colspan=0;
  var count=false;
  var tmpname;

  for (var i=0; i<moments.length; i++) {
    var moment = moments[i];
    if (moment['kind']==4){
        if (bgcol=="#FFF"){
            bgcol="#EEE";
        } else {
            bgcol="#FFF";
        }
        if (count){
          str+=colspan+"'>"+tmpname+"</th>";
          str+="<th style='background-color:"+bgcol+";padding:0 5px 0 5px;' colspan='";
          colspan=0;
        } else {
          count=true;
          str+="<th style='background-color:"+bgcol+";padding:0 5px 0 5px;' colspan='";
        }
        tmpname=moment['entryname'];
    } else if (moment['kind']==3){
        colspan++;
    }
  }
  if(moments.length != 0) str+=colspan+"'>"+tmpname+"</th>";
  str+="</tr></thead><tbody><tr>";
  str+="<td><svg width='75' height='" + (70 * info['verslength'] ) + "'>";
  var id=0;
  var duggaInfoArray = [];
  var oddRow = false;
  for (var i = 0; i < info['verslength']; i++) {
      // each second row alternated color
      var weekColor;
      if (oddRow) {
        weekColor = "fill-opacity='1' style='fill:rgb(146,125,156)'";
      } else {
        weekColor = "style='fill:rgb(255,255,255)'";
      }
      oddRow = !oddRow;
      str += "<rect x='0' y='" + (i * 70) + "' width='75' height='70' " + weekColor + " />";
      str += "<text x='5' y='" + (40 + (i * 70)) + "' font-weight='bold' fill='black'>Week " + (i+1) + "</text>";
  }
  str += "</svg></td>";
  var bgcol="#EEE";
  for (var i=0; i<moments.length; i++) {
      var moment = moments[i];
      if (moment['kind']==4){
          if (bgcol=="#FFF"){
              bgcol="#EEE";
          } else {
              bgcol="#FFF"
          }
      }
      if (moment['kind']==3) {
        var hasGrade = false;
        var color;
        var feedback = null;
        for(var m = 0; m < userResults.length; m++) {
          if(moment['quizid'] === userResults[m]['quizid']) {
            var grade = userResults[m]['grade'];
            feedback = userResults[m]['feedback'];
            if(grade == "green") {
              color = "fill='rgb(0, 255, 0)'/>";
              hasGrade = true;
              break;
            } else if(grade == "yellow") { // Yellow appears to be failed
              color = "fill='rgb(255,0,0)'/>";
              hasGrade = true;
              break;
            } else {
              color = "fill='rgb(255,255,0)'/>";
              hasGrade = true;
              break;
            }
          }
        }
        if(!hasGrade) color = "fill='rgb(146,125,156)'/>";

        if(feedback) {
          var feedbackArr = feedback.split("||");
          feedback = '';
          if (feedbackArr.length > 0) {
            var lastFeedback = feedbackArr[feedbackArr.length - 1].split("%%");
            var date = lastFeedback[0];
            var tempFeedback = lastFeedback[1].replace(/^\s\n+|\s\n+$/g,'').replace(/(?:\r\n|\r|\n)/g, '<br/>').trim();
            var amountOfChars = 400;
            if(tempFeedback.length >= amountOfChars) tempFeedback = tempFeedback.substring(0, amountOfChars) + "...";
            feedback += date + ":<br> " + tempFeedback;
          }
        } else {
          feedback = 'No feedback was given.';
        }

        duggaInfoArray.push("<b>" + moment['entryname'] + "</b><br> Start date: " + moment['qrelease'] + "<br> Deadline: " + moment['deadline'] + "<br> <b>Feedback</b> <br>" + feedback);
        str+="<td style='text-align:center;background-color:"+bgcol+"'><svg style='margin:0 5px 0 5px;' width='30' height='"+(70 * info['verslength'] ) + "'>";
        // The ---- that marks the release of a dugga
        str+="<line x1='5' y1='" + (30 + (moment['startweek'] - 1) * 70) + "' x2='25' y2='" + (30 + (moment['startweek'] - 1) * 70) + "' style='stroke:rgb(83,166,84);stroke-width:3' />";
        // The | that marks the duration of a dugga
        str+="<line x1='15' y1='" + (30 + (moment['startweek'] - 1) * 70) + "' x2='15' y2='" + (30 + (moment['deadlineweek'] - 1) * 70) + "' style='stroke:rgb(83,166,84);stroke-width:3' />";
        // The O that marks the deadline of a dugga
        str+="<circle id='" + id + "' onmouseover='mouseOverCircle(this,\"" + duggaInfoArray[id++];
        str+="\")' onmouseout='mouseGoneFromCircle(this)' cx='15' cy='" + (30 + (moment['deadlineweek'] - 1) * 70);
        str+="' r='10' stroke='rgb(83,166,84)' stroke-width='3' " + color + "</svg></td>";
        //str+="<line onmouseover='mouseOverLine(\"Current date:<br>" + info['thisdate'] + "\")' onmouseout='mouseGoneFromLine()' x1='250' y1='" + (100 + (info['thisweek'] - info['versstartweek']) * 70) + "' x2='" + ((info['numberofparts'] * 30) + 30) + "' y2='" + (100 + (info['thisweek'] - info['versstartweek']) * 70) + "' style='stroke:rgb(0,0,0); stroke-width:10; stroke-opacity:0;' /></svg>";
      }
    }

    str+="</tbody></table></div>";

    // Box for dugga info on mouse over
    str += "<div id='duggainfo' class='duggainfo' style='display:none; position:absolute; background-color:white; border-style:solid; border-color:#3C3C3C; padding:5px; max-width: 350px;'>";
    str += "<span id='duggaInfoText'></span>";
    str += "</div>";
    // Box for current date info
    str += "<div id='currentDate' class='currentDate' style='display:none; position:absolute; background-color:white; border-style:solid; border-width:1px; border-color:red; padding:5px;'>";
    str += "<span id='currentDateText'></span>";
    str += "</div>";

  swimContent.innerHTML=str;
  createPieChart();
}
function swimlaneDrawLanes2() {
  var info = swimlaneInformation['information'];
  var moments = swimlaneInformation['moments'];
  var str = "";
  str += "<div id='swimlanebox' class='swimlanebox'>";
  str += "<div id='weeks' style='position:absolute; background: white;'>";
  // Course information
  str += "<svg width='250' height='" + (70 + (70 * info['verslength'] ) ) + "'>";
  str += "<rect y='0' x='0' width='250' height='70' style='fill:rgb(97,73,116)' />";
  str += "<text y='20' x='8' font-weight='bold' fill='white'>" + info['coursecode'] + "</text>";
  str += "<text y='40' x='8' fill='white'>" + info['coursename'] + "</text>";
  str += "<text y='60' x='8' fill='white'>Version: " + courseVers + "</text>";

  // The 'Week' column
  var oddRow = false;
  for (var i = 1; i <= info['verslength']; i++) {
    // each second row alternated color
    var weekColor;
    if (oddRow) {
      weekColor = "fill-opacity='0.3' style='fill:rgb(146,125,156)'";
    } else {
      weekColor = "style='fill:rgb(255,255,255)'";
    }
    oddRow = !oddRow;
    str += "<rect x='0' y='" + (i * 70) + "' width='250' height='70' " + weekColor + " />";
    str += "<text x='95' y='" + (40 + (i * 70)) + "' font-weight='bold' fill='black'>Week " + i + "</text>";
  }
  str += "</svg>";
  str += "</div>";

  str += "<div id='duggas' style='background: white'>";

  // Total svg size + add heading.
  str += "<svg width='" + (200 * (info['numberofparts'] + 1) + 50) + "' height='" + (70 + (70 * info['verslength'])) + "'>";
  str += "<rect y='0' x='0' width='" + (200 * (info['numberofparts'] + 1) + 50) + "' height='70' style='fill:rgb(146,124,157)' />";

  // Add all columns (parts) and duggas
  var oddColumn = true;
  var clearRow;
  var j = 0;
  var k = 0;
  var pos = 250;
  var oldWeek = 0;
  var id = 0;
  var duggaInfoArray = [];
  var hasCoursePart = false;
  // i = each moment
  for (i = 0; i < moments.length; i++) {
    var moment = moments[i];
      if (moment['kind'] == 4) { // It's a course part
      hasCoursePart = true;
      k = 0;
      pos = ((j * 200) + 250);
      str += "<text y='50' x='" + (pos + 10) + "' font-weight='bold' fill='white'>" + moment['entryname'] + "</text>";
      // Dim each second column
      var duggaColor;
      if (oddColumn) {
        duggaColor = "fill:rgb(250,250,250)";
      } else {
        duggaColor = "fill:rgb(230,230,230)";
      }
      oddColumn = !oddColumn;
      str += "<rect y='70' x='" + pos + "' width='200' height='" + (70 * info['verslength']) + "' style='" + duggaColor + "' />";
      j++;

      // Add more clear rows into the view
      clearRow = false;
      for (var l = 1; l <= info['verslength']; l++) {
        if (clearRow) {
          str += "<rect x='" + (pos) + "' y='" + (l * 70) + "' width='200' height='70' fill-opacity='0.1' style='fill:rgb(146,125,156);' />";
        }
        clearRow = !clearRow;
      }
    } else if (moment['kind'] == 3) { // It's a part of a course part(!)
      if (j == 0) {
        oldWeek = info['deadline'];
      }
      // If there are no course parts, just say so
      if (!hasCoursePart) {
        str += "<text y='50' x='" + (pos + 10) + "' fill='white'>No course part</text>";
      }

      // Dugga information
      duggaInfoArray.push("<b>" + moment['entryname'] + "</b><br> Start date: " + moment['qrelease'] + "<br> Deadline: " + moment['deadline']);
      // The ---- that marks the release of a dugga
      str += "<line x1='" + (pos + k + 10) + "' y1='" + (100 + (moment['startweek'] - 1) * 70) + "' x2='" + (pos + k + 30) + "' y2='" + (100 + (moment['startweek'] - 1) * 70) + "' style='stroke:rgb(83,166,84);stroke-width:3' />";
      // The | that marks the duration of a dugga
      str += "<line x1='" + (pos + k + 20) + "' y1='" + (100 + (moment['startweek'] - 1) * 70) + "' x2='" + (pos + k + 20) + "' y2='" + (100 + (moment['deadlineweek'] - 1) * 70) + "' style='stroke:rgb(83,166,84);stroke-width:3' />";
      // The O that marks the deadline of a dugga
      str += "<circle id='" + id + "' onmouseover='mouseOverCircle(this,\"" + duggaInfoArray[id++] + "\")' onmouseout='mouseGoneFromCircle(this)' cx='" + (pos + k + 20) + "' cy='" + (100 + (moment['deadlineweek'] - 1) * 70) + "' r='10' stroke='rgb(83,166,84)' stroke-width='3' fill='rgb(253,203,96)' />";
      k += 25;
      oldWeek = moment['deadlineweek'];
    }
  }
  // End of add columns and duggas

  // Add the line for current week.
  str += "<line stroke-dasharray='5,5' x1='250' y1='" + (100 + (info['thisweek'] - info['versstartweek']) * 70) + "' x2='" + ((info['numberofparts'] * 200) + 250) + "' y2='" + (100 + (info['thisweek'] - info['versstartweek']) * 70) + "' style='stroke:rgb(203,63,65); stroke-width:2;' />";
  str += "<line onmouseover='mouseOverLine(\"Current date:<br>" + info['thisdate'] + "\")' onmouseout='mouseGoneFromLine()' x1='250' y1='" + (100 + (info['thisweek'] - info['versstartweek']) * 70) + "' x2='" + ((info['numberofparts'] * 200) + 250) + "' y2='" + (100 + (info['thisweek'] - info['versstartweek']) * 70) + "' style='stroke:rgb(0,0,0); stroke-width:10; stroke-opacity:0;' />";

  str += "</svg>";
  str += "</div>";
  str += "</div>";

// Box for dugga info on mouse over
  str += "<div id='duggainfo' class='duggainfo' style='display:none; position:absolute; background-color:white; border-style:solid; border-color:#3C3C3C; padding:5px;'>";
  str += "<span id='duggaInfoText'></span>";
  str += "</div>";
// Box for current date info
  str += "<div id='currentDate' class='currentDate' style='display:none; position:absolute; background-color:white; border-style:solid; border-width:1px; border-color:red; padding:5px;'>";
  str += "<span id='currentDateText'></span>";
  str += "</div>";
  swimContent.innerHTML = str;
}

// Gather the fetched data from the database and execute the swimming
function returnedSwimlane(swimlaneData) {
  swimlaneInformation = swimlaneData;
  console.log(swimlaneInformation);
  if (swimlaneInformation['returnvalue']) {
    swimlaneDrawLanes();
  }
}
