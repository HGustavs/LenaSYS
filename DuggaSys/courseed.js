/********************************************************************************

   Globals

*********************************************************************************/

var sessionkind = 0;
var querystring = parseGet();
var versions;
var entries;
var motd;
var readonly;
var LastCourseCreated;
var lastCC = false; 
var updateCourseName = false;

$(document).ready(function(){
    $('#startdate').datepicker({
      dateFormat: "yy-mm-dd"
    });
    $('#enddate').datepicker({
      dateFormat: "yy-mm-dd"
    });
});

AJAXService("GET", {}, "COURSE");

//----------------------------------------
// Commands:
//----------------------------------------

function updateCourse()
{
	var coursename = $("#coursename").val();
	var cid = $("#cid").val();
	var coursecode = $("#coursecode").val();
	var courseGitURL = $("#editcoursegit-url").val();
	var visib = $("#visib").val();
	var courseid = "C"+cid;
	// Show dialog
	$("#editCourse").css("display", "none");
	
	//Check if courseGitURL has a value
	if(courseGitURL) {
		//Check if fetchGitHubRepo returns true
		if(fetchGitHubRepo(courseGitURL)) {
			$("#overlay").css("display", "none");
			AJAXService("UPDATE", {	cid : cid, coursename : coursename, visib : visib, coursecode : coursecode, courseGitURL : courseGitURL }, "COURSE");
			localStorage.setItem('courseid', courseid);
			localStorage.setItem('updateCourseName', true);
			alert("Course " + coursename + " updated with new GitHub-link!"); 
			updateGithubRepo(courseGitURL, cid);
		}
		//Else: get error message from the fetchGitHubRepo function.

	} else {
		//If courseGitURL has no value, update the course as usual.
		$("#overlay").css("display", "none");
		AJAXService("UPDATE", {	cid : cid, coursename : coursename, visib : visib, coursecode : coursecode, courseGitURL : courseGitURL }, "COURSE");
		localStorage.setItem('courseid', courseid);
		localStorage.setItem('updateCourseName', true);
		alert("Course " + coursename + " updated!"); 
	}
}

function updateCourseColor(courseid){
	document.getElementById(courseid).firstChild.classList.add("highlightChange");
}

function closeEditCourse()
{
	$(".item").css("border", "none");
	$(".item").css("box-shadow", "none");
	$("#editCourse").css("display", "none");
	
	//resets all inputs
	resetinputs();
}

function closeNewCourse()
{
	$(".item").css("border", "none");
	$(".item").css("box-shadow", "none");
	$("#newCourse").css("display", "none");
	$("#overlay").css("display", "none");
}

function newCourse()
{
	$("#newCourse").css("display", "flex");
	//$("#overlay").css("display", "block");
}

function createNewCourse()
{
	var coursename = $("#ncoursename").val();
	var coursecode = $("#ncoursecode").val();
	var courseGitURL = $("#ncoursegit-url").val();
	$("#newCourse").css("display", "none");
	//$("#overlay").css("display", "none");

	//Check if user has input for Git-URL
	if(courseGitURL) {
		//Check if fetchGitHubRepo returns true
		if(fetchGitHubRepo(courseGitURL)) {
			localStorage.setItem('lastCC', true);
			AJAXService("NEW", { coursename : coursename, coursecode : coursecode, courseGitURL : courseGitURL }, "COURSE");
			alert("New course, " + coursename + " added with GitHub-link!");
			fetchLatestCommit(courseGitURL);
		}
		//Else: get error message from the fetchGitHubRepo function.

	} else {
		//If courseGitURL has no value, update the course as usual.
		localStorage.setItem('lastCC', true);
		AJAXService("NEW", { coursename : coursename, coursecode : coursecode, courseGitURL : courseGitURL }, "COURSE");
		alert("New course, " + coursename + " added!");
	}
}

//Send valid GitHub-URL to PHP-script which fetches the contents of the repo
function fetchGitHubRepo(gitHubURL) 
{
	//Remove .git, if it exists
	regexURL = gitHubURL.replace(/.git$/, "");
	//Used to return success(true) or error(false) to the calling function
	var dataCheck;
	$.ajax({
		async: false,
		url: "gitfetchService.php",
		type: "POST",
		data: {'githubURL':regexURL, 'action':'getNewCourseGitHub'},
		success: function() { 
			//Returns true if the data and JSON is correct
			dataCheck = true;
		},
		error: function(data){
			//Check FetchGithubRepo for the meaning of the error code.
			switch(data.status){
				case 422:
					alert(data.responseJSON.message + "\nDid not create/update course");
					break;
				case 503:
					alert(data.responseJSON.message + "\nDid not create/update course");
					break;
				default:
					alert("Something went wrong...");
			}
		 	dataCheck = false;
		}
	});
	return dataCheck;
}

//Send valid GitHub-URL to PHP-script which gets and saves the latest commit in the sqllite db
function fetchLatestCommit(gitHubURL) 
{
	//Used to return success(true) or error(false) to the calling function
	var dataCheck;
	$.ajax({
		async: false,
		url: "../DuggaSys/gitcommitService.php",
		type: "POST",
		data: {'githubURL':gitHubURL, 'action':'getCourseID'},
		success: function() { 
			//Returns true if the data and JSON is correct
			dataCheck = true;
		},
		error: function(data){
			//Check FetchGithubRepo for the meaning of the error code.
			switch(data.status){
				case 422:
					alert(data.responseJSON.message + "\nDid not create/update course");
					break;
				case 503:
					alert(data.responseJSON.message + "\nDid not create/update course");
					break;
				default:
					alert("Something went wrong...");
			}
		 	dataCheck = false;
		}
	});
	return dataCheck;
}

//Send new Github URL and course id to PHP-script which gets and saves the latest commit in the sqllite db
function updateGithubRepo(githubURL, cid) {
	//Used to return success(true) or error(false) to the calling function
	var dataCheck;
	$.ajax({
		async: false,
		url: "../DuggaSys/gitcommitService.php",
		type: "POST",
		data: {'githubURL':githubURL, 'cid':cid, 'action':'updateGithubRepo'},
		success: function() { 
			//Returns true if the data and JSON is correct
			dataCheck = true;
		},
		error: function(data){
			//Check FetchGithubRepo for the meaning of the error code.
			switch(data.status){
				case 422:
					alert(data.responseJSON.message + "\nDid not create/update course");
					break;
				case 503:
					alert(data.responseJSON.message + "\nDid not create/update course");
					break;
				default:
					alert("Something went wrong...");
			}
		 	dataCheck = false;
		}
	});
	return dataCheck;
}

function copyVersion()
{
	svers = $("#copyversion").val();
	dvers = $("#versid").val();
	sstr = "Are you sure you want to copy from the version with id " + svers + " to a new version with the id " + dvers;
	//all inputs = empty
}

function resetinputs()
{
	$('#coursename').val("");
	$('#coursecode').val("");
	$('#versid').val("");
	$('#versname').val("");
}

function createVersion()
{
	$(".item").css("background", "#fff");
	$(".item").css("border", "none");
	$(".item").css("box-shadow", "none");
	$(".item").css("background", "#fff");
	$("#editCourse").css("display", "none");

	// Set Name
	var versid = $("#versid").val();
	var versname = $("#versname").val();
	var cid = $("#cid").val();

	AJAXService("NEWVRS", {	cid : cid, versid : versid, versname : versname	}, "COURSE");
	
	//resets all inputs
	resetinputs();
}

function selectCourse(cid, coursename, coursecode, visi, vers, edvers)
{
	$(".item").css("border", "none");
	$(".item").css("box-shadow", "none");

	// Convert representation of swedish letters
	var tempCoursename = coursename;
	tempCoursename = tempCoursename.replace(/&Aring;/g, "Å");
	tempCoursename = tempCoursename.replace(/&aring;/g, "å");
	tempCoursename = tempCoursename.replace(/&Auml;/g, "Ä");
	tempCoursename = tempCoursename.replace(/&auml;/g, "ä");
	tempCoursename = tempCoursename.replace(/&Ouml;/g, "Ö");
	tempCoursename = tempCoursename.replace(/&ouml;/g, "ö");
	
	// Set Name
	$("#coursename").val(tempCoursename);
	// Set Cid
	$("#cid").val(cid);
	// Set Code
	$("#coursecode").val(coursecode);

	//Give data attribute to course code input to check if input value is same as actual code for validation
	$("#coursecode").attr("data-origincode", coursecode);
	
	// Set Visibiliy
	str = "";

	if (visi == 0) {
		str += "<option selected='selected' value='0'>Hidden</option>";
	} else {
		str += "<option value='0'>Hidden</option>";
	}

	if (visi == 1) {
		str += "<option selected='selected' value='1'>Public</option>";
	} else {
		str += "<option value='1'>Public</option>";
	}

	if (visi == 2) {
		str += "<option selected='selected' value='2'>Login</option>";
	} else {
		str += "<option value='2'>Login</option>";
	}

	if (visi == 3) {
		str += "<option selected='selected' value='3'>Deleted</option>";
	} else {
		str += "<option value='3'>Deleted</option>";
	}

	$("#visib").html(str);
	var cstr = "";
	var sstr = "";
	var estr = "";

	if (versions.length > 0) {
		for ( i = 0; i < versions.length; i++) {
			var item = versions[i];
			if (cid == item['cid']) {
				var vvers = item['vers'];
				var vname = item['versname'];

				if (vvers == vers) {
					sstr += "<option selected='selected' value='" + vvers + "'>" + vname + "</option>";
				} else {
					sstr += "<option value='" + vvers + "'>" + vname + "</option>";
				}
				if (vvers == edvers) {
					estr += "<option selected='selected' value='" + vvers + "'>" + vname + "</option>";
				} else {
					estr += "<option value='" + vvers + "'>" + vname + "</option>";
				}
				cstr += "<option value='" + vvers + "'>" + vname + "</option>";
			}
		}
	}

	$("#activeversion").html(sstr);
	$("#activeedversion").html(estr);
	$("#copyversion").html(cstr);

	// Show dialog
	$("#editCourse").css("display", "flex");
	// Get focus on the first input to use tab function
	document.getElementById("coursename").focus();

	//$("#overlay").css("display", "block");

	return false;
}

function getCurrentVersion(cid){
	var currentVersion = "None";
	if (entries.length > 0) {
		for ( i = 0; i < entries.length; i++) {
			var item = entries[i];
			if (cid == item['cid']) {
				currentVersion = item['activeversion'];
			}
		}
	}
	return currentVersion;
}

function editVersion(cid, cname, ccode) {

		document.getElementById('newCourseVersion').style.display = "flex";
		//document.getElementById('overlay').style.display = "block";
		document.getElementById('cid').value = cid;
		document.getElementById('coursename1').value = cname;
		document.getElementById('coursecode1').value = ccode;
		var currentVersion = getCurrentVersion(cid);

		var str = "<select class='course-dropdown'>";
		str += "<option value='None'"	;

		if(currentVersion=="None"){
			str += "selected";
			var versionname=vname;
		}
		str += ">-</option>";

		if (versions.length > 0) {
			for ( i = 0; i < versions.length; i++) {
				var item = versions[i];
				if (cid == item['cid']) {
					var vvers = item['vers'];
					var vname = item['versname'];
					str += "<option value='"+ vvers + "'";
					if(currentVersion==vvers){
						str += "selected";
						var versionname=vname;
					}
					str += ">" + vname + " - " + vvers + "</option>";
				}
			}
		}
			str+="</select>";
			document.getElementById('copyvers').innerHTML = str;
}

function editSettings(){
	const messageElement = document.getElementById("motd");
	const readOnlyCheckbox = document.getElementById("readonly");
	const popupContainer = document.getElementById("editSettings");

	var tempMotd = motd;
	tempMotd = motd.replace(/&Aring;/g, "Å").replace(/&aring;/g, "å").replace(/&Auml;/g, "Ä").replace(/&auml;/g, "ä").replace(/&Ouml;/g, "Ö").replace(/&ouml;/g, "ö").replace(/&amp;/g, "&").replace(/&#63;/g, "?");
	
	if(motd !== "UNK") {
		
		messageElement.value = tempMotd;
	} 

	if(readonly === 1) {
		readOnlyCheckbox.checked = true;
	} else if(readonly === 0) {
		readOnlyCheckbox.checked = false;
	}

	popupContainer.style.display = "flex";
	// Get focus on the motd to use tab function
	document.getElementById("motd").focus();
}

function updateSettings() {
	const messageElement = document.getElementById("motd");
	const readOnlyCheckbox = document.getElementById("readonly");
	const popupContainer = document.getElementById("editSettings");

	if(readOnlyCheckbox.checked) {
		readonly = 1;
	} else {
		readonly = 0;
	}
	if (window.bool9 === true) {
		alert('Version updated');
		popupContainer.style.display = "none";
		AJAXService("SETTINGS", {motd: messageElement.value, readonly: readonly}, "COURSE");
	  } else {
		alert("You have entered incorrect information");
	  }
}

function createVersion(){

	var cid = $("#cid").val();
	var versid = $("#versid").val();
	var versname = $("#versname").val();
	var coursecode = $("#course-coursecode").text();
	var courseid = $("#course-courseid").text();
	var coursename = $("#course-coursename").text();
	var makeactive = $("#makeactive").is(':checked');
	var coursevers = $("#course-coursevers").text();
	var copycourse = $("#copyvers").val();
	var comments = $("#comments").val();
  var startdate = $("#startdate").val();
  var enddate = $("#enddate").val();

	if (versid=="" || versname=="") {
		alert("Version Name and Version ID must be entered!");
	} else {
		if(coursevers=="null"){
			makeactive=true;
		}

		if (copycourse != "None"){
				//create a copy of course version
        AJAXService("CPYVRS", {
          cid : cid,
          versid : versid,
          versname : versname,
          coursecode : coursecode,
          coursename : coursename,
          copycourse : copycourse,
          startdate : startdate,
          enddate : enddate,
          makeactive : makeactive
        }, "COURSE");

		} else {
			//create a fresh course version
			AJAXService("NEWVRS", {
				cid : cid,
				versid : versid,
				versname : versname,
				coursecode : coursecode,
				coursename : coursename,
        makeactive : makeactive
			}, "COURSE");
		}

		$("#newCourseVersion").css("display","none");
		$("#overlay").css("display","none");
	}

}

// //----------------------------------------
// // Dark mode toggle button listener.  
// //----------------------------------------

// /*/ The code below is waitng for the page to load, and check when the user changes his/her 
// operative system to either black or white mode . /*/

// const themeStylesheet = document.getElementById('themeBlack');

// document.addEventListener('DOMContentLoaded', () => {
// 	const storedTheme = localStorage.getItem('themeBlack');
// 	if(storedTheme){
// 			themeStylesheet.href = storedTheme;
// 	}
// 	const themeToggle = document.getElementById('theme-toggle');
// 	themeToggle.addEventListener('click', () => {
// 			// if it's light -> go dark
// 			if(themeStylesheet.href.includes('blackTheme')){
// 					themeStylesheet.href = "../Shared/css/whiteTheme.css";
// 					localStorage.setItem('themeBlack',themeStylesheet.href)
// 					// themeToggle.innerText = 'Switch to light mode';
// 			} else if(themeStylesheet.href.includes('whiteTheme')) {
// 					// if it's dark -> go light
// 					themeStylesheet.href = "../Shared/css/blackTheme.css";
// 					localStorage.setItem('themeBlack',themeStylesheet.href)
// 					// themeToggle.innerText = 'Switch to dark mode';
// 			}		
// 	})
// })

// //It actively checks if the "theme" changes on the operating system and changes colors based on it. It override your preferences.
// window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
// 	const newColorScheme = e.matches ? "dark" : "light";
// 	if(newColorScheme == "dark") {
// 		themeStylesheet.href = "../Shared/css/blackTheme.css";
// 		localStorage.setItem('themeBlack',themeStylesheet.href)
// 	}
// 	else {
// 		themeStylesheet.href = "../Shared/css/whiteTheme.css";
// 		localStorage.setItem('themeBlack',themeStylesheet.href)
// 	}
// });


//----------------------------------------
// Renderer
//----------------------------------------

function returnedCourse(data)
{
	versions = data['versions'];
	entries = data['entries'];
	if(data['LastCourseCreated'][0] != undefined){
		LastCourseCreated = data['LastCourseCreated'][0]['LastCourseCreatedId'];
		localStorage.setItem('lastCourseCreatedId', LastCourseCreated);

	}

	var uname=document.getElementById('userName').innerHTML;

	// Fill section list with information
	str = "";

	

	// Course Name
	str += "<div id='Courselistc' style='margin:60px auto;'>";

	// Show the [LenaSYS] Course Organization System - header. Ellipsis on it if the page gets too narrow
	str += "<div id='lena' class='head nowrap' style='display: flex; align-items: center;justify-content: center;''><a href='https://github.com/HGustavs/LenaSYS' target='_blank'><span class='sys'><span class='lena'>LENA</span>Sys</span></a><div id='CourseOrgSys'> Course Organization System</div>"
	if (data['writeaccess']){
		str+="<img alt='settings icon' tabindex='0' class='whiteIcon' style='margin-left:17px;cursor:pointer;' src='../Shared/icons/Cogwheel.svg' onclick='editSettings(); 'title='Edit Server Settings'>"
	}
	str+="</div>";
	// For now we only have two kinds of sections
	if (data['entries'].length > 0) {
		for ( i = 0; i < data['entries'].length; i++) {
			var item = data['entries'][i];

			// Do not show courses the user does not have access to.
			if (!data['writeaccess'] && !item['registered'] && uname !="Guest" && uname)
				continue;

			str += `<div class='bigg item nowrap' style='display: flex; align-items: center; justify-content: center;' id='C${item['cid']}' data-code='${item['coursecode']}'>`;

			var textStyle ="";
			if (parseInt(item['visibility']) == 0) {
				textStyle += "hidden";
			} else if (parseInt(item['visibility']) == 2) {
				textStyle += "login";
			} else if (parseInt(item['visibility']) == 3) {
				textStyle += "deleted";
			} else textStyle+="courseed";

			var courseString = item['coursename'];
			var courseBegin = "";
			var courseEnd = "";
			var courseSplitIndex = courseString.lastIndexOf(" ");
			if(courseSplitIndex>0) { // There is a space in the course name
					courseBegin = courseString.substr(0, courseSplitIndex);
					courseEnd = courseString.substr(courseSplitIndex);
			} else { // No space in course name, so just split the name in half *chop chop*
					courseSplitIndex = parseInt(courseString.length/2);
					courseBegin = courseString.substr(0, courseSplitIndex);
					courseEnd = courseString.substr(courseSplitIndex);
			}

			if (data['writeaccess']) {
        		str += "<div class='ellipsis' style='margin-right:15px;'><a class='"+textStyle+"' href='sectioned.php?courseid=" + item['cid'] + "&coursename=" + item['coursename'] + "&coursevers=" + item['activeversion'] + "' title='\"" + item['coursename'] + "\" [" + item['coursecode'] + "]'>" + courseBegin + courseEnd + "</a></div>";
        		str += "<span style='margin-bottom: 0px'>";

				    str += "<span><img alt='course settings icon' tabindex='0' class='courseSettingIcon' id='dorf' style='position: relative; top: 2px;' src='../Shared/icons/Cogwheel.svg' onclick='selectCourse(\"" + item['cid'] + "\",\"" + htmlFix(item['coursename']) + "\",\"" + item['coursecode'] + "\",\"" + item['visibility'] + "\",\"" + item['activeversion'] + "\",\"" + item['activeedversion'] + "\");' title='Edit \"" + item['coursename'] + "\" '></span>";
        
        		str += "</span>";
      		} else {
        		str += "<div class='ellipsis'>";

				if(item['registered'] == true || uname=="Guest") {
          			str += "<span style='margin-right:15px;'><a class='" + textStyle + "' href='sectioned.php?courseid=" + item['cid'] + "&coursename=" + item['coursename'] + "&coursevers=" + item['activeversion'] + "' title='\"" + item['coursename'] + "\" [" + item['coursecode'] + "]'>" + item['coursename'] + "</a></span>";
        		}else{
          			str += "<a class='" + textStyle + "' href='sectioned.php?courseid=" + item['cid'] + "&coursename=" + item['coursename'] + "&coursevers=" + item['activeversion'] + "' title='\"" + item['coursename'] + "\" [" + item['coursecode']+ "] '>" + item['coursename'] + "</a></span>";
        		}

        		str += "</div>";
			}

			str += "</div>";
		}
	} else {
		// No items were returned!
		str += "<div class='bigg'>";
		str += "<span>There are no courses available at this point in time.</span>";
		str += "</div>";
	}

	str += "</div>";
	if (data['writeaccess']) {
		str += "<div style='float:right;'>";
		str += "<div class='fixed-action-button extra-margin'>";
		str += "<a class='btn-floating fab-btn-lg noselect' id='fabBtn' onclick='newCourse()' tabindex='0'>+</a>";
		str += "</div>";
		str += "</div>";
	}
	var slist = document.getElementById('Courselist');
	slist.innerHTML = str;

	if (data['debug'] != "NONE!") {
		alert(data['debug']);
	}

	motd = data["motd"];
	readonly = parseInt(data["readonly"]);
	
	if(motd!=="UNK"){
        document.getElementById("servermsg").innerHTML=data["motd"];
        if(sessionStorage.getItem('show')=='false'){
            document.getElementById("servermsgcontainer").style.display="none";
            document.getElementById("motdNav").style.display="inline-block";
        }else {
            document.getElementById("servermsgcontainer").style.display="flex";
            document.getElementById("motdNav").style.display="none";
        }

    }

	resetinputs();
	//resets all inputs

	//After all courses have been created and added to the list the course code can be accessed from each course element and pushed to array
	setActiveCodes();
}

/* Used to enable using list entries with ' */
function htmlFix(text){
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}


let activeCodes = [];

//Gets all active course codes in the list by the data-code attribute all items have when created based on database values.
function setActiveCodes() {
	activeCodes = [];
	const items = document.querySelectorAll(".item");
	items.forEach(item => {
		const code = item.dataset.code;
		if(typeof code !== "undefined" && code !== null) {
			activeCodes.push(code)
		}
	});
}

const regex = {
	coursename: /^[A-ZÅÄÖa-zåäö]+( ?(- ?)?[A-ZÅÄÖa-zåäö]+)*$/,
	coursecode: /^[a-zA-Z]{2}\d{3}[a-zA-Z]{1}$/,
	courseGitURL: /^(https?:\/\/)?(github)(\.com\/)([\w-]*\/)([\w-]+)$/

};

//Validates single element against regular expression returning true if valid and false if invalid
function elementIsValid(element) {
	const messageElement = element.parentNode.nextElementSibling; //The dialog to show validation messages in
	//Standard styling for a failed validation that will be changed if element passes validation
	element.classList.add("bg-color-change-invalid");
	$(messageElement.firstChild.id).fadeIn();
	//messageElement.style.display = "block";

	//Check if value of element matches regex based on name attribute same as key for regex object
	if(element.value.match(regex[element.name])) {
		//Seperate validation for coursecodes since it should not be possible to submit form if course code is in use
		if(element.name === "coursecode") {
			//Check for duplicate course codes only if value of input is not same as the course code that will be editied
			//This prevents it from being impossible to save course code without changing it
			if(element.value !== element.dataset.origincode) {
				if(activeCodes.includes(element.value)) {
					messageElement.firstChild.innerHTML = `${element.value} is already in use. Choose another.`;
					return false;
				}
			}
		}

		//Setting the style of the element represent being valid and not show
		element.classList.remove("bg-color-change-invalid");
		element.style.borderColor = "#383";
		$(messageElement.firstChild).fadeOut();
		//messageElement.style.display = "none";
		return true;
	} else if(element.value.trim() === "") {
		//If empty string or ettempty of only spaces remove styling and spaces and hide validation message
		$(messageElement.firstChild).fadeOut();
		element.removeAttribute("style");
		element.value = "";
		//messageElement.style.display = "none";
		element.classList.remove("bg-color-change-invalid");

		// The inputs for the git URLs are valid even when they're empty, since they're optional
		if(element.name === "courseGitURL") {
			return true;
		}
		return false;
	}

	//Change back to original validation error message if it has been changed when knowing course code is not duplicate
	if(element.name === "coursecode") {
		messageElement.firstChild.innerHTML = "2 Letters, 3 digits, 1 letter";
	}
	$(messageElement.firstChild).hide().fadeIn();
	//Validation falied if getting here without returning
	return false;
}

//Validates whole form but don't implement it.
function quickValidateForm(formid, submitButton){
	const formContainer = document.getElementById(formid);
	const inputs = formContainer.querySelectorAll("input.validate");
	const saveButton = document.getElementById(submitButton);
	let numberOfValidInputs = 0;

	//Count number of valid inputs
	inputs.forEach(input => {
		if(elementIsValid(input)) {
			numberOfValidInputs++;
		}
	});

	//If all inputs were valid create course or update course depending on id of form
	if(numberOfValidInputs === inputs.length) {
		saveButton.disabled = false;
		return true;
	} else{
		saveButton.disabled = true;
	}
	return false;
}

//Validates whole form
function validateForm(formid) {
	const formContainer = document.getElementById(formid);
	const inputs = formContainer.querySelectorAll("input.validate");
	let numberOfValidInputs = 0;

	//Count number of valid inputs
	inputs.forEach(input => {
		if(elementIsValid(input)) {
			numberOfValidInputs++;
		}
	});

	//If all inputs were valid create course or update course depending on id of form
	if(numberOfValidInputs === inputs.length) {
		if(formid === "newCourse") {
			createNewCourse();
		} else if(formid === "editCourse") {
			updateCourse();
		}

		//Reset inputs
		inputs.forEach(input => {
			input.value = "";
			input.removeAttribute("style");
		});
	} else {
		//Go through inputs until empty value found or all is iterated. Return true if any is empty and false if none is empty.
		const isAnyEmpty = [...inputs].some(input => input.value === null || input.value.trim() === "");
		if(isAnyEmpty) {
			alert("Fill in all fields");
		} else {
			alert("You have entered incorrect information...");
		}
	}
}
function validateMOTD(motd, syntaxdialogid, rangedialogid, submitButton){
	const saveButton = document.getElementById(submitButton);
	var emotd = document.getElementById(motd);
	var Emotd = /(^$)|(^[-a-zåäöA-ZÅÄÖ0-9_+§&%# ?!,.]*$)/;
	var EmotdRange = /^.{0,100}$/;
	var x4 = document.getElementById(syntaxdialogid);
	var x8 = document.getElementById(rangedialogid);
	if (emotd.value.match(Emotd) ) {
		$(x4).fadeOut()
		//x4.style.display = "none";
		window.bool9 = true;
	} else {
		$(x4).fadeIn()
		//x4.style.display = "block";
		window.bool9 = false;
	}
	if (emotd.value.match(EmotdRange)){
		$(x8).fadeOut()
		//x8.style.display = "none";
		window.bool9 = true;
	}else{
		$(x8).fadeIn()
		//x8.style.display = "block";
		window.bool9 = false;
	}
	if (emotd.value.match(Emotd) && emotd.value.match(EmotdRange) ){
		emotd.style.backgroundColor = "#ffff";
		emotd.style.borderColor = "#383";
		emotd.style.borderWidth = "2px";
		saveButton.disabled = false;
	}else{
		emotd.style.backgroundColor = "#f57";
		emotd.style.borderColor = "#E54";
		emotd.style.borderWidth = "2px";
		saveButton.disabled = true;
	}
  
  }

/*Change the value of MOTDbutton when the screen width is less than 275 px*/ 
function MOTDbtnValueX(x) {
	if (x.matches) { // If media query matches
		document.getElementById("MOTDbutton").value = "X";
	} else if(document.readyState === 'complete') {
		document.getElementById("MOTDbutton").value = "Close";
	}
  }
 
  var x = window.matchMedia("(max-width: 275px)");
  MOTDbtnValueX(x); 
  x.addListener(MOTDbtnValueX); 
  
 //Adds an eventlistener for keydowns. if the key is Enter and the targeted element is fab-btn-lg then perform it's onclick functionality
document.addEventListener('keydown', function(event) {
	if(event.key === 'Enter'){
		if ($(event.target)[0].classList.contains("fab-btn-lg")) {
			newCourse();
		}
	}
});

//Run after ajax is completed
$( document ).ajaxComplete(function() {
    localStorageCourse();
});

function localStorageCourse(){
	// check if lastcourse created is true to add glow to the relative text 
    if(localStorage.getItem("lastCC") == "true"){
        var StorageCourseId = localStorage.getItem("lastCourseCreatedId");
        glowNewCourse(StorageCourseId);
        localStorage.setItem('lastCourseCreatedId', " ");
        localStorage.setItem('lastCC', false);
    }

	// check if updateCourseName is true to add glow to the relative text 
	if(localStorage.getItem("updateCourseName") == "true"){
        var StorageCourseId= localStorage.getItem("courseid");
        updateCourseColor(StorageCourseId);
        localStorage.setItem('courseid', " ");
        localStorage.setItem('updateCourseName', false);
    }
}

function glowNewCourse(courseid){
    document.getElementById("C"+courseid).firstChild.setAttribute("class", "highlightChange");
}