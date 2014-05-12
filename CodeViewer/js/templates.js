
function changetemplate(templateid){
	AJAXService("changetemplate","&templateid="+templateid);
}

function choosetemplate(){
	if(sessiondkind = "w"){
		if(parseInt(retdata['template'][0][0]) == 0){
			var div2 = document.getElementById("div2");
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
			return false;
		}
		return true;
	}
}


function returned(data)
{
		retdata=data;
		
		if(!choosetemplate()){
			return;
		}
		// remove templatebox if it still exists
		if(document.getElementById("picktemplate")){
			document.getElementById("div2").removeChild(document.getElementById("picktemplate"));
		}
		
		// create boxes
		for(i=0;i<data['box'].length;i++){
			// create a templatebox
			alert(i+1);
			addTemplatebox("box"+(i+1));
			// Print out code example in a code box
			if((data['box'][i][1]) == "CODE"){
				rendercode(data['box'][i][2],"box"+(i+1));
			}
			
			// Print out description in a document box
			if((data['box'][i][1]) == "DOCUMENT"){

				var desc = data['box'][i][2];
				desc = replaceAll("<span&nbsp;","<span ",desc);
				desc =  replaceAll("<img&nbsp;","<img ",desc);
				
				var docuwindow = document.getElementById("box"+(i+1));
				docuwindow.innerHTML=desc;
				//  Fill description with code using tokenizer.
				var cs = docuwindow.getElementsByClassName("codestyle");
				for(var i=0; i<cs.length; i++){
					desc = desc.replace(cs[i].innerHTML,renderdesccode(replaceAll("&nbsp;", " ",replaceAll("<br>","\n",cs[i].innerHTML))));
				}
				docuwindow.innerHTML = desc;
				
				if(sessionkind == "w"){
					docuwindow.setAttribute("contenteditable","true");
					if(!document.getElementById("box"+(i+1)+"menu")){
					
						var boxmenu = document.createElement("div");
						document.getElementById("div2").appendChild(boxmenu);
						boxmenu.setAttribute("class", "buttomenu2");
						boxmenu.setAttribute("id", "box"+(i+1)+"menu");
						
						var str = '<table cellspacing="2"><tr>';
						str+= '<td class="butto2" title="Remove formatting" onclick="styleReset();"><img src="new icons/reset_button.svg" /></td>';
						str+=  '<td class="butto2" title="Heading" onclick="styleHeader();"><img src="new icons/boldtext_button.svg" /></td>';
						str+='<td class="butto2" title="Code example" onclick="styleCode();"><img src="new icons/quote_button.svg" /></td>';
						str+= "<td class='butto2' id='hideimage' title='Select image' onclick=''><img src='new icons/picture_button.svg' /></td>";
						str+= "<td class='butto2' title='Save' onclick='Save(\""+"box"+(i+1)+"\");'><img src='new icons/save_button.svg' /></td>";
						str+= '</tr></table></div>';
						
						boxmenu.innerHTML=str;
					}
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
		//		before[i].onclick ="SkipF();";													
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
	
		
		// Playbutton Either Hidden or Shown depending on if there is any play link or not
	/*	var playbutton=document.getElementsByClassName('playbutton');
		if(data['playlink']==""){
			for(var i=0; i<playbutton.length; i++){
				playbutton[i].childNodes[0].style.opacity="0.2";
				playbutton[i].onclick=function(){};
			}
		}else{
			for(var i=0; i<playbutton.length; i++){
				playbutton[i].childNodes[0].style.opacity="1";
				playbutton[i].onclick=function(){Play();};
			}									
		}
	*/	
		// Make after dropdown
		str="<div class='dropdownback dropdownbackStyle'>Skip Forward</div>";
		for(i=0;i<data['after'].length;i++){
				str+="<span id='F"+data['after'][i][1]+"' onclick='gotoPosition(\""+data['after'][i][1]+"\")' class='dropdownitem dropdownitemStyle'>"+data['after'][i][0]+"</span>";
		}
		var after=document.getElementById('forwdrop');
		after.innerHTML=str;

		// Fill Description
		var docuwindow=document.getElementById("docucontent");
		
		// replacing span&nsbp; so it is perceived as a tagname for codestyle
	
	/* START code for first function made START */
	//	var desc = data['desc'];
	//	desc = replaceAll("<span&nbsp;","<span ",data['desc']);
	//	desc = replaceAll('"&nbsp;','" ', desc);
	//	desc = replaceAll('&nbsp;"',' "', desc);
	//	docuwindow.innerHTML = desc;
	/* 	STOP */	
	
	/* START 
		var desc = data['desc'];
		desc = replaceAll("<span&nbsp;","<span ",desc);
		desc =  replaceAll("<img&nbsp;","<img ",desc);
		
		docuwindow.innerHTML = desc;
		
		//  Fill description with code using tokenizer.
		var cs = docuwindow.getElementsByClassName("codestyle");
		for(var i=0; i<cs.length; i++){
			desc = desc.replace(cs[i].innerHTML,renderdesccode(replaceAll("&nbsp;", " ",replaceAll("<br>","\n",cs[i].innerHTML))));
		}
		docuwindow.innerHTML = desc;
		STOP */
		
		// Fill Code Viewer with Code using Tokenizer
	//	rendercode(data['code'],"infobox");

		// Fill Section Name and Example Name
		var examplenme=document.getElementById('exampleName');
		examplenme.innerHTML=data['examplename'];
		var examplesect=document.getElementById("exampleSection");
		examplesect.innerHTML=data['entryname'];
		
		
		if(sessionkind=="w"){
				// Fill file requester with file names
				str="";
				for(i=0;i<data['directory'].length;i++){
						if(data['directory'][i]==data['filename']){
								str+="<span class='dropdownitem dropdownitemStyle menuch' id='DDI"+i+"'>"+data['directory'][i]+"</span>";						
						}else{
								str+="<span class='dropdownitem dropdownitemStyle' id='DDI"+i+"' onclick='chosenFile(\""+data['directory'][i]+"\");''>"+data['directory'][i]+"</span>";														
						}
				}
				var filereq=document.getElementById('codedrop');
				if(filereq!=null) filereq.innerHTML=str;


            // Fill imagelist
            str="";
            for(i=0;i<data['images'].length;i++){

                    //str+="<span class='dropdownitem' id='DDII"+i+"' onclick='insertImage(\""+data['images'][i]+"\");' onmouseover='highlightMenu(\"DDII"+i+"\");' onmouseout='dehighlightMenu(\"DDII"+i+"\");'>"+data['images'][i]+"</span>";
                str+="<img id='DDII"+i+"' onclick='insertImage(\"imgupload/"+data['images'][i]+"\");' title=\""+data['images'][i]+"\" src=\"imgupload/"+data['images'][i]+"\"></img>";

            }

            var filereq=document.getElementById('imgdrop');
            if(filereq!=null) filereq.innerHTML=str;






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