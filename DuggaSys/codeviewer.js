/********************************************************************************

   Documentation

*********************************************************************************

Execution Order
---------------------
 #1 setup() is first function to be called this then invokes returned() callback through AJAX
 #2 returned() is next function to be called as a callback from setup.

Testing Link:

codeviewer.php?exampleid=1&courseid=1&cvers=45656

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
var courseid;
var exampleid;
var cvers;

/********************************************************************************

   SETUP

*********************************************************************************/

function setup()
{
	try{
		courseid = querystring['courseid'];
		exampleid = querystring['exampleid'];
		cvers = querystring['cvers'];

		AJAXService("EDITEXAMPLE", {
			courseid : courseid,
			exampleid : exampleid,
			cvers : cvers
		}, "CODEVIEW");
	}catch(e){
		alert("Error while setting up: "+e.message)
	}
}

//-----------------------------------------------------------------
// returned: Fetches returned data from all sources
//-----------------------------------------------------------------

function returned(data)
{
	retData=data;

	if(retData['writeaccess'] == "w"){
		document.getElementById('fileedButton').onclick = new Function("navigateTo('/fileed.php','?cid="+courseid+"&coursevers="+cvers+"');");
		document.getElementById('fileedButton').style = "display:table-cell;";
	}

	if(retData['debug']!="NONE!") alert(retData['debug']);

	// Disables before and after button if there are no available example before or after.
	// Works by checking if the current example is last or first in the order of examples.
	//If there are no examples this disables being able to jump through (the non-existsing) examples

	if(retData['before'].length!=0&& retData['after'].length!=0) {
		if (retData['exampleno'] == retData['before'][0][0] || retData['before'].length == 0) {
			$("#beforebutton").css("opacity",0.4);
			$("#beforebutton").css("pointer-events","none");
		}
		if (retData['exampleno'] == retData['after'][0][0] || retData['after'].length == 0) {
			$("#afterbutton").css("opacity",0.4);
			$("#afterbutton").css("pointer-events","none");
		}
	}else if(retData['before'].length==0&& retData['after'].length==0){
		$("#beforebutton").css("opacity",0.4);
		$("#beforebutton").css("pointer-events","none");
		$("#afterbutton").css("opacity",0.4);
		$("#afterbutton").css("pointer-events","none");
	}

  // Disables the play button if there is no playlink
  if(typeof retData['playlink'] == 'undefined' || retData['playlink'] == "" || retData['playlink'] == null) {
    $("#playbutton").css("opacity",0.4);
    $("#playbutton").css("pointer-events","none");
  }else{
    retData['playlink']=retData['playlink'].replace(/\&\#47\;/g,"/");
  }

	// Fill Section Name and Example Name
	var exName= $('#exampleName');
	if(data['examplename'] != null){
		exName.html(data['examplename']);
	}
	var exSection= $('#exampleSection');
	if(data['sectionname'] != null){
		exSection.html(data['sectionname']+"&nbsp;:&nbsp;");
	}

	// User can choose template if no template has been chosen and the user has write access.
	if((retData['templateid'] == 0)){
		if(retData['writeaccess'] == "w"){
			alert("A template has not been chosen for this example. Please choose one.");
			$("#chooseTemplateContainer").css("display","flex");
			return;
		}else{
			alert("The administrator of this code example has not yet chosen a template.");
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
  if(retData['numbox']>retData['box'].length){
      alert("Number of boxes is inconsistent\n"+retData['numbox']+"\n"+retData['box'].length);
  }

  for(var i=0;i<retData['numbox'];i++){
		var contentid="box"+retData['box'][i][0];
		var boxid=retData['box'][i][0];
		var boxtype=retData['box'][i][1].toUpperCase();
		var boxcontent=retData['box'][i][2];
		var boxwordlist=retData['box'][i][3];
		var boxfilename=retData['box'][i][5];
		var boxmenuheight = 0;

		// don't create templatebox if it already exists
		if($("#" + contentid).length == 0){
			addTemplatebox(contentid);
		}

		if(boxtype === "CODE"){
			// Print out code example in a code box
			$("#"+contentid).removeAttr("contenteditable");
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

			// Render code
			rendercode(boxcontent,boxid,boxwordlist,boxfilename);

			// set font size
			$("#box"+boxid).css("font-size", retData['box'][boxid-1][6] + "px");
		}else if(boxtype === "DOCUMENT"){

			// Print out description in a document box
			$("#"+contentid).removeClass("codebox").addClass("descbox");
			var desc = boxcontent;
			desc = replaceAll("&nbsp;"," ",desc);
			desc = parseMarkdown(desc);

			//Change all asterisks to the html code for asterisks
			desc = desc.replace(/\*/g, "&#42;");
			// Highlight important words
			important = retData.impwords;
			for(j=0;j<important.length;j++){
				var sstr="<span id='IWW' class='impword' onmouseout='dehighlightKeyword(\""+important[j]+"\")' onmouseover='highlightKeyword(\""+important[j]+"\")'>"+important[j]+"</span>";
				//Interpret asterisks in important word as literals and not as character with special meaning
				if(important[j].indexOf('*') != -1){
					important[j] = important[j].replace(/\*/g, "&#42;");
				}
				//make sure that not partial words gets highlighted
				var regExp = new RegExp("\\b"+ important[j] + "\\b", "g");
				desc = desc.replace(regExp,sstr);
			}
			//Replace the html code for asterisks with asterisks
			desc = desc.replace(/\&\#42\;/g, "*");

			/* Assign Content */
			$("#"+contentid).html(desc);
			$("#"+contentid).css("margin-top", boxmenuheight);
			createboxmenu(contentid,boxid,boxtype);

				// set font size
				$("#box"+boxid).css("font-size", retData['box'][boxid-1][6] + "px");
				
			// Make room for the menu by setting padding-top equals to height of menubox
			if($("#"+contentid+"menu").height() == null){
				boxmenuheight = 0;
			}else{
				boxmenuheight= $("#"+contentid+"menu").height();
			}
			$("#"+contentid).css("margin-top", boxmenuheight);
		}else if(boxtype === "IFRAME") {
			createboxmenu(contentid,boxid,boxtype);
			$("#"+contentid).removeClass("codebox", "descbox").addClass("framebox");

			// If multiple versions exists use the one with highest priority.
			// cvers BEFORE courseid BEFORE global
			var previewFile = retData['box'][i][5];
			var previewLink = "";

			// Remove html-entitied slashes...
			previewFile=previewFile.replace(/&#47;/g, "/");
			if(previewFile.indexOf("http://")==0||previewFile.indexOf("https://")==0){
					// Preview to external link
					previewLink=previewFile;
			}else{
					previewLink=retData['box'][i][2];;
			}

			if(window.location.protocol === "https:"){
					previewLink=previewLink.replace("http://", "https://");
			}else{
					previewLink=previewLink.replace("https://", "http://");
			}

			$("#box"+boxid).html("<iframe src='"+ previewLink + "'></iframe>");
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

function returnedTitle(data)
{
	// Update title in retData too in order to keep boxtitle and boxtitle2 synced
	retData['box'][retData['box'].length-1][4] = data;
	$("#boxtitle2").text(data);
}

//---------------------------------------------------------------------------------
// This functions convert tabs to "&#9;""
// The indexOf() method returns the position of the first time of a specified value
// (in this example is the search word "\t" which stands for tab) in a string.
// This method returns then -1 if the "search word" does not exist in the string.
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
//                Is called at line 201/204 in codeviewer.php
//---------------------------------------------------------------------------------

var addedWords = [];
var removedWords = [];

function editImpWords(editType)
{
	var word = $("#impword").val();
	var left = 0;
	var right = 0;
	//Check if the word contains an uneven amount of parenthesis
	// * if so do not add the word to important words, it will break the page
	for(var i = 0; i < word.length; i++){
		if(word[i] == '(' ){
			left++;
		}else if (word[i] == ')'){
			right++;
		}
	}
	//If there is an uneven amount set uneven
	var uneven = false;
	if(left != right){
		uneven = true;
	}
	// word can't contain any whitespaces
	if (editType == "+" && word != "" && /\s/.test(word) == false && uneven == false) {
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
//----------------------------------------------------------------------------------

function displayEditExample(boxid)
{
	$("#title").val($('<textarea />').html(retData['examplename']).text());
	$("#secttitle").val($('<textarea />').html(retData['sectionname']).text());
	$("#boxcontent").val(retData['box'][1][1]);
	changeDirectory($("#boxcontent"));
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
	$("#editExampleContainer").css("display","flex");
}

//----------------------------------------------------------------------------------
// updateExample: Updates example data in the database if changed
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

	$("#editExample").css("display","none");
}

//----------------------------------------------------------------------------------
// displayEditContent: Displays the dialogue box for editing a content pane
//                Is called by createboxmenu in codeviewer.js
//----------------------------------------------------------------------------------

var openBoxID;

function displayEditContent(boxid)
{
	$("#boxtitle2").removeAttr("contenteditable");
	// The information stored about the box is fetched
	var box = retData['box'][boxid-1];

	// Keeps track of the currently open box. Used when saving the box content.
	openBoxID = boxid;

	$("#boxtitle").val(box[4]);
	$("#boxcontent").val(box[1]);

	changeDirectory($("#boxcontent"));

	if(box[5]!=null){
			box[5]=box[5].replace(/&#47;/g, "/");
			$("#filename").val(box[5]);
	}else{
			$("#filename").val("");
	}

	$("#fontsize").val(box[6]);

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
	$("#editContentContainer").css("display","flex");
}

//----------------------------------------------------------------------------------
// changeDirectory: Changes the directory in which you choose your code or description
// 					in the Edit Content box.
//----------------------------------------------------------------------------------

function changeDirectory(kind)
{
	var dir;
	var str="";

	var chosen=$("#filename").val();

	if ($(kind).val() == "CODE") {
		dir = retData['directory'][0];
		$('#wordlist').prop('disabled', false);
	}else if($(kind).val() == "IFRAME"){
		dir = retData['directory'][2];
		$('#wordlist').prop('disabled', 'disabled');
	}else if ($(kind).val() == "DOCUMENT") {
		dir = retData['directory'][1];
		$('#wordlist').val('4');
		$('#wordlist').prop('disabled', 'disabled');
	}

	for(var i=0;i<dir.length;i++){
		if(chosen==dir[i].filename){
				str+="<option selected='selected' value='" + dir[i].filename.replace(/'/g, '&apos;') + "'>"+dir[i].filename+"</option>";
				}else{
				str+="<option value='" + dir[i].filename.replace(/'/g, '&apos;') + "'>"+dir[i].filename+"</option>";
		}
	}
	$("#filename").html(str);
	$("#playlink").html(str);
}

//----------------------------------------------------------------------------------
// editImpRows: Adds and removes important rows
//                Is called at line 165/169 in EditorV50.php
//----------------------------------------------------------------------------------

var addedRows = new Array();
var removedRows = new Array();

function editImpRows(editType)
{
	var rowFrom = parseInt($("#improwfrom").val());
	var rowTo = parseInt($("#improwto").val());
	var row = $("#improwfrom").val() + " - " + $("#improwto").val();

	if (editType == "+" &&
	    rowFrom <= rowTo &&
	    rowFrom > 0 &&
	    rowTo > 0)
	   {
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
	}else if (editType == "-") {
		FromTo = $('option:selected', "#improws").text().split(" - ");
		$('option:selected', "#improws").remove();
    	removedRows.push([openBoxID,FromTo[0],FromTo[1]]);
	}else{
		//alert("editType == +: " + (editType=="+") + " (rowFrom <= rowTo): " + (rowFrom <= rowTo) + " (rowFrom > 0): " + (rowFrom > 0) + " (rowTo > 0): " + (rowTo > 0) + " rowFrom: " + rowFrom + " rowTo: " + rowTo);
		alert("Incorrect value(s) (from: "+rowFrom+" to: "+rowTo+")  for important rows!");
	}
}

//----------------------------------------------------------------------------------
// updateContent: Updates the box if changes has been made
//----------------------------------------------------------------------------------

function updateContent()
{
	var box = retData['box'][openBoxID-1];
	var useBoxContent = true;

	// Default to using openbox data and use regular retData as fallback incase it's not open
	if(!box) {
		useBoxContent = false;
		box = retData['box'][retData['box'].length-1];
	}

	// First a check to is done to see if any changes has been made, then the new values are assigned and changed
	// TODO: Handle null values
	if(useBoxContent) {
		if (box[1] != $("#boxcontent").val() || box[3] != $("#wordlist").val() || box[4] != $("#boxtitle").val() || box[5] != $("#filename option:selected").val() || box[6] != $("#fontsize option:selected").val() || addedRows.length > 0 || removedRows.length > 0) {
			try {
				var boxtitle = $("#boxtitle").val();
				var boxcontent = $("#boxcontent option:selected").val();
				var wordlist = $("#wordlist").val();
				var filename = $("#filename option:selected").val();
				var fontsize = $("#fontsize option:selected").val();
				var exampleid = querystring['exampleid'];
				var boxid = box[0];

				AJAXService("EDITCONTENT", {
					exampleid : exampleid,
					boxid : boxid,
					boxtitle : boxtitle,
					boxcontent : boxcontent,
					wordlist : wordlist,
					filename : filename,
					fontsize : fontsize,
					addedRows : addedRows,
					removedRows : removedRows
				}, "BOXCONTENT");

				addedRows = [];
				removedRows = [];
			}catch(e){
				alert("Error when updating content: "+e.message);
			}
			setTimeout("location.reload()", 500);
		}
	} else {
		if(box[4] != $("#boxtitle2").text()) {
			try {
				AJAXService("EDITTITLE", {
					exampleid : querystring['exampleid'],
					boxid : box[0],
					boxtitle : $("#boxtitle2").text()
				}, "BOXTITLE");
			} catch(e) {
				alert("Error when updating content: " + e.message);
			}
		}
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
	if($("#"+contentid+"menu").length == 0){
		var boxmenu = document.createElement("div");
		$("#"+contentid+"wrapper").append(boxmenu);
		boxmenu.setAttribute("class", "buttomenu2 buttomenu2Style");
		boxmenu.setAttribute("id", contentid+"menu");

		// If reader has write access the settings button is shown along with box title
		if(retData['writeaccess'] == "w"){
			if(type=="DOCUMENT"){
				var str = '<table cellspacing="2"><tr>';
				str+="<td class='butto2 editcontentbtn showdesktop codedropbutton' id='settings' title='Edit box settings' onclick='displayEditContent("+boxid+");' ><img src='../Shared/icons/general_settings_button.svg' /></td>";
				str+='<td class="butto2 boxtitlewrap" title="Change box title"><span id="boxtitle2" class="boxtitleEditable">'+retData['box'][boxid-1][4]+'</span></td>';
			}else if(type=="CODE"){
				var str = "<table cellspacing='2'><tr>";
				str+="<td class='butto2 editcontentbtn showdesktop codedropbutton' id='settings' title='Edit box settings' onclick='displayEditContent("+boxid+");' ><img src='../Shared/icons/general_settings_button.svg' /></td>";
				str+='<td class="butto2 boxtitlewrap" title="Change box title"><span id="boxtitle2" class="boxtitleEditable" contenteditable="true" onblur="updateContent();">'+retData['box'][boxid-1][4]+'</span></td>';
			}else if(type=="IFRAME"){
				var str = '<table cellspacing="2"><tr>';
				str+="<td class='butto2 editcontentbtn showdesktop codedropbutton' id='settings' title='Edit box settings' onclick='displayEditContent("+boxid+");' ><img src='../Shared/icons/general_settings_button.svg' /></td>";
				str+='<td class="butto2 boxtitlewrap" title="Change box title"><span id="boxtitle2" class="boxtitleEditable">'+retData['box'][boxid-1][4]+'</span></td>';
			}else{
				var str = "<table cellspacing='2'><tr>";
				str+="<td class='butto2 showdesktop'>";
				str+="<select class='chooseContentSelect' onchange='changeboxcontent(this.value,\""+boxid+"\",\""+contentid+"\");removeboxmenu(\""+contentid+"menu\");'>";
				str+="<option>Choose content</option>";
				str+="<option value='CODE'>Code example</option>";
				str+="<option value='DOCUMENT'>Description section</option>";
				str+="</select>";
				str+='</td>';
			}
		// If reader doesn't have write access, only the boxtitle is shown
		}else{
			var str = '<table cellspacing="2"><tr>';
			str+= '<td class="boxtitlewrap"><span class="boxtitle">'+retData['box'][boxid-1][4]+'</span></td>';
		}
		if(type=="CODE"){
			str+="<td class='butto2 copybutton' id='copyClipboard' title='Copy to clipboard' onclick='copyCodeToClipboard("+boxid+");' ><img id='copyIcon' src='../Shared/icons/Copy.svg' /></td>";
		}
		str+='</tr></table>';
		boxmenu.innerHTML=str;
		$(boxmenu).click(function(event){
			if($(window).width() <=1100){
				toggleClass($("#"+boxmenu.parentNode.id).attr("id"));
			}
		});
	}
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
	drop = $("#"+dropid);
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

});

document.addEventListener("drop", function(e) {
    // cancel drop
    e.preventDefault();
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
	var dropd= $("#"+dname);
	if(dropd!=null) dropd.style.display="none";
}

//----------------------------------------------------------------------------------
// Switches Dropdown List to Visible
//				Is never used, code is kept for future use
//----------------------------------------------------------------------------------

function switchDrop(dname)
{
	var dropd=$("#"+dname);
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
	var dropd=$("#"+dname);
	if(dropd.style.display=="block"){
		return true;
	}else{
		return false;
	}
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

function token (kind,val,fromchar,tochar,row)
{
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
	instring = replaceAll("&amp;","&",instring);
	instring = replaceAll("&#9;"," ",instring);

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
			if (currentCharacter=='#') {
				for (var j = 0; j <= 6; j++) {
					if ((currentCharacter >= '0' || currentCharacter <= '9') || (currentCharacter >= 'a' || currentCharacter <= 'f') || (currentCharacter >= 'A' || currentCharacter <= 'F')) {
						i++;
						currentStr+=currentCharacter;
						currentCharacter=instring.charAt(i);
					}
					else {
						break;
					}
				}
				i++;
				currentStr+=currentCharacter;
				currentCharacter=instring.charAt(i);

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

		}else if(currentCharacter == '<' && instring.charAt(i+1)=='!' && instring.charAt(i+2)=='-' && instring.charAt(i+3)=='-'){ // Comment of <!-- type
			i++;
			currentStr = currentCharacter;
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
//	Function to change the popoverbox for different html tags
//	The case name is the name of the html tag
//----------------------------------------------------------------------------------

function popoverbox(titleData)
{
	var popoverMessage = "test";
	if(titleData=="html"){
        popoverMessage = "Defines the root of an HTML document";
	}else if(titleData=="head"){
        popoverMessage = "Defines information about the document";
	}else if(titleData=="body"){
        popoverMessage = "Defines the document's body";
	}else if(titleData=="div"){
        popoverMessage = "Defines a section in a document";
	}else if(titleData=="span"){
        popoverMessage = "Defines a section in a document";
	}else if(titleData=="doctype"){
        popoverMessage = "An instruction to the web browser about what version of HTML the page is written in";
	}else if(titleData==""){
        popoverMessage = "";
	}

	return popoverMessage;
}

//----------------------------------------------------------------------------------
// Renders a set of tokens from a string into a code viewer div
// Requires tokens created by a cockford-type tokenizer
//                Is called by [this function] in [this file]
//----------------------------------------------------------------------------------

function rendercode(codestring,boxid,wordlistid,boxfilename)
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
	printout= $("#"+destinationdiv);
	str="";
	cont="";
	lineno=0;
	str+="<div id='notification" + boxid + "' class='copy-notification'><img src='../Shared/icons/Copy.svg' />Copied To Clipboard</div>";
	str+="<div class='normtextwrapper'>";

	pcount=0;
	parenthesis=new Array();
	bcount=0;
	bracket=new Array();
	cbcount=0;
	cbracket=new Array();

	htmlArray=new Array('html', 'head', 'body', 'div', 'span', 'doctype', 'title', 'link', 'meta', 'style', 'canvas', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'abbr', 'acronym', 'address', 'bdo', 'blockquote', 'cite', 'q', 'code', 'ins', 'del', 'dfn', 'kbd', 'pre', 'samp', 'var', 'br', 'a', 'base', 'img', 'area', 'map', 'object', 'param', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot', 'col', 'colgroup', 'caption', 'form', 'input', 'textarea', 'select', 'option', 'optgroup', 'button', 'label', 'fieldset', 'legend', 'script', 'noscript', 'b', 'i', 'tt', 'sub', 'sup', 'big', 'small', 'hr','relativelayout','textview','webview','manifest','uses','permission','application','activity','intent');
	htmlArrayNoSlash= new Array('area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source','textview','webview','uses');
	cssArray= new Array('accelerator', 'azimuth', 'background', 'background-attachment', 'background-color', 'background-image', 'background-position', 'background-position-x', 'background-position-y', 'background-repeat', 'behavior', 'border', 'border-bottom', 'border-bottom-color', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color', 'border-left', 'border-left-color', 'border-left-style', 'border-left-width', 'border-right',
						'border-right-color', 'border-right-style', 'border-right-width', 'border-spacing', 'border-style', 'border-top', 'border-top-color', 'border-top-style', 'border-top-width', 'border-width', 'bottom', 'caption-side', 'clear', 'clip', 'color', 'content', 'counter-increment', 'counter-reset', 'cue', 'cue-after', 'cue-before', 'cursor', 'direction', 'display', 'elevation', 'empty-cells', 'filter', 'float', 'font', 'font-family', 'font-size',
						'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'height', 'ime-mode', 'include-source', 'layer-background-color', 'layer-background-image', 'layout-flow', 'layout-grid', 'layout-grid-char', 'layout-grid-char-spacing', 'layout-grid-line', 'layout-grid-mode', 'layout-grid-type', 'left', 'letter-spacing', 'line-break', 'line-height', 'list-style', 'list-style-image', 'list-style-position', 'list-style-type', 'margin',
						'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'marker-offset', 'marks', 'max-height', 'max-width', 'min-height', 'min-width', '-moz-binding', '-moz-border-radius', '-moz-border-radius-topleft', '-moz-border-radius-topright', '-moz-border-radius-bottomright', '-moz-border-radius-bottomleft', '-moz-border-top-colors', '-moz-border-right-colors', '-moz-border-bottom-colors', '-moz-border-left-colors', '-moz-opacity', '-moz-outline',
						'-moz-outline-color', '-moz-outline-style', '-moz-outline-width' ,'-moz-user-focus' ,'-moz-user-input', '-moz-user-modify', '-moz-user-select', 'orphans', 'outline', 'outline-color', 'outline-style', 'outline-width', 'overflow', 'overflow-X', 'overflow-Y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'page', 'page-break-after', 'page-break-before', 'page-break-inside', 'pause', 'pause-after', 'pause-before', 'pitch',
						'pitch-range','play-during', 'position', 'quotes', '-replace', 'richness', 'right', 'ruby-align', 'ruby-overhang', 'ruby-position', '-set-link-source', 'size', 'speak', 'speak-header', 'speak-numeral', 'speak-punctuation', 'speech-rate', 'stress', 'scrollbar-arrow-color', 'scrollbar-base-color', 'scrollbar-dark-shadow-color', 'scrollbar-face-color', 'scrollbar-highlight-color', 'scrollbar-shadow-color', 'scrollbar-3d-light-color', 'scrollbar-track-color',
						'table-layout', 'text-align', 'text-align-last', 'text-decoration', 'text-indent', 'text-justify', 'text-overflow', 'text-shadow', 'text-transform', 'text-autospace', 'text-kashida-space', 'text-underline-position', 'top', 'unicode-bidi', '-use-link-source', 'vertical-align', 'visibility', 'voice-family', 'volume', 'white-space', 'widows', 'width', 'word-break', 'z-index', 'zoom', 'word-spacing', 'word-wrap', 'writing-mode');
	var cssTagCount=0;
	var htmlTagCount=0;

	htmlTag=new Array();
	cssTag=new Array();

	//html part
	pid="";
	var iwcounter=0;
	for(i=0;i<tokens.length;i++){
		tokenvalue=String(tokens[i].val);

		if(tokens[i].kind=="rowcomment"||tokens[i].kind=="blockcomment"||tokens[i].kind=="string"||tokens[i].kind=="number"||tokens[i].kind=="name"){
				// Fix to remove html tags in strings
				tokenvalue = tokenvalue.replace(/&/g,"&amp;");
				tokenvalue = tokenvalue.replace(/\</g, "&lt;");
				tokenvalue = tokenvalue.replace(/\>/g, "&gt;");
		}
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
				tokenvalue="&lt;";
				if(isNumber(tokens[i+1].val) == false && tokens[i+1].val != "/" && tokens[i+1].val != "!" && tokens[i+1].val != "?"){
					if(htmlArray.indexOf(tokens[i+1].val.toLowerCase()) > -1){
						var k = 2;
						var foundEnd = false;

						//If a > has been found on the same line as an < and the token to the left of < is in htmlArray then it classes it as an html-tag
						while(i+k<tokens.length){
								if(tokens[i+k].val == ">"){
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
							cont+="&lt"+"<span id='"+pid+"' class='oper' onmouseover='highlightHtml(\"P"+pid+"\",\""+pid+"\");' onmouseout='deHighlightHtml(\"P"+pid+"\",\""+pid+"\");'>"+ tokens[i+1].val;
							cont+="</span>";
							i=i+1;
						}else{
							cont+="<span class='oper'>"+tokenvalue+"</span>";
						}
					}else{
							cont+="<span class='oper'>"+tokenvalue+"</span>";
					}
				}else if(tokens[i+1].val=="/"){
						if(htmlArray.indexOf(tokens[i+2].val.toLowerCase()) > -1){
							if(htmlArrayNoSlash.indexOf(tokens[i+1].val.toLowerCase()) == -1){
								pid=htmlTag.pop();
							}else{
								htmlTagCount++;
								pid="html"+htmlTagCount+boxid;
							}
							cont+="&lt"+tokens[i+1].val +"<span id='P"+pid+"' class='oper' onmouseover='highlightHtml(\""+pid+"\",\"P"+pid+"\");' onmouseout='deHighlightHtml(\""+pid+"\",\"P"+pid+"\");'>"+ tokens[i+2].val +"</span>" +tokens[i+3].val;
							i = i+3;
						}else{
								cont+="<span class='oper'>"+tokenvalue+"</span>";
						}
				}else{
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
			// Help empty lines to be printed out
      //console.log("C:"+cont);
			if(cont=="") cont="&nbsp;";
			// Count how many linenumbers that'll be needed
			lineno++;
			// Print out normal rows if no important exists
			if(improws.length==0){
				str+="<div id='"+boxfilename+"-line"+lineno+"' class='normtext'>"+cont+"</div>";
			}else{
				// Print out important lines
				for(var kp=0;kp<improws.length;kp++){
					if(lineno>=parseInt(improws[kp][1])&&lineno<=parseInt(improws[kp][2])){
						str+="<div id='"+boxfilename+"-line"+lineno+"' class='impo'>"+cont+"</div>";
						break;
					}else{
						if(kp == (improws.length-1)){
							str+="<div id='"+boxfilename+"-line"+lineno+"' class='normtext'>"+cont+"</div>";
						}
					}
				}
			}
			cont="";
		}
	}
	str+="</div>";

	// Print out rendered code and border with numbers
	printout.html(createCodeborder(lineno,improws) + str);

	//css part
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
			if(tokenvalue=="{"){
				pid="CBR"+cbcount+boxid;
				cbcount++;
				cbracket.push(pid);
				cont+="<span id='"+pid+"' class='oper' onmouseover='highlightop(\"P"+pid+"\",\""+pid+"\");' onmouseout='dehighlightop(\"P"+pid+"\",\""+pid+"\");'>"+tokenvalue+"</span>";
			}else if(tokenvalue=="}"){
				pid=cbracket.pop();
				cont+="<span id='P"+pid+"' class='oper' onmouseover='highlightop(\""+pid+"\",\"P"+pid+"\");' onmouseout='dehighlightop(\""+pid+"\",\"P"+pid+"\");'>"+tokenvalue+"</span>";
			}else if(tokenvalue=="<"){
				// This statement checks the character after < to make sure it is a valid tag.
				tokenvalue="&lt;";
				if(isNumber(tokens[i+1].val) == false && tokens[i+1].val != "/" && tokens[i+1].val != "!" && tokens[i+1].val != "?"){
					if(cssArray.indexOf(tokens[i+1].val.toLowerCase()) > -1){
						var k = 2;
						var foundEnd = false;

						//If a > has been found on the same line as an < and the token to the left of < is in htmlArray then it classes it as an html-tag
						while(i+k<tokens.length){
								if(tokens[i+k].val == ">"){
									foundEnd = true;
									break;
								}
								k++;
						}

						if(foundEnd){
							pid="css"+cssTagCount+boxid;
							cssTagCount++;
							if(cssArray.indexOf(tokens[i+1].val.toLowerCase()) == -1){
								cssTag.push(pid);
							}
							cont+="&lt"+"<span id='"+pid+"' class='oper' onmouseover='highlightCss(\"P"+pid+"\",\""+pid+"\");' onmouseout='deHighlightCss(\"P"+pid+"\",\""+pid+"\");'>"+ tokens[i+1].val;
							cont+="</span>";
							i=i+1;
						}else{
							cont+="<span class='oper'>"+tokenvalue+"</span>";
						}
					}else{
							cont+="<span class='oper'>"+tokenvalue+"</span>";
					}
				}else if(tokens[i+1].val=="/"){
						if(cssArray.indexOf(tokens[i+2].val.toLowerCase()) > -1){
							if(cssArray.indexOf(tokens[i+1].val.toLowerCase()) == -1){
								pid=cssTag.pop();
							}else{
								cssTagCount++;
								pid="css"+cssTagCount+boxid;
							}
							cont+="&lt"+tokens[i+1].val +"<span id='P"+pid+"' class='oper' onmouseover='highlightHtml(\""+pid+"\",\"P"+pid+"\");' onmouseout='deHighlightHtml(\""+pid+"\",\"P"+pid+"\");'>"+ tokens[i+2].val +"</span>" +tokens[i+3].val;
							i = i+3;
						}else{
								cont+="<span class='oper'>"+tokenvalue+"</span>";
						}
				}else{
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
			// Help empty lines to be printed out
			if(cont=="") cont="&nbsp;";
			// Count how many linenumbers that'll be needed
			lineno++;
			// Print out normal rows if no important exists
			if(improws.length==0){
				str+="<div id='"+boxfilename+"-line"+lineno+"' class='normtext'>"+cont+"</div>";
			}else{
				// Print out important lines
				for(var kp=0;kp<improws.length;kp++){
					if(lineno>=parseInt(improws[kp][1])&&lineno<=parseInt(improws[kp][2])){
						str+="<div id='"+boxfilename+"-line"+lineno+"' class='impo'>"+cont+"</div>";
						break;
					}else{
						if(kp == (improws.length-1)){
							str+="<div id='"+boxfilename+"-line"+lineno+"' class='normtext'>"+cont+"</div>";
						}
					}
				}
			}
			cont="";
		}
	}
	str+="</div>";

	// Print out rendered code and border with numbers
	printout.css(createCodeborder(lineno,improws) + str);
}

//----------------------------------------------------------------------------------
// createCodeborder: function to create a border with line numbers
//                Is called by rendercode in codeviewer.js
//----------------------------------------------------------------------------------

function createCodeborder(lineno,improws)
{
	var str="<div class='codeborder' style='z-index: 1;'>";		// The z-index places the code border above the copy to clipboard notification

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
	$("#chooseTemplateContainer").css("display","none");
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
	// setTimeout("location.reload()", 500);
}

//----------------------------------------------------------------------------------
// closeEditContent:
//                Is called at line 141 in EditorV50.php
//----------------------------------------------------------------------------------

function closeEditContent()
{
	$("#boxtitle2").attr("contenteditable", true);
	$("#editContentContainer").css("display","none");
	openBoxID = null;
}

//----------------------------------------------------------------------------------
// closeEditExample:
//                Is called at line 183 in EditorV50.php
//----------------------------------------------------------------------------------

function closeEditExample()
{
	$("#editExampleContainer").css("display","none");
}

//----------------------------------------------------------------------------------
// openTemplateWindow:
//                Is called at line 53 in EditorV50.php
//----------------------------------------------------------------------------------

function openTemplateWindow()
{
	$("#chooseTemplateContainer").css("display","flex");
}

//----------------------------------------------------------------------------------
// closeTemplateWindow:
//                Is called at line 218 in EditorV50.php
//----------------------------------------------------------------------------------

function closeTemplateWindow()
{
	$("#chooseTemplateContainer").css("display","none");
}

//----------------------------------------------------------------------------------
// Play:
//					Is called at line 195 in EditorV50.php and line 56 in navheader.php
//----------------------------------------------------------------------------------

function Play(event)
{
	if(retData['playlink']!=null){
		if(retData['playlink'].indexOf("http")==0){
				window.location.href=retData['playlink'];
		}else{
				var urlText = "";
				if(retData['public'] === "1") {
					urlText = "global/" + retData['playlink'];
                }
                else{
					urlText = retData['courseid'] + "/" + retData['playlink'];
				}
				//current url for the page
				surl=window.location.href;
				//relative path
				var prefix = "/../courses/";
				surl= surl.substring(0 ,surl.lastIndexOf("/"));
				var win = window.open(surl + prefix + urlText, '_blank');
				win.focus();

        }
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

	if (templateId == 1) {
		getLocalStorageProperties(templateId, boxValArray);

		$(boxValArray['box1']['id']).resizable({
			containment: parent,
			handles: "e",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesWidth(boxValArray, 1, 2);
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
	} else if (templateId == 2) {
		getLocalStorageProperties(templateId, boxValArray);

		$(boxValArray['box1']['id']).resizable({
			containment: parent,
			handles: "s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesHeight2boxes(boxValArray, 1, 2);
				$(boxValArray['box1']['id']).width("100%");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
	} else if (templateId == 3) {
		getLocalStorageProperties(templateId, boxValArray);

		$(boxValArray['box1']['id']).resizable({
			containment: parent,
			handles: "e",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesWidth3Boxes(boxValArray, 1, 2, 3);
				$("#box2wrapper").css("left", "");
				$("#box1wrapper").css("height", "100%");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});

		$(boxValArray['box2']['id']).resizable({
			containment: parent,
			handles: "s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesHeight2boxes(boxValArray, 2, 3);
				$(boxValArray['box2']['id']).css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
	} else if (templateId == 4) {
		getLocalStorageProperties(templateId, boxValArray);

		$(boxValArray['box1']['id']).resizable({
			containment: parent,
			handles: "e,s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesWidth(boxValArray, 1, 2);
				alignBoxesHeight3boxes(boxValArray, 1, 2, 3);
				$("#box2wrapper").css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});

		$(boxValArray['box2']['id']).resizable({
			containment: parent,
			handles: "s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesHeight3boxes(boxValArray, 2, 1, 3);
				alignBoxesWidth(boxValArray, 2, 1);
				$("#box2wrapper").css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
	} else if (templateId == 5) {
		getLocalStorageProperties(templateId, boxValArray);

		$(boxValArray['box1']['id']).resizable({
			containment: parent,
			handles: "e,s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesWidth(boxValArray, 1, 2);
				alignBoxesHeight4boxes(boxValArray, 1, 2);
				$("#box2wrapper").css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});

		$(boxValArray['box2']['id']).resizable({
			containment: parent,
			handles: "s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesHeight4boxes(boxValArray, 2, 1);
				$("#box2wrapper").css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});

		$(boxValArray['box3']['id']).resizable({
			containment: parent,
			handles: "e",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesWidth(boxValArray, 3, 4);
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
	} else if (templateId == 6) {

		getLocalStorageProperties(templateId, boxValArray);
		$("#box3wrapper").css("top", localStorage.getItem("template6box2heightPercent") + "%");


		$(boxValArray['box1']['id']).resizable({
			containment: parent,
			handles: "e",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignWidth4boxes(boxValArray, 1, 2, 3, 4);
				$(boxValArray['box1']['id']).height(100 + "%");

			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});

		$(boxValArray['box2']['id']).resizable({
			containment: parent,
			handles: "s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
					alignBoxesHeight3stack(boxValArray, 2, 3, 4);
					$(boxValArray['box3']['id']).css("left", " ");
					$(boxValArray['box2']['id']).css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});

		$(boxValArray['box3']['id']).resizable({
			containment: parent,
			handles: "s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				$(boxValArray['box4']['id']).css("top", " ");
				alignBoxesHeight3stackLower(boxValArray, 2, 3, 4);
			},
			stop: function(e, ui) {
				$(boxValArray['box4']['id']).css("top", " ");
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
	} else if (templateId == 7) {
		getLocalStorageProperties(templateId, boxValArray);
		$("#box3wrapper").css("top", localStorage.getItem("template7box2heightPercent") + "%");

		$(boxValArray['box2']['id']).resizable({
			containment: parent,
			handles: "s,e",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesHeight3stack(boxValArray, 2, 3, 4);
				alignWidthTemplate7(boxValArray, 2, 3, 4, 1);
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
		$(boxValArray['box3']['id']).resizable({
			containment: parent,
			handles: "s,e",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesHeight3stackLower(boxValArray, 2, 3, 4);
				alignWidthTemplate7(boxValArray, 3, 2, 4, 1);
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
		$(boxValArray['box4']['id']).resizable({
			containment: parent,
			handles: "e",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				$(boxValArray['box4']['id']).css("top", " ");
				alignBoxesHeight3stackLower(boxValArray, 2, 3, 4);
				alignWidthTemplate7(boxValArray, 4, 3, 2, 1);
			},
			stop: function(e, ui) {
				$(boxValArray['box4']['id']).css("top", " ");
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
	} else if (templateId == 8) {
		getLocalStorageProperties(templateId, boxValArray);

		$(boxValArray['box2']['id']).resizable({
			containment: parent,
			handles: "e, s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesHeight2boxes(boxValArray, 2, 3);
				alignBoxesWidthTemplate8(boxValArray, 2, 3, 1);
				$(boxValArray['box2']['id']).css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
		$(boxValArray['box3']['id']).resizable({
			containment: parent,
			handles: "e, s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignBoxesHeight2boxes(boxValArray, 2, 3);
				alignBoxesWidthTemplate8(boxValArray, 3, 2, 1);
				$(boxValArray['box2']['id']).css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
	} else if(templateId == 9) {
		getLocalStorageProperties(templateId, boxValArray);


		$(boxValArray['box1']['id']).resizable({
			containment: parent,
			handles: "e",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignTemplate9Width(boxValArray, 1, 2, 3, 4, 5);
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});

		$(boxValArray['box2']['id']).resizable({
			containment: parent,
			handles: "s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignTemplate9Height(boxValArray, 2, 3, 4, 5);
				$(boxValArray['box2']['id']).css("left", " ");
				$(boxValArray['box3']['id']).css("left", " ");
				$(boxValArray['box4']['id']).css("left", " ");
				$(boxValArray['box5']['id']).css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});

		$(boxValArray['box3']['id']).resizable({
			containment: parent,
			handles: "s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignTemplate9Height3Stack(boxValArray, 2, 3, 4, 5);
				$(boxValArray['box2']['id']).css("left", " ");
				$(boxValArray['box3']['id']).css("left", " ");
				$(boxValArray['box4']['id']).css("left", " ");
				$(boxValArray['box5']['id']).css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
		$(boxValArray['box4']['id']).resizable({
			containment: parent,
			handles: "s",
			start: function(event, ui) {
				$('iframe').css('pointer-events','none');
			},
			resize: function(e, ui){
				alignTemplate9Height2Stack(boxValArray, 2, 3, 4, 5);
				$(boxValArray['box2']['id']).css("left", " ");
				$(boxValArray['box3']['id']).css("left", " ");
				$(boxValArray['box4']['id']).css("left", " ");
				$(boxValArray['box5']['id']).css("left", " ");
			},
			stop: function(e, ui) {
				setLocalStorageProperties(templateId, boxValArray);
				$('iframe').css('pointer-events','auto');
			}
		});
	}
  else if (templateId == 10) {
    getLocalStorageProperties(templateId, boxValArray);

    $(boxValArray['box1']['id']).resizable({
      containment: parent,
      handles: "e",
      start: function(event, ui) {
        $('iframe').css('pointer-events','none');
      },
      resize: function(e, ui){
        alignBoxesWidth(boxValArray, 1);
      },
      stop: function(e, ui) {
        setLocalStorageProperties(templateId, boxValArray);
        $('iframe').css('pointer-events','auto');
      }
    });
  }
};

//----------------------------------------------------------------------------------
//width adjustment for template 1, 4 and 8 (Two boxes beside eachother.)
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
//width adjustment for template 3 & 8.
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
function alignBoxesWidthTemplate8(boxValArray, boxNumBase, boxNumAlign, boxNumAlignSecond)
{
	var remainWidth = boxValArray['parent']['width'] - $(boxValArray['box' + boxNumBase]['id']).width();
	var remainWidthPer = (remainWidth / boxValArray['parent']['width'])*100;
	var basePer = 100 - remainWidthPer;

	$(boxValArray['box' + boxNumBase]['id']).width(basePer + "%");
	$(boxValArray['box' + boxNumAlign]['id']).width(basePer + "%");
	//Corrects bug that sets left property on boxNumAlign. Forces it to have left property turned off. Also forced a top property on boxNumBase.

	//$(boxValArray['box' + boxNumAlign]['id']).width(remainWidthPer + "%");
	$(boxValArray['box' + boxNumAlignSecond]['id']).width(remainWidthPer + "%");

	boxValArray['box' + boxNumBase]['width'] = $(boxValArray['box' + boxNumBase]['id']).width();
	boxValArray['box' + boxNumAlign]['width'] = $(boxValArray['box' + boxNumBase]['id']).width();
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

//---------------------------------
// WIDTH MEASURMENT FOR TEMPLATE 6
//---------------------------------

function alignWidth4boxes(boxValArray, boxNumBase, boxNumAlign, boxNumAlignSecond, boxNumAlignThird)
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
	$(boxValArray['box' + boxNumAlignThird]['id']).width(remainWidthPer + "%");

	boxValArray['box' + boxNumBase]['width'] = $(boxValArray['box' + boxNumBase]['id']).width();
	boxValArray['box' + boxNumAlign]['width'] = $(boxValArray['box' + boxNumAlign]['id']).width();
	boxValArray['box' + boxNumAlignSecond]['width'] = $(boxValArray['box' + boxNumAlignSecond]['id']).width();
	boxValArray['box' + boxNumAlignThird]['width'] = $(boxValArray['box' + boxNumAlignThird]['id']).width();

}

//-----------------------------------
// WIDTH MEASURMENT FOR TEMPLATE 7
//-----------------------------------


function alignWidthTemplate7(boxValArray, boxNumBase, boxNumAlign, boxNumAlignSecond, boxNumAlignThird)
{
	var remainWidth = boxValArray['parent']['width'] - $(boxValArray['box' + boxNumBase]['id']).width();
	var remainWidthPer = (remainWidth / boxValArray['parent']['width'])*100;
	var basePer = 100 - remainWidthPer;

	$(boxValArray['box' + boxNumBase]['id']).width(basePer + "%");
	$(boxValArray['box' + boxNumAlign]['id']).width(basePer + "%");
	$(boxValArray['box' + boxNumAlignSecond]['id']).width(basePer + "%");
	//Corrects bug that sets left property on boxNumAlign. Forces it to have left property turned off. Also forced a top property on boxNumBase.
	$(boxValArray['box' + boxNumAlign]['id']).css("right", " ");
	$(boxValArray['box' + boxNumAlignThird]['id']).width(remainWidthPer + "%");

	boxValArray['box' + boxNumBase]['width'] = $(boxValArray['box' + boxNumBase]['id']).width();
	boxValArray['box' + boxNumAlign]['width'] = $(boxValArray['box' + boxNumBase]['id']).width();
	boxValArray['box' + boxNumAlignSecond]['width'] = $(boxValArray['box' + boxNumBase]['id']).width();
	boxValArray['box' + boxNumAlignThird]['width'] = $(boxValArray['box' + boxNumAlignThird]['id']).width();
}

//---------------------------------------
// HEIGHT MEASURMENT FOR TEMPLATE 6 & 7
//---------------------------------------

function alignBoxesHeight3stack(boxValArray, boxNumBase, boxNumAlign, boxNumAlignSecond)
{

	//Get initial values.
	var remainHeight = boxValArray['parent']['height'] - ($(boxValArray['box' + boxNumBase]['id']).height() + $(boxValArray['box' + boxNumAlignSecond]['id']).height());
	var remainHeightPer = (remainHeight/boxValArray['parent']['height'])*100;
	var alignSecondPer = ($(boxValArray['box' + boxNumAlignSecond]['id']).height() / boxValArray['parent']['height'])*100;
	var basePer = 100-(remainHeightPer + alignSecondPer);
	var atry = boxValArray['parent']['height'] - ($(boxValArray['box' + boxNumBase]['id']).height() + $(boxValArray['box' + boxNumAlign]['id']).height());
	var atry2 = (atry/boxValArray['parent']['height'])*100;

	if (remainHeightPer <= 10) {
			atry = boxValArray['parent']['height'] - ($(boxValArray['box' + boxNumBase]['id']).height() + $(boxValArray['box' + boxNumAlign]['id']).height());
			atry2 = (atry/boxValArray['parent']['height'])*100;
			remainHeightPer = 10;
			$(boxValArray['box' + boxNumAlign]['id']).css("height", remainHeightPer + "%");
			$(boxValArray['box' + boxNumAlign]['id']).css("top", basePer + "%");
			$(boxValArray['box' + boxNumAlignSecond]['id']).css("height", atry2 + "%");
			$(boxValArray['box' + boxNumBase]['id']).css("height", basePer + "%");
	} else {
			$(boxValArray['box' + boxNumAlign]['id']).css("height", remainHeightPer + "%");
			$(boxValArray['box' + boxNumAlign]['id']).css("top", basePer + "%");
			$(boxValArray['box' + boxNumBase]['id']).css("height", basePer + "%");
	}

	//Update array
	boxValArray['box' + boxNumBase]['height'] = $(boxValArray['box' + boxNumBase]['id']).height();
	boxValArray['box' + boxNumAlign]['height'] = $(boxValArray['box' + boxNumAlign]['id']).height();
	boxValArray['box' + boxNumAlignSecond]['height'] = $(boxValArray['box' + boxNumAlignSecond]['id']).height();
}

//----------------------------------
// HEIGHT MEASURMENT FOR TEMPLATE 6
//----------------------------------

function alignBoxesHeight3stackLower(boxValArray, boxNumBase, boxNumAlign, boxNumAlignSecond)
{
	var remainHeight = boxValArray['parent']['height'] - ($(boxValArray['box' + boxNumBase]['id']).height() + $(boxValArray['box' + boxNumAlignSecond]['id']).height());
	var remainHeightPer = (remainHeight/boxValArray['parent']['height'])*100;
	var alignSecondPer = ($(boxValArray['box' + boxNumAlignSecond]['id']).height() / boxValArray['parent']['height'])*100;
	var basePer = 100-(remainHeightPer + alignSecondPer);
	var atry = boxValArray['parent']['height'] - ($(boxValArray['box' + boxNumBase]['id']).height() + $(boxValArray['box' + boxNumAlign]['id']).height());
	var atry2 = (atry/boxValArray['parent']['height'])*100;

	if (atry2 <= 10) {
		$("#box3wrapper").css({"top": basePer + "%","height": remainHeightPer + "%"});
	 } else {
		$("#box4wrapper").height(atry2 + "%");
		$("#box3wrapper").css({"top": basePer + "%", "height": remainHeightPer + "%", "left": " "});
	}
}

//----------------------------------
// WIDTH MEASURMENT FOR TEMPLATE 9
//----------------------------------

function alignTemplate9Width(boxValArray, boxOne, boxTwo, boxThree, boxFour, boxFive)
{

	//Width for the four smaller boxes.
	var remainWidth = boxValArray['parent']['width'] - $(boxValArray['box' + boxOne]['id']).width();
	var remainWidthPer = (remainWidth / boxValArray['parent']['width'])*100;

	//Width for the left big box.
	var basePer = 100 - remainWidthPer;

	$(boxValArray['box' + boxOne]['id']).width(basePer + "%");
	//Corrects bug that sets left property on boxTwo, three and four. Forces it to have left property turned off. Also forced a top property on boxOne.
	$(boxValArray['box' + boxTwo]['id']).css("left", " ");
	$(boxValArray['box' + boxThree]['id']).css("left", " ");
	$(boxValArray['box' + boxFour]['id']).css("left", " ");
	$(boxValArray['box' + boxOne]['id']).css("top", " ");

	//Sets width for all boxes.
	$(boxValArray['box' + boxTwo]['id']).width(remainWidthPer + "%");
	$(boxValArray['box' + boxThree]['id']).width(remainWidthPer + "%");
	$(boxValArray['box' + boxFour]['id']).width(remainWidthPer + "%");
	$(boxValArray['box' + boxFive]['id']).width(remainWidthPer + "%");

	//Updates array.
	boxValArray['box' + boxOne]['width'] = $(boxValArray['box' + boxOne]['id']).width();
	boxValArray['box' + boxTwo]['width'] = $(boxValArray['box' + boxTwo]['id']).width();
	boxValArray['box' + boxThree]['width'] = $(boxValArray['box' + boxThree]['id']).width();
	boxValArray['box' + boxFour]['width'] = $(boxValArray['box' + boxFour]['id']).width();
	boxValArray['box' + boxFive]['width'] = $(boxValArray['box' + boxFive]['id']).width();
}

//-----------------------------------
// HEIGHT MEASURMENT FOR TEMPLATE 9
//-----------------------------------

function alignTemplate9Height(boxValArray, boxOne, boxTwo, boxThree, boxFour)
{

	//Height of the two boxes between boxOne and boxFour (top most box and bottom most box)
	var remainHeight = boxValArray['parent']['height'] - ($(boxValArray['box' + boxOne]['id']).height() + $(boxValArray['box' + boxFour]['id']).height());
	var remainHeightPer = (remainHeight/boxValArray['parent']['height'])*100;

	//fourth and third box height in percent.
	var boxThreeHeightPer = ($(boxValArray['box' + boxThree]['id']).height() / boxValArray['parent']['height'])*100;
	var boxFourHeightPer = ($(boxValArray['box' + boxFour]['id']).height() / boxValArray['parent']['height'])*100;

	//The second and first box height in percent.
	var boxTwoHeightPer = (remainHeightPer - boxThreeHeightPer);
	var boxOneHeightPer = 100-(remainHeightPer + boxFourHeightPer);

	//Set values if the boxes reaches minimum height.
	if (boxTwoHeightPer <= 10 && boxThreeHeightPer <= 10) {
		boxTwoHeightPer = 10;
		boxThreeHeightPer = 10;
		remainHeightPer = 20;

	} else if (boxTwoHeightPer <= 10) {
		boxTwoHeightPer = 10;

	} else if (boxThreeHeightPer <= 10) {
		boxThreeHeightPer = 10;

	}

	//Set height and top on the boxes
	$(boxValArray['box' + boxOne]['id']).css("height", boxOneHeightPer + "%");
	$(boxValArray['box' + boxTwo]['id']).css("height", boxTwoHeightPer + "%");
	$(boxValArray['box' + boxTwo]['id']).css("top", boxOneHeightPer + "%");
	$(boxValArray['box' + boxThree]['id']).css("height", (remainHeightPer - boxTwoHeightPer) + "%");
	$(boxValArray['box' + boxThree]['id']).css("top", (boxOneHeightPer + boxTwoHeightPer) + "%");
	$(boxValArray['box' + boxFour]['id']).css("height", (100 - (remainHeightPer + boxOneHeightPer)) + "%");
	$(boxValArray['box' + boxFour]['id']).css("top", (boxOneHeightPer+remainHeightPer) + "%");

	//Update array
	boxValArray['box' + boxOne]['height'] = $(boxValArray['box' + boxOne]['id']).height();
	boxValArray['box' + boxTwo]['height'] = $(boxValArray['box' + boxTwo]['id']).height();
	boxValArray['box' + boxThree]['height'] = $(boxValArray['box' + boxThree]['id']).height();
	boxValArray['box' + boxFour]['height'] = $(boxValArray['box' + boxFour]['id']).height();
}

//-----------------------------------
// HEIGHT MEASURMENT FOR TEMPLATE 9
//-----------------------------------

function alignTemplate9Height3Stack(boxValArray, boxOne, boxTwo, boxThree, boxFour)
{

	//Box three height. It is the box that is currently being resized.
	var boxThreeHeight = boxValArray['parent']['height'] - ($(boxValArray['box' + boxOne]['id']).height() + $(boxValArray['box' + boxTwo]['id']).height() + $(boxValArray['box' + boxFour]['id']).height());
	var boxThreeHeightPer = (boxThreeHeight/(boxValArray['parent']['height'])) * 100;

	//Fourth box height in pixels then in percent.
	var boxFourHeight = (boxValArray['parent']['height'] - ($(boxValArray['box' + boxOne]['id']).height() + $(boxValArray['box' + boxTwo]['id']).height() + boxThreeHeight));
	var boxFourHeightPer = (boxFourHeight /(boxValArray['parent']['height'])) * 100;

	//Second box height in pixels then in percent.
	var boxTwoHeight = (boxValArray['parent']['height'] - ($(boxValArray['box' + boxOne]['id']).height() + boxThreeHeight + boxFourHeight));
	var boxTwoHeightPer = (boxTwoHeight/(boxValArray['parent']['height'])) * 100;

	//First box height in pixels then in percent.
	var boxOneHeight = (boxValArray['parent']['height'] - (boxTwoHeight + boxThreeHeight + boxFourHeight));
	var boxOneHeightPer = (boxOneHeight/(boxValArray['parent']['height'])) * 100;

	//Box three and four totalt height
	var boxThreeAndFourHeightPer =  boxThreeHeightPer + boxFourHeightPer;

	//check if box three and four is at minimum height.
	if(boxThreeAndFourHeightPer <= 20) {

		//Set the height to the minimum.
		boxThreeAndFourHeightPer = 20;

		//Set height and top on the boxes when the lower two boxes are at the minimum height.
		$(boxValArray['box' + boxTwo]['id']).css("height", (100 - boxOneHeightPer - boxThreeAndFourHeightPer) + "%");
		$(boxValArray['box' + boxTwo]['id']).css("top", boxOneHeightPer + "%");

		$(boxValArray['box' + boxThree]['id']).css("height", boxThreeAndFourHeightPer/2 + "%");
		$(boxValArray['box' + boxThree]['id']).css("top", "80" + "%");

		$(boxValArray['box' + boxFour]['id']).css("height", boxThreeAndFourHeightPer/2 + "%");
		$(boxValArray['box' + boxFour]['id']).css("top", "90" + "%");

	//Check if box three is at or below minimum height.
	} else if (boxThreeHeightPer <= 10) {
		boxThreeHeightPer = 10;

		//Set height and top on the boxes when the lower two boxes are at the minimum height.
		$(boxValArray['box' + boxTwo]['id']).css("height", (100 - boxOneHeightPer - boxThreeAndFourHeightPer) + "%");
		$(boxValArray['box' + boxTwo]['id']).css("top", boxOneHeightPer + "%");

		$(boxValArray['box' + boxThree]['id']).css("height", boxThreeHeightPer + "%");
		$(boxValArray['box' + boxThree]['id']).css("top", (boxOneHeightPer + boxTwoHeightPer) + "%");

		$(boxValArray['box' + boxFour]['id']).css("height", (100 - boxOneHeightPer - boxTwoHeightPer - boxThreeHeightPer) + "%");
		$(boxValArray['box' + boxFour]['id']).css("top", (boxOneHeightPer + boxThreeHeightPer + boxTwoHeightPer) + "%");

	} else {

		//Set height and top on the boxes
		$(boxValArray['box' + boxTwo]['id']).css("height", boxTwoHeightPer + "%");
		$(boxValArray['box' + boxTwo]['id']).css("top", boxOneHeightPer + "%");

		$(boxValArray['box' + boxThree]['id']).css("height", boxThreeHeightPer + "%");
		$(boxValArray['box' + boxThree]['id']).css("top", (boxOneHeightPer + boxTwoHeightPer) + "%");

		$(boxValArray['box' + boxFour]['id']).css("height", boxFourHeightPer + "%");
		$(boxValArray['box' + boxFour]['id']).css("top", (boxOneHeightPer + boxThreeHeightPer + boxTwoHeightPer) + "%");
	}

	//Update array
	boxValArray['box' + boxOne]['height'] = $(boxValArray['box' + boxOne]['id']).height();
	boxValArray['box' + boxTwo]['height'] = $(boxValArray['box' + boxTwo]['id']).height();
	boxValArray['box' + boxThree]['height'] = $(boxValArray['box' + boxThree]['id']).height();
	boxValArray['box' + boxFour]['height'] = $(boxValArray['box' + boxFour]['id']).height();
}

//------------------------------------
// HEIGHT MEASURMENT FOR TEMPLATE 9
//------------------------------------

function alignTemplate9Height2Stack(boxValArray, boxOne, boxTwo, boxThree, boxFour)
{
	//Box four height in pixels then in percent. It is the box that is currently being resized.
	var boxFourHeight = boxValArray['parent']['height'] - ($(boxValArray['box' + boxOne]['id']).height() + $(boxValArray['box' + boxTwo]['id']).height() + $(boxValArray['box' + boxThree]['id']).height());
	var boxFourHeightPer = (boxFourHeight/boxValArray['parent']['height']) * 100;

	//Second box height in pixels then in percent
	var boxTwoHeight = (boxValArray['parent']['height'] - ($(boxValArray['box' + boxOne]['id']).height() + $(boxValArray['box' + boxThree]['id']).height() + boxFourHeight));
	var boxTwoHeightPer = (boxTwoHeight/(boxValArray['parent']['height'])) * 100;

	//First box height in pixels then in percent
	var boxOneHeight = (boxValArray['parent']['height'] - (boxTwoHeight + $(boxValArray['box' + boxThree]['id']).height() + boxFourHeight));
	var boxOneHeightPer = (boxOneHeight / (boxValArray['parent']['height'])) * 100;

	//Third box height in pixels then in percent
	var boxThreeHeight = (boxValArray['parent']['height'] - (boxOneHeight + boxTwoHeight + boxFourHeight));
	var boxThreeHeightPer = boxThreeHeight/(boxValArray['parent']['height']) * 100;

	if(boxFourHeightPer <= 10){
		boxFourHeightPer = 10;

		//Set height and top on the boxes
		$(boxValArray['box' + boxThree]['id']).css("height", (100 - boxOneHeightPer - boxTwoHeightPer - boxFourHeightPer) + "%");
		$(boxValArray['box' + boxThree]['id']).css("top", (boxOneHeightPer + boxTwoHeightPer) + "%");

		$(boxValArray['box' + boxFour]['id']).css("height", boxFourHeightPer + "%");
		$(boxValArray['box' + boxFour]['id']).css("top", "90" + "%");

	 } else {

	 	//Set height and top on the boxes
		$(boxValArray['box' + boxThree]['id']).css("height", boxThreeHeightPer + "%");
		$(boxValArray['box' + boxThree]['id']).css("top", (boxOneHeightPer + boxTwoHeightPer) + "%");

		$(boxValArray['box' + boxFour]['id']).css("height", boxFourHeightPer + "%");
		$(boxValArray['box' + boxFour]['id']).css("top", (boxOneHeightPer + boxTwoHeightPer + boxThreeHeightPer) + "%");
	}

	//Update array
	boxValArray['box' + boxOne]['height'] = $(boxValArray['box' + boxOne]['id']).height();
	boxValArray['box' + boxTwo]['height'] = $(boxValArray['box' + boxTwo]['id']).height();
	boxValArray['box' + boxThree]['height'] = $(boxValArray['box' + boxThree]['id']).height();
	boxValArray['box' + boxFour]['height'] = $(boxValArray['box' + boxFour]['id']).height();
}

//----------------------------------------------------------------------------------
//Creates an array with all the properties needed for resize function.
//                Is called by resizeBoxes in codeviewer.js
//----------------------------------------------------------------------------------

function initResizableBoxValues(parent)
{
	var parentWidth = $(parent).width();
	var parentHeight = $(parent).height();
	var boxWidth;
	var boxHeight;
	var boxId;
	var numBoxes = $("[id ^=box][id $=wrapper]").length;
	var boxValueArray = new Array();
	boxValueArray["parent"] = {"id": parent, "width": parentWidth, "height": parentHeight};

	for (var i = 1; i <= numBoxes; i++) {
		boxWidth = $("#box" + i + "wrapper").width();
		boxHeight = $("#box" + i + "wrapper").height();
		boxId = "#box" + i + "wrapper";
		boxValueArray["box" + i] = {"id": boxId, "width": boxWidth, "height": boxHeight};
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
//	LOADER:	Makes the page content hidden until it is loaded completely and displays a
//  loading gif until page has loaded fully
//----------------------------------------------------------------------------------

document.onreadystatechange = function ()
{
  var state = document.readyState
  if (state == 'interactive') {
       document.getElementById('content').style.visibility="hidden";
  } else if (state == 'complete') {
      document.getElementById('loader').style.visibility="hidden";
      document.getElementById('content').style.visibility="visible";
  }
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
	}else if(templateId == 7){
		alignWidthTemplate7(boxValArray, 2, 3, 4, 1);
		alignBoxesHeight3stack(boxValArray, 2, 3, 4);
	}else if(templateId == 8){
		alignBoxesHeight2boxes(boxValArray, 2, 3);
		alignBoxesWidthTemplate8(boxValArray, 2, 3, 1);
	}else if(templateId == 9){
		alignTemplate9Width(boxValArray, 1, 2, 3, 4, 5);
		alignTemplate9Height(boxValArray, 2, 3, 4, 5);
		alignTemplate9Height3Stack(boxValArray, 2, 3, 4, 5);
	}
else if(templateId == 10){
  alignBoxesWidth(boxValArray, 1, 2);
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
// addHtmlLineBreak: This function will replace all '\n' line breaks in a string
//					 with <br> tags.
//                Is called by returned in codeviewer.js
//----------------------------------------------------------------------------------

function addHtmlLineBreak(inString)
{
	return inString.replace(/\n/g, '<br>');
}

//----------------------------------------------------------------------------------
// copyCodeToClipboard: Selects and copies the code within the selected code view
//----------------------------------------------------------------------------------

function copyCodeToClipboard(boxid) {
	var box = document.getElementById("box" + boxid);
	var code = box.getElementsByClassName("normtextwrapper")[0];

	// Select the code
	var selection = window.getSelection();
	var range = document.createRange();
	range.selectNodeContents(code);
	selection.removeAllRanges();
	selection.addRange(range);
	document.execCommand("Copy");
	selection.removeAllRanges();

	// Notification animation
	$("#notification" + boxid).css("display", "flex").hide().fadeIn("fast", function(){
		setTimeout(function(){
			$("#notification" + boxid).fadeOut("fast");
		}, 500);
	});	
}