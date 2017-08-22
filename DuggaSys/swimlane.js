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
  circle.setAttribute("r", '13');
  circlePosY = parseInt(circle.getAttribute('cy')) - 70;
  circlePosX = parseInt(circle.getAttribute('cx')) + 20;
  document.getElementById("duggaInfoText").innerHTML = text;
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

// Draw the content of the SwimContent container
function swimlaneDrawLanes() {
  var info = swimlaneInformation['information'];
  var moments = swimlaneInformation['moments'];
  console.log(info);
  console.log(moments);
  var bgcol="#EEE";
  var str = "";
  str += "<div id='swimlanebox' class='swimlanebox'>";
  str += "<table><thead><tr style='height:70px;background-color:#FFF'><th>&nbsp;</th>";
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
  str+=colspan+"'>"+tmpname+"</th>";
  str+="</tr></thead><tbody><tr><td>";
  str+="<svg width='75' height='" + (70 * info['verslength'] ) + "'>";
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
      if (moment['kind']==3){
          duggaInfoArray.push("<b>" + moment['entryname'] + "</b><br> Start date: " + moment['qrelease'] + "<br> Deadline: " + moment['deadline']);
          str+="<td style='text-align:center;background-color:"+bgcol+"'><svg style='margin:0 5px 0 5px;' width='30' height='"+(70 * info['verslength'] ) + "'>";
          // The ---- that marks the release of a dugga
          str += "<line x1='5' y1='" + (30 + (moment['startweek'] - 1) * 70) + "' x2='25' y2='" + (30 + (moment['startweek'] - 1) * 70) + "' style='stroke:rgb(83,166,84);stroke-width:3' />";
          // The | that marks the duration of a dugga
          str += "<line x1='15' y1='" + (30 + (moment['startweek'] - 1) * 70) + "' x2='15' y2='" + (30 + (moment['deadlineweek'] - 1) * 70) + "' style='stroke:rgb(83,166,84);stroke-width:3' />";
          // The O that marks the deadline of a dugga
          str += "<circle id='" + id + "' onmouseover='mouseOverCircle(this,\"" + duggaInfoArray[id++] + "\")' onmouseout='mouseGoneFromCircle(this)' cx='15' cy='" + (30 + (moment['deadlineweek'] - 1) * 70) + "' r='10' stroke='rgb(83,166,84)' stroke-width='3' fill='rgb(253,203,96)' />";
          str+="</svg></td>";
      }
    }
  
    str+="</tbody></table></div>";
    // Box for dugga info on mouse over
    str += "<div id='duggainfo' class='duggainfo' style='display:none; position:absolute; background-color:white; border-style:solid; border-color:#3C3C3C; padding:5px;'>";
    str += "<span id='duggaInfoText'></span>";
    str += "</div>";
    // Box for current date info
    str += "<div id='currentDate' class='currentDate' style='display:none; position:absolute; background-color:white; border-style:solid; border-width:1px; border-color:red; padding:5px;'>";
    str += "<span id='currentDateText'></span>";
    str += "</div>";
  
  swimContent.innerHTML=str;
}
function swimlaneDrawLanes2() {
  var info = swimlaneInformation['information'];
  var moments = swimlaneInformation['moments'];
  console.log(info);
  console.log(moments);
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
      console.log(moment);
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
  console.log(swimlaneInformation['returnvalue']);
  if (swimlaneInformation['returnvalue']) {
    swimlaneDrawLanes();
  }
}
