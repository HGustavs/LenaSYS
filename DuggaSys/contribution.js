var querystring = parseGet();
var retdata;
var contribDataArr = [];
var daycounts = [];
var maxDayCount = 0;
var dailyCount = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
];

AJAXService("get", {
  userid: "HGustavs"
}, "CONTRIBUTION");

var weeks;
var activities;
var firstSelWeek;
var secondSelWeek;
var updateShowAct = true;
var courseFileArr = [];

var commitChangeArray = [];

//sorting for multiple views
//Restores all views when pressing the All button
function restoreStatView() {
  var all = document.querySelectorAll('.group1 , .group2 , .group3'),
    i = 0,
    l = all.length;

  for (i; i < l; i++) {
    all[i].style.display = 'block';

  }
  var flex = document.querySelectorAll('.group2flex');

  for (j = 0; j < flex.length; j++) {
    flex[j].style.display = 'flex';
  }
  
}
//Removes unwanted classes based on button
function removeStatview(value) {
  restoreStatView();
  var remove = document.querySelectorAll(value),
    i = 0,
    l = remove.length;

  for (i; i < l; i++) {
    remove[i].style.display = 'none';

  }
}

function restoreSpecStatView(value) {
  var all = document.querySelectorAll(value),
    i = 0,
    l = all.length;

    for (i; i < l; i++) {
      all[i].style.display = 'block';

    }
  if(value.includes("group2flex")){
    var flex = document.querySelectorAll('.group2flex');
    for (j = 0; j < flex.length; j++) {
      flex[j].style.display = 'flex';
    }
  }
}

// Gives the buttons functionality
// group2flex is for elements that should be style.display:flex under group2
// group2noDisplay is for elements that should not be affected by style.display changes under group2
function statSort(value) {
  if (value == "All") {
    restoreStatView();

  } else if (value == "Basic") {
    removeStatview('.group2 , .group3, .group2flex');
    restoreSpecStatView('.group1');

  } else if (value == "Charts") {
    removeStatview('.group1 , .group3');
    restoreSpecStatView('.group2, .group2flex');
  } else if (value == "Contribution") {
    removeStatview('.group1 , .group2, .group2flex');
    restoreSpecStatView('.group3');
  }
}



function hideInfoText() {
  var text = document.getElementById("infoText");
  text.style.display = "none";
}

function showInfoText(object, displayText) {
  var text = document.getElementById("infoText");
  text.style.display = "inline";
  text.innerHTML = displayText;
  if (typeof object.attributes.width !== 'undefined') {
    text.style.left = (document.documentElement.scrollLeft + object.getBoundingClientRect()["x"] + object.getBoundingClientRect().width + 2) + "px";
    text.style.top = (document.documentElement.scrollTop + object.getBoundingClientRect()["y"] + (object.getBoundingClientRect().height / 2) - (text.offsetHeight / 2)) + "px";
  } else {
    text.style.left = (document.documentElement.scrollLeft + object.getBoundingClientRect()["x"] + object.r["baseVal"]["value"] + 2) + "px";
    text.style.top = (document.documentElement.scrollTop + object.getBoundingClientRect()["y"] + (object.r.baseVal.value / 2) - (text.offsetHeight * 1.1)) + "px";
  }
}

function getHolidays() {
  var holidays = new Array();
  var redDay1 = getYYYYMMDD(new Date("2019-04-19"));
  var redDay2 = getYYYYMMDD(new Date("2019-04-22"));
  var redDay3 = getYYYYMMDD(new Date("2019-05-01"));
  var redDay4 = getYYYYMMDD(new Date("2019-05-30"));
  var redDay5 = getYYYYMMDD(new Date("2019-06-06"));
  var redDay6 = getYYYYMMDD(new Date("2019-06-21"));
  holidays.push(redDay1,redDay2,redDay3,redDay4,redDay5,redDay6);
  return holidays;
}

function isHoliday(date){
  var holiday = getHolidays();
  for(i = 0; i<holiday.length; i++){
    if(date == holiday[i]){
      return true;
    }
  }
  return false;
}

function getYYYYMMDD(date){
  var YYYY = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    var correctDate = YYYY + "-" + mm + "-" + dd;
    return correctDate;
}

function renderBarDiagram(data) {
  // Creates array from data for easier access
  var dailyCount = new Array(70);
  var dateString = data['weeks'][0]['weekstart'];
  var numOfWeeks = data['weeks'].length;
  var date;
  var maxDayCount = 0;
  for (var i = 0; i < 7 * numOfWeeks; i++) {
    var day = data['count'][dateString];
    var commits = parseInt(day["commits"][0][0]);
    var events = parseInt(day["events"][0][0]);
    var comments = parseInt(day["comments"][0][0]);
    var loc = parseInt(day["loc"][0][0] == null ? 0 : day["loc"][0][0]);
    var total = commits + events + comments + loc;
    if (total > maxDayCount) {
      maxDayCount = total;
    }
    dailyCount[i] = new Array(dateString, commits, events, comments, loc);
    date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    dateString = date.toISOString().split("T")[0];
  }

  // Renders the diagram

  var str = "<div style='width:100%;overflow-x:scroll;'>";
  str += "<h2 style='padding-left:5px'>Weekly bar chart</h2>";
  str += "<p style 'padding-top:10px'>Showing activities for " + dailyCount[0][0] + " - " + dailyCount[7*numOfWeeks-1][0] + " </p>";
  str += `<svg  class='chart fumho'  style='background-color:#efefef;'
  width='1300' height='250' aria-labelledby='title desc' role='img'>`;
  for (var i = 0; i < numOfWeeks; i++) {
    str += `<rect x='${(65 + 120 * i)}' y='0%' width='120' height='100%' 
    style='fill:${(i % 2 == 1 ? "#cccccc" : "#efefef")};' />`
  }
  str += "<line style='stroke:#000;' x1='65' x2='65' y1='5%' y2='220'></line>";
  str += "<line style='stroke:#000;' x1='65' x2='99%' y1='220' y2='220'></line>";

  // Calculates and render scale numbers on the left
  var decimals = Math.pow(10, Math.round(maxDayCount).toString().length - 2);
  var highRange = Math.ceil(maxDayCount / decimals) * decimals;
  for (var i = 0; i < 5; i++) {
    var range = (highRange / 4) * i;
    if (highRange > 100) {
      range = Math.round(range);
    }
    str += `<text x='${(62 - (range.toString().length * 9))}' y='${(225 - (range / highRange) * 200)}'>${range}</text>`;
    str += `<line style='stroke:#ccc;' x1='65' x2='99%' y1='${(220 - (range / highRange) * 200)}'
     y2='${(220 - (range / highRange) * 200)}'></line>`;
  }

  // Renders the bars
  for (var i = 0; i < numOfWeeks; i++) {
    str += "<g class='bar'>";
    for (var j = 0; j < 7; j++) {
      var day = dailyCount[i * 7 + j];
      
      var yOffset = 0;
      str += `<g width='10' onmouseover='showInfoText(this, \"${(day[0] + `<br />commits: ${day[1]}<br />Events: ${day[2]}<br />Comments: ${day[3]}<br />LOC: ` + day[4])}\");' onmouseout='hideInfoText()'>`;
      if(isHoliday(day[0])){
        str += `<rect style='fill:#ffc0cb;' width='15'; height='88%'; opacity='0.7';
        x='${(j * 15 + 120 * i + 73)}'></rect>`;
      }
      for (var k = 1; k < day.length; k++) {
        var height = (day[k] / highRange) * 200;

        yOffset += height;
        var color = "#F44336";
        if (k == 2) {
          color = "#4DB6AC";
        } else if (k == 3) {
          color = "#43A047";
        } else if (k == 4) {
          color = "purple";
        }
        str += `<rect style='fill:${color};' width='10' height='${height}'
          x='${(j * 15 + 120 * i + 75)}' y='${(220 - yOffset)}'></rect>`;
      }
      str += "</g>";
    }
    
    str += "<text x='" + (120 * i + 100) + "' y='240'>week " + (i + 1) + "</text>";
    str += "</g>";
  }
  str += '</svg>';
  str += '<div class="group2flex" id="barDiagramLegend" style="display:flex; width:900px; align-items:center; justify-content:center;">';
  str += '<div style="display:flex;align-items:center;margin-left:30px;margin-right:30px;"><p>Commits:</p>';
  str += '<div style="width:15px; height:15px; background-color:#F44336;margin-left:10px;"></div></div>';
  str += '<div style="display:flex;align-items:center;margin-left:30px;margin-right:30px;"><p>Events:</p>';
  str += '<div style="width:15px; height:15px; background-color:#4DB6AC;margin-left:10px;"></div></div>';
  str += '<div style="display:flex;align-items:center;margin-left:30px;margin-right:30px;"><p>Comments:</p>';
  str += '<div style="width:15px; height:15px; background-color:#43A047;margin-left:10px;"></div></div>';
  str += '<div style="display:flex; align-items:center;margin-left:30px;margin-right:30px;"><p>LOC:</p>';
  str += '<div style="width:15px; height:15px; background-color:Purple;margin-left:10px;"></div></div>';
  str += '<div style="display:flex; align-items:center;margin-left:30px;margin-right:30px;"><p>Holidays:</p>';
  str += '<div style="width:15px; height:15px; background-color:#f1c0cb;margin-left:10px;"></div></div>';
  str += '</div>';
  return str;
}

function renderCommits(data) {
  
  var weekData = data['weeks'];
  var allCommits =  [];
  var commitDict = Object();
  var index = 0;

  //Gets the date of the first and last day in the interval
  var startDate =  weekData[0]['weekstart'];
  var endDate =  weekData[9]['weekend'];
  date = new Date(endDate);
  date.setDate(date.getDate() - 1);
  endDate = date.toISOString().split("T")[0];

  //creating the svg to put the commit tree in
  var str = "<h2>Commit tree</h2>";
  str += "<p>Showing commit tree for "+startDate+" - "+endDate+"</p>";
  str += "<div id='innerCommitTree'>";
  str += "<svg id='commitTree' viewBox='0 0 600 300' style='background-color:#efefef; width: 1200px; height:300px;' aria-labelledby='title desc' role='img'>";

  //gets the year of the startdate
  var firstDate = new Date(startDate);
  var startYear = firstDate.getFullYear();
  
 // for each commit ID
 // X is commit order, Y is commit nesting
  for(var i = 0; i < weekData.length;i++) {  
    for(var j= 0; j < weekData[i]['commits'].length;j++) 
    {
      var commitDate =  weekData[i]['commits'][j].thedate;
      var newDate = "";
      for(var x = 0; x < 10; x++)
      {
        newDate += commitDate[x];
      }
      var finalDate = new Date(newDate);

      if(finalDate.getFullYear() == startYear){
        allCommits.push(weekData[i]['commits'][j]);
        var commit_obj = {
          index: index
        }
        index++;
        commitDict[weekData[i]['commits'][j].cid] = commit_obj;
      }
    }
    
    str += `<rect x='${(-300 + 120 * i)}' y='0%' width='120' height='100%'  style='fill:${(i % 2 == 1 ? "#cccccc" : "#efefef")};' />`
    str += "<text x='" + (120 * i + -260) + "' y='20'>week " + (i + 1) + "</text>";
  }
  str += "<line style='stroke:#000;' x1='-300' x2='200%' y1='25' y2='25'></line>";

  var xMul = 25;
  var yMul = 10;
  var x_spacing = 250;
  var y_spacing = -50;

  for(var i = 0; i < allCommits.length;i++) { // each commit
    var x1 = allCommits[i]['space'];
    var y1 = allCommits[i]['thetimeh'];
    str += drawCommitDots(x1, y1, xMul, yMul, x_spacing, y_spacing);

    var p1index = commitDict[allCommits[i]['p1id']];
    if(p1index != undefined) {
      var parent1 =  allCommits[p1index.index];
      var x2 = parent1['space'];
      var y2 = parent1['thetimeh'];

      str +=  drawCommitLines(x1,x2,y1,y2,xMul,yMul, x_spacing, y_spacing);

    }
  }
  str += "</svg>";
  str += "</div>";

  return str;
}

/* 
  Function to draw the actuall comiit tree inside the SVG.
  X is Commit order, Y is Commit nesting
    Param x1 = cid's x coordinate
    Param x1 = cid's y coordinate
    Param y2 = parent id's x coordinate for lines
    Param y2 = parent id's y coordinate for lines
    Param xmul = multiplyer for x
    Param ymul = multiplyer for y
*/
function drawCommitLines(x1, x2, y1, y2, xmul, ymul, x_spacing, y_spacing){
  
  var colors = ["#246","#26A","#4BA","#59C","#DE7","#FB5","#FD5","#E64","#85A","#45A"]; //collection of array to hold different colors? Maybe keep this in renderCommits() and sens as parameter based on the commits author?
  var color = colors[y1%colors.length]; // Reworks the colors array with % calcultation against y1. Leaves one color to use for lines between commits (MAYBE?!?)

  var strokew = xmul * 0.05; //Guessing a calculation for stroke width for colored lines
  var str = "";


  //Draw the line between child- and parent commits
  if(Math.abs(x2-x1)>1 && (y1 != y2)){ //Math.abs() returns the calculations absolute value
    str += `<line x1=${(x1*xmul - x_spacing)} y1=${(y1*ymul- y_spacing)} x2=${((x2-1)*xmul  - x_spacing)} y2=${(y1*ymul- y_spacing)} stroke='${color}' style='stroke-width:${strokew}' />`;
    str += `<line x1=${((x2-1)*xmul  - x_spacing)} y1=${(y1*ymul- y_spacing)} x2=${(x2*xmul  - x_spacing)} y2=${(y2*ymul- y_spacing)} stroke='${color}' style='stroke-width:${strokew}' />`;
    
  }else{
    str +=`<line x1=${(x1*xmul - x_spacing)}  y1=${(y1*ymul- y_spacing)} x2=${(x2*xmul - x_spacing)} y2=${(y2*ymul - y_spacing)} stroke='${color}' style='stroke-width:${strokew}"' />`;
  }

  return str;
}

function drawCommitDots(x1, y1, xmul, ymul, x_spacing, y_spacing){
  var cradius = xmul * 0.10;
  var str = "";

  //Draw the circle reptresenting each commit
  str += `<circle cx='${x1*xmul  - x_spacing}' cy='${y1*ymul - y_spacing}' r='${cradius}' />`;

  return str;
}

function renderLineDiagram(data) {
  weeks = data.weeks;
  daycounts = data['count'];
  var firstweek = data.weeks[0].weekstart;


  //Selectbox to choose week
  str = "<h2 style='padding-left:5px'>Weekly line chart</h2>";
  str += `<select class="group2" id="weekoption" value="0" style="margin-top:25px;"
  onchange="document.getElementById(\'lineDiagramDiv\').innerHTML=weekchoice(this.value);">`;
  str += '<option value="' + firstweek + '">All weeks</option>';
  for (i = 0; i < weeks.length; i++) {
    var week = weeks[i];
    str += '<option value="' + week.weekstart + '">' + "Week " + week.weekno + `(${week.weekstart} - ${week.weekend})` + '</option>';
  }

  str += '</select>';
  str += '<div class="group2" id="lineDiagramDiv">';
  str += weekchoice(firstweek);
  str += '</div>';

  str += '<div class="group2flex" id="lineDiagramLegend" style="display:flex; width:900px; align-items:center; justify-content:center;">';
  str += '<div style="display:flex;align-items:center;margin-left:30px;margin-right:30px;"><p>Commits:</p>';
  str += '<div style="width:15px; height:15px; background-color:#F44336;margin-left:10px;"></div></div>';
  str += '<div style="display:flex;align-items:center;margin-left:30px;margin-right:30px;"><p>Events:</p>';
  str += '<div style="width:15px; height:15px; background-color:#4DB6AC;margin-left:10px;"></div></div>';
  str += '<div style="display:flex;align-items:center;margin-left:30px;margin-right:30px;"><p>Comments:</p>';
  str += '<div style="width:15px; height:15px; background-color:#43A047;margin-left:10px;"></div></div>';
  str += '<div style="display:flex; align-items:center;margin-left:30px;margin-right:30px;"><p>LOC:</p>';
  str += '<div style="width:15px; height:15px; background-color:Purple;margin-left:10px;"></div></div>';
  str += '</div>';


  return str;
}

function lineDiagram() {
  str = `<svg viewBox='0 0 580 250' class='lineChart' style='max-width:900px;
  min-width:700px;background-color:#efefef;margin-top:10px;'>`;

  // Calculates and render scale numbers on the left
  var decimals = Math.pow(10, Math.round(maxDayCount).toString().length - 2);
  //find the maximum value of commits/events/comments/LOC within selected dates
  maxDayCount = 1;
  for (i = 0; i < 7; i++) {
    for (j = 1; j < dailyCount[i].length; j++) {
      if (dailyCount[i][j] > maxDayCount) {
        maxDayCount = dailyCount[i][j];
      }
    }
  }
  var highRange = Math.ceil(maxDayCount / decimals) * decimals;

  var graphHeight = 200;
  for (var i = 0; i < 5; i++) {
    var range = (highRange / 4) * i;
    if (highRange > 100) {
      range = Math.round(range);
    }
    str += `<text font-size='10' x='${(45 - (range.toString().length * 7))}'
    y='${(225 - (range / highRange) * graphHeight)}'>${range}</text>`;
    str += `<line style='stroke:#ccc;' x1='45' x2='99%' y1='${(220 - (range / highRange) * graphHeight)}'
    y2='${(220 - (range / highRange) * graphHeight)}'></line>`;
  }

  //Grid lines
  str += "<line style='stroke:#777777;' x1='45' x2='45' y1='5%' y2='220'></line>";
  str += "<line style='stroke:#777777;' x1='45' x2='99%' y1='220' y2='220'></line>";

  //Labels
  str += "<g class='graphLabels'>";
  str += "<text font-size='10' x='50' y='235'>Monday</text>";
  str += "<text font-size='10' x='120' y='235'>Tuesday</text>";
  str += "<text font-size='10' x='200' y='235'>Wednesday</text>";
  str += "<text font-size='10' x='280' y='235'>Thursday</text>";
  str += "<text font-size='10' x='370' y='235'>Friday</text>";
  str += "<text font-size='10' x='440' y='235'>Saturday</text>";
  str += "<text font-size='10' x='525' y='235'>Sunday</text>";
  str += "</g>";

  xNumber = Array(60, 140, 220, 300, 380, 460, 540);

  //Commit-graph
  str += "<g transform='translate(0,220) scale(1,-1)'>";
  str += "<polyline fill='none' stroke='#F44336' stroke-width='2'";
  str += "points='";
  for (i = 0; i < 7; i++) {
    str += xNumber[i] + "," + (dailyCount[i][1] / maxDayCount * graphHeight) + " ";
  }
  str += "'/>";
  for (i = 0; i < xNumber.length; i++) {
    str += `<circle onmouseover='showInfoText(this, \"${"Commits: : " + (dailyCount[i][1])}\");' onmouseout='hideInfoText()'`;
    var radius = dailyCount[i][3] / dailyCount[i][1] * 2;
    if (radius > 7) {
      radius = 7
    } else if (radius < 3) {
      radius = 3
    }
    str += `cx='${xNumber[i]}' cy='${(dailyCount[i][1] / maxDayCount * graphHeight)}' r='${radius}' fill='#F44336'/>`;
  }
  str += "</g>";

  //Event-graph
  str += "<g transform='translate(0,220) scale(1,-1)'>";
  str += "<polyline fill='none' stroke='#4DB6AC' stroke-width='2'";
  str += "points='";
  for (i = 0; i < 7; i++) {
    str += xNumber[i] + "," + (dailyCount[i][2] / maxDayCount * graphHeight) + " ";
  }
  str += "'/>";
  for (i = 0; i < xNumber.length; i++) {
    str += `<circle onmouseover='showInfoText(this, \"${"Events: " + (dailyCount[i][2])}\");' onmouseout='hideInfoText()'`;
    str += `cx='${xNumber[i]}' cy='${(dailyCount[i][2] / maxDayCount * graphHeight)}' r='3' fill='#4DB6AC' />`;
  }
  str += "</g>";

  //LOC-Graph
  str += "<g transform='translate(0,220) scale(1,-1)'>";
  str += "<polyline fill='none' stroke='purple' stroke-width='2'";
  str += "points='";
  for (i = 0; i < 7; i++) {
    str += xNumber[i] + "," + (dailyCount[i][3] / maxDayCount * graphHeight) + " ";
  }
  str += "'/>";

  for (i = 0; i < xNumber.length; i++) {
    str += `<circle onmouseover='showInfoText(this, \"${"LOC: " + (dailyCount[i][3])}\");' onmouseout='hideInfoText()'`;
    str += `cx='${xNumber[i]}' cy='${(dailyCount[i][3] / maxDayCount * graphHeight)}' r='3' fill='purple' />`;
  }
  str += "</g>";

  //Comment-graph
  str += "<g transform='translate(0,220) scale(1,-1)'>";
  str += "<polyline fill='none' stroke='#43A047' stroke-width='2'";
  str += "points='";
  for (i = 0; i < 7; i++) {
    str += xNumber[i] + "," + (dailyCount[i][4] / maxDayCount * graphHeight) + " ";
  }
  str += "'/>";
  for (i = 0; i < xNumber.length; i++) {
    str += `<circle onmouseover='showInfoText(this, \"${"Comments: " + (dailyCount[i][4])}\");' onmouseout='hideInfoText()'`;
    str += `cx='${xNumber[i]}' cy='${(dailyCount[i][4] / maxDayCount * graphHeight)}' r='3' fill='#43A047' />`;
  }
  str += "</g>";
  str += "</svg>";

  return str;
}

function weekchoice(dateString) {

  var date;
  var events = 0;
  var commits = 0;
  var loc = 0;
  var comments = 0;

  if (($("#weekoption option:selected").text()) == "" || ($("#weekoption option:selected").text()) == "All weeks") {
    var weekcounter = 0;
    var daycounter = 0;
    var weekarray = [];
    for (i = 0; i < 70; i++) {

      events = parseInt(daycounts[dateString].events[0][0]);
      commits = parseInt(daycounts[dateString].commits[0][0]);
      loc = parseInt(daycounts[dateString].loc[0][0] == null ? 0 : daycounts[dateString].loc[0][0]);
      comments = parseInt(daycounts[dateString].comments[0][0]);

      weekarray[i] = [dateString, commits, events, loc, comments];

      var total = commits + events + comments + loc;
      if (total > maxDayCount) {
        maxDayCount = total;
      }

      date = new Date(dateString);
      date.setDate(date.getDate() + 1);
      dateString = date.toISOString().slice(0, 10);
    }
    dailyCount = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];
    for (var i = 0; i < weekarray.length; i++) {
      for (var j = 0; j < weekarray[i].length; j++) {
        dailyCount[i % 7][j] += weekarray[i][j];
      }
    }
    dateString = "";
  }

  for (var key in daycounts) {
    if (key == dateString) {
      for (i = 0; i < 7; i++) {
        var events = parseInt(daycounts[dateString].events[0][0]);
        var commits = parseInt(daycounts[dateString].commits[0][0]);
        var loc = parseInt(daycounts[dateString].loc[0][0] == null ? 0 : daycounts[dateString].loc[0][0]);
        var comments = parseInt(daycounts[dateString].comments[0][0]);

        dailyCount[i] = [dateString, commits, events, loc, comments];

        date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        dateString = date.toISOString().slice(0, 10);

      }
      dateString = "";
    }
  }

  str = lineDiagram();
  return str;
}

// Since Math.cos and Math.sin does not calculate on degrees we must convert to radians
function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function changeDay() {
  if(firstSelWeek != null && secondSelWeek != null){  
    if (firstSelWeek > secondSelWeek){
      alert("Second week can't be earlier than first week");
    } else {
      AJAXService("updateday", {
        userid: "HGustavs",
        today: firstSelWeek,
        secondday: secondSelWeek
      }, "CONTRIBUTION");
    }
  }
}


function showAllDays() {
  var div = document.getElementById('hourlyGraph');
  div.innerHTML = renderCircleDiagram(JSON.stringify(retdata['hourlyevents']));
}


function selectWeek(week, selBoxOrigin){
  if(selBoxOrigin == 1){
    firstSelWeek = week;
  } else if (selBoxOrigin == 2){
    secondSelWeek = new Date(week);
    secondSelWeek = new Date(secondSelWeek.getTime()+1000*60*60*24*6);
    var YYYY = secondSelWeek.getFullYear();
    var mm = secondSelWeek.getMonth() + 1;
    var dd = secondSelWeek.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    secondSelWeek = YYYY + "-" + mm + "-" + dd;
  }
}

function renderCircleDiagram(data, day) {

  var str = "";
  if (data.hourlyevents == null){
    activities = data.events;
  }else if (data.events == null){
    activities = data.hourlyevents;
  }

  if (data.weeks != null){
    weeks = data.weeks;
  }

  var firstweek = weeks[0].weekstart;

  str = "<h2 style='padding-top:10px'>Hourly activities</h2>";
  str += `<select class="group2noDisplay" id="firstWeek" value="0" style="margin-top:25px"; onchange="selectWeek(this.value,1)"'>`;
  str += '<option value="' + firstweek + '">Select start week</option>';

  for (i = 0; i < weeks.length; i++) {
    var week = weeks[i];
    str += '<option value="' + week.weekstart + '">' + "Week " + week.weekno + `(${week.weekstart} - ${week.weekend})` + '</option>';
  }

  str += '</select>';
  
  str += `<select class="group2noDisplay" id="secondWeek" value="0" style="margin-top:25px"; onchange="selectWeek(this.value,2)"'>`;
  str += '<option value="' + firstweek + '">Select end week</option>';
  
  for (i = 0; i < weeks.length; i++) {
    var week = weeks[i];
    str += '<option value="' + week.weekstart + '">' + "Week " + week.weekno + `(${week.weekstart} - ${week.weekend})` + '</option>';
  }

  str += '</select>';
  
  str += `<button style='margin-left: 20px' onclick='changeDay()'>Show selected dates</button>`;
  if (updateShowAct) {
    str += "<p style='margin-left: 10px'>Showing all activities</p>";
    updateShowAct = false;
  } else {
    str += "<p style='margin-left: 10px'>Showing activities for the period " + firstSelWeek + " - " + secondSelWeek + "</p>";
  }
  str += "<div class='circleGraph'>";
  str += `<div id='activityInfoBox'><span style='grid-row-start: -1' id='activityTime'>
  </span><span style='grid-row-start: -1' id='activityPercent'></span>
  <span style='grid-row-start: -1' id='activityCount'></span></div>`;
  str += "<svg width='500' height='500'>";
  str += "<circle class='circleGraphCircle' cx='250' cy='250' r='220' />";
  str += renderHourMarkers();
  str += renderActivityPoints(activities);
  str += "</svg>";

  // Hidden gradient used for mixed activity points
  str += "<svg style='width:0;height:0;position:absolute;'>";
  str += "<linearGradient id='mixedActivityGradient' x2='1' y2='1'>";
  str += "<stop offset='0%' stop-color='#6A4C93' />";
  str += "<stop offset='50%' stop-color='#2AB7CA' />";
  str += "<stop offset='100%' stop-color='#FE4A49' />";
  str += "</linearGradient></svg></div>";

  return str;
}

function renderActivityPoints(activities) {
  var str = "";
  var hours = {};
  activities.forEach(entry => {
    var hour = entry.time;
    var keys = Object.keys(hours);
    var found = false;

    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == hour) {
        hours[hour] += 1;
        found = true;
        return;
      }
    }
    if (!found) {
      hours[hour] = 1;
    }

  });

  var uniquePoints = [];
  var activityTypes = {
    times: {},
    types: {}
  };
  const RADIUS = 220;
  const BASELINE = 75;
  const MIDDLE = 243;
  activities.forEach(entry => {
    //Cast integer to string
    var hourString = entry.time.toString();
    var hour = hourString.substr(0, 2);
    var houroffset = parseInt(hour) + 6;
    var type = entry.type;
    var activityCount = activities.length;
    var percentage = hours[hour] / activityCount;
    var angleFactor = ((RADIUS - BASELINE) * percentage) + BASELINE;
    angleFactor > RADIUS ? angleFactor = RADIUS : angleFactor = angleFactor;
    var xCoord = (Math.cos(toRadians(houroffset * 15)) * angleFactor) + MIDDLE;
    var yCoord = (Math.sin(toRadians(houroffset * 15)) * angleFactor) + MIDDLE;

    if (!Object.keys(activityTypes.times).includes(hour)) {
      activityTypes.times[hour] = {};
      uniquePoints.push([xCoord, yCoord, hour, percentage]);
    }
    if (!Object.keys(activityTypes.types).includes(type)) activityTypes.types[type] = 0;
    if (!Object.keys(activityTypes.times[hour]).includes(type)) activityTypes.times[hour][type] = 0;
    activityTypes.types[type] += 1;
    activityTypes.times[hour][type] += 1;
  });
  uniquePoints.sort(([a, b, c], [d, e, f]) => c - f);

  if (uniquePoints.length > 2) {
    str += "<polygon class='activityPolygon' points='";
    for (var i = 0; i < uniquePoints.length; i++) {
      str += (uniquePoints[i][0] + 5) + "," + (uniquePoints[i][1] + 5) + " ";
    }
    str += `250,250' onmouseover='showAllActivity(event, ${JSON.stringify(activityTypes)})' onmouseout='hideActivityInfo()' />`;
  }

  uniquePoints.forEach(point => {
    var xCoord = point[0];
    var yCoord = point[1];
    var hour = point[2];
    var percentage = Math.round(point[3] * 100);
    var types = Object.keys(activityTypes.times[hour]);
    var values = Object.values(activityTypes.times[hour]);

    types.length > 1 ? type = "mixed" : type = types[0];
    str += "<rect class='activitymarker " + type + "' width='14' height='14' x='" + xCoord + "' y='" + yCoord + "' onmouseover='showActivityInfo(event, ";
    str += "`" + type + "`, `" + hour + "`, " + percentage + ", " + JSON.stringify(activityTypes) + ")' onmouseout='hideActivityInfo()' />";
  });
  return str;
}

function renderHourMarkers() {
  const RADIUS = 220;
  const NUMRADIUS = 240;
  const MIDDLE = 250;
  const X_OFFSET = NUMRADIUS + 10;
  const Y_OFFSET = NUMRADIUS + 15;
  var str = "";

  var i, number;
  for (i = 0; i < 24; i++) {
    var xCoord;
    var yCoord;
    str += "<line x1='" + MIDDLE + "' y1='" + MIDDLE + "' class=";
    if (i % 2 === 0) {
      xCoord = (Math.cos(toRadians(i * 15)) * (RADIUS + 10)) + MIDDLE;
      yCoord = (Math.sin(toRadians(i * 15)) * (RADIUS + 10)) + MIDDLE;
      str += "'circleGraphBigline'";
      str += " x2='" + xCoord + "' y2='" + yCoord + "' />";
    } else {
      xCoord = (Math.cos(toRadians(i * 15)) * RADIUS) + MIDDLE;
      yCoord = (Math.sin(toRadians(i * 15)) * RADIUS) + MIDDLE;
      str += "'circleGraphLine'";
      str += " x2='" + xCoord + "' y2='" + yCoord + "' />";
    }
  }
  str += "<circle class='circleGraphCircle' cx='" + MIDDLE + "' cy='" + MIDDLE + "' r=25 />";
  str += "<g id='circleGraphHours'>";
  for (i = 0, number = 18; i < 12; i++) {
    var xCoordNum = (Math.cos(toRadians(i * 30)) * NUMRADIUS) + X_OFFSET;
    var yCoordNum = (Math.sin(toRadians(i * 30)) * NUMRADIUS) + Y_OFFSET;

    str += "<text x='" + xCoordNum + "' y='" + yCoordNum + "'>" + number + "</text>";
    number === 22 ? number = 0 : number += 2;
  }
  str += "</g>";
  return str;
}

// Shows all activity when the user hovers over the polygon in the circle graph
function showAllActivity(e, activities) {
  var box = document.getElementById('activityInfoBox');
  var times = Object.keys(activities.times);
  var types = Object.keys(activities.types);

  var str = "";

  for (var i = 0; i < times.length; i++) {
    var prevHour = (parseInt(times[i]) - 1);
    var hourTypes = Object.keys(activities.times[times[i]]);

    str += "<span class='activityInfoEntry'>";
    str += "<strong>" + prevHour + ".00 - " + times[i] + ".00</strong><br>";

    hourTypes.forEach(type => {
      str += type + ": " + activities.times[times[i]][type] + "<br>";
    });
    str += "</span>";
  }
  box.innerHTML += str;
  box.style.display = 'grid';
  box.style.left = e.layerX + 10 + "px";
  box.style.top = e.layerY + 10 + "px";
}

// Shows info about the activity point the user hovers over in the circle graph
function showActivityInfo(e, type, hour, pc, activities) {
  var box = document.getElementById('activityInfoBox');
  var timeSpan = document.getElementById('activityTime');
  var pcSpan = document.getElementById('activityPercent');
  var countSpan = document.getElementById('activityCount');
  var prevHour = (parseInt(hour) - 1);
  box.style.display = 'block';
  box.style.left = e.layerX + 10 + "px";
  box.style.top = e.layerY + 10 + "px";

  timeSpan.innerHTML = prevHour + ".00 - " + hour + ".00";
  pcSpan.innerHTML = pc + "% Activity";
  var str = "";
  for (var i = 0; i < Object.keys(activities.times[hour]).length; i++) {
    var type = Object.keys(activities.times[hour])[i];
    str += activities.times[hour][type] + " of " + activities.types[type] + " total " + type + "s<br>";
  }
  countSpan.innerHTML = str;
}

// Resets the circle graph activity info box and hides it
function hideActivityInfo() {
  var box = document.getElementById('activityInfoBox');
  var timeSpan = document.getElementById('activityTime');
  var pcSpan = document.getElementById('activityPercent');
  var countSpan = document.getElementById('activityCount');
  var allSpans = [...document.getElementsByClassName('activityInfoEntry')];
  allSpans.forEach(span => {
    box.removeChild(span);
  });
  timeSpan.innerHTML = "";
  pcSpan.innerHTML = "";
  countSpan.innerHTML = "";
  box.style.display = 'none';
}

function intervaltocolor(size, val) {
  if (val < size * 0.25) {
    return "#cf9";
  } else if (val < size * 0.5) {
    return "#ff9";
  } else if (val < size * 0.75) {
    return "#fc9";
  } else {
    return "#fa5";
  }
}

function createTimeSheetTable(data) {
  data.forEach(entry => {
    var typeURL;
    if (entry.type === 'pullrequest') typeURL = 'pull';
    if (entry.type === 'issue') typeURL = 'issues';
    var link = 'https://github.com/HGustavs/LenaSYS/' + typeURL + '/' + entry.reference;
    entry['link'] = link;
  });

  var tabledata = {
    tblhead: {
      week: "Week",
      day: "Date",
      type: "Type",
      reference: "Reference",
      comment: "Comment",
      link: "Link"
    },
    tblbody: data,
    tblfoot: {}
  };
  var colOrder = ["week", "day", "type", "reference", "comment", "link"];
  myTable = new SortableTable({
    data: tabledata,
    tableElementId: "contribTsTable",
    renderCellCallback: renderCell,
    renderSortOptionsCallback: renderSortOptions,
    columnOrder: colOrder,
    freezePaneIndex: 4,
    hasRowHighlight: false,
    hasMagicHeadings: false,
    hasCounterColumn: false
  });

  // Render table only if there is tabledata
  if(tabledata.tblbody != null || tabledata.tblbody != undefined) {
    myTable.renderTable();
  }
}

function renderCell(col, celldata, cellid) {
  var str = "UNK";
  obj = celldata;
  if (col === 'link') {
    str = "<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>";
    str += "<a href='" + obj + "' target='_blank'>Github</a></span></div>";
  } else if (col === 'week' || col === 'reference') {
    str = `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>${parseInt(obj)}</span></div>`;
  } else {
    str = `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>${obj}</span></div>`;
  }
  return str;
}

function renderSortOptions(col, status, colname) {
  str = "";
  if (status == -1) {
    str += `<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"${col}\",0)'>
    ${colname}</span>`;
  } else if (status == 0) {
    str += `<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"${col}\",1)'>
    ${colname}<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>`;
  } else {
    str += `<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"${col}\",0)'>
    ${colname}<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>`;
  }
  return str;
}

function renderAllRankSortOptions(col, status, colname) {

  str = "";
  if (status == -1) {
    str += `<span class='sortableHeading' onclick='allRankTable.toggleSortStatus(\"${col}\",0)'>
    ${colname}</span>`;
  } else if (status == 0) {
    str += `<span class='sortableHeading' onclick='allRankTable.toggleSortStatus(\"${col}\",1)'>
    ${colname}<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>`;
  } else {
    str += `<span class='sortableHeading' onclick='allRankTable.toggleSortStatus(\"${col}\",0)'>
    ${colname}<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>`;
  }
  return str;
}

function selectuser() {
  AJAXService("get", {
    userid: document.getElementById('userid').value
  }, "CONTRIBUTION");
}

var momentexists = 0;
var resave = false;

function returnedSection(data) {
  if (Object.keys(data).length === 2) {
    var div = document.getElementById('hourlyGraph');
    div.innerHTML = renderCircleDiagram(data);
    return;
  }
  retdata = data;
  if (data['debug'] != "NONE!") {
    if (data['debug'] != "TIMESHEET") {
      alert(data['debug']);
    }
    console.log("No timesheet table was found in the database.")
  }

  contribDataArr = [];

  var str = "";

  str += "<div id='contributionContainer' class='contributionSort'>";
  str += `<input type='button' id='allBtn' value='All' class='submit-button title='All' 
  onclick='statSort(value)'onmouseout='hideTooltip(this)'></input>`;
  str += `<input type='button' id='basicBtn' value='Basic' class='submit-button title='Basic'
  onclick='statSort(value)'onmouseout='hideTooltip(this)'></input>`;
  str += `<input type='button' id='chartsBtn' value='Charts' class='submit-button title='Charts'
  onclick='statSort(value)' onmouseout='hideTooltip(this)'></input>`;
  str += `<input type='button' id='contributionBtn' value='Contribution' class='submit-button title='Contribution'
  onclick='statSort(value)' onmouseout='hideTooltip(this)'></input>`;
  
  
  //Dynamically loads the year selection list based on folders in ../../contributionDBs/
  str += `<select id='yearBtn' class='submit-button'
  onclick='statSort(value)'onchange='courseSelection(value)'>
  <option value="ChooseY">Choose Year</option>`;

  // Add option for each year folder
  if (data['directoriesYear'][0] !== null){
    for(i=0;i<data['directoriesYear'].length;i++){
      courseFileArr.push(data['allCoursesPerYear'][i]); // Keep file paths
      str += '<option value=' + i + '>'; // Array pos
      str += data['directoriesYear'][i]; // Year
      str +=`</option>`;
    }
  }
  str +=`</select>`;

  str += `<select id='courseBtn' class='submit-button'
  onclick='statSort(value)'onchange='courseDBCollection(value)'>
  <option value="ChooseC">Choose Course</option></select>`;

  str += "</div>"; 
 

  localStorage.setItem('GitHubUser', data['githubuser'])
     str+="<p>";
     if(data['allusers'].length>0){
         str+="<select id='userid' onchange='selectuser();'>";
         str+="<option>"+localStorage.getItem('GitHubUser')+"</option>";
         for(i=0;i<data['allusers'].length;i++){
           if(data['allusers'][i] != localStorage.getItem('GitHubUser')){
             str+="<option>"+data['allusers'][i]+"</option>";
           }
         }
         str+="</select>";
      }
     str+="</p>";

  str += "<h2 class='section'>Project statistics for GitHub user: " + data['githubuser'] + "</h2>";

  createAllRankTable(buildAllRankData(data));
  createRankTable(buildRankData(data));
  createGitHubcontributionTable(buildContributionData(data));
  toggleAfterLocalStorage(data);
  createTimeSheetTable(data['timesheets']);
  
  createCommitChange(data['commitchange']);

  document.getElementById('barchart').innerHTML = renderBarDiagram(data);
  document.getElementById('lineDiagram+select').innerHTML = renderLineDiagram(data);
  document.getElementById('hourlyGraph').innerHTML = renderCircleDiagram(data);
  document.getElementById('commitDiagram').innerHTML = renderCommits(data);
  document.getElementById('content').innerHTML = str;
}

// Update the "Select Course" dropdown options
function courseSelection(pos){
  // Clear dropdown menu
  var dropdown = document.getElementById('courseBtn');
  dropdown.options.length=0;

  // Default option
  var opt = document.createElement('option');
  opt.value = "ChooseC";
  opt.innerHTML = "Choose Course";
  dropdown.appendChild(opt);

  // Get file paths
  for(i=0;i<courseFileArr[pos].length;i++)
  {
    // Create button
    var opt = document.createElement('option');
    var str = courseFileArr[pos][i];
    opt.value = str;
    opt.innerHTML = str.substring(str.lastIndexOf('/') + 1);
    dropdown.appendChild(opt);
  }
}


//Function to reload contributionservice with the path to the correct db file
function courseDBCollection(path){
  //AJAX has troubles with / so in the transfer it is replaced with % and then back to / in contributionservice.php
  path = path.replaceAll("/",'%');  

  AJAXService("get", { 
    dbPath: path
  }, "CONTRIBUTION");
  
}

function buildRankData(data) {
  var kindArr = ["Issue Creation", "Comment Creation", "Events Performed", "Lines of Code", "GIT Commit"];
  var numberArr = [data.issuerankno, data.commentrankno, data.eventrankno, data.rowrankno, data.commitrankno];
  var rankArr = [{
      rank: data.issuerank,
      amount: data.amountInCourse
    },
    {
      rank: data.commitrank,
      amount: data.amountInCourse
    },
    {
      rank: data.eventrank,
      amount: data.amountInCourse
    },
    {
      rank: data.rowrank,
      amount: data.amountInCourse
    },
    {
      rank: data.commitrank,
      amount: data.amountInCourse
    }
  ];
  var grpRankArr = [{
      rank: data.issuegrouprank,
      amount: data.amountInGroups
    },
    {
      rank: data.commitgrouprank,
      amount: data.amountInGroups
    },
    {
      rank: data.eventgrouprank,
      amount: data.amountInGroups
    },
    {
      rank: data.rowgrouprank,
      amount: data.amountInGroups
    },
    {
      rank: data.commitgrouprank,
      amount: data.amountInGroups
    }
  ];

  var rankingData = [];
  for (var i = 0; i < kindArr.length; i++) {
    var personalRanking = {
      kind: kindArr[i],
      number: numberArr[i],
      rank: rankArr[i],
      grpranking: grpRankArr[i]
    };
    rankingData.push(personalRanking)
  }
  return rankingData;
}

function createRankTable(data) {
  var tabledata = {
    tblhead: {
      kind: "Kind",
      number: "Number",
      rank: "Ranking",
      grpranking: "Group ranking"
    },
    tblbody: data,
    tblfoot: {}
  };
  var colOrder = ["kind", "number", "rank", "grpranking"];
  rankTable = new SortableTable({
    data: tabledata,
    tableElementId: "personalRankTable",
    renderCellCallback: rankRenderCell,
    renderSortOptionsCallback: renderSortOptions,
    columnSum:["number","rank","grpranking"],
    columnSumCallback: makeSumPersonalRank,
    columnOrder: colOrder,
    freezePaneIndex: 4,
    hasRowHighlight: false,
    hasMagicHeadings: false,
    hasCounterColumn: false,
    hasFooter: true
  });
  rankTable.renderTable();
}

function rankRenderCell(col, celldata, cellid) {
  var str = "";
  if (col === 'kind' || col === 'number') {
    str = `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>${celldata}</span></div>`;
  } else if (col === 'rank' || col === 'grpranking') {
    str += "<div style='background-color:" + intervaltocolor(celldata.amount, celldata.rank) + ";'>"
    str += "<div><span style='margin:0 4px;flex-grow:1;'>" + celldata.rank + "</span></div></div>";
  } else {
    str = `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>${obj}</span></div>`;
  }
  return str;
}

function buildContributionData() {
  var data = retdata['weeks'];
  var contribData = [];

  for (var i = 0; i < data.length; i++) {
    var projectWeek = {
      weeks: data[i].weekno,
      dates: {
        weekStart: data[i].weekstart,
        weekEnd: data[i].weekend
      },
      codeContribution: {
        files: data[i].files
      },
      githubContribution: {
        comments: data[i].comments,
        commits: data[i].commits,
        events: data[i].events,
        issues: data[i].issues
      }
    };

    contribData.push(projectWeek);
  }
  return contribData;
}

function createGitHubcontributionTable(data) {
  var tabledata = {
    tblhead: {
      weeks: "Week",
      dates: "Dates",
      codeContribution: "Code Contribution",
      githubContribution: "GitHub Contribution"
    },
    tblbody: data,
    tblfoot: {}
  };
  var colOrder = ["weeks", "dates", "codeContribution", "githubContribution"];
  ghContibTable = new SortableTable({
    data: tabledata,
    tableElementId: "contribGithHubContribTable",
    renderCellCallback: renderCellForghContibTable,
    renderSortOptionsCallback: renderSortOptions, 
    columnOrder: colOrder,
    freezePaneIndex: 4,
    hasRowHighlight: false,
    hasMagicHeadings: false,
    hasCounterColumn: false
  });
  ghContibTable.renderTable();
}

function renderCellForghContibTable(col, celldata, cellid) {
  var str = "";
 
  obj = celldata;
  var rowNr = cellid.charAt(1);
  if (col === 'weeks') {
    str = `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>
    ${parseInt(obj)}</span></div>`;
  } else if (col === 'dates') {
    str = `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>
    ${obj.weekStart} - ${obj.weekEnd}</span></div>`;
  } else if (col === 'codeContribution') {
    for (var j = 0; j < obj.files.length; j++) {
      var file = obj.files[j];
      str += "<a href='https://github.com/HGustavs/LenaSYS/blame/" + file.path + file.filename + "'>";
      str += "<div class='contrib'>";
      str += "<div class='contribheading'";
      str += "<span class='contribpath'>" + file.path + "</span>";
      str += "<span class='contribfile'>" + file.filename + "</span>";
      str += "</a>";
      str += "<br><span>";
      str += file.lines + " lines";
      str += "</span>";
      str += "</div>";
      str += "</div>";
    }

  } else if (col === 'githubContribution') {
     if (obj.issues.length > 0 || obj.comments.length > 0 || obj.events.length > 0 || obj.comments.length > 0) {
       str += "<div class='githubContribution'>";
       if(obj.commits.length > 0){
         str += `<div id='ghCommits' onclick='toggleContributionTable(this)' 
         class='contribheading' style='cursor:pointer;'><span>Made ${obj.commits.length} commit(s).</span>`;
         str += "<div id='ghCommits"+rowNr+"' style='pointer-events:auto' class='contribcontent'>";
           for (j = 0; j < obj.commits.length; j++) {
             var message = obj.commits[j].message;
             var hash = obj.commits[j].cid;
             str += `<span><a class="commitLink" onmouseover='showCommits(this, \"${"cid: " + hash}\");' onmouseout="hideCommits(this)" onclick='keepContribContentOpen(event)' 
             target='_blank' href='https://github.com/HGustavs/LenaSYS/commit/${hash}'>${message}</a></span>`;
           }
           str += "</div>";
           str += "</div>";
       }
       if (obj.issues.length > 0) {
          str += `<div id='ghIssues' onclick='toggleContributionTable(this)' 
          class='contribheading' style='cursor:pointer;'><span>Created ${obj.issues.length} issue(s).</span>`;
          str += "<div id='ghIssues"+rowNr+"' class='contribcontent'>";
          for (j = 0; j < obj.issues.length; j++) {
            var issue = obj.issues[j];
            var issuestr = issue.issueno + " " + issue.title;
            str += `<span><a onclick='keepContribContentOpen(event)' target='_blank' 
            href='https://github.com/HGustavs/LenaSYS/issues/${issue.issueno.substr(1)}'>${issuestr}</a></span>`;
          }
          str += "</div>";
          str += "</div>";
       }
       if (obj.comments.length > 0) {
          str += `<div id='ghComments' onclick='toggleContributionTable(this)' 
          class='contribheading' style='cursor:pointer;'><span>Made ${obj.comments.length} comment(s).</span>`;
          str += "<div id='ghComments"+rowNr+"' class='contribcontent'>";
            for (j = 0; j < obj.comments.length; j++) {
              var comment = obj.comments[j];
              var issuestr = comment.issueno + " " + comment.content;
              str += `<span><a onclick='keepContribContentOpen(event)' target='_blank' 
              href='https://github.com/HGustavs/LenaSYS/issues/${comment.issueno.substr(1)}'>${issuestr}</a></span>`;
            }
          str += "</div>";
          str += "</div>";
       }
       if (obj.events.length > 0) {
         var totalAmountEvents = 0;
         for (var j = 0; j < obj.events.length; j++) {
           totalAmountEvents += parseInt(obj.events[j].cnt);
         }
         str += `<div id='ghEvents' onclick='toggleContributionTable(this)'
         class='contribheading' style='cursor:pointer;'>
         <span>Performed ${totalAmountEvents} event(s).</span>`;
         str += "<div id='ghEvents"+rowNr+"' class='contribcontent'>";
         for (var j = 0; j < obj.events.length; j++) {
           var eve = obj.events[j];
           str += "<span>" + eve.kind + " " + eve.cnt + "</span>";
         }
         str += "</div>";
         str += "</div>";
       }
     }
     str += "</div>";
  } else {
    str = `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>${obj}</span></div>`;
  }
  return str;
}

function createAllRankTable(data){
  var tabledata = {
		tblhead:{
      login:"Login",
			eventrank:"Total events",
			commentrank:"Total comments",
			locrank:"Total lines of code",
      commitrank:"Total commits"
		},
		tblbody: data,
		tblfoot:{}
  };
	var colOrder=["login","eventrank","commentrank","locrank","commitrank"];
	allRankTable = new SortableTable({
		data:tabledata,
    tableElementId:"allRankTable",
		renderCellCallback:allRankRenderCell,
		renderSortOptionsCallback:renderAllRankSortOptions,
    columnSum:["eventrank","commentrank","locrank","commitrank"],
    columnSumCallback: makeSumAllRank,
		columnOrder:colOrder,
		freezePaneIndex:4,
		hasRowHighlight:false,
		hasMagicHeadings:false,
		hasCounterColumn:true,
    hasFooter:true
	});
	allRankTable.renderTable();
}

function makeSumAllRank(col,value,row){
  if (value == "UNK" || value == "NOT FOUND"){
    return 0;
  } else {
    return parseFloat(value)
  }
  return 0;
}

function makeSumPersonalRank(col,value,row){
  if(col == "number"){
    if (value == "UNK" || value == "NOT FOUND") {
      return 0;
    } else {
      return parseFloat(value);
    }
  } else if(col == "rank") {
    if (value.rank == "UNK" || value.rank == "NOT FOUND") {
      var retVal = retdata.amountInCourse/5;
      return retVal;
    } else {
      var retVal = value.rank/5;
      return retVal;
    }
  } else if(col == "grpranking") {
    if (value.rank == "UNK" || value.rank == "NOT FOUND") {
      var retVal = retdata.amountInGroups/5;
      return retVal;
    } else {
      var retVal = value.rank/5;
      return retVal;
    }
  }
	return 0;
}

/*
  This function is used to get the values from localStorage and toggles the tabs
  in the table after it.
*/
function toggleAfterLocalStorage(data){
  var nrOfWeeks = data['weeks'].length;
  var toggledValues = JSON.parse(localStorage.getItem('contribToggleArr'));
  var element;
  var status;
  for(var i=0; i<nrOfWeeks; i++){
    var contributionCounter = Object.keys(toggledValues[i]);
    for(var j=0; j<contributionCounter.length;j++){

      if(j == 0){
        element = document.getElementById("ghCommits"+i);
        status = toggledValues[i].commit;
      }else if(j == 1){
        element = document.getElementById("ghIssues"+i);
        status = toggledValues[i].issues;
      }else if(j == 2){
        element = document.getElementById("ghComments"+i);
        status = toggledValues[i].comments;
      }else if(j == 3){
        element = document.getElementById("ghEvents"+i);
        status = toggledValues[i].events;
      }
      if(!(element == null)){
        showMoreContribContent(element.id,status);
      }
    }
  }
}

//Toggles the show/hide values in lovalstorage.
function toggleContributionTable(element){
  if(element.tagName.toLocaleLowerCase() == "div"){
    var clickedDiv = element.lastChild;
    var tableCellId = element.lastChild.id[element.lastChild.id.length-1]; //fetch the weekNr from the end of the element id.
    var localStorageArrStr = localStorage.getItem('contribToggleArr'); //Get the values from localstorage.
    var togglevalues = JSON.parse(localStorageArrStr);
    var status;

    if(clickedDiv.id == "ghCommits"+tableCellId){
      if(togglevalues[tableCellId].commit == 1){
        togglevalues[tableCellId].commit = 0;
      }else{
        togglevalues[tableCellId].commit = 1;
      }
      status = togglevalues[tableCellId].commit;
    }else if(clickedDiv.id == "ghIssues"+tableCellId){
      if(togglevalues[tableCellId].issues == 1){
        togglevalues[tableCellId].issues = 0;
      }else{
        togglevalues[tableCellId].issues = 1;
      }
      status = togglevalues[tableCellId].issues;
    }else if(clickedDiv.id == "ghComments"+tableCellId){
      if(togglevalues[tableCellId].comments == 1){
        togglevalues[tableCellId].comments = 0;
      }else{
        togglevalues[tableCellId].comments = 1;
      }
      status = togglevalues[tableCellId].comments;
    }else if(clickedDiv.id == "ghEvents"+tableCellId){
      if(togglevalues[tableCellId].events == 1){
        togglevalues[tableCellId].events = 0;
      }else{
        togglevalues[tableCellId].events = 1;
      }
      status = togglevalues[tableCellId].events;
    }
    showMoreContribContent(element.lastChild.id,status);
    localStorage.setItem('contribToggleArr', JSON.stringify(togglevalues)); //save the changed values to localStorage.
  }else{

  }
}

//Hide or show more content.
function showMoreContribContent(id,status){
    if(status == 1){
      document.getElementById(id).classList.add('contribcontentToggle')
    }else{
      document.getElementById(id).classList.remove('contribcontentToggle')
    }
}

//Loads or Create a default localStorage if localStorage doesn't exists. Used onload.
function loadContribFormLocalStorage(){
  if(localStorage.getItem('contribToggleArr') == null){
    localStorage.setItem('contribToggleArr', JSON.stringify(createDefault()));
  }
}

//creates the default localStorage values. All tabs should be open from start.
function createDefault(){
  var contibArr = [];
  for(var i =0; i<10; i++){ // 10 represents 10 weeks in the course.
    var values = {
      commit:1,
      issues:1,
      comments:1,
      events:1
    }
    contibArr.push(values);
  }
  return contibArr;
}

//This function prevents the toggle from happening when the links is is clicked.
function keepContribContentOpen(e){
  e.stopPropagation();
}

/*
  We cant assume that the users will be on exactly the same position in different
  databases tables. This function is implemented to handle cases where the user information
  is on different rows in different database tables.
*/
function buildAllRankData(data){
  var rankData = [];
  var nextUser;
  var usersData;
  var positionTracker;
  for(var i =0; i<data.allusers.length; i++){
    var allRanks = {}
    allRanks.login = data.allusers[i];
    nextUser = data.allusers[i];

//*************************
//Adding a allevent value.
//*************************
  if(data.alleventranks[i] != undefined){ // Checks if the row exist
    if(!checkIfDataContanisUser(nextUser,data.alleventranks[i])){ //checks if the data contains nextuser.
      positionTracker = checkForRightUser(nextUser,data.alleventranks); //If not check for the correct users content and store the position.
    }else{
      positionTracker = i; //The data contains the correct user. Stores the position.
    }
  }else{
    positionTracker = -1; // The user does not exist in the data.
  }
    if(positionTracker != -1){
      allRanks.eventrank = allRankContentSelection(nextUser, data.alleventranks[positionTracker]);
    }else{
      allRanks.eventrank = 0; // If the user does not have any data display 0.
    }
  //*************************
  //Adding a allcomment value.
  //*************************
    if(data.allcommentranks[i] != undefined){ // Checks if the row exist
      if(!checkIfDataContanisUser(nextUser,data.allcommentranks[i])){ //checks if the data contains nextuser.
        positionTracker = checkForRightUser(nextUser,data.allcommentranks); //If not check for the correct users content and store the position.
      }else{
        positionTracker = i; //The data contains the correct user. Stores the position.
      }
    }else{
      positionTracker = -1; // The user does not exist in the data.
    }
      if(positionTracker != -1){
        allRanks.commentrank = allRankContentSelection(nextUser, data.allcommentranks[positionTracker]);
      }else{
        allRanks.commentrank = 0;  // If the user does not have any data display 0.
      }


    //*************************
    //Adding a all Lines of code value.
    //*************************
      if(data.allrowranks[i] != undefined){ // Checks if the row exist
        if(!checkIfDataContanisUser(nextUser,data.allrowranks[i])){ //checks if the data contains nextuser.
          positionTracker = checkForRightUser(nextUser,data.allrowranks); //If not check for the correct users content and store the position.
        }else{
          positionTracker = i; //The data contains the correct user. Stores the position.
        }
      }else{
        positionTracker = -1; // The user does not exist in the data.
      }
        if(positionTracker != -1){
          allRanks.locrank = allRankContentSelection(nextUser, data.allrowranks[positionTracker]);
        }else{
          allRanks.locrank = 0; // If the user does not have any data display 0.
        }

    //*************************
    //Adding a all Lines of code value.
    //*************************
      if(data.allcommitranks[i] != undefined){ // Checks if the row exist
        if(!checkIfDataContanisUser(nextUser,data.allcommitranks[i])){ //checks if the data contains nextuser.
          positionTracker = checkForRightUser(nextUser,data.allcommitranks); //If not check for the correct users content and store the position.
        }else{
          positionTracker = i; //The data contains the correct user. Stores the position.
        }
      }else{
        positionTracker = -1; // The user does not exist in the data.
      }
        if(positionTracker != -1){
          allRanks.commitrank = allRankContentSelection(nextUser, data.allcommitranks[positionTracker]);
        }else{
          allRanks.commitrank = 0; // If the user does not have any data. display 0.
        }

    rankData.push(allRanks);
  }
  return rankData;
}
function checkIfDataContanisUser(user,data){
  if(user === data[1]){
    return true;
  }else{
    return false;
  }
}
function checkForRightUser(user,data){
  var positionTracker;
  for(var j=0; j<data.length; j++){ //Checks if the user has content in the data.
    if(user ===  data[j][1]){
      positionTracker = j;
      break;
    }else{
      positionTracker = -1;
    }
  }
  return positionTracker;
}
function allRankContentSelection(user,data){
  if(data != undefined){ // Checks that the row exists
       if(data[0]!= undefined){  //checks that the value is not undefined.
        return data[0];
       }else {
         return 0;
       }
   }else{
     return 0;
   }
}
function allRankRenderCell(col,celldata,cellid){
  var str = "";
  if(col === 'login' || col === 'eventrank' || col === 'commentrank' || col === 'locrank' || col === 'commitrank' ){
    str = `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>${celldata}</span></div>`;
  }
  return str;
}


function hideTooltip() {
  var childrens = document.getElementById("contributionContainer").children;
    for(i = 0; i < childrens.length; i++) {
      if(childrens[i].classList.contains('contribToolTip')) {
        document.getElementById("contributionContainer").removeChild(childrens[i]);
      }
    }
}

function forceUserLogin()
{
      /* 
      make sure the loginBox is generated before you run this function as 
      it queries for elements that exist in the loginbox and changes their properties
      */
      let loginBoxheader_login_close = document.querySelector("#login div.loginBoxheader div.cursorPointer");
			let loginBoxheader_forgot_close = document.querySelector("#newpassword div.loginBoxheader div.cursorPointer");




      let loginBoxheader_login_username_field = document.querySelector("#username");
      loginBoxheader_login_username_field.setAttribute("Placeholder","Github username");

      let loginBoxheader_login_password_field = document.querySelector("#password");
      loginBoxheader_login_password_field.style.visibility = "hidden";

      let loginBoxButton = document.querySelector(".buttonLoginBox");
      loginBoxButton.setAttribute("onClick", "showNewGitLogin()");


			// prepare replacement of onclick
			loginBoxheader_login_close.removeAttribute("onClick"); // remove auto generated 
			loginBoxheader_forgot_close.removeAttribute("onClick"); // remove auto generated
			
			/*
      replace with a history back, this makes sure you dont get a blank page if you dont want to enter a password
      and instead press the button to close down the loginBox
      */
			loginBoxheader_login_close.setAttribute("onClick", "history.back();"); 
			loginBoxheader_forgot_close.setAttribute("onClick", "history.back();"); 


      // ----
      let FP = document.querySelector("#newpassword .forgotPw");
      FP.setAttribute("onClick", "toggleloginnewpass(); resetForceLogin();");

      // After the loginbox has been prepared/modified we display it to the user
      showLoginPopup();
      

}

function showNewGitLogin()
{
      let loginBoxheader_login_close = document.querySelector("#login div.loginBoxheader div.cursorPointer");
			let loginBoxheader_forgot_close = document.querySelector("#newpassword div.loginBoxheader div.cursorPointer");
      let loginBox = document.querySelector("#password");
      let loginBoxParent = loginBox.closest("tr");


      let loginBoxheader_login_username_field = document.querySelector("#username");
      let loginBoxheader_login_password_field = document.querySelector("#password");
      let loginBoxButton = document.querySelector(".buttonLoginBox");

      loginBoxheader_login_password_field.style.visibility = "";


      // create another loginbox and create a new id
      let originalId = loginBox.getAttribute("id");
      loginBox.setAttribute("id", originalId+1);
      loginBoxParent.outerHTML += loginBoxParent.innerHTML;
      loginBox = document.querySelector("#"+originalId+1);
      loginBox.setAttribute("id", originalId);


      let login_first = document.querySelector("#"+originalId);
      let login_second = document.querySelector("#"+originalId+1);

      login_first.setAttribute("placeholder", "Create new password");
      login_second.setAttribute("placeholder","Repeat new password");

      loginBoxButton.setAttribute("onClick", "");
      loginBoxButton.setAttribute("Value", "Create");

     
      



}

function resetForceLogin()
{
  let originalId = ("password");
  let login_second = document.querySelector("#"+originalId+1);
  if(login_second != null)
    login_second.remove();
  let loginBoxButton = document.querySelector(".buttonLoginBox");
  loginBoxButton.setAttribute("Value", "Login");
  forceUserLogin();

}
//Shows a div when hover the commit links
function showCommits(object, cid){
  var text = document.getElementById('commitDiv');
  text.style.display="block";
  text.innerHTML = commitChangeArray[cid];
  text.style.left = (document.documentElement.scrollLeft) + "px";
  text.style.top = (document.documentElement.scrollTop) + "px";
}
//Hide a div when hover the commit links
 function hideCommits(){
  document.getElementById('commitDiv').style.display="none";
 }

console.error
//Toggles the account request menu being open or closed.
function toggleAccountRequestPane(){
    if (document.getElementById("accountRequests-pane").className == "show-accountRequests-pane") {
        document.getElementById('accountReqmarker').innerHTML = "Account requests";
        document.getElementById("accountRequests-pane").className = "hide-accountRequests-pane";
    } else {
        document.getElementById('accountReqmarker').innerHTML = "Account requests";
        document.getElementById("accountRequests-pane").className = "show-accountRequests-pane";
       
    }
}

//Creates the html elements containing the commit changes
 function createCommitChange(data){
  var commitChange = data;
  var l = commitChange.length;
  
  for(var i = 0; i < l; i++){
    var str ="";
    var blameLength = commitChange[i]['blame'].length;
    var offset = 0;
    
    for(var j = 0; j < blameLength; j++){
      var offsetRunner = offset;
      //Adds blame string
      str += "<h3>" + commitChange[i]['blame'][j].filename + " - " + commitChange[i]['blame'][j].rowk + " lines changed </h3>";

      //Adds the code changes associated with that blame
      //console.log("before for offset: "+offset+" offsetRunner: " + offsetRunner);
      codeLength = commitChange[i]['blame'][j].rowk;
      for(var x = 0; x < codeLength; x++){
        //console.log("index: " + i + " x: "+ x + " code length: "+ codeLength + " offset: "+ offset);
        str += "<p><b>" + commitChange[i]['codechange'][x+offset].rowno + "</b> - " + commitChange[i]['codechange'][x+offset].code;
        offsetRunner++;
      }
      offset = offsetRunner;
      //console.log("After for "+offset);
    }
    //If a commit didn't change anything display this instead
    if(str == ""){
      str += "<h3>Commit overwritten or missing from database</h3>"
    }
    //Add the string to the array using the cid as index.
    commitChangeArray["cid: "+commitChange[i]['cid']] = str;
  }
 }


console.error

