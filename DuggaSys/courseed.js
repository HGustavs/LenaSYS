var sessionkind = 0;
var querystring = parseGet();
var versions;

AJAXService("GET", {}, "COURSE");

//----------------------------------------
// Commands:
//----------------------------------------

function updateCourse() {
	var coursename = $("#coursename").val();
	var cid = $("#cid").val();
	var coursecode = $("#coursecode").val();
	var visib = $("#visib").val();

	var activevers = $("#activeversion").val();
	var activeedvers = $("#activeedversion").val();

	// Show dialog
	$("#editCourse").css("display", "none");

	AJAXService("UPDATE", {
		cid : cid,
		coursename : coursename,
		visib : visib,
		activevers : activevers,
		activeedvers : activeedvers,
		coursecode : coursecode
	}, "COURSE");

}

function accessCourse() {
	window.location.href = "accessed.php?cid=" + $("#cid").val();
	resetinputs();
	//resets all inputs

}

function closeSelect() {
	$(".item").css("border", "none");
	$(".item").css("box-shadow", "none");
	$("#editCourse").css("display", "none");
	
		resetinputs();
	//resets all inputs
}

function newCourse() {
	AJAXService("NEW", {}, "COURSE");
}

function copyVersion() {
	svers = $("#copyversion").val();
	dvers = $("#versid").val();

	sstr = "Are you sure you want to copy from the version with id " + svers + " to a new version with the id " + dvers;
	/*if (confirm(sstr)) {
		alert("TKONG!");
	}
	*/
			
	//all inputs = empty
}

function resetinputs(){
		

$('#coursename').val("");
$('#coursecode').val("");
$('#versid').val("");
$('#versname').val("");


}


function createVersion() {
	$(".item").css("background", "#fff");
	$(".item").css("border", "none");
	$(".item").css("box-shadow", "none");
	$(".item").css("background", "#fff");


	$("#editCourse").css("display", "none");

	// Set Name
	var versid = $("#versid").val();
	var versname = $("#versname").val();
	var cid = $("#cid").val();

	AJAXService("NEWVRS", {
		cid : cid,
		versid : versid,
		versname : versname
	}, "COURSE");
	
	resetinputs();
	//resets all inputs
	
}

function selectCourse(cid, coursename, coursecode, visi, vers, edvers) {
	console.log(cid, coursename, coursecode, visi, vers, edvers);
	$(".item").css("border", "none");
	$(".item").css("box-shadow", "none");
	$("#C" + cid).css("border", "2px dashed #FC5");
	$("#C" + cid).css("box-shadow", "1px 1px 3px #000 inset");
	$(".item").css("background", "#fff");
	$("#C" + cid).css("background", "#EDF");

	// Set Name
	$("#coursename").val(coursename);

	// Set Cid
	$("#cid").val(cid);

	// Set Code
	$("#coursecode").val(coursecode);

	// Set Visibiliy
	str = "";
	if (visi == 0)
		str += "<option selected='selected' value='0'>Hidden</option>";
	else
		str += "<option value='0'>Hidden</option>";
	if (visi == 1)
		str += "<option selected='selected' value='1'>Public</option>";
	else
		str += "<option value='1'>Public</option>";
	if (visi == 2)
		str += "<option selected='selected' value='2'>Login</option>";
	else
		str += "<option value='2'>Login</option>";
	if (visi == 3)
		str += "<option selected='selected' value='3'>Deleted</option>";
	else
		str += "<option value='3'>Deleted</option>";
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
	$("#editCourse").css("display", "block");

			resetinputs();
	//resets all inputs
	return false;
}

//----------------------------------------
// Renderer
//----------------------------------------

function returnedCourse(data) {

	versions = data['versions'];

	// Fill section list with information
	str = "";

	if (data['writeaccess']) {
		str += "<div style='float:right;'>";
		str += "<input class='submit-button' type='button' value='New' onclick='newCourse();'/>";
		str += "</div>";
	}

	// Course Name
	str += "<div id='Courselistc' >";

	str += "<div id='lena' class='head'><a href='https://github.com/HGustavs/LenaSYS_2014'><span class='sys'><span class='lena'>LENA</span>Sys</span></a> Course Organization System</div>";

	// For now we only have two kinds of sections
	if (data['entries'].length > 0) {
		for ( i = 0; i < data['entries'].length; i++) {
			var item = data['entries'][i];

			str += "<span class='bigg item' id='C" + item['cid'] + "' ";
			if (parseInt(item['visibility']) == 0) {
				str += "style='opacity:0.3;' ";
			}
			str += ">";

			str += "<span><a style='margin-right:15px;' href='sectioned.php?courseid=" + item['cid'] + "&coursename=" + item['coursename'] + "'>" + item['coursename'] + "</a></span>";
			if (data['writeaccess']) {
				str += "<a style='margin-right:15px;' href='sectioned.php?courseid=" + item['cid'] + "&coursename=" + item['coursename'] + "'><img id='dorf' src='../Shared/icons/PenV.svg'></a>";
				str += "<img id='dorf' style='float:right;margin-top:4px' src='../Shared/icons/Cogwheel.svg' ";
				str += " onclick='selectCourse(\"" + item['cid'] + "\",\"" + item['coursename'] + "\",\"" + item['coursecode'] + "\",\"" + item['visibility'] + "\",\"" + item['activeversion'] + "\",\"" + item['activeedversion'] + "\");' >";
			}

			str += "</span>";
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

	if (data['debug'] != "NONE!")
		alert(data['debug']);
		
			resetinputs();
	//resets all inputs

}

//depending on the value of switch different loginboxes appear
var switchd = 1;
function showForgontPw(){
	if(switchd == 1){
		$("#login2").css("display", "block");
		$("#login").css("display", "none");
		switchd++;
	}
	else if(switchd == 2){
		$("#login2").css("display", "none");
		$("#login").css("display", "block");
		switchd = 1;
	}
	
}
function processemailsend(){
	alert('add funtionallity');

}
