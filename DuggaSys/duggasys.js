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
		}else if(typ=="ADD"){
				return "<img src='../CodeViewer/icons/"+imgname+"' onclick='newSection(0)' />";
		}	
}

function returnedSection(data)
{
		retdata=data;
		
		// Fill section list with information
		str="";
		str+="<div style='float:right;'><input class='submit-button' type='button' value='Add' /></div>";
		//str+=Sectionbutton("","PlusT.svg",2,"ADD");	;	
		// Course Name
		str+="<div class='course'>"+data.coursename+"</div>";

		// For now we only have two kinds of sections
		for(i=0;i<data['entries'].length;i++){
			if (parseInt(data['entries'][i]['visible']) === 1 || sessionkind === true) {
				switch(parseInt(data['entries'][i]['kind'])) {
					case 0:
						// Styling for header row
						if (parseInt(data['entries'][i]['visible']) === 0) {
							str+="<span class='hidden' id='Entry_"+data['entries'][i]['lid']+"'>";
						} else {
							str+="<span class='bigg' id='Entry_"+data['entries'][i]['lid']+"'>";
						}
						if(sessionkind===1){
							str+="<span contenteditable='true' id='SE"+data['entries'][i]['lid']+"' ><a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a></span>";
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
						if (parseInt(data['entries'][i]['visible']) === 0) {
							str+="<span class='hidden' id='Entry_"+data['entries'][i]['lid']+"'>";
						} else {
							str+="<span class='butt' id='Entry_"+data['entries'][i]['lid']+"'>";
						}

						// If we are allowed to edit
						if(sessionkind===1){
							str+="<span id='SE"+data['entries'][i]['lid']+"'>"+data['entries'][i]['entryname']+"</span>";
							str+="<span class='smallbutt'>";
							str+=Sectionbutton("sectionDel","MinusS.svg",data['entries'][i]['lid'],"SMALL");
							str+="</span>";
						}else{
							str+="<span id='SE"+data['entries'][i]['lid']+"'>"+data['entries'][i]['entryname']+"</span>";						
						}
						
						// End of butt span
						str+="</span>"
						break;
					case 2:
						// Styling for example row
						if (parseInt(data['entries'][i]['visible']) === 0) {
							str+="<span class='hidden' id='Entry_"+data['entries'][i]['lid']+"'>";
						} else {
							str+="<span class='example' id='Entry_"+data['entries'][i]['lid']+"'>";
						}
						if(sessionkind===1){
								str+="<span id='EX"+data['entries'][i]['lid']+"'><a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a></span>";
								str+="<span class='smallbutt'>";
								str+=Sectionbutton("exampleDel","MinusT.svg",data['entries'][i]['lid'],"EXAMPLE");											
								str+="</span>"
						}else{
								str+="<a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a>";		
						}
						str+="</span>";
						break;
					case 3:
						// Styling for test row
						if (parseInt(data['entries'][i]['visible']) === 0) {
							str+="<span class='hidden' id='Entry_"+data['entries'][i]['lid']+"'>";
						} else {
							str+="<span class='test' id='Entry_"+data['entries'][i]['lid']+"'>";
						}
						if(sessionkind===1){
								str+="<span id='EX"+data['entries'][i]['lid']+"'><a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a></span>";
								str+="<span class='smallbutt'>";
								str+=Sectionbutton("exampleDel","MinusT.svg",data['entries'][i]['lid'],"EXAMPLE");											
								str+="</span>"
						}else{
								str+="<a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a>";		
						}
						str+="</span>";
						break;
					default:
					case 4:
						// Styling for 'others' row
						if (parseInt(data['entries'][i]['visible']) === 0) {
							str+="<span class='hidden' id='Entry_"+data['entries'][i]['lid']+"'>";
						} else {
							str+="<span class='norm' id='Entry_"+data['entries'][i]['lid']+"'>";
						}
						if(sessionkind===1){
								str+="<span id='EX"+data['entries'][i]['lid']+"'><a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a></span>";
								str+="<span class='smallbutt'>";
								str+=Sectionbutton("exampleDel","MinusT.svg",data['entries'][i]['lid'],"EXAMPLE");											
								str+="</span>"
						}else{
								str+="<a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a>";		
						}
						str+="</span>";
						break;
					}
				}
			}
			
			var slist=document.getElementById('Sectionlist');
			slist.innerHTML=str;


		  if(data['debug']!="NONE!") alert(data['debug']);

}
