var sessionkind = 0;
var activeElement;
var querystring = parseGet();
var versions;
var dataInfo;
var searchterm = "";
var tableName = "accessTable";
var tableCellName = "accessTableCell";
var myTable;
var accessFilter = "W";
var trueTeacher;
var examinerName;
var activeDropdown;
var activeArrow;
var shouldReRender = false;
var str = "W";
var x = window.matchMedia('(max-width: 380px)');

x.onchange = (e) => {
    if (e.matches) {
        displayNavIcons();
    }
}  

function displayNavIcons() {
    document.getElementById("home").style.display="revert";
    document.getElementById("theme-toggle").style.display="revert";
    document.getElementById("back").style.display="revert";    
}
//----------------------------------------------------------------------------
//----------==========########## User Interface ##########==========----------
//----------------------------------------------------------------------------

function setup() {
	// Get access filter options from local storage
	if (localStorage.getItem("accessFilter"+querystring['courseid']) != null) {
		accessFilter = localStorage.getItem("accessFilter"+querystring['courseid']);
	}
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
		courseid: querystring['courseid'],
		coursevers: querystring['coursevers']
	}, "ACCESS");

	// Add check boxes to the filter dropdown for filtering teachers/students/student teachers
	createCheckboxes();
}

//  Instead of commenting out the functions as previously which caused uncaught reference errors
//  function content was commented out to avoid having a white empty box appear.

//displays dropdown when hovering search bar
function hoverSearch() {
	$('#dropdownSearch').css({display:'block'});
	$('#dropdowns').css('display', 'none');
	$('#dropdownc').css('display', 'none');
}

//stops displaying the dropdown when removing cursor from search bar
function leaveSearch() {
	$('#dropdownSearch').css({display:'none'});
}

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

function hideCreateUserPopup() {
	$("#createUser").css("display", "none");
}

function hideCreateClassPopup() {
	$("#createClass").css("display", "none");
}

//----------------------------------------------------------------------------
//-------------==========########## Commands ##########==========-------------
//----------------------------------------------------------------------------

function addSingleUser() {

	var newUser = new Array();
	newUser.push($("#addSsn").val());
	newUser.push($("#addFirstname").val());
	newUser.push($("#addLastname").val());
	newUser.push($("#addEmail").val());
	newUser.push($("#addCid").val());
	newUser.push($("#addTerm").val());
	newUser.push($("#addPid").val());

	if (!verifyUserInputForm(newUser)) return;
	var outerArr = new Array();
	outerArr.push(newUser);

	var newUserJSON = JSON.stringify(outerArr);
	AJAXService("ADDUSR", {
		courseid: querystring['courseid'],
		newusers: newUserJSON,
		coursevers: querystring['coursevers']
	}, "ACCESS");
	hideCreateUserPopup();
}

function verifyUserInputForm(input) {
	var verifyString = '';

	// Verify first name
	if(verifyString = validateName(input[1])) {		// Returns null if there is no error
		alert(verifyString);
		return false;
	}

	// Verify last name
	if(verifyString = validateName(input[2])) {		// Returns null if there is no error
		alert(verifyString);
		return false;
	}

	// Verify email
	if(verifyString = validateEmail(input[3])) {	// Returns null if there is no error
		alert(verifyString);
		return false;
	}

	// Verify term
	if(verifyString = validateTerm(input[5])) {	// Returns null if there is no error
		alert(verifyString);
		return false;
	}

	return true;
}

//---------------------------------------------------------------------------------------------------
// validateName(name)
// Returns null if there are NO errors, otherwise a descripitve error message as string.
//---------------------------------------------------------------------------------------------------
function validateName(name)
{
	const length = name.length;
	if(length < 2)	return 'Name is too short\nMinimum two characters';	// Too short
	if(length > 50)	return 'Name is too long\nMaximum 50 characters';	// Too long
	if(name[0] !== name[0].toLocaleUpperCase()) return 'Name must start with a capital letter';
	const formatTest = /^[a-zA-ZäöåÄÖÅ]+$/;		// Expected charachters
	if(!formatTest.test(name))
		return 'Name contains illegal characters, can only contain A-Ö';

	return null;	// The provided name is alright
}

function validateFirstName() { return validateName(document.getElementById('addFirstname').value); }
function validateLastName() { return validateName(document.getElementById('addLastname').value); }

function tooltipFirst()
{
	var error = validateFirstName();
	var fnameInputBox = document.getElementById('addFirstname');

	if(error && document.getElementById('addFirstname').value.length > 0) {	// Error, fade in tooltip
		document.getElementById('tooltipFirst').innerHTML = error;
		$('#tooltipFirst').fadeIn();
		fnameInputBox.style.backgroundColor = '#f57';
	} else {															// No error, fade out tooltip
		$('#tooltipFirst').fadeOut();
		fnameInputBox.style.backgroundColor = '#fff';
	}
}

function tooltipLast()
{
	var error = validateLastName();
	var lnameInputBox = document.getElementById('addLastname');

	if(error && document.getElementById('addLastname').value.length > 0) {	// Error, fade in tooltip
		document.getElementById('tooltipLast').innerHTML = error;
		$('#tooltipLast').fadeIn();
		lnameInputBox.style.backgroundColor = '#f57';
	} else {															// No error, fade out tooltip
		$('#tooltipLast').fadeOut();
		lnameInputBox.style.backgroundColor = '#fff';
	}
}

//---------------------------------------------------------------------------------------------------
// validateEmail(email)
// Returns null if there are NO errors, otherwise a descripitve error message as string.
//---------------------------------------------------------------------------------------------------
function validateEmail(email)
{
	const length = email.length;
	const delimiter = email.indexOf('@');	// Delimiter of the @ in an email

	if((length-delimiter) > 255)			// Domain part of email can't exceed 255 charachters
		return 'Email error! Domain part is too long (maximum 255)';

	if(email.indexOf('..') > 0)				// Consecutive . are not allowed
		return 'Email error! Consecutive "." are not allowed';

	if(email.lastIndexOf('@')!==delimiter)	// Only one @ allowed to separate local and domain parts
		return 'Email error! Only one "@" is allowed';

	const formatTest = /[A-z0-9]{1,64}@[A-z0-9]{1,}[.]{1}[A-z0-9]{2,}/;		// Expected format
	if(!formatTest.test(email))
		return 'Email error! Format is invalid';

	return null;	// The provided email is correct!
}

function tooltipEmail()
{
	var error = validateEmail(document.getElementById('addEmail').value);
	var emailInputBox = document.getElementById('addEmail');

	if(error && document.getElementById('addEmail').value.length > 0) {	// Error, fade in tooltip
		document.getElementById('tooltipEmail').innerHTML = error;
		$('#tooltipEmail').fadeIn();
		emailInputBox.style.backgroundColor = '#f57';
	} else {															// No error, fade out tooltip
		$('#tooltipEmail').fadeOut();
		emailInputBox.style.backgroundColor = '#fff';
	}
}

//---------------------------------------------------------------------------------------------------
// validateTerm(term)
// Returns null if there are NO errors, otherwise a descripitve error message as string.
//---------------------------------------------------------------------------------------------------

function validateTerm(term)
{
	if(term.match(/^(HT-|VT-)\d{2}$/gm) == null ) return 'The term must be in format "VT-10" '; //must follow "HT/VT-XX" format
	return null; //the provided term is correct
}
function tooltipTerm()
{
	var error = validateTerm(document.getElementById('addTerm').value);
	var termInputBox = document.getElementById('addTerm');

	if(error && document.getElementById('addTerm').value.length > 0) {	// Error, fade in tooltip
		document.getElementById('tooltipTerm').innerHTML = error;
		$('#tooltipTerm').fadeIn();
		termInputBox.style.backgroundColor = '#f57';
	} else {															// No error, fade out tooltip
		$('#tooltipTerm').fadeOut();
		termInputBox.style.backgroundColor = '#fff';
	}
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
			courseid: querystring['courseid'],
			newclass: newClassJSON,
			coursevers: querystring['coursevers']
		}, "ACCESS");
		hideCreateClassPopup();
	}
}

function resetPw(uid, username) {
	rnd = randomstring();

	window.location = `mailto:${username}@student.his.se?Subject=LENASys%20Password%20Reset&body=Your%20new%20password%20for%20LENASys%20is:%20${rnd}%0A%0A/LENASys Administrators`;

	AJAXService("CHPWD", {
		courseid: querystring['courseid'],
		uid: uid,
		pw: rnd,
		coursevers: querystring['coursevers']
	}, "ACCESS");
}

function getColname(e){
	var element = e.target.parentElement.parentElement;
	var cellelement = element.closest("td");
	let regex = new RegExp("^r([0-9]+)" + myTable.getDelimiter() + "([a-zA-Z0-9]+)" + myTable.getDelimiter() + "(.*)")
	let match = cellelement.id.match(regex);
	var colname = match[3];
	return colname.toString();
}

function changeOptDiv(e) {
	var paramlist = e.target.parentElement.parentElement.id.split("_");
	key = getColname(e);
	keyvalue = e.target.getAttribute('data-value');

	obj = {
		uid: paramlist[1],
		[key]: keyvalue
	}
	updateDropdownInTable(e.target.parentElement.parentElement.firstChild, obj);
	changeProperty(paramlist[1], paramlist[0], keyvalue);
  shouldReRender = true;
}

function changeOptDivStudent(e,value){
	var paramlist = e.target.parentElement.parentElement.id.split("_");
	key = getColname(e);
	keyvalue = e.target.getAttribute('data-value');

	obj = {
		uid: paramlist[1],
		[key]: keyvalue
	}
	updateDropdownInTable(e.target.parentElement.parentElement.firstChild, obj);
	changeProperty(paramlist[1], paramlist[0], value);
  shouldReRender = true;
}

function changeProperty(targetobj, propertyname, propertyvalue) {
	AJAXService("UPDATE", {
		courseid: querystring['courseid'],
		uid: targetobj,
		prop: propertyname,
		val: propertyvalue
	}, "ACCESS");
}

function showVersion(vers) {
	window.location.href = `../DuggaSys/sectioned.php?courseid=${querystring['courseid']}&coursevers=` + vers;
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
		if (col == "ssn") {
			str = `<div style='display:flex;'><span id='${col}_${obj.uid}' style='margin:0 4px;flex-grow:1;'>
			${hideSSN(obj[col])}</span></div>`;
		} else {
			str = `<div style='display:flex;'><span id='${col}_${obj.uid}' style='margin:0 4px;flex-grow:1;'>
			${obj[col]}</span></div>`;
		}
	} else if (col == "class") {
		var className = obj.class;
		if (className == null || className === "null") {
			className = "";
			str = `<div class='access-dropdown' id='${col}_${obj.uid}'><div style='color:#808080'>
			None${className}</div><img class='sortingArrow' src='../Shared/icons/desc_black.svg'/>
			${makedivItem(className, filez['classes'], "class", "class")}</div>`;
		}
		else{
			str = `<div class='access-dropdown' id='${col}_${obj.uid}'><Div>${className}</Div>
			<img class='sortingArrow' src='../Shared/icons/desc_black.svg'/>
			${makedivItem(className, filez['classes'], "class", "class")}</div>`;
		}
	} else if (col == "examiner") {
		var examinerName = "";
		for(i = 0; i < filez['teachers'].length; i++){
			if(obj.examiner == filez['teachers'][i].uid){
				examinerName = filez['teachers'][i].name;
			}
		}
		if (obj.examiner == null || obj.examiner === "null" || obj.examiner < 0) {
			examinerName = "";
			str = `<div class='access-dropdown' id='${col}_${obj.uid}'><div style='color:#808080'>
			None</div><img class='sortingArrow' src='../Shared/icons/desc_black.svg'/>
			${makedivItemWithValue(examinerName, filez['teachers'], "name", "uid")}</div>`;
		}
		else{
			str = `<div class='access-dropdown' id='${col}_${obj.uid}'><Div '>${examinerName}</div>
			<img class='sortingArrow' src='../Shared/icons/desc_black.svg'/>
			${makedivItemWithValue(examinerName, filez['teachers'], "name", "uid")}</div>`;
		}
	} else if (col == "vers") {
		var versname = "";
		for (var i = 0; i < filez['courses'].length; i++) {
			if (obj.vers == filez['courses'][i]['vers']) {
				versname = filez['courses'][i]['versname'];
			}
		}

		if (obj.vers == null || obj.vers === "null") {
			str = `<div class='access-dropdown' id='${col}_${obj.uid}'><div style='color:#808080'>
			None</div><img class='sortingArrow' src='../Shared/icons/desc_black.svg'/>
			${makedivItem(versname, filez['courses'], "versname", "vers")}</select>`;
		}

		else{
			str = `<div class='access-dropdown' id='${col}_${obj.uid}'><div>"+versname+"</div>
			<img class='sortingArrow' src='../Shared/icons/desc_black.svg'/>
			${makedivItem(versname, filez['courses'], "versname", "vers")}</select>`;
		}
		for (var submission of filez['submissions']) {
            if (obj.uid === submission.uid) {
                str += `<img class='oldSubmissionIcon' title='View old version'
				src='../Shared/icons/DocumentDark.svg' onclick='showVersion(${submission.vers})'>`;
                break;
            }
        };
	} else if (col == "access") {
		if(obj.access == "W"){
			trueTeacher = "Teacher";
		}
		else if (obj.access == "R"){
			trueTeacher = "Student";
		}
		else {
			trueTeacher = "Student teacher";
		}
		str = `<div class='access-dropdown' id='${col}_${obj.uid}'><Div >${trueTeacher}</Div>
		<img class='sortingArrow' src='../Shared/icons/desc_black.svg'/>
		${makeDivItemStudent(obj.access, ["Teacher", "Student", "Student teacher"], ["W", "R", "ST"])}</select>`;
	} else if (col == "requestedpasswordchange") {

		if (parseFloat(obj.recent) < 1440) {
			str = "<div class='submit-button reset-pw new-user' style='display:block;margin:auto;float:none;'";
		} else {
			str = "<div class='submit-button reset-pw' style='display:block;margin:auto;float:none;'";
		}
		str += " onclick='if(confirm(\"Reset password for " + obj.username + "?\")) ";
		str += "resetPw(\"" + obj.uid + "\",\"" + obj.username + "\"); return false;'>";
		str += "Reset PW";
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
		if(optstr.includes('None') || optstr == "" || optstr == null){
			optstr = "";
			str += `<div><div class='access-dropdown'><span style='color:#808080'>None</span>
			<img class='sortingArrow' src='../Shared/icons/desc_black.svg'/></div></div>
			<div class='overSelect'></div></div><div class='checkboxes' id='grp${obj.uid}' >`;
		}
		else{
			str += `<div><div class='access-dropdown'><span>${optstr}
			</span><img class='sortingArrow' src='../Shared/icons/desc_black.svg'/>
			</div></div><div class='overSelect'></div></div><div class='checkboxes' id='grp${obj.uid}' >`;
		}
    str += `<label><input type='radio' name='groupradio${obj.uid}' checked id='g${obj.uid}' value='' />None</label>`;
		for (var i = 0; i < filez['groups'].length; i++) {
			var group = filez['groups'][i];
			if (tgroups.indexOf((group.groupkind + "_" + group.groupval)) > -1) {
				str += `<label><input type='radio' name='groupradio${obj.uid}' checked id='g${obj.uid}' 
				value='${group.groupkind}_${group.groupval}' />${group.groupval}</label>`;
			} else {
				str += `<label><input type='radio' name='groupradio${obj.uid}' id='g${obj.uid}' 
				value='${group.groupkind}_${group.groupval}' />${group.groupval}</label>`;
			}
		}
		str += '</div></div>';
	} else {
		str = `<div style='display:flex;'><div style='margin:0 4px;flex-grow:1;'>${celldata}</div></div>`;
	}
	return str;

}

function renderSortOptions(col, status, colname) {
	str = "";
	if (status == -1) {
		str += `<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"${col}\",0)'>${colname}</span>`;
	} else if (status == 0) {
		str += `<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"${col}\",1)'>
		${colname}<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>`;
	} else {
		str += `<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"${col}\",0)'>
		${colname}<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>`;
	}
	addToSortDropdown(colname, col);
	return str;
}

var sortColumns = [];
function addToSortDropdown(colname, col) {
	if (!sortColumns.includes(col)) {
		var str = "";
		str += `<div class='checkbox-dugga'><input name='sort' class='sortRadioBtn' type='radio' value=${col}>
		<label class='headerlabel'>${colname}</label></div>`;
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
		str = `<input type='hidden' id='popoveredit_uid' class='popoveredit' style='flex-grow:1;' value='${celldata.uid}'/>`;
		str += `<input type='text' id='popoveredit_${olumn}' class='popoveredit' style='flex-grow:1;width:auto;'
		value='${celldata[column]}' size=${celldata[column].toString().length}/>`;
	}
	return str;
}


function renderColumnFilter(col, status, colname) {
    str = "";
    if (colname == "User")
        return str;
    if (status) {
		str = "<div class='checkbox-dugga'>";
        str += `<input id=\"${colname}\" type='checkbox' name='checkbox' checked onclick='onToggleFilter(\"${col}\")'>
		<label class='headerlabel' for='${colname}'>${colname}</label>`;
        str += "</div>"
    } else {
            str = "<div class='checkbox-dugga'>";
            str += `<input id=\"${colname}\" type='checkbox' name='checkbox' onclick='onToggleFilter(\"${col}\")'>
			<label class='headerlabel' for='${colname}'>${colname}</label>`;
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
	var searchtermArray;
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
							searchterm = searchterm.replace(/\u00E4/, '&auml;');
							searchterm = searchterm.replace(/\u00F6/, '&ouml;');

							searchtermArray = searchterm.split(" ");
							if (searchterm.indexOf(" ") >= 0) {
								if (row["firstname"].toLocaleLowerCase().indexOf(searchtermArray[0]) != -1 && row["lastname"].toLocaleLowerCase().indexOf(searchtermArray[1]) != -1) return true;
							} else {
								if (caseIgnoreRow.indexOf(searchterm) != -1) return true;
							}
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

	var tabledata = {

		tblhead: {
			username: "User",
			firstname: "First name",
			lastname: "Last name",
			modified: "Last Modified",
			requestedpasswordchange: "Password"
		},
		tblbody: data['entries'],
		tblfoot: {}
	}
	var colOrder = ["username","firstname", "lastname", "modified", "requestedpasswordchange"]
	if (typeof myTable === "undefined") { // only create a table if none exists
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
		shouldReRender = true;
	}

	if (shouldReRender) {
		shouldReRender = false;
		myTable.renderTable();
	}
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

// onclick for group dropdown
function showCheckboxes(element) {
	var activeElementWasNull = false;
	var lastElement = activeElement;
	if (typeof(activeElement) === "undefined") { // first open dropdown
		activeElement = element;
		activeElementWasNull = true;
	}

	var checkboxes = activeElement.parentElement.lastChild;

	// save and close current dropdown
	if (!activeElementWasNull) updateAndCloseGroupDropdown(checkboxes);

	// open if none is open or none was open AND this element was not just closed
	if ((typeof(activeElement) === "undefined" || activeElementWasNull) && lastElement != element) {
		activeElement = element;
		checkboxes = activeElement.parentElement.lastChild;
		checkboxes.style.display = "block";
	}
}

//----------------------------------------------------------------------------------
// updateAndCloseGroupDropdown: updates group allegiances. Is run when a group dropdown is closed.
//----------------------------------------------------------------------------------

function updateAndCloseGroupDropdown(checkboxes){
	var str = "", readStr = "<span>";
	for (i = 0; i < checkboxes.childNodes.length; i++) {
		if (checkboxes.childNodes[i].childNodes[0].checked) {
			str += checkboxes.childNodes[i].childNodes[0].value;
			readStr += checkboxes.childNodes[i].childNodes[0].value.substr(3);
		}
	}
	shouldReRender = true;
	if (str != "") changeProperty(checkboxes.id.substr(3), "group", str);
	// if user unpresses all checkboxes it the student will now belong to no group
	else changeProperty(checkboxes.id.substr(3), "group", "None");

	readStr += "</span><img class='sortingArrow' src='../Shared/icons/desc_black.svg'>";
	activeElement.children[0].children[0].innerHTML = readStr;

	obj = {
		// This should really contain uid as well
		// but since the table should not write this
		// to the database, it might not be an issue
		// uid: <get-UID-For-Row-User>
		groups: str
	}
	updateDropdownInTable(checkboxes.parentElement, obj);

	// close dropdown
	checkboxes.style.display = "none";
	activeElement = undefined;
}

function updateDropdownInTable(element, obj) {
	// get row and column
	var cellelement = element.closest("td");
	var rowelement = element.closest("tr");
	let regex = new RegExp("^r([0-9]+)" + myTable.getDelimiter() + "([a-zA-Z0-9]+)" + myTable.getDelimiter() + "(.*)")
	let match = cellelement.id.match(regex);
	var rowno = match[1];
	var colname = match[3]

	var celldata = JSON.stringify(obj);
	myTable.updateDropdownValue(rowno, colname, celldata)
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
	if (typeof(activeElement) !== "undefined" && typeof(e.target) !== "undefined") {
		var checkboxes = activeElement.parentElement.lastChild;
		if (!checkboxes.contains(e.target) && e.target.parentElement != activeElement) {
			updateAndCloseGroupDropdown(checkboxes);
		}
	}

	// if the target of the click is outside of the current cell being edited -> close the cell editing interface
 	if (!document.getElementById('editpopover').contains(e.target)) {
 		clearUpdateCellInternal();
 	}
}

//----------------------------------------------------------------------------------
// Eventlistener for handling dropdowns
//----------------------------------------------------------------------------------

document.addEventListener('click', function(e){
	if (e.target.parentElement === null)
		return;
	if(e.target.classList.contains('access-dropdown') || e.target.parentElement.classList.contains('access-dropdown')){
		var dropdown = e.target.closest('.access-dropdown').querySelector('.access-dropdown-content');
		var arrow = e.target.closest('.access-dropdown').querySelector('img');
		if(activeDropdown === undefined){ // no dropdown is set to be open (active)
			if(window.getComputedStyle(dropdown, null).getPropertyValue("display") === "none"){ //clicked-dropdown content is hidden
				dropdown.style.display = "block";
				activeDropdown = dropdown;
				activeArrow = arrow;
				openArrow(activeDropdown.parentElement.parentElement);
			}else{	//clicked-dropdown content is not hidden --- probably impossible ---
				dropdown.style.display = "none";
				activeDropdown = undefined;
			}
		}else{ //a dropdown is active
			if(e.target != activeDropdown){
				if(activeDropdown.style.display === "none"){  //active dropdown is hidden --- probably impossible ---
					activeDropdown.style.display = "block";
					activeDropdown = e.target.closest('.access-dropdown').querySelector('.access-dropdown-content');
				}else{ //active dropdown is visible
					if(activeDropdown != dropdown){ //clicked new dropdown --> close old, open new
						activeDropdown.style.display = "none";
						e.target.closest('.access-dropdown').querySelector('.access-dropdown-content').style.display = "block";
						activeDropdown = e.target.closest('.access-dropdown').querySelector('.access-dropdown-content')
						openArrow(activeDropdown.parentElement.parentElement);
					}else{ //clicked open (active) dropdown again --> close
						activeDropdown.style.display = "none";
						activeDropdown = undefined;
					}
				}
			}
			closeArrow(activeArrow);
			activeArrow = e.target.closest('.access-dropdown').querySelector('img');
		}
	}else{ // clicked somewhere else on the screen
		if(activeDropdown){ // if dropdown is open --> close it
			activeDropdown.style.display = "none";
		}
		activeDropdown = undefined;
		if(activeArrow)
			closeArrow(activeArrow);
		activeArrow = undefined;
	}
});

//----------------------------------------------------------------------------------
// Keyboard shortcuts - Edit functionality in the accessed table
//----------------------------------------------------------------------------------
document.addEventListener("keyup", function(event)
{
  if (event.keyCode === 13)
  {
    // If user presses key: Enter (13)
    // if group dropdown is open, update and close it
    if (typeof(activeElement) !== "undefined")
    	updateAndCloseGroupDropdown(activeElement.parentElement.lastChild);
    // update current cell
    updateCellInternal();
  } else if (event.keyCode === 27) {
    // If user presses key: Escape (27)
    clearUpdateCellInternal();
  }
});

//----------------------------------------------------------------------------------
// filterAccess - Filter by teachers/students (write access/read access)
//----------------------------------------------------------------------------------
function filterAccess() {
	toggleTeachers = document.getElementById("filterAccess1");

	accessFilter = "";

	if (toggleTeachers.checked) {
		accessFilter += "W";
	}

	// Save to local storage to remember the filtering. Add the course ID to key to allow for different filterings for each course
	localStorage.setItem("accessFilter"+querystring['courseid'], accessFilter);
	myTable.reRender();
}

//----------------------------------------------------------------------------------
// createCheckboxes - Create checkboxes for filtering teachers/students
//----------------------------------------------------------------------------------
function createCheckboxes() {

	var labels = ["Show teachers"/*, "Show students", "Show student teachers"*/];
	str = "";
	for (i = 0; i < labels.length; i++) {
		str += "<div class='checkbox-dugga checkmoment'>";
		str += `<input id='filterAccess${(i+1)}' type='checkbox' value='${(i+1)}' onchange='filterAccess()' `;
		if (i == 0 && accessFilter.indexOf("W") > -1) str += "checked";
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
	var col = myTable.getSortcolumn();
	var status = myTable.getSortkind(); // Get if the sort arrow is up or down.

		if(status==1){
				var tempA = a;
				var tempB = b;

		}else{
				var tempA = b;
				var tempB = a;
		}

		if(col=="firstname"||col=="lastname"||col=="class"||col=="examiner"||col=="access"){
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
					tempA = tempA.examiner;
					tempB = tempB.examiner;
					if(tempA==null) return -1;
					if(tempB==null) return 1;
					for (var i =0; i < filez['teachers'].length; i++) {
						if (tempA == filez['teachers'][i].uid) {
							tempA = filez['teachers'][i].name;
						}
						if (tempB == filez['teachers'][i].uid) {
							tempB = filez['teachers'][i].name;
						}
					}
					if (typeof tempA === "number") {
						tempA = "";
					}
					if (typeof tempB === "number") {
						tempB = "";
					}
				}else if(col=="access") {
					tempA=tempA.access;
					tempB=tempB.access;
					if(tempA==null) return -1;
					if(tempB==null) return 1;
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

}

function openArrow(element){
	var child = $(element).children(".access-dropdown");
	var arrow = $(child).children("img");
	$(arrow).css({
		"-webkit-transform": "rotate(180deg)",
		"-moz-transform": "rotate(180deg)",
		"transform": "rotate(180deg)"
	});
}

function closeArrow(arrowElement){
	$(arrowElement).css({
		"-webkit-transform": "rotate(0deg)",
		"-moz-transform": "rotate(0deg)",
		"transform": "rotate(0deg)"
	});
}
