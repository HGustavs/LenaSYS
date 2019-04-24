var querystring=parseGet();
var retdata;
var contribDataArr = [];
var daycounts = [];
var maxDayCount=0;
var dailyCount=[[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]];

AJAXService("get",{userid:"HGustavs"},"CONTRIBUTION");

//----------------------------------------
// Renderer
//----------------------------------------

function renderRankTable(){
  if(contribDataArr.length == 0) return;
  var str="<table class='fumho'><tr><th></th><th style='padding: 2px 10px;' onclick='sortRank(0);'>login</th><th style='padding: 2px 10px;' onclick='sortRank(2);'>alleventranks</th><th style='padding: 2px 10px;' onclick='sortRank(3);'>allcommentranks</th><th style='padding: 2px 10px;' onclick='sortRank(4);'>LOC rank</th><th style='padding: 2px 10px;' onclick='sortRank(5);'>Commit rank</th></tr>";
  for (var j=0; j<contribDataArr.length;j++){
      str+="<tr>";
      str+="<td>"+j+"</td>";
			str+="<td>"+contribDataArr[j].name+"</td>";
      str+="<td>"+contribDataArr[j].alleventranks+"</td>";
      str+="<td>"+contribDataArr[j].allcommentranks+"</td>";
      str+="<td>"+contribDataArr[j].allrowrank+"</td>";
      str+="<td>"+contribDataArr[j].allcommitrank+"</td>";
			str+="</tr>";
  }
  str+="</table>";
  document.getElementById("rankTable").innerHTML=str;
}

// sort rank based on column, col
function sortRank( col ){
    if(col===0){
        contribDataArr.sort(function compare(a,b){
            if(a.name>b.name){
                return 1;
            }else if(a.name<b.name){
                return -1;
            }else{
                return 0;
            }
        });
   }else if(col===2){
      contribDataArr.sort(function compare(a,b){
       if(a.alleventranks>b.alleventranks){
           return -1;
       }else if(a.alleventranks<b.alleventranks){
           return 1;
       }else{
           return 0;
       }
      });
   }else if(col===3){
      contribDataArr.sort(function compare(a,b){
       if(a.allcommentranks>b.allcommentranks){
           return -1;
       }else if(a.allcommentranks<b.allcommentranks){
           return 1;
       }else{
           return 0;
       }
      });
   }else if(col===4){
      contribDataArr.sort(function compare(a,b){
       if(a.allrowrank>b.allrowrank){
           return -1;
       }else if(a.allrowrank<b.allrowrank){
           return 1;
       }else{
           return 0;
       }
      });
   }
   renderRankTable();
}

function hideInfoText(){
  var text = document.getElementById("infoText");
  text.style.display = "none";
}

function showInfoText(object, displayText){
  var text = document.getElementById("infoText");
  text.style.display = "inline";
  text.innerHTML = displayText;
  if(typeof object.attributes.width !== 'undefined'){
    text.style.left = (document.documentElement.scrollLeft + object.getBoundingClientRect()["x"] + object.getBoundingClientRect().width + 2) + "px";
    text.style.top = (document.documentElement.scrollTop + object.getBoundingClientRect()["y"] + (object.getBoundingClientRect().height / 2) - (text.offsetHeight / 2)) + "px";
  }
  else{
    text.style.left = (document.documentElement.scrollLeft + object.getBoundingClientRect()["x"] + object.r["baseVal"]["value"] + 2) + "px";
    text.style.top = (document.documentElement.scrollTop + object.getBoundingClientRect()["y"] + (object.r.baseVal.value / 2) - (text.offsetHeight * 1.1)) + "px";
  }
}

function renderBarDiagram(data)
{
  // Creates array from data for easier access
  var dailyCount = new Array(70);
  var dateString = data['weeks'][0]['weekstart'];
  var numOfWeeks = data['weeks'].length;
  var date;
  var maxDayCount = 0;
  for(var i = 0; i < 7 * numOfWeeks; i++){
    var day = data['count'][dateString];
    var commits = parseInt(day["commits"][0][0]);
    var events = parseInt(day["events"][0][0]);
    var comments = parseInt(day["comments"][0][0]);
    var loc = parseInt(day["loc"][0][0] == null ? 0 : day["loc"][0][0]);
    var total = commits + events + comments + loc;
    if(total > maxDayCount){
      maxDayCount = total;
    }
    dailyCount[i] = new Array(dateString, commits, events, comments, loc);
    date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    dateString = date.toISOString().split("T")[0];
  }

  // Renders the diagram
  var str = "<div style='width:100%;overflow-x:scroll;'>";
  str += "<svg class='chart fumho' style='background-color:#efefef;' width='1300' height='250' aria-labelledby='title desc' role='img'>";
  for(var i = 0; i < numOfWeeks; i++){
    str += "<rect x='" + (65 + 120 * i) + "' y='0%' width='120' height='100%' style='fill:" + (i % 2 == 1 ? "#cccccc" : "#efefef") + ";' />"
  }
  str += "<line style='stroke:#000;' x1='65' x2='65' y1='5%' y2='220'></line>";
  str += "<line style='stroke:#000;' x1='65' x2='99%' y1='220' y2='220'></line>";

  // Calculates and render scale numbers on the left
  var decimals = Math.pow(10, Math.round(maxDayCount).toString().length - 2);
  var highRange = Math.ceil(maxDayCount / decimals) * decimals;
  for(var i = 0; i < 5; i++){
    var range = (highRange / 4) * i;
    if(highRange > 100){
      range = Math.round(range);
    }
    str += "<text x='" + (62 - (range.toString().length * 9)) + "' y='" + (225 - (range / highRange) * 200) + "'>" + range + "</text>";
    str += "<line style='stroke:#ccc;' x1='65' x2='99%' y1='" + (220 - (range / highRange) * 200) + "' y2='" + (220 - (range / highRange) * 200) + "'></line>";
  }

  // Renders the bars
  for(var i = 0; i < numOfWeeks; i++){
    str += "<g class='bar'>";
    for(var j = 0; j < 7; j++){
      var day = dailyCount[i * 7 + j];
      var yOffset = 0;
      str += "<g width='10' onmouseover='showInfoText(this, \"" + (day[0] + "<br />commits: " + day[1] + "<br />Events: " + day[2] + "<br />Comments: " + day[3] + "<br />LOC: " + day[4]) + "\");' onmouseout='hideInfoText()'>";
      for(var k = 1; k < day.length; k++){
        var height = (day[k] / highRange) * 200;
        yOffset += height;
        var color = "#F44336";
        if(k == 2){
          color = "#4DB6AC";
        } else if(k == 3){
          color = "#43A047";
        } else if(k == 4){
          color = "purple";
        }
        str += "<rect style='fill:" + color + ";' width='10' height='" + height + "' x='" + (j * 15 + 120 * i + 75) + "' y='" + (220 - yOffset) + "'></rect>";
      }
      str += "</g>";
    }

    str += "<text x='" + (120 * i + 100) + "' y='240'>week " + (i + 1) + "</text>";
    str += "</g>";
  }

  str += "</svg>";
  str += "</div>";
  return str;
}

function renderLineDiagram(data){

    var weeks=data.weeks;
    daycounts=data['count'];
    var firstweek = data.weeks[0].weekstart;

    //Selectbox to choose week
    str='<select id="weekoption" value="0" style="margin-top:25px;" onchange="document.getElementById(\'lineDiagramDiv\').innerHTML=weekchoice(this.value);">';
    str+='<option value="'+firstweek+'">All weeks</option>';
	for(i=0;i<weeks.length;i++){
            var week=weeks[i];
            str+='<option value="'+week.weekstart+'">'+ "Week " + week.weekno +"   ("+week.weekstart+" - "+week.weekend+")"+'</option>';
    }
    str+='</select>';

    str+='<div id="lineDiagramDiv">';
    str+=weekchoice(firstweek);
    str+='</div>';

    return str;
}

function lineDiagram(){
    str="<svg viewBox='0 0 580 250' class='lineChart' style='max-width:900px;min-width:700px;background-color:#efefef;margin-top:10px;'>";

    // Calculates and render scale numbers on the left
    var decimals = Math.pow(10, Math.round(maxDayCount).toString().length - 2);
    //find the maximum value of commits/events/comments/LOC within selected dates
    maxDayCount = 1;
    for(i = 0; i < 7; i++) {
      for(j = 1; j < dailyCount[i].length; j++) {
        if(dailyCount[i][j] > maxDayCount) {
          maxDayCount = dailyCount[i][j];
        }
      }
    }
    var highRange = Math.ceil(maxDayCount / decimals) * decimals;

    var graphHeight = 200;
    for(var i = 0; i < 5; i++){
        var range = (highRange / 4) * i;
        if(highRange > 100){
          range = Math.round(range);
        }
        str += "<text font-size='10' x='" + (45 - (range.toString().length * 7)) + "' y='" + (225 - (range / highRange) * graphHeight) + "'>" + range + "</text>";
        str += "<line style='stroke:#ccc;' x1='45' x2='99%' y1='" + (220 - (range / highRange) * graphHeight) + "' y2='" + (220 - (range / highRange) * graphHeight) + "'></line>";
    }

    //Grid lines
    str += "<line style='stroke:#777777;' x1='45' x2='45' y1='5%' y2='220'></line>";
    str += "<line style='stroke:#777777;' x1='45' x2='99%' y1='220' y2='220'></line>";

    //Labels
    str+="<g class='graphLabels'>";
    str+="<text font-size='10' x='50' y='235'>Monday</text>";
    str+="<text font-size='10' x='120' y='235'>Tuesday</text>";
    str+="<text font-size='10' x='200' y='235'>Wednesday</text>";
    str+="<text font-size='10' x='280' y='235'>Thursday</text>";
    str+="<text font-size='10' x='370' y='235'>Friday</text>";
    str+="<text font-size='10' x='440' y='235'>Saturday</text>";
    str+="<text font-size='10' x='525' y='235'>Sunday</text>";
    str+="</g>";

    xNumber = Array(60,140,220,300,380,460,540);

    //Commit-graph
    str+="<g transform='translate(0,220) scale(1,-1)'>";
    str+="<polyline fill='none' stroke='#F44336' stroke-width='2'";
    str+="points='";
    for(i=0;i<7;i++){
        str+=xNumber[i]+","+(dailyCount[i][1] / maxDayCount * graphHeight)+" ";
    }
    str+="'/>";
    for(i=0;i<xNumber.length;i++){
        str+="<circle onmouseover='showInfoText(this, \"" + "Commits: : " + (dailyCount[i][1]) + "\");' onmouseout='hideInfoText()'";
        str+="cx='"+xNumber[i]+"' cy='"+(dailyCount[i][1] / maxDayCount * graphHeight)+"' r='3' fill='#F44336'/>";
    }
    str+="</g>";

    //Event-graph
    str+="<g transform='translate(0,220) scale(1,-1)'>";
    str+="<polyline fill='none' stroke='#4DB6AC' stroke-width='2'";
    str+="points='";
    for(i=0;i<7;i++){
        str+=xNumber[i]+","+(dailyCount[i][2] / maxDayCount * graphHeight)+" ";
    }
    str+="'/>";
    for(i=0;i<xNumber.length;i++){
        str+="<circle onmouseover='showInfoText(this, \"" + "Events: " + (dailyCount[i][2]) + "\");' onmouseout='hideInfoText()'";
        str+="cx='"+xNumber[i]+"' cy='"+(dailyCount[i][2] / maxDayCount * graphHeight)+"' r='3' fill='#4DB6AC' />";
    }
    str+="</g>";

    //LOC-Graph
    str+="<g transform='translate(0,220) scale(1,-1)'>";
    str+="<polyline fill='none' stroke='purple' stroke-width='2'";
    str+="points='";
    for(i=0;i<7;i++){
        str+=xNumber[i]+","+(dailyCount[i][3] / maxDayCount * graphHeight)+" ";
    }
    str+="'/>";

    for(i=0;i<xNumber.length;i++){
        str+="<circle onmouseover='showInfoText(this, \"" + "LOC: " + (dailyCount[i][3]) + "\");' onmouseout='hideInfoText()'";
        str+="cx='"+xNumber[i]+"' cy='"+(dailyCount[i][3] / maxDayCount * graphHeight)+"' r='3' fill='purple' />";
    }
    str+="</g>";

    //Comment-graph
    str+="<g transform='translate(0,220) scale(1,-1)'>";
    str+="<polyline fill='none' stroke='#43A047' stroke-width='2'";
    str+="points='";
    for(i=0;i<7;i++){
        str+=xNumber[i]+","+(dailyCount[i][4] / maxDayCount * graphHeight)+" ";
    }
    str+="'/>";
    for(i=0;i<xNumber.length;i++){
        str+="<circle onmouseover='showInfoText(this, \"" + "Comments: " + (dailyCount[i][4]) + "\");' onmouseout='hideInfoText()'";
        str+="cx='"+xNumber[i]+"' cy='"+(dailyCount[i][4] / maxDayCount * graphHeight)+"' r='3' fill='#43A047' />";
    }
    str+="</g>";
    str+="</svg>";

    return str;
}

function weekchoice(dateString){

    var date;
    var events=0;
    var commits=0;
    var loc=0;
    var comments=0;

    if(($("#weekoption option:selected").text())=="" || ($("#weekoption option:selected").text())=="All weeks"){
        var weekcounter=0;
        var daycounter=0;
        var weekarray=[];
        for(i=0;i<70;i++){

            events = parseInt(daycounts[dateString].events[0][0]);
            commits = parseInt(daycounts[dateString].commits[0][0]);
            loc = parseInt(daycounts[dateString].loc[0][0] == null ? 0 :daycounts[dateString].loc[0][0]);
            comments = parseInt(daycounts[dateString].comments[0][0]);

            weekarray[i] = [dateString, commits, events, loc, comments];

            var total = commits + events + comments + loc;
            if(total > maxDayCount){
                maxDayCount = total;
            }

            date = new Date(dateString);
            date.setDate(date.getDate() + 1);
            dateString = date.toISOString().slice(0,10);
        }
        dailyCount=[[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]];
        for(var i=0;i<weekarray.length;i++){
            for(var j=0;j<weekarray[i].length;j++){
                dailyCount[i%7][j] += weekarray[i][j];
            }
        }
        dateString = "";
    }

    for(var key in daycounts){
        if (key == dateString){
            for(i=0;i<7;i++){
                var events = parseInt(daycounts[dateString].events[0][0]);
                var commits = parseInt(daycounts[dateString].commits[0][0]);
                var loc = parseInt(daycounts[dateString].loc[0][0] == null ? 0 :daycounts[dateString].loc[0][0]);
                var comments = parseInt(daycounts[dateString].comments[0][0]);

                dailyCount[i] = [dateString, commits, events, loc, comments];

                date = new Date(dateString);
                date.setDate(date.getDate() + 1);
                dateString = date.toISOString().slice(0,10);

            }
            dateString = "";
        }
    }

    str=lineDiagram();
    return str;
}

function intervaltocolor(size,val)
{
    if(val<size*0.25){
        return "#cf9";
    }else if(val<size*0.5){
        return "#ff9";
    }else if(val<size*0.75){
        return "#fc9";
    }else{
        return "#fa5";
    }
}

function selectuser()
{
    AJAXService("get",{userid:document.getElementById('userid').value},"CONTRIBUTION");
}

var momentexists=0;
var resave = false;
function returnedSection(data)
{
	retdata=data;
    if(data['debug']!="NONE!") alert(data['debug']);

  contribDataArr = [];
	var str="";

    if(data['allusers'].length>0){
        str+="<select id='userid' onchange='selectuser();'>";
        for(i=0;i<data['allusers'].length;i++){
            str+="<option>"+data['allusers'][i]+"</option>";
        }
        str+="</select>";
    }

    str+="<h2 class='section'>Project statistics for GitHub user: " + data['githubuser'] + "</h2>";
  	str+="<table class='fumho'>";
	str+="<tr style='position:relative;box-shadow:1px 3px 5px rgba(0,0,0,0.5);z-index:400;'>";
	str+="<th style='padding: 2px 10px;'>Kind</th>";
    str+="<th style='padding: 2px 10px;'>Number</th>";
	str+="<th style='padding: 2px 10px;'>Ranking</th>";
	str+="</tr>";

    str+="<tr>";
    str+="<td>Issue Creation</td>";
    str+="<td>"+data['issuerankno']+"</td>";
    str+="<td style='background-color:"+intervaltocolor(41,data['issuerank'])+"'>"+data['issuerank']+"</td>";
	str+="</tr>";

    str+="<tr>";
    str+="<td>Comment Creation</td>";
    str+="<td>"+data['commentrankno']+"</td>";
    str+="<td style='background-color:"+intervaltocolor(41,data['commentrank'])+"'>"+data['commentrank']+"</td>";
	str+="</tr>";

    str+="<tr>";
    str+="<td>Events Performed</td>"
    str+="<td>"+data['eventrankno']+"</td>"
    str+="<td style='background-color:"+intervaltocolor(41,data['eventrank'])+"'>"+data['eventrank']+"</td>";
    str+="</tr>";

    str+="<tr>";
    str+="<td>Lines of Code</td>"
    str+="<td>"+data['rowrankno']+"</td>"
    str+="<td style='background-color:"+intervaltocolor(41,data['rowrank'])+"'>"+data['rowrank']+"</td>";
    str+="</tr>";

    str+="<tr>";
    str+="<td>GIT Commit</td>"
    str+="<td>"+data['commitrankno']+"</td>"
    str+="<td style='background-color:"+intervaltocolor(41,data['commitrank'])+"'>"+data['commitrank']+"</td>";
    str+="</tr>";
    str+="</table>";

    str+=renderBarDiagram(data);
    str+=renderLineDiagram(data);

    // Table heading
	str+="<table class='fumho'>";
	str+="<tr style='position:relative;box-shadow:1px 3px 5px rgba(0,0,0,0.5);z-index:400;'>";
	str+="<th></th>";
	str+="<th style='padding: 2px 10px;'>Dates</th>";
	str+="<th style='padding: 2px 10px;'>Code Contribution</th>";
	str+="<th style='padding: 2px 10px;'>GitHub Contribution</th>";
	str+="</tr>";

	var weeks=data.weeks;
	for(i=0;i<weeks.length;i++){
			var week=weeks[i];

			str+="<tr>";

			str+="<td>"+week.weekno+"</td>";

			str+="<td>";
			str+=week.weekstart;
			str+="<br>";
			str+=week.weekend;
			str+="</td>";

			// Start of file contributions
			str+="<td>";

			var files=week.files;

      for(var j=0;j<files.length;j++){
					var file=files[j];

					str+="<a href='https://github.com/HGustavs/LenaSYS/blame/"+file.path+file.filename+"'>";
					str+="<div class='contrib'>";
					str+="<span class='contribheading' style='padding:4px;'>";
					str+="<span class='contribpath'>"+file.path+"</span>";
					str+="<span class='contribfile'>"+file.filename+"</span>";
					str+="</span>";
					str+="</a>";

					str+="<div class='contribcontent'>";
					str+=file.lines+" lines<br>";
					str+="</div>";

					str+="</div>";
			}

			// End of file contrbutions
			str+="</td>";

			// Start of Github contributions
			str+="<td>";

			if(week.issues.length>0||week.comments.length>0||week.events.length>0){
						str+="<div class='contrib'>";
						str+="<div class='contribcontent'>";

						if(week.commits.length>0){
								str+="<div class='createissue'>Made "+week.commits.length+" commit(s).</div>";
								for(j=0;j<week.commits.length;j++){
										var message=week.commits[j].message;
										var hash=week.commits[j].cid;
										str+="<div class='contentissue'><a href='https://github.com/HGustavs/LenaSYS/commit/"+hash+"'>"+message+"</a></div>";
								}
						}


						if(week.issues.length>0){
								str+="<div class='createissue'>Creeated "+week.issues.length+" issue(s).</div>";
								for(j=0;j<week.issues.length;j++){
										var issue=week.issues[j];
										var issuestr=issue.issueno+" "+issue.title;
										str+="<div class='contentissue'><a href='https://github.com/HGustavs/LenaSYS/issues/"+issue.issueno.substr(1)+"'>"+issuestr+"</a></div>";
								}

						}

						if(week.comments.length>0){
								str+="<div class='createissue'>Made "+week.comments.length+" comment(s).</div>";
								for(j=0;j<week.comments.length;j++){
										var comment=week.comments[j];
										var issuestr=comment.issueno+" "+comment.content;
										str+="<div class='contentissue'><a href='https://github.com/HGustavs/LenaSYS/issues/"+comment.issueno.substr(1)+"'>"+issuestr+"</a></div>";
								}

						}

						if(week.events.length>0){
              var totalAmountEvents = 0;
              for(var j=0;j<week.events.length;j++){
                totalAmountEvents += parseInt(week.events[j].cnt);
              }
							str+="<div class='createissue'>Performed "+totalAmountEvents+" event(s).</div>";
							for(var j=0;j<week.events.length;j++){
									var eve=week.events[j];
									str+="<div class='contentissue'>"+eve.kind+" "+eve.cnt+"</div>";
							}
						}

						str+="</div>";
						str+="</div>";

			}

			str +="</td>";

			str+="</tr>";
	}

	// End of table

	str+="</table><div id='rankTable'></div>";

    var contribData = [];

	if(data['allrowranks'].length>0){
        for(i=0;i<data['allrowranks'].length;i++){
          if(data['allrowranks'][i][1].length < 9){
            if (contribData[data['allrowranks'][i][1]] == undefined){
              contribData[data['allrowranks'][i][1]]={name:data['allrowranks'][i][1]};
              contribData[data['allrowranks'][i][1]].allrowrank=parseInt(data['allrowranks'][i][0]);
              // Also add -1 for allrowrank,allcommentranks,alleventranks
              contribData[data['allrowranks'][i][1]].allrank=parseInt(-1);
              contribData[data['allrowranks'][i][1]].allcommentranks=parseInt(-1);
              contribData[data['allrowranks'][i][1]].alleventranks=parseInt(-1);

            } else {
              contribData[data['allrowranks'][i][1]].allrank=data['allrowranks'][i][0];
            }
          }
        }
    }

    if(data['allcommentranks'].length>0){
        for(i=0;i<data['allcommentranks'].length;i++){
          if(data['allcommentranks'][i][1].length < 9){
            if (contribData[data['allcommentranks'][i][1]] == undefined){
              contribData[data['allcommentranks'][i][1]]={name:data['allcommentranks'][i][1]};
              contribData[data['allcommentranks'][i][1]].allcommentranks=parseInt(data['allcommentranks'][i][0]);
              // Also add -1 for allrowrank,alleventranks,allrank
              contribData[data['allcommentranks'][i][1]].allrowrank=parseInt(-1);
              contribData[data['allcommentranks'][i][1]].allrank=parseInt(-1);
              contribData[data['allcommentranks'][i][1]].alleventranks=parseInt(-1);
            } else {
              contribData[data['allcommentranks'][i][1]].allcommentranks=parseInt(data['allcommentranks'][i][0]);
            }
          }
        }
    }

    if(data['alleventranks'].length>0){
        for(i=0;i<data['alleventranks'].length;i++){
            var student = data['alleventranks'][i][1];
            var studentRank = data['alleventranks'][i][0];
            if(student.length < 9){
              if (contribData[student] == undefined){
                  contribData[student]={name:student};
                  if (studentRank==="undefined"){
                    contribData[student].alleventranks=parseInt(-1);
                  } else {
                    contribData[student].alleventranks=parseInt(studentRank);
                  }
                  // Also add -1 for allrowrank,allcommentranks,alleventranks
                  contribData[student].allrank=parseInt(-1);
                  contribData[student].allrowrank=parseInt(-1);
                  contribData[student].allcommentranks=parseInt(-1);
                  contribData[student].allcommitranks=parseInt(-1);
              } else {
                contribData[student].alleventranks=parseInt(studentRank);
              }
            }
        }
    }

    if(data['allcommitranks'].length>0){
        for(i=0;i<data['allcommitranks'].length;i++){
            var student = data['allcommitranks'][i][1];
            var studentRank = data['allcommitranks'][i][0];
						if(student.length < 9){
              if (contribData[student] == undefined){
                  contribData[student]={name:student};
                  if (studentRank==="undefined"){
                    contribData[student].allcommitrank=parseInt(-1);
                  } else {
                    contribData[student].allcommitrank=parseInt(studentRank);
                  }
                  // Also add -1 for allrowrank,allcommentranks,alleventranks
                  contribData[student].allrank=parseInt(-1);
                  contribData[student].allrowrank=parseInt(-1);
                  contribData[student].allcommentranks=parseInt(-1);
              } else {
                contribData[student].allcommitrank=parseInt(studentRank);
              }
            }
        }
    }
    for (var stud in contribData){
        // If the position in the array is not a object, continue
        if(!(typeof contribData[stud] === "object")) continue;
        contribDataArr.push(contribData[stud]);
    }
    document.getElementById('content').innerHTML=str;
    sortRank(1);  // default to allrank
}
