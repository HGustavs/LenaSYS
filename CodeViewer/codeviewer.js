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

var retData;				// Data returned from setup
var tokens = [];            // Array to hold the tokens.
var dmd=0;					// Variable used to determine forward/backward skipping with the forward/backward buttons
var genSettingsTabMenuValue = "wordlist";
var codeSettingsTabMenuValue = "implines";				
var querystring = parseGet();

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
// returned: Fetches returned data from all sources
//---------------------------------------------------------------------------------------------------

function returned(data)
{	
	retData=data;
	console.log(retData);
	
	if(retData['debug']!="NONE!") console.log("Returned from setup: " + retData['debug']);
	
	// Disables before and after button if there are no available example before or after. 
	// Works by checking if the current example is last or first in the order of examples.
	if(retData['before']!=null&&retData['after']!=null) {
		if (retData['exampleno'] == retData['beforeafter'][0][0] || retData['before'].length == 0) {
			$("#beforebutton").css("opacity",0.4);
			$("#beforebutton").css("pointer-events","none");
		}
		if (retData['exampleno'] == retData['beforeafter'][retData['beforeafter'].length - 1][0] || retData['after'].length == 0) {
			$("#afterbutton").css("opacity",0.4);
			$("#afterbutton").css("pointer-events","none");
		}
	}else if(retData['before']==null&&retData['after']==null){ //If there are no examples this disables being able to jump through (the non-existsing) examples
		$("#beforebutton").css("opacity",0.4);
		$("#beforebutton").css("pointer-events","none");
		$("#afterbutton").css("opacity",0.4);
		$("#afterbutton").css("pointer-events","none");	
	}
	// Fill Section Name and Example Name
	var exName=document.getElementById('exampleName');
	exName.innerHTML=data['examplename'];
	var exSection=document.getElementById('exampleSection');
	exSection.innerHTML=data['sectionname']+"&nbsp;:&nbsp;";

	// User can choose template if no template has been chosen and the user has write access.
	if((retData['templateid'] == 0)){
		if(retData['writeaccess'] == "w"){
			alert("A template has not been chosen for this example, please choose one");
			$("#chooseTemplate").css("display","block");
			return;
		}else{
			alert("There is no template and you do not have the access rights to change this");
			return;
		}
	}
	changeCSS("../Shared/css/"+retData['stylesheet']);

	// Clear div2
	$("#div2").html("");
	
	// Possible crash warning if returned number of boxes is wrong
	if(retData['numbox']==0 || retData['numbox']==null){
		var debug = "Debug: Nr boxes ret: " +retData['numbox']+ ", may cause page crash"
		console.log(debug);
	}
	// Create boxes
	for(var i=0;i<retData['numbox'];i++){
		var contentid="box"+retData['box'][i][0];
		var boxid=retData['box'][i][0];
		var boxtype=retData['box'][i][1].toUpperCase();
		var boxcontent=retData['box'][i][2];
		var boxwordlist=retData['box'][i][3];
		var boxmenuheight = 0;
	
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
			// Without this fix the code box is placed at same height as the menu, obstructing first lines of the code
			// Setting boxmenuheight to 0, possible cause to example malfunction? 
			if($("#"+contentid+"menu").height() == null){
				boxmenuheight = 0;
			}else{
				boxmenuheight= $("#"+contentid+"menu").height();
			}
			$("#"+contentid).css("margin-top", boxmenuheight-1);
			// Indentation fix of content
			boxcontent = tabLine(boxcontent);
			//Replace '"<', and '>"', in qoutes with "&lt, and &gt"
			boxcontent = fixQuotedHtml(boxcontent);
			// Render code
			rendercode(boxcontent,boxid,boxwordlist);
		}else if(boxtype == "DOCUMENT"){
			// Print out description in a document box
			$("#"+contentid).removeClass("codebox").addClass("descbox");
			var desc = boxcontent;
			desc = replaceAll("&nbsp;"," ",desc);
			
			// Highlight important words
			important = retData.impwords;
			for(j=0;j<important.length;j++){
				var sstr="<span id='IWW' class='impword' onmouseover='highlightKeyword(\""+important[j]+"\")' onmouseout='dehighlightKeyword(\""+important[j]+"\")'>"+important[j]+"</span>";														
				desc=replaceAll(important[j],sstr,desc);
			}
			/* Assign Content */
			//Remove html tags since only markdown should be allowed		
			desc = dehtmlify(desc, true, 0);
			//Call the markdown function to parse markdown symbols to html tags
			desc = parseMarkdown(desc);
			//Change the '\n' line breaks to <br> tags
			desc = addHtmlLineBreak(desc);
			
			$("#"+contentid).html(desc);			
			$("#"+contentid).css("margin-top", boxmenuheight);
			createboxmenu(contentid,boxid,boxtype);
			// Make room for the menu by setting padding-top equals to height of menubox
			if($("#"+contentid+"menu").height() == null){
				boxmenuheight = 0;
			}else{
				boxmenuheight= $("#"+contentid+"menu").height();
			}
			$("#"+contentid).css("margin-top", boxmenuheight);
		}else if(boxtype == "NOT DEFINED"){
			if(retData['writeaccess'] == "w"){
				createboxmenu(contentid,boxid,boxtype);
				// Make room for the menu by setting padding-top equals to height of menubox
				if($("#"+contentid+"menu").height() == null){
					boxmenuheight = 0;
				}else{
					boxmenuheight= $("#"+contentid+"menu").height();
				}
				$("#"+contentid).css("margin-top", boxmenuheight);
			}
		}
	}
	// Allows resizing of boxes on the page
	resizeBoxes("#div2", retData["templateid"]);
}

//---------------------------------------------------------------------------------
// This functions convert tabs to "&#9;""
// The indexOf() method returns the position of the first time of a specified value 
// (in this example is the search word "\t" which stands for tab) in a string.
// This method returns then -1 if the "search word" dosn't exist in the string. 
// Text.slice truncates the text string were the tab is placed by useing tabindex 
// as a index. And then adds "&#9;" to the text string. "&#9;" replace the tab 
// utill "tokenize" functions is called then &#9; is being replaces by 4 spaces. 
// So the loop will check the whole text the function assign "start" the value of 
// tabindex so the loop can keep on looking for tabs in the same place where it left off
//                Is called by returned(data) in codeviewer.js
//---------------------------------------------------------------------------------
var tabLine = function(text) 
{
    var start = 0;
    var tabIndex;

    while ((tabIndex = text.indexOf('\t', start)) != -1) {
        text = text.slice(0, tabIndex) + "&#9; " + text.slice(tabIndex + 1);
        start = tabIndex;
    }
    return text;
};

//----------------------------------------------------------------------------------
// editImpWords: adds/removes important words to the #impword selectbox
// and stores each added/removed word in the addedWords array and the removedWords array 
//                Is called at line 201/204 in EditorV50.php
//---------------------------------------------------------------------------------
var addedWords = [];
var removedWords = [];

function editImpWords(editType) 
{
	var word = $("#impword").val();

	// word can't contain any whitespaces
	if (editType == "+" && word != "" && /\s/.test(word) == false) {
		var exists = false;
		// Checks if the word already exists as an option in the selectbox
		$('#impwords option').each(function() {
    		if (this.value == word) {exists = true;}
		});
		if (exists == false) {
			$("#impwords").append('<option>' + word + '</option>');
			$("#impword").val("");
			addedWords.push(word);
		}
	}

	else if (editType == "-") {
		word = $('option:selected', "#impwords").text();
		$('option:selected', "#impwords").remove();
    	removedWords.push(word);
	}
}

//----------------------------------------------------------------------------------
// displayEditExample: Displays the dialogue box for editing a code example
//                Is called at line 58 in navheader.php
//----------------------------------------------------------------------------------¨
function displayEditExample(boxid)
{
	$("#title").val(retData['examplename']);
	$("#secttitle").val(retData['sectionname']);
	$("#playlink").val(retData['playlink']);
	
	var iw=retData['impwords'];
	var str="";
	for(var i=0;i<iw.length;i++){
		str+="<option>"+iw[i]+"</option>";
	}
	$("#impwords").html(str);

	// Set beforeid and afterid if set
	var beforeid="UNK";
	if(retData['before']!==null){
		if(retData['before'].length!==0){
			beforeid=retData['before'][0][0];			
		}
	}
	var afterid="UNK";
	if(retData['after']!==null){
		if(retData['after'].length!==0){
			afterid=retData['after'][0][0];
		}
	}
	// Variables used to fetch filename for current codebox
	var bestr="";
	var afstr="";
	var ba=retData['beforeafter'];
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
//                Is called at line 210 in EditorV50.php
//					Used by file EditorV50.php
//----------------------------------------------------------------------------------
function updateExample()
{
	// Set beforeid if set
	var beforeid="UNK";
	if(retData['before'].length!=0){
		beforeid=retData['before'][0][0];
	}
	var afterid="UNK";
	if(retData['after'].length!=0){
		afterid=retData['after'][0][0];
	}
	// Checks if any field in the edit box has been changed, an update would otherwise be unnecessary
	if((removedWords.length > 0)||(addedWords.length > 0)||($("#before option:selected").val()!=beforeid&&beforeid!="UNK")||($("#after option:selected").val()!=afterid&&afterid!="UNK")||($("#playlink").val()!=retData['playlink'])||($("#title").val()!=retData['examplename'])||($("#secttitle").val()!=retData['sectionname'])){
		var courseid = querystring['courseid'];
		var cvers = querystring['cvers'];
		var exampleid = querystring['exampleid'];
		var playlink = $("#playlink").val();
		var examplename = $("#title").val();
		var sectionname = $("#secttitle").val();
		var beforeid = $("#before option:selected").val();
		var afterid = $("#after option:selected").val();

		AJAXService("EDITEXAMPLE", {
			courseid : courseid,
			cvers : cvers,
			exampleid : exampleid,
			beforeid : beforeid,
			afterid : afterid,
			playlink : playlink,
			examplename : examplename,
			sectionname : sectionname,
			addedWords : addedWords,
			removedWords : removedWords
		}, "CODEVIEW");
		
		// Clears the important words and prevents multiple inserts..
		addedWords = [];
		removedWords = [];
	}
}

//----------------------------------------------------------------------------------
// displayEditContent: Displays the dialogue box for editing a content pane
//                Is called by createboxmenu in codeviewer.js
//----------------------------------------------------------------------------------
var openBoxID;

function displayEditContent(boxid)
{	
	var box = retData['box'][boxid-1]; 	// The information stored about the box is fetched
	openBoxID = boxid;				// Keeps track of the currently open box. Used when saving the box content.

	$("#boxtitle").val(box[4]);
	$("#boxcontent").val(box[1]);  

	changeDirectory($("#boxcontent"));
	
	$("#filename").val(box[5]);

	var wordl=retData['wordlists'];
	var str="";
	for(var i=0;i<wordl.length;i++){
		str+="<option value='"+wordl[i][0]+"'>"+wordl[i][1]+"</option>";
	}
	$("#wordlist").html(str);
	$("#wordlist").val(box[3]);

	var str="";
	for (var i = 0; i < retData['improws'].length; i++) {
		if (retData['improws'][i][0] == boxid) {
			str+="<option>" + retData['improws'][i][1] + " - " + retData['improws'][i][2] + "</option>";
		}
	};
	$("#improws").html(str);
	$("#editContent").css("display","block");
}

//----------------------------------------------------------------------------------
// changeDirectory: Changes the directory in which you choose your code or description
// 					in the Edit Content box.
//                Is called at line 159 in EditorV50.php
//----------------------------------------------------------------------------------

function changeDirectory(kind) 
{
	var dir;
	var str="";

	if ($(kind).val() == "CODE") {
		dir = retData['directory'][0];
		$('#wordlist').prop('disabled', false);
	}else if ($(kind).val() == "DOCUMENT") {
		dir = retData['directory'][1];
		$('#wordlist').val('4');
		$('#wordlist').prop('disabled', 'disabled');
	}

	for(var i=0;i<dir.length;i++){
		str+="<option value='" + dir[i] + "'>"+dir[i]+"</option>";
	}
	$("#filename").html(str);
}

//----------------------------------------------------------------------------------
// isNumber: 		returns true: the variable only contains numbers
//					returns false: the variable is not purely numeric
//                Is called by editImpRows in codeviewer.js
//----------------------------------------------------------------------------------

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

//----------------------------------------------------------------------------------
// editImpRows: Adds and removes important rows
//                Is called at line 165/169 in EditorV50.php
//----------------------------------------------------------------------------------

var addedRows = new Array();
var removedRows = new Array();

function editImpRows(editType) 
{
	var rowFrom = $("#improwfrom").val();
	var rowTo = $("#improwto").val();
	var row = $("#improwfrom").val() + " - " + $("#improwto").val();

	if (editType == "+" && rowFrom != "" && rowTo != "" && /\s/.test(rowFrom) == false && /\s/.test(rowTo) == false && isNumber(rowFrom) == true && isNumber(rowTo) == true && rowFrom <= rowTo) {

		var exists = false;
		$('#improws option').each(function() {
    		if (this.value == row) {exists = true;}
		});
		if (exists == false) {
			$("#improws").append('<option>' + row + '</option>');
			$("#improwfrom").val("");
			$("#improwto").val("");
			addedRows.push([openBoxID,rowFrom,rowTo]);
		}
	}
	else if (editType == "-") {
		FromTo = $('option:selected', "#improws").text().split(" - ");
		$('option:selected', "#improws").remove();
    	removedRows.push([openBoxID,FromTo[0],FromTo[1]]);
	}
}

//----------------------------------------------------------------------------------
// updateContent: Updates the box if changes has been made
//                Is called at line 174 in EditorV50.php
//----------------------------------------------------------------------------------
function updateContent() 
{
	var box = retData['box'][openBoxID-1];

	// First a check to is done to see if any changes has been made, then the new values are assigned and changed
	// TODO: Handle null values
	if (box[1] != $("#boxcontent").val() || box[3] != $("#wordlist").val() || box[4] != $("#boxtitle").val() || box[5] != $("#filename option:selected").val() || addedRows.length > 0 || removedRows.length > 0) {
		var boxtitle = $("#boxtitle").val();
		var boxcontent = $("#boxcontent option:selected").val();
		var wordlist = $("#wordlist").val();
		var filename = $("#filename option:selected").val();
		var exampleid = querystring['exampleid'];
		var boxid = box[0];
		
		AJAXService("EDITCONTENT", {
			exampleid : exampleid,
			boxid : boxid,			
			boxtitle : boxtitle,
			boxcontent : boxcontent,
			wordlist : wordlist,
			filename : filename,
			addedRows : addedRows,
			removedRows : removedRows
		}, "BOXCONTENT");

		addedRows = [];
		removedRows = [];
	}
}

//----------------------------------------------------------------------------------
// addTemplatebox: Adds a new template box to div2
//				   Is called by returned(data) in codeviewer.js
//----------------------------------------------------------------------------------

function addTemplatebox(id)
{
	str="<div id='"+id+"wrapper' ";
	if(id==("box"+retData['numbox'])){
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
//                Is called by returned(data) in codeviewer.js
//----------------------------------------------------------------------------------

function createboxmenu(contentid, boxid, type)
{
	if(!document.getElementById(contentid+"menu")){
		var boxmenu = document.createElement("div");
		document.getElementById(contentid+"wrapper").appendChild(boxmenu);
		boxmenu.setAttribute("class", "buttomenu2 buttomenu2Style");
		boxmenu.setAttribute("id", contentid+"menu");
		
		// If reader has write access the settings button is shown along with box title
		if(retData['writeaccess'] == "w"){
			if(type=="DOCUMENT"){
				var str = '<table cellspacing="2"><tr>';
				str+="<td class='butto2 editcontentbtn showdesktop codedropbutton' id='settings' title='Edit box settings' onclick='displayEditContent("+boxid+");' ><img src='../Shared/icons/general_settings_button.svg' /></td>";
				str+='<td class="butto2 boxtitlewrap" title="Change box title"><span class="boxtitleEditable">'+retData['box'][boxid-1][4]+'</span></td>';	
				str+="</tr></table>";
			}else if(type=="CODE"){
				var str = "<table cellspacing='2'><tr>";
				str+="<td class='butto2 editcontentbtn showdesktop codedropbutton' id='settings' title='Edit box settings' onclick='displayEditContent("+boxid+");' ><img src='../Shared/icons/general_settings_button.svg' /></td>";
				str+= '<td class="butto2 boxtitlewrap" title="Change box title"><span class="boxtitleEditable" contenteditable="true" onblur="changeboxtitle(this,'+boxid+');">'+retData['box'][boxid-1][4]+'</span></td>';				
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
		// If reader doesn't have write access, only the boxtitle is shown
		}else{
			var str = '<table cellspacing="2"><tr>';
			str+= '<td class="boxtitlewrap"><span class="boxtitle">'+retData['box'][boxid-1][4]+'</span></td>';
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
// createhotdogmenu: Creates the menu at the top of a box 
//                Is called never called, code is kept for future use
//----------------------------------------------------------------------------------
function createhotdogmenu()
{
	// div2 refers to the main content div below the floating menu
	var content = document.getElementById("div2");
	// Checks if a hotdogmenu already exists, then calls that, if not a new one is created
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
	// TODO: Check if redundant warning, as code is not used for now it's not that much of a priority
	// Possible crash warning if returned number of boxes is wrong
	if(retData['numbox']==0 || retData['numbox']==null){
		var debug = "Debug: Nr boxes ret: " +retData['numbox']+ ", may cause page crash"
		console.log(debug);
	}
	for(i=0;i<retData['numbox'];i++){
		str += "<tr><td class='mbutto mbuttoStyle' title='Show \""+retData['box'][i][3]+"\"' onclick='toggleTabs(\"box"+(i+1)+"wrapper\",this);' colspan='4'>"+retData['box'][i][3]+"<img src='../Shared/icons/hotdogTabButton.svg' /></td></tr>";
	}		
	str += '<tr><td class="mbutto mbuttoStyle " title="Change to desktop site" onclick="disableResponsive(&quot;yes&quot;); setEditing();" colspan="4">Desktop site</td></tr>';
	str += '</table>';
	hotdogmenu.style.display="block";	
	hotdogmenu.innerHTML = str;
}

//----------------------------------------------------------------------------------
// toggleClass: Modifies class using Jquery to contain "activebox" class selector
//				Used by createboxmenu(contentid, boxid, type) in codeviewer.js
//----------------------------------------------------------------------------------
function toggleClass(id)
{
	var className = $('#'+id).attr('class');
	$(".boxwrapper").addClass("deactivatedbox").removeClass("activebox");	
	if(className.indexOf("activebox") >-1){
		$("#"+id).removeClass("activebox").addClass("deactivatedbox");
	}else{
		$("#"+id).removeClass("deactivatedbox").addClass("activebox");	
	}
}

//----------------------------------------------------------------------------------
// displayDrop: Modifies class using Jquery to contain "activebox" class selector 
//				TODO: Check if actually used, could not find within our files
//                Is called by [this function] in [this file]
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
//                Is called by rendercode in codeviewer.js
//----------------------------------------------------------------------------------
function highlightop(otherop,thisop)
{
	$("#"+otherop).addClass("hi");					
	$("#"+thisop).addClass("hi");					
}

//----------------------------------------------------------------------------------
// dehighlightop: Dehighlights an operator and corresponding operator in code window
//                Is called by rendercode in codeviewer.js
//----------------------------------------------------------------------------------

function dehighlightop(otherop,thisop)
{
	$("#"+otherop).removeClass("hi");					
	$("#"+thisop).removeClass("hi");					
}

//----------------------------------------------------------------------------------
// highlightHtml: Highlights an html-tag and corresponding html-tag in code window
//                Is called by rendercode in codeviewer.js
//----------------------------------------------------------------------------------

function highlightHtml(otherTag,thisTag)
{
	$("#"+otherTag).addClass("html");					
	$("#"+thisTag).addClass("html");					
}

//----------------------------------------------------------------------------------
// deHighlightHtml: Dehighlights an html-tag and corresponding html-tag in code window
//                Is called by rendercode in codeviewer.js
//----------------------------------------------------------------------------------
function deHighlightHtml(otherTag,thisTag)
{
	$("#"+otherTag).removeClass("html");					
	$("#"+thisTag).removeClass("html");					
}

//----------------------------------------------------------------------------------
// Skip: Handles skipping either forward or backward. If pressed show menu
//                Is called by createhotdogmenu in codeviewer.js
// TODO: Check usage of function now that DragNDrop of example order is
// implemented
//----------------------------------------------------------------------------------
var dmd;
function Skip(skipkind)
{
	if(skipkind=="bd"){
			dmd=1;
	}else if(skipkind=="bu"){
			if(retData['before'].length!=0&&dmd==1){
					navigateExample(retData['before'][0][0]);
			}
			dmd=0;		
	}
	if(skipkind=="fd"){
			dmd=2;
	}else if(skipkind=="fu"){
			if(retData['after'].length!=0&&dmd==2){
					navigateExample(retData['after'][0][0]);
			}
			dmd=0;
	}

	if(skipkind=="bd"||skipkind=="fd"){
			$("#forwdrop").css("display","none");
			$("#backwdrop").css("display","none");
	}
	
	setTimeout(function(){execSkip()}, 1000);							
}
//----------------------------------------------------------------------------------
// execSkip: 
//				Used by Skip in codeviewer.js
//----------------------------------------------------------------------------------
function execSkip()
{
	str="";
	if(dmd==1){
		for(i=0;i<retData['before'].length;i++){
			str+="<span id='F"+retData['before'][i][1]+"' onclick='navigateExample(\""+retData['before'][i][0]+"\")' class='dropdownitem dropdownitemStyle'>"+retData['before'][i][1]+":"+retData['before'][i][2]+"</span>";
		}
		$("#backwdropc").html(str);
		$("#backwdrop").css("display","block");
		dmd=0;
	}else if(dmd==2){
		for(i=0;i<retData['after'].length;i++){
			str+="<span id='F"+retData['after'][i][1]+"' onclick='navigateExample(\""+retData['after'][i][0]+"\")' class='dropdownitem dropdownitemStyle'>"+retData['after'][i][1]+":"+retData['after'][i][2]+"</span>";
		}
		$("#forwdropc").html(str);
		$("#forwdrop").css("display","block");
		dmd=0;
	}
}

//Retrieve height for building menu.
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
// 					Used by createboxmenu in codeviewer.js
//----------------------------------------------------------------------------------

function changeboxcontent(boxcontent,boxid)
{
	alert(boxcontent+" "+boxid);
	AJAXService("changeboxcontent","&boxid="+boxid+"&boxcontent="+boxcontent);	
}

/********************************************************************************

   HTML freeform editing code

*********************************************************************************/

//----------------------------------------------------------------------------------
// Switches Dropdown List to Visible
//			Used by switchDrop
//----------------------------------------------------------------------------------

function hideDrop(dname)
{
	var dropd=document.getElementById(dname);
	if(dropd!=null) dropd.style.display="none";							
}

//----------------------------------------------------------------------------------
// Switches Dropdown List to Visible
//				Is never used, code is kept for future use
//----------------------------------------------------------------------------------

function switchDrop(dname)
{
	var dropd=document.getElementById(dname); 
	if(dropd.style.display=="block"){
		$( dropd ).slideUp("fast");							
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
//				Is never used, code is kept for future use
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
// dehtmlify: Removes most html tags from a string!
//                Is called by editedExamplename(), returned(data) in codeviewer.js
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
// highlightKeyword: Highlights an important word from the important word list
//                Is called by [this function] in codeviewer.js
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
// dehighlightKeyword: DeHighlights an important word from the important word list
//                Is called by [this function] in codeviewer.js
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
//----------------------------------------------------------	
// Token class and storage definition	
//                Is called by [this function] in [this file]	
//----------------------------------------------------------								
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
//                Is called by [this function] in [this file]
//----------------------------------------------------------						

function maketoken(kind,val,from,to,rowno)
{
	newtoken=new token(kind,val,from,to,rowno);
	tokens.push(newtoken);
}

//----------------------------------------------------------
// Writes error from tokenizer
//                Is called by [this function] in [this file]
//----------------------------------------------------------						

function error(str,val,row)
{
	var debug = "Tokenizer error: "+ str+val+ " at row "+row;
	console.log(debug);
	alert("Tokenizer Error: "+str+val+" at row "+row);
}

//----------------------------------------------------------------------------------
// replaceAll: Used by tokenizer to replace all instances of find string with replace string in str.
//             The idea behind this is to  cancel the html entities introduced to allow streaming of content
//                Is called by [this function] in [this file]
//----------------------------------------------------------------------------------

function replaceAll(find, replace, str)
{
    return str.replace(new RegExp(find, 'g'), replace);
}

//----------------------------------------------------------
// Tokenize: Tokenizer partly based on ideas from the very clever tokenizer written by Douglas Cockford
//           The tokenizer is passed a string, and a string of prefix and suffix terminators
//                Is called by [this function] in [this file]
//----------------------------------------------------------						

function tokenize(instring,inprefix,insuffix)
{
	// replace HTML-entities
	instring = replaceAll("&lt;","<",instring);
	instring = replaceAll("&gt;",">",instring);
	instring = replaceAll("&amp;","&",instring);
	// this will replace all "&#9;" in the text that the function tabLine adds were a tab (\t) is placed.
	instring = replaceAll("&#9;","    ",instring); 

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
				//if currentStr is not finite (aka non-numerical) then it is a bad number!
				if(!isFinite(currentStr)) {
					currentStr += currentCharacter;
					i += 1;
					error('Bad Number: ',currentStr,row);
				}
			}
			
			currentNum = currentStr;
			
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
					break;
				}else{
					currentStr+=currentCharacter;                
				}
				i++;
			}	
			maketoken('rowcomment',currentStr,from,i,row);
			/* This does not have to be here because a newline creates in coderender function 
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
//                Is called by [this function] in [this file]
//----------------------------------------------------------------------------------

function rendercode(codestring,boxid,wordlistid)
{
    var destinationdiv = "box" + boxid;
	tokens = [];
	
	important = [];
	for(var i=0;i<retData.impwords.length;i++){
		important[i] = retData.impwords[i];
	}

	keywords= [];
	for(var i=0;i<retData['words'].length;i++){
		if(retData['words'][i][0]==wordlistid){
			keywords[retData['words'][i][1]]=retData['words'][i][2];
		}
	}

	improws=[];
	for(var i=0;i<retData.improws.length;i++){
        if ((retData['improws'][i][0]) == boxid){
       		improws.push(retData.improws[i]);
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
	
	htmlArray=new Array('html', 'head', 'body', 'div', 'span', 'doctype', 'title', 'link', 'meta', 'style', 'canvas', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'abbr', 'acronym', 'address', 'bdo', 'blockquote', 'cite', 'q', 'code', 'ins', 'del', 'dfn', 'kbd', 'pre', 'samp', 'var', 'br', 'a', 'base', 'img', 'area', 'map', 'object', 'param', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot', 'col', 'colgroup', 'caption', 'form', 'input', 'textarea', 'select', 'option', 'optgroup', 'button', 'label', 'fieldset', 'legend', 'script', 'noscript', 'b', 'i', 'tt', 'sub', 'sup', 'big', 'small', 'hr');
	htmlArrayNoSlash= new Array('area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source'); 
	var htmlTagCount=0;
	htmlTag=new Array();

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
			//If tokenvalue exists in the array for important words
			if(important.indexOf(tokenvalue) != -1){
				foundkey = 2;
			//Uses smart indexing to find if token value exists in array, if tokenvalue == length the statement is true
			}else if(keywords[tokenvalue] != null){
				foundkey = 1;
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
			}else if(tokenvalue=="<"){
				// This statement checks the character after < to make sure it is a valid tag. 
				if(isNumber(tokens[i+1].val) == false && tokens[i+1].val != "/" && tokens[i+1].val != "!" && tokens[i+1].val != "?"){
					if(htmlArray.indexOf(tokens[i+1].val.toLowerCase()) > -1){
						var k = 2;
						var foundEnd = false;
						while(tokens[i+k].kind != "newline"){
							if(tokens[i+k].val == ">"){					//If a > has been found on the same line as an < and the token to the left of < is in htmlArray then it classes it as an html-tag
								foundEnd = true;
								break;
							}
							k++;
						}
						if(foundEnd){
							pid="html"+htmlTagCount+boxid;
							htmlTagCount++;
							if(htmlArrayNoSlash.indexOf(tokens[i+1].val.toLowerCase()) == -1){
								htmlTag.push(pid);
							}
							cont+="<span id='"+pid+"' class='oper' onmouseover='highlightHtml(\"P"+pid+"\",\""+pid+"\");' onmouseout='deHighlightHtml(\"P"+pid+"\",\""+pid+"\");'>"+("&lt" + tokens[i+1].val);
							for(var j = 2; j < k+1; j++){
								cont+=tokens[i+j].val;
							}
							cont+="</span>";
							i=i+k;
						}else{
							cont+="<span class='oper'>"+tokenvalue+"</span>";
						}
					}
				}else if(tokens[i+1].val=="/"){
					if(htmlArray.indexOf(tokens[i+2].val.toLowerCase()) > -1){
						if(htmlArrayNoSlash.indexOf(tokens[i+1].val.toLowerCase()) == -1){
							pid=htmlTag.pop();
						}else{
							htmlTagCount++;
							pid="html"+htmlTagCount+boxid;
						}
						cont+="<span id='P"+pid+"' class='oper' onmouseover='highlightHtml(\""+pid+"\",\"P"+pid+"\");' onmouseout='deHighlightHtml(\""+pid+"\",\"P"+pid+"\");'>"+("&lt" + tokens[i+1].val + tokens[i+2].val + tokens[i+3].val)+"</span>";
						i = i+3;
					}
				} else {
					cont+="<span class='oper'>"+tokenvalue+"</span>";
				}
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
				// Count how many linenumbers that'll be needed
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

//----------------------------------------------------------------------------------
// createCodeborder: function to create a border with line numbers
//                Is called by rendercode in codeviewer.js
//----------------------------------------------------------------------------------
function createCodeborder(lineno,improws){
	var str="<div class='codeborder'>";
	
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
//----------------------------------------------------------------------------------
//  linenumbers: 
//                Is called by fadelinenumbers(), rendercode in codeviewer.js
//----------------------------------------------------------------------------------
function linenumbers()
{	
	if(localStorage.getItem("linenumbers") == "false"){	
		$( "#numberbutton img" ).attr('src', '../Shared/icons/noNumbers_button.svg'); 
		$( "#numberbuttonMobile img" ).attr('src', '../Shared/icons/hotdogTabButton2.svg');
		$( ".codeborder" ).css("display","none");	
	}
}
//----------------------------------------------------------------------------------
//  mobileTheme
//                Is called by [this function] in codeviewer.css
//----------------------------------------------------------------------------------
function mobileTheme(id){
	if ($(".mobilethemebutton").is(":hidden")){
		$(".mobilethemebutton").css("display","table-cell");
	}
	else{
		$(".mobilethemebutton").css("display","none");
	}
}

//----------------------------------------------------------------------------------
//  setEditing: Set the editing properties for mobile and desktop version
//                Is never called, code is saved for future use
//----------------------------------------------------------------------------------
function setEditing()
{
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
// changetemplate: Change template by updating hidden field
//                Is called at line 223-229 in EditorV50.php
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
//                Is called at line 234 in EditorV50.php
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
		
		AJAXService("SETTEMPL", {
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

//----------------------------------------------------------------------------------
// closeEditContent: 
//                Is called at line 141 in EditorV50.php
//----------------------------------------------------------------------------------
function closeEditContent()
{
		$("#editContent").css("display","none");
}
//----------------------------------------------------------------------------------
// closeEditExample: 
//                Is called at line 183 in EditorV50.php
//----------------------------------------------------------------------------------
function closeEditExample()
{
		$("#editExample").css("display","none");
}
//----------------------------------------------------------------------------------
// openTemplateWindow:
//                Is called at line 53 in EditorV50.php
//----------------------------------------------------------------------------------
function openTemplateWindow()
{
	$("#chooseTemplate").css("display","block");
}
//----------------------------------------------------------------------------------
// closeTemplateWindow: 
//                Is called at line 218 in EditorV50.php
//----------------------------------------------------------------------------------
function closeTemplateWindow()
{
	$("#chooseTemplate").css("display","none");
}
//----------------------------------------------------------------------------------
// Play:
//					Is called at line 195 in EditorV50.php and line 56 in navheader.php
//----------------------------------------------------------------------------------
function Play()
{
	if(retData['playlink']!=null){
		navigateTo("/codeupload/",retData['playlink']);
	}
}

//-----------------------------------------------------------------------------
// resizeBoxes: Adding resize functionality for the boxes
//					Is called by setup() in codeviewer.js
//-----------------------------------------------------------------------------
function resizeBoxes(parent, templateId) 
{
	var boxValArray = initResizableBoxValues(parent);
	var remainWidth;
		
	if(templateId == 1){
		getLocalStorageProperties(templateId, boxValArray);
	
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
	}else if(templateId == 2){
		getLocalStorageProperties(templateId, boxValArray);
		
		$(boxValArray['box1']['id']).resizable({
			containment: parent,
			handles: "s",
			resize: function(e, ui){
				alignBoxesHeight2boxes(boxValArray, 1, 2);
				$(boxValArray['box1']['id']).width("100%");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
			}
		});
	}else if(templateId == 3){
		getLocalStorageProperties(templateId, boxValArray);
		
		$(boxValArray['box1']['id']).resizable({
			containment: parent,
			handles: "e",
			resize: function(e, ui){
				alignBoxesWidth3Boxes(boxValArray, 1, 2, 3);
				$("#box2wrapper").css("left", ""); 
				$("#box1wrapper").css("height", "100%");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
			}
		});

		$(boxValArray['box2']['id']).resizable({
			containment: parent,
			handles: "s",
			resize: function(e, ui){
				alignBoxesHeight2boxes(boxValArray, 2, 3);
				$(boxValArray['box2']['id']).css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
			}
		});
	}else if(templateId == 4){
		getLocalStorageProperties(templateId, boxValArray);
	
		$(boxValArray['box1']['id']).resizable({
			containment: parent,
			handles: "e,s",
			resize: function(e, ui){
				alignBoxesWidth(boxValArray, 1, 2);
				alignBoxesHeight3boxes(boxValArray, 1, 2, 3);
				$("#box2wrapper").css("left", " ");
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
				$("#box2wrapper").css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
			}
		});
	}else if(templateId == 5){
		getLocalStorageProperties(templateId, boxValArray);
	
		$(boxValArray['box1']['id']).resizable({
			containment: parent,
			handles: "e,s",
			resize: function(e, ui){
				alignBoxesWidth(boxValArray, 1, 2);
				alignBoxesHeight4boxes(boxValArray, 1, 2);
				$("#box2wrapper").css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
			}
		});
		
		$(boxValArray['box2']['id']).resizable({
			containment: parent,
			handles: "s",
			resize: function(e, ui){
				alignBoxesHeight4boxes(boxValArray, 2, 1);
				$("#box2wrapper").css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
			}
		});
		
		$(boxValArray['box3']['id']).resizable({
			containment: parent,
			handles: "e",
			resize: function(e, ui){
				alignBoxesWidth(boxValArray, 3, 4);
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
			}
		});
	}else if(templateId == 6){
		
			getLocalStorageProperties(templateId, boxValArray);
			$("#box3wrapper").css("top", localStorage.getItem("template6box2heightPercent") + "%");
			
		
			$(boxValArray['box1']['id']).resizable({
				containment: parent,
				handles: "e",
				resize: function(e, ui){
					alignWidth4boxes(boxValArray, 1, 2, 3, 4);
					$(boxValArray['box1']['id']).height(100 + "%");
					
				},
				stop: function(e, ui) {
					 
					setLocalStorageProperties(templateId, boxValArray);
					 
				}
			});
			
			$(boxValArray['box2']['id']).resizable({
				containment: parent,
				handles: "s",
				resize: function(e, ui){
					
						alignBoxesHeight3stack(boxValArray, 2, 3, 4);
						$(boxValArray['box3']['id']).css("left", " ");
						$(boxValArray['box2']['id']).css("left", " ");
						console.log("1");
					
				},
				stop: function(e, ui) {
					 
					setLocalStorageProperties(templateId, boxValArray);
					 
				}
			});
			
			
			$(boxValArray['box3']['id']).resizable({
				containment: parent,
				handles: "s",
				resize: function(e, ui){
					
					console.log("");
					$(boxValArray['box4']['id']).css("top", " ");
					alignBoxesHeight3stackLower(boxValArray, 2, 3, 4);
					
					
				},
				stop: function(e, ui) {
					 
					$(boxValArray['box4']['id']).css("top", " ");
					setLocalStorageProperties(templateId, boxValArray);
					 
				}
			});
		}
};
//----------------------------------------------------------------------------------
//width adjustment for template(1,3) (Two boxes beside eachother.)
//                Is called by resizeBoxes in codeviewer.js
//----------------------------------------------------------------------------------
function alignBoxesWidth(boxValArray, boxNumBase, boxNumAlign)
{
	var remainWidth = boxValArray['parent']['width'] - $(boxValArray['box' + boxNumBase]['id']).width();
	
	//Corrects bug that sets left property on boxNumAlign. Forces it to have left property turned off. Also forced a top property on boxNumBase.
	$(boxValArray['box' + boxNumAlign]['id']).css("left", "");
	$(boxValArray['box' + boxNumBase]['id']).css("top", " ");
	
	var remainWidthPer = (remainWidth/boxValArray['parent']['width'])*100;
	var basePer = 100 - remainWidthPer;
	
	$(boxValArray['box' + boxNumBase]['id']).width(basePer + "%");
	$(boxValArray['box' + boxNumAlign]['id']).width(remainWidthPer + "%");
	
	boxValArray['box' + boxNumBase]['width'] = basePer;
	boxValArray['box' + boxNumAlign]['width'] = remainWidthPer;
}
//----------------------------------------------------------------------------------
//width adjustment for template 3. 
//                Is called by resizeBoxes in codeviewer.js
//----------------------------------------------------------------------------------
function alignBoxesWidth3Boxes(boxValArray, boxNumBase, boxNumAlign, boxNumAlignSecond)
{
	var remainWidth = boxValArray['parent']['width'] - $(boxValArray['box' + boxNumBase]['id']).width();
	var remainWidthPer = (remainWidth / boxValArray['parent']['width'])*100;
	var basePer = 100 - remainWidthPer;

	$(boxValArray['box' + boxNumBase]['id']).width(basePer + "%");
	//Corrects bug that sets left property on boxNumAlign. Forces it to have left property turned off. Also forced a top property on boxNumBase.
	$(boxValArray['box' + boxNumAlign]['id']).css("left", " ");
	$(boxValArray['box' + boxNumBase]['id']).css("top", " ");
	$(boxValArray['box' + boxNumAlign]['id']).width(remainWidthPer + "%");
	$(boxValArray['box' + boxNumAlignSecond]['id']).width(remainWidthPer + "%");
	
	boxValArray['box' + boxNumBase]['width'] = $(boxValArray['box' + boxNumBase]['id']).width();
	boxValArray['box' + boxNumAlign]['width'] = $(boxValArray['box' + boxNumAlign]['id']).width();
	boxValArray['box' + boxNumAlignSecond]['width'] = $(boxValArray['box' + boxNumAlignSecond]['id']).width();
}
	
//----------------------------------------------------------------------------------
//Height adjustment for two boxes on top of eachother.
//                Is called by resizeBoxes in codeviewer.js
//----------------------------------------------------------------------------------
function alignBoxesHeight2boxes(boxValArray, boxNumBase, boxNumSame)
{
	var remainHeight = boxValArray['parent']['height'] - $(boxValArray['box' + boxNumBase]['id']).height();
	var remainHeightPer = (remainHeight/boxValArray['parent']['height'])*100;
	var basePer = 100-remainHeightPer;
	
	$(boxValArray['box' + boxNumBase]['id']).height(basePer + "%");
	$(boxValArray['box' + boxNumSame]['id']).height(remainHeightPer + "%");
	
	boxValArray['box' + boxNumBase]['height'] = $(boxValArray['box' + boxNumBase]['id']).height();
	boxValArray['box' + boxNumSame]['height'] = $(boxValArray['box' + boxNumSame]['id']).height();
}
//----------------------------------------------------------------------------------
//Height adjustment for boxes in template 4. (Two small boxes ontop of a big box.)
//                Is called by resizeBoxes in codeviewer.js
//----------------------------------------------------------------------------------
function alignBoxesHeight3boxes(boxValArray, boxNumBase, boxNumSame, boxNumBig)
{
	var remainHeight = boxValArray['parent']['height'] - $(boxValArray['box' + boxNumBase]['id']).height();
	var remainHeightPer = (remainHeight / boxValArray['parent']['height'])*100;
	var samePer = (($(boxValArray['box' + boxNumBase]['id']).height()) / boxValArray['parent']['height'])*100;
	
	$(boxValArray['box' + boxNumBase]['id']).height(samePer + "%");
	$(boxValArray['box' + boxNumSame]['id']).height(samePer + "%");
	$(boxValArray['box' + boxNumBig]['id']).height(remainHeightPer + "%");
	
	boxValArray['box' + boxNumBase]['height'] = $(boxValArray['box' + boxNumBase]['id']).height();
	boxValArray['box' + boxNumSame]['height'] = $(boxValArray['box' + boxNumSame]['id']).height();
	boxValArray['box' + boxNumBig]['height'] = $(boxValArray['box' + boxNumBig]['id']).height();
}
//----------------------------------------------------------------------------------
//Height adjustment for boxes in template 5.
//                Is called by resizeBoxes in codeviewer.js
//----------------------------------------------------------------------------------
function alignBoxesHeight4boxes(boxValArray, boxNumBase, boxNumSame)
{	
	var remainHeight = boxValArray['parent']['height'] - $(boxValArray['box' + boxNumBase]['id']).height();	
	var remainHeightPer = (remainHeight/boxValArray['parent']['height'])*100;
	var basePer = 100 - remainHeightPer;
	
	$(boxValArray['box' + boxNumBase]['id']).height(basePer + "%");
	$(boxValArray['box' + boxNumSame]['id']).height(basePer + "%");
	$(boxValArray['box3']['id']).height(remainHeightPer + "%");
	$(boxValArray['box4']['id']).height(remainHeightPer + "%");
	
	boxValArray['box' + boxNumBase]['height'] = $(boxValArray['box' + boxNumBase]['id']).height();
	boxValArray['box' + boxNumSame]['height'] = $(boxValArray['box' + boxNumSame]['id']).height();
	boxValArray['box3']['height'] = $(boxValArray['box3']['id']).height();
	boxValArray['box4']['height'] = $(boxValArray['box4']['id']).height();
}

//----------------------
// WIDTH MEASURMENT FOR TEMPLATE 6
//----------------------

function alignWidth4boxes(boxValArray, boxNumBase, boxNumAlign, boxNumAlignSecond, boxNumAlignThird){
	
					var remainWidth = boxValArray['parent']['width'] - $(boxValArray['box' + boxNumBase]['id']).width();
					
					
					var remainWidthPer = (remainWidth / boxValArray['parent']['width'])*100;
					var basePer = 100 - remainWidthPer;
					
					
					$(boxValArray['box' + boxNumBase]['id']).width(basePer + "%");
					//Corrects bug that sets left property on boxNumAlign. Forces it to have left property turned off. Also forced a top property on boxNumBase.
					$(boxValArray['box' + boxNumAlign]['id']).css("left", " ");
					$(boxValArray['box' + boxNumBase]['id']).css("top", " ");
					
					
					$(boxValArray['box' + boxNumAlign]['id']).width(remainWidthPer + "%");
					$(boxValArray['box' + boxNumAlignSecond]['id']).width(remainWidthPer + "%");
					$(boxValArray['box' + boxNumAlignThird]['id']).width(remainWidthPer + "%");
					
					boxValArray['box' + boxNumBase]['width'] = $(boxValArray['box' + boxNumBase]['id']).width();
					boxValArray['box' + boxNumAlign]['width'] = $(boxValArray['box' + boxNumAlign]['id']).width();
					boxValArray['box' + boxNumAlignSecond]['width'] = $(boxValArray['box' + boxNumAlignSecond]['id']).width();
					boxValArray['box' + boxNumAlignThird]['width'] = $(boxValArray['box' + boxNumAlignThird]['id']).width();
	
	}
	
	//----------------------
	// HEIGHT MEASURMENT FOR TEMPLATE 6
	//----------------------
	
	function alignBoxesHeight3stack(boxValArray, boxNumBase, boxNumAlign, boxNumAlignSecond){
					
					//Get initial values.
					var remainHeight = boxValArray['parent']['height'] - ($(boxValArray['box' + boxNumBase]['id']).height() + $(boxValArray['box' + boxNumAlignSecond]['id']).height());
					var remainHeightPer = (remainHeight/boxValArray['parent']['height'])*100;
					var alignSecondPer = ($(boxValArray['box' + boxNumAlignSecond]['id']).height() / boxValArray['parent']['height'])*100;
					var basePer = 100-(remainHeightPer + alignSecondPer);
					var atry = boxValArray['parent']['height'] - ($(boxValArray['box' + boxNumBase]['id']).height() + $(boxValArray['box' + boxNumAlign]['id']).height());
					var atry2 = (atry/boxValArray['parent']['height'])*100;
					
					
					if(remainHeightPer <= 10){
					
						atry = boxValArray['parent']['height'] - ($(boxValArray['box' + boxNumBase]['id']).height() + $(boxValArray['box' + boxNumAlign]['id']).height());
						atry2 = (atry/boxValArray['parent']['height'])*100;
					
						remainHeightPer = 10;
						$(boxValArray['box' + boxNumAlign]['id']).css("height", remainHeightPer + "%");
						$(boxValArray['box' + boxNumAlign]['id']).css("top", basePer + "%");
						$(boxValArray['box' + boxNumAlignSecond]['id']).css("height", atry2 + "%");
						$(boxValArray['box' + boxNumBase]['id']).css("height", basePer + "%");
						
					}else {
					
						$(boxValArray['box' + boxNumAlign]['id']).css("height", remainHeightPer + "%");
						$(boxValArray['box' + boxNumAlign]['id']).css("top", basePer + "%");
						$(boxValArray['box' + boxNumBase]['id']).css("height", basePer + "%");
					}
					
					//Update array
					boxValArray['box' + boxNumBase]['height'] = $(boxValArray['box' + boxNumBase]['id']).height();
					boxValArray['box' + boxNumAlign]['height'] = $(boxValArray['box' + boxNumAlign]['id']).height();
					boxValArray['box' + boxNumAlignSecond]['height'] = $(boxValArray['box' + boxNumAlignSecond]['id']).height();
						
	}
	
	//----------------------
	// HEIGHT MEASURMENT FOR TEMPLATE 6
	//----------------------
	
	function alignBoxesHeight3stackLower(boxValArray, boxNumBase, boxNumAlign, boxNumAlignSecond){
	
		
					var remainHeight = boxValArray['parent']['height'] - ($(boxValArray['box' + boxNumBase]['id']).height() + $(boxValArray['box' + boxNumAlignSecond]['id']).height());
					var remainHeightPer = (remainHeight/boxValArray['parent']['height'])*100;
					var alignSecondPer = ($(boxValArray['box' + boxNumAlignSecond]['id']).height() / boxValArray['parent']['height'])*100;
					var basePer = 100-(remainHeightPer + alignSecondPer);
					var atry = boxValArray['parent']['height'] - ($(boxValArray['box' + boxNumBase]['id']).height() + $(boxValArray['box' + boxNumAlign]['id']).height());
					var atry2 = (atry/boxValArray['parent']['height'])*100;
					
					if(atry2 <= 10){
					
						$("#box3wrapper").css({"top": basePer + "%",
											   "height": remainHeightPer + "%"});
						
						
						
					 }else {
					
						$("#box4wrapper").height(atry2 + "%");
						$("#box3wrapper").css({"top": basePer + "%",
											   "height": remainHeightPer + "%",
											   "left": " "});
						
					}
			
	}

//----------------------------------------------------------------------------------
//Creates an array with all the properties needed for resize function.
//                Is called by resizeBoxes in codeviewer.js
//----------------------------------------------------------------------------------
function initResizableBoxValues(parent)
{
	var parentWidth = $(parent).width();
	var parentHeight = $(parent).height();
	var boxwidth;
	var boxheight;
	var boxId;
	var numBoxes = $("[id ^=box][id $=wrapper]").length;
	var boxValueArray = new Array();
	boxValueArray["parent"] = {"id": parent, "width": parentWidth, "height": parentHeight};
	
	for (var i = 1; i <= numBoxes; i++) {
		boxWidth = $("#box" + i + "wrapper").width();
		boxHeight = $("#box" + i + "wrapper").height();
		boxId = "#box" + i + "wrapper";
		boxValueArray["box" + i] = {"id": boxId, "width": boxWidth, "height": boxHeight};
		console.log("boxId " + boxValueArray["box" + i]["id"] + " boxWidth: " + boxValueArray["box" + i]["width"] + " boxHeight: " + boxValueArray["box" + i]["height"]);
	}
	
	$(window).resize(function(event){
		 if (!$(event.target).hasClass('ui-resizable')) {
			boxValueArray['parent']['height'] = $(parent).height();
			boxValueArray['parent']['width'] = $(parent).width();
		}
	}); 
	return boxValueArray;
}

//----------------------------------------------------------------------------------
//Saves the measurments in percent for the boxes on the screen in local storage.
//                Is called by resizeBoxes in codeviewer.js
//----------------------------------------------------------------------------------
function setLocalStorageProperties(templateId, boxValArray)
{
	var numBoxes = $("[id ^=box][id $=wrapper]").length;	
	var widthPer;
	var heightPer;
	
	for(var i = 1; i <= numBoxes; i++){
		boxValArray['box' + i]['width'] = $(boxValArray['box' + i]['id']).width();
		boxValArray['box' + i]['height'] = $(boxValArray['box' + i]['id']).height();
		
		widthPer = (boxValArray['box' + i]['width'] / boxValArray['parent']['width']) *100;
		heightPer = (boxValArray['box' + i]['height'] / boxValArray['parent']['height']) *100;
		
		widthPer = Math.floor(widthPer, 100);
		heightPer = Math.floor(heightPer, 100);
		
		localStorage.setItem("template" + templateId +  "box" + i + "widthPercent", widthPer);
		localStorage.setItem("template" + templateId +  "box" + i + "heightPercent", heightPer);
	}
	setResizableToPer(boxValArray);
}

//----------------------------------------------------------------------------------
//Gets box measurements from localstorage and applies them onto the boxes on screen.
//This is done preinit of boxValArray, so that the init of that array gets these values.
//		  TODO: Add handling for when localstorage is null or < 0
//                Is called by resizeBoxes in codeviewer.js
//----------------------------------------------------------------------------------
function getLocalStorageProperties(templateId, boxValArray)
{
	var numBoxes = $("[id ^=box][id $=wrapper]").length;
	for(var i = 1; i <= numBoxes; i++){
		//Sanity checks
		if(localStorage.getItem("template" + templateId + "box" + i + "widthPercent") != null && localStorage.getItem("template" + templateId + "box" + i + "widthPercent") > 0){
			if(localStorage.getItem("template" + templateId + "box" + i + "heightPercent") != null && localStorage.getItem("template" + templateId + "box" + i + "heightPercent") > 0){
				$("#box" + i + "wrapper").width(localStorage.getItem("template" + templateId + "box" + i + "widthPercent") + "%");
				$("#box" + i + "wrapper").height(localStorage.getItem("template" + templateId +  "box" + i + "heightPercent") + "%");
				erasePercentGap(templateId, boxValArray);
			}
		}
	}
}

//----------------------------------------------------------------------------------
//removes percentage based gap
//                Is called by getLocalStorageProperties in codeviewer.js
//----------------------------------------------------------------------------------
function erasePercentGap(templateId, boxValArray)
{
	if(templateId == 1){	
		alignBoxesWidth(boxValArray, 1, 2);
	}else if(templateId == 2){
		alignBoxesHeight2boxes(boxValArray, 1, 2);
	}else if(templateId == 3){
		alignBoxesHeight2boxes(boxValArray, 2, 3);
		alignBoxesWidth3Boxes(boxValArray, 1, 2, 3);
	}else if(templateId == 4){
		alignBoxesWidth(boxValArray, 1, 2);
		alignBoxesHeight3boxes(boxValArray, 1, 2, 3);
	}else if(templateId == 5){
		alignBoxesWidth(boxValArray, 1, 2);
		alignBoxesWidth(boxValArray, 3, 4);
		alignBoxesHeight4boxes(boxValArray, 1, 2);
	}else if(templateId == 6){
		alignWidth4boxes(boxValArray, 1, 2, 3, 4);
		alignBoxesHeight3stack(boxValArray, 2, 3, 4);
	}
}

//----------------------------------------------------------------------------------
//Solves problem of how resizable ui component only work with pixel based positioning.
//                Is called by setLocalStorageProperties in codeviewer.js
//----------------------------------------------------------------------------------
function setResizableToPer(boxValArray)
{
	$("[class ^=ui][class $=resizable]").each(function( index ) {
		var elemWidth =  $(this).width();
		var elemHeight = $(this).height();
		var newWidth = (elemWidth / ($(boxValArray['parent']['id']).width()))* 100;
		var newHeight = (elemHeight / ($(boxValArray['parent']['id']).height())) * 100;
		$(this).height(newHeight + "%");
		$(this).width(newWidth + "%");
	});
}
//----------------------------------------------------------------------------------
// fixQuotedHtml: replace all "<, and >" with "&lt and &gt". This makes sure the 
//				  html tags are not rendered by the browser.	
//                
//----------------------------------------------------------------------------------
function fixQuotedHtml(inString){
	return inString.replace(/\"\<(.*)\>/g, "\"&lt$1&gt");
}
/********************************************************************************

   Markdown, the functions in the next section contains the functions used by
	the markdown parser.

*********************************************************************************/
//----------------------------------------------------------------------------------
// parseMarkdown: Translates markdown symbols to html tags. Uses the javascript
//				  function replace with regular expressions.
//                Is called by returned in codeviewer.js
//----------------------------------------------------------------------------------
function parseMarkdown(inString)
{	
	var removeExtraTagsNumberedList = new RegExp('</ol>' + '\n' + '<ol>', 'g');
	var removeExtraTagsUnorderedList = new RegExp('</ul>' + '\n' + '<ul>', 'g');
	
	//Regular expressions for italics and bold formatting
	inString = inString.replace(/\*{3}(.*?\S)\*{3}/g, '<font style="font-weight:bold; font-style:italic"><em>$1</font>');	
	inString = inString.replace(/\*{2}(.*?\S)\*{2}/g, '<font style="font-weight:bold;">$1</font>');
	inString = inString.replace(/\*{1}(.*?\S)\*{1}/g, '<font style="font-style:italic;">$1</font>');
	inString = inString.replace(/\_{3}(.*?\S)\_{3}/g, '<font style="font-weight:bold; font-style:italic"><em>$1</font>');
	inString = inString.replace(/\_{2}(.*?\S)\_{2}/g, '<font style="font-weight:bold;">$1</font>');	
	inString = inString.replace(/\_{1}(.*?\S)\_{1}/g, '<font style="font-style:italic;">$1</font>');
	
	//Regular expressions for headings
	inString = inString.replace(/^\#{6}\s(.*)=*/gm, '<h6>$1</h6>');
	inString = inString.replace(/^\#{5}\s(.*)=*/gm, '<h5>$1</h5>');
	inString = inString.replace(/^\#{4}\s(.*)=*/gm, '<h4>$1</h4>');
	inString = inString.replace(/^\#{3}\s(.*)=*/gm, '<h3>$1</h3>');
	inString = inString.replace(/^\#{2}\s(.*)=*/gm, '<h2>$1</h2>');
	inString = inString.replace(/^\#{1}\s(.*)=*/gm, '<h1>$1</h1>');
	
	//Regular expressions for lists
	inString = inString.replace(/^\s*\d*\.\s(.*)/gm, '<ol><li>$1</li></ol>');
	inString = inString.replace(removeExtraTagsNumberedList, '');
	inString = inString.replace(/^\s*\-\s(.*)/gm, '<ul><li>$1</li></ul>');
	inString = inString.replace(removeExtraTagsUnorderedList, '');
	
	//Regular expression for line
	inString = inString.replace(/^(\-{3}\n)/gm, '<hr>');
	
	//Regular expression for code blocks
	inString = inString.replace(/~{3}((?:\r|\n|.)+?)\~{3}/gm, '<pre><code>$1</code></pre>');
	
	return inString;
}
//----------------------------------------------------------------------------------
// addHtmlLineBreak: This function will replace all '\n' line breaks in a string
//					 with <br> tags.
//                Is called by returned in codeviewer.js
//----------------------------------------------------------------------------------
function addHtmlLineBreak(inString){
	return inString.replace(/\n/g, '<br>'); 
}
