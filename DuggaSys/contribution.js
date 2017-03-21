var querystring=parseGet();
var retdata;

AJAXService("get",{},"CONTRIBUTION");

//----------------------------------------
// Renderer
//----------------------------------------

var momentexists=0;
var resave = false;
function returnedSection(data)
{
	retdata=data;
  if(data['debug']!="NONE!") alert(data['debug']);
	
	var str="";
	
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

			if(week.issues.length>0||week.comments>0||week.events>0){
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
	
	document.getElementById('content').innerHTML=str;;
  
}
