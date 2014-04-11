function countsect(sectpos)
{
		var cnt=0;						
		for(j=0;j<retdata['examples'].length;j++){
				if(retdata['examples'][j][3]==sectpos){
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
		str+="<span class='course'>"+courseID+"</span>"

		// For now we only have two kinds of sections
		for(i=0;i<data['sections'].length;i++){
				if(parseInt(data['sections'][i]['sectionkind'])==2){
						str+="<span class='bigg' id='SCE"+data['sections'][i]['sectionno']+"'>";
						if(sessionkind===1){
							str+="<span contenteditable='true' id='SE"+data['sections'][i]['sectionno']+"' >"+data['sections'][i]['sectionname']+"</span>";
							str+="<span class='smallishbutt'>";
							str+=Sectionbutton("sectionUp","UpT.svg",data['sections'][i]['sectionno'],"BIG");
							str+=Sectionbutton("sectionDown","DownT.svg",data['sections'][i]['sectionno'],"BIG");
							str+=Sectionbutton("sectionDel","MinusT.svg",data['sections'][i]['sectionno'],"BIG");											
							str+="</span>";
						}else{
							str+="<span id='SE"+data['sections'][i]['sectionno']+"'>"+data['sections'][i]['sectionname']+"</span>";						
						}
						str+="</span>";
				}else{
						str+="<span class='butt' id='SCE"+data['sections'][i]['sectionno']+"' >";

						// If we are allowed to edit
						if(sessionkind===1){
							str+="<span contenteditable='true' id='SE"+data['sections'][i]['sectionno']+"'>"+data['sections'][i]['sectionname']+"</span>";
							str+="<span class='smallbutt'>";
							str+=Sectionbutton("sectionUp","UpS.svg",data['sections'][i]['sectionno'],"SMALL");
							str+=Sectionbutton("sectionDown","DownS.svg",data['sections'][i]['sectionno'],"SMALL");
							str+=Sectionbutton("exampleNew","PlusS.svg",data['sections'][i]['sectionno'],"SMALL");
							str+=Sectionbutton("sectionDel","MinusS.svg",data['sections'][i]['sectionno'],"SMALL");
							str+="</span>";
						}else{
							str+="<span id='SE"+data['sections'][i]['sectionno']+"'>"+data['sections'][i]['sectionname']+"</span>";						
						}
						
						// End of butt span
						str+="</span>"

						// For each of the examples
						for(j=0;j<data['examples'].length;j++){
								if(data['sections'][i]['sectionno']==data['examples'][j]['sectionno']){
										str+="<span class='norm' id='ECX"+data['examples'][j]['sectionno']+"'>";
										if(sessionkind===1){
												str+="<span id='EX"+data['examples'][j]['exampleno']+"' contenteditable='true'>"+data['examples'][j]['examplename']+"</span>";
												str+="<span class='smallbutt'>";
													str+=Sectionbutton("exampleUp","UpT.svg",data['examples'][j]['exampleno'],"EXAMPLE");
													str+=Sectionbutton("exampleDown","DownT.svg",data['examples'][j]['exampleno'],"EXAMPLE");
													str+=Sectionbutton("exampleDel","MinusT.svg",data['examples'][j]['exampleno'],"EXAMPLE");											
													str+="<img src='../CodeViewer/icons/PlayT.svg' onclick=\"window.location='../CodeViewer/EditorV30.php?courseid="+courseID+
														"&version="+vers+
														"&sectionid="+data['examples'][j]['sectionno']+
														"&position="+data['examples'][j]['pos']+
														"'\"/>";
												str+="</span>"
										}else{
												str+="<a href='../CodeViewer/EditorV30.php?courseid="+courseID+"&sectionid="+data['examples'][j]['sectionno']+"&version="+vers+"&position="+data['examples'][j]['pos']+"'>"+data['examples'][j]['examplename']+"</a>";		
										}
										str+="</span>";
								}
						}
				}

		}
		
		var slist=document.getElementById('Sectionlist');
		slist.innerHTML=str;

		if(sessionkind===1){
				// Setup editable sections with events etc
				for(i=0;i<data['sections'].length;i++){
						if(parseInt(data['sections'][i]['sectionkind'])==2){
								var editable=document.getElementById("SE"+data['sections'][i]['sectionno']);
				    		editable.addEventListener("blur", function(){editedSectionName(this);}, true);
						}else{
								var editable=document.getElementById("SE"+data['sections'][i]['sectionno']);
				    		editable.addEventListener("blur", function(){editedSectionName(this);}, true);
								for(j=0;j<data['examples'].length;j++){
										if(data['sections'][i]['sectionno']==data['examples'][j]['sectionno']){
												var editable=document.getElementById("EX"+data['examples'][j]['exampleno']);
								    		editable.addEventListener("blur", function(){editedExampleName(this);}, true);
										}
								}
		
						}
				}				
		}


	  if(data['debug']!="NONE!") alert(data['debug']);

}
