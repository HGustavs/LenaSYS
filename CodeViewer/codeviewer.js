/********************************************************************************

   Documentation

*********************************************************************************

Execution Order
---------------------
 #1 setup() is first function to be called this then invokes returned() callback through AJAX
 #2 returned() is next function to be called as a callback from setup.

Testing Link:

EditorV50.php?exampleid=1&courseid=1&cvers=2013
 
-------------==============######## Documentation End ###########==============-------------
*/

/********************************************************************************

   Globals

*********************************************************************************/

var retdata;
var tokens = [];            // Array to hold the tokens.
var dmd=0;
var isdropped=false;
var genSettingsTabMenuValue = "wordlist";
var codeSettingsTabMenuValue = "implines";				
var querystring = parseGet();
var filez;

/********************************************************************************

   SETUP

*********************************************************************************/

function setup()
{
	try{
		var courseid = querystring['courseid'];
		var exampleid = querystring['exampleid'];
		var cvers = querystring['cvers'];
		
		AJAXService("EDITEXAMPLE", {
			courseid : courseid,	
			exampleid : exampleid,
			cvers : cvers
		}, "CODEVIEW");
	}catch(e){
		alert("Error while setting up: "+e.message)
	}
}

//---------------------------------------------------------------------------------------------------
// Renderer
//---------------------------------------------------------------------------------------------------

function returned(data)
{	
		retdata=data;
		
		console.log(retdata);

		// Hide and show before/after button

		if(retdata['before'].value!=null&&retdata['after'].value!=null){

			if(retdata['before'].length==0){
					$("#beforebutton").css("visibility","hidden");
			}else{
					$("#beforebutton").css("visibility","none");		
			}
			if(retdata['after'].length==0){
					$("#afterbutton").css("visibility","hidden");
			}else{
					$("#afterbutton").css("visibility","none");	
			}
		}
		// Fill Section Name and Example Name
		var examplenme=document.getElementById('exampleName');
		examplenme.innerHTML=data['examplename'];
		var examplesect=document.getElementById("exampleSection");
		examplesect.innerHTML=data['sectionname']+"&nbsp;:&nbsp;";

		if(retdata['debug']!="NONE!") alert(retdata['debug']);

		if(retdata['writeaccess'] == "w"){
				// If write access show settings cog wheel.
		}
		
		// User can choose template if no template has been choosen and the user has write access.
		if((retdata['templateid'] == 0)){
			if(retdata['writeaccess'] == "w"){
				$("#chooseTemplate").css("display","block");
				return;
			}else{
				/* Create an error message to user or send user back to duggasys */
				return;
			}
		}
		
		// If there is a template
		changeCSS("../Shared/css/"+retdata['stylesheet']);

		// Clear div2
		$("#div2").html("");

		// create boxes
	
		for(var i=0;i<retdata['numbox'];i++){
			
			var contentid="box"+retdata['box'][i][0];
			var boxid=retdata['box'][i][0];
			var boxtype=retdata['box'][i][1].toUpperCase();
			var boxcontent=retdata['box'][i][2];
			var boxwordlist=retdata['box'][i][3];
		
			// don't create templatebox if it already exists
			if(!document.getElementById(contentid)){
				addTemplatebox(contentid);
			}
			
			if(boxtype == "CODE"){
					// Print out code example in a code box					
					document.getElementById(contentid).removeAttribute("contenteditable");
	
					$("#"+contentid).removeClass("descbox").addClass("codebox");
	
					createboxmenu(contentid,boxid,boxtype);

					// Make room for the menu by setting padding-top equal to height of menubox
					// For some reason without this fix the code box is placed at same height as the menu, obstructing first lines of the code
					if($("#"+contentid+"menu").height() == null){
						var boxmenuheight = 0;
					}else{
						var boxmenuheight= $("#"+contentid+"menu").height();
					}
					$("#"+contentid).css("margin-top", boxmenuheight-1);

					rendercode(boxcontent,boxid,boxwordlist);
			}else if(boxtype == "DOCUMENT"){
				
					// Print out description in a document box
					$("#"+contentid).removeClass("codebox").addClass("descbox");
					var desc = boxcontent;
					desc = replaceAll("&nbsp;"," ",desc);
					
					// Highlight important words!
					var iwcounter=0;
					important = retdata.impwords;
					for(j=0;j<important.length;j++){
							var sstr="<span id='IWW' class='impword' onmouseover='highlightKeyword(\""+important[j]+"\")' onmouseout='dehighlightKeyword(\""+important[j]+"\")'>"+important[j]+"</span>";														
							desc=replaceAll(important[j],sstr,desc);
					}
					
					/* Assign Content */
					//Parse markdown
					desc = parseMarkdown(desc);
					$("#"+contentid).html(desc);

					if($("#"+contentid+"menu").height() == null){
						var boxmenuheight = 0;
					}else{
						var boxmenuheight= $("#"+contentid+"menu").height();
					}
					$("#"+contentid).css("margin-top", boxmenuheight);
					
					createboxmenu(contentid,boxid,boxtype);
					
					if($("#"+contentid+"menu").height() == null){
						var boxmenuheight = 0;
					}else{
						var boxmenuheight= $("#"+contentid+"menu").height();
					}
					$("#"+contentid).css("margin-top", boxmenuheight);
					
			}else if(boxtype == "NOT DEFINED"){
					if(retdata['writeaccess'] == "w"){
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
		
		//CALL resizeBoxes here!
		resizeBoxes("#div2", retdata["templateid"]);

}

//----------------------------------------------------------------------------------
// displayEditExample: Displays the dialog box for editing a code example
//----------------------------------------------------------------------------------

function displayEditExample(boxid)
{
	$("#title").val(retdata['examplename']);
	$("#secttitle").val(retdata['sectionname']);
	$("#playlink").val(retdata['playlink']);
	
	var iw=retdata['impwords'];
	var str="";
	for(var i=0;i<iw.length;i++){
			str+="<option>"+iw[i]+"</option>";
	}
	$("#impwords").html(str);

	// Get the filename for current codebox
	var bestr="";
	var afstr="";
	
	// Set beforeid and afterid if set
	var beforeid="UNK";
	if(retdata['before']!==null){
			if(retdata['before'].length!==0){
					beforeid=retdata['before'][0][0];			
			}
	}
	var afterid="UNK";
	if(retdata['after']!==null){
			if(retdata['after'].length!==0){
					afterid=retdata['after'][0][0];
			}
	}
	
	var ba=retdata['beforeafter'];
	for(var i=0; i<ba.length; i++){
		if(ba[i][0] == beforeid){
				bestr+="<option selected='selected' value='"+ba[i][0]+"'>"+ba[i][1]+":"+ba[i][2]+"</option>";
		}else{
				bestr+="<option value='"+ba[i][0]+"'>"+ba[i][1]+":"+ba[i][2]+"</option>";
		}
		if(ba[i][0] == afterid){
				afstr+="<option selected='selected' value='"+ba[i][0]+"'>"+ba[i][1]+":"+ba[i][2]+"</option>";				
		}else{
				afstr+="<option value='"+ba[i][0]+"'>"+ba[i][1]+":"+ba[i][2]+"</option>";		
		}
	}
	$("#before").html(bestr);
	$("#after").html(afstr);

	$("#editExample").css("display","block");
}

//----------------------------------------------------------------------------------
// updateExample: Updates example data in the database if changed
//----------------------------------------------------------------------------------

function updateExample()
{
	// Set beforeid if set
	var beforeid="UNK";
	if(retdata['before'].length!=0){
			beforeid=retdata['before'][0][0];
	}

	var afterid="UNK";
	if(retdata['after'].length!=0){
			afterid=retdata['after'][0][0];
	}

	if(($("#before").val()!=beforeid&&beforeid!="UNK")||($("#after").val()!=afterid&&afterid!="UNK")||($("#playlink").val()!=retdata['playlink'])||($("#title").val()!=retdata['examplename'])||($("#secttitle").val()!=retdata['sectionname'])){
			var courseid = querystring['courseid'];
			var cvers = querystring['cvers'];
			var exampleid = querystring['exampleid'];
			var playlink = $("#playlink").val();
			var examplename = $("#title").val();
			var sectionname = $("#secttitle").val();
			
			AJAXService("EDITEXAMPLE", {
					courseid : courseid,
					cvers : cvers,
					exampleid : exampleid,
					beforeid : beforeid,
					afterid : afterid,
					playlink : playlink,
					examplename : examplename,
					sectionname : sectionname
			}, "CODEVIEW");
	}

}

//----------------------------------------------------------------------------------
// displayEditContent: Displays the dialog box for editing a content pane
//----------------------------------------------------------------------------------

function displayEditContent(boxid)
{
	
	$("#title").val(retdata['examplename']);

	var dirs=retdata['directory'];
	var str="";
	for(var i=0;i<dirs.length;i++){
			str+="<option>"+dirs[i]+"</option>";
	}
	$("#filename").html(str);
	

	var wordl=retdata['wordlists'];
	var str="";
	for(var i=0;i<wordl.length;i++){
			str+="<option value='"+wordl[i][0]+"'>"+wordl[i][1]+"</option>";
	}
	$("#wordlist").html(str);
		
	$("#editContent").css("display","block");
}

//----------------------------------------------------------------------------------
// addTemplatebox: Adds a new template box to div2
//----------------------------------------------------------------------------------

function addTemplatebox(id)
{
	str="<div id='"+id+"wrapper' ";
	if(id==("box"+retdata['numbox'])){
		str+="class='boxwrapper activebox'>";
	}else{
		str+="class='boxwrapper deactivatedbox'>";
	}
	str+="<div id='"+id+"' class='box'></div>";
	str+="</div>";
	
	str=str+$("#div2").html();
	$("#div2").html(str);

}

//----------------------------------------------------------------------------------
// createboxmenu: Creates the menu at the top of a box. 
//                Is called by returned
//----------------------------------------------------------------------------------

function createboxmenu(contentid, boxid, type){

	if(!document.getElementById(contentid+"menu")){
		var boxmenu = document.createElement("div");
		document.getElementById(contentid+"wrapper").appendChild(boxmenu);
		boxmenu.setAttribute("class", "buttomenu2 buttomenu2Style");
		boxmenu.setAttribute("id", contentid+"menu");
		if(retdata['writeaccess'] == "w"){

			//----------------------------------------------------------------------------------------- DOCUMENT
			if(type=="DOCUMENT"){
				var str = '<table cellspacing="2"><tr>';
				str+='<td class="butto2" title="Change box title"><span class="boxtitleEditable">'+retdata['box'][boxid-1][4]+'</span></td>';
				str+="<td class='butto2 showdesktop codedropbutton' id='settings' title='Edit box settings' onclick='displayEditContent("+boxid+");' ><img src='../Shared/icons/general_settings_button.svg' /></td>";	
				str+="</tr></table>";
				//----------------------------------------------------------------------------------------- END DOCUMENT
			}else if(type=="CODE"){
				
				//----------------------------------------------------------------------------------------- CODE
				
				var str = "<table cellspacing='2'><tr>";
				str+= '<td class="butto2" title="Change box title"><span class="boxtitleEditable" contenteditable="true" onblur="changeboxtitle(this,'+boxid+');">'+retdata['box'][boxid-1][4]+'</span></td>';

				str+="<td class='butto2 showdesktop codedropbutton' id='settings' title='Edit box settings' onclick='displayEditContent("+boxid+");' ><img src='../Shared/icons/general_settings_button.svg' /></td>";				
				
				str+= '</tr></table>';
			
			}else{
				var str = "<table cellspacing='2'><tr>";
				str+="<td class='butto2 showdesktop'>";
				str+= "<select class='chooseContentSelect' onchange='changeboxcontent(this.value,\""+boxid+"\",\""+contentid+"\");removeboxmenu(\""+contentid+"menu\");'>";
					str+= "<option>Choose content</option>";
						str+= "<option value='CODE'>Code example</option>";
						str+= "<option value='DOCUMENT'>Description section</option>";
					str+= "</select>";
				str+= '</td></tr></table>';
			}					
			boxmenu.innerHTML=str;	
			
			//----------------------------------------------------------------------------------------- END CODE
		
		}else{
			var str = '<table cellspacing="2"><tr>';
			str+= '<td ><span class="boxtitle">'+retdata['box'][boxid-1][3]+'</span></td>';
			str+='</tr></table>';
			boxmenu.innerHTML=str;	
		}
			
			
		$(boxmenu).click(function(event){
			if($(window).width() <=1100){
				toggleClass(document.getElementById(boxmenu.parentNode.getAttribute("id")).getAttribute("id"));
			}
		});
	}
		
}

//----------------------------------------------------------------------------------
// removeTemplatebox: Removes any template box -- Is called by renderer
//----------------------------------------------------------------------------------

function removeTemplatebox(){
	
	for(var i=document.getElementsByClassName("box").length; i>retdata['numbox']; i--){
		document.getElementById("div2").removeChild(document.getElementById("box"+i+"wrapper"));
	}
}

//----------------------------------------------------------------------------------
// createhotdogmenu: Creates the menu at the top of a box -- Is called by renderer
//----------------------------------------------------------------------------------

function createhotdogmenu(){

	// div2 refers to the main content div below the floating menu
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
		str += '<td class="mbutto mbuttoStyle " title="Back to list" onclick="Up();"><img src="../Shared/icons/home_button.svg" /></td>';
		str += '<td class="mbutto mbuttoStyle beforebutton " id="beforebutton" title="Previous example" onmousedown="Skip(\"bd\");" onmouseup="Skip(\"bu\");" onclick="Skip(\"bd\")"><img src="../Shared/icons/backward_button.svg" /></td>';
		str += '<td class="mbutto mbuttoStyle afterbutton " id="afterbutton" title="Next example" onmousedown="Skip(\"fd\");" onmouseup="Skip(\"fu\");" onclick="Skip(\"fd\")"><img src="../Shared/icons/forward_button.svg" /></td>';
		str += '<td class="mbutto mbuttoStyle playbutton " id="playbutton" title="Open demo" onclick="Play();"><img src="../Shared/icons/play_button.svg" /></td>';
		str += '</tr>';
		for(i=0;i<retdata['numbox'];i++){
		//	str += "<tr><td class='mbutto mbuttoStyle' title='Show \""+retdata['box'][i][3]+"\"' onclick='toggleClass(\"box"+(i+1)+"wrapper\");' colspan='4'>"+retdata['box'][i][3]+"<img src='../Shared/icons/hotdogTabButton2.svg' /></td></tr>";
			str += "<tr><td class='mbutto mbuttoStyle' title='Show \""+retdata['box'][i][3]+"\"' onclick='toggleTabs(\"box"+(i+1)+"wrapper\",this);' colspan='4'>"+retdata['box'][i][3]+"<img src='../Shared/icons/hotdogTabButton.svg' /></td></tr>";
		}		
 //		str += '<tr><td class="mbutto mbuttoStyle " title="Show JS" onclick="" colspan="4">JS<img src="../Shared/icons/hotdogTabButton2.svg" /></td></tr>';
 //		str += '<tr><td id="numberbuttonMobile" class="mbutto mbuttoStyle " title="Show rownumbers" onclick="fadelinenumbers();" colspan="4">Show rownumbers<img src="../Shared/icons/hotdogTabButton.svg" /></td></tr>';

		// str += '<tr><td class="mbutto mbuttoStyle " title="Settings" onclick="" colspan="4">Settings</td></tr>';
		str += '<tr><td class="mbutto mbuttoStyle " title="Change to desktop site" onclick="disableResponsive(&quot;yes&quot;); setEditing();" colspan="4">Desktop site</td></tr>';

		str += '</table>';
		
		hotdogmenu.style.display="block";	
		hotdogmenu.innerHTML = str;
	
}

//----------------------------------------------------------------------------------
// toggleClass: Modifies class using Jquery to contain "activebox" class selector -- called by code generated by createhotdog
//----------------------------------------------------------------------------------

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

//----------------------------------------------------------------------------------
// displayDrop: Modifies class using Jquery to contain "activebox" class selector -- called by code generated by createhotdog
//----------------------------------------------------------------------------------

function displayDrop(dropid)
{	
	drop = document.getElementById(dropid);
	if($(drop).is(":hidden")){
		$(".dropdown").css({display: "none"});
		drop.style.display="block";
	}else{
		drop.style.display="none";
	}	
}

//----------------------------------------------------------------------------------
// highlightop: Highlights an operator and corresponding operator in code window
//----------------------------------------------------------------------------------

function highlightop(otherop,thisop)
{
		$("#"+otherop).addClass("hi");					
		$("#"+thisop).addClass("hi");					
}

//----------------------------------------------------------------------------------
// highlightop: Dehighlights an operator and corresponding operator in code window
//----------------------------------------------------------------------------------

function dehighlightop(otherop,thisop)
{
		$("#"+otherop).removeClass("hi");					
		$("#"+thisop).removeClass("hi");					
}

//----------------------------------------------------------------------------------
// Skip: Handles skipping either forward or backward. If pressed show menu
//----------------------------------------------------------------------------------


var dmd;
function Skip(skipkind)
{
		if(skipkind=="bd"){
				dmd=1;
		}else if(skipkind=="bu"){
				if(retdata['before'].length!=0&&dmd==1){
						navigateExample(retdata['before'][0][0]);
				}
				dmd=0;		
		}
		if(skipkind=="fd"){
				dmd=2;
		}else if(skipkind=="fu"){
				if(retdata['after'].length!=0&&dmd==2){
						navigateExample(retdata['after'][0][0]);
				}
				dmd=0;		
		}

		if(skipkind=="bd"||skipkind=="fd"){
				$("#forwdrop").css("display","none");
				$("#backwdrop").css("display","none");
		}
		
		setTimeout(function(){execSkip()}, 1000);							

}

function execSkip()
{
		str="";
		if(dmd==1){
				for(i=0;i<retdata['before'].length;i++){
						str+="<span id='F"+retdata['before'][i][1]+"' onclick='navigateExample(\""+retdata['before'][i][0]+"\")' class='dropdownitem dropdownitemStyle'>"+retdata['before'][i][1]+":"+retdata['before'][i][2]+"</span>";
				}
				$("#backwdropc").html(str);
				$("#backwdrop").css("display","block");
				dmd=0;
		}else if(dmd==2){
				for(i=0;i<retdata['after'].length;i++){
						str+="<span id='F"+retdata['after'][i][1]+"' onclick='navigateExample(\""+retdata['after'][i][0]+"\")' class='dropdownitem dropdownitemStyle'>"+retdata['after'][i][1]+":"+retdata['after'][i][2]+"</span>";
				}
				$("#forwdropc").html(str);
				$("#forwdrop").css("display","block");
				dmd=0;
		}
}

// -------------==============######## Verified Functions End ###########==============-------------

//Retrive height for buliding menu.
$(window).load(function() {
	var windowHeight = $(window).height();
	textHeight= windowHeight-50;
	$("#table-scroll").css("height", textHeight);
});

$(window).resize(function() {
	var windowHeight = $(window).height();
	textHeight= windowHeight-50;
	$("#table-scroll").css("height", textHeight);
	
	
	// Keep right margin to boxes when user switch from mobile version to desktop version
	if($(".buttomenu2").height() == null){
		var boxmenuheight = 0;
	}else{
		var boxmenuheight= $(".buttomenu2").height();
	}
	$(".box").css("margin-top", boxmenuheight);

});

document.addEventListener("drop", function(e) {
    // cancel drop
    e.preventDefault();
});

document.addEventListener("paste", function(e) {
    // cancel paste
    e.preventDefault();
    // get text representation of clipboard
    var text = e.clipboardData.getData("text/plain");
    // insert text manually
    document.execCommand("insertText", false, text);
});

/********************************************************************************

   UI Hookups

*********************************************************************************/

//----------------------------------------------------------------------------------
// changeboxcontent: Called when the contents of the boxes at the top of a content div is changed
//----------------------------------------------------------------------------------

function changeboxcontent(boxcontent,boxid)
{
	alert(boxcontent+" "+boxid);
	AJAXService("changeboxcontent","&boxid="+boxid+"&boxcontent="+boxcontent);	
}

// -------------==============######## Verified Functions End ###########==============-------------
	

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
			$( dropd ).slideUp("fast");
			//	dropd.style.display="none";							
		}else{
				hideDrop("forwdrop");
				hideDrop("backwdrop");
				$('#hotdogdrop').hide();
			
			$( dropd ).slideDown("fast");
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
		if(retdata['writeaccess']=="w"){
				var editable=document.getElementById('exampleName');
				editable.addEventListener("blur", function(){editedExamplename();}, true);
		/*
				var fditable=document.getElementById('docucontent');
				fditable.addEventListener("blur", function(){editedDescription();}, true);
		*/
		}
}

function editedExamplename()
{
		var editable=document.getElementById('exampleName');
		var examplename=dehtmlify(editable.innerHTML,true,60);
		editable.innerHTML=examplename;
		AJAXService("editExampleName","&examplename="+examplename);
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

//----------------------------------------------------------
// Highlights an important word from the important word list
//----------------------------------------------------------		

function highlightKeyword(kw)
{
			$(".impword").each(function(){
				if(this.innerHTML==kw){
					$(this).addClass("imphi");	

				}
			});	
}

//----------------------------------------------------------
// DeHighlights an important word from the important word list
//----------------------------------------------------------		

function dehighlightKeyword(kw)
{
			$(".impword").each(function(){
				if(this.innerHTML==kw){
					$(this).removeClass("imphi");	
				}
			});	
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

//----------------------------------------------------------------------------------
// replaceAll: Used by tokenizer to replace all instances of find string with replace string in str.
//             The idea behind this is to  cancel the html entities introduced to allow streaming of content
//----------------------------------------------------------------------------------

function replaceAll(find, replace, str)
{
    return str.replace(new RegExp(find, 'g'), replace);
}

//----------------------------------------------------------
// Tokenize: Tokenizer partly based on ideas from the very clever tokenizer written by Douglas Cockford
//           The tokenizer is passed a string, and a string of prefix and suffix terminators
//----------------------------------------------------------						

function tokenize(instring,inprefix,insuffix)
{
	// replace HTML-entities
	instring = replaceAll("&lt;","<",instring);
	instring = replaceAll("&gt;",">",instring);
	instring = replaceAll("&amp;","&",instring);

	var from;                   	// index of the start of the token.
	var i = 0;                  	// index of the current character.
	var length=instring.length;	// length of the string

	var currentCharacter;           // current character.
	var currentNum;                 // current numerical value
	var currentQuoteChar;           // current quote character
	var currentStr;                 // current string value.
	var row=1;			// current row value

	currentCharacter = instring.charAt(i);
	while (currentCharacter) {		// currentCharacter == first character in each word
		from = i;
		if (currentCharacter <= ' '){		// White space and carriage return
			if((currentCharacter=='\n')||(currentCharacter=='\r')||(currentCharacter =='')){
				maketoken('newline',"",i,i,row);
				currentStr="";
				row++;
			}else{
				currentStr=currentCharacter;
			}
				
			i++;
			while(true){
				currentCharacter=instring.charAt(i);
				if(currentCharacter>' '||!currentCharacter) break;
				if((currentCharacter=='\n')||(currentCharacter=='\r')||(currentCharacter =='')){
					//currentStr += currentCharacter;
					maketoken('whitespace',currentStr,from,i,row);				                
					maketoken('newline',"",i,i,row);
					currentStr="";
					// White space Row (so we get one white space token for each new row) also increase row number
					row++;
				}else{
					currentStr += currentCharacter;
				}
				i++;
			}
			if(currentStr!="") maketoken('whitespace',currentStr,from,i,row);
		}else if((currentCharacter >='a'&&currentCharacter<='z')||(currentCharacter>='A'&&currentCharacter<='Z')){					// Names i.e. Text
			currentStr = currentCharacter;      				
			i++;
			while(true){
				currentCharacter = instring.charAt(i);
				if ((currentCharacter >='a'&&currentCharacter<='z')||(currentCharacter>='A'&&currentCharacter<='Z')||(currentCharacter>='0'&&currentCharacter<='9')||currentCharacter=='_'){
					currentStr += currentCharacter;
					i++;
				}else{
					break;
				}
			} 
			maketoken('name',currentStr,from,i,row);
		}else if(currentCharacter >= '0' && currentCharacter <= '9'){			// Number token
			currentStr = currentCharacter;
			i++;
			while(true){
				currentCharacter = instring.charAt(i);
				if (currentCharacter < '0' || currentCharacter > '9') break;
				i++;
				currentStr+=currentCharacter;
			}
			if(currentCharacter=='.'){
				i++;
				currentStr+=currentCharacter;
				for(;;){
					currentCharacter=instring.charAt(i);
					if (currentCharacter < '0' || currentCharacter > '9') break;
					i++;
					currentStr+=currentCharacter;
				}
			}
			if (currentCharacter=='e'||currentCharacter=='E') {
				i++;
				currentStr+=currentCharacter;
				currentCharacter=instring.charAt(i);
				if(currentCharacter=='-'||currentCharacter=='+'){
					i+=1;
					currentStr+=currentCharacter;
					currentCharacter=instring.charAt(i);
				}
				if (currentCharacter < '0' || currentCharacter > '9') error('Bad Exponent in Number: ',currentStr,row);
				do {
					i++;
					currentStr+=currentCharacter;
					currentCharacter=instring.charAt(i);
				}while(currentCharacter>='0'&&currentCharacter<='9');
			}
			if (currentCharacter>='a'&&currentCharacter<='z'){
				currentStr += currentCharacter;
				i += 1;
				error('Bad Number: ',currentStr,row);
			}
			currentNum=+currentStr;
			if(isFinite(currentNum)){
				maketoken('number',currentNum,from,i,row);		            		
			}else{
				error('Bad Number: ',currentStr,row);
			}
		}else if(currentCharacter=='\''||currentCharacter=='"'){	   // String .. handles c style breaking codes. Ex: "elem" or "text"
			currentStr='';
			currentQuoteChar=currentCharacter;
			i++;
			while(true){
				currentCharacter=instring.charAt(i);
				if (currentCharacter<' '){
					if((currentCharacter=='\n')||(currentCharacter=='\r')||(currentCharacter == '')) row++; 	// Add row if this white space is a row terminator				 																						
					error('Unterminated String: ',currentStr,row);		
					break;                		
				}
	
				if (currentCharacter==currentQuoteChar) break;
	
				if (currentCharacter=='\\'){
					i += 1;
					if (i >= length) {
						error('Unterminated String: ',currentStr,row);		
						break;                		
					}
					currentCharacter=instring.charAt(i);
					
					if(currentCharacter=='b'){ currentCharacter='\b'; break; }
					if(currentCharacter=='f'){ currentCharacter='\f'; break; }
					if(currentCharacter=='n'){ currentCharacter='\n'; break; }
					if(currentCharacter=='r'){ currentCharacter='\r'; break; }
					if(currentCharacter=='t'){ currentCharacter='\t'; break; }
					if(currentCharacter=='u'){
						if (i >= length) {
							error('Unterminated String: ',currentStr,row);		
							break;                		
						}
						currentCharacter = parseInt(this.substr(i + 1, 4), 16);
						if (!isFinite(currentCharacter) || currentCharacter < 0) {
							error('Unterminated String: ',currentStr,row);		
							break;                		
						}
						currentCharacter = String.fromCharCode(currentCharacter);
						i+=4;
						break;		                    
					}
				}
				currentStr += currentCharacter;
				i++;
			}
			i++;
			maketoken('string',currentCharacter+currentStr+currentCharacter,from,i,row);
			currentCharacter=instring.charAt(i);
	
		}else if (currentCharacter=='/'&&instring.charAt(i+1)=='/'){	// Comment of // type ... does not cover block comments
			i++;
			currentStr=currentCharacter; 
			while(true){
				currentCharacter=instring.charAt(i);
				if (currentCharacter=='\n'||currentCharacter=='\r'||currentCharacter=='') {
					row++;
					break;
				}else{
					currentStr+=currentCharacter;                
				}
				i++;
			}	
			maketoken('rowcomment',currentStr,from,i,row);
			/* This does not have to be hear because a newline creates in coderender function 
			maketoken('newline',"",i,i,row); */													                
		}else if (currentCharacter=='/'&&instring.charAt(i+1)=='*'){		// Block comment of /* type
			i++;
			currentStr=currentCharacter; 
			while(true){
				currentCharacter=instring.charAt(i); 
				if ((currentCharacter=='*'&&instring.charAt(i+1)=='/')||(i==length)) {
					currentStr+="*/"
					i+=2;
					currentCharacter=instring.charAt(i); 
					break;
				}	
				if (currentCharacter=='\n'||currentCharacter=='\r'||currentCharacter=='') { 
					// don't make blockcomment or newline if currentStr is empty
					if(currentStr != ""){
						maketoken('blockcomment',currentStr,from,i,row);
						maketoken('newline',"",i,i,row);
						row++;
						currentStr="";
					}
				}else{ 
					currentStr+=currentCharacter;                
				}
				i++;
			}	
			maketoken('blockcomment',currentStr,from,i,row);
		}else if(inprefix.indexOf(currentCharacter) >= 0) {		// Multi-character Operators
			currentStr = currentCharacter;
			i++;
			while(true){
				currentCharacter=instring.charAt(i); 
				if (i >= length || insuffix.indexOf(currentCharacter) < 0) {
					break;
				}
				currentStr += currentCharacter; 
				i++;
			} 
			maketoken('operator',currentStr,from,i,row);
		} else {												// Single-character Operators
			i++;  
			maketoken('operator',currentCharacter,from,i,row);
			currentCharacter = instring.charAt(i);
		}
	}
}

//----------------------------------------------------------------------------------
// Renders a set of tokens from a string into a code viewer div
// Requires tokens created by a cockford-type tokenizer
//----------------------------------------------------------------------------------

function rendercode(codestring,boxid,wordlistid)
{
    var destinationdiv = "box" + boxid;
	tokens = [];
	
	important = [];
	for(var i=0;i<retdata.impwords.length;i++){
		important[retdata.impwords[i]]=retdata.impwords[i];	
	}

	keywords= [];
	for(var i=0;i<retdata['words'].length;i++){
		if(retdata['words'][i][0]==wordlistid){
			keywords[retdata['words'][i][1]]=retdata['words'][i][2];
		}
	}

	improws=[];
	for(var i=0;i<retdata.improws.length;i++){
        if ((retdata['improws'][i][0]) == boxid){
       		improws.push(retdata.improws[i]);
		}
	}
	tokenize(codestring,"<>+-&","=>&:");
			
	// Iterate over token objects and print kind of each token and token type in window 
	printout=document.getElementById(destinationdiv);
	str="";
	cont="";

	lineno=0;
	
	str+="<div class='normtextwrapper'>";
	
	
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
			cont+="<span class='string'>"+tokenvalue+"</span>";
		}else if(tokens[i].kind=="number"){
			cont+="<span class='number'>"+tokenvalue+"</span>";
		}else if(tokens[i].kind=="name"){
			var foundkey=0;
					
			// Removed two for loops here and replaced it with smart indexing. either kind 2 or kind 1
			if(important[tokenvalue]!=null){
					foundkey=2;
			}else if(keywords[tokenvalue]!=null){	
						foundkey=1;						
			}
			
			if(foundkey==1){
				cont+="<span class='keyword"+keywords[tokenvalue]+"'>"+tokenvalue+"</span>";														
			}else if(foundkey==2){
				iwcounter++;
				cont+="<span id='IW"+iwcounter+"' class='impword' onmouseover='highlightKeyword(\""+tokenvalue+"\")' onmouseout='dehighlightKeyword(\""+tokenvalue+"\")'>"+tokenvalue+"</span>";														
			}else{
				cont+=tokenvalue;
			}
					
		}else if(tokens[i].kind=="operator"){
			if(tokenvalue=="("){
				pid="PA"+pcount+boxid; 
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
				pid="CBR"+cbcount+boxid;
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
				// tokens.length-1 so the last line will be printed out
		if(tokens[i].kind=="newline" || i==tokens.length-1){  
			// Prevent empty lines to be printed out
			if(cont != ""){
				
				// count how many linenumbers that'll be needed
				lineno++;

			// Print out normal rows if no important exists
				if(improws.length==0){
					str+="<div class='normtext'>"+cont+"</div>";
				}else{	
					// Print out important lines
					for(var kp=0;kp<improws.length;kp++){
						if(lineno>=parseInt(improws[kp][1])&&lineno<=parseInt(improws[kp][2])){
							str+="<div class='impo'>"+cont+"</div>";
							break;
						}else{
							if(kp == (improws.length-1)){
								str+="<div class='normtext'>"+cont+"</div>";
							}
						}						
					}
				}	
				cont="";
			}	
		}
	}
	str+="</div>";
		
		// Print out rendered code and border with numbers
	printout.innerHTML = createCodeborder(lineno,improws) + str;
		
	linenumbers();
}

// function to create a border with line numbers
function createCodeborder(lineno,improws){
	var str="<div class='codeborder'>";
	var x= 0;
	
	for(var i=1; i<=lineno; i++){
		// Print out normal numbers
		if(improws.length ==0){
			str+="<div class='no'>"+(i)+"</div>";	
		}else{
			// Print out numbers for an important row
			for(var kp=0;kp<improws.length;kp++){
				if(i>=parseInt(improws[kp][1])&&i<=parseInt(improws[kp][2])){
					str+="<div class='impono'>"+(i)+"</div>";	
					break;	
					
				}else{
					if(kp==(improws.length-1)){
						str+="<div class='no'>"+(i)+"</div>";					
					}
				}			
			}
		}
	}
	
	str+="</div>";
	return str;
}

function linenumbers()
{	
	if(localStorage.getItem("linenumbers") == "false"){	
		$( "#numberbutton img" ).attr('src', '../Shared/icons/noNumbers_button.svg'); 
		$( "#numberbuttonMobile img" ).attr('src', '../Shared/icons/hotdogTabButton2.svg');
		$( ".codeborder" ).css("display","none");	
	}
}

function fadelinenumbers()
{
	if ( $( ".codeborder" ).is( ":hidden" ) ) {
		$( ".codeborder" ).fadeIn( "slow" );
		$( "#numberbuttonMobile img" ).attr('src', '../Shared/icons/hotdogTabButton.svg');
		$( "#numberbutton img" ).attr('src', '../Shared/icons/numbers_button.svg');
		localStorage.setItem("linenumbers", "true");					  
	}else{
		$( ".codeborder" ).fadeOut("slow");
		$( "#numberbuttonMobile img" ).attr('src', '../Shared/icons/hotdogTabButton2.svg');
		$( "#numberbutton img" ).attr('src', '../Shared/icons/noNumbers_button.svg');
		localStorage.setItem("linenumbers", "false");
	 }
}


function changedSecurity(){
	var cb = document.getElementById('checkbox');
	var option = 0;
	if(cb.checked){
		option = 1;
	}
	
	AJAXService("updateSecurity","&public="+ option);
}

function mobileTheme(id){
	if ($(".mobilethemebutton").is(":hidden")){
		  $(".mobilethemebutton").css("display","table-cell");
	}
	else{
		  $(".mobilethemebutton").css("display","none");
	}
}

//Set the editing properties for mobile and desktop version
function setEditing(){
	var	hotdog = document.getElementById("hidehotdog");
	var	isDesktop = $(hotdog).is(":hidden");
	if(isDesktop){
		 $("*[contenteditable]").attr("contenteditable","true"); 
		 $(".tooltip").css("display", "block");
	}else{ 
		$("*[contenteditable]").attr("contenteditable","false"); 
		$(".tooltip").css("display", "none");
	}
}

//----------------------------------------------------------------------------------
// changeTemplate: Change template by updating hidden field
//----------------------------------------------------------------------------------

function changetemplate(templateno)
{
	$(".tmpl").each(function( index ) {
			$(this).css("background","#ccc");
	});

	$("#templat"+templateno).css("background","#fc4");
	$("#templateno").val(templateno);
}

//----------------------------------------------------------------------------------
// updateTemplate: Write template hidden field to database
//----------------------------------------------------------------------------------

function updateTemplate()
{
	templateno=$("#templateno").val();
	$("#chooseTemplate").css("display","none");
	
	try{
		var courseid = querystring['courseid'];
		var exampleid = querystring['exampleid'];
		var cvers = querystring['cvers'];
		var templateno = $("#templateno").val();
		
		AJAXService("EDITEXAMPLE", {
			courseid : courseid,	
			exampleid : exampleid,
			cvers : cvers,
			templateno : templateno
		}, "CODEVIEW");
	}catch(e){
		alert("Error when updating template: "+e.message)
	}
	setTimeout("location.reload()", 500);
}

function closeEditContent()
{
		$("#editContent").css("display","none");
}

function closeEditExample()
{
		$("#editExample").css("display","none");
	
}

function openTemplateWindow()
{
	$("#chooseTemplate").css("display","block");
}

function closeTemplateWindow()
{
	$("#chooseTemplate").css("display","none");
}

function updateContent()
{

}

function Play()
{
		if(retdata['playlink']!=null){
				navigateTo("/codeupload/",retdata['playlink']);
		}
}

//-----------------------------------------------------------------------------
// resizeBoxes: Adding resize functionality for the boxes in template(1).
//-----------------------------------------------------------------------------


function resizeBoxes(parent, templateId) {
	
		
		var boxValArray = initResizableBoxValues(parent);
		
		var remainWidth;
		
		
		
		if(templateId == 1){
			
			getLocalStorageProperties(templateId);
		
			alignBoxesWidth(boxValArray, 1, 2);
		
			$(boxValArray['box1']['id']).resizable({
				containment: parent,
				handles: "e",
				resize: function(e, ui){
					
					alignBoxesWidth(boxValArray, 1, 2);
					
				},
				stop: function(e, ui) {
					 
					setLocalStorageProperties(templateId, boxValArray);
				
				}
			});
		
		}else if(templateId == 3){
		
			getLocalStorageProperties(templateId);
			
			//Used to remove gap provided by percentage based positioning.
			alignBoxesWidth(boxValArray, 1, 2);
			alignBoxesHeight3boxes(boxValArray, 1, 2, 3);
		
			$(boxValArray['box1']['id']).resizable({
			containment: parent,
			handles: "e,s",
			resize: function(e, ui){
				

				alignBoxesWidth(boxValArray, 1, 2);
				alignBoxesHeight3boxes(boxValArray, 1, 2, 3);
				
			},
			stop: function(e, ui) {
				 
				setLocalStorageProperties(templateId, boxValArray);
				 
			}
			
			});
			
			$(boxValArray['box2']['id']).resizable({
			containment: parent,
			handles: "s",
			resize: function(e, ui){
				

				
				alignBoxesHeight3boxes(boxValArray, 2, 1, 3);
				alignBoxesWidth(boxValArray, 2, 1);
				
			},
			stop: function(e, ui) {
				 
				setLocalStorageProperties(templateId, boxValArray);
				 
			}
			
			});
			
		}
		
	};
	
	//width adjustment for template(1,3)
	function alignBoxesWidth(boxValArray, boxNumBase, boxNumAlign){
					
					
					var remainWidth = boxValArray['parent']['width'] - $(boxValArray['box' + boxNumBase]['id']).width();
					
					//Corrects bug that sets left property on boxNumAlign. Forces it to have left property turned off.
					$(boxValArray['box' + boxNumAlign]['id']).css("left", "");
					
					boxValArray['box' + boxNumBase]['width'] = $(boxValArray['box' + boxNumBase]['id']).width();
					boxValArray['box' + boxNumAlign]['width'] = $(boxValArray['box' + boxNumAlign]['id']).width();
					
					$(boxValArray['box' + boxNumAlign]['id']).width(remainWidth);
		
	}
	
	
	//Height adjustment for boxes in template 3.
	function alignBoxesHeight3boxes(boxValArray, boxNumBase, boxNumSame, boxNumBig){
		
					var remainHeight = boxValArray['parent']['height'] - $(boxValArray['box' + boxNumBase]['id']).height();
					
					boxValArray['box' + boxNumBase]['height'] = $(boxValArray['box' + boxNumBase]['id']).height();
					boxValArray['box' + boxNumSame]['height'] = $(boxValArray['box' + boxNumSame]['id']).height();
					boxValArray['box' + boxNumBig]['height'] = $(boxValArray['box' + boxNumBig]['id']).height();
					
					
					$(boxValArray['box' + boxNumSame]['id']).height(boxValArray['box' + boxNumBase]['height']);
					$(boxValArray['box' + boxNumBig]['id']).height(remainHeight);
		
	}
	
	
	//Creates an array with all the properties needed for resize function.
	function initResizableBoxValues(parent){
	
		var parentWidth = $(parent).width();
		var parentHeight = $(parent).height();
		var boxwidth;
		var boxheight;
		var boxId;
		
		var numBoxes = $("[id ^=box][id $=wrapper]").length;
		
		var boxValueArray = new Array();
		boxValueArray["parent"] = {"width": parentWidth, "height": parentHeight};
		
		for (var i = 1; i <= numBoxes; i++) {
			boxWidth = $("#box" + i + "wrapper").width();
			boxHeight = $("#box" + i + "wrapper").height();
			boxId = "#box" + i + "wrapper";
			boxValueArray["box" + i] = {"id": boxId, "width": boxWidth, "height": boxHeight};
		}
		
		return boxValueArray;
	}
	
	
	//Saves the measurments in percent for the boxes on the screen in local storage.
	function setLocalStorageProperties(templateId, boxValArray){
	
		var numBoxes = $("[id ^=box][id $=wrapper]").length;
		
		var widthPer;
		var heightPer;
		
		for(var i = 1; i <= numBoxes; i++){
			
			widthPer = (boxValArray['box' + i]['width'] / boxValArray['parent']['width']) *100;
			heightPer = (boxValArray['box' + i]['height'] / boxValArray['parent']['height']) *100;
			
			widthPer = Math.floor(widthPer, 100);
			heightPer = Math.floor(heightPer, 100);
			
			localStorage.setItem("template" + templateId +  "box" + i + "widthPercent", widthPer);
			localStorage.setItem("template" + templateId +  "box" + i + "heightPercent", heightPer);
			
		}
	}

	
	//Gets box measurments from localstorage and applies them onto the boxes on screen.
	//This is done preinit of boxValArray, so that the init of that array gets these values.
	function getLocalStorageProperties(templateId){
		
		var numBoxes = $("[id ^=box][id $=wrapper]").length;
		
		for(var i = 1; i <= numBoxes; i++){
		
			if(localStorage.getItem("template" + templateId + "box" + i + "widthPercent") != null){
				
				$("#box" + i + "wrapper").width(localStorage.getItem("template" + templateId + "box" + i + "widthPercent") + "%");
				$("#box" + i + "wrapper").height(localStorage.getItem("template" + templateId +  "box" + i + "heightPercent") + "%");
				
			}
		}
	}

/********************************************************************************

   Markdown, the functions in the next section contains the functions used by
	the markdown parser.

*********************************************************************************/

//----------------------------------------------------------------------------------
// initializeMarkdownMap: Fills a map with formatting tags, each element in the map
//			  corresponds to a markdown symbol.
//----------------------------------------------------------------------------------
function initializeMarkdownMap()
{
	var characterToMarkdown = new Map();
																		// Markdown symbol
	characterToMarkdown[0] = " ";										// [\] somehow escape symbol	
	characterToMarkdown["*"] = "<font style='font-style:italic'>";		// [*] note * + " " == bulletin list
	characterToMarkdown["**"] = "<font style='font-weight:bold'>";		// [**]
	characterToMarkdown["***"] = "<h1>";								// [***] Should be italics and bold
	characterToMarkdown["_"] = "<font style='font-style:italic'>";		// [_]
	characterToMarkdown["__"] = "<font style='font-weight:bold'>";		// [__]
	characterToMarkdown["___"] = "___";									// [___] Should be italics and bold
	characterToMarkdown["#"] = "<h1>"; 									// [#]	
	characterToMarkdown["##"] = "<h2>"; 								// [##]	
	characterToMarkdown["###"] = "<h3>"; 								// [###]	
	characterToMarkdown["####"] = "<h4>"; 								// [####]	
	characterToMarkdown["#####"] = "<h5>"; 								// [#####]	
	characterToMarkdown["######"] = "<h6>"; 							// [######]
	characterToMarkdown[13] = "- ";										// [- ]	Should be bulletin list
	characterToMarkdown[14] = "1. ";									// [1.] Note: Should be numbered list
	characterToMarkdown[15] = "~~~";									// [~~~] text section
		
	return characterToMarkdown;
}

//----------------------------------------------------------------------------------
// markdownCharToHtmlTag: Receives a string of markdown characters. 
//			  If the characters exists in the map characterToMarkdown, the function returns
//			  the corresponding HTML tag.
//----------------------------------------------------------------------------------
function markdownCharToCssTag(markdownString)
{
	var characterToMarkdown = initializeMarkdownMap();
	var markdownArray = initializeMarkdownArray();
	var outString = "";
	
	for(var key in characterToMarkdown){
		if(key === markdownString){
			outString = characterToMarkdown[key];
		}
	}
	
	return outString;
}

//----------------------------------------------------------------------------------
// initializeTagMap: Fills a map with css tags, and matches them with a closing tag
//----------------------------------------------------------------------------------
function initializeCssMap()
{
	var cssTagMap = new Map();
																	// Markdown symbol
	cssTagMap[0] = " "; // somehow escape symbol					// [\]
	cssTagMap["<font style='font-style:italic'>"] = "</font>";		// [*] || [_] note "*" + " " == bulletin list
	cssTagMap["<font style='font-weight:bold'>"] = "</font>";		// [**] || [__]
	//cssTagMap[3] = "***"; //Should be italics and bold			// [***] || [___]
	cssTagMap["<h1>"] = "</h1>";									// [#]	
	cssTagMap["<h2>"] = "</h2>";									// [##]		
	cssTagMap["<h3>"] = "</h3>";									// [###]	
	cssTagMap["<h4>"] = "</h4>";									// [####]	
	cssTagMap["<h5>"] = "</h5>";									// [#####]	
	cssTagMap["<h6>"] = "</h6>"; 									// [######]	
	//cssTagMap[13] = "- "; //Should be bulletin list					// [- ]	
	//cssTagMap[14] = "1. "; //Should be numbered list				// [1.] note	
	//cssTagMap[15] = "~~~"; //text section							// [~~~]	
	
	return cssTagMap;
}

//----------------------------------------------------------------------------------
// matchCssTag: Receives a string and matches incoming css tags with the right closing tag.
//----------------------------------------------------------------------------------
function matchCssTag(inString)
{
	var outString = " ";
	var cssTagMap = initializeCssMap();
		
	for(var key in cssTagMap){
		if(key === inString){
			outString = cssTagMap[key];
		}
	}
	return outString;
}

//----------------------------------------------------------------------------------
//initializeMarkdownMap: Fills an array with the valid markdown symbols
//----------------------------------------------------------------------------------
function initializeMarkdownArray()
{
	var markdownArray = ["######", "#####", "####", "###", "##", "#", "***", "**", "*", "___", "__", "_", "~~~"];
	
	return markdownArray;
}

//----------------------------------------------------------------------------------
// rowCreatorMarkdown:	Receives a string with text and returns an array of strings. 
//			Each element in the array contains a row, a row is the characters between line breaks.
//			DO NOT KNOW IF THIS REALLY WORK ON LINE BREAK NEED TO BE TEST WITH
//			A LONGER TEXT FILE.
//----------------------------------------------------------------------------------
function stringToRowMarkdown(inString)
{
	var outArray = [];
	var storeAtIndexArray = 0;
	var rowStart = 0;
	
	for(var i = 0; i < inString.length; i++){
		currentChar = inString[i];
		if(currentChar == '\n'){
			outArray[storeAtIndexArray] = inString.slice(rowStart, i);
			++storeAtIndexArray;
			rowStart = i + 1;
		}
	}
	outArray[storeAtIndexArray] = inString.slice(rowStart, inString.length);
	return outArray;
}

//----------------------------------------------------------------------------------
// rowToStringMarkdown: Receives an array containing strings and assembles them to a
//			string, also insert a line break between each string added 
//			from the array.
//----------------------------------------------------------------------------------
function rowToStringMarkdown(inArray)
{
	var outString = " ";
	linebreak = '<br>';
	
	for(var i = 0; i < inArray.length; i++){
		outString = outString + inArray[i] + linebreak;		//Note: Adds line break after last line good or bad
	}
	return outString;
}

//----------------------------------------------------------------------------------
// printMarkdown: Receives a string and matches incoming html tags with the right closing tag.			  
//----------------------------------------------------------------------------------
function printMarkdown(leadingMarkdown, inString, trailingMarkdown)
{
	var startTag = markdownCharToCssTag(leadingMarkdown);	
	var endTag = matchCssTag(startTag);
	
	if(trailingMarkdown == true){
		var outString = inString.replace(leadingMarkdown, startTag); 
		outString = outString.replace(leadingMarkdown, endTag);	
	}else{ 
		var outString = inString.replace(leadingMarkdown, startTag); 
		outString = outString + endTag;
	}
	
	return outString;
}

//----------------------------------------------------------------------------------
// parseMarkdown: Take a string disassemble it to rows, searches for markdown 
//		  symbols stored in markdownArray, if markdown symbols are found, 
//		  the replace them with html tags. Then Assemble the rows to a 
//		  string again, and return the string.
//----------------------------------------------------------------------------------
function parseMarkdown(inString)
{
	var markdownArray = initializeMarkdownArray();	//The markdownArray stores all valid markdown symbols
	var returnString = " " ;			//The variable used to return the string
	var foundFirstMarkdown = false;			//Flag that tells if a markdown symbols has already been found
	var markdownRowIndex = -1;			//For now just tells if markdown symbols found, later it should tell on which row the markdown is found
	
	//Break the in string down row by row, place each row in an array
	var rowArray = stringToRowMarkdown(inString);	
	
	//Iterate over each row
	for(var i = 0; i < rowArray.length; i++){		
		//Iterate over each symbol in the markdownArray
		for(var j = 0; j < markdownArray.length; j++){
			//indexOf() returns index of first symbol found in string, -1 if not found
			markdownRowIndex = rowArray[i].indexOf(markdownArray[j]);	
				
			//If a string that exists in the markdownArray is found a markdown symbol has been found.
			//Also check if it is the first time a markdown symbol is found, markdown at index j <= 5 has no trailing markdown symbols
			if(markdownRowIndex != -1 && foundFirstMarkdown == false && j <= 5){
				//Set that a markdown symbol is found
				foundFirstMarkdown = true;
				
				//Replace the markdown symbols with html tags
				rowArray[i] = printMarkdown(markdownArray[j], rowArray[i], false);
				
				//Check the same row for more markdown symbols of this kind, useful for bulletin lists 
				j = j - 1;
			}
						
			//If a string that exists in the markdownArray is found a markdown symbol has been found,
			//Symbols stored at index j >=6, has trailing markdown symbols
			if(markdownRowIndex != -1 && j >= 6){
				//Set flag for first found markdown symbol
				foundFirstMarkdown = true;
				
				//Replace the markdown symbols with html tags
				rowArray[i] = printMarkdown(markdownArray[j], rowArray[i], true);
				
				//After the markdown has been replaced reset flag for first markdown
				foundFirstMarkdown = false;
				
				//Check the same row for more markdown symbols of the same kind
				j = j - 1;
			}
		}
		//Reset flag
		foundFirstMarkdown = false;
	}
	
	//Assemble array of rows to one string
	returnString = rowToStringMarkdown(rowArray);
	
	//return string with markdown symbols replaced with html tags
	return returnString;
}
