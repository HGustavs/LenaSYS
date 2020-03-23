/********************************************************************************

   Globals

*********************************************************************************/

var sessionkind = 0;
var querystring = parseGet();
var versions;
var entries;
var motd;

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


	// Set Name
	$("#coursename").val(coursename);
	// Set Cid
	$("#cid").val(cid);
	// Set Code
	$("#coursecode").val(coursecode);
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
		if(motd!=="UNK") $("#motd").val(motd);
		document.getElementById('editSettings').style.display = "flex";

}

function updateSettings() {

		var motd = $("#motd").val();
		var readonly = 0;
		if ($("#readonly").val() == "yes"){
			readonly = 1;
		}

		// Show dialog
		$("#editSettings").css("display", "none");

		AJAXService("SETTINGS", {	motd : motd, readonly : readonly}, "COURSE");
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

			str += "<div class='bigg item nowrap' style='display: flex; align-items: center;justify-content: center;' id='C" + item['cid'] + "'>";

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
	motd=data["motd"]
	if(motd!=="UNK"){
		document.getElementById("servermsg").innerHTML=data["motd"];
		document.getElementById("servermsgcontainer").style.display="flex";
	} else {
		document.getElementById("servermsgcontainer").style.display="none";
	}

	resetinputs();
	//resets all inputs
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
