/********************************************************************************
 Globals
 *********************************************************************************/
var sessionkind = 0;
var querystring = parseGet();
var filez;
var mmx = 0, mmy = 0;
var msx = 0, msy = 0;
var rProbe = null;
var subheading = 0;
var allData;
var allowedRegradeTime = 24 * 60 * 60 * 1000;
//var benchmarkData = performance.timing; // Will be updated after onload event
//var ajaxStart;
//var tim;
var searchterm = "";
var studentInfo = new Array;
var students = new Array;
var momtmp = new Array;
var sortcolumn = 1;
var clickedindex;
var typechanged = false;
var teacher;
var entries;
var moments;
var results;
var versions;
var timeZero = new Date(0);
var duggaArray = [[]];
var filterList;
var tableName = "resultTable";
var tableCellName = "resultTableCell";

function setup() {
    //Benchmarking function
    //benchmarkData = performance.timing;
    window.onscroll = function () {

    };

    AJAXService("GET", { cid: querystring['courseid'], vers: querystring['coursevers'] }, "RESULT");
}

function process() {
	// Create temporary list that complies with dropdown
	momtmp = new Array;
	var momname = "Moment unavailable";
	for (var l = 0; l < moments.length; l++) {
		if (moments[l].kind === 4) {
			momname = moments[l].entryname;
		}
		moments[l].momname = momname;
	}

	// Create temporary list that complies with dropdown
	momtmp = new Array;
	for (var l = 0; l < moments.length; l++) {
		momtmp.push(moments[l]);
	}

	// Reconstitute table
	students = new Array;
	for (i = 0; i < entries.length; i++) {

		var uid = entries[i].uid;

		// Loop through all teacher names and store the appropriate name in a variable
		for (j = 0; j < teacher.length; j++) {
			// var tuid = teacher[j].tuid;
			var setTeacher = teacher[j].id;
		}
		if (setTeacher !== null && typeof(setTeacher) !== "undefined") {
			// Place spaces in the string when a lowercase is followed by a uppercase
			setTeacher = setTeacher.replace(/([a-z])([A-Z])/g, '$1 $2');
		}

		// All results of this student
		var res = results[uid];
		var restmp = new Array;

		if (typeof res != 'undefined') {
			// Pre-filter result list for a student for lightning-fast access
			for (var k = 0; k < res.length; k++) {
				restmp[res[k].dugga] = res[k];
			}
		}
		var student = new Array;
		// Creates a string that displays the first <td> (the one that shows the studentname etc) and places it into an array
		student.push({ grade: ("<div class='dugga-result-div'>" + entries[i].firstname + " " + entries[i].lastname + "</div><div class='dugga-result-div'>" + entries[i].username + " / " + entries[i].class + "</div><div class='dugga-result-div'>" + entries[i].ssn + "</div><div class='dugga-result-div'>" + entries[i].examiner + "</div>"), firstname: entries[i].firstname, lastname: entries[i].lastname ,class: entries[i].class, access: entries[i].access, examiner: entries[i].examiner, username: entries[i].username, ssn: entries[i].ssn });
		// Now we have a sparse array with results for each moment for current student... thus no need to loop through it
		for (var j = 0; j < momtmp.length; j++) {
			var tmpGrade = null;
			if (momtmp[j].kind == 4) {
				momtmp[j].link = -1;
				momtmp[j].qvariant = -1;
				for (var l = 1; j+l < momtmp.length; l++) {
					if(momtmp[j+l].kind == 4){
						break;
					}else if(momtmp[j+l].kind == 3 && typeof(restmp[momtmp[j + l].lid]) != 'undefined' && momtmp[j+l].momname == momtmp[j].momname){
						tmpGrade = 0;
					}
				}
			}
			// If it is a feedback quiz -- we have special handling.
			if (momtmp[j].quizfile == "feedback_dugga") {
				var momentresult = restmp[momtmp[j].lid];
				// If moment result does not exist... either make "empty" student result or push mark
				if (typeof momentresult != 'undefined') {
					student.push({ ishere: true, grade: momentresult.grade, marked: new Date((momentresult.markedts * 1000)), submitted: new Date((momentresult.submittedts * 1000)), kind: momtmp[j].kind, lid: momtmp[j].lid, uid: uid, needMarking: momentresult.needMarking, gradeSystem: momtmp[j].gradesystem, vers: momentresult.vers, userAnswer: momentresult.useranswer, quizId: momtmp[j].link, qvariant: momtmp[j].qvariant, quizfile: momtmp[j].quizfile, timesGraded: momentresult.timesGraded, gradeExpire: momentresult.gradeExpire, firstname: entries[i].firstname, lastname: entries[i].lastname, deadline: new Date(momtmp[j].deadlinets), });
				} else {
					student.push({ ishere: true, kind: momtmp[j].kind, grade: "", lid: momtmp[j].lid, uid: uid, needMarking: false, marked: new Date(0), submitted: new Date(0), grade: -1, vers: querystring['coursevers'], gradeSystem: momtmp[j].gradesystem, quizId: momtmp[j].link, qvariant: momtmp[j].qvariant, userAnswer: "UNK", quizfile: momtmp[j].quizfile, gradeExpire: null, firstname: entries[i].firstname, lastname: entries[i].lastname, deadline: new Date(momtmp[j].deadline), });
				}
			} else {
				var momentresult = restmp[momtmp[j].lid];
				// If moment result does not exist... either make "empty" student result or push mark
				if (typeof momentresult != 'undefined') {
					student.push({
						ishere: true,
						entryname: momtmp[j].entryname,
						grade: momentresult.grade,
						marked: new Date((momentresult.markedts * 1000)),
						submitted: new Date((momentresult.submittedts * 1000)),
						kind: momtmp[j].kind,
						lid: momtmp[j].lid,
						uid: uid,
						needMarking: momentresult.needMarking,
						gradeSystem: momtmp[j].gradesystem,
						vers: momentresult.vers,
						userAnswer: momentresult.useranswer,
						quizId: momtmp[j].link,
						qvariant: momtmp[j].qvariant,
						quizfile: momtmp[j].quizfile,
						timesGraded: momentresult.timesGraded,
						gradeExpire: momentresult.gradeExpire,
						firstname: entries[i].firstname,
						lastname: entries[i].lastname,
						deadline: new Date((momtmp[j].deadlinets * 1000)),
					});
				} else {
					student.push({
						ishere: false,
						entryname: momtmp[j].entryname,
						kind: momtmp[j].kind,
						grade: "UNK",
						lid: momtmp[j].lid,
						uid: uid,
						needMarking: false,
						gradeSystem: momtmp[j].gradesystem,
						vers: momtmp[j].vers,
						userAnswer: "UNK",
						marked: new Date(0),
						submitted: new Date(0),
						grade: tmpGrade,
						quizId: momtmp[j].link,
						qvariant: momtmp[j].qvariant,
						quizfile: momtmp[j].quizfile,
						timesGraded: 0,
						gradeExpire: "UNK",
						firstname: entries[i].firstname,
						lastname: entries[i].lastname,
						deadline: new Date(momtmp[j].deadline),
					});
				}
			}
		}
		students.push(student);
	}
	// Update filter list from local storage.
	filterList = JSON.parse(localStorage.getItem("resultTable_filter_" + querystring['courseid'] + "-" + querystring['coursevers']));
	if (filterList == null) {
		filterList = {};
	}

	// Add custom filters to the filter menu.
	var dstr = "";
	dstr += makeCustomFilter("showStudents", "Show Students");
	dstr += makeCustomFilter("showTeachers", "Show Teachers");
	dstr += makeCustomFilter("onlyPending", "Only pending");
	dstr += makeCustomFilter("minimode", "Mini mode");
	dstr += makeCustomFilter("passedDeadline", "Late submissions");

	document.getElementById("customfilter").innerHTML = dstr;
	var dstr = "";

	// Sorting
	dstr += "<div class='checkbox-dugga' style='border-bottom:1px solid #888'>";
	dstr += "<input type='radio' class='headercheck' name='sortdir' value='0' ' onclick='sorttype(-1)' id='sortdirAsc'><label class='headerlabel' for='sortdirAsc'>Sort Ascending</label>";
	dstr += "<input name='sortdir' type='radio' class='headercheck' value='1' ' onclick='sorttype(-1)' id='sortdirDes'> <label class='headerlabel' for='sortdirDes'>Sort descending</label>";
	dstr += "<div><input name='sortdir' type='radio' class='headercheck' value='2' ' onclick='sorttype(-1)' id='sortdirPen'><label class='headerlabel' for='sortdirPen'>Sort Pending</label></div></div>";
  dstr += "<div class='checkbox-dugga'><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(0)' value='0' id='sortcol0_0'><label class='headerlabel' for='sortcol0_0' >Firstname</label></div>";
	dstr += "<div class='checkbox-dugga'style='border-bottom:1px solid #888;' ><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(1)' value='0' id='sortcol0_1'><label class='headerlabel' for='sortcol0_1' >Lastname</label></div>";

	dstr += "<table><tr><td>";
	for (var j = 0; j < momtmp.length; j++) {
		var lid = moments[j].lid;
		var name = momtmp[j].entryname;
		var truncatedname = name;
		if (truncatedname.length > 30) {
			truncatedname = momtmp[j].entryname.slice(0, 3) + "..." + momtmp[j].entryname.slice(momtmp[j].entryname.length - 30);
		}


		dstr += "<div class='checkbox-dugga checknarrow ";
		if (moments[j].visible == 0) {
			dstr += "checkbox-dugga-hidden'><input name='sortcol' type='radio' class='sortradio' onclick='myTable.setNameColumn(\"" + name + "\");sorttype(-1)' id='sortcol" + (j + 1) + "' value='" + (j + 1) + "'><label class='headerlabel' title='" + name + "' for='sortcol" + (j + 1) + "' >" + truncatedname + "</label></div>";
		} else {
			dstr += "'><input name='sortcol' type='radio' class='sortradio' id='sortcol" + (j + 1) + "' onclick='myTable.setNameColumn(\"" + name + "\");sorttype(-1)' value='" + (j + 1) + "'><label class='headerlabel' title='" + name + "' for='sortcol" + (j + 1) + "' >" + truncatedname + "</label></div>";
		}
	}
	dstr += "</td><td style='vertical-align:top;'>";
	dstr += "</td></tr></table>";
	document.getElementById("dropdowns").innerHTML = dstr;
}

function makeCustomFilter(filtername, labeltext) {
	str = "<div class='checkbox-dugga checkmoment'>";
	str += "<input type='checkbox' id='" + filtername + "' onclick='toggleFilter(\"" + filtername + "\")'";
	if (filterList[filtername] == null) {
		filterList[filtername] = false;
	}
	if (filterList[filtername] || filtername == "showStudents" || filtername == "showTeachers") { //Enables filter and saves it in local storage when opening resulted.php.
		str += " checked";

		//Enables the showStudents and the showTeachers filters.
		filterList[filtername] = true;
		//Saves the checkbox values in localstorage.
		localStorage.setItem("resultTable_filter_" + querystring['courseid'] + "-" + querystring['coursevers'], JSON.stringify(filterList));
	}
	str += "><label class='headerlabel' for='" + filtername + "'>" + labeltext + "</label></div>";
	return str;
}

function toggleFilter(filter) {
	if (filterList[filter] == false) {
		filterList[filter] = true;
	} else {
		filterList[filter] = false;
	}
	localStorage.setItem("resultTable_filter_" + querystring['courseid'] + "-" + querystring['coursevers'], JSON.stringify(filterList));
	myTable.renderTable();
}

//displays dropdown when hovering search bar
function hoverSearch() {
	$('#dropdownSearch').css({display:'block'});
}

//stops displaying the dropdown when removing cursor from search bar
function leaveSearch() {
	$('#dropdownSearch').css({display:'none'});
}

function hoverc() {
	$('#dropdowns').css({display:'none'});
	$('#dropdownc').css({display: 'block'});
}

function leavec() {
	$('#dropdownc').css({display: 'none'});
}

function checkMomentParts(pos, id) {
	for (var i = 0; i < duggaArray[pos].length; i++) {
		var setThis = document.getElementById(duggaArray[pos][i]);
		setThis.checked = document.getElementById(id).checked;
	}
}

function hovers() {
	$('#dropdownc').css({display:'none'});
	$('#dropdowns').css({display: 'block'});
}

function leaves() {
	$('#dropdowns').css('display', 'none');
}

function sorttype(t) {
  if (t==0 || document.getElementById("sortcol0_0").isChecked){
    myTable.setNameColumn('Fname');
  }else if (t==1 || document.getElementById("sortcol0_1").isChecked) {
    myTable.setNameColumn('Lname');
  }

	var c = $("input[name='sortcol']:checked").val();
	if (c == 0) {
		localStorage.setItem("lena_" + querystring['courseid'] + "-" + querystring['coursevers'] + "-sort1", t);
		$("input[name='sorttype']").prop("checked", false);
	} else {
		if (t == -1) {
			t = localStorage.getItem("lena_" + querystring['courseid'] + "-" + querystring['coursevers'] + "-sort2", t);
			$("#sorttype" + t).prop("checked", true);
		} else {
			localStorage.setItem("lena_" + querystring['courseid'] + "-" + querystring['coursevers'] + "-sort2", t);
			$("#sorttype" + t).prop("checked", true);
		}
	}

	var col;
	var dir;
	$("input[name='sortcol']:checked").each(function () {
		col = this.value;
	});
	$("input[name='sortdir']:checked").each(function () {
		dir = this.value;
	});
	if (dir == 2 && (myTable.getNameColumn() === 'Fname' || myTable.getNameColumn() === 'Lname')) { // if "pending" and name column
		document.getElementById("sortdirAsc").checked = true;
		sorttype(-1);
		return;
	}
	if (myTable.getNameColumn() === 'Lname') { // if Lname, dir == (2 || 3)
		dir = parseInt(dir) + 2;
	}
	typechanged = true;
	if(col !== undefined && dir !== undefined){
		typechanged = false;
		var allColumnIds = myTable.getColumnOrder();
		myTable.toggleSortStatus(allColumnIds[col],dir);
	}
}

$(function () {
	$("#release").datepicker({ dateFormat: "yy-mm-dd" });
	$("#deadline").datepicker({ dateFormat: "yy-mm-dd" });
});

//----------------------------------------
// Commands:
//----------------------------------------

function gradeDugga(e, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid, gradeExpire) {
	closeWindows();

	var uidGrab = uid;
	var momentGrab = moment;
	var currentTime = new Date();
	var currentTimeGetTime = currentTime.getTime();
	if(document.getElementById('newFeedback') == null){
		feedbackText = "";
	} else {
		feedbackText = document.getElementById('newFeedback').value;
	}

	if ($(e.target).hasClass("Uc")) {
		changeGrade(1, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid, null, feedbackText);

	} else if (($(e.target).hasClass("G")) || ($(e.target).hasClass("VG")) || ($(e.target).hasClass("U"))) {
		changeGrade(0, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid, gradeExpire, feedbackText);
	} else if ($(e.target).hasClass("Gc")) {
		changeGrade(2, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid, gradeExpire, feedbackText);
	} else if ($(e.target).hasClass("VGc")) {
		changeGrade(3, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid, null, feedbackText);
	} else if ($(e.target).hasClass("U")) {
		changeGrade(1, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid, null, feedbackText);
	} else if ($(e.target).hasClass("Uh")) {
		for (var a = 0; a < students.length; a++) {
			var student = students[a];

			for (var j = 0; j < student.length; j++) {
				var studentObject = student[j];

				//Lid and uid is used to make sure that only the dugga that is intended to change grade change grade
				if (studentObject.lid === momentGrab && studentObject.uid === uidGrab) { // && studentObject.gradeExpire!=null

					var newGradeExpire = new Date(studentObject.gradeExpire);

					// This variable adds 24h to the current time
					var newDateObj = new Date(newGradeExpire.getTime() + allowedRegradeTime);
					var newGradeExpirePlusOneDay = newDateObj.getTime();
					// Compare the gradeExpire value to the current time, if no grade is set, we can always set it no matter the last change
					if (newGradeExpirePlusOneDay > currentTimeGetTime) {
						//The user must press the ctrl-key to activate if-statement
						if (event.ctrlKey || event.metaKey) {
							changeGrade(1, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid, null, feedbackText);
						} else {
							alert("You must press down the ctrl-key or cmd-key to change from grade G to U.");
						}
					} else {
						alert("You can no longer change the grade to U as 24 hours has passed since grade G was set.");
					}
				}
			}
		}
	} else {
		//alert("This grading is not OK!");
	}
}
function clearFeedback() {
	if(document.getElementById('newFeedback') !== null) {
		document.getElementById('newFeedback').value = "";
	}
}

function makeImg(gradesys, cid, vers, moment, uid, mark, ukind, gfx, cls, qvariant, qid) {
	return "<img src=\"" + gfx + "\" id=\"grade-" + moment + "-" + uid + "\" class=\"" + cls + "\" onclick=\"gradeDugga(event," + gradesys + "," + cid + ",'" + vers + "'," + moment + "," + uid + "," + mark + ",'" + ukind + "'," + qvariant + "," + qid + ");clearFeedback();\"  />";
}

function makeSelect(gradesys, cid, vers, moment, uid, mark, ukind, qvariant, qid) {
	var str = "";

	// Irrespective of marking system we allways print - and U
	if (mark === null || mark === 0 || mark === -1) {
		str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind, "../Shared/icons/Uc.png", "Uc", qvariant, qid);
	} else if (mark === 1) {
		str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind, "../Shared/icons/U.png", "U", qvariant, qid);
	} else {
		str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind, "../Shared/icons/Uh.png", "Uh", qvariant, qid);
	}

	// Gradesystem: 1== UGVG 2== UG
	if (gradesys === 1) {
		if (mark === 2) {
			str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind, "../Shared/icons/G.png", "G", qvariant, qid);
			str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind, "../Shared/icons/VGh.png", "VGh", qvariant, qid);
		} else if (mark === 3) {
			str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind, "../Shared/icons/Gh.png", "Gh", qvariant, qid);
			str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind, "../Shared/icons/VG.png", "VG", qvariant, qid);
		} else {
			str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind, "../Shared/icons/Gc.png", "Gc", qvariant, qid);
			str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind, "../Shared/icons/VGc.png", "VGc", qvariant, qid);
		}
	} else if (gradesys === 2) {
		if (mark === 2) {
			str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind, "../Shared/icons/G.png", "G", qvariant, qid);
		} else {
			str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind, "../Shared/icons/Gc.png", "Gc", qvariant, qid);
		}
	}
	return str;
}

function hideHover() {
	$("#hoverRes").css({ display: "none", opacity: 0 });
}

function hoverResult() {
	$("#hoverRes").css({ display: "block", opacity: 1, zIndex: 5, top: '50px' });
	$("#hoverRes").html($("#Nameof").html());

}
// Function for shortening date format
function formatDateShorter(longDate) {
	var d = new Date(longDate)

	return d.toLocaleString()
}


function clickResult(cid, vers, moment, qfile, firstname, lastname, uid, submitted, marked, foundgrade, gradeSystem, lid, qvariant, qid, entryname) {
	var nameOf = document.getElementById("Nameof");
	nameOf.textContent = entryname + " by " + firstname + " " + lastname + " - Submitted: " + formatDateShorter(submitted) + " / Marked: " + formatDateShorter(marked);

	var menu = "<div class='' style='display:block;'>";
	menu += "<div class='loginBoxheader'>";
	menu += "<h3>Grade</h3>";
	menu += "<div class='cursorPointer' onclick='toggleGradeBox();'>x</div>"
	menu += "</div>";
	menu += "<table>";
	menu += "<tr><td>";

	if ((foundgrade === null && submitted === null)) {
		menu += makeSelect(parseInt(gradeSystem), querystring['courseid'], querystring['coursevers'], parseInt(lid), parseInt(uid), null, "I", parseInt(qvariant), parseInt(qid));
	} else if (foundgrade == -1) {
		menu += makeSelect(parseInt(gradeSystem), querystring['courseid'], querystring['coursevers'], parseInt(lid), parseInt(uid), parseInt(foundgrade), "IFeedback", parseInt(qvariant), parseInt(qid));
	} else if (foundgrade !== null) {
		menu += makeSelect(parseInt(gradeSystem), querystring['courseid'], querystring['coursevers'], parseInt(lid), parseInt(uid), parseInt(foundgrade), "U", parseInt(qvariant), parseInt(qid));
	} else {
		menu += makeSelect(parseInt(gradeSystem), querystring['courseid'], querystring['coursevers'], parseInt(lid), parseInt(uid), null, "U", parseInt(qvariant), parseInt(qid));
	}
	menu += "</td></tr>";
	menu += "</table>";
	menu += "</div> <!-- Menu Dialog END -->";
	document.getElementById('markMenuPlaceholder').innerHTML = menu;

	AJAXService("DUGGA", { cid: cid, vers: vers, moment: moment, luid: uid, coursevers: vers }, "RESULT");
}
//Toggles the visibility of the grading box. if the box is hidden it will change the display to block, if its visible it'll change the display to none
function toggleGradeBox(){
	var toggleGrade = document.getElementById('toggleGrade');
	if(toggleGrade.style.display=='none' || toggleGrade.style.display=='' ){
		toggleGrade.style.display = 'block';
		toggleGrade.style.position = 'absolute';
	} else{
		toggleGrade.style.display = 'none';
	}
}

function changeGrade(newMark, gradesys, cid, vers, moment, uid, mark, ukind, qvariant, qid, gradeExpire, feedbackText) {
	var newFeedback = feedbackText;
	AJAXService("CHGR", { cid: cid, vers: vers, moment: moment, luid: uid, mark: newMark, ukind: ukind, newFeedback: newFeedback, qvariant: qvariant, quizId: qid, gradeExpire: gradeExpire }, "RESULT");
}

function moveDist(e) {
	mmx = e.clientX;
	mmy = e.clientY;

	if (msx == -1 && msy == -1) {
		msx = mmx;
		msy = mmy;
	} else {
		// Count pixels and act accordingly
		if ((Math.abs(mmx - msx) + Math.abs(mmy - msy)) > 16) {
			$("#resultpopover").css("display", "none");
			closeFacit();
			document.getElementById('MarkCont').innerHTML = "";
		}
	}
}

//----------------------------------------
// Adds Canned Response to Response Dialog
//----------------------------------------

function displayPreview(filepath, filename, fileseq, filetype, fileext, fileindex, displaystate) {
	clickedindex = fileindex;
	document.getElementById("responseArea").outerHTML = '<textarea id="responseArea" style="width: 100%;height:100%;-webkit-box-sizing: border-box; -moz-box-sizing: border-box;box-sizing: border-box;">' + allData["files"][allData["duggaentry"]][clickedindex].feedback + '</textarea>'

	if (displaystate) {
		document.getElementById("markMenuPlaceholderz").style.display = "block";
	} else {
		document.getElementById("markMenuPlaceholderz").style.display = "none";
	}

	var str = "";
	if (filetype === "text") {
		str += "<textarea style='width: 100%;height: 100%;box-sizing: border-box;'>" + allData["files"][allData["duggaentry"]][fileindex].content + "</textarea>";
	} else if (filetype === "link") {
		var filename = allData["files"][allData["duggaentry"]][fileindex].content;
		if (window.location.protocol === "https:") {
			filename = filename.replace("http://", "https://");
		} else {
			filename = filename.replace("https://", "http://");
		}
		str += '<iframe src="' + filename + '" width="100%" height="100%" />';
	} else {
		if (fileext === "pdf") {
			str += '<embed src="' + filepath + filename + fileseq + '.' + fileext + '" width="100%" height="100%" type="application/pdf" />';
		} else if (fileext === "zip" || fileext === "rar") {
			str += '<a href="' + filepath + filename + fileseq + '.' + fileext + '"/>' + filename + '.' + fileext + '</a>';
		} else if (fileext === "txt") {
			str += "<pre style='width: 100%;height: 100%;box-sizing: border-box;'>" + allData["files"][allData["duggaentry"]][fileindex].content + "</pre>";
		}
	}
	document.getElementById("popPrev").innerHTML = str;

	$("#previewpopover").css("display", "block");
}

//----------------------------------------
// Adds Canned Response to Response Dialog
//----------------------------------------

function addCanned() {
	document.getElementById("responseArea").innerHTML += document.getElementById("cannedResponse").value;
}

//----------------------------------------
// Sort results
//----------------------------------------

function saveResponse() {
	respo = document.getElementById("responseArea").value;

	var filename = allData["files"][allData["duggaentry"]][clickedindex].filename + allData["files"][allData["duggaentry"]][clickedindex].seq;

	AJAXService("RESP", { cid: querystring['courseid'], vers: querystring['coursevers'], resptext: respo, respfile: filename, duggaid: allData["duggaid"], luid: allData["duggauser"], moment: allData["duggaentry"], luid: allData["duggauser"] }, "RESULT");
	document.getElementById("responseArea").innerHTML = "";
	$("#previewpopover").css("display", "none");
}
//----------------------------------------
// Clear response textbox on Preview Popover.
//----------------------------------------
function clearResponseArea(){
	document.getElementById("responseArea").innerHTML = "";
}

//----------------------------------------
// Renderer
//----------------------------------------

function returnedResults(data) {
  	if (!data[0].access) {
		window.location.href = 'courseed.php';
	}
	//loops through all the responses from resultedservice.php to update or create table
	for(var i = 0; i < data.length; i++){
		if (data[i]['debug'] !== "NONE!"){
			alert(data[i]['debug']);
		}
		if (data[i].gradeupdated === true) {
			// Update the the local array studentInfo when grade is updated.
			for (var student in studentInfo) {
				var studentObject = studentInfo[student]["lid:" + data[i].duggaid];
				if (studentObject != null && studentObject.uid === parseInt(data[i].duggauser) && studentObject.lid === parseInt(data[i].duggaid)) {
					studentObject.grade = parseInt(data[i].results);
					studentObject.timesGraded = parseInt(data[i].duggatimesgraded);
					studentObject.gradeExpire = data[i].duggaexpire;
					if (data[i].results > 0) {
						studentObject.needMarking = false;
					} else {
						studentObject.needMarking = true;
					}
					break;
				}
			}
			myTable.renderTable();
		} else {
			data = data[0];
			entries = data.entries;
			moments = data.moments;
			versions = data.versions;
			results = data.results;
			teacher = data.teachers;
			courseteachers = data.courseteachers;

			let ladmoments = "";
			for (let i = 0; i < moments.length; i++) {
				let dugga = moments[i];
				if (dugga.kind === 4) {
					ladmoments += "<option value='" + dugga.entryname + "'>" + dugga.entryname + "</option>";
				}
			}
			var teacherList;
			teacherList += "<option value='none'>none</option>";
			for(var i = 0; i < teacher.length; i++){
				if(!teacherList.includes(teacher[i].id)){
					if(teacher[i].id == localStorage.getItem('examinatorFilter')){
						teacherList += "<option value='"+ teacher[i].id +"' selected>"+ teacher[i].firstname + " " + teacher[i].lastname + "</option>";
					} else {
						teacherList += "<option value='"+ teacher[i].id +"'>"+ teacher[i].firstname + " " + teacher[i].lastname + "</option>";
					}
				}
			}
			var uniqueTeacherList = [...new Set(teacherList)]
			document.getElementById("teacherDropdown").innerHTML = teacherList;
			document.getElementById("ladselect").innerHTML = ladmoments;
			document.getElementById("laddate").valueAsDate = new Date();

			//tim=performance.now();

			subheading = 0;

			$(document).ready(function () {
				$("#dropdownc").mouseleave(function () {
					leavec();
				});
			});
			$(document).ready(function () {
				$("#dropdowns").mouseleave(function () {
					leaves();
				});
			});

			allData = data; // used by dugga.js

			if (data['dugganame'] !== "") {
				// Display student submission
				$.getScript(data['dugganame'], function () {
					$("#MarkCont").html(data['duggapage']);
					showFacit(data['duggaparam'], data['useranswer'], data['duggaanswer'], data['duggastats'], data['files'], data['moment'], data['duggafeedback']);
					if(data['duggafeedback'] == ""){
						var doc = document.getElementById("teacherFeedbackTable");
						for (var i = 0; i < doc.childNodes.length; i++) {
							if (doc.childNodes[i].className == "list feedback-list") {
									doc.childNodes[i].style.display = "none";
									break;
							}
						}
					}
				});
				$("#resultpopover").css("display", "block");
			} else {
					// Process and render filtered data
					process();
					createSortableTable(data);
			}
		}
	}
}
//----------------------------------------
// Success return function for LadExport lastGraded
//----------------------------------------
function returnedExportedGrades(gradeData){
	try {
		document.getElementById('lastExpDate').innerHTML =  gradeData[0].gradeLastExported;
	  }
	  catch(err) {
		console.log("gradeLastExported updated in database");
	  }
}
var myTable;
//----------------------------------------
// Renderer
//----------------------------------------

function buildDynamicHeaders() {
	var tblhead = { "FnameLname": "Fname/Lname" };
	moments.forEach(function (entry) {
		tblhead["lid:" + entry['lid']] = entry['entryname'];
	});
	return tblhead;
}

function buildColumnOrder() {
	var colOrder = ["FnameLname"];
	moments.forEach(function (entry) {
		colOrder.push("lid:" + entry['lid']);
	});
	return colOrder;
}

function buildStudentInfo() {
	var i = 0;
	students.forEach(function (entry) {
		var row = { "FnameLname": entry[0] };
		if (entry.length > 1) {
			for (var j = 1; j < entry.length; j++) {
				row["lid:" + entry[j]['lid']] = entry[j];
			}
		}
		studentInfo[i++] = row;
	});
	return studentInfo;
}

function createSortableTable(data) {
	var tblhead = buildDynamicHeaders();
	studentInfo = buildStudentInfo();

	var tabledata = {
		tblhead,
		tblbody: studentInfo,
		tblfoot: []
	}
	var colOrder = buildColumnOrder();
	myTable = new SortableTable({
		data: tabledata,
		tableElementId: tableName,
		filterElementId: "columnfilter",
		renderCellCallback: renderCell,
		exportCellCallback: exportCell,
		exportColumnHeadingCallback: exportColumnHeading,
		renderSortOptionsCallback: renderSortOptions,
		renderColumnFilterCallback: renderColumnFilter,
		rowFilterCallback: rowFilter,
		columnOrder: colOrder,
		hasRowHighlight: true,
		hasMagicHeadings: true,
		hasCounterColumn: true
	});

	myTable.renderTable();

	if (data['debug'] != "NONE!")
		alert(data['debug']);
}

function gradeFilterHandler() {
	// getting the alternative that the filter have.
	filterGrade = 0;
	var argument = document.getElementById("gradeFilterScale").value;
	switch (argument) {
		case "Filter-VG":
			filterGrade = 3;
			break;
		case "Filter-G":
			filterGrade = 2;
			break;
		case "Filter-U":
			filterGrade = 1;
			break;
		default:
			filterGrade = "none";
			break;
	}
}

function renderCell(col, celldata, cellid) {
	gradeFilterHandler();
	// Render minimode
	if (filterList["minimode"]) {
		// First column (Fname/Lname/SSN)
		if (col == "FnameLname") {
			str = "<div class='resultTableCell resultTableMini'>";
			str += "<div class='resultTableText'>";
			str += celldata.firstname + " " + celldata.lastname;
			str += "</div>";
			str += "</div>";
			return str;
		} else if (filterGrade === "none" || celldata.grade === filterGrade) {
			// color based on pass,fail,pending,assigned,unassigned
			str = "<div class='resultTableCell resultTableMini ";
			if (celldata.kind == 4) {
				str += "dugga-moment ";
			}
			if (celldata.grade > 1) {
				str += "dugga-pass";
			} else if (celldata.submittedts <= celldata.deadlinets) {
				str += "dugga-pending";
			} else if (celldata.kind != 4 && celldata.submittedts > celldata.deadlinets) {
				str += "dugga-pending-late-submission";
			} else if (celldata.grade === 1) {
				str += "dugga-fail";
			} else if (celldata.grade === 0 || isNaN(celldata.grade)) {
				str += "dugga-assigned";
			} else {
				str += "dugga-unassigned";
			}
			str += "'>";
			str += "</div>";
			return str;
		}
		// Render passed deadline duggas
	} else if(filterList["onlyPending"]){
		// First column (Fname/Lname/SSN)
		if (col == "FnameLname") {
			str = "<div class='resultTableCell resultTableNormal'>";
			str += "<div class='resultTableText'>";
			str += "<div style='font-weight:bold'>" + celldata.firstname + " " + celldata.lastname + "</div>";
			str += "<div>" + celldata.username + " / " + celldata.class + "</div>";
			str += "</div>";
			return str;
		} else if (filterGrade === "none" || celldata.grade === filterGrade) {
			// color based on pass,fail,pending,assigned,unassigned
			str = "<div style='padding:10px;' class='resultTableCell ";
			if (celldata.kind != 4 && celldata.needMarking == true && celldata.submitted < celldata.deadline) {
				str += "dugga-pending";
			}
			str += "'>";
			// Creation of grading buttons
			if (celldata.kind != 4 && celldata.needMarking == true && celldata.submitted < celldata.deadline) {
				str += "<div class='gradeContainer resultTableText'>";
				if (celldata.grade === null) {
					str += makeSelect(celldata.gradeSystem, querystring['courseid'], celldata.vers, celldata.lid, celldata.uid, celldata.grade, 'I', celldata.qvariant, celldata.quizId);
				} else if (celldata.grade === -1) {
					str += makeSelect(celldata.gradeSystem, querystring['courseid'], celldata.vers, celldata.lid, celldata.uid, celldata.grade, 'IFeedback', celldata.qvariant, celldata.quizId);
				} else {
					str += makeSelect(celldata.gradeSystem, querystring['courseid'], celldata.vers, celldata.lid, celldata.uid, celldata.grade, 'U', celldata.qvariant, celldata.quizId);
				}
				str += "<img id='korf' class='fist";
				if ((celldata.userAnswer === null && !(celldata.quizfile == "feedback_dugga")) || celldata.quizfile == null) { // Always shows fist. Should be re-evaluated
					str += " grading-hidden";
				}
				str += "' src='../Shared/icons/FistV.png' onclick='clickResult(\"" + querystring['courseid'] + "\",\"" + celldata.vers + "\",\"" + celldata.lid + "\",\"" + celldata.quizfile + "\",\"" + celldata.firstname + "\",\"" + celldata.lastname + "\",\"" + celldata.uid + "\",\"" + celldata.submitted + "\",\"" + celldata.marked + "\",\"" + celldata.grade + "\",\"" + celldata.gradeSystem + "\",\"" + celldata.lid + "\",\"" + celldata.qvariant + "\",\"" + celldata.quizId + "\",\"" + celldata.entryname + "\");'";
				str += "/>";
				//Print times graded
				str += "<div class='text-center resultTableText WriteOutTimesGraded'>";
				if (celldata.timesGraded !== 0) {
					str += '(' + celldata.timesGraded + ')';
				}
				str += "</div>";
				str += "</div>";

				// Print submitted time and change color to red if passed deadline
				str += "<div class='text-center resultTableText'>";
				if (celldata.submitted.getTime() !== timeZero.getTime()) {
					str += celldata.submitted.toLocaleDateString() + " " + celldata.submitted.toLocaleTimeString();
				}
				for (var p = 0; p < moments.length; p++) {
					if (moments[p].link == celldata.quizId) {
						if (Date.parse(moments[p].deadline) < Date.parse(celldata.submitted)) {
							str += "<img src='../Shared/icons/warningTriangle.svg' style='width:12px;height:12px;' title='Late submission'>";
						}
						break;
					}
				}
				str += "</div>";
			}
			return str;
		}
	}

	else if(filterList["passedDeadline"]){
				// First column (Fname/Lname/SSN)
			if (col == "FnameLname") {
				str = "<div class='resultTableCell resultTableNormal'>";
				str += "<div class='resultTableText'>";
				str += "<div style='font-weight:bold'>" + celldata.firstname + " " + celldata.lastname + "</div>";
				str += "<div>" + celldata.username + " / " + celldata.class + "</div>";
				str += "</div>";
				return str;
			}else if (filterGrade === "none" || celldata.grade === filterGrade) {
				// color based on pass,fail,pending,assigned,unassigned
				str = "<div style='padding:10px;' class='resultTableCell ";
				if (celldata.kind != 4 && celldata.needMarking == true && celldata.submitted > celldata.deadline) {
					str += "dugga-pending-late-submission";
				}
				str += "'>";
				// Creation of grading buttons
				if (celldata.kind != 4 && celldata.needMarking == true && celldata.submitted > celldata.deadline) {
					str += "<div class='gradeContainer resultTableText'>";
					if (celldata.grade === null) {
						str += makeSelect(celldata.gradeSystem, querystring['courseid'], celldata.vers, celldata.lid, celldata.uid, celldata.grade, 'I', celldata.qvariant, celldata.quizId);
					} else if (celldata.grade === -1) {
						str += makeSelect(celldata.gradeSystem, querystring['courseid'], celldata.vers, celldata.lid, celldata.uid, celldata.grade, 'IFeedback', celldata.qvariant, celldata.quizId);
					} else {
						str += makeSelect(celldata.gradeSystem, querystring['courseid'], celldata.vers, celldata.lid, celldata.uid, celldata.grade, 'U', celldata.qvariant, celldata.quizId);
					}
					str += "<img id='korf' class='fist";
					if ((celldata.userAnswer === null && !(celldata.quizfile == "feedback_dugga")) || celldata.quizfile == null) { // Always shows fist. Should be re-evaluated
						str += " grading-hidden";
					}
					str += "' src='../Shared/icons/FistV.png' onclick='clickResult(\"" + querystring['courseid'] + "\",\"" + celldata.vers + "\",\"" + celldata.lid + "\",\"" + celldata.quizfile + "\",\"" + celldata.firstname + "\",\"" + celldata.lastname + "\",\"" + celldata.uid + "\",\"" + celldata.submitted + "\",\"" + celldata.marked + "\",\"" + celldata.grade + "\",\"" + celldata.gradeSystem + "\",\"" + celldata.lid + "\",\"" + celldata.qvariant + "\",\"" + celldata.quizId + "\",\"" + celldata.entryname + "\");'";
					str += "/>";
					//Print times graded
					str += "<div class='text-center resultTableText WriteOutTimesGraded'>";
					if (celldata.timesGraded !== 0) {
						str += '(' + celldata.timesGraded + ')';
					}
					str += "</div>";
					str += "</div>";

					// Print submitted time and change color to red if passed deadline
					str += "<div class='text-center resultTableText'";
					for (var p = 0; p < moments.length; p++) {
						if (moments[p].link == celldata.quizId) {
							if (Date.parse(moments[p].deadline) < Date.parse(celldata.submitted)) {
								str += " style='color:red;'";
							}
							break;
						}
					}
					str += ">";
					if (celldata.submitted.getTime() === timeZero.getTime()) {
						str += "<p>Not submitted</p>";
					} else {
						str += celldata.submitted.toLocaleDateString() + " " + celldata.submitted.toLocaleTimeString();
					}
					
					for (var p = 0; p < moments.length; p++) {
						if (moments[p].link == celldata.quizId) {
							if (Date.parse(moments[p].deadline) < Date.parse(celldata.submitted)) {
								str += "<img src='../Shared/icons/warningTriangle.svg' style='width:12px;height:12px;' title='Late submission'>";
							}
							break;
						}
					}
					str += "</div>";
				}
				return str;
			}
	}

	// Render normal mode
	// First column (Fname/Lname/SSN)
	if (col == "FnameLname") {
		str = "<div class='resultTableCell resultTableNormal'>";
		str += "<div class='resultTableText'>";
		str += "<div style='font-weight:bold'>" + celldata.firstname + " " + celldata.lastname + "</div>";
		str += "<div>" + celldata.username + " / " + celldata.class + "</div>";
		str += "<div>" + hideSSN(celldata.ssn) + "</div>";
		str += "</div>";
		return str;

	} else if (filterGrade === "none" || celldata.grade === filterGrade) {
		var unassignedCheck = false;
		// color based on pass,fail,pending,assigned,unassigned
		str = "<div class='resultTableCell ";
		if (celldata.kind == 4) {
			str += "dugga-moment ";
		}
		else if (celldata.grade != null) {
			// do nothing for the purpose of being able to generate styling for empty cells
		}
		else {
			str += "dugga-empty ";
		}
		if (celldata.grade > 1) {
			str += "dugga-pass";
		} else if (celldata.needMarking == true && celldata.submitted <= celldata.deadline) {
			str += "dugga-pending";
		} else if (celldata.kind != 4 && celldata.needMarking == true && celldata.submitted > celldata.deadline) {
			str += "dugga-pending-late-submission";
		} else if (celldata.grade === 1) {
			str += "dugga-fail";
		} else if (celldata.grade === 0 || isNaN(celldata.grade)) {
			str += "dugga-assigned";
		} else {
			str += "dugga-unassigned";
			unassignedCheck = true;
		}
		if(unassignedCheck){
			str += "' style='height:74px;'>";
		}else{
			str += "' style='padding:10px;'>";
		}

		// Creation of grading buttons
		if (celldata.ishere === true || celldata.kind == 4) {
			if(!unassignedCheck){
				str += "<div class='gradeContainer resultTableText'>";
				if (celldata.grade === null) {
					str += makeSelect(celldata.gradeSystem, querystring['courseid'], celldata.vers, celldata.lid, celldata.uid, celldata.grade, 'I', celldata.qvariant, celldata.quizId);
				} else if (celldata.grade === -1) {
					str += makeSelect(celldata.gradeSystem, querystring['courseid'], celldata.vers, celldata.lid, celldata.uid, celldata.grade, 'IFeedback', celldata.qvariant, celldata.quizId);
				} else {
					str += makeSelect(celldata.gradeSystem, querystring['courseid'], celldata.vers, celldata.lid, celldata.uid, celldata.grade, 'U', celldata.qvariant, celldata.quizId);
				}
				str += "<img id='korf' class='fist";
				if ((celldata.userAnswer === null && !(celldata.quizfile == "feedback_dugga")) || celldata.quizfile == null) { // Always shows fist. Should be re-evaluated
					str += " grading-hidden";
				}
				str += "' src='../Shared/icons/FistV.png' onclick='clickResult(\"" + querystring['courseid'] + "\",\"" + celldata.vers + "\",\"" + celldata.lid + "\",\"" + celldata.quizfile + "\",\"" + celldata.firstname + "\",\"" + celldata.lastname + "\",\"" + celldata.uid + "\",\"" + celldata.submitted + "\",\"" + celldata.marked + "\",\"" + celldata.grade + "\",\"" + celldata.gradeSystem + "\",\"" + celldata.lid + "\",\"" + celldata.qvariant + "\",\"" + celldata.quizId + "\",\"" + celldata.entryname + "\");'";
				str += "/>";
			}else{
				str += "<div class='text-center resultTableText' style='padding-top: 30px;'>Unassigned</div>"
			}
			//Print times graded
			str += "<div class='text-center resultTableText WriteOutTimesGraded'>";
			if (celldata.timesGraded !== 0 && typeof(celldata.timesGraded) != 'undefined') {
				str += '(' + celldata.timesGraded + ')';
			}
			str += "</div>";
			str += "</div>";

			// Print submitted time and change color to red if passed deadline
			str += "<div class='text-center resultTableText'";
			for (var p = 0; p < moments.length; p++) {
				if (moments[p].link == celldata.quizId) {
					if (Date.parse(moments[p].deadline) < Date.parse(celldata.submitted)) {
						str += " style='color:red;'";
					}
					break;
				}
			}
			str += ">";
			if (celldata.submitted.getTime() !== timeZero.getTime() && !isNaN(celldata.submitted.getTime())) {
				str += celldata.submitted.toLocaleDateString() + " " + celldata.submitted.toLocaleTimeString();
			}
			for (var p = 0; p < moments.length; p++) {
				if (moments[p].link == celldata.quizId) {
					if (Date.parse(moments[p].deadline) < Date.parse(celldata.submitted)) {
						str += "<img src='../Shared/icons/warningTriangle.svg' style='width:12px;height:12px;' title='Late submission'>";
					}
					break;
				}
			}
			str += "</div>";
		}
		str += "</div>";
		return str;
	}

	// When Filtering is activated then this "hides" all other data than what is specified.
	else {
		str = "<div style='height:70px;' class='resultTableCell ";
		if (celldata.kind == 4) {
			str += "dugga-moment ";
		}
		str += "dugga-unassigned";
		str += "'>";
		return str;
	}

	return celldata; //editor says it is never reached, might be safe to remove
}

function smartSearch(splitSearch, row) {
	var columnToSearch;
	var lid;
	var sortingType;
  var sortingDate1;
  var sortingDate2;
	var sortingValue;
	var isDate = false;
	var returnValue;

  // Loops through the different search attributes that were seperated by &&, if you want to add multiple search this is the place
	for (var i = 0; i < splitSearch.length; i++) {
		columnToSearch = splitSearch[i][1];
    columnToSearch = columnToSearch.replace(' ', '');

		for (var j = 0; j < moments.length; j++) {
			lid = "lid:" + moments[j]["lid"];

      // All the different types of search categories
			switch (splitSearch[i][0].toUpperCase()) {
				case "MARKG":
					sortingValue = 2;
					sortingType = row[lid].grade;
					isDate = false;
					break;
				case "MARKVG":
					sortingValue = 3;
					sortingType = row[lid].grade;
					isDate = false;
					break;
				case "MARKU":
					sortingValue = 1;
					sortingType = row[lid].grade;
					isDate = false;
					break;
				case "DATE":
					isDate = true;
					var date = new Date(splitSearch[i][1]);
					sortingValue = date;
          sortingDate1 = 0;
          sortingDate2 = 0;
					break;
			}

			if (!isDate) {
				var txt = document.createElement("textarea");
				txt.innerHTML = row[lid].entryname;
				var columnToFind = txt.value;
        columnToFind = columnToFind.replace(' ', '');
				if (columnToSearch.toUpperCase() === columnToFind.toUpperCase()) {
					if (sortingType === sortingValue) {
						for (colname in row) {
							if (colname == "lid:" + row[lid].lid) {
								var name = "";
								if (row[colname].entryname != null) {
									name += row[colname].entryname + " ";
								}
                // Makes sure that compares are posible even with å,ä and ö in the strings.
								var txt = document.createElement("textarea");
								txt.innerHTML = name;
								var newName2 = txt.value;
                newName2 = newName2.replace(' ', '');
								if (newName2.toUpperCase().indexOf(columnToSearch.toUpperCase()) != -1) {
									returnValue = true;
								}else{
									returnValue = false;
								}
							}
						}
					}
				}
			} else {
				var dates = "";
				for (colname in row) {
          sortingDate1 = row[colname].marked;
          sortingDate2 = row[colname].submitted;
					if (sortingDate1 >= sortingValue) {
						dates += sortingDate1 + " ";
					}else if(sortingDate2 >= sortingValue ){
            dates += sortingDate2 + " ";
          }
				}
				if (dates != "") return true;
			}
		}
	}
	return returnValue;
}

//----------------------------------------------------------------
// rowFilter <- Callback function that filters rows in the table
//----------------------------------------------------------------
function rowFilter(row) {
	// Custom filters that remove rows before an actual search
	if (!filterList["showTeachers"] && row["FnameLname"]["access"].toUpperCase().indexOf("W") != -1)
		return false;
	if(!filterList["showStudents"] && row["FnameLname"]["access"].toUpperCase().indexOf("W") != 0)
		return false;
	if (filterList["onlyPending"]) {
		var rowPending = false;
		for (var colname in row) {
			if (colname != "FnameLname" && row[colname]["needMarking"] == true) {
				rowPending = true;
				break;
			}
		}
		if (!rowPending) {
			return false;
		}
	}
	var teacherDropdown = document.getElementById("teacherDropdown").value;
	if(teacherDropdown !== "none" && row.FnameLname.examiner != teacherDropdown){
		return false;
	}
  	// divides the search on white space
	var tempSplitSearch = searchterm.split(" ");
	var splitSearch = [];

	tempSplitSearch.forEach(function (s) {
		if (s.length > 0)
			splitSearch.push(s.trim().split(":"));
	})

  	// The else makes sure that you can search on names without a search-category.
	if (searchterm != "" && splitSearch != searchterm) {
		return smartSearch(splitSearch, row);
	} else {
		for (colname in row) {
			if (colname == "FnameLname") {
				var name = "";
				if(searchterm.length == 1){ //if only 1 character has been entered in the search field
				if (row[colname]["firstname"] != null) {
					name += row[colname]["firstname"] + " ";
				}
				if (row[colname]["lastname"] != null) {
					name += row[colname]["lastname"];
				}
        		var nameArray = name.split(" "); //Array with [firstname, lastname]
				//Checks for the first character in firstname and/or lastname
				if (nameArray[0].toUpperCase().startsWith(searchterm.toUpperCase()) || nameArray[1].toUpperCase().startsWith(searchterm.toUpperCase())) {
					return true;
				}
				//when more characters than 1 has been entered
			} else {
				if (row[colname]["firstname"] != null) {
					name += row[colname]["firstname"] + " ";
				}
				if (row[colname]["lastname"] != null) {
					name += row[colname]["lastname"];
				}
				name = name.replace(" ", "");
				if(name.toUpperCase().indexOf(searchterm.toUpperCase()) != -1){
					return true;
				}
				 if (row[colname]["ssn"] != null) {
				 	if (row[colname]["ssn"].toUpperCase().indexOf(searchterm.toUpperCase()) != -1)
				 		return true;
					}
				if (row[colname]["username"] != null) {
					if (row[colname]["username"].toUpperCase().indexOf(searchterm.toUpperCase()) != -1)
						return true;
				}
				if (row[colname]["class"] != null) {
					if (row[colname]["class"].toUpperCase().indexOf(searchterm.toUpperCase()) != -1)
						return true;
				}
				if (row[colname]["setTeacher"] != null) {
					if (row[colname]["setTeacher"].toUpperCase().indexOf(searchterm.toUpperCase()) != -1)
						return true;
				} 
			}
			}
		}
		return false;
	}
}

function renderSortOptions(col, status, colname) {
	str = "";
	if (status == -1) {
		if (col == "FnameLname") {
			let colnameArr = colname.split("/");
			str += "<div style='white-space:nowrap;cursor:pointer'>"
			str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[0] + "\"); myTable.toggleSortStatus(\"" + col + "\",0)'>" + colnameArr[0] + "</span>/";
			str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[1] + "\"); myTable.toggleSortStatus(\"" + col + "\",2)'>" + colnameArr[1] + "</span>";
			// str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[2] + "\"); myTable.toggleSortStatus(\"" + col + "\",4)'>" + colnameArr[2] + "</span>";
		} else {
			str += "<span class='sortableHeading' onclick='myTable.setNameColumn(\"" + colname + "\"); myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "</span>";
		}
		str += "</div>"
	} else {
		if (col == "FnameLname") {
			let colnameArr = colname.split("/");
			if (status == 0 || status == 1) {
				document.getElementById("sortcol0_0").checked = true;

				str += "<div style='white-space:nowrap;cursor:pointer'>"
				if (status == 0) {
					document.getElementById("sortdirAsc").checked = true;

					str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[0] + "\"); myTable.toggleSortStatus(\"" + col + "\",1)'>" + colnameArr[0] + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>/";
					str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[1] + "\"); myTable.toggleSortStatus(\"" + col + "\",2)'>" + colnameArr[1] + "</span>";
					// str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[2] + "\"); myTable.toggleSortStatus(\"" + col + "\",4)'>" + colnameArr[2] + "</span>";
				} else {
					document.getElementById("sortdirDes").checked = true;

					str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[0] + "\"); myTable.toggleSortStatus(\"" + col + "\",0)'>" + colnameArr[0] + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>/";
					str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[1] + "\"); myTable.toggleSortStatus(\"" + col + "\",2)'>" + colnameArr[1] + "</span>";
					// str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[2] + "\"); myTable.toggleSortStatus(\"" + col + "\",4)'>" + colnameArr[2] + "</span>";
				}
				str += "</div>"
			} else if (status == 2 || status == 3) {
				document.getElementById("sortcol0_1").checked = true;

				str += "<div style='white-space:nowrap;cursor:pointer'>"
				if (status == 2) {
					document.getElementById("sortdirAsc").checked = true;

					str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[0] + "\"); myTable.toggleSortStatus(\"" + col + "\",0)'>" + colnameArr[0] + "</span>/";
					str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[1] + "\"); myTable.toggleSortStatus(\"" + col + "\",3)'>" + colnameArr[1] + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
					// str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[2] + "\"); myTable.toggleSortStatus(\"" + col + "\",4)'>" + colnameArr[2] + "</span>";
				} else {
					document.getElementById("sortdirDes").checked = true;


					str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[0] + "\"); myTable.toggleSortStatus(\"" + col + "\",0)'>" + colnameArr[0] + "</span>/";
					str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[1] + "\"); myTable.toggleSortStatus(\"" + col + "\",2)'>" + colnameArr[1] + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
					// str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[2] + "\"); myTable.toggleSortStatus(\"" + col + "\",4)'>" + colnameArr[2] + "</span>";
				}
				str += "</div>"
			} else {
				str += "<div style='white-space:nowrap;cursor:pointer'>"
				if (status == 4) {
					str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[0] + "\"); myTable.toggleSortStatus(\"" + col + "\",0)'>" + colnameArr[0] + "</span>/";
					str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[1] + "\"); myTable.toggleSortStatus(\"" + col + "\",2)'>" + colnameArr[1] + "</span>";
					// str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[2] + "\"); myTable.toggleSortStatus(\"" + col + "\",5)'>" + colnameArr[2] + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
				} else {
					str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[0] + "\"); myTable.toggleSortStatus(\"" + col + "\",0)'>" + colnameArr[0] + "</span>/";
					str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[1] + "\"); myTable.toggleSortStatus(\"" + col + "\",2)'>" + colnameArr[1] + "</span>";
					// str += "<span onclick='myTable.setNameColumn(\"" + colnameArr[2] + "\"); myTable.toggleSortStatus(\"" + col + "\",4)'>" + colnameArr[2] + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
				}
				str += "</div>"
			}
		} else {
			var labels = document.getElementsByClassName('headerlabel');
			for (var i=0; i < labels.length; i++) {
				if (labels[i].getAttribute("title") === colname)
					labels[i].parentNode.children[0].checked = true;
			}

			if (status == 0) {
				str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'><span style='display:inline;background-color:#d79b9b;width:16px;height:16px;border-radius:1px;'>ASC </span>" + colname + "</span>";
				document.getElementById("sortdirAsc").checked = true;
			} else if (status == 1) {
				str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",2)'><span style='display:inline;background-color:#d79b9b;width:16px;height:16px;border-radius:1px;'>DES </span>" + colname + "</span>";
				document.getElementById("sortdirDes").checked = true;
			} else if (status == 2) {
				str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'><span style='display:inline;background-color:#d79b9b;width:16px;height:16px;border-radius:1px;'>PEN </span>" + colname + "</span>";
				document.getElementById("sortdirPen").checked = true;
			}
		}
	}
	return str;
}

function conv(item, kind) {
	var tmp = 7;
	if (typeof (item) !== "undefined") {
		if (item.grade === null)
			tmp = 7; // N/A i.e. not opened
		if (item.grade === 0)
			tmp = 1; // Pending
		if (item.grade === 0 && item.userAnswer === null)
			tmp = 7; // Not submitted anything
		if (item.grade == 1)
			tmp = 6; // U
		if (item.grade == 1 && item.submitted > item.marked)
			tmp = 1; // Pending
		if (item.grade >= 2 && item.grade <= 3)
			tmp = 2; // Pass / G / VG
	}
	if (tmp < kind)
		tmp += 8;

	return tmp * 100;
}

function renderColumnFilter(col, status, colname) {
	str = "";
	if (colname == "FnameLname")
		return str;
	if (status) {
		str = "<div class='checkbox-dugga'>";
		str += "<input id=\"" + colname + "\" type='checkbox' checked onclick='onToggleFilter(\"" + col + "\")'><label class='headerlabel' for='" + colname + "'>" + colname + "</label>";
		str += "</div>"
	} else {
		str = "<div class='checkbox-dugga'>";
		str += "<input id=\"" + colname + "\" type='checkbox' onclick='onToggleFilter(\"" + col + "\")'><label class='headerlabel' for='" + colname + "'>" + colname + "</label>";
		str += "</div>"
	}
	return str;
}

function onToggleFilter(colId) {
	var idParts = colId.split(":");   // divides the string into lib and the actual id number
	for (var i = 0; i < moments.length; i++) {
		var element = moments[i];
		var elementId = element[idParts[0]];

		if (elementId == idParts[1]) // Checks if the moment id is the id of the currently pressed checkbox
		{
			if (element["lid"] == element["moment"]) // Checks if the pressed checkbox was a Moment or just a test (aka sub-moment)
			{
				// Due to moments having å,ä,ö in their names they will need to be "removed"/coverted before being used.
				var txt = document.createElement("textarea");
				txt.innerHTML = element.entryname;
				var checkBoxId = txt.value;
				var isChecked = document.getElementById(checkBoxId).checked;

				for (var j = 0; j < moments.length; j++) {
					if (moments[j].moment == idParts[1]) // Find all childs of the moment
					{
						var childColId = "lid:" + moments[j].lid;
						myTable.toggleColumn(childColId, childColId, isChecked);
					}
				}
			} else {
				myTable.toggleColumn(colId, colId);
			}
		}
	}

}

function exportCell(format, cell, colname) {
	str = "";
	if (format === "csv") {
		if (colname == "FnameLname") {
			str = cell.ssn + ",";

			str += cell.firstname + " " + cell.lastname;
			str = str.replace(/\&aring\;/g, "å");
			str = str.replace(/\&Aring\;/g, "Å");
			str = str.replace(/\&auml\;/g, "ä");
			str = str.replace(/\&Auml\;/g, "Ä");
			str = str.replace(/\&ouml\;/g, "ö");
			str = str.replace(/\&Ouml\;/g, "Ö");
		} else {
			if (cell === null) {
				str = "-";
			} else {
				if (cell.grade === null) {
					str = "-";
				} else {
					if (cell.gradeSystem === 1 || cell.gradeSystem === 2) {
						if (cell.grade === 1) {
							str = "U";
						} else if (cell.grade === 2) {
							str = "G";
						} else if (cell.grade === 3) {
							str = "VG";
						} else {
							str = "-";
						}
					} else {
						str = "UNK";
					}
				}
			}
		}
	} else {
		console.log("Export format: " + format + " not supported!");
	}
	return str;
}

function exportColumnHeading(format, heading, colname) {
	str = "";
	if (format === "csv") {
		if (colname == "FnameLname") {
			str = "Personnummer,Namn";
		} else {
			heading = heading.replace(/\&aring\;/g, "å");
			heading = heading.replace(/\&Aring\;/g, "Å");
			heading = heading.replace(/\&auml\;/g, "ä");
			heading = heading.replace(/\&Auml\;/g, "Ä");
			heading = heading.replace(/\&ouml\;/g, "ö");
			heading = heading.replace(/\&Ouml\;/g, "Ö");
			//          if(document.getElementById("ladselect").value==heading)heading="Betyg";
			//          str=heading.replace(",",".");
			str = heading;
		}
	} else {
		console.log("Export format: " + format + " not supported!");
	}
	return str;
}
//----------------------------------------
// LadExport
//----------------------------------------

//Function for exporting grades to ladoc
function ladexport() {
	let expo = "";

	expo += document.getElementById("ladselect").value + "\n";
	expo += document.getElementById("ladgradescale").value + "\n";
	expo += document.getElementById("laddate").value + "\n";
	expo += myTable.export("csv", ";");

	//alert(expo);
	document.getElementById("resultlistheader").innerHTML = "Results for: " + document.getElementById("ladselect").value;
	document.getElementById("resultlistarea").value = expo;
	document.getElementById("resultlistpopover").style.display = "flex";

	AJAXService("getunexported", {}, "GEXPORT");
}

function copyLadexport() {
	var lastExpDate = document.getElementById('lastExpDate');
	var copyIcon = document.getElementById("copyClipboard");
	copyIcon.style.backgroundColor = '#629c62';
		setInterval(function(){
			copyIcon.style.backgroundColor = '#afaeae';
		 }, 5000);

	var copieText = document.getElementById('resultlistarea');
	copieText.select();
	document.execCommand("copy");

	var today = new Date();
	var dd = addZero(today.getDate());
	var mm = addZero(today.getMonth() + 1); //January is 0!
	var yyyy = today.getFullYear();
	var time = addZero(today.getHours()) + ":" + addZero(today.getMinutes()) + ":" + addZero(today.getSeconds());

	today = yyyy + '-' + mm + '-' + dd;

	 var gradeLastExported = today + " " + time;
	 lastExpDate.innerHTML =  gradeLastExported;
	 lastExpDate.style.color = 'green';

	 setInterval(function(){
		lastExpDate.style.color  = '#000';
	 }, 5000);

	AJAXService("updateunexported", {
		gradeLastExported: gradeLastExported,
	}, "GEXPORT");

}

function addZero(i) {
	if (i < 10) {
	  i = "0" + i;
	}
	return i;
  }

function closeLadexport() {
	document.getElementById("resultlistarea").value = "";
	document.getElementById("resultlistpopover").style.display = "none";
}

function updateTable() {
	myTable.renderTable();
	var sel = document.getElementById("teacherDropdown");
	localStorage.setItem('examinatorFilter', sel.value);
}

function mail() {
  var reqType = "mail";
  var url_string = window.location.href;
  var url = new URL(url_string);
  var cidMail = url.searchParams.get("cid");
  var crsMail = url.searchParams.get("coursevers");

  myTable.mail(cidMail, crsMail, reqType);
}

// Puts filter buttons at a fixed point when scrolling horizontally
$(window).scroll(function() {
	var resultTableWidth = document.getElementById("resultTable___tbl").offsetWidth;
	var ladExportWidth = document.getElementById("resultedFormContainer").offsetWidth;
	var scrolled = $(this).scrollLeft();
	if((scrolled + ladExportWidth) < resultTableWidth){
		$('#resultedFormContainer').css({
			'transform': 'translateX(' + scrolled +'px'+ ')'
		});
	}
});

function hideSSN(ssn){
	var hiddenSSN;
	hiddenSSN = ssn.replace(ssn, 'XXXXXXXX-XXXX');
	return hiddenSSN;
}


function compare(firstCell, secoundCell) {
	let col = sortableTable.currentTable.getSortcolumn(); // Get column name
	let status = sortableTable.currentTable.getSortkind(); // Get if the sort arrow is up or down.
	let val = 0;
	let colOrder = sortableTable.currentTable.getColumnOrder(); // Get all the columns in the table.
	var firstCellTemp;
	var secoundCellTemp;
	var sizeTemp = '{"';
    if(typeof firstCell === 'object' && col.includes("FnameLname")) {
		// "FnameLname" is comprised of two separately sortable sub-columns,
		// if one of them is the sort-target, replace col with the subcolumn
		if(col == "FnameLname"){
			col = sortableTable.currentTable.getNameColumn();
		}
		// now check for matching columns with the potentially replaced name
		if (col == "Fname") {
			//Convert to json object
			if (JSON.stringify(firstCell.firstname) || JSON.stringify(secoundCell.firstname)) {
				firstCellTemp = firstCell.firstname;
				secoundCellTemp = secoundCell.firstname;
			} else {
				firstCell = JSON.parse(firstCell.firstname);
				secoundCell = JSON.parse(secoundCell.firstname);
				//Get the first letter from the value.
				firstCellTemp = Object.values(firstCell.firstname)[0];
				secoundCellTemp = Object.values(secoundCell.firstname)[0];
			}
		} else if (col == "Lname") {
			if (JSON.stringify(firstCell.lastname) || JSON.stringify(secoundCell.lastname)) {
				firstCellTemp = firstCell.lastname;
				secoundCellTemp = secoundCell.lastname;
			} else {
				firstCell = JSON.parse(firstCell.lastname);
				secoundCell = JSON.parse(secoundCell.lastname);
				//Get the first letter from the value.
				firstCellTemp = Object.values(firstCell.lastname)[0];
				secoundCellTemp = Object.values(secoundCell.lastname)[0];
			}
		}
		firstCellTemp = $('<div/>').html(firstCellTemp).text();
		secoundCellTemp = $('<div/>').html(secoundCellTemp).text();
		if (status == 0 || status == 2 || status == 4) {
			val = secoundCellTemp.toLocaleUpperCase().localeCompare(firstCellTemp.toLocaleUpperCase(), "sv");
		} else {
			val = firstCellTemp.toLocaleUpperCase().localeCompare(secoundCellTemp.toLocaleUpperCase(), "sv");
		}
		//Check if the cell is a valid cell in the table.
	} else if (typeof firstCell === 'object' && col.includes("lid")) {
		if (JSON.stringify(firstCell.grade) || JSON.stringify(secoundCell.grade)) {
			firstCellTemp = firstCell.grade;
			secoundCellTemp = secoundCell.grade;
		} else {
			firstCell = JSON.parse(firstCell.grade);
			secoundCell = JSON.parse(secoundCell.grade);
			//Get the first letter from the value.
			firstCellTemp = Object.values(firstCell.grade)[0];
			secoundCellTemp = Object.values(secoundCell.grade)[0];
		}
		firstCellTemp = $('<div/>').html(firstCellTemp).text();
		secoundCellTemp = $('<div/>').html(secoundCellTemp).text();
		if (status == 0) {
			//Ascending grade
			val = firstCellTemp.toLocaleUpperCase().localeCompare(secoundCellTemp.toLocaleUpperCase(), "sv");
		} else if (status == 1) {
			//descending grades
			if(secoundCellTemp !== "" && firstCellTemp !== "" && secoundCellTemp !== "0" && firstCellTemp !== "0" ){
				val = secoundCellTemp.toLocaleUpperCase().localeCompare(firstCellTemp.toLocaleUpperCase(), "sv");
			} else if((secoundCellTemp === "" || secoundCellTemp === "0") && (firstCellTemp !== "" || firstCellTemp !== "0")){
				val = 1
			} else if((firstCellTemp === "" || firstCellTemp === "0") && (secoundCellTemp !== "" || secoundCellTemp !== "0")){
				val = -1
			}
		} else if (status == 2) {
			//pending grades
			if(secoundCellTemp === "0" && firstCellTemp !== "0"){
				val = -1;
			} else if(secoundCellTemp !== "0" && firstCellTemp === "0" || secoundCellTemp === ""){
				val = 1;			 

			}
		}
	} else if (colOrder.includes(col)) {
		//Check if the cells contains a date object.
		if (Date.parse(firstCell) && Date.parse(secoundCell)) {
			firstCellTemp = firstCell;
			secoundCellTemp = secoundCell;
		} else {
			//Check if any cell is null.
			if (firstCell === null || secoundCell === null) {
				firstCellTemp = firstCell;
				secoundCellTemp = secoundCell;
			} else if (typeof(firstCell) != 'number' && (firstCell.includes(sizeTemp) && secoundCell.includes(sizeTemp)) && (col.includes("filesize"))) {
				tempTemp1 = firstCell.replace(/\D/g,'');
				tempTemp2 = secoundCell.replace(/\D/g,'');
				firstCellTemp = parseInt(tempTemp1, 10);
				secoundCellTemp = parseInt(tempTemp2, 10);
			} else {
				//Convert to json object
				if (JSON.stringify(firstCell) || JSON.stringify(secoundCell)) {
					firstCellTemp = firstCell;
					secoundCellTemp = secoundCell;
				} else {
					firstCell = JSON.parse(firstCell);
					secoundCell = JSON.parse(secoundCell);
					//Get the first letter from the value.
					firstCellTemp = Object.values(firstCell)[0];
					secoundCellTemp = Object.values(secoundCell)[0];
				}
			}
		}

		//Not currently relevant to resulted but may be usefull in the future, possibly if used in other modules.

		/*if (col === "requestedpasswordchange") {
			firstCellTemp = JSON.parse(firstCell);
			secoundCellTemp = JSON.parse(secoundCell);
			a = firstCellTemp.requested;
			b = secoundCellTemp.requested;
			if (status == 0) {
				a > b ? val = 1 : a < b ? val = -1 : val = 0;
			} else {
				a < b ? val = 1 : a > b ? val = -1 : val = 0;
			}
			return val;
		}*/

		/*if(!isNaN(firstCellTemp) && !isNaN(secoundCellTemp)) {
			if ((status % 2) == 0) {
				val = firstCellTemp < secoundCellTemp;
				if(val) {
					val = 1;
				}else{
					val = -1;
				}
			} else {
				val = secoundCellTemp < firstCellTemp;
				if(val){
					val = 1;
				}else{
					val = -1;
				}
			}
		} else if (status == 0) {
			firstCellTemp = $('<div/>').html(firstCellTemp).text();
			secoundCellTemp = $('<div/>').html(secoundCellTemp).text();
			val = secoundCellTemp.toLocaleUpperCase().localeCompare(firstCellTemp.toLocaleUpperCase(), "sv");
		} else {
			firstCellTemp = $('<div/>').html(firstCellTemp).text();
			secoundCellTemp = $('<div/>').html(secoundCellTemp).text();
			val = firstCellTemp.toLocaleUpperCase().localeCompare(secoundCellTemp.toLocaleUpperCase(), "sv");
		}*/
	} /*else {
		if ((status % 2) == 0) {	//
			val = firstCellTemp < secoundCell;
		} else {
			val = secoundCell < firstCellTemp;
		}*/

	return val;

}