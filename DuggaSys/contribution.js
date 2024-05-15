var querystring = parseGet();
var retdata;
var show;
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
}, "CONTRIBUTION");

var weeks;
var activities;
var firstSelWeek;
var secondSelWeek;
var updateShowAct = true;
var courseFileArr = [];

var commitChangeArray = [];
var isClickedElementBox = [false, false];
var cursorY;
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

//Returns a static list of holidays. This needs to be manually updated every few years when thae list runs out. It currently has dates all the way to 2025.
function getHolidays() {
  var holidays = new Array();
  //Year 2019 for testing purposes only
  holidays.push(getYYYYMMDD(new Date("2019-04-19")));
  holidays.push(getYYYYMMDD(new Date("2019-04-22")));
  holidays.push(getYYYYMMDD(new Date("2019-05-01")));
  holidays.push(getYYYYMMDD(new Date("2019-05-30")));
  holidays.push(getYYYYMMDD(new Date("2019-06-06")));
  holidays.push(getYYYYMMDD(new Date("2019-06-21")));
  //Year 2022
  holidays.push(getYYYYMMDD(new Date("2022-01-01")));
  holidays.push(getYYYYMMDD(new Date("2022-01-06")));
  holidays.push(getYYYYMMDD(new Date("2022-04-15")));
  holidays.push(getYYYYMMDD(new Date("2022-04-17")));
  holidays.push(getYYYYMMDD(new Date("2022-04-18")));
  holidays.push(getYYYYMMDD(new Date("2022-05-01")));
  holidays.push(getYYYYMMDD(new Date("2022-05-26")));
  holidays.push(getYYYYMMDD(new Date("2022-06-06")));
  holidays.push(getYYYYMMDD(new Date("2022-06-25")));
  holidays.push(getYYYYMMDD(new Date("2022-11-05")));
  holidays.push(getYYYYMMDD(new Date("2022-12-25")));
  holidays.push(getYYYYMMDD(new Date("2022-12-26")));
  //Year 2023
  holidays.push(getYYYYMMDD(new Date("2023-01-01")));
  holidays.push(getYYYYMMDD(new Date("2023-01-06")));
  holidays.push(getYYYYMMDD(new Date("2023-04-07")));
  holidays.push(getYYYYMMDD(new Date("2023-04-09")));
  holidays.push(getYYYYMMDD(new Date("2023-04-10")));
  holidays.push(getYYYYMMDD(new Date("2023-05-01")));
  holidays.push(getYYYYMMDD(new Date("2023-05-18")));
  holidays.push(getYYYYMMDD(new Date("2023-05-28")));
  holidays.push(getYYYYMMDD(new Date("2023-06-06")));
  holidays.push(getYYYYMMDD(new Date("2023-06-24")));
  holidays.push(getYYYYMMDD(new Date("2023-11-04")));
  holidays.push(getYYYYMMDD(new Date("2023-12-24")));
  holidays.push(getYYYYMMDD(new Date("2023-12-25")));
  holidays.push(getYYYYMMDD(new Date("2023-12-26")));
  holidays.push(getYYYYMMDD(new Date("2023-12-31")));
  //Year 2024
  holidays.push(getYYYYMMDD(new Date("2024-01-01")));
  holidays.push(getYYYYMMDD(new Date("2024-01-06")));
  holidays.push(getYYYYMMDD(new Date("2024-03-29")));
  holidays.push(getYYYYMMDD(new Date("2024-03-31")));
  holidays.push(getYYYYMMDD(new Date("2024-04-01")));
  holidays.push(getYYYYMMDD(new Date("2024-05-01")));
  holidays.push(getYYYYMMDD(new Date("2024-05-09")));
  holidays.push(getYYYYMMDD(new Date("2024-05-19")));
  holidays.push(getYYYYMMDD(new Date("2024-06-06")));
  holidays.push(getYYYYMMDD(new Date("2024-06-22")));
  holidays.push(getYYYYMMDD(new Date("2024-11-02")));
  holidays.push(getYYYYMMDD(new Date("2024-12-24")));
  holidays.push(getYYYYMMDD(new Date("2024-12-25")));
  holidays.push(getYYYYMMDD(new Date("2024-12-26")));
  holidays.push(getYYYYMMDD(new Date("2024-12-31")));
  
  //Year 2025S
  holidays.push(getYYYYMMDD(new Date("2025-01-01")));
  holidays.push(getYYYYMMDD(new Date("2025-01-06")));
  holidays.push(getYYYYMMDD(new Date("2025-04-18")));
  holidays.push(getYYYYMMDD(new Date("2025-04-20")));
  holidays.push(getYYYYMMDD(new Date("2025-04-21")));
  holidays.push(getYYYYMMDD(new Date("2025-05-01")));
  holidays.push(getYYYYMMDD(new Date("2025-05-29")));
  holidays.push(getYYYYMMDD(new Date("2025-06-06")));
  holidays.push(getYYYYMMDD(new Date("2025-06-08")));
  holidays.push(getYYYYMMDD(new Date("2025-06-21")));
  holidays.push(getYYYYMMDD(new Date("2025-11-01")));
  holidays.push(getYYYYMMDD(new Date("2023-12-24")));
  holidays.push(getYYYYMMDD(new Date("2025-12-25")));
  holidays.push(getYYYYMMDD(new Date("2025-12-26")));
  holidays.push(getYYYYMMDD(new Date("2025-12-31")));

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
    var commits = parseInt(day["commits"]);
    var events = parseInt(day["events"]);
    var comments = parseInt(day["comments"]);
    var loc = parseInt(day["loc"]);
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
  
  var str = "<h2 style='padding-left:5px'>Weekly bar chart</h2>";
  str += "<p style 'padding-top:10px'>Showing activities for " + dailyCount[0][0] + " - " + dailyCount[7*numOfWeeks-1][0] + " </p>";
  str += "<div style='overflow-x:scroll;'>"
  str += `<svg  class='chart fumho' width='1300' height='250' aria-labelledby='title desc' role='img'>`;
  // str += `<svg  class='chart fumho' width='1300' height='250' aria-labelledby='title desc' role='img'>`;

  // Reuse old code. A new class and an if state were created to make the stipes vary between two shades of gray. 
  for (var i = 0; i < numOfWeeks; i++) {
    if(i % 2 == 1) {
      str += `<rect class='WeeklyBarChartEven' x='${(65 + 120 * i)}' y='0%' width='120' height='100%';' />`    
    } else {
      str += `<rect class='WeeklyBarChartOdd' x='${(65 + 120 * i)}' y='0%' width='120' height='100%';' />` 
    }
  }

  // str += "<line class='WeeklyBarChartText' style='stroke:green;' x1='65' x2='65' y1='5%' y2='220'></line>";
  str += "<line class='WeeklyBarChartLine' x1='65' x2='100%' y1='220' y2='220'></line>";

  // Calculates and render scale numbers on the left
  var decimals = Math.pow(10, Math.round(maxDayCount).toString().length - 2);
  var highRange = Math.ceil(maxDayCount / decimals) * decimals;
  for (var i = 0; i < 5; i++) {
    var range = (highRange / 4) * i;
    if (highRange > 100) {
      range = Math.round(range);
    }
    
    str += `<text class'WeeklyBarChartNumber;'  x='${(62 - (range.toString().length * 9))}' y='${(225 - (range / highRange) * 200)}'>${range}</text>`;
    str += `<line style='stroke:#ccc;' x1='65' x2='100%' y1='${(220 - (range / highRange) * 200)}'
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
    
    str += "<text class='WeeklyBarChartText' x='" + (120 * i + 100) + "' y='240'>week " + (i + 1) + "</text>";
    str += "</g>";
  }
  str += '</svg>';
  str += '</div>';
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
    
    // Reuse old code. A new class and an if state were created to make the stipes vary between two shades of gray. 
    if(i % 2 == 1) {
      str += `<rect x='${(-300 + 120 * i)}' y='0%' width='120' height='100%' class='commitTreeBarsEven';' />`

    } else {
      str += `<rect x='${(-300 + 120 * i)}' y='0%' width='120' height='100%' class='commitTreeBarsOdd';' />`
    }
    str += "<text class='commitTreeText' x='" + (120 * i + -260) + "' y='20'>Week " + (i + 1) + "</text>";
  }
  str += "<line class='commitTreeLine' ' x1='-300' x2='200%' y1='25' y2='25'></line>";

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
  console.log(daycounts);
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
  str = `<svg class='lineDiagramDark' viewBox='0 0 580 250' class='lineChart' style='max-width:900px; min-width:700px;margin-top:10px;'>`;

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

      events = parseInt(daycounts[dateString].events);
      commits = parseInt(daycounts[dateString].commits);
      loc = parseInt(daycounts[dateString].loc);
      comments = parseInt(daycounts[dateString].comments);

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
        var events = parseInt(daycounts[dateString].events);
        var commits = parseInt(daycounts[dateString].commits);
        var loc = parseInt(daycounts[dateString].loc);
        var comments = parseInt(daycounts[dateString].comments);

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
        userid: localStorage.getItem('GitHubUser'),
        //userid: "HGustavs",
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
  if (updateShowAct || firstSelWeek == null && secondSelWeek == null) {
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
  console.log(activities);
  var str = "";
  var hoursComments = {};
  var hoursCommits = {};
  var hoursIssues = {};
  activities.forEach(entry => {
    if (entry.type == "comment"){
      var keys = Object.keys(hoursComments);
    }
    else if (entry.type == "commit"){
      var keys = Object.keys(hoursCommits);
    }
    else if (entry.type == "issue"){
      var keys = Object.keys(hoursIssues);
    }
    var hour = entry.time;
    var found = false;

    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == hour) {
        if (entry.type == "comment"){
          hoursComments[hour] += 1;
        }
        else if (entry.type == "commit"){
          hoursCommits[hour] += 1;
        }
        else if (entry.type == "issue"){
          hoursIssues[hour] += 1;
        }
        found = true;
        return;
      }
    }
    if (!found) {
      if (entry.type == "comment"){
        hoursComments[hour] = 1;
      }
      else if (entry.type == "commit"){
        hoursCommits[hour] = 1;
      }
      else if (entry.type == "issue"){
        hoursIssues[hour] = 1;
      }
    }

  });
  commentsCounted = [];
  commitsCounted = [];
  issuesCounted =[];
  activities.forEach(entry => {
    if(entry.type== "comment"){
      commentsCounted.push(entry);
    }
    if(entry.type== "commit"){
      commitsCounted.push(entry);
    }
    if(entry.type== "issue"){
      issuesCounted.push(entry);
    }});

  var uniquePointsIssues = [];
  var uniquePointsCommits = [];
  var uniquePointsComments = [];
  var activityTypesComments = {
    times: {},
    types: {}
  };
  var activityTypesCommits = {
    times: {},
    types: {}
  };
  var activityTypesIssues = {
    times: {},
    types: {}
  };
  const RADIUS = 220;
  const BASELINE = 75;
  const MIDDLE = 243;

  
  activities.forEach(entry => {
    if(entry.type== "comment"){
      //Cast integer to string
      var hourString = entry.time.toString();
      var hour = hourString.substr(0, 2);
      var houroffset = parseInt(hour) + 6;
      var type = entry.type;
      var activityCount = commentsCounted.length;
      var percentage = hoursComments[hour] / activityCount;
      
      var angleFactor = (RADIUS * percentage) + BASELINE+30;
      angleFactor > RADIUS ? angleFactor = RADIUS : angleFactor = angleFactor;
      var xCoord = (Math.cos(toRadians(houroffset * 15)) * angleFactor) + MIDDLE;
      var yCoord = (Math.sin(toRadians(houroffset * 15)) * angleFactor) + MIDDLE;

      if (!Object.keys(activityTypesComments.times).includes(hour)) {
        activityTypesComments.times[hour] = {};
        uniquePointsComments.push([xCoord, yCoord, hour, percentage, type]);
      }
      if (!Object.keys(activityTypesComments.types).includes(type)) activityTypesComments.types[type] = 0;
      if (!Object.keys(activityTypesComments.times[hour]).includes(type)) activityTypesComments.times[hour][type] = 0;
      activityTypesComments.types[type] += 1;
      activityTypesComments.times[hour][type] += 1;
    }

    if(entry.type== "commit"){
      //Cast integer to string
      var hourString = entry.time.toString();
      var hour = hourString.substr(0, 2);
      var houroffset = parseInt(hour) + 6;
      var type = entry.type;
      var activityCount = commitsCounted.length;
      var percentage = hoursCommits[hour] / activityCount;
      //console.log(percentage, hours[hour], activityCount );
      var angleFactor = (RADIUS * percentage) + BASELINE+15;
      angleFactor > RADIUS ? angleFactor = RADIUS : angleFactor = angleFactor;
      var xCoord = (Math.cos(toRadians(houroffset * 15)) * angleFactor) + MIDDLE;
      var yCoord = (Math.sin(toRadians(houroffset * 15)) * angleFactor) + MIDDLE;
  
      if (!Object.keys(activityTypesCommits.times).includes(hour)) {
        activityTypesCommits.times[hour] = {};
        uniquePointsCommits.push([xCoord, yCoord, hour, percentage, type]);
      }else{
        uniquePointsCommits.push([xCoord, yCoord, hour, percentage, type]);
      }
      if (!Object.keys(activityTypesCommits.types).includes(type)) activityTypesCommits.types[type] = 0;
      if (!Object.keys(activityTypesCommits.times[hour]).includes(type)) activityTypesCommits.times[hour][type] = 0;
      activityTypesCommits.types[type] += 1;
      activityTypesCommits.times[hour][type] += 1;
      }

    if(entry.type== "issue"){
      //Cast integer to string
      var hourString = entry.time.toString();
      var hour = hourString.substr(0, 2);
      var houroffset = parseInt(hour) + 6;
      var type = entry.type;
      var activityCount = issuesCounted.length;
      var percentage = hoursIssues[hour] / activityCount;
      var angleFactor = (RADIUS * percentage) + BASELINE;
      angleFactor > RADIUS ? angleFactor = RADIUS : angleFactor = angleFactor;
      var xCoord = (Math.cos(toRadians(houroffset * 15)) * angleFactor) + MIDDLE;
      var yCoord = (Math.sin(toRadians(houroffset * 15)) * angleFactor) + MIDDLE;
  
      if (!Object.keys(activityTypesIssues.times).includes(hour)) {
        activityTypesIssues.times[hour] = {};
        uniquePointsIssues.push([xCoord, yCoord, hour, percentage, type]);
      }else{
        uniquePointsIssues.push([xCoord, yCoord, hour, percentage, type]);
      }
      if (!Object.keys(activityTypesIssues.types).includes(type)) activityTypesIssues.types[type] = 0;
      if (!Object.keys(activityTypesIssues.times[hour]).includes(type)) activityTypesIssues.times[hour][type] = 0;
      activityTypesIssues.types[type] += 1;
      activityTypesIssues.times[hour][type] += 1;
      }
  });


  uniquePointsComments.sort(([a, b, c], [d, e, f]) => c - f);
  if (uniquePointsComments.length > 2) {
    str += "<polygon class='activityPolygon "+uniquePointsComments[0][4]+"' points='";
    for (var i = 0; i < uniquePointsComments.length; i++) {
      str += (uniquePointsComments[i][0] + 5) + "," + (uniquePointsComments[i][1] + 5) + " ";
    }
    str += `250,250' onmouseover='showAllActivity(event, ${JSON.stringify(activityTypesComments)})' onmouseout='hideActivityInfo()' />`;
  }
  uniquePointsComments.forEach(point => {
    var xCoord = point[0];
    var yCoord = point[1];
    var hour = point[2];
    var percentage = Math.round(point[3] * 100);
    var types = point[4];
    var values = Object.values(activityTypesComments.times[hour]);
    str += "<rect class='activitymarker " + types + "' width='7' height='7' x='" + xCoord + "' y='" + yCoord + "' onmouseover='showActivityInfo(event, ";
    str += "`" + types + "`, `" + hour + "`, " + percentage + ", " + JSON.stringify(activityTypesComments) + ")' onmouseout='hideActivityInfo()' />";
    console.log(JSON.stringify(activityTypesComments), "Comments");
  });
  


  uniquePointsCommits.sort(([a, b, c], [d, e, f]) => c - f);
  if (uniquePointsCommits.length > 2) {
    str += "<polygon class='activityPolygon "+uniquePointsCommits[0][4]+"' points='";
    for (var i = 0; i < uniquePointsCommits.length; i++) {
      str += (uniquePointsCommits[i][0] + 5) + "," + (uniquePointsCommits[i][1] + 5) + " ";
    }
    str += `250,250' onmouseover='showAllActivity(event, ${JSON.stringify(activityTypesCommits)})' onmouseout='hideActivityInfo()' />`;
  }
  uniquePointsCommits.forEach(point => {
    var xCoord = point[0];
    var yCoord = point[1];
    var hour = point[2];
    var percentage = Math.round(point[3] * 100);
    var types = point[4];
    var values = Object.values(activityTypesCommits.times[hour]);
    str += "<rect class='activitymarker " + types + "' width='7' height='7' x='" + xCoord + "' y='" + yCoord + "' onmouseover='showActivityInfo(event, ";
    str += "`" + types + "`, `" + hour + "`, " + percentage + ", " + JSON.stringify(activityTypesCommits) + ")' onmouseout='hideActivityInfo()' />";
  });



  uniquePointsIssues.sort(([a, b, c], [d, e, f]) => c - f);
  if (uniquePointsIssues.length > 2) {
    str += "<polygon class='activityPolygon "+uniquePointsIssues[0][4]+"' points='";
    for (var i = 0; i < uniquePointsIssues.length; i++) {
      str += (uniquePointsIssues[i][0] + 5) + "," + (uniquePointsIssues[i][1] + 5) + " ";
    }
    str += `250,250' onmouseover='showAllActivity(event, ${JSON.stringify(activityTypesIssues)})' onmouseout='hideActivityInfo()' />`;
  }
  uniquePointsIssues.forEach(point => {
    var xCoord = point[0];
    var yCoord = point[1];
    var hour = point[2];
    var percentage = Math.round(point[3] * 100);
    var types = point[4];
    var values = Object.values(activityTypesIssues.times[hour]);
    str += "<rect class='activitymarker " + types + "' width='7' height='7' x='" + xCoord + "' y='" + yCoord + "' onmouseover='showActivityInfo(event, ";
    str += "`" + types + "`, `" + hour + "`, " + percentage + ", " + JSON.stringify(activityTypesIssues) + ")' onmouseout='hideActivityInfo()' />";
  });

  return str;
  
}

/* The out-commented code below was the previous function that was used to show all the points and the polygon.*/
/* uniquePoints.forEach(point => {
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
} */

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
    str += `<span class='sortableHeading' tabindex='0' onclick='myTable.toggleSortStatus(\"${col}\",0)'>
    ${colname}</span>`;
  } else if (status == 0) {
    str += `<span class='sortableHeading' tabindex='0' onclick='myTable.toggleSortStatus(\"${col}\",1)'>
    ${colname}<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>`;
  } else {
    str += `<span class='sortableHeading' tabindex='0' onclick='myTable.toggleSortStatus(\"${col}\",0)'>
    ${colname}<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>`;
  }
  return str;
}

function renderAllRankSortOptions(col, status, colname) {

  str = "";
  if (status == -1) {
    str += `<span class='sortableHeading'tabindex='0' onclick='allRankTable.toggleSortStatus(\"${col}\",0)'>
    ${colname}</span>`;
  } else if (status == 0) {
    str += `<span class='sortableHeading' tabindex='0' onclick='allRankTable.toggleSortStatus(\"${col}\",1)'>
    ${colname}<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>`;
  } else {
    str += `<span class='sortableHeading' tabindex='0' onclick='allRankTable.toggleSortStatus(\"${col}\",0)'>
    ${colname}<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>`;
  }
  return str;
}

function renderRankSortOptions(col, status, colname) {
  str = "";
  if (status == -1) {
    str += `<span class='sortableHeading'tabindex='0' onclick='rankTable.toggleSortStatus(\"${col}\",0)'>
    ${colname}</span>`;
  } else if (status == 0) {
    str += `<span class='sortableHeading'tabindex='0' onclick='rankTable.toggleSortStatus(\"${col}\",1)'>
    ${colname}<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>`;
  } else {
    str += `<span class='sortableHeading' tabindex='0'onclick='rankTable.toggleSortStatus(\"${col}\",0)'>
    ${colname}<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>`;
  }
  return str;
}

function renderGitHubSortOptions(col, status, colname) {
  str = "";
  if (status == -1) {
    str += `<span class='sortableHeading' tabindex='0' onclick='ghContibTable.toggleSortStatus(\"${col}\",0)'>
    ${colname}</span>`;
  } else if (status == 0) {
    str += `<span class='sortableHeading'tabindex='0' onclick='ghContibTable.toggleSortStatus(\"${col}\",1)'>
    ${colname}<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>`;
  } else {
    str += `<span class='sortableHeading'tabindex='0' onclick='ghContibTable.toggleSortStatus(\"${col}\",0)'>
    ${colname}<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>`;
  }
  return str;
}

//compare function is called by sortableTable.js, used to order tables
function compare(a, b) {
  var col = sortableTable.currentTable.getSortcolumn();
  var status = sortableTable.currentTable.getSortkind(); // Get if the sort arrow is up or down.

	if(status==1){
		var tempA = a;
		var tempB = b;
	}else{
		var tempA = b;
		var tempB = a;
	}

  //If a column uses string the compare will work by default. If it uses an int make sure it really is an int otherwise do like if col == number
  //ghContibTable columns use arrays in the table so we need to handle them in a different way from other columns
  if(col == "number"){
    tempA = parseInt(tempA);
    tempB = parseInt(tempB);
  }

  if (col == "dates") {
    tempA = tempA['weekStart'];
    tempB = tempB['weekStart'];
  }else if (col == "codeContribution") {
    var countA = tempA['files'].length;
    var countB = tempB['files'].length;
    tempA = countA;
    tempB = countB;
  }else if(col == "githubContribution"){
    //Sorts column based on amount of 'things' that happened for that week
    var countA = tempA['comments'].length + tempA['commits'].length + tempA['events'].length + tempA['issues'].length;
    var countB = tempB['comments'].length + tempB['commits'].length + tempB['events'].length + tempB['issues'].length;
    tempA = countA;
    tempB = countB;
  }

  
	if (tempA > tempB) {
		return 1;
	} else if (tempA < tempB) {
		return -1;
	} else {
		return 0;
	}	
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
  str += `<input type='button' id='allBtn' value='All' class='submit-button' 
  onclick='statSort(value)'onmouseout='hideTooltip(this)'title='View all tables and charts'></input>`;
  str += `<input type='button' id='basicBtn' value='Basic' class='submit-button'
  onclick='statSort(value)'onmouseout='hideTooltip(this)'title='View basic statistics'></input>`;
  str += `<input type='button' id='chartsBtn' value='Charts' class='submit-button'
  onclick='statSort(value)' onmouseout='hideTooltip(this)'title='View only charts'></input>`;
  str += `<input type='button' id='contributionBtn' value='Contribution' class='submit-button'
  onclick='statSort(value)' onmouseout='hideTooltip(this)'title='View contribution data'></input>`;
  
  
  //Dynamically loads the year selection list based on folders in ../../contributionDBs/

  str += `<select id='yearBtn'
  onclick='statSort(value)'onchange='courseSelection(this)'title='Select year dropdown'>

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


  str += `<select id='courseBtn'
  onclick='statSort(value)'onchange='courseDBCollection(value)' title='Select course dropdown'>

  <option value="ChooseC">Choose Course</option></select>`;

  str += "</div>"; 
 

  localStorage.setItem('GitHubUser', data['githubuser'])
     str+="<p>";
     if(data['allusers'].length>0){
         str+="<select id='userid' onchange='selectuser();'>";
         str+="<option>Select Git user</option>";
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
  document.getElementById('overview').innerHTML = renderOverview(data);
  document.getElementById('content').innerHTML = str;
  
  //only create sidebar if the user is a superuser
  if(data['isSuperUser']) createSidebar();
}


/*  loop through all user and count all their blame lines
      once counted will loop and place the % of each file changed into a seperate array
  data[overview][0]=Bfile.id 
  data[overview][1]=Bfile.filename 
  data[overview][2]=Bfile.path
   data[overview][3]=Blame.blameuser 
   data[overview][4]=occurance //(count of how many times each file occurs in Blame grouped by Blame.Blameuser)
      */
function renderOverview(data){
  var values = Array()
  var picketuser = localStorage.getItem('GitHubUser');
  
    var total = 0;

    //count total for each user
    data['overview'].forEach(element =>{
      if(picketuser == element[3]) total =  total + parseInt(element[4]);
    });  
    
    //calculate % and place in array
    data['overview'].forEach(element =>{
      if(picketuser == element[3]) values.push(Array((parseInt(element[4]) / total), element[2], element[1], element[3]));
    });
  values.forEach(element =>{
    // console.log(element);
    // console.log(element.length);
  });

  var str = "<div class='container_overview' > ";

  values.forEach(element =>{
    console.log("element[2]:"+ element[2]);
    str += "<span  class='box_overview ";
    if((Math.floor(Math.random()*10) %4)==0) {
      str+="vertical_text";
    }
    str+= "' style='font-size:"+element[0]*5000+"%; width:fit-content; height: fit-content;'>"+element[2]+"</span>";
  });

  str += "</div> ";

  return str;
}

// Update the "Select Course" dropdown options
function courseSelection(elem){
  // Clear dropdown menu
  var dropdown = document.getElementById('courseBtn');
  dropdown.options.length=0;

  // Default option
  var opt = document.createElement('option');
  opt.value = "ChooseC";
  opt.innerHTML = "Choose Course";
  dropdown.appendChild(opt);

  // Get file paths
  var pos = elem.value;
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
    renderSortOptionsCallback: renderRankSortOptions,
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
      redDays: "Red Days",
      codeContribution: "Code Contribution",
      githubContribution: "GitHub Contribution"
    },
    tblbody: data,
    tblfoot: {}
  };
  var colOrder = ["weeks", "dates", "redDays", "codeContribution", "githubContribution"];
  ghContibTable = new SortableTable({
    data: tabledata,
    tableElementId: "contribGithHubContribTable",
    renderCellCallback: renderCellForghContibTable,
    renderSortOptionsCallback: renderGitHubSortOptions, 
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
    renderCellForghContibTable.weekStart = obj.weekStart;
    renderCellForghContibTable.weekEnd = obj.weekEnd;
  } else if (col === 'codeContribution') {
    for (var j = 0; j < obj.files.length; j++) {
      var file = obj.files[j];
      str += "<div class='contrib'>";
      str += "<div class='contribheading'>";
      str += "<a href='https://github.com/HGustavs/LenaSYS/blame/" + file.path + file.filename + "'>";
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
         str += "<div id='ghCommits"+rowNr+"' style='pointer-events:auto' class='contribcontent' onclick='keepContribContentOpen(event)'>";
           for (j = 0; j < obj.commits.length; j++) {
             var message = obj.commits[j].message;
             var hash = obj.commits[j].cid;
             str += `<span onclick='showCommits(this, \"${"cid: " + hash}\");'><img id='githubLink${rowNr}' class='githubLink${rowNr}' style='width:16px;display:none;' alt='githubLink icon' 
             title='open github page' src='../Shared/icons/githubLink-icon.png' target='_blank' href='https://github.com/HGustavs/LenaSYS/commit/${hash}' onclick='openGithubLink(this)'> ${message}</span>`;
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
            href='https://github.com/HGustavs/LenaSYS/issues/${issue.issueno}'>${issuestr}</a></span>`;
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
              href='https://github.com/HGustavs/LenaSYS/issues/${comment.issueno}'>${issuestr}</a></span>`;
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
  } else if(col == 'redDays'){
    var alphaPlus = new Date();
    var holidayList = getHolidays(alphaPlus);

    //Get a list of all red days this year and check if they belong on the current row
    //Based on row number. A certain row should only post a date if that date is on the same week as that row covers.
    var i = 0;
    //Extract values that were staticlly stored during the previous iteration of this function when a week cell was generated
    var time1 = String(renderCellForghContibTable.weekStart);
    var time2 = String(renderCellForghContibTable.weekEnd);

    //Extract all the important values from the two dates that we require
    var ObjYear1 = time1.substr(0,4);
    var ObjYear2 = time2.substr(0,4);
    var ObjMonth1 = time1.substr(5,2);
    var ObjMonth2 = time2.substr(5,2);
    var ObjDay1 = time1.substr(8,2);
    var ObjDay2 = time2.substr(8,2); 

    //Repeat for every holiday in the holiday list and check if that holiday is this week(The week of this cell)
    while(holidayList.length > i){ 
      var HolidayYear = holidayList[i].substr(0,4);
      var HolidayMonth = holidayList[i].substr(5,2);
      var HolidayDay = holidayList[i].substr(8,2);

      //Same Year all?
      if(ObjYear1 == HolidayYear && ObjYear2 == HolidayYear){
        //Same Month all?
        if(ObjMonth1 == HolidayMonth && ObjMonth2 == HolidayMonth){
          //Day is somewere in the correct range
          if(ObjDay1 <= HolidayDay && ObjDay2 >= HolidayDay){
            str += `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>
            ${holidayList[i]}</span></div>`
          }
        //Holiday is in one of the two months and on the right day?
        } else if (ObjMonth1 == HolidayMonth && ObjDay1 <= HolidayDay){
            str += `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>
            ${holidayList[i]}</span></div>`
        } else if (ObjMonth2 == HolidayMonth && ObjDay2 >= HolidayDay){
          str += `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>
          ${holidayList[i]}</span></div>`
        }
      } else if(ObjYear1 == HolidayYear && Number(ObjMonth1) == 12 && ObjDay1 <= HolidayDay){
        str += `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>
        ${holidayList[i]}</span></div>`
      } else if(ObjYear2 == HolidayYear && Number(ObjMonth2) == 1 && ObjDay2 >= HolidayDay){
        str += `<div style='display:flex;'><span style='margin:0 4px;flex-grow:1;'>
        ${holidayList[i]}</span></div>`
      }  
      i++;
    }
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
    //if the content is of the div ghCommits then hide or show githubLink image based on status.
    if(id.toString().includes('ghCommits')){
      var githubLinkString = "githubLink"+id.toString().replace('ghCommits','');
      if(status == 1){
        $('.'+githubLinkString).show();
      }else{
        $('.'+githubLinkString).hide();
      } 
    }
}

//Loads or Create a default localStorage if localStorage doesn't exists. Used onload.
function loadContribFormLocalStorage(){
  var user = localStorage.getItem('GitHubUser')
  if(localStorage.getItem('contribToggleArr') == null){
    localStorage.setItem('contribToggleArr', JSON.stringify(createDefault())); 
  }
}

//creates the default localStorage values. All tabs should be closed from start.
function createDefault(){
  var contibArr = [];

  for(var i =0; i<10; i++){ // 10 represents 10 weeks in the course.
    var values = {
      commit:0,
      issues:0,
      comments:0,
      events:0
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

//Shows a div when hover the commit links
function showCommits(object, cid){
  var text = document.getElementById('commitDiv');
  text.style.display="block";
  text.innerHTML = commitChangeArray[cid];
  text.style.left = (document.documentElement.scrollLeft) + "px";
  text.style.top = (document.documentElement.scrollTop+cursorY)/2 + "px";
}
//Hide a div when hover the commit links
 function hideCommits(){
  document.getElementById('commitDiv').style.display="none";
 }

//Redirects the user to the github page when pressing the github icon
function openGithubLink(btnobj){
  console.log(btnobj);
  link = $(btnobj).attr('href');
  window.open(link, "_blank");
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

document.addEventListener('keydown', function(event) {
	if(event.key === 'Escape'){
		toggleAccountRequestPane();
	}
});

$(document).mousedown(function (e) {
  cursorY = e.pageY;
  mouseDown(e);
});

$(document).mouseup(function (e) {
  mouseUp(e);
});

function mouseDown(e) {

  var box = $(e.target);
  // if() - the clicked element is one of the account request elements
  // else if() - the clicked element is a child of one of the show account request elements
  // else - the clicked element does not belong to account request
  if (box[0].classList.contains("show-accountRequests-pane") || box[0].classList.contains("accountRequests-pane-span") || box[0].classList.contains("hide-accountRequests-pane")) {
    isClickedElementBox[0] = true;
  } else if ((findAncestor(box[0], "show-accountRequests-pane") != null) &&
    (findAncestor(box[0], "show-accountRequests-pane").classList.contains("show-accountRequests-pane"))) {
    isClickedElementBox[0] = true;
  } else{
    isClickedElementBox[0] = false;
  }
  
  if (box[0].classList.contains("commitDiv")) {
    isClickedElementBox[1] = true;
  } else if ((findAncestor(box[0], "commitDiv") != null) &&
    (findAncestor(box[0], "commitDiv").classList.contains("commitDiv"))) {
    isClickedElementBox[1] = true;
  }else{
    isClickedElementBox[1] = false;
  }

}

function mouseUp(e) {
  //if - the user clicks something other than the account request pane.
  //else - the user clicks an element belonging to account request
  if ($('.accountRequests-pane') && !$('.accountRequests-pane').is(e.target) &&
  $('.accountRequests-pane').has(e.target).length === 0 && (!isClickedElementBox[0])) {
    //if account request pane is open then close it.
    if (document.getElementById("accountRequests-pane").className == "show-accountRequests-pane") {
      document.getElementById('accountReqmarker').innerHTML = "Account requests";
      document.getElementById("accountRequests-pane").className = "hide-accountRequests-pane";
    }
  }else{
    if ($(e.target)[0].classList.contains("hide-accountRequests-pane")) {
      document.getElementById('accountReqmarker').innerHTML = "Account requests";
      document.getElementById("accountRequests-pane").className = "show-accountRequests-pane";
    }
  }
  
  if ($('.commitDiv') && !$('.commitDiv').is(e.target) &&
  $('.commitDiv').has(e.target).length === 0 && (!isClickedElementBox[1])) {
    hideCommits();
  }else{
    //e.target is commitDiv 
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
      var emptyLine = 0;
      //Adds blame string
      str += "<h3>" + commitChange[i]['blame'][j].filename + " - " + commitChange[i]['blame'][j].rowk + " lines changed </h3>";

      //Adds the code changes associated with that blame
      //console.log("before for offset: "+offset+" offsetRunner: " + offsetRunner);
      codeLength = commitChange[i]['blame'][j].rowk;
      for(var x = 0; x < codeLength; x++){
        //console.log("index: " + i + " x: "+ x + " code length: "+ codeLength + " offset: "+ offset);
        if(commitChange[i]['codechange'][x+offset].code != ""){
          str += "<p><b>" + commitChange[i]['codechange'][x+offset].rowno + "</b> - " + commitChange[i]['codechange'][x+offset].code;
        }else emptyLine++
        offsetRunner++;
      }
      offset = offsetRunner;
      str+="<p><b>"+emptyLine+" / "+codeLength+" Lines were empty</b></p><br>"
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

//Creates the sidebar for accepting and rejecting students when logged in as a superUser
function createSidebar(){

  let git_username = null;
  let status = null
  AJAXService("ACC_SIDE_PANEL", {},'CONT_ACCOUNT_STATUS');
}

//status codes 101=pending 102=denied 0=accepted
function accountInformation(data){
  var str = "";
  for (var row = 0; row < data.length; row++) {
    str+= "<div id='" +data[row][0] +"'>";
    str+= "<tr class='accountRequestTable'"+ row +">";
    str+= "<td class='accountRequestTable'>" + data[row][0] + "</td>";
    var userName = data[row][0];    
    
    //status codes 101=pending 102=denied 0=accepted
    if(data[row][1]==101){  //pending account
      str+="<td class='accountRequestTable'>" + 'Pending'+ "</td>";
      str+="<td class='accountRequestTable'>";
        str+= "<input type='button' ,id='accept"+data[row][0]+"', onclick='acceptAcc(\""+userName+"\")', value='Accept'></input><br>" ;
        str+= "<input type='button' ,id='deny"+data[row][0]+"', onclick='denyAcc(\""+userName+"\")', value='Deny '></input><br>";
        str+= "<input type='button' ,id='delete"+data[row][0]+"', onclick='deleteAcc(\""+userName+"\")', value='Delete '></input>";
      str+= "</td>";
    }
    else if(data[row][1]==0){ //accepted account
      str+= "<td class='accountRequestTable'>" + 'Accepted'+ "</td>";
      str+= "<td class='accountRequestTable'>"; 
      str+= "<input type='button' id='delete"+data[row][0]+"' onclick='deleteAcc(\""+userName+"\")' value='Delete '></input><br>";
      str+= "<input type='button' id=deny'"+data[row][0]+"' onclick='denyAcc(\""+userName+"\")' value='Revoke '></input>";
      str+= "</td>";
    }
    else{ //if not accepted or pending its denied
      str+= "<td class='accountRequestTable'>" + 'Denied' + "</td>";
      str+= "<td class='accountRequestTable'>";
      str+= "<input type='button' id='delete"+data[row][0]+"' onclick='deleteAcc(\""+userName+"\")' value='Delete'></input><br>";
      str+= "<input type='button' id='accept"+data[row][0]+"' onclick='acceptAcc(\""+userName+"\")' value='Accept'></input>"; 
      str+= "</td>";
    }
    str+="</div>";
    str+= "</tr>";
  }

  return str; 
}


//These functions sends the AJAX call to contribution_loginbox_service and dugga.js
//Choose three separate functions instead of one combined for readability
function denyAcc(userName){

  AJAXService("gitUserAdmin", 
    {username: userName, gitUserChange: 1}, "CONT_LOGINBOX_SERVICE");

  //Refreshes the side panel
  AJAXService("ACC_SIDE_PANEL", {},'CONT_ACCOUNT_STATUS');

}

function deleteAcc(userName){

  AJAXService("gitUserAdmin", 
    {username: userName, gitUserChange: 2}, "CONT_LOGINBOX_SERVICE");

  AJAXService("ACC_SIDE_PANEL", {},'CONT_ACCOUNT_STATUS');

}

function acceptAcc(userName){

  AJAXService("gitUserAdmin", 
    {username: userName, gitUserChange: 3}, "CONT_LOGINBOX_SERVICE");

  AJAXService("ACC_SIDE_PANEL", {},'CONT_ACCOUNT_STATUS');

 }

function placeSideBarInfo(data){
  var text = document.getElementById('accountRequests-pane');
  text.style.display="inline-block";
  str = "";
  str+= '<div id="accountRequests-pane-button" class="accountRequests-pane-button" onclick="toggleAccountRequestPane();"><span id="accountReqmarker" class="accountRequests-pane-span">Account requests</span></div>';
  str+= "<table class='accountRequestTable'style='width: 85%'  border='1'><br />";
	str+= "<tr class='accountRequestTable' style=' background-color: #ffffff';>";
  str+= "<th class='accountRequestTable'>Name</th>";
  str+= "<th class='accountRequestTable'>Status</th>";
  str+= "<th class='accountRequestTable'>Change</th>";
  str+= "</tr>";
  str+=accountInformation(data);

  str+= "</table>";
  str+= "</div>";
  text.innerHTML = str;
}




function showError(){
  console.log("showError() has been called. AJAXService had a error accessing git_user table, ");
}

console.error