var sessionkind = 0;
var activeElement;
var querystring = parseGet();
var versions;
var dataInfo;
var expanded = false;
var searchterm = "";
var tableName = "accessTable";
var tableCellName = "accessTableCell";
var myTable;
var accessFilter = "WRST";

//----------------------------------------------------------------------------
//----------==========########## User Interface ##########==========----------
//----------------------------------------------------------------------------

function setup() {
	// Get access filter options from local storage
	if (localStorage.getItem("accessFilter"+querystring['cid']) != null) {
		accessFilter = localStorage.getItem("accessFilter"+querystring['cid']);
	}

	var customFilterDiv = document.createElement("div");
	customFilterDiv.id = "customfilter";
	var columnFilterDiv = document.createElement("div");
	columnFilterDiv.id = "columnfilter";
	document.getElementById("dropdownc").appendChild(columnFilterDiv);
	document.getElementById("dropdownc").appendChild(customFilterDiv);

	var str = "<div id='sortOptionsContainer'>";
	str += "<input type='radio' name='sortAscDesc' value='1'><label class='headerlabel'>Sort descending</label>";
	str += "<input type='radio' name='sortAscDesc' value='0'><label class='headerlabel'>Sort ascending</label>";
	str += "<div id='sortOptions'></div>";
	str += "<button class='dropdown-button' onclick='parseSortOptions(this)'>Sort</button>";
	document.getElementById("dropdowns").innerHTML = str;

	var str = "<div class='checkbox-dugga'>";
	str += "<button id='toggleAllButton' class='dropdown-button' onclick='toggleAllCheckboxes(this)'>Toggle all</button>";
	str += "</div>"
	document.getElementById("dropdownc").innerHTML += str;

	AJAXService("GET", {
		cid: querystring['cid'],
		coursevers: querystring['coursevers']
	}, "ACCESS");

	// Add check boxes to the filter dropdown for filtering teachers/students/student teachers
	createCheckboxes();
}

//  Instead of commenting out the functions as previously which caused uncaught reference errors
//  function content was commented out to avoid having a white empty box appear.

function hoverc() {
	$('#dropdowns').css('display', 'none');
	$('#dropdownc').css('display', 'block');
}

function hovers() {
	$('#dropdowns').css('display', 'block');
	$('#dropdownc').css('display', 'none');
}

function leavec() {
	$('#dropdownc').css('display', 'none');
}

function leaves() {
	$('#dropdowns').css('display', 'none');
}

function showCreateUserPopup() {
	$("#createUser").css("display", "flex");
}

function showCreateClassPopup() {
	$("#createClass").css("display", "flex");
}

function showCreateUserPopup() {
	$("#createUser").css("display", "flex");
}

function showCreateClassPopup() {
	$("#createClass").css("display", "flex");
}

function showImportUsersPopup() {
	$("#importUsers").css("display", "flex");
}

function hideCreateUserPopup() {
	$("#createUser").css("display", "none");
}

function hideCreateClassPopup() {
	$("#createClass").css("display", "none");
}

function hideImportUsersPopup() {
	$("#importUsers").css("display", "none");
}

function closeEdituser() {
	$("#editUsers").css("display", "none");
}

//----------------------------------------------------------------------------
//-------------==========########## Commands ##########==========-------------
//----------------------------------------------------------------------------

function importUsers() {
	var newUsersArr = new Array();
	newusers = $("#import").val();
	var myArr = newusers.split("\n");
	for (var i = 0; i < myArr.length; i++) {
		var input = myArr[i].replace(/\"/g, '').split(";");
		newUsersArr.push(input);
		if (!verifyUserInputForm(input)) return;
	}
	var newUserJSON = JSON.stringify(newUsersArr);

	AJAXService("ADDUSR", {
		cid: querystring['cid'],
		newusers: newUserJSON,
		coursevers: querystring['coursevers']
	}, "ACCESS");
	hideImportUsersPopup();
}

function addSingleUser() {
	var newUser = new Array();
	newUser.push($("#addSsn").val());
	newUser.push($("#addFirstname").val());
	newUser.push($("#addLastname").val());
	newUser.push($("#addEmail").val());
	newUser.push($("#addCid").val());
	newUser.push($("#addTerm").val());
	newUser.push($("#addPid").val());
	newUser.push($("#addNy").val());

	if (!verifyUserInputForm(newUser)) return;
	var outerArr = new Array();
	outerArr.push(newUser);

	var newUserJSON = JSON.stringify(outerArr);
	AJAXService("ADDUSR", {
		cid: querystring['cid'],
		newusers: newUserJSON,
		coursevers: querystring['coursevers']
	}, "ACCESS");
	hideCreateUserPopup();
}

function verifyUserInputForm(input) {
	// Verify SSN <= 20 characters
	if (input[0].length > 20) {
		alert('Input exceeded max length for SSN (20)');
		return false;
	}

	// Verify First/Last name <= 50 characters
	if (input[1].length > 50 || input[2].length > 50) {
		alert('Input exceeded max length for first or last name (50)');
		return false;
	}

	// Verify PID <= 10 characters
	if (input[input.length - 2].length > 10) {
		alert('Input exceeded max length for PID (10)');
		return false;
	}

	// Verify Email <= 256 characters, contains '@' and <= 80 characters before '@'
	if (input[3].length > 256) {
		alert('Input exceeded max length for Email (256)');
		return false;
	}
	if (input[3] && input[3].indexOf('@') == -1) {
		alert('Email input must contain "@"');
		return false;
	}
	if (input[3] && input[3].indexOf('@') >= 80) {
		alert('Email input too large to create a valid username\nMax allowed characters before "@" is 80');
		return false;
	}
	if (input[3] && input[3].indexOf('@') == 0) {
		alert('Email input must contain at least 1 character before "@" to create a username');
		return false;
	}
	return true;
}

var inputVerified;

function addClass() {
	inputVerified = true;
	document.getElementById("classErrorText").innerHTML = "";
	var newClass = new Array();
	newClass.push(verifyClassInput($("#addClass"), null, ""));
	newClass.push(verifyClassInput($("#addResponsible"), null, ""));
	newClass.push(verifyClassInput($("#addClassname"), null, ""));
	newClass.push(verifyClassInput($("#addRegcode"), /^[0-9]*$/, "number"));
	newClass.push(verifyClassInput($("#addClasscode"), null, ""));
	newClass.push(verifyClassInput($("#addHp"), /^[0-9.]*$/, "(decimal) number"));
	newClass.push(verifyClassInput($("#addTempo"), /^[0-9]*$/, "number"));
	newClass.push(verifyClassInput($("#addHpProgress"), /^[0-9.]*$/, "(decimal) number"));

	if (inputVerified) {
		var outerArr = new Array();
		outerArr.push(newClass);

		var newClassJSON = JSON.stringify(outerArr);
		AJAXService("ADDCLASS", {
			cid: querystring['cid'],
			newclass: newClassJSON,
			coursevers: querystring['coursevers']
		}, "ACCESS");
		hideCreateClassPopup();
	}
}

function resetPw(uid, username) {
	rnd = randomstring();

	window.location = "mailto:" + username + "@student.his.se?Subject=LENASys%20Password%20Reset&body=Your%20new%20password%20for%20LENASys%20is:%20" + rnd + "%0A%0A/LENASys Administrators";

	AJAXService("CHPWD", {
		cid: querystring['cid'],
		uid: uid,
		pw: rnd,
		coursevers: querystring['coursevers']
	}, "ACCESS");
}

function changeOpt(e) {
	var paramlist = e.target.id.split("_");
	changeProperty(paramlist[1], paramlist[0], e.target.value);
}

function changeProperty(targetobj, propertyname, propertyvalue) {
	AJAXService("UPDATE", {
		cid: querystring['cid'],
		uid: targetobj,
		prop: propertyname,
		val: propertyvalue
	}, "ACCESS");
}

function showVersion(vers) {
	window.location.href = "../DuggaSys/sectioned.php?courseid=" + querystring['cid'] + "&coursevers=" + vers;
}

//----------------------------------------------------------------
// renderCell <- Callback function that renders cells in the table
//----------------------------------------------------------------
var tgroups = [];

function hideSSN(ssn) {
	var hiddenSSN;
	hiddenSSN = ssn.replace(ssn, 'XXXXXXXX-XXXX');
	return hiddenSSN;
}

function renderCell(col, celldata, cellid) {
	var str = "UNK";
	if (col == "username" || col == "ssn" || col == "firstname" || col == "lastname" || col == "class" || col == "examiner" || col == "groups" || col == "vers" || col == "access" || col == "requestedpasswordchange") {
		obj = JSON.parse(celldata);
	}

	if (col == "username" || col == "ssn" || col == "firstname" || col == "lastname") {
		//str = "<div style='display:flex;'><input id='"+col+"_"+obj.uid+"' onKeyDown='if(event.keyCode==13) changeOpt(event)' value=\""+obj[col]+"\" style='margin:0 4px;flex-grow:1;font-size:11px;' size=" + obj[col].toString().length +"></div>";
		if (col == "ssn") {
			str = "<div style='display:flex;'><span id='" + col + "_" + obj.uid + "' style='margin:0 4px;flex-grow:1;'>" + hideSSN(obj[col]) + "</span></div>";
		} else {
			str = "<div style='display:flex;'><span id='" + col + "_" + obj.uid + "' style='margin:0 4px;flex-grow:1;'>" + obj[col] + "</span></div>";
		}
	} else if (col == "class") {
		str = "<select onchange='changeOpt(event)' id='" + col + "_" + obj.uid + "'><option value='None'>None</option>" + makeoptionsItem(obj.class, filez['classes'], "class", "class") + "</select>";
	} else if (col == "examiner") {
		str = "<select onchange='changeOpt(event)' id='" + col + "_" + obj.uid + "'><option value='None'>None</option>" + makeoptionsItem(obj.examiner, filez['teachers'], "name", "uid") + "</select>";
	} else if (col == "vers") {
        str = "<select onchange='changeOpt(event)' id='" + col + "_" + obj.uid + "'>" + makeoptionsItem(obj.vers, filez['courses'], "versname", "vers") + "</select>";
        for (var submission of filez['submissions']) {
            if (obj.uid === submission.uid) {
                str += "<img class='oldSubmissionIcon' title='View old version' src='../Shared/icons/DocumentDark.svg' onclick='showVersion(" + submission.vers + ")'>";
                break;
            }
        };
	} else if (col == "access") {
		str = "<select onchange='changeOpt(event)' id='" + col + "_" + obj.uid + "'>" + makeoptions(obj.access, ["Teacher", "Student", "Student teacher"], ["W", "R", "ST"]) + "</select>";
	} else if (col == "requestedpasswordchange") {
		
		if (parseFloat(obj.recent) > 1440) {
			str = "<input class='submit-button' type='button' value='Reset PW' style='display:block;margin:auto;float:none;'";
		} else {
			str = "<input class='submit-button resetpw-button' type='button' value='Reset PW'";
		}
		str += " onclick='if(confirm(\"Reset password for " + obj.username + "?\")) ";
		str += "resetPw(\"" + obj.uid + "\",\"" + obj.username + "\"); return false;'>";
	} else if (col == "groups") {
		if (obj.groups == null) {
			tgroups = [];
		} else {
			tgroups = obj.groups.split(" ");
		}
		var optstr = "";
		for (var i = 0; i < tgroups.length; i++) {
			if (i > 0) optstr += " ";
			optstr += tgroups[i].substr(1 + tgroups[i].indexOf("_"));
		}
		str = "<div class='multiselect-group'><div class='group-select-box' onclick='showCheckboxes(this)'>";
		str += "<select><option>" + optstr + "</option></select><div class='overSelect'></div></div><div class='checkboxes' id='grp" + obj.uid + "' >";
		for (var i = 0; i < filez['groups'].length; i++) {
			var group = filez['groups'][i];
			if (tgroups.indexOf((group.groupkind + "_" + group.groupval)) > -1) {
				str += "<label><input type='checkbox' checked id='g" + obj.uid + "' value='" + group.groupkind + "_" + group.groupval + "' />" + group.groupval + "</label>";
			} else {
				str += "<label><input type='checkbox' id='g" + obj.uid + "' value='" + group.groupkind + "_" + group.groupval + "' />" + group.groupval + "</label>";
			}
		}
		str += '</div></div>';
	} else {
		str = "<div style='display:flex;'><div style='margin:0 4px;flex-grow:1;'>" + celldata + "</div></div>";
	}
	return str;

}

function renderSortOptions(col, status, colname) {
	str = "";
	if (status == -1) {
		str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "</span>";
	} else if (status == 0) {
		str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
	} else {
		str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
	}
	addToSortDropdown(colname, col);
	return str;
}

var sortColumns = [];
function addToSortDropdown(colname, col) {
	if (!sortColumns.includes(col)) {
		var str = "";
		str += "<div class='checkbox-dugga'><input name='sort' class='sortRadioBtn' type='radio' value="+col+"><label class='headerlabel'>"+colname+"</label></div>";
		document.getElementById('sortOptions').innerHTML += str;
		sortColumns.push(col);
	}
}

function parseSortOptions(el) {
	var inputs = el.parentNode.getElementsByTagName('input');
	var status;
	if (inputs[0].checked) {
		status = inputs[0].value;
	} else if (inputs[1].checked) {
		status = inputs[1].value;
	}

	var column;
	for (var i = 2; i < inputs.length; i++) {
		if (inputs[i].checked) {
			column = inputs[i].value;
		}
	}

	if (status && column) {
		myTable.toggleSortStatus(column, status);
	}
}

//--------------------------------------------------------------------------
// editCell
// ---------------
//  Callback function for showing a cell editing interface
//--------------------------------------------------------------------------
function displayCellEdit(celldata, rowno, rowelement, cellelement, column, colno, rowdata, coldata, tableid) {
	let str = false;
	if (column == "firstname" || column == "lastname" || column == "username") {
		celldata = JSON.parse(celldata);
		str = "<input type='hidden' id='popoveredit_uid' class='popoveredit' style='flex-grow:1;' value='" + celldata.uid + "'/>";
		str += "<input type='text' id='popoveredit_" + column + "' class='popoveredit' style='flex-grow:1;width:auto;' value='" + celldata[column] + "' size=" + celldata[column].toString().length + "/>";
	}
	return str;
}


function renderColumnFilter(col, status, colname) {
    str = "";
    if (colname == "User")
        return str;
    if (status) {
        str = "<div class='checkbox-dugga'>";
        str += "<input id=\"" + colname + "\" type='checkbox' name='checkbox' checked onclick='onToggleFilter(\"" + col + "\")'><label class='headerlabel'>" + colname + "</label>";
        str += "</div>"
    } else {
            str = "<div class='checkbox-dugga'>";
            str += "<input id=\"" + colname + "\" type='checkbox' name='checkbox' onclick='onToggleFilter(\"" + col + "\")'><label class='headerlabel'>" + colname + "</label>";
            str += "</div>"
    }
    return str;
}

function onToggleFilter(colId) {
    myTable.toggleColumn(colId, colId);
}

function toggleAllCheckboxes(source){
	var i = 0
    checkboxArray = document.getElementsByName('checkbox');
    for (n = checkboxArray.length; i < n; i++){
		document.getElementById(checkboxArray[i].id).click();
	}
}

//--------------------------------------------------------------------------
// updateCellCallback
// ---------------
//  Callback function for updating a cell value after editing a cell
//--------------------------------------------------------------------------
function updateCellCallback(rowno, colno, column, tableid) {
	if (column == "firstname" || column == "lastname" || column == "username") {
		// TODO: Check of individual parts needs to be done.
		var obj = {
			uid: parseInt(document.getElementById("popoveredit_uid").value)
		};
		obj[column] = document.getElementById("popoveredit_" + column).value;
		changeProperty(obj.uid, column, obj[column])
		return JSON.stringify(obj);
	}
}

//----------------------------------------------------------------
// rowFilter <- Callback function that filters rows in the table
//----------------------------------------------------------------

function rowFilter(row) {
	var obj = JSON.parse(row["access"]);
	if (accessFilter.indexOf(obj.access) > -1) {
		if (searchterm == "") {
			return true;
		} else {
			for (var property in row) {
				if (row.hasOwnProperty(property)) {
					if (row[property] != null) {
						if (row[property].indexOf != null) {
							// Search case insensitive
							searchterm = searchterm.toLocaleLowerCase();
							caseIgnoreRow = row[property].toLocaleLowerCase();

							// Support ÅÄÖ
							searchterm = searchterm.replace(/\u00E5/, '&aring;');
							searchterm = searchterm.replace(/\u00E5/, '&auml;');
							searchterm = searchterm.replace(/\u00F6/, '&ouml;');

							if (caseIgnoreRow.indexOf(searchterm) != -1) return true;
							
						}
					}
				}
			}
		}
	}
	return false;
}


//----------------------------------------------------------------------------
//-------------==========########## Renderer ##########==========-------------
//----------------------------------------------------------------------------

function returnedAccess(data) {
	if (!data.access) {
		window.location.href = 'courseed.php';
	}
	filez = data;

	if (data['debug'] != "NONE!") alert(data['debug']);

	var tabledata = {

		tblhead: {
			username: "User",
			/*ssn: "SSN",*/
			firstname: "First name",
			lastname: "Last name",
			class: "Class",
			modified: "Last Modified",
			examiner: "Examiner",
			vers: "Version",
			access: "Access",
			groups: "Group(s)",
			requestedpasswordchange: "Password"
		},
		tblbody: data['entries'],
		tblfoot: {}
	}
	var colOrder = ["username",/* "ssn",*/ "firstname", "lastname", "class", "modified", "examiner", "vers", "access", "groups", "requestedpasswordchange"]
	myTable = new SortableTable({
		data: tabledata,
		tableElementId: "accessTable",
		filterElementId: "filterOptions",
		renderCellCallback: renderCell,
		renderSortOptionsCallback: renderSortOptions,
		renderColumnFilterCallback: renderColumnFilter,
		rowFilterCallback: rowFilter,
		displayCellEditCallback: displayCellEdit,
		updateCellCallback: updateCellCallback,
		columnOrder: colOrder,
		freezePaneIndex: 4,
		hasRowHighlight: true,
		hasMagicHeadings: false,
		hasCounterColumn: true
	});

	myTable.renderTable();
}

//excuted onclick button for quick searching in table
function keyUpSearch() {
	$('#searchinput').keyup(function () {
		var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
		$('#accesstable_body tr').show().filter(function () {
			var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
			return !~text.indexOf(val);
		}).hide();
	});
}

function showCheckboxes(element) {
	activeElement = element;
	var checkboxes = $(element).find(".checkboxes");
	checkboxes = element.parentElement.lastChild;
	if (!expanded) {
		checkboxes.style.display = "block";
		expanded = true;
	} else {
		checkboxes.style.display = "none";
		expanded = false;
	}
}

$(document).mouseover(function (e) {
	FABMouseOver(e);
});

$(document).mouseout(function (e) {
	FABMouseOut(e);
});

$(document).mousedown(function (e) {
	mouseDown(e);

	if (e.button == 0) {
		FABDown(e);
	}
});

$(document).mouseup(function (e) {
	mouseUp(e);

	if (e.button == 0) {
		FABUp(e);
	}
});

$(document).on("touchstart", function (e) {
	if ($(e.target).parents(".fixed-action-button").length !== 0 && $(e.target).parents(".fab-btn-list").length === 0) {
		e.preventDefault();
	}

	mouseDown(e);
	TouchFABDown(e);
});

$(document).on("touchend", function (e) {
	if ($(e.target).parents(".fixed-action-button").length !== 0 && $(e.target).parents(".fab-btn-list").length === 0) {
		e.preventDefault();
	}
	mouseUp(e);
	TouchFABUp(e);
});

//----------------------------------------------------------------------------------
// mouseDown: make sure mousedown is only handled in one single place regardless if touch or mouse
//----------------------------------------------------------------------------------

function mouseDown(e) {

}

//----------------------------------------------------------------------------------
// mouseUp: make sure mousedown is only handled in one single place regardless if touch or mouse
//----------------------------------------------------------------------------------

function mouseUp(e) {

	// if the target of the click isn't the container nor a descendant of the container
	if (activeElement) {
		var checkboxes = $(activeElement).find(".checkboxes");
		checkboxes = activeElement.parentElement.lastChild;

		if (expanded && !checkboxes.contains(e.target)) {
			checkboxes.style.display = "none";
			var str = "";
			for (i = 0; i < checkboxes.childNodes.length; i++) {
				if (checkboxes.childNodes[i].childNodes[0].checked) {
					str += checkboxes.childNodes[i].childNodes[0].value + " ";
				}
			}
			expanded = false;
			if (str != "") changeProperty(checkboxes.id.substr(3), "group", str);
			// if user unpresses all checkboxes it the student will now belong to no group
			else changeProperty(checkboxes.id.substr(3), "group", "None");
		}
	}
}

//----------------------------------------------------------------------------------
// createQuickItem: Handle "fast" click on FAB button
//----------------------------------------------------------------------------------

function createQuickItem() {
	clearTimeout(pressTimer);
	showImportUsersPopup();
}

//----------------------------------------------------------------------------------
// Keyboard shortcuts - Edit functionality in the accessed table
//----------------------------------------------------------------------------------
document.addEventListener("keyup", function(event)
{
  if (event.keyCode === 13)
  {
    // If user presses key: Enter (13)
    updateCellInternal();
  } else if (event.keyCode === 27) {
    // If user presses key: Escape (27)
    clearUpdateCellInternal();
  }
});

/*
//----------------------------------------------------------------------------------
// searchTable - Search the table and filter its contents
//----------------------------------------------------------------------------------
function searchTable() {
	searchterm=document.getElementById("searchinput").value;
	searchKeyUp(event);
	myTable.reRender();
}
*/

//----------------------------------------------------------------------------------
// filterAccess - Filter by teachers/students (write access/read access)
//----------------------------------------------------------------------------------
function filterAccess() {
	toggleTeachers = document.getElementById("filterAccess1");
	toggleStudents = document.getElementById("filterAccess2");
	toggleStudentTeachers = document.getElementById("filterAccess3");
	accessFilter = "";

	if (toggleTeachers.checked) {
		accessFilter += "W";
	}
	if (toggleStudents.checked) {
		accessFilter += "R";
	}
	if (toggleStudentTeachers.checked) {
		accessFilter += "ST";
	}
	//console.log(accessFilter);
	// Save to local storage to remember the filtering. Add the course ID to key to allow for different filterings for each course
	localStorage.setItem("accessFilter"+querystring['cid'], accessFilter);
	myTable.reRender();
}

//----------------------------------------------------------------------------------
// createCheckboxes - Create checkboxes for filtering teachers/students
//----------------------------------------------------------------------------------
function createCheckboxes() {
	
	var labels = ["Show teachers", "Show students", "Show student teachers"];
	var str = "";
	for (i = 0; i < labels.length; i++) {
		str += "<div class='checkbox-dugga checkmoment'>";
		str += "<input id='filterAccess" + (i+1) + "' type='checkbox' value='" + (i+1) + "' onchange='filterAccess()' ";
		if (i == 0 && accessFilter.indexOf("W") > -1) str += "checked";
		else if (i == 1 && accessFilter.indexOf("R") > -1) str += "checked";
		else if (i == 2 && accessFilter.indexOf("ST") > -1) str += "checked";
		str += "></input>";
		str += "<label for='filterAccess" + (i+1) + "' class='headerlabel'>" + labels[i] + "</label>";
		str += "</div>";
	}
	document.getElementById("customfilter").innerHTML=str;
}

//--------------------------------------------------------------------------
//  Callback function with different compare alternatives for the column sort
//--------------------------------------------------------------------------

function compare(a, b) {
    var col = sortableTable.currentTable.getSortcolumn();
		var status = sortableTable.currentTable.getSortkind(); // Get if the sort arrow is up or down.
	
		if(status==1){
				var tempA = a;
				var tempB = b;
		
		}else{
				var tempA = b;
				var tempB = a;
		}
	
		if(col=="firstname"||col=="lastname"||col=="class"||col=="examiner"){
				tempA = JSON.parse(tempA);
				tempB = JSON.parse(tempB);
				if(col=="firstname"){
						tempA=tempA.firstname.replace(/&aring/g,"å").replace(/&auml/g,"ä").replace(/&ouml/g,"ö").replace(/&Aring/g,"Å").replace(/&Auml/g,"Ä").replace(/&Ouml/g,"Ö");	
						tempB=tempB.firstname.replace(/&aring/g,"å").replace(/&auml/g,"ä").replace(/&ouml/g,"ö").replace(/&Aring/g,"Å").replace(/&Auml/g,"Ä").replace(/&Ouml/g,"Ö");	
				}else if(col=="lastname"){
						tempA=tempA.lastname.replace(/&aring/g,"å").replace(/&auml/g,"ä").replace(/&ouml/g,"ö").replace(/&Aring/g,"Å").replace(/&Auml/g,"Ä").replace(/&Ouml/g,"Ö");	;	
						tempB=tempB.lastname.replace(/&aring/g,"å").replace(/&auml/g,"ä").replace(/&ouml/g,"ö").replace(/&Aring/g,"Å").replace(/&Auml/g,"Ä").replace(/&Ouml/g,"Ö");	;	
				}else if(col=="class"){
						tempA=tempA.class;
						tempB=tempB.class;
						if(tempA==null) return -1;
						if(tempB==null) return 1;
				}else if(col=="examiner"){
						tempA=tempA.examiner;
						tempB=tempB.examiner;
						if(tempA==null) return -1;
						if(tempB==null) return 1;
				}else if(col=="version"){
						tempA=tempA.version;
						tempB=tempB.version;
				}					
				return tempA.toLocaleUpperCase().localeCompare(tempB.toLocaleUpperCase(), "sv");
		}else if(col=="lastmodified"){
				tempA=Date.parse(tempA);
				tempB=Date.parse(tempB);
				if(isNaN(tempA)) tempA=-1;
				if(isNaN(tempB)) tempB=-1;						
		}
	
		if (tempA > tempB) {
				return 1;
		} else if (tempA < tempB) {
				return -1;
		} else {
				return 0;
		}	
	
		/*
    if (col == "filename") {
        tempA = JSON.parse(tempA);
        tempB = JSON.parse(tempB);
        tempA = tempA.shortfilename.toUpperCase();
        tempB = tempB.shortfilename.toUpperCase();
    }else if (col == "filesize") {
        tempA = JSON.parse(tempA);
        tempB = JSON.parse(tempB);
				if(tempA.kind=="Link") tempA.size=-2;
				if(tempB.kind=="Link") tempB.size=-2;
				tempA=parseInt(tempA.size);
				tempB=parseInt(tempB.size);
				if(isNaN(tempA)) tempA=-1;
				if(isNaN(tempB)) tempB=-1;
    }else if (col == "uploaddate") {
				tempA=Date.parse(tempA);
				tempB=Date.parse(tempB);
				if(isNaN(tempA)) tempA=-1;
				if(isNaN(tempB)) tempB=-1;			
		}else if(col=="editor"||col=="trashcan"){
				tempA=-1;
				tempB=-1;
		}


    if (tempA > tempB) {
        return 1;
    } else if (tempA < tempB) {
        return -1;
    } else {
        return 0;
    }
		
*/


    // return tempA - tempB;
}