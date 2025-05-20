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
var buttonPressed = false;

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

	// creates the toggleAllButton
	var str = "<div class='checkbox-dugga'>";
	str += "<button id='toggleAllButton' class='dropdown-button' onclick='toggleAllCheckboxes(this)'>Toggle all</button>";
	str += "</div>"
	document.getElementById("dropdownc").innerHTML += str;

	// gets selections from database (for filtering options)
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
	document.querySelector('#dropdownSearch').style.display = 'block';
	document.querySelector('#dropdowns').style.display = 'none';
	document.querySelector('#dropdownc').style.display = 'none';
}

//stops displaying the dropdown when removing cursor from search bar
function leaveSearch() {

}

// displays dropdown for the filter-button
function pressFilter() {
	if (buttonPressed == false){
		buttonPressed = true;	
		
		document.getElementById("dropdownc").style.display="block";
		document.getElementById("dropdowns").style.display="none";
	}
}

// stops displaying dropdown for the filter-button
function leaveFilter() {
	if (buttonPressed == true){
		buttonPressed = false;
			document.getElementById("dropdownc").style.display="none";
	}
	document.querySelector('#dropdownSearch').style.display = 'none';
}

function hoverc() {
	document.querySelector('#dropdowns').style.display = 'none';
	document.querySelector('#dropdownc').style.display = 'block';
}

function hovers() {
	document.querySelector('#dropdowns').style.display = 'block';
	document.querySelector('#dropdownc').style.display = 'none';
}

function leavec() {
	document.querySelector('#dropdownc').style.display = 'none';
}

function leaves() {
		document.querySelector('#dropdowns').style.display = 'none';
}

function showEditUserPopup(id) {
	document.querySelector('#editUser').style.display = 'flex';
}

function showCreateUserPopup() {
	document.querySelector('#createUser').style.display = 'flex';
}

function showAddUserPopup(id) {
	document.querySelector('#addUser').style.display = 'flex';
	loadUsersToDropdown(id);
}

function showRemoveUserPopup(id) {
	document.querySelector('#removeUser').style.display = 'flex';
	loadUsersToDropdown(id);
}

function showCreateClassPopup() {
	document.querySelector('#createClass').style.display = 'flex';
}

function showCreateUserPopup() {
	document.querySelector('#createUser').style.display = 'flex';
}

function showCreateClassPopup() {
	document.querySelector('#createClass').style.display = 'flex';
}

function hideCreateUserPopup() {
	document.querySelector('#createUser').style.display = 'none';
}

function hideCreateClassPopup() {
	document.querySelector('#createClass').style.display = 'none';
}

function hideEditUserPopup(id) {
	document.querySelector('#editUser').style.display = 'none';
}

function hideAddUserPopup() {
	document.querySelector('#addUser').style.display = 'none';
}

function hideRemoveUserPopup() {
	document.querySelector('#removeUser').style.display = 'none';
}

//----------------------------------------------------------------------------
//-------------==========########## Commands ##########==========-------------
//----------------------------------------------------------------------------
function addUserToCourse() {
	let input = document.getElementById('addUsername2').value;
	let term = document.querySelector("#addTerm2").value;
	if(input && term) {
		$.ajax({
			type: 'POST',
			url: 'accessedservice.php',
			data: {
				opt: 'RETRIEVE',
				action: 'USER',
				username: input
			},
			success: function(response) {
				userJson = response.substring(0, response.indexOf('{"entries":'));
				let responseData = JSON.parse(userJson);
				let uid = responseData.user[0].uid;
				AJAXService("USERTOTABLE", {
					courseid: querystring['courseid'],
					uid: uid,
					term: term,
					coursevers: querystring['coursevers'],
					action: 'COURSE'
				}, "ACCESS");
			},
			error: function(xhr, status, error) {
				console.error("Error", error);
			}
		});
		updateCourseUsers(hideAddUserPopup); // Sending function as parameter
	}
}
function removeUserFromCourse() {
	let input = document.getElementById('addUsername3').value;
	if(input) {
		$.ajax({
			type: 'POST',
			url: 'accessedservice.php',
			data: {
				opt: 'RETRIEVE',
				action: 'USER',
				username: input
			},
			success: function(response) {
				userJson = response.substring(0, response.indexOf('{"entries":'));
				let responseData = JSON.parse(userJson);
				let uid = responseData.user[0].uid;
				AJAXService("DELETE", {
					courseid: querystring['courseid'],
					uid: uid,
					action: 'COURSE'
				}, "ACCESS");
			},
			error: function(xhr, status, error) {
				console.error("Error", error);
			}
		});
		updateCourseUsers(hideRemoveUserPopup); // Sending function as parameter
	}
}

// A small timer ensures a server response from the AJAX call that adds/removes a user
// Without the timer the page may not update correctly
const updateCourseUsers = function(removePopup) {
	setTimeout(() => {
		removePopup(); // Reference to the function that was sent as parameter
		location.reload(true);
	}, 300);
}

function addSingleUser() {

	const newUser = new Array();
	//newUser.push(document.querySelector("#addSsn").value);	
	newUser.push("");
	newUser.push(document.querySelector("#addFirstname").value);
	newUser.push(document.querySelector("#addLastname").value);
	newUser.push(document.querySelector("#addEmail").value);
	//newUser.push(document.querySelector("#addCid").value);
	newUser.push("");
	newUser.push(document.querySelector("#addTerm").value);
	//newUser.push(document.querySelector("#addPid").value);
	newUser.push("");

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
		toast("error",verifyString, 7);
		return false;
	}

	// Verify last name
	if(verifyString = validateName(input[2])) {		// Returns null if there is no error
		toast("error",verifyString, 7);
		return false;
	}

	// Verify email
	if(verifyString = validateEmail(input[3])) {	// Returns null if there is no error
		toast("error",verifyString, 7);
		return false;
	}

	// Verify term
	if(verifyString = validateTerm(input[5])) {	// Returns null if there is no error
		toast("error",verifyString, 7);
		return false;
	}

	return true;
}

//---------------------------------------------------------------------------------------------------
// validateName(name)
// Returns null if there are NO errors, otherwise a descripitve error message as string.
//---------------------------------------------------------------------------------------------------
function validateName(name) {
	const length = name.length;
	if(length < 2)	return 'Name is too short\nMinimum two characters';	// Too short
	if(length > 50)	return 'Name is too long\nMaximum 50 characters';	// Too long
	if(name[0] !== name[0].toLocaleUpperCase()) return 'Name must start with a capital letter';
	const formatTest = /^[a-zA-ZäöåÄÖÅ]+$/;		// Expected charachters
	if(!formatTest.test(name))
		return 'Name contains illegal characters, can only contain A-Ö';

	return null;	// The provided name is alright
}

function tooltipFirst() {
	
	let fnameInputBox = document.getElementById('addFirstname');
	let fname = document.getElementById('addFirstname').value;
	let error = validateName(fname);

	if(error && fname.length > 0) {		// Error, show tooltip
		document.getElementById('tooltipFirst').innerHTML = error;
		document.getElementById('tooltipFirst').style.display = 'block';
		fnameInputBox.style.backgroundColor = 'var(--color-red)';
	} else {	// No error, hide tooltip
		document.getElementById('tooltipFirst').style.display = 'none';
		fnameInputBox.style.backgroundColor = 'var(--color-background)';
	}
}

function tooltipLast() {

	let lnameInputBox = document.getElementById('addLastname');
	let lname = document.getElementById('addLastname').value;
	let error = validateName(lname);

	if(error && lname.length > 0) {		// Error, show tooltip
		document.getElementById('tooltipLast').innerHTML = error;
		document.getElementById('tooltipLast').style.display = 'block';
		lnameInputBox.style.backgroundColor = 'var(--color-red)';
	} else {	// No error, hide tooltip
		document.getElementById('tooltipLast').style.display = 'none';
		lnameInputBox.style.backgroundColor = 'var(--color-background)';
	}
}

//---------------------------------------------------------------------------------------------------
// validateEmail(email)
// Returns null if there are NO errors, otherwise a descripitve error message as string.
//---------------------------------------------------------------------------------------------------
function validateEmail(email) {
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

function tooltipEmail() {
	
	let emailInputBox = document.getElementById('addEmail');
	let email = document.getElementById('addEmail').value;
	let error = validateEmail(email);

	if(error && email.length > 0) {		// Error, show tooltip
		document.getElementById('tooltipEmail').innerHTML = error;
		document.getElementById('tooltipEmail').style.display = 'block';
		emailInputBox.style.backgroundColor = 'var(--color-red)';
	} else {	// No error, hide tooltip
		document.getElementById('tooltipEmail').style.display = 'none';
		emailInputBox.style.backgroundColor = 'var(--color-background)';
	}
}

//---------------------------------------------------------------------------------------------------
// validateTerm(term)
// Returns null if there are NO errors, otherwise a descripitve error message as string.
//---------------------------------------------------------------------------------------------------

function validateTerm(term) {
	if(term.match(/^(HT-|VT-)\d{2}$/gm) == null ) return 'The term must be in format "VT-10" '; //must follow "HT/VT-XX" format
	return null; //the provided term is correct
}

function tooltipTerm(element) {
	let error = validateTerm(element.value);
	let termInputBox = element;
	let term = element.value;

	if(error && term.length > 0) {	// Error, show tooltip
		document.getElementById('tooltipTerm').innerHTML = error;
		document.getElementById('tooltipTerm').style.display = 'block';
		termInputBox.style.backgroundColor = 'var(--color-red)';
	} else {	// No error, hide tooltip
		document.getElementById('tooltipTerm').style.display = 'none';
		termInputBox.style.backgroundColor = 'var(--color-background)';
	}
}

var inputVerified;

function addClass() {
	inputVerified = true;
	document.getElementById("classErrorText").innerHTML = "";
	var newClass = new Array();
	newClass.push(verifyClassInput(document.getElementById("addClass"), null, ""));
	newClass.push(verifyClassInput(document.getElementById("addResponsible"), null, ""));
	newClass.push(verifyClassInput(document.getElementById("addClassname"), null, ""));
	newClass.push(verifyClassInput(document.getElementById("addRegcode"), /^[0-9]*$/, "number"));
	newClass.push(verifyClassInput(document.getElementById("addClasscode"), null, ""));
	newClass.push(verifyClassInput(document.getElementById("addHp"), /^[0-9.]*$/, "(decimal) number"));
	newClass.push(verifyClassInput(document.getElementById("addTempo"), /^[0-9]*$/, "number"));
	newClass.push(verifyClassInput(document.getElementById("addHpProgress"), /^[0-9.]*$/, "(decimal) number"));

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
	} else if (col == "edit") {

		if (parseFloat(obj.recent) < 1440) {
			str = "<div class= 'new-user' style='display:block;margin:auto;float:none;text-align:center;'";
		} else {
			str = "<div style='display:block;margin:auto;float:none;text-align:center;'";
		}
		// When implementing onClick, place it here.
		str += "'>";
		str += "<img alt='settings icon' tabindex='0' class='whiteIcon' style='align-item: center;cursor: pointer;' src='../Shared/icons/Cogwheel.svg' 'title='Edit Server Settings' onclick='showEditUserPopup()'>";
		str += "</div>";
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
		str += `<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"${col}\",0); applyEvenOddClasses();'>${colname}</span>`;
	} else if (status == 0) {
		str += `<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"${col}\",1); applyEvenOddClasses();'>
		${colname}<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>`;
	} else {
		str += `<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"${col}\",0); applyEvenOddClasses();'>
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
	if (accessFilter.indexOf(obj.access) > -2) {
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
			requestedpasswordchange: "Password",
			edit: "Edit"
		},
		tblbody: data['entries'],
		tblfoot: {}
	}
	var colOrder = ["username","firstname", "lastname", "modified", "requestedpasswordchange", "edit"]
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
		applyEvenOddClasses();
	}
}

//excuted onclick button for quick searching in table
function keyUpSearch() {
		document.getElementById('searchinput').addEventListener('keyup',function(){
		var val = this.value.trim().replace(/ +/g, ' ').toLowerCase();

		document.querySelectorAll('#accesstable_body tr').forEach(function(row) {
			var text = row.textContent.replace(/\s+/g, ' ').toLowerCase();
			row.style.display = !~text.indexOf(val) ? 'none' : '';
		});

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

document.addEventListener('mouseover',function(e){
	FABMouseOver(e);
});

document.addEventListener('mouseout',function(e){
	FABMouseOut(e);
});

document.addEventListener('mousedown',function(e){
	mouseDown(e);
	if (e.button == 0) {
		FABDown(e);
	}
});

document.addEventListener('mouseup', function(e) {
	mouseUp(e);
	if (e.button == 0) {
		FABUp(e);
	}
});

document.addEventListener('touchstart',function(e){
	if (e.target.closest(".fixed-action-button") !== null && e.target.closest(".fab-btn-list") === null) {
        e.preventDefault();
    }
	mouseDown(e);
	TouchFABDown(e);
});

document.addEventListener('touchend',function(e){
	if (e.target.closest(".fixed-action-button") !== null && e.target.closest(".fab-btn-list") === null) {
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
document.addEventListener('keyup', function(event)
{
	if (event.key === 'Enter') {
		// if group dropdown is open, update and close it
		if (typeof(activeElement) !== "undefined") {
			updateAndCloseGroupDropdown(activeElement.parentElement.lastChild);
		}
		// update current cell
		updateCellInternal();
	} 
	if (event.key === 'Escape') {
		let link = document.getElementById("upIcon").href;
		clearUpdateCellInternal();
		let popupIsOpen = checkIfPopupIsOpen();
		if (!popupIsOpen) {
			window.location.assign(link);
		} else {
			return;
		}
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
	var child =  element.querySelector(".access-dropdown");
	var arrow = child.querySelector("img");

	arrow.style.transform ="rotate(180deg)";
	arrow.style.webkitTransform = "rotate(180deg)";
	arrow.style.mozTransform = "rotate(180deg)";
}

function closeArrow(arrowElement){
	arrowElement.style.transform ="rotate(0deg)";
	arrowElement.style.webkitTransform = "rotate(0deg)";
	arrowElement.style.mozTransform = "rotate(0deg)";
}
function loadUsersToDropdown(id) {
	$.ajax({
		url: 'accessedservice.php',
		type: 'POST',
		data: { opt: 'RETRIEVE', action: 'USERS'},
		success: function(response) {
			usersJson = response.substring(0, response.indexOf('{"entries":'));
			let responseData = JSON.parse(usersJson);
			let filteredUsers = [];
			let length = responseData.users.length;
			for (let i = 0; i < length; i++) {
				let user = responseData.users[i];
				filteredUsers.push(user);
			}
			let dropdownList = document.getElementById(id);
			filteredUsers.forEach(user => {
				let option = document.createElement("option");
				option.value = user.username;
				dropdownList.appendChild(option);
			});
		},
		error: function(xhr, status, error) {
			console.error(error);
		}
	});

}
//Insert all new Popups/Modules in allPopups. Else ESC button will override
function checkIfPopupIsOpen() {
	let allPopups = [
		"#addUser",
		"#createUser",
		"#removeUser",
		"#editUser"
	];
	let div = document.getElementById("toastContainer");
	if (div.children.length > 0) {
		return true;
	}
	for (let popup of allPopups) {
		if (popup.style.display !== "none") {
			return true;
		}
	}
	return false;
}
