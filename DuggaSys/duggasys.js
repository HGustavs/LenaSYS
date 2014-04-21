function countsect(sectpos)
{
		var cnt=0;						
		for(j=0;j<retdata['entries'].length;j++){
				if(retdata['entries'][j][3]==sectpos && retdata['entries'][j]['kind'] == 2){
						cnt++;
				}
		}
		return cnt;
}
			
function newSection(kind)
{
		AJAXServiceSection("sectionNew","&kind="+kind);						
}			
			
function editedExampleName(obj)
{
				var newname=obj.innerHTML;
				newname=dehtmlify(newname,false,60);
				obj.innerHTML=newname;

				AJAXServiceSection("editExampleName","&newname="+newname+"&sectid="+obj.id);

}

function editedSectionName(obj)
{
				var newname=obj.innerHTML;
				newname=dehtmlify(newname,false,60);
				obj.innerHTML=newname;

				AJAXServiceSection("editSectionName","&newname="+newname+"&sectid="+obj.id);
}

function editedExamplename()
{
		var editable=document.getElementById('exampleName');
		var examplename=dehtmlify(editable.innerHTML,true,60);
		editable.innerHTML=examplename;
		AJAXService("editExampleName","&examplename="+examplename);
}

// Create a button for a section row
function Sectionbutton(kind,imgname,sectid,typ,pos)
{	
		if(typ=="SMALL"){
				return "<img src='../CodeViewer/icons/"+imgname+"' onclick='AJAXServiceSection(\""+kind+"\",\"&sectid="+sectid+"\")' />";				
		}else if(typ=="BIG"){
				return "<img src='../CodeViewer/icons/"+imgname+"' onclick='AJAXServiceSection(\""+kind+"\",\"&sectid="+sectid+"\")' />";
		}else if(typ=="EXAMPLE"){
				return "<img src='../CodeViewer/icons/"+imgname+"' onclick='AJAXServiceSection(\""+kind+"\",\"&sectid="+sectid+"\")' />";
		}		
}

function returnedSection(data)
{
		retdata=data;
		
		// Fill section list with information
		str="";
		
		// Course Name
		str+="<div class='course'>"+courseID+"</div>"

		// For now we only have two kinds of sections
		for(i=0;i<data['entries'].length;i++){
			switch(parseInt(data['entries'][i]['kind'])) {
				case 0:
					str+="<span class='bigg' id='"+data['sections'][i]['sectionno']+"'>";
					if(sessionkind==courseID||sessionkind.indexOf("Superuser")>-1){
						str+="<span contenteditable='true' id='SE"+data['sections'][i]['sectionno']+"' >"+data['sections'][i]['sectionname']+"</span>";
						str+="<span class='smallishbutt'>";
						str+=Sectionbutton("sectionDel","MinusT.svg",data['sections'][i]['sectionno'],"BIG");											
						str+="</span>";
					}else{
						str+="<span id='SE"+data['sections'][i]['sectionno']+"'>"+data['sections'][i]['sectionname']+"</span>";						
					}
					str+="</span>";
					break;
				case 1:
					str+="<span class='butt' id='"+data['sections'][i]['sectionno']+"' >";

					// If we are allowed to edit
					if(sessionkind==courseID||sessionkind.indexOf("Superuser")>-1){
						str+="<span contenteditable='true' id='SE"+data['sections'][i]['sectionno']+"'>"+data['sections'][i]['sectionname']+"</span>";
						str+="<span class='smallbutt'>";
						str+=Sectionbutton("exampleNew","PlusS.svg",data['sections'][i]['sectionno'],"SMALL");
						str+=Sectionbutton("sectionDel","MinusS.svg",data['sections'][i]['sectionno'],"SMALL");
						str+="</span>";
					}else{
						str+="<span id='SE"+data['sections'][i]['sectionno']+"'>"+data['sections'][i]['sectionname']+"</span>";						
					}
					
					// End of butt span
					str+="</span>"
					break;
				case 2:
					str+="<span class='norm' id='"+data['examples'][j]['sectionno']+"'>";
					if(sessionkind==courseID||sessionkind.indexOf("Superuser")>-1){
							str+="<span id='EX"+data['examples'][j]['exampleno']+"' contenteditable='true'>"+data['examples'][j]['examplename']+"</span>";
							str+="<span class='smallbutt'>";
							str+=Sectionbutton("exampleDel","MinusT.svg",data['examples'][j]['exampleno'],"EXAMPLE");											
							str+=Sectionbutton("PP","PlayT.svg",data['examples'][j]['sectionno'],"EXAMPLE",data['examples'][j]['exampleno']);
							str+="</span>"
					}else{
							str+="<a href='EditorV30.php?courseid="+courseID+"&sectionid="+data['examples'][j]['sectionno']+"&version="+vers+"&position="+data['examples'][j]['pos']+"'>"+data['examples'][j]['examplename']+"</a>";		
					}
					str+="</span>";
					break;
				}
			}

		}
		
		var slist=document.getElementById('Sectionlist');
		slist.innerHTML=str;

		if(sessionkind==courseID||sessionkind.indexOf("Superuser")>-1){
			// Setup editable sections with events etc
			for(i=0;i<data['entries'].length;i++){
				if(parseInt(data['entries'][i]['kind'])==0){
					var editable=document.getElementById("SE"+data['sections'][i]['sectionno']);
					editable.addEventListener("blur", function(){editedSectionName(this);}, true);
				}else if (parseInt(data['entries'][i]['kind'])==1){
					var editable=document.getElementById("SE"+data['sections'][i]['sectionno']);
					editable.addEventListener("blur", function(){editedSectionName(this);}, true);
				}else{
					var editable=document.getElementById("EX"+data['examples'][j]['exampleno']);
					editable.addEventListener("blur", function(){editedExampleName(this);}, true);
				}
			}				
		}


	  if(data['debug']!="NONE!") alert(data['debug']);

}