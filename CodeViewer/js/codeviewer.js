/********************************************************************************

   Globals

*********************************************************************************/

var retdata;
var tokens = [];            // Array to hold the tokens.
var dmd=0;
var isdropped=false;				

/********************************************************************************

   UI Hookups

*********************************************************************************/

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


function highlightKeyword(kw)
{
			$(".impword").each(function(){
				if(this.innerHTML==kw){
						highlightimp(this.id);
				}
			});	
}

function dehighlightKeyword(kw)
{
			$(".impword").each(function(){
				if(this.innerHTML==kw){
						dehighlightimp(this.id);
				}
			});	
}

// Callback for highlighting back/forward menu item
function highlightMenu(keywid)
{
		$("#"+keywid).addClass("menuhi");
}

// Callback for highlighting back/forward menu item
function dehighlightMenu(keywid)
{
		$("#"+keywid).removeClass("menuhi");					
}


// Callback for highlighting important keyword
function highlightimp(keywid)
{
		$("#"+keywid).addClass("imphi");					
}

// Callback for highlighting important keyword
function dehighlightimp(keywid)
{
		$("#"+keywid).removeClass("imphi");					
}
				
function Bold()
{
		document.execCommand('Bold',false,'');
}

function editedDescription()
{
		// What is allowed here?
}

function Save()
{
				var editable=document.getElementById('docucontent');
				var desc=editable.innerHTML;
				desc=dehtmlify(desc,false,0);
				AJAXService("editDescription","&description="+desc);
}

function editedExamplename()
{
		var editable=document.getElementById('exampleName');
		var examplename=dehtmlify(editable.innerHTML,true,60);
		editable.innerHTML=examplename;
		AJAXService("editExampleName","&examplename="+examplename);
}

function highlightop(otherop,thisop)
{
		$("#"+otherop).addClass("hi");					
		$("#"+thisop).addClass("hi");					
}

function dehighlightop(otherop,thisop)
{
		$("#"+otherop).removeClass("hi");					
		$("#"+thisop).removeClass("hi");					
}
				
function Code()
{
		switchDrop("codedrop");
}

function Wordlist()
{
		switchDrop("docudrop");
}
function Up()
{						
		location="Sectioned.php?courseid="+courseID+"&vers="+version;
}				

function gotoPosition(poz)
{
		location="EditorV30.php?courseid="+courseID+"&sectionid="+sectionID+"&version="+version+"&position="+poz;
}

function SkipB()
{
		if(issetDrop("backwdrop")&&isdropped==false){
				switchDrop("backwdrop");
		}else if(issetDrop("backwdrop")&&isdropped==true){
				isdropped=false;
		}else{
				position=parseInt(position)-1;
				location="EditorV30.php?courseid="+courseID+"&sectionid="+sectionID+"&version="+version+"&position="+position;
		}
}

function SkipBTimeout()
{
		if(dmd==1){
				switchDrop("backwdrop");
				isdropped=true;
		}
}

function SkipBDown()
{
		setTimeout(function(){SkipBTimeout();}, 1000);							
		dmd=1;
}

function SkipBUp()
{
		dmd=0;
}

function SkipF()
{
		if(issetDrop("forwdrop")&&isdropped==false){
				switchDrop("forwdrop");
		}else if(issetDrop("forwdrop")&&isdropped==true){
				isdropped=false;
		}else{
				position=parseInt(position)+1;
				location="EditorV30.php?courseid="+courseID+"&sectionid="+sectionID+"&version="+version+"&position="+position;
		}
}

function SkipFTimeout()
{
		if(dmd==1){
				switchDrop("forwdrop");
				isdropped=true;
		}
}

function SkipFDown()
{
		setTimeout(function(){SkipFTimeout();}, 1000);							
		dmd=1;
}

function SkipFUp()
{
		dmd=0;
}

function setup()
{
		$.ajax({url: "editorService.php", type: "POST", data: "coursename="+courseID+"&version="+version+"&sectionid="+sectionID+"&position="+position+"&opt=List", dataType: "json", success: returned});											
		
		if(sessionkind==courseID){
				setupEditable();						
		}
}

function Play()
{
		if(retdata['playlink']!="") location=retdata['playlink'];
}

function Plus()
{
		var filename=encodeURIComponent(filename);
		AJAXService("createNewExample","");						
}

function chosenFile(filename)
{
		var filename=encodeURIComponent(filename);
		AJAXService("selectFile","&filename="+filename);
}

function chosenWordlist()
{
		var wordlist=encodeURIComponent(document.getElementById('wordlistselect').value);
		AJAXService("selectWordlist","&wordlist="+wordlist);
}

function addImpword()
{	
	word=document.getElementById('impwordtextbox');
		// check if UTF encoded
		for(var i=0; i<word.value.length; i++) {
	        if(word.value.charCodeAt(i) > 127){
				document.getElementById('impwordlistError').innerHTML = "Error. Not UTF-encoded.";
				word.style.backgroundColor="#E33D3D";
	          	return;
	        }
	    }
	    
		wordEncoded = encodeURIComponent(word.value);
		AJAXService("addImpWord","&word="+wordEncoded);
		
	/*	word=encodeURIComponent(document.getElementById('impwordtextbox').value);
		AJAXService("addImpWord","&word="+word);*/
}

function delImpword()
{
		word=encodeURIComponent(document.getElementById('impwordtextbox').value);
		AJAXService("delImpWord","&word="+word);
}

function addImpline()
{
		from=document.getElementById('implistfrom');
		to=document.getElementById('implistto');
		errormsg = document.getElementById('impLinesError');
		
		// reset the color of input boxes
		to.style.backgroundColor="#FFFFFF";
		from.style.backgroundColor="#FFFFFF";  
		
		// make integers of the input
		fromValue = parseInt(from.value)
		toValue = parseInt(to.value)

		
		// error messages if NaN
		if((isNaN(fromValue))||(isNaN(toValue))){
			if(isNaN(fromValue)){
				from.style.backgroundColor="#E33D3D"; 
			}if(isNaN(toValue)){
				to.style.backgroundColor="#E33D3D"; 
			}
			errormsg.innerHTML = "Failed to add. Not a number.";
			return;
		}
		// add important lines
		if(fromValue<=toValue){
				AJAXService("addImpLine","&from="+fromValue+"&to="+toValue);
		}
		// Error message if from>to
		else{
			to.style.backgroundColor="#E42217"; 
			from.style.backgroundColor="#E42217";
			errormsg.innerHTML = "Failed to add. Use ascending order.";
		}
}

function delImpline()
{
		from=parseInt(document.getElementById('implistfrom').value);
		to=parseInt(document.getElementById('implistto').value);
		AJAXService("delImpLine","&from="+from+"&to="+to);
}

function addWordlistWord()
{ 
		word=document.getElementById('wordlisttextbox');
		// check if UTF encoded
		for(var i=0; i<word.value.length; i++) {
	        if(word.value.charCodeAt(i) > 127){
				document.getElementById('wordlistError').innerHTML = "Error. Not UTF-encoded.";
				word.style.backgroundColor="#E33D3D";
	          	return;
	        }
	    }   
	    wordlist=encodeURIComponent(retdata['chosenwordlist']);		
		encodedWord=encodeURIComponent(word.value);

		AJAXService("addWordlistWord","&wordlist="+wordlist+"&word="+encodedWord);
}

function delWordlistWord()
{
		word=encodeURIComponent(document.getElementById('wordlisttextbox').value);
		wordlist=encodeURIComponent(retdata['chosenwordlist']);
		AJAXService("delWordlistWord","&wordlist="+wordlist+"&word="+word);
}

function newWordlist()
{		
		wordlist=document.getElementById('wordlisttextbox');
		// check if UTF encoded
		for(var i=0; i<wordlist.value.length; i++) {
	        if(wordlist.value.charCodeAt(i) > 127){
				document.getElementById('wordlistError').innerHTML = "Error. Not UTF-encoded.";
				wordlist.style.backgroundColor="#E33D3D";
	          	return;
	        }
	    }
		wordlistEncoded = encodeURIComponent(wordlist.value);
		AJAXService("newWordlist","&wordlist="+wordlistEncoded);
}
				
function selectWordlistWord(word)
{
		document.getElementById('wordlisttextbox').value=word;
}

function selectImpWord(word)
{
		document.getElementById('impwordtextbox').value=word;
}

function selectImpLines(word)
{
		lines=word.split(",");
		if(lines.length=2){
				document.getElementById('implistfrom').value=lines[0];
				document.getElementById('implistto').value=lines[1];
		}
}

function changedPlayLink()
{
		playlink=encodeURIComponent(document.getElementById('playlink').value);	
		AJAXService("editPlaylink","&playlink="+playlink);				
}

/********************************************************************************

   UI Rendering Code

*********************************************************************************/

/*	
function sendOut(kind, sectid)
{
			// Either move section or example one step up / down / delete or 
			if(kind=='UP'){
					if(pos==-1){
							AJAXServiceSection("sectionUp","&sectid="+sectid);		
					}else{
							AJAXServiceSection("exampleUp","&sectid="+sectid);
					}
			}else if(kind=='DO'){
					if(pos==-1){
							AJAXServiceSection("sectionDown","&sectid="+sectid);		
					}else{
							AJAXServiceSection("exampleDown","&sectid="+sectid);
					}
			}else if(kind=='PL'){
					if(pos==-1){
							AJAXServiceSection("exampleNewSection","&sectid="+sectid);
					}else{
							AJAXServiceSection("exampleNew","&sectid="+sectid);
					}
			}else if(kind=='PP'){
					location="EditorV30.php?courseid="+courseID+"&sectionid="+sectid+"&version="+vers+"&position="+pos;						
			}else if(kind=='MI'){
					if(pos==-1){
							AJAXServiceSection("sectionDel","&sectid="+sectid);					
					}else{
							AJAXServiceSection("exampleDel","&sectid="+sectid);					
					}
			}
			
			return false;
}
*/
// Create a button for a section row
function Sectionbutton(kind,imgname,sectid,typ,pos)
{	
		if(typ=="SMALL"){
				return "<img src='icons/"+imgname+"' onclick='AJAXServiceSection(\""+kind+"\",\"&sectid="+sectid+"\")' />";				
		}else if(typ=="BIG"){
				return "<img src='icons/"+imgname+"' onclick='AJAXServiceSection(\""+kind+"\",\"&sectid="+sectid+"\")' />";
		}else if(typ=="EXAMPLE"){
				return "<img src='icons/"+imgname+"' onclick='AJAXServiceSection(\""+kind+"\",\"&sectid="+sectid+"\")' />";
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
						if(sessionkind==courseID||sessionkind.indexOf("Superuser")>-1){
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
						if(sessionkind==courseID||sessionkind.indexOf("Superuser")>-1){
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
										if(sessionkind==courseID||sessionkind.indexOf("Superuser")>-1){
												str+="<span id='EX"+data['examples'][j]['exampleno']+"' contenteditable='true'>"+data['examples'][j]['examplename']+"</span>";
												str+="<span class='smallbutt'>";
													str+=Sectionbutton("exampleUp","UpT.svg",data['examples'][j]['exampleno'],"EXAMPLE");
													str+=Sectionbutton("exampleDown","DownT.svg",data['examples'][j]['exampleno'],"EXAMPLE");
													str+=Sectionbutton("exampleDel","MinusT.svg",data['examples'][j]['exampleno'],"EXAMPLE");											
													str+="<img src='icons/PlayT.svg' onclick=\"window.location='EditorV30.php?courseid="+courseID+
														"&version="+vers+
														"&sectionid="+data['examples'][j]['sectionno']+
														"&position="+data['examples'][j]['pos']+
														"'\"/>";
												str+="</span>"
										}else{
												str+="<a href='EditorV30.php?courseid="+courseID+"&sectionid="+data['examples'][j]['sectionno']+"&version="+vers+"&position="+data['examples'][j]['pos']+"'>"+data['examples'][j]['examplename']+"</a>";		
										}
										str+="</span>";
								}
						}
				}

		}
		
		var slist=document.getElementById('Sectionlist');
		slist.innerHTML=str;

		if(sessionkind==courseID||sessionkind.indexOf("Superuser")>-1){
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

function returned(data)
{
		retdata=data;
				//----------------------------------------------------
		// Populate interface with returned data (all relevant data is returned)
		//----------------------------------------------------

		// Make before dropdown
		str="<div class='dropdownback'>Skip Backward</div>";
		for(i=0;i<data['before'].length;i++){
				str+="<span id='F"+data['before'][i][1]+"' onmouseover='highlightMenu(\"F"+data['before'][i][1]+"\");' onmouseout='dehighlightMenu(\"F"+data['before'][i][1]+"\");' onclick='gotoPosition(\""+data['before'][i][1]+"\")' class='dropdownitem'>"+data['before'][i][0]+"</span>";
		}
		var before=document.getElementById('backwdrop');
		before.innerHTML=str;
		
		// If we have no items before the current item - hide before button and dropdown
		var before=document.getElementById('beforebutton');
		if(data['before'].length==0){
				before.style.display="none";								
		}else{
				before.style.display="normal";														
		}

		// If we have no items before the current item - hide before button and dropdown
		var after=document.getElementById('afterbutton');
		if(data['after'].length==0){
				after.style.display="none";								
		}else{
				after.style.display="normal";								
		}

		// Playbutton Either Hidden or Shown depending on if there is any play link or not
		var playlink=document.getElementById('playbutton');
		if(data['playlink']==""){
				playlink.style.display="none";								
		}else{
				playlink.style.display="normal";										
		}
		
		// Make after dropdown
		str="<div class='dropdownback'>Skip Forward</div>";
		for(i=0;i<data['after'].length;i++){
				str+="<span id='F"+data['after'][i][1]+"' onmouseover='highlightMenu(\"F"+data['after'][i][1]+"\");' onmouseout='dehighlightMenu(\"F"+data['after'][i][1]+"\");' onclick='gotoPosition(\""+data['after'][i][1]+"\")' class='dropdownitem'>"+data['after'][i][0]+"</span>";
		}
		var after=document.getElementById('forwdrop');
		after.innerHTML=str;

		// Fill Description
		var docuwindow=document.getElementById("docucontent");
		docuwindow.innerHTML=data['desc'];

		// Fill Code Viewer with Code using Tokenizer
		rendercode(data['code'],"infobox");

		// Fill Section Name and Example Name
		var examplenme=document.getElementById('exampleName');
		examplenme.innerHTML=data['examplename'];
		var examplesect=document.getElementById("exampleSection");
		// Should be sectionname instead of sectionID
		
		examplesect.innerHTML=sectionID;
	//	examplesect.innerHTML=getsectionname(sectionID);

		if(sessionkind==courseID){
				// Fill file requester with file names
				str="";
				for(i=0;i<data['directory'].length;i++){
						if(data['directory'][i]==data['filename']){
								str+="<span class='dropdownitem menuch' id='DDI"+i+"' onmouseover='highlightMenu(\"DDI"+i+"\");' onmouseout='dehighlightMenu(\"DDI"+i+"\");'>"+data['directory'][i]+"</span>";						
						}else{
								str+="<span class='dropdownitem' id='DDI"+i+"' onclick='chosenFile(\""+data['directory'][i]+"\");' onmouseover='highlightMenu(\"DDI"+i+"\");' onmouseout='dehighlightMenu(\"DDI"+i+"\");'>"+data['directory'][i]+"</span>";														
						}
				}
				var filereq=document.getElementById('codedrop');
				if(filereq!=null) filereq.innerHTML=str;
		}
		
		//----------------------------------------------------
		// Fill wordlist part of document dialog
		//----------------------------------------------------

		if(sessionkind==courseID){

				str="<br/>Selected Wordlist: <br/><select id='wordlistselect' onchange='chosenWordlist();' >";
				for(i=0;i<data['wordlists'].length;i++){
						if(data['wordlists'][i]==data['chosenwordlist']){
								str+="<option selected='selected'>"+data['wordlists'][i]+"</option>";										
						}else{
								str+="<option>"+data['wordlists'][i]+"</option>";										
						}
				}
				str+="</select><br/>Wordlist: "+data['chosenwordlist']+"<br/><select size='8' style='width:200px;'>";
				for(i=0;i<data['wordlist'].length;i++){
						if(data['wordlist'][i][0]==data['chosenwordlist']){
								str+="<option onclick='selectWordlistWord(\""+data['wordlist'][i][1]+"\");'>"+data['wordlist'][i][1]+"</option>";										
						}
				}
				str+="</select><br/>";
				str+="<div id='wordlistError'></div>";
				str+="<input type='text' size='24' id='wordlisttextbox' />";
				str+="<input type='button' value='add' onclick='addWordlistWord();' />";
				str+="<input type='button' value='del' onclick='delWordlistWord();' />";
				str+="<input type='button' value='new' onclick='newWordlist();'' />";
		
				//----------------------------------------------------
				// Fill important word list	part of document dialog
				//----------------------------------------------------
				str+="</select><br/><br/>Important Word List: <br/><select size='8' style='width:200px;'>";
				for(i=0;i<data['impwords'].length;i++){
						str+="<option onclick='selectImpWord(\""+data['impwords'][i]+"\");'>"+data['impwords'][i]+"</option>";										
				}
				str+="</select><br/>";
				str+="<div id='impwordlistError'></div>";
				str+="<input type='text' size='24' id='impwordtextbox' />";
				str+="<input type='button' value='add' onclick='addImpword();' />";
				str+="<input type='button' value='del' onclick='delImpword();'/>";													
		
				//----------------------------------------------------
				// Fill important line list part of document dialog
				//----------------------------------------------------
				str+="<br/><br/>Important lines: <br/><select size='4'>"; 
				for(i=0;i<data['improws'].length;i++){
						str+="<option onclick='selectImpLines(\""+data['improws'][i]+"\");'>"+data['improws'][i][0]+"-"+data['improws'][i][1]+"</option>";										
				}
				str+="</select><br/>"
				str+="<div id='impLinesError'></div>";
				str+="<input type='text' size='4' id='implistfrom' />-<input type='text' size='4' id='implistto' />";
				str+="<input type='button' value='add' onclick='addImpline();' />";
				str+="<input type='button' value='del' onclick='delImpline();' />";
				str+="<br/><br/>Play Link: <input type='text' size='32' id='playlink' onblur='changedPlayLink();' value='"+data['playlink']+"' />";						
		
				var docurec=document.getElementById('docudrop');
				if(docurec!=null) docurec.innerHTML=str;						
		}
}

/********************************************************************************

   HTML freeform editing code

*********************************************************************************/

//----------------------------------------------------------------------------------
// Switches Dropdown List to Visible
//----------------------------------------------------------------------------------

function hideDrop(dname)
{
		var dropd=document.getElementById(dname);
		if(dropd!=null) dropd.style.display="none";							
}

//----------------------------------------------------------------------------------
// Switches Dropdown List to Visible
//----------------------------------------------------------------------------------

function switchDrop(dname)
{
		var dropd=document.getElementById(dname);
		if(dropd.style.display=="block"){
				dropd.style.display="none";							
		}else{
				hideDrop("forwdrop");
				hideDrop("backwdrop");
				hideDrop("docudrop");
				hideDrop("codedrop");

				dropd.style.display="block";
		}
}

//----------------------------------------------------------------------------------
// Reads value from Dropdown List
//----------------------------------------------------------------------------------

function issetDrop(dname)
{
		var dropd=document.getElementById(dname);
		if(dropd.style.display=="block"){
				return true;
		}else{
				return false;
		}
}

//----------------------------------------------------------------------------------
// Connects blur event to a functon for each editable element
//----------------------------------------------------------------------------------

function setupEditable()
{
		if(sessionkind==courseID){
				var editable=document.getElementById('exampleName');
				editable.addEventListener("blur", function(){editedExamplename();}, true);
		
				var fditable=document.getElementById('docucontent');
				fditable.addEventListener("blur", function(){editedDescription();}, true);
		}
}

//----------------------------------------------------------------------------------
// Removes most html tags from a string!
//----------------------------------------------------------------------------------

function dehtmlify(mainstr,ignorebr,maxlength)
{
		
		mod=0;
		outstr="";
		
		if(maxlength==0||mainstr.length<maxlength){
				ln=mainstr.length;
		}else{
				ln=maxlength;
		}
		tagstr="";
		
		for(i=0;i<ln;i++){
				currchr=mainstr.charAt(i);
				if(currchr=="<"){
						mod=1;
						tagstr="";
				}else if(mod==1&&currchr==" "){
						mod=2;
				}else if(currchr==">"){
						mod=0;
						if(tagstr=="br"||tagstr=="b"||tagstr=="strong"){
								if(tagstr=="br"&&ignorebr==true){
										// Ignore BR tag 
								}else{
										outstr+="<"+tagstr+">";
								}
						}else if(tagstr=="br/"||tagstr=="b/"||tagstr=="strong/"){
								if(tagstr=="br/"&&ignorebr==true){
										// Ignore BR tag 
								}else{
										outstr+="<"+tagstr+">";
								}
						}else if(tagstr=="/br"||tagstr=="/b"||tagstr=="/strong"){
								if(tagstr=="/br"&&ignorebr==true){
										// Ignore BR tag 
								}else{
										outstr+="<"+tagstr+">";
								}
						}
				}else{
						if(mod==0){
								outstr+=currchr;
						}else if(mod==1){
								tagstr+=currchr;
						}else if(mod==2){
								if(currchr=="/") tagstr+=currchr;
						}
				}
		}
		return outstr;
}

/********************************************************************************

   Tokenizer

*********************************************************************************/

// Token class and storage definition									
function token (kind,val,fromchar,tochar,row) {
this.kind = kind;
this.val = val;
this.from = fromchar;
this.to = tochar;
this.row = row;
}

//----------------------------------------------------------
// Store token in tokens array
// Creates a new token object using the constructor
//----------------------------------------------------------						

function maketoken(kind,val,from,to,rowno)
{
newtoken=new token(kind,val,from,to,rowno);
tokens.push(newtoken);
}

//----------------------------------------------------------
// Writes error from tokenizer
//----------------------------------------------------------						

function error(str,val,row)
{
alert("Tokenizer Error: "+str+val+" at row "+row);
}

//----------------------------------------------------------
// Tokenize function 
// Tokenizer partly based on ideas from the very clever tokenizer written by Douglas Cockford
// The tokenizer is passed a string, and a string of prefix and suffix terminators
//----------------------------------------------------------						

function tokenize(instring,inprefix,insuffix)
{

var from;                   	// index of the start of the token.
var i = 0;                  	// index of the current character.
var length=instring.length;		// length of the string

var c;                      	// current character.
var n;                      	// current numerical value
var q;                      	// current quote character
var str;                    	// current string value.
var row=1;										// current row value


c = instring.charAt(i);
while (c) {

		from = i;

		if (c <= ' '){																					// White space and carriage return
			  if((c=='\n')||(c=='\r')||(c =='')){
						maketoken('newline',"",i,i,row);
						str="";
            row++;
				}else{
        		str=c;
				}
        i++;
    		while(true){
		        c=instring.charAt(i);

						if(c>' '||!c) break;
    				if((c=='\n')||(c=='\r')||(c =='')){
                //str += c;
								maketoken('whitespace',str,from,i,row);				                
								maketoken('newline',"",i,i,row);
                str="";
								// White space Row (so we get one white space token for each new row) also increase row number
    						row++;
    				}else{
            		str += c;		        				
    				}
            i++;
				}
				if(str!="") maketoken('whitespace',str,from,i,row);
		}else if((c >='a'&&c<='z')||(c>='A'&&c<='Z')){					// Names i.e. Text
    		str = c;
    		i++;
    		while(true){
        		c = instring.charAt(i);
        		if ((c >='a'&&c<='z')||(c>='A'&&c<='Z')||(c>='0'&&c<='9')||c=='_'){
            		str += c;
            		i++;
        		}else{
            		break;
        		}
    		}
    		maketoken('name',str,from,i,row);
    }else if(c >= '0' && c <= '9'){												// Number token
        str = c;
        i++;
    		while(true){
		        c = instring.charAt(i);
            if (c < '0' || c > '9') break;
            i++;
            str+=c;
        }
        if(c=='.'){
            i++;
            str+=c;
            for(;;){
    		        c=instring.charAt(i);
                if (c < '0' || c > '9') break;
                i++;
                str+=c;
            }
        }
        if (c=='e'||c=='E') {
            i++;
            str+=c;
		        c=instring.charAt(i);
            if(c=='-'||c=='+'){
                i+=1;
                str+=c;
    		        c=instring.charAt(i);
            }
            if (c < '0' || c > '9') error('Bad Exponent in Number: ',str,row);
            do {
                i++;
                str+=c;
    		        c=instring.charAt(i);
            }while(c>='0'&&c<='9');
        }
        if (c>='a'&&c<='z'){
            str += c;
            i += 1;
            error('Bad Number: ',str,row);
        }
        n=+str;
        if(isFinite(n)){
						maketoken('number',n,from,i,row);		            		
        }else{
            error('Bad Number: ',str,row);
        }
    }else if(c=='\''||c=='"'){																				// String .. handles c style breaking codes
        str='';
        q=c;
        i++;
    		while(true){
		        c=instring.charAt(i);

            if (c<' '){
        				if((c=='\n')||(c=='\r')||(c == '')) row++;						// Add row if this white space is a row terminator				 																						
            		error('Unterminated String: ',str,row);		                		
            }

            if (c==q) break;

            if (c=='\\'){
                i += 1;
                if (i >= length) {
                		error('Unterminated String: ',str,row);		                		
                }
    		        c=instring.charAt(i);
                
                if(c=='b'){ c='\b'; break; }
                if(c=='f'){ c='\f'; break; }
                if(c=='n'){ c='\n'; break; }
                if(c=='r'){ c='\r'; break; }
                if(c=='t'){ c='\t'; break; }
                if(c=='u'){
                    if (i >= length) {
		                		error('Unterminated String: ',str,row);		                		
                    }
                    c = parseInt(this.substr(i + 1, 4), 16);
                    if (!isFinite(c) || c < 0) {
		                		error('Unterminated String: ',str,row);		                		
                    }
                    c = String.fromCharCode(c);
                    i+=4;
                    break;		                    
                }
            }
            str += c;
            i++;
        }
        i++;
        maketoken('string',str,from,i,row);
        c=instring.charAt(i);

    }else if (c=='/'&&instring.charAt(i+1)=='/'){								// Comment of // type ... does not cover block comments
        i++;
        str=c;
    		while(true){
		        c=instring.charAt(i);
            if (c=='\n'||c=='\r'||c=='') {
                row++;
                break;
            }else{
                str+=c;                
            }
            i++;
        }
				maketoken('rowcomment',str,from,i,row);
				maketoken('newline',"",i,i,row);											                
    }else if (c=='/'&&instring.charAt(i+1)=='*'){								// Block comment of /* type
        i++;
    		str=c;
    		while(true){
		        c=instring.charAt(i);
            if ((c=='*'&&instring.charAt(i+1)=='/')||(i==length)) {
                str+="*/"
                i+=2;
    		        c=instring.charAt(i);
                break;
            }
            if (c=='\n'||c=='\r'||c=='') {
								maketoken('blockcomment',str,from,i,row);
								maketoken('newline',"",i,i,row);
                row++;
                str="";
            }else{
                str+=c;                
            }
            i++;
        }
				maketoken('blockcomment',str,from,i,row);
		}else if(inprefix.indexOf(c) >= 0) {											// Multi-character Operators
    		str = c;
    		i++;
    		while(true){
		        c=instring.charAt(i);
        		if (i >= length || insuffix.indexOf(c) < 0) {
            		break;
        		}
        		str += c;
        		i++;
    		}
    		maketoken('operator',str,from,i,row);
		} else {																									// Single-character Operators
    		i++;
    		maketoken('operator',c,from,i,row);
    		c = instring.charAt(i);
		}
		
}
}

//----------------------------------------------------------------------------------
// Renders a set of tokens from a string into a code viewer div
// Requires tokens created by a cockford-type tokenizer
//----------------------------------------------------------------------------------

function rendercode(codestring,destinationdiv)
{
		tokens = [];
		
		important = [];
		for(var i=0;i<retdata.impwords.length;i++){
				important.push(retdata.impwords[i]);		
		}

		keywords=[];
		for(var i=0;i<retdata.wordlist.length;i++){
				if(retdata.wordlist[i][0]==retdata.chosenwordlist){
						keywords.push(retdata.wordlist[i][1]);
				}
		}

		improws=[];
		for(var i=0;i<retdata.improws.length;i++){
				improws.push(retdata.improws[i]);
		}

		tokenize(codestring,"<>+-&","=>&:");
				
		// Iterate over token objects and print kind of each token and token type in window 
		printout=document.getElementById("infobox");
		str="";
		cont="";

		lineno=0;
		str+="<div class='norm'>";
		
		pcount=0;
		parenthesis=new Array();
		bcount=0;
		bracket=new Array();
		cbcount=0;
		cbracket=new Array();

		pid="";
		
		var iwcounter=0;
		
		for(i=0;i<tokens.length;i++){
				
				tokenvalue=String(tokens[i].val);
				// Make white space characters
				tokenvalue=tokenvalue.replace(/ /g, '&nbsp;');
				tokenvalue=tokenvalue.replace(/\\t/g, '&nbsp;&nbsp;');
				
				if(tokens[i].kind=="rowcomment"){
						cont+="<span class='comment'>"+tokenvalue+"</span>";
				}else if(tokens[i].kind=="blockcomment"){
						cont+="<span class='comment'>"+tokenvalue+"</span>";
				}else if(tokens[i].kind=="string"){
						cont+="<span class='string'>\""+tokenvalue+"\"</span>";
				}else if(tokens[i].kind=="number"){
						cont+="<span class='number'>"+tokenvalue+"</span>";
				}else if(tokens[i].kind=="name"){
						var foundkey=0;
						
						for(var ind in keywords){
								word=keywords[ind];
								if(word==tokenvalue){
										foundkey=1;
										break;		
								}
						}								
						
						for(var ind in important){
								word=important[ind];
								if(word==tokenvalue){
										foundkey=2;
										break;		
								}
						}
						
						if(foundkey==1){
								cont+="<span class='keyword'>"+tokenvalue+"</span>";														
						}else if(foundkey==2){
								iwcounter++;
								
								highlightKeyword("scrollTop")
								
								cont+="<span id='IW"+iwcounter+"' class='impword' onmouseover='highlightKeyword(\""+tokenvalue+"\")' onmouseout='dehighlightKeyword(\""+tokenvalue+"\")'>"+tokenvalue+"</span>";														
						}else{
								cont+=tokenvalue;
						}
						
				}else if(tokens[i].kind=="operator"){
						if(tokenvalue=="("){
								pid="PA"+pcount;
								pcount++;
								parenthesis.push(pid);
								cont+="<span id='"+pid+"' class='oper' onmouseover='highlightop(\"P"+pid+"\",\""+pid+"\");' onmouseout='dehighlightop(\"P"+pid+"\",\""+pid+"\");'>"+tokenvalue+"</span>";												
						}else if(tokenvalue==")"){
								pid=parenthesis.pop();
								cont+="<span id='P"+pid+"' class='oper' onmouseover='highlightop(\""+pid+"\",\"P"+pid+"\");' onmouseout='dehighlightop(\""+pid+"\",\"P"+pid+"\");'>"+tokenvalue+"</span>";																						
						}else if(tokenvalue=="["){
								pid="BR"+bcount;
								bcount++;
								bracket.push(pid);
								cont+="<span id='"+pid+"' class='oper' onmouseover='highlightop(\"P"+pid+"\",\""+pid+"\");' onmouseout='dehighlightop(\"P"+pid+"\",\""+pid+"\");'>"+tokenvalue+"</span>";												
						}else if(tokenvalue=="]"){
								pid=bracket.pop();
								cont+="<span id='P"+pid+"' class='oper' onmouseover='highlightop(\""+pid+"\",\"P"+pid+"\");' onmouseout='dehighlightop(\""+pid+"\",\"P"+pid+"\");'>"+tokenvalue+"</span>";																						
						}else if(tokenvalue=="{"){
								pid="CBR"+cbcount;
								cbcount++;
								cbracket.push(pid);
								cont+="<span id='"+pid+"' class='oper' onmouseover='highlightop(\"P"+pid+"\",\""+pid+"\");' onmouseout='dehighlightop(\"P"+pid+"\",\""+pid+"\");'>"+tokenvalue+"</span>";												
						}else if(tokenvalue=="}"){
								pid=cbracket.pop();
								cont+="<span id='P"+pid+"' class='oper' onmouseover='highlightop(\""+pid+"\",\"P"+pid+"\");' onmouseout='dehighlightop(\""+pid+"\",\"P"+pid+"\");'>"+tokenvalue+"</span>";																						
						}else{
								cont+="<span class='oper'>"+tokenvalue+"</span>";										
						}
				}else{
						cont+=tokenvalue;
				}
				
				if(tokens[i].kind=="newline"){
						lineno++;

						// Make line number										
						if(lineno<10){
								num="<span class='no'>"+lineno+"&nbsp;&nbsp;&nbsp;</span>";
						}else if(lineno>=10 && lineno<100){
								num="<span class='no'>"+lineno+"&nbsp;&nbsp;</span>";
						}else{
								num="<span class='no'>"+lineno+"&nbsp;</span>";
						}
						
						if(cont==""){
								cont="&nbsp;&nbsp;";
						}
						
						
						if(improws.length==0){
								str+="<div class='norm'>";
						}else{
								for(var kp=0;kp<improws.length;kp++){
										if(lineno>=parseInt(improws[kp][0])&&lineno<=parseInt(improws[kp][1])){
												str+="<div class='impo'>";
												break;
										}else{
												str+="<div class='norm'>";
										}						
								}
						}	
						str+=num+cont;
						cont="";
						str+="</div>";					
				}
		}
		str+="</div>";						
		printout.innerHTML=str;
		linenumbers();
}
function linenumbers(){	
	if(localStorage.getItem("linenumbers") == "false"){	
		$( "#numberbutton img" ).attr('src', 'new icons/noNumbers_button.svg');
		$( ".no" ).css("display","none");	
	}
}
function fadelinenumbers(){
	if ( $( ".no" ).is( ":hidden" ) ) {
		$( ".no" ).fadeIn( "fast" );
		$( "#numberbutton img" ).attr('src', 'new icons/numbers_button.svg');

		localStorage.setItem("linenumbers", "true");					  
	}else{
		$( ".no" ).fadeOut("fast");
		$( "#numberbutton img" ).attr('src', 'new icons/noNumbers_button.svg');
		localStorage.setItem("linenumbers", "false");
	 }
}
