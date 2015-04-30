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

	// Show dialog
	$("#editCourse").css("display", "none");

	AJAXService("UPDATE", {
		cid : cid,
		coursename : coursename,
		visib : visib,
		coursecode : coursecode
	}, "COURSE");
}

function newCourse() {
	$("#newCourse").css("display", "block");
}

function createNewCourse() {
	var coursename = $("#ncoursename").val();
	var coursecode = $("#ncoursecode").val();
	$("#newCourse").css("display", "none");
	AJAXService("NEW", {
		coursename : coursename,
		coursecode : coursecode
	}, "COURSE");
}

function resetinputs(){
	$('#coursename').val("");
	$('#coursecode').val("");
	$('#versid').val("");
	$('#versname').val("");
}

function selectCourse(cid, coursename, coursecode, visi) {
	console.log(cid, coursename, coursecode, visi);
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

	// Show edit course dialog
	$("#editCourse").css("display", "block");

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
			
			if (data['writeaccess']) {
				str += "<span style='margin-right:15px;'><a href='sectioned.php?courseid=" + item['cid'] + "&coursename=" + item['coursename'] + "&coursevers=" + item['activeversion'] + "'>" + item['coursename'] + "</a></span>";
			}
			else{
				str += "<span><a style='margin-right:15px;' href='sectioned.php?courseid=" + item['cid'] + "&coursename=" + item['coursename'] +"&coursevers=" + item['activeversion'] + "'>" + item['coursename'] + "</a></span>";
			}
			
			if (data['writeaccess']) {
				str += "<a style='margin-right:15px;' href='sectioned.php?courseid=" + item['cid'] + "&coursename=" + item['coursename'] + "&coursevers=" + item['activeedversion'] + "'><img id='dorf' src='../Shared/icons/PenV.svg'></a>";
				str += "<img id='dorf' style='float:right;' src='../Shared/icons/Cogwheel.svg' ";
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
