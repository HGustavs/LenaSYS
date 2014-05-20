
function changetemplate(templateid){
	AJAXService("changetemplate","&templateid="+templateid);
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
	var content = document.getElementById("div2");
	var outerdiv = document.createElement("div");
	content.appendChild(outerdiv);
	outerdiv.id = id+"wrapper";

	if(id==("box"+retdata['template'][0][2])){
		outerdiv.className = "boxwrapper activebox";
	}else{
		outerdiv.className = "boxwrapper deactivatedbox";
	}
	
	var innerdiv = document.createElement("div");
	outerdiv.appendChild(innerdiv);
	innerdiv.id = id;
	innerdiv.className= "box";
}
	

function createhotdogmenu(){
	var content = document.getElementById("div2");
	if(document.getElementById("hotdogdrop")){
		var hotdogmenu = document.getElementById("hotdogdrop");
	}else{
		var hotdogmenu = document.createElement("span");
		content.appendChild(hotdogmenu);
		hotdogmenu.id = "hotdogdrop";
		hotdogmenu.className = "hotdogdropStyle dropdown dropdownStyle showmobile";
	}
	
		str = '<table cellspacing="0" class="showmobile"><tr>';
		str += '<td class="mbutto mbuttoStyle " title="Back to list" onclick="Up();"><img src="new icons/home_button.svg" /></td>';
		str += '<td class="mbutto mbuttoStyle beforebutton " id="beforebutton" title="Previous example" onmousedown="SkipBDown();" onmouseup="SkipBUp();" onclick="SkipB();"><img src="new icons/backward_button.svg" /></td>';
		str += '<td class="mbutto mbuttoStyle afterbutton " id="afterbutton" title="Next example" onmousedown="SkipFDown();" onmouseup="SkipFUp();" onclick="SkipF();""><img src="new icons/forward_button.svg" /></td>';
		str += '<td class="mbutto mbuttoStyle playbutton " id="playbutton" title="Open demo" onclick="Play();"><img src="new icons/play_button.svg" /></td>';
		str += '</tr>';
		for(i=0;i<retdata['template'][0][2];i++){
		//	str += "<tr><td class='mbutto mbuttoStyle' title='Show \""+retdata['box'][i][3]+"\"' onclick='toggleClass(\"box"+(i+1)+"wrapper\");' colspan='4'>"+retdata['box'][i][3]+"<img src='new icons/hotdogTabButton2.svg' /></td></tr>";
			str += "<tr><td class='mbutto mbuttoStyle' title='Show \""+retdata['box'][i][3]+"\"' onclick='toggleTabs(\"box"+(i+1)+"wrapper\",this);' colspan='4'>"+retdata['box'][i][3]+"<img src='new icons/hotdogTabButton.svg' /></td></tr>";
		}		
 //		str += '<tr><td class="mbutto mbuttoStyle " title="Show JS" onclick="" colspan="4">JS<img src="new icons/hotdogTabButton2.svg" /></td></tr>';
 		str += '<tr><td id="numberbuttonMobile" class="mbutto mbuttoStyle " title="Show rownumbers" onclick="fadelinenumbers();" colspan="4">Show rownumbers<img src="new icons/hotdogTabButton.svg" /></td></tr>';
		str += '<tr><td class="mbutto mbuttoStyle " title="Settings" onclick="" colspan="4">Settings</td></tr>';
		str += '<tr><td class="mbutto mbuttoStyle " title="Change to desktop site" onclick="" colspan="4">Desktop site</td></tr>';
		str += '<tr><td class="mbutto mbuttoStyle " title="Chose themes" onclick="mobileTheme()" colspan="4">Theme </td></tr>';
		str += '<tr><td class="mbutto mbuttoStyleLight mobilethemebutton themeicon subbutton" colspan="4" onclick="selectTheme(&quot;black&quot;);"><img src="new icons/theme_black.svg"><span>Black background</span></td></tr>';
		str += '<tr><td class="mbutto mbuttoStyleLight mobilethemebutton themeicon subbutton" colspan="4" onclick="selectTheme(&quot;white&quot;);"><img src="new icons/theme_white.svg"><span>White background</span></td></tr>';
		str +='<tr><td class="mbutto mbuttoStyleLight mobilethemebutton themeicon subbutton" colspan="4" onclick="selectTheme(&quot;colorblind&quot;);"><img src="new icons/theme_blind.svg"><span>Colorblind</span></td></tr>';
							//echo '</td></tr>';
		str += '</table>';
	
	hotdogmenu.innerHTML = str;
}

/* Toogle the tabs for mobile version */
function toggleTabs(box,td){
	if($("#"+box).is(":hidden")){
		$("#"+box).css("display","block");
		$( td ).children().attr('src', 'new icons/hotdogTabButton.svg'); 
	}else{
		$("#"+box).css("display","none");
		$( td ).children().attr('src', 'new icons/hotdogTabButton2.svg'); 
	}
}

function createboxmenu(contentid, boxid, type){
	if(!document.getElementById(contentid+"menu")){
		var boxmenu = document.createElement("div");
		document.getElementById(contentid+"wrapper").appendChild(boxmenu);
		boxmenu.setAttribute("class", "buttomenu2 buttomenu2Style");
		boxmenu.setAttribute("id", contentid+"menu");
		if(sessionkind == "w"){
			if(type=="DOCUMENT"){
				var str = '<table cellspacing="2"><tr>';
				str+= '<td class="butto2" title="Change box title"><span class="boxtitle" contenteditable="true" onblur="changeboxtitle(this,'+boxid+');">'+retdata['box'][boxid-1][3]+'</span></td>';
				str+= '<td class="butto2 showdesktop" title="Remove formatting" onclick="styleReset();"><img src="new icons/reset_button.svg" /></td>';
				str+= '<td class="butto2 showdesktop" title="Heading" onclick="styleHeader();"><img src="new icons/boldtext_button.svg" /></td>';
				str+= '<td class="butto2 showdesktop" title="Code example" onclick="styleCode();"><img src="new icons/quote_button.svg" /></td>';
				str+= "<td class='butto2 showdesktop' onclick='displayDrop(\"imgdrop\");'  title='Select image'><img src='new icons/picture_button.svg' /></td>";
				str+= "<td  class='butto2 showdesktop'>";
				str+= "<select onchange='changeboxcontent(this.value,\""+boxid+"\",\""+contentid+"\");removeboxmenu(\""+contentid+"menu\");'>";
						str+= "<option value='DOCUMENT'>Description section</option>";
						str+= "<option value='CODE'>Code example</option>";
					str+= "</select>";
				str+= '</td></tr></table>';
			}else if(type=="CODE"){
				var str = "<table cellspacing='2'><tr>";
				str+= '<td class="butto2" title="Change box title"><span class="boxtitle" contenteditable="true" onblur="changeboxtitle(this,'+boxid+');">'+retdata['box'][boxid-1][3]+'</span></td>';
				str+="<td class='butto2 showdesktop' onclick='displayDrop(\""+contentid+"codedrop\");' title='Select codesource' ><img src='new icons/list_codefiles.svg' /></td>";
				str+="<td class='butto2 showdesktop'>";
				str+= "<select onchange='changeboxcontent(this.value,\""+boxid+"\");removeboxmenu(\""+contentid+"menu\");'>";
						str+= "<option value='CODE'>Code example</option>";
						str+= "<option value='DOCUMENT'>Description section</option>";
					str+= "</select>";
				str+= '</td></tr></table>';
			}else{
				var str = "<table cellspacing='2'><tr>";
				str+="<td class='butto2 showdesktop'>";
				str+= "<select onchange='changeboxcontent(this.value,\""+boxid+"\",\""+contentid+"\");removeboxmenu(\""+contentid+"menu\");'>";
					str+= "<option>Choose content</option>";
						str+= "<option value='CODE'>Code example</option>";
						str+= "<option value='DOCUMENT'>Description section</option>";
					str+= "</select>";
				str+= '</td></tr></table>';
			}					
			boxmenu.innerHTML=str;	
		}else{
			var str = '<table cellspacing="2"><tr>';
			str+= '<td class="butto2" title="Box title"><span class="boxtitle">'+retdata['box'][boxid-1][3]+'</span></td>';
			str+='</tr></table>';
			boxmenu.innerHTML=str;	
		}
			
			
		$(boxmenu).click(function(event){
			if($(window).width() <=1100){
				if(event.target.nodeName == "DIV"){ 
					toggleClass(document.getElementById(boxmenu.parentNode.getAttribute("id")).getAttribute("id"));
				}	
			}
		});
	}
}

function toggleClass(id)
{
	var className = $('#'+id).attr('class');
	$(".boxwrapper").addClass("deactivatedbox").removeClass("activebox");	
	if(className.indexOf("activebox") >-1){
		/* Height of the boxmenu + 1px for border-bottom */
	//	$('#'+id).animate({height: "26px"}, 500);	
		$("#"+id).removeClass("activebox").addClass("deactivatedbox");

	}else{
	//	$('#'+id).animate({height: "100%"}, 500);
		$("#"+id).removeClass("deactivatedbox").addClass("activebox");	
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
function changeboxtitle(title,boxid)
{
	AJAXService("updateboxtitle","&boxid="+boxid+"&boxtitle="+title.innerHTML);	
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
    }else {
	    var codedrop = document.createElement("div");
		codedrop.setAttribute("id", contentid+"codedrop");
		codedrop.setAttribute("class", "dropdown dropdownStyle codedrop codedropStyle");
		document.getElementById(contentid+"wrapper").appendChild(codedrop);
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

function removeTemplatebox(){
	
	for(var i=document.getElementsByClassName("box").length; i>retdata['template'][0][2]; i--){
		document.getElementById("div2").removeChild(document.getElementById("box"+i+"wrapper"));
	}
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
		
		
	//	alert(retdata['box'].length);
		
	//	for(i=retdata['template'][0][2]; i<retdata['box'].length; i--){
		
	//	}
		
		
		
		// create boxes
		for(i=0;i<retdata['template'][0][2];i++){
			
			var contentid="box"+data['box'][i][0];
			var boxid=data['box'][i][0];
			var boxtype=data['box'][i][1].toUpperCase();
			var boxcontent=data['box'][i][2];
		
			
			// don't create templatebox if it already exists
			if(!document.getElementById(contentid)){
				addTemplatebox(contentid);
			}
			
			// Print out code example in a code box
			if(boxtype == "CODE"){
				document.getElementById(contentid).removeAttribute("contenteditable");
					
				createboxmenu(contentid,boxid,boxtype);
				// Make room for the menu by setting padding-top equals to height of menubox
				if($("#"+contentid+"menu").height() == null){
					var boxmenuheight = 0;
				}else{
					var boxmenuheight= $("#"+contentid+"menu").height();
				}
				$("#"+contentid).css("margin-top", boxmenuheight);
			// Create a codedrop for users with write access.	
				if(sessionkind == "w"){
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
				
				if($("#"+contentid+"menu").height() == null){
					var boxmenuheight = 0;
				}else{
					var boxmenuheight= $("#"+contentid+"menu").height();
				}
				$("#"+contentid).css("margin-top", boxmenuheight);
				//  Fill description with code using tokenizer.
				var cs = docuwindow.getElementsByClassName("codestyle");
				for(y=0; y<cs.length; y++){
					desc = desc.replace(cs[y].innerHTML,renderdesccode(replaceAll("&nbsp;", " ",replaceAll("<br>","\n",cs[y].innerHTML))));
				}
				docuwindow.innerHTML = desc;
				
				createboxmenu(contentid,boxid,boxtype);
				
				if($("#"+contentid+"menu").height() == null){
					var boxmenuheight = 0;
				}else{
					var boxmenuheight= $("#"+contentid+"menu").height();
				}
				$("#"+contentid).css("margin-top", boxmenuheight);
				
				var	hotdog = document.getElementById("hidehotdog");
				var	isDesktop = $(hotdog).is(":hidden")
				if(sessionkind == "w" && isDesktop){
					docuwindow.setAttribute("contenteditable","true");
				}
			}
			
			if(boxtype == "NOT DEFINED"){
				if(sessionkind == "w"){
					createboxmenu(contentid,boxid,boxtype);
					
					// Make room for the menu by setting padding-top equals to height of menubox
					if($("#"+contentid+"menu").height() == null){
						var boxmenuheight = 0;
					}else{
						var boxmenuheight= $("#"+contentid+"menu").height();
					}
					$("#"+contentid).css("margin-top", boxmenuheight);
				}
			}		
		}
		/* Remove unnecessary template boxes*/
		removeTemplatebox();
		createhotdogmenu();
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
		examplesect.innerHTML=data['entryname']+"&nbsp;:&nbsp;";
		
		
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