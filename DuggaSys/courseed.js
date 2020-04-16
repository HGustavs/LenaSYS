/********************************************************************************

   Globals

*********************************************************************************/

var sessionkind = 0;
var querystring = parseGet();
var versions;
var entries;
var motd;
var readonly;

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
	var visib = $("#visib").val();
	// Show dialog
	$("#editCourse").css("display", "none");

	$("#overlay").css("display", "none");

	AJAXService("UPDATE", {	cid : cid, coursename : coursename, visib : visib, coursecode : coursecode }, "COURSE");
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
	$("#newCourse").css("display", "none");
	//$("#overlay").css("display", "none");
	AJAXService("NEW", { coursename : coursename, coursecode : coursecode }, "COURSE");
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
	$(".item").css("background", "#fff");

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

	if(motd !== "UNK") {
		messageElement.value = motd;
	} 

	if(readonly === 1) {
		readOnlyCheckbox.checked = true;
	} else if(readonly === 0) {
		readOnlyCheckbox.checked = false;
	}

	popupContainer.style.display = "flex";
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

	popupContainer.style.display = "none";

	AJAXService("SETTINGS", {motd: messageElement.value, readonly: readonly}, "COURSE");
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

//----------------------------------------
// Renderer
//----------------------------------------

function returnedCourse(data)
{
	versions = data['versions'];
	entries = data['entries'];
	var uname=document.getElementById('userName').innerHTML;

	// Fill section list with information
	str = "";

	if (data['writeaccess']) {
		str += "<div style='float:right;'>";
		if(localStorage.getItem("cookieMessage")!="off"){
			str += "<div class='fixed-action-button' style='bottom:64px;'>";
		}else{
			str += "<div class='fixed-action-button'>";
		}
		str += "<a class='btn-floating fab-btn-lg noselect' id='fabBtn' onclick='newCourse()'>+</a>";
		str += "</div>";
		str += "</div>";
	}

	// Course Name
	str += "<div id='Courselistc'>";

	// Show the [LenaSYS] Course Organization System - header. Ellipsis on it if the page gets too narrow
	str += "<div id='lena' class='head nowrap' style='display: flex; align-items: center;justify-content: center;''><a href='https://github.com/HGustavs/LenaSYS'><span class='sys'><span class='lena'>LENA</span>Sys</span></a><div class='ellipsis'> Course Organization System</div>"
	if (data['writeaccess']){
		str+="<img style='margin-left:17px;cursor:pointer;' src='../Shared/icons/Cogwheel.svg' onclick='editSettings(); 'title='Edit Server Settings'>"
	}
	str+="</div>";
	// For now we only have two kinds of sections
	if (data['entries'].length > 0) {
		for ( i = 0; i < data['entries'].length; i++) {
			var item = data['entries'][i];

			str += `<div class='bigg item nowrap' style='display: flex; align-items: center; justify-content: center;' id='C${item['cid']}' data-code='${item['coursecode']}'>`;

			var textStyle ="";
			if (parseInt(item['visibility']) == 0) {
				textStyle += "hidden";
			} else if (parseInt(item['visibility']) == 2) {
				textStyle += "login";
			} else if (parseInt(item['visibility']) == 3) {
				textStyle += "deleted"
			}

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

				    str += "<span><img id='dorf' style='position: relative; top: 2px;' src='../Shared/icons/Cogwheel.svg' onclick='selectCourse(\"" + item['cid'] + "\",\"" + htmlFix(item['coursename']) + "\",\"" + item['coursecode'] + "\",\"" + item['visibility'] + "\",\"" + item['activeversion'] + "\",\"" + item['activeedversion'] + "\");' title='Edit \"" + item['coursename'] + "\" '></span>";
        
        		str += "</span>";
      		} else {
        		str += "<div class='ellipsis' style='margin-right:15px;'>";
				if(item['registered'] == true || uname=="Guest") {
          			str += "<span style='margin-right:15px;'><a class='" + textStyle + "' href='sectioned.php?courseid=" + item['cid'] + "&coursename=" + item['coursename'] + "&coursevers=" + item['activeversion'] + "' title='\"" + item['coursename'] + "\" [" + item['coursecode'] + "]'>" + item['coursename'] + "</a></span>";
        		}else{
          			str += "<span style='margin-right:15px;opacity:0.3'><a class='" + textStyle + "' href='sectioned.php?courseid=" + item['cid'] + "&coursename=" + item['coursename'] + "&coursevers=" + item['activeversion'] + "' title='\"" + item['coursename'] + "\" [" + item['coursecode']+ "] '>" + item['coursename'] + "</a></span>";
        		}
        		str += "</div>";
			}

			str += "</div>";
      if (data['entries'].length-1 == i){
        str += "<div class='bigg item nowrap' style='padding-bottom: 5px;'></div>";
      }
		}
	} else {
		// No items were returned!
		str += "<div class='bigg'>";
		str += "<span>There are no courses available at this point in time.</span>";
		str += "</div>";
	}

	str += "</div>";

	var slist = document.getElementById('Courselist');
	slist.innerHTML = str;

	if (data['debug'] != "NONE!") {
		alert(data['debug']);
	}

	motd = data["motd"];
	readonly = parseInt(data["readonly"]);

	if(motd!=="UNK"){
		document.getElementById("servermsg").innerHTML=data["motd"];
		document.getElementById("servermsgcontainer").style.display="flex";
	} else {
		document.getElementById("servermsgcontainer").style.display="none";
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
	coursename: /^[A-ZÅÄÖa-zåäö]+[+]{0,2}( (- )?[A-ZÅÄÖa-zÅÄÖ]+[+]{0,2})*$/,
	coursecode: /^[a-zA-Z]{2}\d{3}[a-zA-Z]{1}$/
};

//Validates single element against regular expression returning true if valid and false if invalid
function elementIsValid(element) {
	const messageElement = element.parentNode.nextElementSibling; //The dialog to show validation messages in

	//Standard styling for a failed validation that will be changed if element passes validation
	element.style.borderWidth = "2px";
	element.style.borderColor = "#E54";
	messageElement.style.display = "block";

	//Check if value of element matches regex based on name attribute same as key for regex object
	if(element.value.match(regex[element.name])) {
		//Seperate validation for coursecodes since it should not be possible to submit form if course code is in use
		if(element.name === "coursecode") {
			//Check for duplicate course codes only if value of input is not same as the course code that will be editied
			//This prevents it from being impossible to save course code without changing it
			if(element.value !== element.dataset.origincode) {
				if(activeCodes.includes(element.value)) {
					messageElement.innerHTML = `${element.value} is already in use. Choose another.`;
					return false;
				}
			}
		}

		//Setting the style of the element represent being valid and not show
		element.style.borderColor = "#383";
		messageElement.style.display = "none";
		return true;
	} else if(element.value.trim() === "") {
		//If empty string or ettempty of only spaces remove styling and spaces and hide validation message
		element.removeAttribute("style");
		element.value = "";
		messageElement.style.display = "none";
	}

	//Change back to original validation error message if it has been changed when knowing course code is not duplicate
	if(element.name === "coursecode") {
		messageElement.innerHTML = "2 Letters, 3 digits, 1 letter";
	}

	//Validation falied if getting here without returning
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
			alert("New course added!");
		} else if(formid === "editCourse") {
			updateCourse();
			alert("Course updated!");
		}

		//Reset inputs
		inputs.forEach(input => {
			input.value = "";
			input.removeAttribute("style");
		});
	} else {

	}
}