/********************************************************************************

   Documentation

*********************************************************************************

Execution Order
---------------------
 #1 setup() is first function to be called this then invokes returned() callback through AJAX
 #2 returned() is next function to be called as a callback from setup.

Testing Link:

codeviewer.php?exampleid=1&courseid=1&cvers=45656

How to use
---------------------
# Upload the files you wish to display in the file editor
# Create a new codeviewer
# Pick a template
# Click the cogwheel and pick the file you wish to display in the 'File' select box
# Click 'Save'

-------------==============######## Documentation End ###########==============-------------
*/

/********************************************************************************

   Globals

*********************************************************************************/

var retData; // Data returned from setup
var tokens = []; // Array to hold the tokens.
var allBlocks = []; // Array holding collapsible tokens
var dmd = 0; // Variable used to determine forward/backward skipping with the forward/backward buttons
var genSettingsTabMenuValue = "wordlist";
var codeSettingsTabMenuValue = "implines";
var querystring = parseGet();
var courseid;
var exampleid;
var cvers;
var template7maximizebuttonpressed = false;
var template8maximizebuttonpressed = false;
var sectionData; // Variable that stores all the data that is sent from Section, which contains the ordering of the code examples.
var codeExamples = []; // Array that contains all code examples in the same order that was assigned in Section before pressing one of the examples.
var currentPos; // Variable for the current position that determines where in the list of code examples you are.
var selectionRange; // Variable that stores range of selected text.
var x = window.matchMedia('(max-width: 380px)');

//Display back icon when you click on a dugga in mobile mode (max-width: 380px)
x.onchange = (e) => {
    if (e.matches) {
        displayBackIcons();
    }
}  

function displayBackIcons() {
    document.getElementById("back").style.display="revert"; 
}

/********************************************************************************

   SETUP

*********************************************************************************/

function setup() {
	try {
		courseid = querystring['courseid'];
		exampleid = querystring['exampleid'];
		cvers = querystring['cvers'];

		AJAXService("EDITEXAMPLE", {
			courseid: courseid,
			exampleid: exampleid,
			cvers: cvers
		}, "CODEVIEW");
	} catch (e) {
		alert("Error while setting up: " + e.message)
	}
}


function returnedError(error) {
	if (error.responseText) {
		document.querySelector('#div2').innerHTML += " and show them this message:<br><br>"+error.responseText;
	}
}

function fillBurger() {
	var boxes = retData['box'];
	var burgerMenu = document.querySelector('#burgerMenu');
	var str = "";
	boxes.forEach(box => {
		str += "<div class='burgerOption DarkModeBackgrounds' onclick='setShowPane("+box[0]+");'>"+box[4]+"</div>";	
	});
	str += "<div class='burgerOption DarkModeBackgrounds' onclick='showAllViews();'>All views</div>";
	burgerMenu.innerHTML = str;
}

//-----------------------------------------------------------------
// returned: Fetches returned data from all sources
//-----------------------------------------------------------------

function returned(data) 
{
	allBlocks = [];
	retData = data;
	sectionData = JSON.parse(localStorage.getItem("ls-section-data"));
	// User can choose template if no template has been chosen and the user has write access.
	if ((retData['templateid'] == 0)) {
		if (retData['writeaccess'] == "w") {
			toast("warning","A template has not been chosen for this example. Please choose one.",10);
			document.getElementById("chooseTemplateContainer").style.display = "flex";
			return;
		} else {
			toast("error","The administrator of this code example has not yet chosen a template.", 10);
			return;
		}
	}
	changeCSS("../Shared/css/" + retData['stylesheet']);

	//Checks current example name with all the examples in codeExamples[] to find a match
	//and determine current position.
	for(i = 0; i < sectionData['entries'].length; i++){
		if(retData['examplename'] == sectionData['entries'][i]['examplename'] && retData['sectionname'] == sectionData['entries'][i]['entryname']){
			currentPos = i;
		}
		else if(sectionData['entries'][i]['link'] == exampleid){
			currentPos = i;
		}
	}

	//Fixes the five next code examples in retData to match the order that was assigned in Section.
	var j = 0;
	var posAfter = currentPos+1;

	// Holds all items shown on forward button press
	retData['after'] = [];
	for(i = currentPos; i <= sectionData['entries'].length-1; i++){
		if(j < 5){
			if(currentPos == sectionData['entries'].length-1 && posAfter + j == sectionData['entries'].length){
				retData['after'] = [];
				break;
			}
			if(posAfter + j == sectionData['entries'].length){
				//Not ideal to have this here but this is needed to not get an arrayOutOfBounds Error.
				break;
			}

			retData['after'].push(sectionData['entries'][posAfter + j]);
			if(sectionData['entries'][posAfter + j]['kind'] == 1){
				/* Text added after in all titles. 
				If not set text "undefined" will be displayed. */
				retData['after'][j][2] = " ";
			}
			retData['after'][j][1] = sectionData['entries'][posAfter + j]['entryname'];
			retData['after'][j][0] = (String)(sectionData['entries'][posAfter + j]['link']);

			for(k = 0; k < retData['beforeafter'].length; k++){
				if(retData['beforeafter'][k][0] == retData['after'][j][0]){			
					retData['after'][j][2] = retData['beforeafter'][k][2]
					break;
				}
			}
			retData['exampleno'] = posAfter;
			j++;
		}else{
			break
		}
	}

	//Fixes the five code examples before the current one in retData to match the order that was assigned in Section.
	j = 0;
	var posBefore = currentPos-1;

	// Holds all items shown on backward button press
	retData['before'] = [];
	for(i = currentPos; i > 0; i--){
		if(j < 5){
			if(currentPos==1 && posBefore - j == 0){
				retData['before'] = [];
				break;
			}
			retData['before'].push(sectionData['entries'][posBefore - j]);
			retData['before'][j][1] = sectionData['entries'][posBefore - j]['entryname'];
			retData['before'][j][0] = (String)(sectionData['entries'][posBefore - j]['link']);

			for(k = 0; k < retData['beforeafter'].length; k++){
				if(retData['beforeafter'][k][0] == retData['before'][j][0] ){					
					retData['before'][j][2] = retData['beforeafter'][k][2]
					break;
				}
			}
			if(sectionData['entries'][posBefore - j]['kind']== 1){
				/* Text added after in all titles. 
				If not set text "undefined" will be displayed. */
				retData['before'][j][2] = " ";
			}			
			retData['exampleno'] = posBefore;
			j++;
		}else{
			break
		}
	}
	if (retData['deleted']) {
		window.location.href = 'sectioned.php?courseid='+courseid+'&coursevers='+cvers;
	}


	if (document.getElementById('fileedButton')) {
		document.getElementById('fileedButton').onclick = new Function("navigateTo('/fileed.php','?courseid=" + courseid + "&coursevers=" + cvers + "');");
		document.getElementById('fileedButton').style = "display:table-cell;";

	}

	if (retData['debug'] != "NONE!") alert(retData['debug']);

	// Disables before and after button if there are no available example before or after.
	// Works by checking if the current example is last or first in the order of examples.
	//If there are no examples this disables being able to jump through (the non-existsing) examples

	if (retData['before'].length != 0 && retData['after'].length != 0 || retData['before'].length == 0 || retData['after'].length == 0) {
		if (retData['exampleno'] == 0 || retData['before'].length == 0) {
			document.querySelector("#beforebutton").style.opacity = "0.4";
			document.querySelector("#beforebutton").style.pointerEvents = "none";
		}
		if (retData['exampleno'] == sectionData['entries'].length || retData['after'].length == 0) {
			document.querySelector("#afterbutton").style.opacity = "0.4";
			document.querySelector("#afterbutton").style.pointerEvents = "none";
		}
	} else if (retData['before'].length == 0 && retData['after'].length == 0) {
		document.querySelector("#beforebutton").style.opacity = "0.4";
		document.querySelector("#beforebutton").style.pointerEvents = "none";
		document.querySelector("#afterbutton").style.opacity = "0.4";
		document.querySelector("#afterbutton").style.pointerEvents = "none";
	}

	// Disables the play button if there is no playlink
	if (typeof retData['playlink'] == 'undefined' || retData['playlink'] == "" || retData['playlink'] == null) {
		document.querySelector("#playbutton").style.opacity = "0.4";
		document.querySelector("#playbutton").style.pointerEvents = "none";
	} else {
		retData['playlink'] = retData['playlink'].replace(/\&\#47\;/g, "/");
	}

	// Fill Section Name and Example Name
	var exName = document.querySelector('#exampleName');
	if (data['examplename'] != null) {
		exName.innerHTML = data['examplename'];
	}
	var exSection = document.querySelector('#exampleSection');
	if (data['sectionname'] != null) {
		exSection.innerHTML = data['sectionname'] + "&nbsp;:&nbsp;";
	}
	var mobExName = document.querySelector('#mobileExampleName');
	var mobExSection = document.querySelector('#mobileExampleSection');
	mobExName.innerHTML = data['examplename'];
	mobExSection.innerHTML = data['sectionname'] + "&nbsp;:&nbsp;";

	// Clear div2
	document.getElementById("div2").innerHTML = "";


	// Possible crash warning if returned number of boxes is wrong
	if (retData['numbox'] == 0 || retData['numbox'] == null) {
		var debug = "Debug: Nr boxes ret: " + retData['numbox'] + ", may cause page crash"
		console.log(debug);
	}

	// Create boxes
	if (retData['numbox'] > retData['box'].length) {
		alert("Number of boxes is inconsistent\n" + retData['numbox'] + "\n" + retData['box'].length);
	}

	for (var i = 0; i < retData['numbox']; i++) {
		var contentid = "box" + retData['box'][i][0];
		var boxid = retData['box'][i][0];
		var boxtype = retData['box'][i][1].toUpperCase();
		var boxcontent = retData['box'][i][2];
		var boxwordlist = retData['box'][i][3];
		var boxfilename = retData['box'][i][5];
		var boxfilepath = retData['box'][i][7];
		var boxfilekind = retData['box'][i][8];
		var boxmenuheight = 0;


		// don't create templatebox if it already exists
		if (!document.getElementById(contentid)) {

			addTemplatebox(contentid);
		}

		if (boxtype === "CODE") {
			// Print out code example in a code box
			var boxtypeCodebox = document.getElementById(contentid);
			boxtypeCodebox.removeAttribute("contenteditable");
			boxtypeCodebox.classList.remove("descbox");
			boxtypeCodebox.classList.add("codebox");
			createboxmenu(contentid, boxid, boxtype, boxfilepath, boxfilename, boxfilekind);

			// Make room for the menu by setting padding-top equal to height of menubox
			// Without this fix the code box is placed at same height as the menu, obstructing first lines of the code
			// Setting boxmenuheight to 0, possible cause to example malfunction?
			const menu = document.getElementById(contentid + "menu");
			let boxmenuheight = 0;

			if (menu && menu.offsetHeight != null) {
				boxmenuheight = menu.offsetHeight;
			} 
		
			document.getElementById(contentid).style.marginTop = (boxmenuheight - 1) + "px";

			// Indentation fix of content
			boxcontent = tabLine(boxcontent);

			// Render code
			rendercode(boxcontent, boxid, boxwordlist, boxfilename);
			console.log("Rendering boxcontent for boxid=" + boxid + ":\n" + boxcontent);
			// set font size
			document.getElementById("box" + boxid).style.fontSize = retData['box'][boxid - 1][6] + "px";

		} else if (boxtype === "DOCUMENT") {
			// Print out description in a document box

			var boxtypeDescbox = document.getElementById(contentid);
			boxtypeDescbox.classList.remove("codebox");
			boxtypeDescbox.classList.add("descbox");

			var desc = boxcontent;
			desc = replaceAll("&nbsp;", " ", desc);
			desc = parseMarkdown(desc);

			//Change all asterisks to the html code for asterisks
			desc = desc.replace(/\*/g, "&#42;");
			// Highlight important words
			important = retData.impwords;
			for (var j = 0; j < important.length; j++) {
				//Prevent important word spans to be created for HTML events.
				if(htmlEventArray.includes(important[j])){
					var sstr = important[j];
				}else{
					var sstr = "<span id='IWW' class='impword' onclick='popupDocumentation(\"" + important[j] + "\", \"unspecified\");' onmouseout='highlightKeyword(\"" + important[j] + "\")' onmouseover='highlightKeyword(\"" + important[j] + "\")'>" + important[j] + "</span>";
				}
				//Interpret asterisks in important word as literals and not as character with special meaning
				if (important[j].indexOf('*') != -1) {
					important[j] = important[j].replace(/\*/g, "&#42;");
				}
				//make sure that not partial words gets highlighted
				var regExp = new RegExp("\\b" + important[j] + "\\b", "g");
				desc = desc.replace(regExp, sstr);
			}
			//Replace the html code for asterisks with asterisks
			desc = desc.replace(/\&\#42\;/g, "*");

			/* Assign Content */
			const boxEl = document.getElementById(contentid);
			boxEl.innerHTML = desc;
			boxEl.style.marginTop = boxmenuheight + "px";

			createboxmenu(contentid, boxid, boxtype, boxfilepath, boxfilename, boxfilekind);

			// set font size
			document.getElementById("box" + boxid).style.fontSize = retData['box'][boxid - 1][6] + "px";
			
			// Make room for the menu by setting padding-top equals to height of menubox
			const menu = document.getElementById(contentid + "menu");
			boxmenuheight = menu && menu.offsetHeight != null ? menu.offsetHeight : 0;

			boxEl.style.marginTop = boxmenuheight + "px";
			
		} else if (boxtype === "IFRAME") {
			createboxmenu(contentid, boxid, boxtype, boxfilepath, boxfilename, boxfilekind);
			
			var boxtypeframebox = document.getElementById(contentid);
			boxtypeframebox.classList.remove("codebox", "descbox");
			boxtypeframebox.classList.add("framebox");

			// If multiple versions exists use the one with highest priority.
			// cvers BEFORE courseid BEFORE global
			var previewFile = retData['box'][i][5];
			var previewLink = "";

			// Remove html-entitied slashes...
			previewFile = previewFile.replace(/&#47;/g, "/");
			if (previewFile.indexOf("http://") == 0 || previewFile.indexOf("https://") == 0) {
				// Preview to external link
				previewLink = previewFile;
			} else {
				previewLink = retData['box'][i][2];;
			}

			if (window.location.protocol === "https:") {
				previewLink = previewLink.replace("http://", "https://");
			} else {
				previewLink = previewLink.replace("https://", "http://");
			}

			document.getElementById("box" + boxid).innerHTML = "<iframe src='" + previewLink + "'></iframe>";

			const menuEl = document.getElementById(contentid + "menu");
			boxmenuheight = menuEl && menuEl.offsetHeight != null ? menuEl.offsetHeight : 0;

			document.getElementById(contentid).style.marginTop = boxmenuheight + "px";

			// NOT DEFINED
			if (boxtype === "NOT DEFINED") {
				if (retData['writeaccess'] === "w") {
					createboxmenu(contentid, boxid, boxtype, boxfilepath, boxfilename, boxfilekind);

					const menuEl = document.getElementById(contentid + "menu");
					boxmenuheight = menuEl && menuEl.offsetHeight != null ? menuEl.offsetHeight : 0;

					document.getElementById(contentid).style.marginTop = boxmenuheight + "px";
				}
			}
		}
	}
	// Add all drop zones
	if (retData['writeaccess'] === "w") {
		initFileDropZones();
	} else {
		// Find all element with class .codebox
		const codeboxes = document.querySelectorAll('.codebox');
		codeboxes.forEach(codebox => {
			// Find all child to each codebox and put it in class "unselectable"
			codebox.querySelectorAll('*').forEach(child => {
				child.classList.add('unselectable');
			});
		});
	}

	var ranges = getBlockRanges(allBlocks);
	for (var i = 0; i < Object.keys(ranges).length; i++) {
		var boxid = Object.keys(ranges)[i];
		createBlocks(ranges[boxid], boxid);
	}

	//hides maximize button if not supported
	hideMaximizeAndResetButton();

	// Allows resizing of boxes on the page
	resizeBoxes("div2", retData["templateid"]);
	var titles = [...document.querySelectorAll('[contenteditable="true"]')];

	titles.forEach(title => {
		title.addEventListener('keypress', updateTitle);
	})

	fillBurger();

	if (querystring['showPane']) {
		showBox(querystring['showPane']);
	}

	resetBoxes();
}

function returnedTitle(data) {
	// Update title in retData too in order to keep boxtitle and boxtitle2 synced
	console.log("enter returnedTitle: ", data);
	retData['box'][data.id - 1][4] = data.title;
	console.log("retdata, data.id, data.title: ", retData, data.id, data.title);
	var boxWrapper = document.querySelector('#box' + data.id + 'wrapper');
	console.log("Boxwrapper: ", boxWrapper);
	var titleSpan = boxWrapper.querySelector('#boxtitle2');
	console.log("titleSpan: ", titleSpan);
	titleSpan.innerHTML = data.title;
	console.log("innerHTML: ", titleSpan.innerHTML);
	fillBurger();
}

//------------------------
// Drag and drop
//------------------------

function handleFiles(files, boxnumber) {	
	var boxcontent;
	var file = files[0];
    var reader = new FileReader();
	var filetype = file.name.split('.').pop();

	// Add supported files in the array
	const supportedFiles = ["js", "php", "html", "txt", "java", "sr", "sql", "md"];
	
	// Go trough supported files
	if (supportedFiles.includes(filetype)) {
		if(filetype == "txt") {
			boxcontent = "Document";
		}
		else {
			boxcontent = "Code";
		}

		// This command is important to activate reader
		console.log(reader.readAsText(file));
	} else {
		alert("FILETYPE [" + filetype + "] NOT SUPPORTED")
	}

    reader.onload = event => {
		const iframe = document.getElementById("iframeFileed").contentWindow;
		showHiddenIframe();

		document.querySelector("#iframeFileed").addEventListener( "load", function(e) {
			// IFrame querys
			iframe.showFilePopUp('GFILE');
			iframe.document.querySelector('#uploadedfile').files = files;
			iframe.uploadDroppedFile();

			// Lastly, apply the new file to that of the code viewer
			updateContent(file.name, boxcontent, boxnumber);
		}, { once: true });
    };
}

function handleDrop(e)
{
	let dt = e.dataTransfer;
	let files = dt.files;

	// Get correct box number
	var boxnumber = parseInt(e["currentTarget"]["id"].replace("box",""));

	handleFiles(files, boxnumber);
}

function initFileDropZones()
{
	for(i = 1; i <= retData["box"].length; i++) {
		dropArea = document.getElementById("box" + i);
		if (typeof(dropArea) == 'undefined' || dropArea == null)
			continue;

		['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => 
			{
			  dropArea.addEventListener(eventName, preventDefaults, false);
			})
	
			;['dragenter', 'dragover'].forEach(eventName => 
			{
			  dropArea.addEventListener(eventName, highlight, false)
			})
	
			;['dragleave', 'drop'].forEach(eventName => 
			{
			  dropArea.addEventListener(eventName, unhighlight, false)
			})
	
			dropArea.addEventListener('drop', handleDrop, false);
	}
}

function preventDefaults (e)
{
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) 
{
	e.target.closest(".box").classList.add('highlight');

	var normtext = document.querySelectorAll(".normtext");
	var impword = document.querySelectorAll(".impword");
	var impo = document.querySelectorAll(".impo");

	normtext.forEach(box => {
		box.style.backgroundColor = 'transparent';
	  });
	  
	impword.forEach(box => {
		box.style.backgroundColor = 'transparent';
	  });

	impo.forEach(box => {
	box.style.backgroundColor = 'transparent';
	});
}

function unhighlight(e) 
{
	e.target.closest(".box").classList.remove('highlight');

	var normtext = document.querySelectorAll(".normtext");
	var impword = document.querySelectorAll(".impword");
	var impo = document.querySelectorAll(".impo");

	normtext.forEach(box => {
		box.style.backgroundColor = 'none';
	  });
	  
	impword.forEach(box => {
		box.style.backgroundColor = 'none';
	  });

	impo.forEach(box => {
	box.style.backgroundColor = 'none';
	});
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

var tabLine = function (text) {
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
	var word = document.getElementById("impword").value;
	var left = 0;
	var right = 0;
	//Check if the word contains an uneven amount of parenthesis
	// * if so do not add the word to important words, it will break the page
	for (var i = 0; i < word.length; i++) {
		if (word[i] == '(') {
			left++;
		} else if (word[i] == ')') {
			right++;
		}
	}
	//If there is an uneven amount set uneven
	var uneven = false;
	if (left != right) {
		uneven = true;
	}
	if (editType === "+" && word !== "" && !/\s/.test(word) && !uneven) {
		let exists = false;

		// Checks if the word already exists as an option in the selectbox
		const options = document.querySelectorAll("#impwords option");
		options.forEach(option => {
			if (option.value === word) {
				exists = true;
			}
		});

		if (!exists) {
			const impwords = document.getElementById("impwords");
			const newOption = document.createElement("option");
			newOption.textContent = word;
			newOption.value = word;
			impwords.appendChild(newOption);
			document.getElementById("impword").value = word;
			addedWords.push(word);
		}
	} else if (editType === "-") {
		const impwords = document.getElementById("impwords");
		const selectedOption = impwords.options[impwords.selectedIndex];
		if (selectedOption) {
			removedWords.push(selectedOption.text);
			impwords.removeChild(selectedOption);
		}
	}

}

//----------------------------------------------------------------------------------
// displayEditExample: Displays the dialogue box for editing a code example
//
//----------------------------------------------------------------------------------

function displayEditExample() {
	function decodeHTML(html) {
		const textarea = document.createElement("textarea");
		textarea.innerHTML = html;
		return textarea.value;
	}

	document.getElementById("title").value = decodeHTML(retData['examplename']);
	document.getElementById("secttitle").value = decodeHTML(retData['sectionname']);

	changeDirectory(document.getElementById("boxcontent"));
	document.getElementById("playlink").value = retData['playlink'];

	var iw = retData['impwords'];
	var str = "";
	for (var i = 0; i < iw.length; i++) {
		str += "<option>" + iw[i] + "</option>";
	}
	document.getElementById("impwords").innerHTML = str;
	
	// Set beforeid and afterid if set
	var beforeid = "UNK";
	if (retData['before'] !== null) {
		if (retData['before'].length !== 0) {
			beforeid = retData['before'][0][0];
		}
	}
	var afterid = "UNK";
	if (retData['after'] !== null) {
		if (retData['after'].length !== 0) {
			afterid = retData['after'][0][0];
		}
	}
	// Variables used to fetch filename for current codebox
	var bestr = "";
	var afstr = "";
	var ba = retData['beforeafter'];
	for (var i = 0; i < ba.length; i++) {
		if (ba[i][0] == beforeid) {
			bestr += "<option selected='selected' value='" + ba[i][0] + "'>" + ba[i][1] + ":" + ba[i][2] + "</option>";
		} else {
			bestr += "<option value='" + ba[i][0] + "'>" + ba[i][1] + ":" + ba[i][2] + "</option>";
		}
		if (ba[i][0] == afterid) {
			afstr += "<option selected='selected' value='" + ba[i][0] + "'>" + ba[i][1] + ":" + ba[i][2] + "</option>";
		} else {
			afstr += "<option value='" + ba[i][0] + "'>" + ba[i][1] + ":" + ba[i][2] + "</option>";
		}
	}
	// document.getElementById("before").innerHTML += bestr;
	// document.getElementById("after").innerHTML += afstr;
	document.getElementById("editExampleContainer").style.display = "flex";
}

//----------------------------------------------------------------------------------
// updateExample: Updates example data in the database if changed
//----------------------------------------------------------------------------------

function updateExample() {
	// Set beforeid if set
	// var beforeid = "UNK";
	// if (retData['before'].length != 0) {
	// 	beforeid = retData['before'][0][0];
	// }
	// var afterid = "UNK";
	// if (retData['after'].length != 0) {
	// 	afterid = retData['after'][0][0];
	// }

	// Checks if any field in the edit box has been changed, an update would otherwise be unnecessary
	const playlinkEl = document.getElementById("playlink");
	const titleEl = document.getElementById("title");
	const secttitleEl = document.getElementById("secttitle");

	const playlinkVal = playlinkEl?.value ?? "";
	const titleVal = titleEl?.value ?? "";
	const secttitleVal = secttitleEl?.value ?? "";

	const beforeEl = document.getElementById("before");
	const afterEl = document.getElementById("after");

	const selectedBefore = beforeEl ? beforeEl.value : "UNK";
	const selectedAfter = afterEl ? afterEl.value : "UNK";

	if (
		removedWords.length > 0 ||
		addedWords.length > 0 ||
		playlinkVal !== retData['playlink'] ||
		titleVal !== retData['examplename'] ||
		secttitleVal !== retData['sectionname'] ||
		selectedBefore !== "UNK" ||
		selectedAfter !== "UNK"
	) {

		const courseid = querystring ['courseid'];
		const cvers = querystring['cvers'];
		const exampleid = querystring['exampleid'];

		AJAXService("EDITEXAMPLE", {
			courseid: courseid,
			cvers: cvers,
			exampleid: exampleid,

			beforeid: selectedBefore,
			afterid: selectedAfter,
			playlink: playlinkVal,
			examplename: titleVal,
			sectionname: secttitleVal,

			addedWords: addedWords,
			removedWords: removedWords
		}, "CODEVIEW");

		addedWords = [];
		removedWords = [];
	}

	document.getElementById("editExampleContainer").style.display = "none"; 
}

function removeExample() {
	var courseid = querystring['courseid'];
	var cvers = querystring['cvers'];
	var exampleid = querystring['exampleid'];
	var lid = querystring['lid'];

	AJAXService("DELEXAMPLE", {
		courseid: courseid,
		cvers: cvers,
		exampleid: exampleid,
		lid: lid
	}, "CODEVIEW");
}

//----------------------------------------------------------------------------------
// displayEditContent: Displays the dialogue box for editing a content pane
//                Is called by createboxmenu in codeviewer.js
//----------------------------------------------------------------------------------

var openBoxID;

function displayEditContent(boxid) 
{
	editRowsEnterPress();
	document.getElementById("boxtitle2").removeAttribute("contenteditable");
	// The information stored about the box is fetched
	var box = retData['box'][boxid - 1];

	// Keeps track of the currently open box. Used when saving the box content.
	openBoxID = boxid;

	document.getElementById("boxtitle").value = box[4];
	document.getElementById("boxcontent").value = box[1];

	changeDirectory(document.getElementById("boxcontent"));

	if (box[5] != null) {
		box[5] = box[5].replace(/&#47;/g, "/");
		document.getElementById("filename").value = box[5]; 
	} else {
		document.getElementById("filename").value = "";
	}

	document.getElementById("fontsize").value = box[6];

	var wordl = retData['wordlists'];
	var str = "";
	for (var i = 0; i < wordl.length; i++) {
		str += "<option value='" + wordl[i][0] + "'>" + wordl[i][1] + "</option>";
	}

	document.getElementById("wordlist").innerHTML = str;
	document.getElementById("wordlist").value = box[3];


	var str = "";
	for (var i = 0; i < retData['improws'].length; i++) {
		if (retData['improws'][i][0] == boxid) {
			str += "<option>" + retData['improws'][i][1] + " - " + retData['improws'][i][2] + "</option>";
		}
	};
	document.getElementById("improws").innerHTML = str;

	document.getElementById("editContentContainer").style.display = "flex";
} 

// -----------------------------------------------------------------------------------------------
// Listen to enterpress on "important rows" inputfield and runs the same function as the + button
// -----------------------------------------------------------------------------------------------

var enterPress; // Variable that is used to check enter press or button press
function editRowsEnterPress(){
	var inputRowFrom = document.getElementById("improwfrom");
	inputRowFrom.addEventListener("keypress", function(event) {
		if (event.key === "Enter") {
			enterPress = true;
			event.preventDefault();
			editImpRows("+");
		}
	});
	var inputRowTo = document.getElementById("improwto");
	inputRowTo.addEventListener("keypress", function(event) {
		if (event.key === "Enter") {
			enterPress = true;
			event.preventDefault();
			editImpRows("+"); 	
		}
	});	
}

//----------------------------------------------------------------------------------
// changeDirectory: Changes the directory in which you choose your code or description
// 					in the Edit Content box.
//----------------------------------------------------------------------------------

function changeDirectory(kind) {
	var dir;
	var str = "";

	var kindNum;
	if (kind.id) {
		kindNum = kind.id.split('_')[1];
	}

	if (kindNum) {
		var chosen = document.getElementById("filename_" + kindNum).value;
		var wordlist = document.getElementById('wordlist_' + kindNum);
		var filenameBox = document.getElementById("filename_" + kindNum);
	} else {
		var chosen = document.getElementById("filename").value;
		var wordlist = document.getElementById('wordlist');
		var filenameBox = document.getElementById("filename");
	}

	if (kind.value === "CODE") {
		dir = retData['directory'][0];
		wordlist.disabled = false;
	} else if (kind.value === "IFRAME") {
		dir = retData['directory'][2];
		wordlist.value = null;
		wordlist.disabled = true;
	} else if (kind.value === "DOCUMENT") {
		dir = retData['directory'][1];
		wordlist.value = '4';
		wordlist.disabled = true;
	}

	// Fill the file selection dropdown with files
	//---------------------------------------------------------------------

	for (var i = 0; i < dir.length; i++) {
		if (chosen == dir[i].filename) {
			str += "<option selected='selected' value='" + dir[i].filename.replace(/'/g, '&apos;') + "'>" + dir[i].filename + "</option>";
		} 
		else if (dir[i].filename == "---===######===---"){
			str += "<option selected hidden value='" + dir[i].filename.replace(/'/g, '&apos;') + "'>" + dir[i].filename + "</option>"
		}
		else {
			str += "<option value='" + dir[i].filename.replace(/'/g, '&apos;') + "'>" + dir[i].filename + "</option>";
		}
	}



	filenameBox.innerHTML = str;
	document.getElementById("playlink").innerHTML = str;
}

//----------------------------------------------------------------------------------
// btnPress reset a boolean when the "+" button is pressed
//----------------------------------------------------------------------------------
function btnPress(){
	enterPress = false;
}
//----------------------------------------------------------------------------------
// editImpRows: Adds and removes important rows
//                Is called at line 165/169 in EditorV50.php
//----------------------------------------------------------------------------------

var addedRows = new Array();
var removedRows = new Array();

function editImpRows(editType) {
	const rowFrom = parseInt(document.getElementById("improwfrom").value);
	const rowTo = parseInt(document.getElementById("improwto").value);
	const row = document.getElementById("improwfrom").value + " - " + document.getElementById("improwto").value;

	if (editType === "+" && rowFrom <= rowTo && rowFrom > 0 && rowTo > 0) {
		let exists = false;
		const options = document.querySelectorAll("#improws option");
		options.forEach(opt => {
			if (opt.value === row) exists = true;
		});

		if (!exists) {
			const improws = document.getElementById("improws");
			const newOption = document.createElement("option");
			newOption.text = row;
			newOption.value = row;
			improws.appendChild(newOption);

			document.getElementById("improwfrom").value = "";
			document.getElementById("improwto").value = "";
			addedRows.push([openBoxID, rowFrom, rowTo]);
		}
	} else if (editType === "-") {
		const improws = document.getElementById("improws");
		const selected = improws.options[improws.selectedIndex];
		if (selected) {
			const [from, to] = selected.value.split(" - ");
			improws.removeChild(selected);
			removedRows.push([openBoxID, from, to]);
		}
	} else if (enterPress === false) {
		alert(`Incorrect value(s) (from: ${rowFrom} to: ${rowTo}) for important rows!`);
	}
}

//----------------------------------------------------------------------------------
// updateContent: Updates the box if changes has been made
//----------------------------------------------------------------------------------

function updateContent(file, content, boxnumber) 
{
	console.log("Initiate UpdateContent: ", file, content, boxnumber);
	// Check if there is a box number
	// Only true if function is called by drag and drop
	if(boxnumber) {
		var box = retData['box'][boxnumber - 1];;
		console.log("If boxnumber: ", boxnumber);
	} else {
		var box = retData['box'][openBoxID - 1];
		console.log("Else boxnumber ", openBoxID);
	}
	
	var useBoxContent = true;

	// Default to using openbox data and use regular retData as fallback incase it's not open
	if (!box) {
		useBoxContent = false;
		box = retData['box'][retData['box'].length - 1];
		console.log("fallback: ", box);
	}

	// Check if a drag and drop instance is created
	if(file != null && box != null){
		filename = file;
		boxtitle = file;
		boxcontent = content;
	}

	// First a check to is done to see if any changes has been made, then the new values are assigned and changed
	if (useBoxContent) {
		if (
			box[1] != document.querySelector("#boxcontent").value ||
			box[3] != document.querySelector("#wordlist").value ||
			box[4] != document.querySelector("#boxtitle").value ||
			box[5] != document.getElementById("filename").value ||
			box[6] != document.getElementById("fontsize").value ||
			addedRows.length > 0 ||
			removedRows.length > 0
		) {
			try {
				if (file == null)
					var boxtitle = document.querySelector("#boxtitle").value;
				if (content == null)
					var boxcontent = document.getElementById("boxcontent").value;
				if (file == null)
					var filename = document.getElementById("filename").value;

				var wordlist = document.getElementById("wordlist").value;
				var fontsize = document.getElementById("fontsize").value;
				var exampleid = querystring['exampleid'];
				var boxid = box[0];

				AJAXService("EDITCONTENT", {courseid: querystring['courseid'], exampleid: exampleid, boxid: boxid, boxtitle: boxtitle, boxcontent: boxcontent, wordlist: wordlist, filename: filename, fontsize: fontsize, removedRows: removedRows, addedRows: addedRows}, "BOXCONTENT");				
				console.log("Success: ", courseid, exampleid, boxid, boxtitle, boxcontent, wordlist, filename);
				console.log("Boxcontent: ", boxcontent);
				addedRows = [];
				removedRows = [];
			} catch (e) {
				alert("Error when updating content: " + e.message);
			}
			console.log("Timeout");
			setTimeout("location.reload()", 500); //SETBACK TO 500
		}
	} else {
		if (box[4] != document.querySelector("#boxtitle2").textContent) {
			try {
				AJAXService("EDITTITLE", {exampleid: querystring['exampleid'], courseid: querystring['courseid'], boxid: box[0], boxtitle: document.querySelector("#boxtitle").textContent}, "BOXTITLE");
				console.log("Ajaxservice, Qstring:Exampleid, Qstring:courseid; ", querystring[exampleid], querystring['courseid']);
			} catch (e) {
				alert("Error when updating content: " + e.message);
			}
		}
	}
}

/*-----------------------------------------------------------------------
  -              editTitle: Updates title being edited			            -
  -----------------------------------------------------------------------*/
function editTitle(boxid, boxtitle) {
	console.log("Enter editTitle")
	AJAXService("EDITTITLE", {
		exampleid: querystring['exampleid'],
		boxid: boxid,
		boxtitle: boxtitle
	}, "BOXTITLE");
	console.log("AJAXservice: ",exampleid, boxid, boxtitle);
}
/*-----------------------------------------------------------------------
  -              updateTitle: Updates the title being edited            -
  -----------------------------------------------------------------------*/
function updateTitle(e) {
	console.log("Call updateTitle: ", e)
	if (e.key === 'Enter') {
		e.preventDefault();
		var titleSpan = e.target;
		var box = titleSpan.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
		var boxid = box.id.substring(3, 4);
		var title = titleSpan.innerHTML.replace(/&nbsp;/g, '');

		// Trim title, max characters allowed is 20
		title = title.trim();
		if (title.length > 20) {
			title = title.substring(0, 20);
		}
		title = title.trim(); // Trim title again if the substring caused trailing whitespaces



		AJAXService("EDITTITLE", {
			exampleid: querystring['exampleid'],
			courseid: querystring['courseid'],
			boxid: boxid,
			boxtitle: title
		}, "BOXTITLE");
		window.getSelection().removeAllRanges();
		titleSpan.blur();
	}
}
//----------------------------------------------------------------------------------
// addTemplatebox: Adds a new template box to div2
//				   Is called by returned(data) in codeviewer.js
//----------------------------------------------------------------------------------

function addTemplatebox(id) {
	str = "<div id='" + id + "wrapper' ";
	if (id == ("box" + retData['numbox'])) {
		str += "class='boxwrapper activebox'>";
	} else {
		str += "class='boxwrapper deactivatedbox'>";
	}
	// Add copy to clipboard notification. Must be added here for everything to work correctly.
	str += "<div id='notification" + id + "' class='copy-notification'><img src='../Shared/icons/Copy.svg' />Copied To Clipboard</div>";
	str += "<div id='" + id + "' class='box'></div>";
	str += "</div>";

	document.getElementById("div2").innerHTML += str;

}

//----------------------------------------------------------------------------------
// createboxmenu: Creates the menu at the top of a box.
//                Is called by returned(data) in codeviewer.js
//----------------------------------------------------------------------------------

function createboxmenu(contentid, boxid, type, filepath, filename, filekind) {
	if (!document.getElementById(contentid + "menu")) {
		var boxmenu = document.createElement("div");
		document.getElementById(contentid + "wrapper").appendChild(boxmenu);
		boxmenu.setAttribute("class", "buttomenu2 buttomenu2Style");
		boxmenu.setAttribute("id", contentid + "menu");

		var str = "<table cellspacing='2'><tr>";

		// If reader has write access the settings button is shown along with box title 
		if (retData['writeaccess'] == "w") {
			if (type == "DOCUMENT") {
				str += "<td class='butto2 editcontentbtn showdesktop codedropbutton' id='settings' title='Edit box settings' onclick='displayEditContent(" + boxid + ");' ><img src='../Shared/icons/general_settings_button.svg' /></td>";
				str += '<td id = "boxtitlewrapper" class="butto2 boxtitlewrap" title="Title"><span id="boxtitle2" class="boxtitleEditable" onblur="editTitle('+boxid+', this.textContent);" contenteditable>' + retData['box'][boxid - 1][4] + '</span></td>';
				str += `<div id='iframeBoxes'><td class='butto2 editbtn' onclick='showIframe("${filepath}", "${filename}", ${filekind});'><img title='Edit file' class='markdownIcon' src='../Shared/icons/newMarkdown.svg'></div>`;
			} else if (type == "CODE") {
				str += "<td class='butto2 editcontentbtn showdesktop codedropbutton' id='settings' title='Edit box settings' onclick='displayEditContent(" + boxid + ");' ><img src='../Shared/icons/general_settings_button.svg' /></td>";
				str += '<td id = "boxtitlewrapper" class="butto2 boxtitlewrap" title="Title"><span id="boxtitle2" class="boxtitleEditable" onblur="editTitle('+boxid+', this.textContent);" contenteditable>' + retData['box'][boxid - 1][4] + '</span></td>';
				str += `<div id='iframeBoxes'><td class='butto2 editbtn' onclick='showIframe("${filepath}", "${filename}", ${filekind});'><img title='Edit file' class='markdownIcon' src='../Shared/icons/newMarkdown.svg'></div>`;
			} else if (type == "IFRAME") {
				str += "<td class='butto2 editcontentbtn showdesktop codedropbutton' id='settings' title='Edit box settings' onclick='displayEditContent(" + boxid + ");' ><img src='../Shared/icons/general_settings_button.svg' /></td>";
				str += '<td id = "boxtitlewrapper" class="butto2 boxtitlewrap" title="Title"><span id="boxtitle2" class="boxtitleEditable" onblur="editTitle('+boxid+', this.textContent);" contenteditable>' + retData['box'][boxid - 1][4] + '</span></td>';
				str += `<div id='iframeBoxes'><td class='butto2 editbtn' onclick='showIframe("${filepath}", "${filename}", ${filekind});'><img title='Edit file' class='markdownIcon' src='../Shared/icons/newMarkdown.svg'></div>`;
			} else {
				str += "<td class='butto2 showdesktop'>";
				str += "<select class='chooseContentSelect' onchange='changeboxcontent(this.value,\"" + boxid + "\",\"" + contentid + "\");removeboxmenu(\"" + contentid + "menu\");'>";
				str += "<option>Choose content</option>";
				str += "<option value='CODE'>Code example</option>";
				str += "<option value='DOCUMENT'>Description section</option>";
				str += "</select>";
				str += '</td>';
			}
			// If reader doesn't have write access, only the boxtitle is shown
		} else {
			str += '<td id="boxtitlewrapper" class="boxtitlewrap"><span class="boxtitle">' + retData['box'][boxid - 1][4] + '</span></td>';
		}

		if(retData['box'][boxid - 1][1] == "DOCUMENT"){
			var kind = 2;
		}
		if(retData['box'][boxid - 1][1] == "CODE"){
			var kind = 3;
		}
		if(retData['box'][boxid - 1][1] == "PREVIEW"){
			var kind = 2;
		}

		// Add zoom in, zoom out and reset buttons.
		str += "<div id='maximizeBoxes'><td class='butto2 maximizebtn' id='zoomIn' title='Zoom in' onclick='zoomText(" + boxid + ", 3);'><img src='../Shared/icons/MaxButton.svg' /></div>";
		str += "<div id='minimizeBoxes'><td class='butto2 minimizebtn' id='zoomOut' title='Zoom out' onclick='zoomText(" + boxid + ", -3);'><img src='../Shared/icons/MinButton.svg' /></div>";
		str += "<div id='resetBoxes'><td class='butto2 resetbtn' id='resetZoom' title='Reset zoom' onclick='resetText(" + boxid + ");' ontouchstart='touchEffect(" + boxid + ");'><img src='../Shared/icons/ResetButton.svg' /></div>";
    

		// Show the copy to clipboard button for code views only
		if (type == "CODE") {
			str += "<td class='butto2 copybutton' id='copyClipboard' title='Copy to clipboard' onclick='copyCodeToClipboard(" + boxid + ");' ontouchstart='touchEffectCopy(" + boxid + ");'><img id='copyIcon' src='../Shared/icons/Copy.svg' /></td>";
		}
		
		str += '</tr></table>';
		boxmenu.innerHTML = str;
		boxmenu.addEventListener("click", function (event) {
			if (window.innerWidth <= 1100) {
				toggleClass(boxmenu.parentNode.id);
			}
		});
	}
}
function touchEffectCopy(boxid){
    var element = document.getElementById("box" + boxid + "wrapper").childNodes[2];
    element.classList.add("touchEffectCopy");
    setTimeout(() => {
        element.classList.remove("touchEffectCopy");
    }, 1000);
}
function touchEffect(boxid){
	var element = document.getElementById("box" + boxid + "wrapper").childNodes[2];
	element.classList.add("touchEffect");

	setTimeout(() => {
		element.classList.remove("touchEffect");
	}, 1000);
}

//----------------------------------------------------------------------------------
// toggleClass: Modifies class using Jquery to contain "activebox" class selector
//				Used by createboxmenu(contentid, boxid, type) in codeviewer.js
//----------------------------------------------------------------------------------

function toggleClass(id) {
	var className = document.getElementById(id).getAttribute('class');
	var box = document.querySelector(".boxwrapper");
	box.classList.add("deactivatedbox");
	box.classList.remove("activebox");
	if (className.indexOf("activebox") > -1) {
		var removeActivebox = document.getElementById(id)
		removeActivebox.classList.remove("activebox");
		removeActivebox.classList.add("deactivatedbox");
	} else {
		var addActivebox = document.getElementById(id);
		addActivebox.classList.remove("deactivatedbox");
		addActivebox.classList.add("activebox");
	}
}

//----------------------------------------------------------------------------------
// displayDrop: Modifies class using Jquery to contain "activebox" class selector
//				TODO: Check if actually used, could not find within our files
//                Is called by [this function] in [this file]
//----------------------------------------------------------------------------------

function displayDrop(dropid) {
	const drop = document.getElementById(dropid);
	
	//hide all other dropdowns
	document.querySelectorAll(".dropdown").forEach(el =>{
		el.style.display = "none"
	});

	// Toggle current one
	if (drop && drop.offsetParent === null) {
		drop.style.display = "block";
	}else if (drop) {
		drop.style.display = "none";
	}
}

//----------------------------------------------------------------------------------
// highlightop: Highlights and Dehighlights an operator and corresponding operator in code window
//                Is called by rendercode in codeviewer.js
//----------------------------------------------------------------------------------

function highlightop(otherop, thisop) {
	document.getElementById(otherop).classList.toggle("hi");
	document.getElementById(thisop).classList.toggle("hi");
}

//----------------------------------------------------------------------------------
// highlightHtml: Highlights and Dehighlights an html-tag and corresponding html-tag in code window
//                Is called by rendercode in codeviewer.js
//----------------------------------------------------------------------------------

function highlightHtml(otherTag, thisTag) {
	document.getElementById(otherTag).classList.toggle("html");
	document.getElementById(thisTag).classList.toggle("html");
}	

//Arrays containing HTML attributes and event-attributes. Needs to be filled with a complete list of attributes, the array contains only the most common ones for now.
htmlAttrArray = new Array('action', 'class', 'disabled', 'href', 'id', 'rel', 'src', 'style', 'title', 'type');
htmlEventArray = new Array('onclick', 'onmouseout', 'onmouseleave', 'onmouseover', 'onmouseenter','onload', 'onkeydown','onkeyup','onkeypress','oninput');

//----------------------------------------------------------------------------------
// 	popupDocumentation: Creates a pop-up window containing relevant documentation to a
//	specified important word that has been clicked. Diffrent types of documentation
//	appears for different kinds of words clicked on (HTML documentation directs to W3Schools, PHP
//	documentation directs to PHP.net).    
//----------------------------------------------------------------------------------

function popupDocumentation(id, lang) {
	var url;

	// If id exists in htmlArray, change type of popup to HTML Tag (if id is "var", send to PHP-documentation anyways due to var being a PHP variable). 
	// This is used to prevent HTML tags within PHP code from sending PHP-documentation.
	if(htmlArray.includes(id) && id != "var"){
		lang = "html";
	}
	if(cssArray.includes(id)){
		lang = "css";
	}
	if(lang == "html"){
		var elementValue = document.getElementById(id).textContent;
		// Change HTML h1-h6 tags to hn in order to link to correct documentation.
		if(elementValue == "h1" || elementValue == "h2" || elementValue == "h3" || elementValue == "h4" || elementValue == "h5" || elementValue == "h6"){
			elementValue = "hn";
		}
		url = "https://www.w3schools.com/tags/tag_"+elementValue+".asp";
	}else if(lang == "multi"){
		if(htmlAttrArray.includes(id)){
			url = "https://www.w3schools.com/tags/att_"+id+".asp";
		}else if(htmlEventArray.includes(id)){
			url = "https://www.w3schools.com/tags/ev_"+id+".asp";
		}else{
			url = "https://www.php.net/results.php?q="+id+"&l=en&p=all";
		}
	}else if(lang == "css"){
		url = "https://www.w3schools.com/css/";
	}else{
		url ="https://www.google.com/search?q="+id;
	}
	window.open(url,'popup','width=600, height=600');
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
	if (skipkind == "bd") {
		dmd = 1;
	} else if (skipkind == "bu") {
		if (retData['before'].length != 0 && dmd == 1) {
			// Skip title examples when skipping through examples
			if(retData['before'][0]['kind'] == 1) {
				navigateExample(retData['before'][1][0]);
			} else {
				navigateExample(retData['before'][0][0]);
			}
		}
		dmd = 0;
	}
	if (skipkind == "fd") {
		dmd = 2;
	} else if (skipkind == "fu") {
		if (retData['after'].length != 0 && dmd == 2) {
			// Skip title examples when skipping through examples
			if(retData['after'][0]['kind'] == 1) {
				navigateExample(retData['after'][1][0]);
			} else {
				navigateExample(retData['after'][0][0]);
			}
		}
		dmd = 0;
	}
	if (skipkind == "bd" || skipkind == "fd") {
		document.getElementById("forwdrop").style.display = "none";
		document.getElementById("backwdrop").style.display = "none";
	}

	setTimeout(function () {
		execSkip()
	}, 300);
}

//----------------------------------------------------------------------------------
// execSkip:
//				Used by Skip in codeviewer.js
//----------------------------------------------------------------------------------

function execSkip() {
	str = "";
	
	//Holding backwards button
	if (dmd == 1) {
		for (i = 0; i < retData['before'].length; i++) {
			/* RetData['before'][i][0] navigates to the onclick value of all dropdown items
			in the "before" array. "UNK" is the onclick value of each title.
			Below states that if the dropdown item is a title then don't include the onclick and else applies to all other items. */
			if (retData['before'][i][0] == "UNK"){
				str += "<span id='F" + retData['before'][i][1] + "' class='dropdownitem dropdownitemStyle'> ⬆ " + retData['before'][i][1] + " " + retData['before'][i][2] + "</span>";
			} else {
				str += "<span id='F" + retData['before'][i][1] + "' onclick='navigateExample(\"" + retData['before'][i][0] + "\")' class='dropdownitem dropdownitemStyle'>" + retData['before'][i][1] + ":" + retData['before'][i][2] + "</span>";
			}
		}
		document.getElementById("backwdropc").innerHTML = str;
		document.getElementById("backwdrop").style.display = "block";
		dmd = 0
	} 
	
	//Holding forwards button
	else if (dmd == 2) {
		for (i = 0; i < retData['after'].length; i++) {
			/* RetData['after'][i][0] navigates to the onclick value of all dropdown items
			in the "after" array. "UNK" is the onclick value of each title.
			Below states that if the dropdown item is a title then don't include the onclick and else applies to all other items. */
			if (retData['after'][i][0] == "UNK"){
				str += "<span id='F" + retData['after'][i][1] + "' class='dropdownitem dropdownitemStyle'> ⬇ " + retData['after'][i][1] + " " + retData['after'][i][2] + "</span>";
			} else {
				str += "<span id='F" + retData['after'][i][1] + "' onclick='navigateExample(\"" + retData['after'][i][0] + "\")' class='dropdownitem dropdownitemStyle'>" + retData['after'][i][1] + ":" + retData['after'][i][2] + "</span>";
			}
		}
		document.getElementById("forwdropc").innerHTML = str;
		document.getElementById("forwdrop").style.display = "block";
		dmd = 0;
	}

	//Hides dropdown if click outside.
	document.addEventListener("click", function (e) {
		// Code to make it do not disappear when you hold 1s.
		if(document.getElementById("afterbutton").contains(e.target) || document.getElementById("beforebutton").contains(e.target)){
		
		}
		else if (!document.getElementById("backwdrop").contains(e.target) || !document.getElementById("forwdrop").contains(e.target)) {
			
			document.getElementById("backwdrop").style.display = "none";
			document.getElementById("forwdrop").style.display = "none";

		}
	});
	
}

//Retrieve height for building menu.
window.addEventListener("load", function () {
	var windowHeight = window.innerHeight;
	var textHeight = windowHeight - 50;
	var tableScrollContainer = document.getElementById("table-scroll");
	if (tableScrollContainer) {
		tableScrollContainer.style.height = textHeight + "px";
	}
});

window.addEventListener("resize", function () {
	var windowHeight = window.innerHeight;
	var textHeight = windowHeight - 50;
	var tableScrollContainer = document.getElementById("table-scroll");
	if (tableScrollContainer) {
		tableScrollContainer.style.height = textHeight + "px";
	}
	closeBurgerMenu(); // close burgerMenu when window resize
});

document.addEventListener("drop", function (e) {
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

function changeboxcontent(boxcontent, boxid) {
	AJAXService("changeboxcontent", "&boxid=" + boxid + "&boxcontent=" + boxcontent);
}

/********************************************************************************

   HTML freeform editing code

*********************************************************************************/

//----------------------------------------------------------
// highlightKeyword: Highlights and Dehighlights an important word from the important word list
//                Is called by [this function] in codeviewer.js
//----------------------------------------------------------

function highlightKeyword(kw) {
	kwDoubleQuotes = '"'+kw+'"';
	kwSingleQuote = "'"+kw+"'";

	document.querySelectorAll(".impword").forEach(function () {
		if(this.classList.contains("imphi")){
			this.classList.remove("imphi");
		}
		else if(this.innerHTML == kw || this.innerHTML == kwDoubleQuotes || this.innerHTML == kwSingleQuote) {
			this.classList.add("imphi");
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

function token(kind, val, fromchar, tochar, row) {
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

function maketoken(kind, val, from, to, rowno) {
	newtoken = new token(kind, val, from, to, rowno);
	tokens.push(newtoken);
}

//----------------------------------------------------------
// Writes error from tokenizer
//                Is called by [this function] in [this file]
//----------------------------------------------------------

function error(str, val, row) {
	var debug = "Tokenizer error: " + str + val + " at row " + row;
	alert("Tokenizer Error: " + str + val + " at row " + row);
}

//----------------------------------------------------------------------------------
// replaceAll: Used by tokenizer to replace all instances of find string with replace string in str.
//             The idea behind this is to  cancel the html entities introduced to allow streaming of content
//                Is called by [this function] in [this file]
//----------------------------------------------------------------------------------

function replaceAll(find, replace, str) {
	return str.replace(new RegExp(find, 'g'), replace);
}

//----------------------------------------------------------
// Tokenize: Tokenizer partly based on ideas from the very clever tokenizer written by Douglas Cockford
//           The tokenizer is passed a string, and a string of prefix and suffix terminators
//                Is called by [this function] in [this file]
//----------------------------------------------------------

function tokenize(instring, inprefix, insuffix) {
	// replace HTML-entities
	instring = replaceAll("&amp;", "&", instring);
	instring = replaceAll("&#9;", " ", instring);

	var from; // index of the start of the token.
	var i = 0; // index of the current character.
	var length = instring.length; // length of the string
	var currentCharacter; // current character.
	var currentNum; // current numerical value
	var currentQuoteChar; // current quote character
	var currentStr; // current string value.
	var currentBlock = {}; // current block value.
	var row = 1; // current row value

	currentCharacter = instring.charAt(i);
	while (currentCharacter) { // currentCharacter == first character in each word
		from = i;
		// \r\n is used as a new line character in Windows \r and \n both represent a new line character in Unix and Mac OS
		if (currentCharacter == '\r' && instring.charAt(i + 1) == '\n') {
			i++
			currentCharacter = instring.charAt(i);
		}

		if (currentCharacter <= ' ') { // White space and carriage return
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
		} else if ((currentCharacter >= 'a' && currentCharacter <= 'z') || (currentCharacter >= 'A' && currentCharacter <= 'Z')) { // Names i.e. Text
			currentStr = currentCharacter;
			i++;
			while (true) {
				currentCharacter = instring.charAt(i);
				if ((currentCharacter >= 'a' && currentCharacter <= 'z') || (currentCharacter >= 'A' && currentCharacter <= 'Z') || (currentCharacter >= '0' && currentCharacter <= '9') || currentCharacter == '_') {
					currentStr += currentCharacter;
					i++;
				} else {
					break;
				}
			}
			maketoken('name', currentStr, from, i, row);
		} else if (currentCharacter >= '0' && currentCharacter <= '9') { // Number token
			currentStr = currentCharacter;
			i++;
			while (true) {
				currentCharacter = instring.charAt(i);
				if (currentCharacter < '0' || currentCharacter > '9') break;
				i++;
				currentStr += currentCharacter;
			}
			if (currentCharacter == '.') {
				i++;
				currentStr += currentCharacter;
				for (;;) {
					currentCharacter = instring.charAt(i);
					if (currentCharacter < '0' || currentCharacter > '9') break;
					i++;
					currentStr += currentCharacter;
				}
			}
			if (currentCharacter == '#') {
				for (var j = 0; j <= 6; j++) {
					if ((currentCharacter >= '0' || currentCharacter <= '9') || (currentCharacter >= 'a' || currentCharacter <= 'f') || (currentCharacter >= 'A' || currentCharacter <= 'F')) {
						i++;
						currentStr += currentCharacter;
						currentCharacter = instring.charAt(i);
					} else {
						break;
					}
				}
				i++;
				currentStr += currentCharacter;
				currentCharacter = instring.charAt(i);

				if (currentCharacter == 'e' || currentCharacter == 'E') {
					i++;
					currentStr += currentCharacter;
					currentCharacter = instring.charAt(i);
					if (currentCharacter == '-' || currentCharacter == '+') {
						i += 1;
						currentStr += currentCharacter;
						currentCharacter = instring.charAt(i);
					}
					if (currentCharacter < '0' || currentCharacter > '9') error('Bad Exponent in Number: ', currentStr, row);
					do {
						i++;
						currentStr += currentCharacter;
						currentCharacter = instring.charAt(i);
					} while (currentCharacter >= '0' && currentCharacter <= '9');
				}

				if (currentCharacter >= 'a' && currentCharacter <= 'z') {
					//if currentStr is not finite (aka non-numerical) then it is a bad number!
					if (!isFinite(currentStr)) {
						currentStr += currentCharacter;
						i += 1;
						error('Bad Number: ', currentStr, row);
					}
				}
			}

			currentNum = currentStr;

			if (isFinite(currentNum)) {
				maketoken('number', currentNum, from, i, row);
			} else {
				error('Bad Number: ', currentStr, row);
			}
		} else if (currentCharacter == '\'' || currentCharacter == '"') { // String .. handles c style breaking codes. Ex: "elem" or "text"
			currentStr = '';
			currentQuoteChar = currentCharacter;
			i++;
			while (true) {
				currentCharacter = instring.charAt(i);
				if (currentCharacter < ' ') {
					if ((currentCharacter == '\n') || (currentCharacter == '\r') || (currentCharacter == '')) row++; // Add row if this white space is a row terminator
					/* Added a multiline string handler, no error message needed
					error('Unterminated String: ', currentStr, row);
					break; */
				}

				if (currentCharacter == currentQuoteChar) break;

				if (currentCharacter == '\\') {
					i += 1;
					if (i >= length) {
						error('Unterminated String: ', currentStr, row);
						break;
					}
					currentCharacter = instring.charAt(i);
					nextCharacter = instring.charAt(i+1);

					if (currentCharacter == 'b') {
						if (nextCharacter == currentQuoteChar) {
							currentCharacter = "\\b";
						} else {
							currentCharacter = '\b';
							break;
						}
					}
					if (currentCharacter == 'f') {
						if (nextCharacter == currentQuoteChar) {
							currentCharacter = "\\f";
						} else {
							currentCharacter = '\f';
							break;
						}
					}
					if (currentCharacter == 'n') {
						if (nextCharacter == currentQuoteChar) {
							currentCharacter = "\\n";
						} else {
							currentCharacter = '\n';
							break;
						}
					}
					if (currentCharacter == 'r') {
						if (nextCharacter == currentQuoteChar) {
							currentCharacter = "\\r";
						} else {
							currentCharacter = '\r';
							break;
						}
					}
					if (currentCharacter == 't') {
						if (nextCharacter == currentQuoteChar) {
							currentCharacter = "\\t";
						} else {
							currentCharacter = '\t';
							break;
						}
					}
					if (currentCharacter == 'u') {
						if (i >= length) {
							error('Unterminated String: ', currentStr, row);
							break;
						}
						currentCharacter = parseInt(this.substr(i + 1, 4), 16);
						if (!isFinite(currentCharacter) || currentCharacter < 0) {
							error('Unterminated String: ', currentStr, row);
							break;
						}
						currentCharacter = String.fromCharCode(currentCharacter);
						i += 4;
						break;
					}
				}
				currentStr += currentCharacter;
				i++;
			}
			i++;
			maketoken('string', currentCharacter + currentStr + currentCharacter, from, i, row);
			currentCharacter = instring.charAt(i);

		} else if (currentCharacter == '/' && instring.charAt(i + 1) == '/') { // Comment of // type ... does not cover block comments
			i++;
			currentStr = currentCharacter;
			while (true) {
				currentCharacter = instring.charAt(i);
				if (currentCharacter == '\n' || currentCharacter == '\r' || currentCharacter == '') {
					break;
				} else {
					currentStr += currentCharacter;
				}
				i++;
			}
			maketoken('rowcomment', currentStr, from, i, row);
			/* This does not have to be here because a newline creates in coderender function
			maketoken('newline',"",i,i,row); */

		} else if (currentCharacter == '<' && instring.charAt(i + 1) == '!' && instring.charAt(i + 2) == '-' && instring.charAt(i + 3) == '-') { // Comment of <!-- type
			i++;
			currentStr = currentCharacter;
			while (true) {
				currentCharacter = instring.charAt(i);
				if (currentCharacter == '\n' || currentCharacter == '\r' || currentCharacter == '') {
					break;
				} else {
					currentStr += currentCharacter;
				}
				i++;
			}
			maketoken('rowcomment', currentStr, from, i, row);

		} else if (currentCharacter == '/' && instring.charAt(i + 1) == '*') { // Block comment of /* type
			i++;
			currentStr = currentCharacter;
			while (true) {
				currentCharacter = instring.charAt(i);
				if ((currentCharacter == '*' && instring.charAt(i + 1) == '/') || (i == length)) {
					currentStr += "*/"
					i += 2;
					currentCharacter = instring.charAt(i);
					break;
				}
				if (currentCharacter == '\n' || currentCharacter == '\r' || currentCharacter == '') {
					// don't make blockcomment or newline if currentStr is empty
					if (currentStr != "") {
						maketoken('blockcomment', currentStr, from, i, row);
						maketoken('newline', "", i, i, row);
						row++;
						currentStr = "";
					}
				} else {
					currentStr += currentCharacter;
				}
				i++;
			}
			maketoken('blockcomment', currentStr, from, i, row);
		} else if (inprefix.indexOf(currentCharacter) >= 0) { // Multi-character Operators
			currentStr = currentCharacter;
			i++;
			while (true) {
				currentCharacter = instring.charAt(i);
				if (i >= length || insuffix.indexOf(currentCharacter) < 0) {
					break;
				}
				currentStr += currentCharacter;
				i++;
			}
			maketoken('operator', currentStr, from, i, row);
		} else { // Single-character Operators
			i++;
			maketoken('operator', currentCharacter, from, i, row);
			currentCharacter = instring.charAt(i);
		}
	}
  
  console.log(tokens);
}

//----------------------------------------------------------------------------------
//	Function to change the popoverbox for different html tags
//	The case name is the name of the html tag
//----------------------------------------------------------------------------------

function popoverbox(titleData) {
	var popoverMessage = "test";
	if (titleData == "html") {
		popoverMessage = "Defines the root of an HTML document";
	} else if (titleData == "head") {
		popoverMessage = "Defines information about the document";
	} else if (titleData == "body") {
		popoverMessage = "Defines the document's body";
	} else if (titleData == "div") {
		popoverMessage = "Defines a section in a document";
	} else if (titleData == "span") {
		popoverMessage = "Defines a section in a document";
	} else if (titleData == "doctype") {
		popoverMessage = "An instruction to the web browser about what version of HTML the page is written in";
	} else if (titleData == "") {
		popoverMessage = "";
	}

	return popoverMessage;
}

//----------------------------------------------------------------------------------
// Renders a set of tokens from a string into a code viewer div
// Requires tokens created by a cockford-type tokenizer
//                Is called by [this function] in [this file]
//----------------------------------------------------------------------------------

function rendercode(codestring, boxid, wordlistid, boxfilename) {
	var destinationdiv = "box" + boxid;
	tokens = [];

	important = [];
	for (var i = 0; i < retData.impwords.length; i++) {
		important[i] = retData.impwords[i];
	}

	keywords = [];
	for (var i = 0; i < retData['words'].length; i++) {
		if (retData['words'][i][0] == wordlistid) {
			keywords[retData['words'][i][1]] = retData['words'][i][2];
		}
	}

	improws = [];
	for (var i = 0; i < retData.improws.length; i++) {
		if ((retData['improws'][i][0]) == boxid) {
			improws.push(retData.improws[i]);
		}
	}
	tokenize(codestring, "<>+-&", "=>&:");

	// Iterate over token objects and print kind of each token and token type in window
	printout = document.getElementById(destinationdiv);
	str = "";
	cont = "";
	lineno = 0;
	str += "<div id='textwrapper" + boxid + "' class='normtextwrapper'>";

	pcount = 0;
	parenthesis = new Array();
	bcount = 0;
	bracket = new Array();
	cbcount = 0;
	cbracket = new Array();

	htmlArray = new Array('wbr', 'video', 'u', 'time', 'template', 'svg', 'summary', 'section', 's', 'ruby', 'rt', 'rp', 'progress', 'picture', 'output', 'nav', 'meter', 'mark', 'main', 'img', 'iframe', 'header', 'footer', 'figure', 'figcaption', 'dialog', 'details', 'datalist', 'data', 'bdi', 'audio', 'aside', 'article', 'html', 'head', 'body', 'div', 'span', 'doctype', 'title', 'link', 'meta', 'style', 'canvas', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'abbr', 'acronym', 'address', 'bdo', 'blockquote', 'cite', 'q', 'code', 'ins', 'del', 'dfn', 'kbd', 'pre', 'samp', 'var', 'br', 'a', 'base', 'img', 'area', 'map', 'object', 'param', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot', 'col', 'colgroup', 'caption', 'form', 'input', 'textarea', 'select', 'option', 'optgroup', 'button', 'label', 'fieldset', 'legend', 'script', 'noscript', 'b', 'i', 'tt', 'sub', 'sup', 'big', 'small', 'hr', 'relativelayout', 'textview', 'webview', 'manifest', 'uses', 'permission', 'application', 'activity', 'intent');
	htmlArrayNoSlash = new Array('area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'textview', 'webview', 'uses');
	cssArray = new Array('accelerator', 'azimuth', 'background', 'background-attachment', 'background-color', 'background-image', 'background-position', 'background-position-x', 'background-position-y', 'background-repeat', 'behavior', 'border', 'border-bottom', 'border-bottom-color', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color', 'border-left', 'border-left-color', 'border-left-style', 'border-left-width', 'border-right',
		'border-right-color', 'border-right-style', 'border-right-width', 'border-spacing', 'border-style', 'border-top', 'border-top-color', 'border-top-style', 'border-top-width', 'border-width', 'bottom', 'caption-side', 'clear', 'clip', 'color', 'content', 'counter-increment', 'counter-reset', 'cue', 'cue-after', 'cue-before', 'cursor', 'direction', 'display', 'elevation', 'empty-cells', 'filter', 'float', 'font', 'font-family', 'font-size',
		'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'height', 'ime-mode', 'include-source', 'layer-background-color', 'layer-background-image', 'layout-flow', 'layout-grid', 'layout-grid-char', 'layout-grid-char-spacing', 'layout-grid-line', 'layout-grid-mode', 'layout-grid-type', 'left', 'letter-spacing', 'line-break', 'line-height', 'list-style', 'list-style-image', 'list-style-position', 'list-style-type', 'margin',
		'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'marker-offset', 'marks', 'max-height', 'max-width', 'min-height', 'min-width', '-moz-binding', '-moz-border-radius', '-moz-border-radius-topleft', '-moz-border-radius-topright', '-moz-border-radius-bottomright', '-moz-border-radius-bottomleft', '-moz-border-top-colors', '-moz-border-right-colors', '-moz-border-bottom-colors', '-moz-border-left-colors', '-moz-opacity', '-moz-outline',
		'-moz-outline-color', '-moz-outline-style', '-moz-outline-width', '-moz-user-focus', '-moz-user-input', '-moz-user-modify', '-moz-user-select', 'orphans', 'outline', 'outline-color', 'outline-style', 'outline-width', 'overflow', 'overflow-X', 'overflow-Y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'page', 'page-break-after', 'page-break-before', 'page-break-inside', 'pause', 'pause-after', 'pause-before', 'pitch',
		'pitch-range', 'play-during', 'position', 'quotes', '-replace', 'richness', 'right', 'ruby-align', 'ruby-overhang', 'ruby-position', '-set-link-source', 'size', 'speak', 'speak-header', 'speak-numeral', 'speak-punctuation', 'speech-rate', 'stress', 'scrollbar-arrow-color', 'scrollbar-base-color', 'scrollbar-dark-shadow-color', 'scrollbar-face-color', 'scrollbar-highlight-color', 'scrollbar-shadow-color', 'scrollbar-3d-light-color', 'scrollbar-track-color',
		'table-layout', 'text-align', 'text-align-last', 'text-decoration', 'text-indent', 'text-justify', 'text-overflow', 'text-shadow', 'text-transform', 'text-autospace', 'text-kashida-space', 'text-underline-position', 'top', 'unicode-bidi', '-use-link-source', 'vertical-align', 'visibility', 'voice-family', 'volume', 'white-space', 'widows', 'width', 'word-break', 'z-index', 'zoom', 'word-spacing', 'word-wrap', 'writing-mode');
	var cssTagCount = 0;
	var htmlTagCount = 0;

	htmlTag = new Array();
	cssTag = new Array();

	//html part
	pid = "";
	var iwcounter = 0;
	for (i = 0; i < tokens.length; i++) {
		tokenvalue = String(tokens[i].val);

		if (tokens[i].kind == "rowcomment" || tokens[i].kind == "blockcomment" || tokens[i].kind == "string" || tokens[i].kind == "number" || tokens[i].kind == "name") {
			// Fix to remove html tags in strings
			tokenvalue = tokenvalue.replace(/&/g, "&amp;");
			tokenvalue = tokenvalue.replace(/\</g, "&lt;");
			tokenvalue = tokenvalue.replace(/\>/g, "&gt;");
		}
		// Make white space characters
		tokenvalue = tokenvalue.replace(/ /g, '&nbsp;');
		tokenvalue = tokenvalue.replace(/\\t/g, '&nbsp;&nbsp;');

		if (tokens[i].kind == "rowcomment") {
			cont += "<span class='comment'>" + tokenvalue + "</span>";
		} else if (tokens[i].kind == "blockcomment") {
			cont += "<span class='comment'>" + tokenvalue + "</span>";
		} else if (tokens[i].kind == "string") {
			// To represent a multilined string in the codeviewer window
			if (tokenvalue.includes('\n') || tokenvalue.includes('\r')) {
				var tokenString =tokenvalue;
				var partialTokenString;
				var currentTokenCharacter;
				var tokenIndex = 0;
				var tokenQuotationMark = tokenString.charAt(0);

				partialTokenString = "";
				while (true) {
					currentTokenCharacter = tokenString.charAt(tokenIndex);
					if (currentTokenCharacter == tokenQuotationMark && tokenIndex != 0) {
						// At the end of the string
						partialTokenString += currentTokenCharacter;
						cont += `<span class='string'>${partialTokenString}</span>`;
						break;
					}
					if (currentTokenCharacter < ' ') {
						if ((currentTokenCharacter == '\n') || (currentTokenCharacter == '\r') || (currentTokenCharacter == '')) {
							// Creates a new line when a line break character is in the string
							cont += `<span class='string'>${partialTokenString}</span>`;
							lineno++;
							str += `<div id='${boxfilename}-line${lineno}' class='normtext' style='line-height:21px'><span class='blockBtnSlot'></span>${cont}</div>`;
							cont = "";
							partialTokenString = "";
						}
					}
					// replace '<' and '>' with &lt; and &gt; to prevent html tags in the string to mess with the HTML DOM
					if (currentTokenCharacter == '<') currentTokenCharacter = '&lt;';
					if (currentTokenCharacter == '>') currentTokenCharacter = '&gt;';
					tokenIndex++;
					partialTokenString += currentTokenCharacter;
				}
			} else {
				cont+=`<span class='string'>${tokenvalue}</span>`;
			}
		} else if (tokens[i].kind == "number") {
			cont += "<span class='number'>" + tokenvalue + "</span>";
		} else if (tokens[i].kind == "name") {
			var foundkey = 0;
			//If tokenvalue exists in the array for important words
			if (important.indexOf(tokenvalue) != -1) {
				foundkey = 2;
				//Uses smart indexing to find if token value exists in array, if tokenvalue == length the statement is true
			} else if (keywords[tokenvalue] != null) {
				foundkey = 1;
			}

			if (foundkey == 1) {
				cont += "<span class='keyword" + keywords[tokenvalue] + "'>" + tokenvalue + "</span>";
			} else if (foundkey == 2) {
				iwcounter++;
				cont += "<span id='IW" + iwcounter + "' class='impword' onclick='popupDocumentation(\"" + tokenvalue + "\", \"multi\");' onmouseover='highlightKeyword(\"" + tokenvalue + "\")' onmouseout='highlightKeyword(\"" + tokenvalue + "\")'>" + tokenvalue + "</span>";
			} else {
				cont += tokenvalue;
			}

		} else if (tokens[i].kind == "operator") {
			if (tokenvalue == "(") {
				pid = "PA" + pcount + boxid;
				pcount++;
				parenthesis.push(pid);
				cont += "<span id='" + pid + "' class='oper' onmouseover='highlightop(\"P" + pid + "\",\"" + pid + "\");' onmouseout='highlightop(\"P" + pid + "\",\"" + pid + "\");'>" + tokenvalue + "</span>";
			} else if (tokenvalue == ")") {
				pid = parenthesis.pop();
				cont += "<span id='P" + pid + "' class='oper' onmouseover='highlightop(\"" + pid + "\",\"P" + pid + "\");' onmouseout='highlightop(\"" + pid + "\",\"P" + pid + "\");'>" + tokenvalue + "</span>";
			} else if (tokenvalue == "[") {
				pid = "BR" + bcount;
				bcount++;
				bracket.push(pid);
				cont += "<span id='" + pid + "' class='oper' onmouseover='highlightop(\"P" + pid + "\",\"" + pid + "\");' onmouseout='highlightop(\"P" + pid + "\",\"" + pid + "\");'>" + tokenvalue + "</span>";
			} else if (tokenvalue == "]") {
				pid = bracket.pop();
				cont += "<span id='P" + pid + "' class='oper' onmouseover='highlightop(\"" + pid + "\",\"P" + pid + "\");' onmouseout='highlightop(\"" + pid + "\",\"P" + pid + "\");'>" + tokenvalue + "</span>";
			} else if (tokenvalue == "{") {
				// [token row position, 1 = opening bracket, codeviewer box id]
				allBlocks.push([tokens[i].row, 1, parseInt(boxid)]);
				pid = "CBR" + cbcount + boxid;
				cbcount++;
				cbracket.push(pid);
				cont += "<span id='" + pid + "' class='oper' onmouseover='highlightop(\"P" + pid + "\",\"" + pid + "\");' onmouseout='highlightop(\"P" + pid + "\",\"" + pid + "\");'>" + tokenvalue + "</span>";
			} else if (tokenvalue == "}") {
				// [token row position, 0 = closing bracket, codeviewer box id]
				allBlocks.push([tokens[i].row, 0, parseInt(boxid)]);
				pid = cbracket.pop();
				cont += "<span id='P" + pid + "' class='oper' onmouseover='highlightop(\"" + pid + "\",\"P" + pid + "\");' onmouseout='highlightop(\"" + pid + "\",\"P" + pid + "\");'>" + tokenvalue + "</span>";
			} else if (tokenvalue == "<") {
				// This statement checks the character after < to make sure it is a valid tag.
                                coloringcode = tokens[i].val + "" + tokens[i + 1].val+"" + tokens[i + 2].val;
				switch(coloringcode) {
					case "<html>":
					case "</html":
						fontcolor = "#fc2d2d";
						break;
					case "<link ":
						fontcolor = "blue";
						break;
					case "<h1>":
					case "</h1":
						fontcolor = "#4f5aff";
						break;
					case "<title>":
					case "</title":
						fontcolor = "green";
						break;
					case "<body>":
					case "</body":
						fontcolor = "#bf1d46";
						break;
					case "<p>":
					case "</p":
						fontcolor = "#a3a300";
						break;
					case "<script ":
					case "</script":
						fontcolor = "#ff8000";
						break;
                    case "<header>":
					case "</header":
						fontcolor = "#FF1493";
						break;
					default: 
						fontcolor = "#4f5aff";
						break;
				}

				// Enables collapsible html tags
				if (String(tokens[i + 1].kind) == "name") {
					// Ensures that void elements do not count as opening html tags
					if (htmlArrayNoSlash.indexOf(tokens[i + 1].val.toLowerCase()) == -1) {
						// [token row position, 1 = opening html tag, codeviewer box id]
						allBlocks.push([tokens[i + 1].row, 1, parseInt(boxid)]);
					}	
				}
				else if (String(tokens[i + 1].kind) == "operator" && String(tokens[i + 1].val) == "/" && String(tokens[i + 2].kind) == "name") {
					// [token row position, 0 = closing html tag, codeviewer box id]
					allBlocks.push([tokens[i + 1].row, 0, parseInt(boxid)]);
				}
				// ↑ added in pull request #11411 (START) 

				tokenvalue = "&lt;";
				if (isNumber(tokens[i + 1].val) == false && tokens[i + 1].val != "/" && tokens[i + 1].val != "!" && tokens[i + 1].val != "?") {
					if (htmlArray.indexOf(tokens[i + 1].val.toLowerCase()) > -1) {
						var k = 2;
						var foundEnd = false;

						//If a > has been found on the same line as an < and the token to the left of < is in htmlArray then it classes it as an html-tag
						while (i + k < tokens.length) {
							if (tokens[i + k].val == ">") {
								foundEnd = true;
								break;
							}
							k++;
						}
						if (foundEnd) {
							pid = "html" + htmlTagCount + boxid;
							htmlTagCount++;
							if (htmlArrayNoSlash.indexOf(tokens[i + 1].val.toLowerCase()) == -1) {
								htmlTag.push(pid);
								cont += "&lt" + "<span style='color: "+fontcolor+"' id='" + pid + "' class='oper' onclick='popupDocumentation(this.id, \"html\");' onmouseover='highlightHtml(\"P" + pid + "\",\"" + pid + "\");' onmouseout='highlightHtml(\"P" + pid + "\",\"" + pid + "\");'>" + tokens[i + 1].val;
							} else {
								cont += "&lt" + "<span style='color: "+fontcolor+"' id='" + pid + "' class='oper' onclick='popupDocumentation(this.id, \"html\");'>" + tokens[i + 1].val;
							}
							cont += "</span>";
							i = i + 1;
						} else {
							cont += "<span class='oper'>" + tokenvalue + "</span>";
						}
					} else {
						cont += "<span class='oper'>" + tokenvalue + "</span>";
					}
				} else if (tokens[i + 1].val == "/") {
					if (htmlArray.indexOf(tokens[i + 2].val.toLowerCase()) > -1) {
						if (htmlArrayNoSlash.indexOf(tokens[i + 1].val.toLowerCase()) == -1) {
							pid = htmlTag.pop();
							cont += "&lt" + tokens[i + 1].val + "<span style='color: "+fontcolor+"'  id='P" + pid + "' class='oper' onclick='popupDocumentation(this.id, \"html\");' onmouseover='highlightHtml(\"" + pid + "\",\"P" + pid + "\");' onmouseout='highlightHtml(\"" + pid + "\",\"P" + pid + "\");'>" + tokens[i + 2].val + "</span>" + tokens[i + 3].val;
						} else {
							htmlTagCount++;
							pid = "html" + htmlTagCount + boxid;
							cont += "&lt" + tokens[i + 1].val + "<span style='color: "+fontcolor+"'  id='P" + pid + "' class='oper' onclick='popupDocumentation(this.id, \"html\");'>" + tokens[i + 2].val + "</span>" + tokens[i + 3].val;
						}
						i = i + 3;
					} else {
						cont += "<span class='oper'>" + tokenvalue + "</span>";
					}
				} else {
					cont += "<span class='oper'>" + tokenvalue + "</span>";
				}
			} else {
				cont += "<span class='oper'>" + tokenvalue + "</span>";
			}
		} else {
			cont += tokenvalue;
		}
		// tokens.length-1 so the last line will be printed out
		if (tokens[i].kind == "newline" || i == tokens.length - 1) {
			// Help empty lines to be printed out
			if (cont == "") cont = "&nbsp;";
			// Count how many linenumbers that'll be needed
			lineno++;
			// Print out normal rows if no important exists
			if (improws.length == 0) {
				str += `<div id='${boxfilename}-line${lineno}' class='normtext' style='line-height:21px'><span class='blockBtnSlot'></span>${cont}</div>`;
			} else {
				// Print out important lines
				for (var kp = 0; kp < improws.length; kp++) {
					if (lineno >= parseInt(improws[kp][1]) && lineno <= parseInt(improws[kp][2])) {
						str += "<div id='" + boxfilename + "-line" + lineno + "' class='impo' style='line-height:21px'><span class='blockBtnSlot'></span>" + cont + "</div>";
						break;
					} else {
						if (kp == (improws.length - 1)) {
							str += `<div id='${boxfilename}-line${lineno}' class='normtext' style='line-height:21px'><span class='blockBtnSlot'></span>${cont}</div>`;
						}
					}
				}
			}
			cont = "";
		}
	}
	str += "</div>";

	// Print out rendered code and border with numbers
	printout.innerHTML = createCodeborder(lineno, improws) + str;


	// Print out rendered code and border with numbers
	printout.innerHTML = createCodeborder(lineno, improws) + str;
	var borders = [...document.querySelectorAll('.codeborder')];
	borders.forEach(border => {
		var parentScrollHeight = border.parentNode.scrollHeight;
		var parentHeight = border.parentNode.clientHeight;
		border.style.height = parentScrollHeight;
		border.style.minHeight = parentHeight;
	});
}

function getBlockRanges(blocks) {
	var boxBlocks = []; // Array to hold each box array

	// Sort by boxid and split array depending on how many boxes we have
	blocks.sort(([a,b,c], [d,e,f]) => f - c);

	var tempArray = [];
	for (var i = 0; i < blocks.length; i++) {
		if (i !== 0 && blocks[i-1][2] !== blocks[i][2]) {
			// Last iteration had a different boxid, start a new array
			boxBlocks.push(tempArray);
			tempArray = [];
		}
		tempArray.push(blocks[i]);
	}
	boxBlocks.push(tempArray);

	// Sort the arrays
	for (var i = 0; i < boxBlocks.length; i++) {
		boxBlocks[i].sort(([a,b], [c,d]) => a - c);
	}

	// Determine block ranges
	var boxRanges = {};
	var ranges = [];
	var openBlock = false;
	var blocks;
	for (var i = 0; i < boxBlocks.length; i++) {
		blocks = boxBlocks[i];
		if (blocks.length < 1) continue;
		for (var j = 0; j < blocks.length; j++) {
			// If there are no open blocks and the bracket is a closing bracket, do nothing.
			if (!openBlock && blocks[j][1] === 0) continue;
			
			// Opening bracket
			if (blocks[j][1] === 1) {
				ranges.push([blocks[j][0], 0]);
				openBlock = true;
			}
			// Closing bracket
			if (blocks[j][1] === 0) {
				// Find first entry in ranges array with no closing bracket
				for (var k = ranges.length - 1; k > -1; k--) {
					if (ranges[k][1] === 0) {
						
						if (ranges[k][0] !== blocks[j][0]) {
							// We found the first open bracket, and the block is completed
							ranges[k][1] = blocks[j][0];
						} else { 
							// If the opening bracket is on the same row as the closing bracket we remove that entry
							ranges.splice(k, 1);
						}
						break;
					}
				}
				
				// Check if there are any open blocks in the ranges array
				var containsOpenBlock = function(arr) {
					return arr.includes(0)
				}
				if (!ranges.some(containsOpenBlock)) openBlock = false;
			}
		}
		openBlock = false;
		var key = boxBlocks[i][0][2];
		boxRanges[key] = ranges;
		ranges = [];
	}
	return boxRanges;
}

// ↓ relevant function to collapsible brackets
function createBlocks(ranges, boxid) {
	var wrapper = document.querySelector('#textwrapper'+boxid);
	for (var i = 0; i < ranges.length; i++) {
		var blockStartRow = wrapper.querySelector("div[id$='"+ranges[i][0]+"']");
		var buttonSlot = blockStartRow.querySelector("span:first-child");
		buttonSlot.classList.add('open-block');
		buttonSlot.classList.add('occupied');
		buttonSlot.id = i;
		buttonSlot.addEventListener('click', (e) => {
			var button = e.target;
			button.classList.toggle('open-block');
			button.classList.toggle('closed-block');
			toggleRows(ranges, ranges[button.id][0], ranges[button.id][1], e.target);
		});
	}
}

// Update rows encapsulated in collapsible brackets
function toggleRows(ranges, startRow, endRow, button) {
	var baseRow = button.parentNode;
	var wrapper = baseRow.parentNode;
	var box = wrapper.parentNode;
	var numbers = [...box.querySelectorAll('.codeborder div')];
	var display;
	var ellipses = document.createElement('span');
	ellipses.classList.add('blockEllipses');
	ellipses.innerHTML = ' ...';

	if (button.classList.contains('closed-block')) {
		display = 'none';
		baseRow.appendChild(ellipses);
	} else {
		display = 'block';
		ellipses = baseRow.querySelector('.blockEllipses');
		if(ellipses)
			baseRow.removeChild(ellipses);
	}
	
	// Show or hide rows between collapsible brackets
	for (var i = 1; i < endRow - startRow; i++) {
		var rowNumber = startRow + i;
		var row = wrapper.querySelector("div[id$='" + rowNumber + "']");
		var tempButton = row.querySelector("span.blockBtnSlot.occupied");
		if (tempButton &&  display == 'block') {
			// Update nested set of collapsible brackets recursively
			toggleRows(ranges, ranges[tempButton.id][0], ranges[tempButton.id][1], tempButton)
			i += ranges[tempButton.id][1] - ranges[tempButton.id][0] - 1;
		}
		
		row.style.display = display;
		numbers[rowNumber - 1].style.display = display;
	}
}


//----------------------------------------------------------------------------------
// createCodeborder: function to create a border with line numbers
//                Is called by rendercode in codeviewer.js
//----------------------------------------------------------------------------------

function createCodeborder(lineno, improws) {
	var str = "<div class='codeborder' style='z-index: 2;'>"; // The z-index places the code border above the copy to clipboard notification
	for (var i = 1; i <= lineno; i++) {
		// Print out normal numbers
		if (improws.length == 0) {
			str += "<div class='no'>" + (i) + "</div>";
		} else {
			// Print out numbers for an important row
			for (var kp = 0; kp < improws.length; kp++) {
				if (i >= parseInt(improws[kp][1]) && i <= parseInt(improws[kp][2])) {
					str += "<div class='impono'>" + (i) + "</div>";
					break;
				} else {
					if (kp == (improws.length - 1)) {
						str += "<div class='no'>" + (i) + "</div>";
					}
				}
			}
		}
	}

	str += "</div>";
	return str;
}

//----------------------------------------------------------------------------------
// changetemplate: Change template by updating hidden field
//                Is called at line 223-229 in EditorV50.php
//----------------------------------------------------------------------------------

function changetemplate(templateno) 
{
	document.querySelectorAll(".tmpl").forEach(function (index) {
		index.style.backgroundColor = '#ccc';
	});

	document.getElementById("templat" + templateno).style.backgroundColor = "#fc4";
	document.getElementById("templateno").value = templateno;

	var templateOptions = document.getElementById('templateOptions');
	var boxes;
	switch (templateno) {
		case '1':
			boxes = 2;
			break;
		case '2':
			boxes = 2;
			break;
		case '3':
			boxes = 3;
			break;
		case '4':
			boxes = 3;
			break;
		case '5':
			boxes = 4;
			break;
		case '6':
			boxes = 4;
			break;
		case '7':
			boxes = 4;
			break;
		case '8':
			boxes = 3;
			break;
		case '9':
			boxes = 5;
			break;
		case '10':
			boxes = 1;
			break;
	}

	var str = "";
	var wordl = retData['wordlists'];

	for (var i = 0; i < boxes; i++) {
		str += "<tr><td><label>Kind: </label><select class='templateSelect' id='boxcontent_" + i + "' onchange='changeDirectory(this)'>";
		str += "<option value='CODE'>Code</option><option value='IFRAME'>Preview</option><option value='DOCUMENT'>Document</option></select></td>";
		str += "<td><label>File: </label><select class='templateSelect' id='filename_" + i + "'></select></td>";
		str += "<td><label>Wordlist: </label><select class='templateSelect' id='wordlist_" + i + "'>";
		for (var j = 0; j < wordl.length; j++) {
			str += "<option value='" + wordl[j][0] + "'>" + wordl[j][1] + "</option>";
		}
		str += "</select></td></tr>";
	}
	templateOptions.innerHTML = str;
	for (var i = 0; i < boxes; i++) {
		if (i < retData['box'].length) {
			var select = templateOptions.querySelectorAll(".templateSelect");
			select[0 + i * 3].value = retData['box'][i][1];
			changeDirectory(document.querySelector('#boxcontent_' + i));
			select[1 + i * 3].value = retData['box'][i][5];
			select[2 + i * 3].value = retData['box'][i][3];
		} else {
			changeDirectory(document.querySelector('#boxcontent_' + i));
		}
	}
}

//----------------------------------------------------------------------------------
// updateTemplate: Write template hidden field to database
//                Is called at line 234 in EditorV50.php
//----------------------------------------------------------------------------------

function updateTemplate() {
	var templateno = document.getElementById("templateno").value;
	document.getElementById("chooseTemplateContainer").style.display = "none";
 
	var selectBoxes = [...document.querySelectorAll('#templateOptions select')];
	var examples = selectBoxes.length / 3;
	try {
		var courseid = querystring['courseid'];
		var exampleid = querystring['exampleid'];
		var cvers = querystring['cvers'];
		var content = [];
		for (var i = 0; i < examples; i++) {
			var values = [document.getElementById("boxcontent_" + i).value, document.getElementById("filename_" + i).value, document.getElementById("wordlist_" + i).value];
			content.push(values)
		}
		AJAXService("SETTEMPL", {
			courseid: courseid,
			exampleid: exampleid,
			cvers: cvers,
			templateno: templateno,
			content: content
		}, "CODEVIEW");
	} catch (e) {
		alert("Error when updating template: " + e.message)
	}
}

//----------------------------------------------------------------------------------
// closeEditContent:
//                Is called at line 141 in EditorV50.php
//----------------------------------------------------------------------------------

function closeEditContent() {
	var editBox = document.getElementById("boxtitle2");
	editBox.setAttribute("contenteditable", true);
	document.getElementById("editContentContainer").style.display = "none";
	openBoxID = null;
}

//----------------------------------------------------------------------------------
// closeEditExample:
//                Is called at line 183 in EditorV50.php
//----------------------------------------------------------------------------------

function closeEditExample() {
	var closeEditExample = document.getElementById("editExampleContainer");
	closeEditExample.style.display = "none";
}

//----------------------------------------------------------------------------------
// openTemplateWindow:
//                Is called at line 53 in EditorV50.php
//----------------------------------------------------------------------------------

function openTemplateWindow() {
	if (retData != null)
		changetemplate(String(retData['templateid']));
	document.getElementById("chooseTemplateContainer").style.display = "flex";
}

//----------------------------------------------------------------------------------
// closeTemplateWindow:
//                Is called at line 218 in EditorV50.php
//----------------------------------------------------------------------------------

function closeTemplateWindow() {
	document.getElementById("chooseTemplateContainer").style.display = "none";
}

//----------------------------------------------------------------------------------
// Play:
//					Is called at line 195 in EditorV50.php and line 56 in navheader.php
//----------------------------------------------------------------------------------

function Play(event) {
	if (retData['playlink'] != null) {
		if (retData['playlink'].indexOf("http") == 0) {
			window.location.href = retData['playlink'];
		} else {
			var urlText = "";
			if (retData['public'] === "1") {
				urlText = "global/" + retData['playlink'];
			} else {
				urlText = retData['courseid'] + "/" + retData['playlink'];
			}
			//current url for the page
			surl = window.location.href;
			//relative path
			var prefix = "/../courses/";
			surl = surl.substring(0, surl.lastIndexOf("/"));
			var win = window.open(surl + prefix + urlText, '_blank');
			win.focus();

		}
	}
}

function minimizeBoxes(boxid) 
{
	thisBox = document.querySelector('#box' + boxid + 'wrapper #boxtitlewrapper');
	thisBox1 = document.querySelector('#box' + 1 + 'wrapper #boxtitlewrapper');
	thisBox2 = document.querySelector('#box' + 2 + 'wrapper #boxtitlewrapper');
	thisBox3 = document.querySelector('#box' + 3 + 'wrapper #boxtitlewrapper');
	thisBox4 = document.querySelector('#box' + 4 + 'wrapper #boxtitlewrapper');
	thisBox5 = document.querySelector('#box' + 5 + 'wrapper #boxtitlewrapper');
	var boxid = boxid;
	var parentDiv = document.getElementById("div2");
	var boxValArray = initResizableBoxValues(parentDiv);
	var templateid = retData['templateid'];

	getLocalStorageProperties(boxValArray);

	//For template 1
	if (templateid == 1) {
		if (boxid == 1) {
			document.querySelector(boxValArray['box' + 2]['id']).style.width = "100%";
			document.querySelector(boxValArray['box' + boxid]['id']).style.width = "0%";
			alignBoxesWidth(boxValArray, 1, 2);
            thisBox2.classList.remove('hidden');
            setTimeout(function () {
                thisBox2.classList.remove('visuallyhidden');
            }, 20);
		}
		if (boxid == 2) {
			document.querySelector(boxValArray['box' + 1]['id']).style.width = "100%";
			document.querySelector(boxValArray['box' + boxid]['id']).style.width = "0%";
			alignBoxesWidth(boxValArray, 1, 2);
            thisBox1.classList.remove('hidden');
            setTimeout(function () {
                thisBox1.classList.remove('visuallyhidden');
            }, 20);
		}
	}

	//for template 2
	if (templateid == 2) {
		if (boxid == 1) {
			document.querySelector(boxValArray['box' + 2]['id']).style.height = "100%";
			document.querySelector(boxValArray['box' + boxid]['id']).style.height ="10%";
			alignBoxesHeight2boxes(boxValArray, 1, 2);
		}
			if (boxid == 2) {
			document.querySelector(boxValArray['box' + 1]['id']).style.height = "100%";

			document.querySelector(boxValArray['box' + boxid]['id']).style.height = "10%";
			alignBoxesHeight2boxes(boxValArray, 2, 1);
		}
	}

	//for template 3
	if (templateid == 3) {
		if(boxid == 1){
			for (var i = 1; i <= 3; i++) {
				document.querySelector(boxValArray['box' + i]['id']).style.height = "50%";
				document.querySelector(boxValArray['box' + boxid]['id']).style.height = "10%";
				document.querySelector(boxValArray['box' + i]['id']).style.width = "100%";
				document.querySelector(boxValArray['box' + boxid]['id']).style.width = "10%";
			}
			thisBox.classList.remove('hidden');
            setTimeout(function () {
                thisBox.classList.add('hidden');
                thisBox.classList.add('visuallyhidden');
            }, 20);
		}else{
			for (var i = 1; i <= 3; i++) {
				document.querySelector(boxValArray['box' + i]['id']).style.height = "100%";
				document.querySelector(boxValArray['box' + boxid]['id']).style.height = "10%";
			}
			thisBox.classList.remove('hidden');
		}
	}

	//for template 4
	if (templateid == 4){
		if(boxid == 3){
			for(var i = 1; i <= 3; i++){	
				document.querySelector(boxValArray['box' + i]['id']).style.height = "90%";
				document.querySelector(boxValArray['box' + boxid]['id']).style.height = "10%";
				document.querySelector(boxValArray['box' + i]['id']).style.width = "50%";
				document.querySelector(boxValArray['box' + boxid]['id']).style.width = "100%";
			}
			thisBox1.classList.remove('hidden');
			thisBox2.classList.remove('hidden');
			thisBox1.classList.remove('visuallyhidden');
			thisBox2.classList.remove('visuallyhidden');
		}else{
			for(var i = 1; i <= 3; i++){
				document.querySelector(boxValArray['box' + i]['id']).style.width = "100%";
				document.querySelector(boxValArray['box' + boxid]['id']).style.width = "10%";
			}
			thisBox1.classList.remove('hidden');
			thisBox2.classList.remove('hidden');
			thisBox1.classList.remove('visuallyhidden');
			thisBox2.classList.remove('visuallyhidden');
            setTimeout(function () {
                thisBox.classList.add('hidden');
                thisBox.classList.add('visuallyhidden');
            }, 20);	
		}	
	}

    //for template 5
    if(templateid == 5){
        if(boxid == 1 || boxid == 3){
			document.querySelector(boxValArray['box' + (boxid + 1)]['id']).style.width = "100%";
			document.querySelector(boxValArray['box' + boxid]['id']).style.width = "10%";
            thisBox2.classList.remove('hidden');
            thisBox4.classList.remove('hidden');
            thisBox2.classList.remove('visuallyhidden');
            thisBox4.classList.remove('visuallyhidden');
            setTimeout(function () {
                thisBox.classList.add('hidden');
                thisBox.classList.add('visuallyhidden');
            }, 20);    
        }else{
            document.querySelector(boxValArray['box' + (boxid - 1)]['id']).style.width = "100%";
			document.querySelector(boxValArray['box' + boxid]['id']).style.width = "10%";
            thisBox1.classList.remove('hidden');
            thisBox3.classList.remove('hidden');
            thisBox1.classList.remove('visuallyhidden');
            thisBox3.classList.remove('visuallyhidden');
            setTimeout(function () {
                thisBox.classList.add('hidden');
                thisBox.classList.add('visuallyhidden');
            }, 20);    
        }

	}

	//for template 6
	if(templateid == 6){
		if(boxid == 1){
			for(var i = 1; i <= 4; i++){
				document.querySelector(boxValArray['box' + i]['id']).style.width = "100%";
				document.querySelector(boxValArray['box' + boxid]['id']).style.width = "10%";
			}
            setTimeout(function () {
                thisBox.classList.add('hidden');
                thisBox.classList.add('visuallyhidden');
            }, 20); 
		}
		if(boxid == 2){
			document.querySelector(boxValArray['box' + boxid]['id']).style.height = "0%";
			alignBoxesHeight3stack(boxValArray, 2, 3, 4);
		}
		if(boxid == 3){
			document.querySelector(boxValArray['box' + 2]['id']).style.height = "50%";
			document.querySelector(boxValArray['box' + 4]['id']).style.height = "50%";
			document.querySelector(boxValArray['box' + boxid]['id']).style.height = "0%";
			alignBoxesHeight3stack(boxValArray, 2, 3, 4);
		}
		if(boxid == 4){
			document.querySelector(boxValArray['box' + boxid]['id']).style.height = "0%";
			alignBoxesHeight3stack(boxValArray, 2, 3, 4);
		}
	}

	//for template 7
	if(templateid == 7){
		if(boxid == 1){
			for(var i = 1; i <= 4; i++){	
				document.querySelector(boxValArray['box' + i]['id']).style.width = "100%";
				document.querySelector(boxValArray['box' + boxid]['id']).style.width = "10%";
			}
			setTimeout(function () {
                thisBox.classList.add('hidden');
                thisBox.classList.add('visuallyhidden');
            }, 20); 
		}
		if(boxid == 2){
			document.querySelector(boxValArray['box' + boxid]['id']).style.height = "0%";
			alignBoxesHeight3stack(boxValArray, 2, 3, 4);
		}
		if(boxid == 3){
			document.querySelector(boxValArray['box' + 2]['id']).style.height = "50%";
			document.querySelector(boxValArray['box' + 4]['id']).style.height = "50%";
			document.querySelector(boxValArray['box' + boxid]['id']).style.height = "0%";
			alignBoxesHeight3stack(boxValArray, 2, 3, 4);
		}
		if(boxid == 4){
			document.querySelector(boxValArray['box' + boxid]['id']).style.height = "0%";
			alignBoxesHeight3stack(boxValArray, 2, 3, 4);
		}
	}

	//for template 8
	if(templateid == 8){
		if(boxid == 1){
			for(i = 1; i <= 3; i++){
				document.querySelector(boxValArray['box' + i]['id']).style.width = "100%";
				document.querySelector(boxValArray['box' + boxid]['id']).style.width = "10%";
			}
			thisBox2.classList.remove('hidden');
			thisBox3.classList.remove('hidden');
			thisBox2.classList.remove('visuallyhidden');
			thisBox3.classList.remove('visuallyhidden');
			setTimeout(function () {
				thisBox.classList.add('hidden');
				thisBox.classList.add('visuallyhidden');
			}, 20);	
		}else{
			for(var i = 1; i <= 3; i++){
				document.querySelector(boxValArray['box' + i]['id']).style.height = "100%";
				document.querySelector(boxValArray['box' + boxid]['id']).style.height = "10%";
			}
		}
	}

	//for template 9
	if(templateid == 9){
		if(boxid == 1){
			for(var i = 1; i <= 5; i++){
				document.querySelector(boxValArray['box' + i]['id']).style.width = "100%";
				document.querySelector(boxValArray['box' + boxid]['id']).style.width = "10%";
			}
			setTimeout(function () {
                thisBox.classList.add('hidden');
                thisBox.classList.add('visuallyhidden');
            }, 20); 
		}
		if(boxid == 2){
			document.querySelector(boxValArray['box' + boxid]['id']).style.height = "0%";
			alignTemplate9Height3Stack(boxValArray, 2,3,4,5);
		}
		if(boxid == 3){
			document.querySelector(boxValArray['box' + 2]['id']).style.height = "33%";
			document.querySelector(boxValArray['box' + 4]['id']).style.height = "33%";
			document.querySelector(boxValArray['box' + boxid]['id']).style.height = "0%";
			alignTemplate9Height3Stack(boxValArray, 2,3,4,5);
		}
		if(boxid == 4){
			document.querySelector(boxValArray['box' + 2]['id']).style.height = "33%";
			document.querySelector(boxValArray['box' + 5]['id']).style.height = "33%";
			document.querySelector(boxValArray['box' + boxid]['id']).style.height = "0%";
			alignTemplate9Height3Stack(boxValArray, 2,3,4,5);
		}
		if(boxid == 5){
			document.querySelector(boxValArray['box' + boxid]['id']).style.height = "0%";
			alignTemplate9Height3Stack(boxValArray, 2,3,4,5);
		}
	}	
}

function hideCopyButtons(templateid, boxid) {
	var totalBoxes = getTotalBoxes(templateid);

	for (var i = 1; i <= totalBoxes; i++) {
		var copyBtn = document.querySelector('#box'+i+'wrapper #copyClipboard');
		if (i !== boxid) {
			if (!copyBtn) continue;
			copyBtn.style.display = "none";
		} else {
			if (!copyBtn) continue;
			copyBtn.style.display = "table-cell";
		}
	}
}

function showCopyButtons(templateid) {	
	var totalBoxes = getTotalBoxes(templateid);

		for (var i = 1; i <= totalBoxes; i++) {
		if (document.querySelector('#box' + i).className == 'box codebox') {
		document.querySelector('#box' + i + 'wrapper #copyClipboard').style.display = 'table-cell'
		}
	}
}

function getTotalBoxes(template) {
	var totalBoxes;

	if(template == 1){
		totalBoxes = 2;
	}
	if(template == 2){
		totalboxes = 2;
	}
	if(template == 3){
		totalboxes = 3;
	}
	if(template == 4){
		totalboxes = 3;
	}
	if(template == 5){
		totalBoxes = 4;
	}
	if(template == 6){
		totalBoxes = 4;
	}
	if(template == 7){
		totalboxes = 4;
	}
	if(template == 8){
		totalboxes = 3;
	}
	if(template == 9){
		totalboxes = 5;
	}
	if(template == 10){
		totalboxes = 1;
	}
	return totalBoxes;
}

//-----------------------------------------------------------------------------
// zoomText: Adding zooming functionality for text content of the boxes.
//			Is called by zoomIn & zoomOut buttons. 
//			Increment refers to the increment in font size.
//			Setting increment to a negative value allows for making the text smaller.
//-----------------------------------------------------------------------------

function zoomText(boxid, increment)
{
	//Upper & lower limit of how small text can get.
	var upperLimit = 21;
	var lowerLimit = 6; 

	var fontSize = parseInt(document.getElementById("box" + boxid).style.fontSize);
	
	if (isNaN(fontSize)) {
		fontSize = parseInt(window.getComputedStyle(document.getElementById("box" + boxid)).fontSize);
	  }
	  
	var zoomOutButton = document.querySelector('#box'+boxid+'wrapper #zoomOut');
	var zoomInButton = document.querySelector('#box'+boxid+'wrapper #zoomIn');


	if (increment > 0 && fontSize - increment < upperLimit || increment < 0 && fontSize + increment > lowerLimit){

		fontSize = fontSize + increment; 
		document.getElementById("box" + boxid).style.fontSize = fontSize + "px";
		
		enableZoomButton(zoomInButton);
		enableZoomButton(zoomOutButton);

	}
	
	//Disable zoom buttons on last click
	else if(increment < 0) {
			fontSize = fontSize + increment; 
			document.getElementById("box" + boxid).style.fontSize = fontSize + "px";
			disableZoomButton(zoomOutButton);
	}
		
	else if (increment > 0) {
			fontSize = fontSize + increment; 
			document.getElementById("box" + boxid).style.fontSize = fontSize + "px";
			disableZoomButton(zoomInButton);
	}
	
}
	

//-----------------------------------------------------------------------------
// resetText: Resets the text size to the default value. (9px)
//-----------------------------------------------------------------------------
function resetText(boxid)
{
	var zoomButton = document.querySelector('#box'+boxid+'wrapper #zoomOut');
	var zoomInButton = document.querySelector('#box'+boxid+'wrapper #zoomIn');
	var box = retData['box'][boxid - 1];
	var fontSize = document.getElementById("fontsize").value = box[6];
	
	enableZoomButton(zoomButton);
	enableZoomButton(zoomInButton);
	
	document.getElementById("box" + boxid).style.fontSize = fontSize;

}

function enableZoomButton(zoomButton){
	zoomButton.style.cssText = "";
}

function disableZoomButton(zoomButton){
	zoomButton.style.opacity = "0.4";
	zoomButton.style.pointerEvents = "none";
}


//hide maximizeButton, resetButton and minimizeButton
function hideMaximizeAndResetButton() {
	var templateid = retData['templateid'];
	if (templateid > 9) {
		document.querySelectorAll('.maximizebtn').forEach(maximizebtn => maximizebtn.style.display = 'none');
		document.querySelectorAll('.resetbtn').forEach(resetbtn => resetbtn.style.display = 'none');
		document.querySelectorAll('.minimizebtn').forEach(minimizebtn => minimizebtn.style.display = 'none');
	}
}

//reset boxes
function resetBoxes() 
{
	var parentDiv = document.getElementById("div2");
	var boxValArray = initResizableBoxValues(parentDiv);
	var templateid = retData['templateid'];
    var boxid = boxid;

	showCopyButtons(templateid);

	if (templateid == 1) {

        thisBox = document.querySelector('#box' + 1 + 'wrapper #boxtitlewrapper');
        thisBox2 = document.querySelector('#box' + 2 + 'wrapper #boxtitlewrapper');
		//Reset css attributes to default. Surely there has to be an easier way to do this.
		//Width
		document.querySelector(boxValArray['box' + 1]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.width = "";
		//Height
		document.querySelector(boxValArray['box' + 1]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.height = "";
		//Position
		document.querySelector(boxValArray['box' + 1]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.position = "";
		//Top
		document.querySelector(boxValArray['box' + 1]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.top = "";
		//Right
		document.querySelector(boxValArray['box' + 1]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.right = "";
		//Left
		document.querySelector(boxValArray['box' + 1]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.left = "";
		//Bottom
		document.querySelector(boxValArray['box' + 1]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.bottom = "";

         thisBox.classList.remove('hidden');
            setTimeout(function () {
                thisBox.classList.remove('visuallyhidden');
            }, 20);
        thisBox2.classList.remove('hidden');
            setTimeout(function () {
                thisBox2.classList.remove('visuallyhidden');
            }, 20);
	}
	
	if (templateid == 2) {

		thisBox = document.querySelector('#box' + 1 + 'wrapper #boxtitlewrapper');
        thisBox2 = document.querySelector('#box' + 2 + 'wrapper #boxtitlewrapper');
		//Reset css attributes to default. Surely there has to be an easier way to do this.
		//Width
		document.querySelector(boxValArray['box' + 1]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.width = "";
		//Height
		document.querySelector(boxValArray['box' + 1]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.height = "";
		//Position
		document.querySelector(boxValArray['box' + 1]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.position = "";
		//Top
		document.querySelector(boxValArray['box' + 1]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.top = "";
		//Right
		document.querySelector(boxValArray['box' + 1]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.right = "";
		//Left
		document.querySelector(boxValArray['box' + 1]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.left = "";
		//Bottom
		document.querySelector(boxValArray['box' + 1]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.bottom = "";

		thisBox.classList.remove('hidden');
		setTimeout(function () {
			thisBox.classList.remove('visuallyhidden');
		}, 20);
		thisBox2.classList.remove('hidden');
		setTimeout(function () {
			thisBox2.classList.remove('visuallyhidden');
		}, 20);
	}

	if (templateid == 3) {

        thisBox = document.querySelector('#box' + 1 + 'wrapper #boxtitlewrapper');
        thisBox2 = document.querySelector('#box' + 2 + 'wrapper #boxtitlewrapper');
		thisBox3 = document.querySelector('#box' + 3 + 'wrapper #boxtitlewrapper');

		//Reset css attributes to default. Surely there has to be an easier way to do this.
		//Width
		document.querySelector(boxValArray['box' + 1]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.width = "";
		//Height
		document.querySelector(boxValArray['box' + 1]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.height = "";
		//Position
		document.querySelector(boxValArray['box' + 1]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.position = "";
		//Top
		document.querySelector(boxValArray['box' + 1]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.top = "";
		//Right
		document.querySelector(boxValArray['box' + 1]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.right = "";
		//Left
		document.querySelector(boxValArray['box' + 1]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.left = "";
		//Bottom
		document.querySelector(boxValArray['box' + 1]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.bottom = "";

        thisBox.classList.remove('hidden');
            setTimeout(function () {
                thisBox.classList.remove('visuallyhidden');
            }, 20);
        thisBox2.classList.remove('hidden');
            setTimeout(function () {
                thisBox2.classList.remove('visuallyhidden');
            }, 20);
        thisBox3.classList.remove('hidden');
            setTimeout(function () {
                thisBox3.classList.remove('visuallyhidden');
            }, 20);
	}

	if (templateid == 4) {

        thisBox = document.querySelector('#box' + 1 + 'wrapper #boxtitlewrapper');
        thisBox2 = document.querySelector('#box' + 2 + 'wrapper #boxtitlewrapper');
        thisBox3 = document.querySelector('#box' + 3 + 'wrapper #boxtitlewrapper');

		//Reset css attributes to default. Surely there has to be an easier way to do this.
		//Width
		document.querySelector(boxValArray['box' + 1]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.width = "";
		//Height
		document.querySelector(boxValArray['box' + 1]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.height = "";
		//Position
		document.querySelector(boxValArray['box' + 1]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.position = "";
		//Top
		document.querySelector(boxValArray['box' + 1]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.top = "";
		//Right
		document.querySelector(boxValArray['box' + 1]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.right = "";
		//Left
		document.querySelector(boxValArray['box' + 1]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.left = "";
		//Bottom
		document.querySelector(boxValArray['box' + 1]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.bottom = "";

        thisBox.classList.remove('hidden');
            setTimeout(function () {
        thisBox.classList.remove('visuallyhidden');
            }, 20);
        thisBox2.classList.remove('hidden');
            setTimeout(function () {
        thisBox2.classList.remove('visuallyhidden');
            }, 20);
        thisBox3.classList.remove('hidden');
            setTimeout(function () {
                thisBox3.classList.remove('visuallyhidden');
            }, 20);
	}

	if (templateid == 5) {
		
        thisBox = document.querySelector('#box' + 1 + 'wrapper #boxtitlewrapper');
        thisBox2 = document.querySelector('#box' + 2 + 'wrapper #boxtitlewrapper');
        thisBox3 = document.querySelector('#box' + 3 + 'wrapper #boxtitlewrapper');
		thisBox4 = document.querySelector('#box' + 4 + 'wrapper #boxtitlewrapper');

		//Reset css attributes to default. Surely there has to be an easier way to do this.
		//Width
		document.querySelector(boxValArray['box' + 1]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.width = "";
		//Height
		document.querySelector(boxValArray['box' + 1]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.height = "";
		//Position
		document.querySelector(boxValArray['box' + 1]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.position = "";
		//Top
		document.querySelector(boxValArray['box' + 1]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.top = "";
		//Right
		document.querySelector(boxValArray['box' + 1]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.right = "";
		//Left
		document.querySelector(boxValArray['box' + 1]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.left = "";
		//Bottom
		document.querySelector(boxValArray['box' + 1]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.bottom = "";

        thisBox.classList.remove('hidden');
            setTimeout(function () {
        thisBox.classList.remove('visuallyhidden');
            }, 20);
        thisBox2.classList.remove('hidden');
            setTimeout(function () {
        thisBox2.classList.remove('visuallyhidden');
            }, 20);
        thisBox3.classList.remove('hidden');
            setTimeout(function () {
                thisBox3.classList.remove('visuallyhidden');
            }, 20);
        thisBox4.classList.remove('hidden');
            setTimeout(function () {
                thisBox4.classList.remove('visuallyhidden');
            }, 20);
	}

	if (templateid == 6 || templateid == 7) {
        thisBox = document.querySelector('#box' + 1 + 'wrapper #boxtitlewrapper');
        thisBox2 = document.querySelector('#box' + 2 + 'wrapper #boxtitlewrapper');
        thisBox3 = document.querySelector('#box' + 3 + 'wrapper #boxtitlewrapper');
		thisBox4 = document.querySelector('#box' + 4 + 'wrapper #boxtitlewrapper');
		
		//Reset css attributes to default. Surely there has to be an easier way to do this.
		//Width
		document.querySelector(boxValArray['box' + 1]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.width = "";
		//Height
		document.querySelector(boxValArray['box' + 1]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.height = "";
		//Position
		document.querySelector(boxValArray['box' + 1]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.position = "";
		//Top
		document.querySelector(boxValArray['box' + 1]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.top = "";
		//Right
		document.querySelector(boxValArray['box' + 1]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.right = "";
		//Left
		document.querySelector(boxValArray['box' + 1]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.left = "";
		//Bottom
		document.querySelector(boxValArray['box' + 1]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.bottom = "";

        thisBox.classList.remove('hidden');
            setTimeout(function () {
        thisBox.classList.remove('visuallyhidden');
            }, 20);
        thisBox2.classList.remove('hidden');
            setTimeout(function () {
        thisBox2.classList.remove('visuallyhidden');
            }, 20);
        thisBox3.classList.remove('hidden');
            setTimeout(function () {
                thisBox3.classList.remove('visuallyhidden');
            }, 20);
        thisBox4.classList.remove('hidden');
            setTimeout(function () {
                thisBox4.classList.remove('visuallyhidden');
            }, 20);
	}

	if (templateid == 7) {
        thisBox = document.querySelector('#box' + 1 + 'wrapper #boxtitlewrapper');
        thisBox2 = document.querySelector('#box' + 2 + 'wrapper #boxtitlewrapper');
        thisBox3 = document.querySelector('#box' + 3 + 'wrapper #boxtitlewrapper');
		thisBox4 = document.querySelector('#box' + 4 + 'wrapper #boxtitlewrapper');
		
        thisBox.classList.remove('hidden');
            setTimeout(function () {
        thisBox.classList.remove('visuallyhidden');
            }, 20);
        thisBox2.classList.remove('hidden');
            setTimeout(function () {
        thisBox2.classList.remove('visuallyhidden');
            }, 20);
        thisBox3.classList.remove('hidden');
            setTimeout(function () {
                thisBox3.classList.remove('visuallyhidden');
            }, 20);
        thisBox4.classList.remove('hidden');
            setTimeout(function () {
                thisBox4.classList.remove('visuallyhidden');
            }, 20);
	}

	if (templateid == 8) {
        thisBox = document.querySelector('#box' + 1 + 'wrapper #boxtitlewrapper');
        thisBox2 = document.querySelector('#box' + 2 + 'wrapper #boxtitlewrapper');
		thisBox3 = document.querySelector('#box' + 3 + 'wrapper #boxtitlewrapper');
		
		//Reset css attributes to default. Surely there has to be an easier way to do this.
		//Width
		document.querySelector(boxValArray['box' + 1]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.width = "";
		//Height
		document.querySelector(boxValArray['box' + 1]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.height = "";
		//Position
		document.querySelector(boxValArray['box' + 1]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.position = "";
		//Top
		document.querySelector(boxValArray['box' + 1]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.top = "";
		//Right
		document.querySelector(boxValArray['box' + 1]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.right = "";
		//Left
		document.querySelector(boxValArray['box' + 1]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.left = "";
		//Bottom
		document.querySelector(boxValArray['box' + 1]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.bottom = "";

        thisBox.classList.remove('hidden');
            setTimeout(function () {
        thisBox.classList.remove('visuallyhidden');
            }, 20);
        thisBox2.classList.remove('hidden');
            setTimeout(function () {
        thisBox2.classList.remove('visuallyhidden');
            }, 20);
        thisBox3.classList.remove('hidden');
            setTimeout(function () {
                thisBox3.classList.remove('visuallyhidden');
            }, 20);
	}
	if (templateid == 9) {
        thisBox = document.querySelector('#box' + 1 + 'wrapper #boxtitlewrapper');
        thisBox2 = document.querySelector('#box' + 2 + 'wrapper #boxtitlewrapper');
        thisBox3 = document.querySelector('#box' + 3 + 'wrapper #boxtitlewrapper');
        thisBox4 = document.querySelector('#box' + 4 + 'wrapper #boxtitlewrapper');
		thisBox5 = document.querySelector('#box' + 5 + 'wrapper #boxtitlewrapper');
		
		//Reset css attributes to default. Surely there has to be an easier way to do this.
		//Width
		document.querySelector(boxValArray['box' + 1]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.width = "";
		document.querySelector(boxValArray['box' + 5]['id']).style.width = "";
		//Height
		document.querySelector(boxValArray['box' + 1]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.height = "";
		document.querySelector(boxValArray['box' + 5]['id']).style.height = "";
		//Position
		document.querySelector(boxValArray['box' + 1]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.position = "";
		document.querySelector(boxValArray['box' + 5]['id']).style.position = "";
		//Top
		document.querySelector(boxValArray['box' + 1]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.top = "";
		document.querySelector(boxValArray['box' + 5]['id']).style.top = "";
		//Right
		document.querySelector(boxValArray['box' + 1]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.right = "";
		document.querySelector(boxValArray['box' + 5]['id']).style.right = "";
		//Left
		document.querySelector(boxValArray['box' + 1]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.left = "";
		document.querySelector(boxValArray['box' + 5]['id']).style.left = "";
		//Bottom
		document.querySelector(boxValArray['box' + 1]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 2]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 3]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 4]['id']).style.bottom = "";
		document.querySelector(boxValArray['box' + 5]['id']).style.bottom = "";

     	thisBox.classList.remove('hidden');
            setTimeout(function () {
        thisBox.classList.remove('visuallyhidden');
            }, 20);
        thisBox2.classList.remove('hidden');
            setTimeout(function () {
        thisBox2.classList.remove('visuallyhidden');
            }, 20);
        thisBox3.classList.remove('hidden');
            setTimeout(function () {
        thisBox4.classList.remove('visuallyhidden');
            }, 20);
                thisBox4.classList.remove('hidden');
            setTimeout(function () {
                thisBox3.classList.remove('visuallyhidden');
            }, 20);
        thisBox5.classList.remove('hidden');
            setTimeout(function () {
                thisBox5.classList.remove('visuallyhidden');
            }, 20);
	}
}

//-----------------------------------------------------------------------------
// resizeBoxes: Adding resize functionality for the boxes
//					Is called by setup() in codeviewer.js
//-----------------------------------------------------------------------------


function resizeBoxes(parentId, templateId) {
    const parent = document.getElementById(parentId);	
	templateId = parseInt(templateId, 10);

	const width = parent.offsetWidth;
	const height = parent.offsetHeight;
	const minWidth = width * 0.15;
	const maxWidth = width * 0.85;
	const minHeight = height * 0.15;
	const maxHeight = height * 0.85;
	const minHeightMulti = height * 0.15;
	const maxHeightMulti = height * 0.55; 

    function makeBoxesResizable(element, direction, options = {}) {
		if (!element) return;
        const resizer = document.createElement('div');
        resizer.className = 'resizer-' + direction;
        resizer.style.position = 'absolute';
        resizer.style.background = 'transparent';
        resizer.style.zIndex = '10';
        resizer.style[direction === 'e' ? 'right' : 'bottom'] = '0';
        resizer.style[direction === 'e' ? 'top' : 'left'] = '0';
        resizer.style[direction === 'e' ? 'bottom' : 'right'] = '0';
        resizer.style.cursor = direction + '-resize';
        resizer.style[direction === 'e' ? 'width' : 'height'] = '5px';

        element.style.position = 'relative';
        element.appendChild(resizer);

        resizer.addEventListener('mousedown', function (e) {
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = parseInt(window.getComputedStyle(element).width, 10);
            const startHeight = parseInt(window.getComputedStyle(element).height, 10);

            function doDrag(e) {
                let newSize;
                if (direction === 'e') {
                    newSize = startWidth + (e.clientX - startX);
                    newSize = Math.max(options.min || 0, Math.min(options.max || Infinity, newSize));
                    element.style.width = newSize + 'px';
                } else {
                    newSize = startHeight + (e.clientY - startY);
                    newSize = Math.max(options.min || 0, Math.min(options.max || Infinity, newSize));
                    element.style.height = newSize + 'px';
                }
                if (options.onResize) options.onResize();
            }

            function stopDrag() {
                document.documentElement.removeEventListener('mousemove', doDrag);
                document.documentElement.removeEventListener('mouseup', stopDrag);
            }

            document.documentElement.addEventListener('mousemove', doDrag);
            document.documentElement.addEventListener('mouseup', stopDrag);
        });
    }

	const boxes = {};
	for (let i = 1; i <= 9; i++) {
		boxes[`box${i}`] = document.getElementById(`box${i}wrapper`);
	}

	if (templateId === 1) {
        makeBoxesResizable(boxes.box1, 'e', {
            min: minWidth,
            max: maxWidth,
            onResize: () => {
                boxes.box2.style.width = (width - boxes.box1.offsetWidth) + 'px';
                for (let j = 1; j <= retData.numbox; j++) toggleTitleDescription(j);
            }
        });
    }
    else if (templateId === 2) {
        makeBoxesResizable(boxes.box1, 's', {
            min: minHeight,
            max: maxHeight,
            onResize: () => {
                boxes.box2.style.height = (height - boxes.box1.offsetHeight) + 'px';
            }
        });
    }
    else if (templateId === 3) {
        makeBoxesResizable(boxes.box1, 'e', {
            min: minWidth,
            max: maxWidth,
            onResize: () => {
                const rem = width - boxes.box1.offsetWidth;
                boxes.box2.style.width = rem + 'px';
                boxes.box3.style.width = rem + 'px';
                for (let j = 1; j <= retData.numbox; j++) toggleTitleDescription(j);
            }
        });
        makeBoxesResizable(boxes.box2, 's', {
            min: minHeight,
            max: maxHeight,
            onResize: () => {
                boxes.box3.style.height = (height - boxes.box2.offsetHeight) + 'px';
            }
        });
    }
    else if (templateId === 4) {
        makeBoxesResizable(boxes.box1, 'e', {
            min: minWidth,
            max: maxWidth,
            onResize: () => {
                const totalW = boxes.box1.offsetWidth + boxes.box2.offsetWidth;
                if (totalW !== width) {
                    boxes.box2.style.width = (width - boxes.box1.offsetWidth) + 'px';
					for (let j = 1; j <= retData.numbox; j++) toggleTitleDescription(j);
                } else {
                    const remH = height - boxes.box1.offsetHeight;
                    boxes.box2.style.height = boxes.box1.offsetHeight + 'px';
                    boxes.box3.style.height = remH + 'px';
                }
            }
        });
        makeBoxesResizable(boxes.box1, 's', {
            min: minHeight,
            max: maxHeight,
            onResize: () => {
                const remH = height - boxes.box1.offsetHeight;
                boxes.box2.style.height = boxes.box1.offsetHeight + 'px';
                boxes.box3.style.height = remH + 'px';
            }
        });
        makeBoxesResizable(boxes.box2, 's', {
            min: minHeight,
            max: maxHeight,
            onResize: () => {
                boxes.box1.style.height = boxes.box2.offsetHeight + 'px';
                boxes.box3.style.height = (height - boxes.box2.offsetHeight) + 'px';
            }
        });
    }
    else if (templateId === 5) {
        makeBoxesResizable(boxes.box1, 'e', {
            min: minWidth,
            max: maxWidth,
            onResize: () => {
                boxes.box2.style.width = (width - boxes.box1.offsetWidth) + 'px';
                for (let j = 1; j <= retData.numbox; j++) toggleTitleDescription(j);
            }
        });
        makeBoxesResizable(boxes.box1, 's', {
            min: minHeightMulti,
            max: maxHeight,
            onResize: () => {
                const remH = height - boxes.box1.offsetHeight;
                boxes.box2.style.height = boxes.box1.offsetHeight + 'px';
                boxes.box3.style.height = remH + 'px';
                boxes.box4.style.height = remH + 'px';
            }
        });
        makeBoxesResizable(boxes.box2, 's', {
            min: minHeightMulti,
            max: maxHeight,
            onResize: () => {
                const remH = height - boxes.box2.offsetHeight;
                boxes.box3.style.height = remH + 'px';
                boxes.box4.style.height = remH + 'px';
            }
        });
    }
	else if (templateId === 6) 
	{
        makeBoxesResizable(boxes.box1, 'e', {
            min: minWidth,
            max: maxWidth,
            onResize: () => {
                const remaining = width - boxes.box1.offsetWidth;
                boxes.box2.style.width = remaining + 'px';
                boxes.box3.style.width = remaining + 'px';
                boxes.box4.style.width = remaining + 'px';
                for (let i = 1; i <= retData["numbox"]; i++) toggleTitleDescription(i);
            }
        });
        ['box2', 'box3'].forEach((box) => {
            makeBoxesResizable(boxes[box], 's', {
                min: minHeightMulti,
                max: height * 0.70,
                onResize: () => {
                    const total = boxes.box2.offsetHeight + boxes.box3.offsetHeight + boxes.box4.offsetHeight;
                    const delta = height - total;
                    if (delta !== 0) {
                        const targets = [boxes.box2, boxes.box3, boxes.box4].filter(b => b !== boxes[box]);
                        targets.forEach(b => b.style.height = (b.offsetHeight + delta / 2) + 'px');
                    }
                }
            });
        });
    } 
	else if (templateId === 7) 
	{
        ['box2', 'box3', 'box4'].forEach((box) => {
            makeBoxesResizable(boxes[box], 'e', {
                min: minWidth,
                max: maxWidth,
                onResize: () => {
                    const remaining = width - boxes[box].offsetWidth;
                    boxes.box1.style.width = remaining + 'px';
                    const others = ['box2', 'box3', 'box4'].filter(b => b !== box);
                    others.forEach(b => boxes[b].style.width = boxes[box].offsetWidth + 'px');
                    for (let i = 1; i <= retData["numbox"]; i++) toggleTitleDescription(i);
                }
            });
        });
        ['box2', 'box3', 'box4'].forEach((box) => {
            makeBoxesResizable(boxes[box], 's', {
                min: minHeightMulti,
                max: maxHeightMulti,
                onResize: () => {
                    const total = boxes.box2.offsetHeight + boxes.box3.offsetHeight + boxes.box4.offsetHeight;
                    const delta = height - total;
                    const others = ['box2', 'box3', 'box4'].filter(b => b !== box);
                    others.forEach(b => boxes[b].style.height = (boxes[b].offsetHeight + delta / 2) + 'px');
                }
            });
        });
    } 
	else if (templateId === 8) {
		makeBoxesResizable(boxes.box2, 'e', {
			min: minWidth,
			max: maxWidth,
			onResize: () => {
				const remW = parent.offsetWidth - boxes.box2.offsetWidth;
				boxes.box1.style.width = remW + 'px';
				boxes.box3.style.width = boxes.box2.offsetWidth + 'px';
				for (let j = 1; j <= retData.numbox; j++) toggleTitleDescription(j);
			}
		});
	
		makeBoxesResizable(boxes.box2, 's', {
			min: minHeight,
			max: maxHeight,
			onResize: () => {
				const remH = parent.offsetHeight - boxes.box2.offsetHeight;
				boxes.box3.style.height = remH + 'px';
			}
		});
	
		makeBoxesResizable(boxes.box3, 'e', {
			min: minWidth,
			max: maxWidth,
			onResize: () => {
				const remW = parent.offsetWidth - boxes.box3.offsetWidth;
				boxes.box1.style.width = remW + 'px';
				boxes.box2.style.width = boxes.box3.offsetWidth + 'px';
				for (let j = 1; j <= retData.numbox; j++) toggleTitleDescription(j);
			}
		});
	}
	else if (templateId === 9) {
		makeBoxesResizable(boxes.box1, 'e', {
			min: minWidth,
			max: maxWidth,
			onResize: () => {
				const remW = width - boxes.box1.offsetWidth;
				['box2','box3','box4','box5'].forEach(id => {
					boxes[id].style.width = remW + 'px';
					for (let j = 1; j <= retData.numbox; j++) toggleTitleDescription(j);
				});
			}
		});
		['box2','box3','box4','box5'].forEach(boxId => {
			makeBoxesResizable(boxes[boxId], 's', {
				min: minHeightMulti,
				max: maxHeightMulti,
				onResize: () => {
				  const freshH = parent.offsetHeight;
				  const remH = freshH - boxes[boxId].offsetHeight;
				  const peers = ['box2','box3','box4','box5'].filter(id => id !== boxId);
				  const share = Math.floor(remH / peers.length);
				  let leftover = remH - share * peers.length;
				  peers.forEach((id, idx) => {
					const h = share + (idx === 0 ? leftover : 0);
					boxes[id].style.height = h + 'px';
				  });
				}
			});
		});
	}
	
}


//------------------------------------------------------------------------------------------------------------------------------
// Hide or show scrollbars on a box depending on if the content of the box takes more or less space than the box itself.
//------------------------------------------------------------------------------------------------------------------------------

// The function does not do anything, but MUST NOT be removed because other functions in other files still refers to it.
function hideShowScrollbars(boxValArray, box){
	if(document.querySelector('#box' + box).className == 'box codebox'){
	}else if(document.querySelector('#box' + box).className == 'box descbox'){
	}
}

//----------------------------------------------------------------------------------
//Creates an array with all the properties needed for resize function.
//                Is called by resizeBoxes in codeviewer.js
//----------------------------------------------------------------------------------

function saveInitialBoxValues() {
	var templateId = retData["templateid"];
	var parent = "#div2";
	var boxValArray = initResizableBoxValues(parent);

	setLocalStorageProperties(templateId, boxValArray);
}

function initResizableBoxValues(parentId) {
	const parentEl = document.getElementById(parentId);
	const parentWidth = parentEl.offsetWidth;
	const parentHeight = parentEl.offsetHeight;
	const boxWrapper = document.querySelectorAll("[id ^=box][id $=wrapper]");
	const numBoxes = boxWrapper.length;
	
	const boxValueArray = {};
	boxValueArray["parent"] = {
		"id": parentId,
		"width": parentWidth,
		"height": parentHeight
	};
	for (let i = 1; i <= numBoxes; i++) {
		const boxEl = document.getElementById("box" + i + "wrapper");
		if (!boxEl) continue;

		boxValueArray["box" + i] = {
			id: "#box" + i + "wrapper",
			width: boxEl.offsetWidth,
			height: boxEl.offsetHeight
		};
	}

	// Replace jQuery resize listener
	window.addEventListener("resize", function (event) {
		if (!event.target.classList.contains('ui-resizable')) {
			boxValueArray["parent"].width = parentEl.offsetWidth;
			boxValueArray["parent"].height = parentEl.offsetHeight;
		}
	});

	return boxValueArray;
}


//----------------------------------------------------------------------------------
//	LOADER:	Makes the page content hidden until it is loaded completely and displays a
//  loading gif until page has loaded fully
//----------------------------------------------------------------------------------

document.onreadystatechange = function () {
	var state = document.readyState
	if (state == 'interactive') {
		document.getElementById('content').style.visibility = "hidden";
	} else if (state == 'complete') {
		document.getElementById('loader').style.visibility = "hidden";
		document.getElementById('content').style.visibility = "visible";
	}
}


//----------------------------------------------------------------------------------
// addHtmlLineBreak: This function will replace all '\n' line breaks in a string
//					 with <br> tags.
//                Is called by returned in codeviewer.js
//----------------------------------------------------------------------------------

function addHtmlLineBreak(inString) {
	return inString.replace(/\n/g, '<br>');
}

//----------------------------------------------------------------------------------
// copyCodeToClipboard: Selects and copies the code within the selected code view
//----------------------------------------------------------------------------------

function copyCodeToClipboard(boxid) {
	var box = document.getElementById("box" + boxid);
	var code = box.getElementsByClassName("normtextwrapper")[0];
	var lines = "";

	// Get important lines based on code window
	var impo = code.getElementsByClassName("impo"); 

	// Check if a teacher is logged in
	if (retData['writeaccess'] != "w") {
		// Add Code to just copy impo code
		for(i = 0; i<impo.length;i++){
			lines += impo[i].innerText  + "\n";
		}
	} else {
		for(i = 0; i<code.childNodes.length;i++){
			lines += code.childNodes[i].innerText  + "\n";
		}
	}

	// Now using clipboard api, but fals back to execCommand incase it's not supported
	if (navigator.clipboard){
		navigator.clipboard.writeText(lines);
	} else {
		var dummy = document.createElement("textarea");
		dummy.value = lines;
		document.body.appendChild(dummy);
		dummy.select();
		document.execCommand("copy");
		document.body.removeChild(dummy);
	}

	// Notification animation
	const notification = document.getElementById("notificationbox" + boxid);
	notification.style.display = "flex";
	notification.style.overflow = "hidden";
	notification.style.opacity = 0;
	notification.style.transition = "opacity 0.2s ease-in";
	requestAnimationFrame(() => {
	notification.style.opacity = 1;
	setTimeout(() => {
		notification.style.transition = "opacity 0.2s ease-out";
		notification.style.opacity = 0;
			setTimeout(() => {
				notification.style.display = "none";
			}, 200);
		}, 500);
	});
}	

// Selectionchange EventListener
document.addEventListener('selectionchange', function () {
	// 0.5 second delay to update selectionRange (Needed for copyCodeToClipboard() to work on mobile)
	setTimeout(function () {
		if (window.getSelection().rangeCount > 0)
			selectionRange = window.getSelection().getRangeAt(0);
	}, 500);
  });

  // Sets a flag to prevent closing when clicking inside valid elements
  document.addEventListener("mousedown", function (e) {
	const burgerMenu = document.getElementById("burgerMenu");
	const target = e.target;

	if (target === burgerMenu || burgerMenu.contains(target)) {
		isClickedElementBox = true;
	} else if (target.classList.contains("formBox")) {
		isClickedElementBox = true;
	} else if (findAncestor(target, "formBox")) {
		isClickedElementBox = true;
	} else {
		isClickedElementBox = false;
	}
});

// Sets a flag to prevent closing when clicking inside valid elements
document.addEventListener("mouseup", function (e) {
	const target = e.target;
	const burgerMenu = document.getElementById("burgerMenu");
	const codeBurger = document.getElementById("codeBurger");

	const notTarget = target !== burgerMenu && target !== codeBurger;
	const notDescendant = !burgerMenu.contains(target) && !codeBurger.contains(target);

	if (burgerMenu.offsetParent !== null && notTarget && notDescendant && !isClickedElementBox) {
		closeBurgerMenu();
	}

	const formBoxes = document.querySelectorAll(".formBox");
	formBoxes.forEach(formBox => {
		if (
			formBox.offsetParent !== null &&
			target !== formBox &&
			!formBox.contains(target) &&
			!isClickedElementBox
		) {
			closeWindows();
			hideIframe();
		}
	});
});

// Toggles the burger menu by cheching if its currently hidden
function showBurgerMenu() {
    const burgerMenu = document.getElementById("burgerMenu");
		if(burgerMenu.offsetParent === null) {
			showBurgerDropdown();
		} else {
			closeBurgerMenu();
		}
}

function showBurgerDropdown(){
 	var menu = document.querySelector('#burgerMenu');
	var burgerPos = document.querySelector('#codeBurger').getBoundingClientRect();
	menu.style.display = 'block';
	menu.style.top = burgerPos.top + 50 + 'px';
	menu.style.left = burgerPos.left + (-90) + 'px';
}

function closeBurgerMenu() {
	document.querySelector('#burgerMenu').style.display = 'none';
}



function showAllViews(){
	var boxes = retData['box'];
 	boxes.forEach(box => {
    	showAllBox(box[0]);
 	});
	for(i = 1; i <= retData['numbox']; i++){
		const wrapper = document.getElementById("box" + i + "wrapper");
		if (wrapper) {
			wrapper.style.gridColumn = "";
			wrapper.style.gridRow = "";
		}
	}
}

function setShowPane(id) {
	closeBurgerMenu();
	for(i = 1; i <= retData['numbox']; i++){
		const wrapper = document.getElementById("box" + i + "wrapper");
		if(!wrapper) continue;
		if(i == id){
			wrapper.style.display = "inline";
			wrapper.style.gridColumn = "a/b";
			wrapper.style.gridRow = "a/1";
		}
		else{
			wrapper.style.display = "none";
		}
		
	}
}

function showAllBox(id) {
   closeBurgerMenu();
   var container = document.querySelector('#div2');
   var boxes = [...container.childNodes];
   boxes.forEach(box => {
    if (box.id === 'box'+id+'wrapper') {
        box.style.display = 'block';
        box.style.width = '100%';
        box.style.maxWidth = '100%';
        box.style.height = '100%';
    } 
   });
}

function showBox(id) {
 	var container = document.querySelector('#div2');
	var boxes = [...container.childNodes];
	
	boxes.forEach(box => {
		if (box.id === 'box'+id+'wrapper') {
			box.style.display = 'block';
			box.style.width = '100%';
			box.style.maxWidth = '100%';
			box.style.height = '100%';
		} else {
			box.style.display = 'none';
		}
	});
}

// Show preview winodow when clicking on "Edit file"
function showIframe(path, name, kind) {
    
    // Fetch HTML text from fileed.php
    fetch('fileed.php').then(function (response) {
        // The API call was successful!
        return response.text();
    }).then(function (html) {
        // Parse HTML test to DOM
        var parser = new DOMParser();
        var fileedDocument = parser.parseFromString(html, 'text/html');

        // Replace the preview window from codeviewer.php with the preview window from fileed.php in DOM
        var previewWindow = document.querySelector(".previewWindow")
        var fileedPreviewWindow = fileedDocument.querySelector(".previewWindow");
        document.querySelector(".previewWindowContainer").replaceChild(fileedPreviewWindow, previewWindow)
        
        // Display the preview window and append hideIframe() to the close window button 
        previewWindow = document.querySelector(".previewWindow");
		previewWindow.classList.add("formBox");
        previewWindow.style.display = "block";
        document.querySelector(".editFilePart").style.display = "none";

		// Clicking the save button will reload the example to display the new changes
		previewWindow.querySelector(".save-button-md").addEventListener("click", function(){
			location.reload();
		});
        
        // Load the right file in to the preview window
		let s = document.createElement('script');
		s.src = "fileed.js";
		s.onload = () => loadPreview(path, name, kind);
		document.head.appendChild(s);

    }).catch(function (err) {
        // Display potential errors as a warning
        console.warn('Something went wrong.', err);
    });
    
}

// Iframe used for drag and drop
function showHiddenIframe() {
    var filePath = 'fileed.php?courseid=' + courseid + '&coursevers=' + cvers;
    document.querySelector(".previewWindow").style.display = "block";
    document.querySelector(".previewWindowContainer").style.display = "block";
	document.getElementById("iframeFileed").src = filepath;
}

function hideIframe()
{
	document.querySelector(".previewWindow").style.display = "none";
	document.querySelector(".previewWindowContainer").style.display = "none";
}

function hideDescription() {
	console.log("hideDescription");
}

//Toggles the animation of buttomenu2 items/td when resizing
//This function is called by alignBoxesWidth()

function toggleTitleWrapper(targetBox, boxNum, boxW){
	var box = targetBox;
  	if (boxW > 15 && boxW < 84 || boxW < 15 && boxNum == 2 && (retData['templateid']) == !8 || boxW > 84 && boxNum == 1 && (retData['templateid']) == !6 && !3 && !9) {
    	box.classList.remove('hidden');
    	setTimeout(function () {
      		box.classList.remove('visuallyhidden');
		}, 20);

  	}else if(box.classList.contains('visuallyhidden') == false && boxW < 15 && boxNum == 1){
		box.classList.add('visuallyhidden');
    	box.addEventListener('transitionend', function(e) {
      		box.classList.add('hidden');
    	}, {
      		capture: false,
      		once: true,
      		passive: false
    	});
  	}else if(box.classList.contains('visuallyhidden') == false && boxW > 84 && boxNum == 2 && boxW < 98){
	  box.classList.add('visuallyhidden');
	  box.addEventListener('transitionend', function(e) {
			box.classList.add('hidden');
	  }, {
			capture: false,
			once: true,
			passive: false
	  });
	}else if(box.classList.contains('visuallyhidden') == false && boxW < 15 && boxNum == 2 && (retData['templateid']) == !1 || box.classList.contains('visuallyhidden') == false && boxW < 15 && boxNum == 3){
	  box.classList.add('visuallyhidden');
	  box.addEventListener('transitionend', function(e) {
			box.classList.add('hidden');
	  }, {
			capture: false,
			once: true,
			passive: false
	  });
	}else if(box.classList.contains('visuallyhidden') == false && boxW > 84 && boxW < 98 && boxNum == 3 && (retData['templateid']) != 5){
	  box.classList.add('visuallyhidden');
	  box.addEventListener('transitionend', function(e) {
			box.classList.add('hidden');
	  }, {
			capture: false,
			once: true,
			passive: false
	  });
	}else if(box.classList.contains('visuallyhidden') == false && boxW > 84 && boxW < 98 && boxNum == 4 && boxW < 98){
	  box.classList.add('visuallyhidden');
	  box.addEventListener('transitionend', function(e) {
			box.classList.add('hidden');
	  }, {
			capture: false,
			once: true,
			passive: false
	  });
	}else if(box.classList.contains('visuallyhidden') == false && boxW > 84  && boxW < 98 && boxNum == 1 && (retData['templateid']) == 6){
	  box.classList.add('visuallyhidden');
	  box.addEventListener('transitionend', function(e) {
			box.classList.add('hidden');
	  }, {
			capture: false,
			once: true,
			passive: false
	  });
	}else if(box.classList.contains('visuallyhidden') == false && boxW > 84  && boxW < 98 && boxNum == 1 && (retData['templateid']) == 3){
	  box.classList.add('visuallyhidden');
	  box.addEventListener('transitionend', function(e) {
			box.classList.add('hidden');
	  }, {
			capture: false,
			once: true,
			passive: false
	  });
	}else if(box.classList.contains('visuallyhidden') == false && boxW > 84  && boxW < 98 && boxNum == 1 && (retData['templateid']) == 9){
	  box.classList.add('visuallyhidden');
	  box.addEventListener('transitionend', function(e) {
			box.classList.add('hidden');
	  }, {
			capture: false,
			once: true,
			passive: false
	  });
	}else if(box.classList.contains('visuallyhidden') == false && boxW < 15 && boxNum == 2 && (retData['templateid']) == 7 && template7maximizebuttonpressed == false || box.classList.contains('visuallyhidden') == false && boxW < 15 && boxNum == 4 && (retData['templateid']) == 7 && template7maximizebuttonpressed == false ){
	  box.classList.add('visuallyhidden');
	  box.addEventListener('transitionend', function(e) {
			box.classList.add('hidden');
	  }, {
			capture: false,
			once: true,
			passive: false
	  });
	}else if(box.classList.contains('visuallyhidden') == false && boxW < 15 && boxNum == 2 && (retData['templateid']) == 8 && template7maximizebuttonpressed == false ){
	  box.classList.add('visuallyhidden');
	  box.addEventListener('transitionend', function(e) {
			box.classList.add('hidden');
	  }, {
			capture: false,
			once: true,
			passive: false
	  });
	}

}
//Toggles the description text one the boxes.
function toggleTitleDescription(toCheck){
	var box = document.querySelector('#box' + toCheck + 'wrapper #boxtitlewrapper');
	const boxWrapper = document.getElementById('box' + toCheck + 'wrapper');
	const div2 = document.getElementById('div2');
	const boxW = (boxWrapper.offsetWidth / div2.offsetWidth) * 100;

	//Check if the widht(%) of the box is < 16
	if(boxW <= 16){
		box.classList.add('visuallyhidden');
		box.addEventListener('transitionend', function(e) {
			  box.classList.add('hidden');
		}, {
			  capture: false,
			  once: true,
			  passive: false
		});
	}else{
		box.classList.remove('hidden');
      	box.classList.remove('visuallyhidden');
	}
}
//-------------------------------------------------
// EventListener for Escape keyup
//-------------------------------------------------
document.addEventListener('keyup', function(event){
	if (event.key === 'Escape') {
		let link = document.getElementById("upIcon").href;
		let isOpenPopup = checkIfPopupIsOpen();
		if (!isOpenPopup) {
			window.location.assign(link);
		}
	}
});
function checkIfPopupIsOpen() {
	let allPopups = [
		"#editExampleContainer",
		"#editContentContainer",
		"#chooseTemplateContainer",
		"#burgerMenu",
		".previewWindowContainer.loginBoxContainer"
	];
	let div = document.getElementById("toastContainer");
	if (div.children.length > 0) {
		return true;
	}
	for (let popup of allPopups) {
		const el = document.querySelector(popup);
		if (el && window.getComputedStyle(el).display !== "none") {
			return true;
		}
	}
	return false;
}