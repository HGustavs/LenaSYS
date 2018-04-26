var querystring=parseGet();
var retdata;
var contribDataArr = [];

AJAXService("get",{userid:"HGustavs"},"CONTRIBUTION");

//----------------------------------------
// Renderer
//----------------------------------------

function renderRankTable(){
  var str="<table class='fumho'><tr><th></th><th onclick='sortRank(0);'>login</th><th onclick='sortRank(2);'>alleventranks</th><th onclick='sortRank(3);'>allcommentranks</th><th onclick='sortRank(4);'>LOC rank</th><th onclick='sortRank(5);'>Commit rank</th></tr>";
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
	str+="<th style='padding-left:10px;padding-right:10px;'>Kind</th>";
    str+="<th style='padding-left:10px;padding-right:10px;'>Number</th>";
	str+="<th style='padding-left:10px;padding-right:10px;'>Ranking</th>";
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

    // Table heading
	str+="<table class='fumho'>";
	str+="<tr style='position:relative;box-shadow:1px 3px 5px rgba(0,0,0,0.5);z-index:400;'>";
	str+="<th></th>";
	str+="<th>Dates</th>";
	str+="<th>Code Contribution</th>";
	str+="<th>GitHub Contribution</th>";
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
								str+="<div class='createissue'>Made "+week.commits.length+" commits.</div>";
								for(j=0;j<week.commits.length;j++){
										var message=week.commits[j].message;
										var hash=week.commits[j].cid;
										str+="<div class='contentissue'><a href='https://github.com/HGustavs/LenaSYS/commit/"+hash+"'>"+message+"</a></div>";
								}
						}


						if(week.issues.length>0){
								str+="<div class='createissue'>Creeated "+week.issues.length+" issues.</div>";
								for(j=0;j<week.issues.length;j++){
										var issue=week.issues[j];
										var issuestr=issue.issueno+" "+issue.title;
										str+="<div class='contentissue'><a href='https://github.com/HGustavs/LenaSYS/issues/"+issue.issueno.substr(1)+"'>"+issuestr+"</a></div>";
								}

						}

						if(week.comments.length>0){
								str+="<div class='createissue'>Made "+week.comments.length+" comments.</div>";
								for(j=0;j<week.comments.length;j++){
										var comment=week.comments[j];
										var issuestr=comment.issueno+" "+comment.content;
										str+="<div class='contentissue'><a href='https://github.com/HGustavs/LenaSYS/issues/"+comment.issueno.substr(1)+"'>"+issuestr+"</a></div>";
								}

						}

						if(week.events.length>0){
								str+="<div class='createissue'>Performed "+week.events.length+" events.</div>";
								for(j=0;j<week.events.length;j++){
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
        contribDataArr.push(contribData[stud]);
    }
    document.getElementById('content').innerHTML=str;
    sortRank(1);  // default to allrank
}
