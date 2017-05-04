var querystring=parseGet();
var retdata;

AJAXService("get",{userid:"b14larek"},"CONTRIBUTION");

//----------------------------------------
// Renderer
//----------------------------------------

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

	var str="";
    
    if(data['allusers'].length>0){
        str+="<select id='userid' onchange='selectuser();'>";
        for(i=0;i<data['allusers'].length;i++){
            str+="<option>"+data['allusers'][i]+"</option>";
        }
        str+="</select>";
    } 
    
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
    str+="<td>Overall Github</td>"
    str+="<td>"+data['overallrankno']+"</td>"
    str+="<td style='background-color:"+intervaltocolor(41,data['overallrank'])+"'>"+data['overallrank']+"</td>";
    str+="</tr>";

    str+="<tr>";
    str+="<td>Lines of Code</td>"
    str+="<td>"+data['rowrankno']+"</td>"
    str+="<td style='background-color:"+intervaltocolor(41,data['rowrank'])+"'>"+data['rowrank']+"</td>";
    str+="</tr>";

    str+="</table>";

    // Table heading
	
	str+="<table class='fumho'>";
	str+="<tr style='position:relative;box-shadow:1px 3px 5px rgba(0,0,0,0.5);z-index:400;'>";
	str+="<th></th>";
	str+="<th>Dates</th>";
	str+="<th>Code Contribution</th>";
	str+="<th>GitHub Contribution</th>";
	str+="</tr><br/><br/>";

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

				str+="<div class='contrib'>";
				str+="<span class='contribheading' style='padding:4px;'>";
					str+="<span class='contribpath'>"+file.path+"</span>";
					str+="<span class='contribfile'>"+file.filename+"</span>";
				str+="</span>";

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

						if(week.issues.length>0){
								str+="<div class='createissue'>Created "+week.issues.length+" issues.</div>";									
								for(j=0;j<week.issues.length;j++){
										var issue=week.issues[j];
										str+="<div class='contentissue'>"+issue.issueno+" "+issue.title+"</div>";
								}
								
						}

						if(week.comments.length>0){
								str+="<div class='createissue'>Made "+week.comments.length+" comments.</div>";		
								for(j=0;j<week.comments.length;j++){
										var comment=week.comments[j];
										str+="<div class='contentissue'>"+comment.issueno+" "+comment.content+"</div>";
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

	str+="</table>"
	
    str+="<table class='fumho'><tr><th>rowrank</th><th>login</th><th>value</th></tr>";
    var contribData = [];
    if(data['allrowranks'].length>0){
        for(i=0;i<data['allrowranks'].length;i++){
            str+="<tr>";
            str+="<td>"+i+"</td>";
            str+="<td>"+data['allrowranks'][i][1]+"</td>";
            str+="<td>"+data['allrowranks'][i][0]+"</td>";
            str+="</tr>";
            if (contribData[data['allrowranks'][i][1]] == undefined){
              contribData[data['allrowranks'][i][1]]={name:data['allrowranks'][i][1]};
              contribData[data['allrowranks'][i][1]].allrank=data['allrowranks'][i][0];;                            
            } else {
              contribData[data['allrowranks'][i][1]].allrank=data['allrowranks'][i][0];
            }
            
        }
    }    
    str+="</table>";

    str+="<table class='fumho'><tr><th>commentrank</th><th>login</th><th>value</th></tr>";
    if(data['allcommentranks'].length>0){
        for(i=0;i<data['allcommentranks'].length;i++){
            str+="<tr>";
            str+="<td>"+i+"</td>";
            str+="<td>"+data['allcommentranks'][i][1]+"</td>";
            str+="<td>"+data['allcommentranks'][i][0]+"</td>";
            str+="</tr>";
            if (contribData[data['allcommentranks'][i][1]] == undefined){
              contribData[data['allcommentranks'][i][1]]={name:data['allcommentranks'][i][1]};
              contribData[data['allcommentranks'][i][1]].allcommentranks=data['allcommentranks'][i][0];
            } else {
              contribData[data['allcommentranks'][i][1]].allcommentranks=data['allcommentranks'][i][0];
            }
        }
    }    
    str+="</table>";   

    str+="<table class='fumho'><tr><th>eventrank</th><th>login</th><th>value</th></tr>";
    if(data['allcommentranks'].length>0){
        for(i=0;i<data['alleventranks'].length;i++){
            str+="<tr>";
            str+="<td>"+i+"</td>";
            str+="<td>"+data['alleventranks'][i][1]+"</td>";
            str+="<td>"+data['alleventranks'][i][0]+"</td>";
            str+="</tr>";
            if (contribData[data['alleventranks'][i][1]] == undefined){
              contribData[data['alleventranks'][i][1]]={name:data['alleventranks'][i][1]};
              contribData[data['alleventranks'][i][1]].alleventranks=data['alleventranks'][i][0];
            } else {
              contribData[data['alleventranks'][i][1]].alleventranks=data['alleventranks'][i][0];
            }
            
        }
    }    
    str+="</table>";   
    
    str+="<table class='fumho'><tr><th>totalrank</th><th>login</th><th>value</th></tr>";
    if(data['alltotalranks'].length>0){
        for(i=0;i<data['alltotalranks'].length;i++){
            str+="<tr>";
            str+="<td>"+i+"</td>";
            str+="<td>"+data['alltotalranks'][i][1]+"</td>";
            str+="<td>"+data['alltotalranks'][i][0]+"</td>";
            str+="</tr>";
            if (contribData[data['alltotalranks'][i][1]] == undefined){
              contribData[data['alltotalranks'][i][1]]={name:data['alltotalranks'][i][1],alltotalranks:data['alltotalranks'][i][0]};            
              //contribData[data['alltotalranks'][i][1]].alltotalranks=data['alltotalranks'][i][0];              
            }else {
              contribData[data['alltotalranks'][i][1]].alltotalranks=data['alltotalranks'][i][0];
            }
            console.log(contribData[data['alltotalranks'][i][1]]);
            
        }
    }    
    str+="</table>";   

    str+="<table class='fumho'><tr><th>login</th><th>alltotalranks</th><th>allrank</th><th>alleventranks</th><th>allcommentranks</th></tr>";
    if(data['alltotalranks'].length>0){
      var studDataArr = [];
        for (var stud in contribData){
            studDataArr.push(contribData[stud]);
            str+="<tr>";
            str+="<td>"+stud+"</td>";
            str+="<td>"+contribData[stud].alltotalranks+"</td>";
            str+="<td>"+contribData[stud].allrank+"</td>";
            str+="<td>"+contribData[stud].alleventranks+"</td>";
            str+="<td>"+contribData[stud].allcommentranks+"</td>";
            str+="</tr>";
        }
        console.log(studDataArr);
    }    
    str+="</table>";   
    
    document.getElementById('content').innerHTML=str;;
  
}
