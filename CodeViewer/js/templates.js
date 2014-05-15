
function changetemplate(templateid){
	AJAXService("changetemplate","&templateid="+templateid);
	location.reload();
}

function choosetemplate(){
	var templateholder = document.createElement("div");
	templateholder.setAttribute("id", "picktemplate");
	templateholder.style.zIndex='2';
	var examplenme=document.getElementById('exampleName');
	var examplesect=document.getElementById("exampleSection");
	examplenme.innerHTML=retdata['examplename'];
	examplesect.innerHTML=retdata['entryname'];
			
			
	str="<h1>Pick a template for your example!</h1>";
	str+="<img class='templatethumbicon wiggle' onclick='changetemplate(\""+'1'+"\");' src='new icons/template1_butt.svg' />";
	str+="<img class='templatethumbicon wiggle' onclick='changetemplate(\""+'2'+"\");' src='new icons/template2_butt.svg' />";
	str+="<img class='templatethumbicon wiggle' onclick='changetemplate(\""+'3'+"\");' src='new icons/template3_butt.svg' />";
	str+="<img class='templatethumbicon wiggle' onclick='changetemplate(\""+'4'+"\");' src='new icons/template4_butt.svg' />";
	str+="<img class='templatethumbicon wiggle' onclick='changetemplate(\""+'5'+"\");' src='new icons/template5_butt.svg' />";
	templateholder.innerHTML = str;
	div2.appendChild(templateholder);
}
function addTemplatebox(id)
{
	// don't create box if it already exists
	if(document.getElementById(id)){
		return;
	}
	var content = document.getElementById("div2");
		
	var div = document.createElement("div");
	content.appendChild(div);
	div.id = id;
	div.className = id+"Style";		
}

function createboxmenu(contentid, boxid, type){
	if(!document.getElementById(contentid+"menu")){
		var boxmenu = document.createElement("div");
		document.getElementById("div2").appendChild(boxmenu);
		boxmenu.setAttribute("class", "buttomenu2");
		boxmenu.setAttribute("id", contentid+"menu");

		if(type=="DOCUMENT"){
			var str = '<table cellspacing="2"><tr>';
			str+= '<td class="butto2" title="Remove formatting" onclick="styleReset();"><img src="new icons/reset_button.svg" /></td>';
			str+= '<td class="butto2" title="Heading" onclick="styleHeader();"><img src="new icons/boldtext_button.svg" /></td>';
			str+= '<td class="butto2" title="Code example" onclick="styleCode();"><img src="new icons/quote_button.svg" /></td>';
			str+= "<td class='butto2' onclick='displayDrop(\"imgdrop\");'  title='Select image'><img src='new icons/picture_button.svg' /></td>";
		//	str+= "<td class='butto2' title='Save' onclick='Save(\""+contentid+"\",\""+boxid+"\");'><img src='new icons/save_button.svg' /></td>";
			str+= "<td  class='butto2'>";
			str+= "<select onchange='changeboxcontent(this.value,\""+boxid+"\",\""+contentid+"\");removeboxmenu(\""+contentid+"menu\");'>";
					str+= "<option value='DOCUMENT'>Description section</option>";
					str+= "<option value='CODE'>Code example</option>";
				str+= "</select>";
			str+= '</td></tr></table>';
		}else if(type=="CODE"){
			var str = "<table cellspacing='2'><tr>";
			str+="<td class='butto2' onclick='displayDrop(\""+contentid+"codedrop\");' title='Select codesource' ><img src='new icons/list_codefiles.svg' /></td>";
			str+="<td class='butto2'>";
			str+= "<select onchange='changeboxcontent(this.value,\""+boxid+"\");removeboxmenu(\""+contentid+"menu\");'>";
					str+= "<option value='CODE'>Code example</option>";
					str+= "<option value='DOCUMENT'>Description section</option>";
				str+= "</select>";
			str+= '</td></tr></table>';
		}else{
			var str = "<table cellspacing='2'><tr>";
			str+="<td class='butto2'>";
			str+= "<select onchange='changeboxcontent(this.value,\""+boxid+"\",\""+contentid+"\");removeboxmenu(\""+contentid+"menu\");'>";
				str+= "<option>Choose content</option>";
					str+= "<option value='CODE'>Code example</option>";
					str+= "<option value='DOCUMENT'>Description section</option>";
				str+= "</select>";
			str+= '</td></tr></table>';
		}					
		boxmenu.innerHTML=str;
	}
}

function removeboxmenu(menuid)
{
	document.getElementById(menuid).remove();
}
function changeboxcontent(boxcontent,boxid)
{
	AJAXService("changeboxcontent","&boxid="+boxid+"&boxcontent="+boxcontent);	
}
function displayDrop(dropid)
{	
	drop = document.getElementById(dropid);
	if($(drop).is(":hidden")){
		drop.style.display="block";
	}else{
		drop.style.display="none";
	}	
}
function createcodedrop(contentid,boxid)
{ 

    if(document.getElementById(contentid+"codedrop")){
        var codedrop = document.getElementById(contentid+"codedrop");
    }

    else {
    var codedrop = document.createElement("div");
	codedrop.setAttribute("id", contentid+"codedrop");
	codedrop.setAttribute("class", "dropdown dropdownStyle codedrop codedropStyle");
	document.getElementById("div2").appendChild(codedrop);
    }

	str="";
	for(i=0;i<retdata['directory'].length;i++){
		if(retdata['directory'][i]==retdata['filename']){
			/* SET BGCOLOR HERE TO LET THE USER KNOW WHICH FILE IS CHOSEN */
			str+="<span class='dropdownitem dropdownitemStyle menuch' style='background-color:#fff' id='DDI"+i+"'>"+retdata['directory'][i]+"HEJ</span>";						
		}else{
			str+="<span class='dropdownitem dropdownitemStyle' id='DDI"+i+"' onclick='chosenFile(\""+retdata['directory'][i]+"\",\""+boxid+"\");''>"+retdata['directory'][i]+"</span>";														
		}
	}


    //----------------------------------------------------
    // Fill important line list part of document dialog
    //----------------------------------------------------
    str+="<br/><br/>Important lines: <br/><select size='4'>";
    for(i=0;i<retdata['improws'].length;i++){

        if ((retdata['improws'][i][0]) == boxid){
        str+="<option onclick='selectImpLines(\""+retdata['improws'][i]+"\");'>"+retdata['improws'][i][1]+"-"+retdata['improws'][i][2]+"</option>";
        }
    }
    str+="</select><br/>"
    str+="<div id='impLinesError' class='errormsg'></div>";
    str+="<input type='text' size='4' id=\""+boxid+"from\" /> - <input type='text' size='4' id=\""+boxid+"to\"/>";
    str+="<input type='button' value='add' onclick='addImpline(\""+boxid+"\")'/>";
    str+="<input type='button' value='del' onclick='delImpline(\""+boxid+"\")'/>";


	codedrop.innerHTML=str;
}


function returned(data)
{
		retdata=data;
		
		// User can choose template if no template has been choosen and the user have write access.
		if((data['template'][0][0] == 0)){
			if(sessionkind == "w"){
				choosetemplate();
				return;
			}else{
				/* Create an error message to user or send user back to duggasys */
				return;
			}
			
		}
		
		// remove templatebox if it still exists
		if(document.getElementById("picktemplate")){
			document.getElementById("div2").removeChild(document.getElementById("picktemplate"));
		}
		
		// create boxes
		for(i=0;i<retdata['template'][0][2];i++){
			
			var contentid="box"+data['box'][i][0];
			var boxid=data['box'][i][0];
			var boxtype=data['box'][i][1];
			var boxcontent=data['box'][i][2];
		
			
			// create a templatebox
			addTemplatebox(contentid);
			// Print out code example in a code box
			if(boxtype == "CODE"){
				
				document.getElementById(contentid).removeAttribute("contenteditable");
					
					// Create a boxmenu for users with write access.	
				if(sessionkind == "w"){
					createboxmenu(contentid,boxid,boxtype);
					createcodedrop(contentid,boxid);
				}
				rendercode(boxcontent,boxid);
			}
			
			// Print out description in a document box
			if(boxtype == "DOCUMENT"){
			
				var desc = boxcontent;
				desc = replaceAll("<span&nbsp;","<span ",desc);
				desc =  replaceAll("<img&nbsp;","<img ",desc);
				
				var docuwindow = document.getElementById(contentid);
				docuwindow.innerHTML=desc;
				//  Fill description with code using tokenizer.
				var cs = docuwindow.getElementsByClassName("codestyle");
				for(y=0; y<cs.length; y++){
					desc = desc.replace(cs[y].innerHTML,renderdesccode(replaceAll("&nbsp;", " ",replaceAll("<br>","\n",cs[y].innerHTML))));
				}
				docuwindow.innerHTML = desc;
				
				if(sessionkind == "w"){
					docuwindow.setAttribute("contenteditable","true");
					createboxmenu(contentid,boxid,boxtype);
				}
			}
			if((data['box'][i][1]) == "NOT DEFINED"){
				if(sessionkind == "w"){
					createboxmenu(contentid,boxid,boxtype);
				}
			}		
		}
		
		changeCSS("css/"+data['template'][0][1]);
		
				//----------------------------------------------------
		// Populate interface with returned data (all relevant data is returned)
		//----------------------------------------------------

		// Make before dropdown
		str="<div class='dropdownback dropdownbackStyle'>Skip Backward</div>";
		for(i=0;i<data['before'].length;i++){
				str+="<span id='F"+data['before'][i][1]+"' onclick='gotoPosition(\""+data['before'][i][1]+"\")' class='dropdownitem dropdownitemStyle'>"+data['before'][i][0]+"</span>";
		}
		var before=document.getElementById('backwdrop');
		before.innerHTML=str;
		
		// If we have no items before the current item - hide before button and dropdown
		var before=document.getElementsByClassName('beforebutton');
		if(data['before'].length==0){
			for(var i=0; i<before.length; i++){
				before[i].childNodes[0].style.opacity="0.2";
				before[i].onclick="";
			}
		}else{
			for(var i=0; i<before.length; i++){
				before[i].style.opacity="1";	
			}	
		}

		// If we have no items before the current item - hide before button and dropdown
		var after=document.getElementsByClassName('afterbutton');
		if(data['after'].length==0){
			for(var i=0; i<after.length; i++){
				after[i].childNodes[0].style.opacity="0.2";
				after[i].onclick="";
			}
		}
	
			/* Create and check URL in playlink */
			var url = getPlaylinkURL();
			var playbutton=document.getElementsByClassName('playbutton');
			checkPlaylinkURL(url,
				function(status) { 
					if(status){ 
						for(var i=0; i<playbutton.length; i++){
							playbutton[i].childNodes[0].style.opacity="1";
							playbutton[i].onclick=function(){Play();};
						}			
					}else{
						for(var i=0; i<playbutton.length; i++){
							playbutton[i].childNodes[0].style.opacity="0.2";
							playbutton[i].onclick=function(){};
						}
					}
				}
			);

		// Make after dropdown
		str="<div class='dropdownback dropdownbackStyle'>Skip Forward</div>";
		for(i=0;i<data['after'].length;i++){
				str+="<span id='F"+data['after'][i][1]+"' onclick='gotoPosition(\""+data['after'][i][1]+"\")' class='dropdownitem dropdownitemStyle'>"+data['after'][i][0]+"</span>";
		}
		var after=document.getElementById('forwdrop');
		after.innerHTML=str;

		// Fill Section Name and Example Name
		var examplenme=document.getElementById('exampleName');
		examplenme.innerHTML=data['examplename'];
		var examplesect=document.getElementById("exampleSection");
		examplesect.innerHTML=data['entryname'];
		
		
		if(sessionkind=="w"){
            // Fill imagelist
            str="";
            for(i=0;i<data['images'].length;i++){
                    //str+="<span class='dropdownitem' id='DDII"+i+"' onclick='insertImage(\""+data['images'][i]+"\");' onmouseover='highlightMenu(\"DDII"+i+"\");' onmouseout='dehighlightMenu(\"DDII"+i+"\");'>"+data['images'][i]+"</span>";
                str+="<img id='DDII"+i+"' onclick='insertImage(\"imgupload/"+data['images'][i]+"\");' title=\""+data['images'][i]+"\" src=\"imgupload/"+data['images'][i]+"\"></img>";
            }

            var imgdrop=document.getElementById('imgdrop');
            if(imgdrop!=null){
            	imgdrop.innerHTML=str;
            } 
		}
		
		//----------------------------------------------------
		// Fill wordlist part of document dialog
		//----------------------------------------------------

		if(sessionkind=="w"){
			
			// Check what tab in general settings menu should be displayed, otherwise the same tabmenu will be displayed after every update.
			if(tabmenuvalue == "wordlist"){
				displayWordlist();
			}else if(tabmenuvalue == "playlink"){
				displayPlaylink();	
			}else if(tabmenuvalue == "templates"){
				displayTemplates();
			}					
		}
}