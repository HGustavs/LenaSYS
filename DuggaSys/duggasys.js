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
					// Styling for header row
					str+="<span class='bigg' id='"+data['entries'][i]['lid']+"'>";
					if(sessionkind==courseID||sessionkind.indexOf("Superuser")>-1){
						str+="<span contenteditable='true' id='SE"+data['entries'][i]['lid']+"' >"+data['entries'][i]['entryname']+"</span>";
						str+="<span class='smallishbutt'>";
						str+=Sectionbutton("sectionDel","MinusT.svg",data['entries'][i]['lid'],"BIG");											
						str+="</span>";
					}else{
						str+="<span id='SE"+data['entries'][i]['lid']+"'>"+data['entries'][i]['entryname']+"</span>";						
					}
					str+="</span>";
					break;
				case 1:
					//Styling for section row
					str+="<span class='butt' id='"+data['entries'][i]['lid']+"' >";

					// If we are allowed to edit
					if(sessionkind==courseID||sessionkind.indexOf("Superuser")>-1){
						str+="<span contenteditable='true' id='SE"+data['entries'][i]['lid']+"'>"+data['entries'][i]['entryname']+"</span>";
						str+="<span class='smallbutt'>";
						str+=Sectionbutton("exampleNew","PlusS.svg",data['entries'][i]['lid'],"SMALL");
						str+=Sectionbutton("sectionDel","MinusS.svg",data['entries'][i]['lid'],"SMALL");
						str+="</span>";
					}else{
						str+="<span id='SE"+data['entries'][i]['lid']+"'>"+data['entries'][i]['entryname']+"</span>";						
					}
					
					// End of butt span
					str+="</span>"
					break;
				default:
				case 2:
					// Styling for example row
					str+="<span class='norm' id='"+data['examples'][j]['sectionno']+"'>";
					if(sessionkind==courseID||sessionkind.indexOf("Superuser")>-1){
							str+="<span id='EX"+data['entries'][j]['lid']+"' contenteditable='true'>"+data['entries'][j]['entryname']+"</span>";
							str+="<span class='smallbutt'>";
							str+=Sectionbutton("exampleDel","MinusT.svg",data['entries'][j]['lid'],"EXAMPLE");											
							str+=Sectionbutton("PP","PlayT.svg",data['entries'][j]['lid'],"EXAMPLE",data['entries'][j]['lid']);
							str+="</span>"
					}else{
							str+="<a href="+data['entries'][j]['link']+"</a>";		
					}
					str+="</span>";
					break;
				case 3:
				// Styling for test row
				break;
				case 4:
				// Styling for 'others' row
				break;
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