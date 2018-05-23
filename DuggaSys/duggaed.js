/********************************************************************************

   Globals

 *********************************************************************************/
var sessionkind = 0;
var querystring = parseGet();
var filez;
var variant = [];
var submissionRow = 0;
var duggaTable;
var variantTable;
var str;
var globalData;
var globalVariant;
var itemToDelete;
var typeOfItem;
var duggaPages;
var isClickedElementBox = false;
var searchterm = "";


AJAXService("GET", { cid: querystring['cid'], coursevers: querystring['coursevers'] }, "DUGGA");

$(function () {
	$("#release").datepicker({
		dateFormat: "yy-mm-dd",
		minDate: 0,
		onSelect: function (date) {
			var newDate = $('#release').datepicker('getDate');
			$('#deadline').datepicker("option", "minDate", newDate);

		}
	});
	$("#deadline2").datepicker({
		dateFormat: "yy-mm-dd",
		minDate: 0,
		onSelect: function (date) {
			var newDate = $('#release').datepicker('getDate');
			$('#deadline').datepicker("option", "minDate", newDate);

		}
	});
	$("#deadline3").datepicker({
		dateFormat: "yy-mm-dd",
		minDate: 0,
		onSelect: function (date) {
			var newDate = $('#release').datepicker('getDate');
			$('#deadline').datepicker("option", "minDate", newDate);

		}
	});
	$('#deadline').datepicker({
		dateFormat: "yy-mm-dd"
	});
	$('#qstart').datepicker({
		dateFormat: "yy-mm-dd"
	});
});

// Needed for button clicks
$(document).ready(function () {

	addVariantSubmissionRow();

	$(document).on('click', '.delButton', function () {
		if ($(this).parent().parent().children().length > 1) {
			$(this).parent().remove();
		}
		return false;
	});

	$('#addfieldname').click(function () {
		addVariantSubmissionRow();
	});

	$('#createjson').click(function () {
		$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));
	});
});

$(window).load(function () {
	//There is an issue with using this code, it generates errors that stop execution
	$(window).keyup(function (event) {
		if (event.keyCode == 27) {
			closeWindows();
			resetNameValidation();
			showDuggaSaveButton();
		}else if (event.keyCode == 13){
			//Remember that keycode 13 = enter button
			var saveButtonDisplay = ($('#saveDugga').css('display'));
			var editSectionDisplay = ($('#editDugga').css('display'));
			var submitButtonDisplay = ($('#submitDugga').css('display'));
			if (saveButtonDisplay == 'block' && editSectionDisplay == 'flex' && isNameValid()) {
				updateDugga();
			} else if (submitButtonDisplay == 'block' && editSectionDisplay == 'flex' && isNameValid()) {
				createDugga();
			}
			document.activeElement.blur();
		}
	});
});

function clearEditForm() {
	$('#name').val("New dugga");
	$('#name').attr('placeholder','Empty dugga');
	$('#qstart').val("");
	$('#qstart').attr('placeholder', 'YYYY-MM-DD');
	$('#release').val("");
	$('#release').attr('placeholder', 'YYYY-MM-DD');
	$('#deadline').val("");
	$('#deadline').attr('placeholder', 'YYYY-MM-DD');
}

// Detects clicks
$(document).mousedown(function (e) {
	var box = $(e.target);
	if (box[0].classList.contains("loginBox")) { // is the clicked element a loginbox?
		isClickedElementBox = true;
	} else if ((findAncestor(box[0], "loginBox") != null) // or is it inside a loginbox?
		&& (findAncestor(box[0], "loginBox").classList.contains("loginBox"))) {
		isClickedElementBox = true;
	} else {
		isClickedElementBox = false;
	}
});

$(document).mouseup(function (e) {
	// Click outside the loginBox
	if ($('.loginBox').is(':visible') && !$('.loginBox').is(e.target) // if the target of the click isn't the container...
		&& $('.loginBox').has(e.target).length === 0 // ... nor a descendant of the container
		&& (!isClickedElementBox)) // or if we have clicked inside box and dragged it outside and released it
	{
		closeWindows();
	}
});

function resetNameValidation() {
	var nme = document.getElementById("name");
	$('#tooltipTxt').fadeOut();
	nme.value = "";
	nme.style.backgroundColor = "#fff";
}

// DUGGA FUNCTIONS start
function newDugga() {
	$("#editDuggaTitle").html("New dugga");
	clearEditForm();

	// Set submitDugga button to disabled
	$('#submitDugga').prop("disabled", true);

	//----------------------------------------------------
	// Set Autograde
	//----------------------------------------------------
	var str = "";
	if (autograde == 0) str += "<option selected='selected' value='0'>Off</option>"
	else str += "<option value='0'>Hidden</option>";
	if (autograde == 1) str += "<option selected='selected' value='1'>On</option>"
	else str += "<option value='1'>Public</option>";
	$("#autograde").html(str);

	str = "";
	if (gradesys == 1) str += "<option selected='selected' value='1'>U-G-VG</option>"
	else str += "<option value='1'>U-G-VG</option>";
	if (gradesys == 2) str += "<option selected='selected' value='2'>U-G</option>"
	else str += "<option value='2'>U-G</option>";
	if (gradesys == 3) str += "<option selected='selected' value='3'>U-3-4-5</option>"
	else str += "<option value='3'>U-3-4-5</option>";
	$("#gradesys").html(str);

	str = "";
	for (var j = 0; j < filez.length; j++) {
		filen = filez[j];
		if (filen != ".." && filen != ".") {
			if (template == filen) str += "<option selected='selected' value='" + filen + "'>" + filen + "</option>"
			else str += "<option value='" + filen + "'>" + filen + "</option>"
		}
	}
	$("#template").html(str);
	$("#editDugga").css("display", "flex");
	//$("#overlay").css("display","block");
}

function createDugga() {
	var did = $("#did").val();
	var nme = $("#name").val();
	var autograde = $("#autograde").val();
	var qstart = $("#qstart").val();
	var gradesys = $("#gradesys").val();
	var template = $("#template").val();
	var release = $("#release").val();
	var deadline3 = $("#deadline3").val();
	var deadline2 = $("#deadline2").val();
	var deadline = $("#deadline").val();
	var cid = querystring['cid'];
	var coursevers = querystring['coursevers'];
	$("#editDugga").css("display", "none");
	//$("#overlay").css("display","none");

	//autograde, gradesystem, qname, quizFile, release, deadline, creator, vers
	AJAXService("ADDUGGA", { cid: cid, autograde: autograde, gradesys: gradesys, nme: nme, template: template, release: release, deadline: deadline, deadline2: deadline2, deadline3: deadline3, coursevers: coursevers, qstart: qstart}, "DUGGA");
}

function selectDugga(qid) {

	clearEditForm();

	// Ensures that name validation is not set at start when selecting a dugga
	resetNameValidation();
	$('#saveDugga').prop("disabled", false);

	AJAXService("GET", { cid: querystring['cid'], coursevers: querystring['coursevers'], qid: this.qid }, "GETQUIZ");

	document.getElementById("editDuggaTitle").innerHTML = "Edit dugga";
	$("#editDugga").css("display", "flex");
	//$("#overlay").css("display","block");
	$("#did").val(qid); // Set Variant ID
	$("#name").val(name); // Set Dugga name
	$("#qstart").val(qstart); // Set Start date name
	$("#deadline").val(deadline); // Set Deadline date name
	$("#release").val(release); // Set Release date name

	//----------------------------------------------------
	// Set Autograde
	//----------------------------------------------------
	var str = "";
	if (autograde == 0) str += "<option selected='selected' value='0'>Off</option>"
	else str += "<option value='0'>Hidden</option>";
	if (autograde == 1) str += "<option selected='selected' value='1'>On</option>"
	else str += "<option value='1'>Public</option>";
	$("#autograde").html(str);

	str = "";
	if (gradesys == 1) str += "<option selected='selected' value='1'>U-G-VG</option>"
	else str += "<option value='1'>U-G-VG</option>";
	if (gradesys == 2) str += "<option selected='selected' value='2'>U-G</option>"
	else str += "<option value='2'>U-G</option>";
	if (gradesys == 3) str += "<option selected='selected' value='3'>U-3-4-5</option>"
	else str += "<option value='3'>U-3-4-5</option>";
	$("#gradesys").html(str);

	str = "";
	for (var j = 0; j < filez.length; j++) {
		filen = filez[j];
		if (filen != ".." && filen != ".") {
			if (template == filen) str += "<option selected='selected' value='" + filen + "'>" + filen + "</option>"
			else str += "<option value='" + filen + "'>" + filen + "</option>"
		}
	}
	$("#template").html(str);
}

function updateDugga() {
	var did = $("#did").val();
	var nme = $("#name").val();
	var autograde = $("#autograde").val();
	var gradesys = $("#gradesys").val();
	var template = $("#template").val();
	var qstart = $("#qstart").val();
	var deadline = $("#deadline").val();
	var release = $("#release").val();
	var jsondeadline = "{'deadline1':'"+$("#deadline").val()+"', 'comment1':'"+$("#deadlinecomments1").val()+"', 'deadline2':'"+$("#deadline2").val()+"', 'comment2':'"+$("#deadlinecomments2").val()+"', 'deadline3':'"+$("#deadline3").val()+"', 'comment3':'"+$("#deadlinecomments3").val()+"'}";

	closeEditDugga();

	AJAXService("SAVDUGGA", { cid: querystring['cid'], qid: did, nme: nme, autograde: autograde, gradesys: gradesys, template: template, qstart: qstart, deadline: deadline, jsondeadline: jsondeadline, release: release, coursevers: querystring['coursevers'] }, "DUGGA");
}

function deleteDugga(did) {
	AJAXService("DELDU", { cid: querystring['cid'], qid: did, coursevers: querystring['coursevers'] }, "DUGGA");
	$("#editDugga").css("display", "none");
}

function isNameValid(){
	var nme = document.getElementById("name");

	if (nme.value.match(/^[A-Za-zÅÄÖåäö\s\d(),.]+$/)) {
		return true;
	}
	return false;
}

// Checks if the title name includes any invalid characters
function validateDuggaName() {
	var retValue = false;
	var nme = document.getElementById("name");

	if (nme.value.match(/^[A-Za-zÅÄÖåäö\s\d()]+$/)) {
		$('#tooltipTxt').fadeOut();
		$('#saveDugga').removeAttr('disabled');
		$('#submitDugga').removeAttr('disabled');
		nme.style.backgroundColor = "#fff";
		retValue = true;
	} else {
		$('#tooltipTxt').fadeIn();
		$('#submitDugga').attr('disabled', 'disabled');
		$('#saveDugga').attr('disabled', 'disabled');
		nme.style.backgroundColor = "#f57";
	}
	return retValue;
}
// DUGGA FUNCTIONS end

// VARIANT FUNCTIONS start
function newVariant() {
	showVariantDisableButton();
	$("#submitVariant").css("display", "block");
	$("#saveVariant").css("display", "none");
	document.getElementById('variantSearch').value = '';
	document.getElementById('filelink').placeholder = 'File link';
	document.getElementById('extraparam').value = '';
	document.getElementById('extraparam').placeholder = 'Extra dugga parameters in valid JSON';
	document.getElementById('variantparameterText').value = '';
	document.getElementById('variantparameterText').placeholder = 'Undefied JSON parameter';
	document.getElementById('variantanswerText').value = '';
	document.getElementById('variantanswerText').placeholder = 'Undefied JSON answer';
}

function createVariant() {
	var qid = $("#did").val();
	var answer = $("#variantanswerText").val();
	var parameter = $("#variantparameterText").val();
	var disabled;
	if ($('#disableVariant').is(':visible')) {
		disabled = '0';
	} else if ($('#enableVariant').is(':visible')) {
		disabled = '1';
	}

	AJAXService("ADDVARI", { cid: querystring['cid'], qid: qid, disabled: disabled, variantanswer: answer, parameter: parameter, coursevers: querystring['coursevers'] }, "DUGGA");
}

function selectVariant(vid) {
	var target_variant;
	globalData['entries'].forEach(element => {
		var tempVariant = element['variants'];
		tempVariant.forEach(variant => {
			if (variant['vid'] == vid) {
				target_variant = variant;
			}
		});
	});

	$("#saveVariant").css("display", "block");

	$("#vid").val(target_variant['vid']); // Set Variant ID
	$("#variantparameterText").val(target_variant['param']); // Set Variant ID
	$("#variantanswerText").val(target_variant['variantanswer']); // Set Variant ID

	var disabled = (target_variant['disabled']);
	if (disabled == '0') {
		showVariantDisableButton();
	}
	else if (disabled == '1') {
		showVariantEnableButton();
	}
}

function updateVariant() {
	var vid = $("#vid").val();
	var answer = $("#variantanswerText").val();
	var parameter = $("#variantparameterText").val();
	var disabled;
	if ($('#disableVariant').is(':visible')) {
		disabled = '0';
	} else if ($('#enableVariant').is(':visible')) {
		disabled = '1';
	}
	AJAXService("SAVVARI", { cid: querystring['cid'], vid: vid, disabled: disabled, variantanswer: answer, parameter: parameter, coursevers: querystring['coursevers'] }, "DUGGA");
}

function deleteVariant(vid) {
	AJAXService("DELVARI", { cid: querystring['cid'], vid: vid, coursevers: querystring['coursevers'] }, "DUGGA");
}

// Update the title of the variant editor to refer to the dugga that "owns" the variants
function updateVariantTitle(number) {
	document.getElementById("editVariantTitle").innerHTML = "Variants for: " + globalData['entries'][number].qname;
}

// Opens the variant editor.
function showVariantEditor() {
	$("#editVariant").css("display", "flex"); //Display variant-window
}

// Adds a submission row
function addVariantSubmissionRow() {
	$('#submissions').append("<div style='width:100%;display:flex;flex-wrap:wrap;flex-direction:row;'>" +
		"<select name='s_type' id='submissionType' style='width:65px;'>" +
		"<option value='pdf'>PDF</option>" +
		"<option value='zip'>Zip</option>" +
		"<option value='link'>Link</option>" +
		"<option value='text'>Text</option>" +
		"</select>" +
		"<input type='text' name='s_fieldname' id='fieldname" + submissionRow + "' placeholder='Submission name' style='flex:1;margin-left:5px;margin-bottom:3px;height:24.8px;' onkeydown='if (event.keyCode == 13) return false;'/>" +
		"<input type='text' name='s_instruction' id='instruction" + submissionRow + "' placeholder='Upload instruction' style='flex:3;margin-left:5px;margin-bottom:3px;height:24.8px;' onkeydown='if (event.keyCode == 13) return false;'/>" +
		"<input type='button' class='delButton submit-button' value='-' style='width:32px;margin:0px 0px 3px 5px;'></input><br/>" +
		"</div>");
	submissionRow++;
}

function createJSONString(formData) {
	var submission_types = [];
	var type, fieldname, instruction;

	formData.forEach(element => {
		if (element.name == "s_type") type = element;
		if (element.name == "s_fieldname") fieldname = element;
		if (element.name == "s_instruction") instruction = element;

		if (type && fieldname && instruction) {
			submission_types.push({
				"type":type.value,
				"fieldname":fieldname.value,
				"instruction":instruction.value
			});

			type = undefined;
			fieldname = undefined;
			instruction = undefined;
		}
	});


	return JSON.stringify({
		"type":formData[0].value,
		"filelink":formData[1].value,
		"extraparam":$('#extraparam').val(),
		"submissions":submission_types
	});
}

/*
	This function marks the selected variant when editing by changing the
	background color of the table row.
*/
function markSelectedVariant(el) {
	var activeTableRow = findAncestor(el, 'TR', 'elName');
	removeVariantTableHighlights();
	activeTableRow.style.backgroundColor = '#fbcd47';
}

function removeVariantTableHighlights() {
	var allRows = [];
	$('#variant_body').find('tr').each(function() {
		allRows.push(this);
	});
	for(var row of allRows) {
		row.removeAttribute('style'); // Remove background color from previously marked rows.
	}
}

/*
	Change the styling of variantsTable. The variants list will be scrollable, and its
	size will change depending on the size of the login box, where it is placed.
*/

// VARIANT FUNCTIONS end

// Displaying and hidding the dynamic comfirmbox for deleting-items in duggaED
function confirmBox(operation, item, type) {
	if (operation == "openConfirmBox") {
		typeOfItem = type;
		itemToDelete = item; // save the item to delete in this variable
		$("#sectionConfirmBox").css("display", "flex");
	} else if (operation == "deleteItem") {
		if (typeOfItem == "dugga") {
			deleteDugga(itemToDelete);
			$("#sectionConfirmBox").css("display", "none");
		}
		else if (typeOfItem == "variant") {
			deleteVariant(itemToDelete);
			$("#sectionConfirmBox").css("display", "none");
		}
	}
}

// Storing the celldata for future use. (Needed when editing and such)
function returnedQuiz(data) {
	var quiz = data;

	var did = $('#did').val();
	quiz['entries'].forEach(function (element) {
		if (element['arrow'] == did) {
			quiz = element;
		}
	});

	$("#did").val(quiz['arrow']);
	$("#name").val(quiz['qname']);
	$("#autograde").val(quiz['autograde']);
	$("#gradesys").val(quiz['gradesystem']);
	$("#template").val(quiz['quizFile']);
	$("#qstart").val(quiz['qstart']);
	$("#deadline").val(quiz['deadline']);
	$("#release").val(quiz['qrelease']);
}

// START OF RENDERING TABELS
//Table for duggas
function returnedDugga(data) {
	filez = data;
	globalData = data;

	if (data['debug'] != "NONE!") alert(data['debug']);
	
	if (data['writeaccess']) {
		$('#quiz').show();
		$('.fixed-action-button').show();
		$('.searchField').show();
		$('#searchbutton').show();
	}
	else {
		$('#quiz').hide();
		$('.fixed-action-button').hide();
		$('.searchField').hide();
		$('#searchbutton').hide();
			changeURL("sectioned.php?courseid=" + querystring['cid'] + "&coursename=" + data.coursename + "&coursevers="
				+ querystring['coursevers'] + "");
	}
  
	var tabledata = {
		tblhead: {
			did: "",
			qname: "Name",
			autograde: "Autograde",
			gradesystem: "Gradesystem",
			quizFile: "Template",
			qstart: "Startdate",
			deadline: "Deadline",
			qrelease: "Result date",
			modified: "Last modified",
			arrow: "",
			cogwheel: "",
			trashcan: "headingAddButton"
		},
		tblbody: data['entries'],
		tblfoot: []
	}
	duggaTable = new SortableTable(
		tabledata,
		"quiz",
		null,
		"",
		renderCell,
		renderSortOptionsDugga,
		null,
		duggaFilter,
		[],
		[],
		"",
		null,
		null,
		null,
		null,
		null,
		null,
		true
	);
	
	duggaTable.renderTable(); // Renders the dugga table

	var content = "";
	
	// If the user has access to the dugga page, then render the content
	if (data['writeaccess']) {
		
		/* Page title */
		content += "<div class='titles' style='padding-top:10px;'>"
		content += "<h1 style='flex:1;text-align:center;'>Tests</h1>"
		content += "</div>"

		/* Search engine */
		content += "<div id='testSearchContainer'>"
        content += "<input id='duggaSearch' class ='searchField' type='search' placeholder='Search...' onkeyup='searchterm=document.getElementById(\"duggaSearch\").value; searchKeyUp(event); duggaTable.renderTable();'onsearch='searchterm=document.getElementById(\"duggaSearch\").value; searchKeyUp(event); duggaTable.renderTable();'/>"
        content += "<button id='searchbutton' class='switchContent' onclick='return searchKeyUp(event);' type='button'>"
        content += "<img id='lookingGlassSVG' style='height:18px;' src='../Shared/icons/LookingGlass.svg'>"
        content += "</button>"
		content += "</div>"
		
		/* FAB Button */
		content += "<div class='fixed-action-button'>"
		content += "<a class='btn-floating fab-btn-lg noselect' id='fabBtn' onclick='createQuickItem();'><i class='material-icons'>add</i></a>"
		content += "</div>";
	}
	else {
		$("#quiz").html("");
		alert("You don't have access to this page. You are now being redirected!")
		changeURL("sectioned.php?courseid=" + querystring['cid'] + "&coursename=" + data.coursename + "&coursevers="
				+ querystring['coursevers'] + "");
	}
	
	$("#headerContent").html(content);
	
	
	$("content").html();
	var result = 0;
	filez = data['files'];
	duggaPages = data['duggaPages'];
	document.getElementById("sectionedPageTitle").innerHTML = data.coursename + " - " + data.coursecode;
	str = "";
	if (globalVariant){
		renderVariant(globalVariant);
	}
	$(window).scrollTop(localStorage.getItem("duggaEdScrollPosition" + globalData.coursecode));
}

// Table for variants
function renderVariant(clickedElement) {
	globalVariant = clickedElement;
	updateVariantTitle(clickedElement);
	var tabledata = {
		tblhead: {
			vid: "",
			param: "Parameter",
			modified: "Modified",
			disabled: "Status",
			arrowVariant: "",
			cogwheelVariant: "",
			trashcanVariant: ""
		},
		tblbody: globalData['entries'][clickedElement].variants,
		tblfoot: []
	}
	variantTable = new SortableTable(
		tabledata,
		"variant",
		null,
		"",
		renderCell,
		renderSortOptionsVariant,
		null,
		variantFilter,
		[],
		[],
		"",
		null,
		null,
		null,
		null,
		null,
		null,
		false
	);
	searchterm = '';
	variantTable.renderTable();
	newVariant();
	$('#did').val(globalData['entries'][clickedElement].arrow);
}

// Rendring specific cells
function renderCell(col, celldata, cellid) {

	// DUGGA-TABLE cellstarts
	// Numbering the table.
	if (col == "did") {
		celldata = JSON.parse(cellid.match(/\d+/)) + 1;
	}

	// Translating autograding from integers to show the data like yes/no.
	else if (col == "autograde") {
		if (celldata == "0") {
			celldata = "No";
		} else if (celldata == "1") {
			celldata = "Yes";
		}
		else {
			celldata = "Undefined";
		}
	}

	// Translating gradsystem from integers so that it shows the possible grades.
	else if (col == "gradesystem") {
		if (celldata == "1") {
			celldata = "U-G-VG";
		} else if (celldata == "2") {
			celldata = "U-G"
		} else if (celldata == "3") {
			celldata = "U-3-4-5"
		}
		else {
			celldata = "Undefined";
		}
	}

	// Placing a clickable icon in its designated column that opens a window for acess to variants.
	else if (col == "arrow") {
		clickedElement = JSON.parse(cellid.match(/\d+/));
		str = "<img id='dorf' class='markdownIcon' src='../Shared/icons/markdownPen.svg'";
		str += " onclick='renderVariant(\"" + clickedElement + "\"); showVariantEditor();'>";
		return str;
	}

	// Placing a clickable cogwheel in its designated column that opens a window for editing the row.
	else if (col == "cogwheel") {
		object = JSON.parse(celldata);
		str = "<img id='dorf' src='../Shared/icons/Cogwheel.svg' ";
		str += " onclick='showDuggaSaveButton(); selectDugga(\"" + object + "\");' >";

		return str;
	}

	// Placing a clickable trash can in its designated column and implementing the code behind it.
	else if (col == "trashcan") {
		object = JSON.parse(celldata);
		str = "<img id='dorf' src='../Shared/icons/Trashcan.svg' ";
		str += " onclick='confirmBox(\"openConfirmBox\",\"" + object + "\",\"dugga\");' >";
		return str;
	}
	// DUGGA-TABLE cellend

	// VARIANT-TABLE cellstart
	// Numbering the variant table.
	else if (col == "vid") {
		celldata = JSON.parse(cellid.match(/\d+/)) + 1;
	}

	else if (col == "param") {
		var str = "<span class='variants-param-col'>" + celldata + "</span>";
		return str;
	}

	//Translating the integers behind "disabled" to say disabled or enabled. Also making it look that way.
	else if (col == "disabled") {
		if (celldata == "0") {
			celldata = "Enabled";
			str = "<span style='color:black;'>" + celldata + "</span>";
		} else if (celldata == "1") {
			celldata = "Disabled";
			// $("#"+tempRow).css('opacity', '0.5' );
			str = "<span style='color:red;'>" + celldata + "</span>";
		}
		else {
			celldata = "Undefined";
			str = "<span style='color:black; opacity:0.5;'>" + celldata + "</span>";
		}
		return str;
	}

	// Placing a clickable arrow in its designated column for previewing the variant.
	else if (col == "arrowVariant") {
		object = JSON.parse(celldata);
		str = "<img id='dorf' src='../Shared/icons/PlayT.svg' ";
		str += " onclick='getVariantPreview( " + object + ", " + clickedElement + ");'>";
		return str;
	}

	// Placing a clickable cogwheel in its designated column that select a variant to be edited.
	else if (col == "cogwheelVariant") {
		object = JSON.parse(celldata);
		str = "<img id='dorf' src='../Shared/icons/Cogwheel.svg' ";
		str += " onclick='selectVariant(" + object + ");markSelectedVariant(this);' >";
		return str;
	}

	// Placing a clickable trashcan can in its designated column and implementing the code behind it.
	else if (col == "trashcanVariant") {
		object = JSON.parse(celldata);
		str = "<img id='dorf' src='../Shared/icons/Trashcan.svg' ";
		str += " onclick='confirmBox(\"openConfirmBox\",\"" + object + "\",\"variant\");' >";
		return str;
	}
	// VARIANT-TABLE cellend

	return celldata;
}
// END OF rendering cells
// END OF rendering tables


//Making dugga headers clickable for sorting.
function renderSortOptionsDugga(col,status) {
	str = "";
	if(col == "headingAddButton"){
		str += "<input type='button' value='+' style='float:left;' class='submit-button-newitem' onclick='showDuggaSubmitButton(); newDugga();'>";
	}
	else{
		if (status ==- 1) {
			str += "<span class='sortableHeading' onclick='duggaTable.toggleSortStatus(\"" + col + "\",0)'>" + col + "</span>";
		} else if (status == 0) {
			str += "<span class='sortableHeading' onclick='duggaTable.toggleSortStatus(\"" + col + "\",1)'>" + col + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
		} else {
			str += "<span class='sortableHeading' onclick='duggaTable.toggleSortStatus(\"" + col + "\",0)'>" + col + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
		}
	}
	return str;
}

//Making variant headers clickable for sorting.
function renderSortOptionsVariant(col,status) {
	str = "";
	if (status ==- 1) {
		str += "<span class='sortableHeading' onclick='variantTable.toggleSortStatus(\"" + col + "\",0)'>" + col + "</span>";
	} else if (status == 0) {
		str += "<span class='sortableHeading' onclick='variantTable.toggleSortStatus(\"" + col + "\",1)'>" + col + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
	} else {
		str += "<span class='sortableHeading' onclick='variantTable.toggleSortStatus(\"" + col + "\",0)'>" + col + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
	}
	return str;
}

//Compare to make the table sortable
function compare(a,b) {
	var col = sortableTable.currentTable.getSortcolumn();
	var tempA = a;
	var tempB = b;

	// Needed so that the counter starts from 0
	// everytime we sort the table
	count = 0;

	if (col == "Name"  || col == "Template") {
		tempA = tempA.toUpperCase();
		tempB = tempB.toUpperCase();
	}

	if (tempA > tempB || tempB == null) {
		return 1;
	} else if (tempA < tempB || tempA == null) {
		return -1;
	} else {
		return 0;
	}
}

//Filtering duggas from the searchfield.
function duggaFilter(row) {
	if (row.qname.toLowerCase().indexOf(searchterm.toLowerCase()) != -1){
		return true;
	}
	else if (row.quizFile.toLowerCase().indexOf(searchterm.toLowerCase()) != -1){
		return true;
	}
	else{
		return false;
	}
}

//Filtering variants from the searchfield.
function variantFilter(row) {
	if (row.param.toLowerCase().indexOf(searchterm.toLowerCase()) != -1){
		return true;
	}
	else{
		return false;
	}
}


// START OF closers and openers
function closeEditDugga() {
	$("#editDugga").css("display", "none");

	// Resets the name validation
	resetNameValidation();
}

function showDuggaSubmitButton() {
	$("#submitDugga").css("display", "block");
	$("#saveDugga").css("display", "none");
}

function showDuggaSaveButton() {
	$("#submitDugga").css("display", "none");
	$("#saveDugga").css("display", "block");
}

function showVariantEnableButton() {
	$("#enableVariant").css("display", "block");
	$("#disableVariant").css("display", "none");
}

function showVariantDisableButton() {
	$("#enableVariant").css("display", "none");
	$("#disableVariant").css("display", "block");
}


//END OF closers and openers

function getVariantPreview(vid) {
	var did = document.getElementById("did").value;
	var target_variant;
	var target_quiz;
	globalData['entries'].forEach(element => {
		if (element['did'] == did) {
			target_quiz = element;
		}
		var tempVariant = element['variants'];
		tempVariant.forEach(variant => {
			if (variant['vid'] == vid) {
				target_variant = variant;
			}
		});
	});


	var template = target_quiz['quizFile'];
	var duggaVariantParam = target_variant['param']; // Set Variant Param
	var duggaVariantAnswer = target_variant['variantanswer']; // Set Variant Answer

	document.getElementById("resultpopoverTitle").innerHTML = "Previewing a variant with " + template + " template";
	$("#MarkCont").html(duggaPages[template]);

	$.getScript("templates/" + template + ".js")
		.done(function (script, textStatus) {
			showFacit(decodeURIComponent(duggaVariantParam), "UNK", decodeURIComponent(duggaVariantAnswer), null, null, null);
		})
		.fail(function (jqxhr, settings, exception) {
			showFacit(decodeURIComponent(duggaVariantParam), "UNK", decodeURIComponent(duggaVariantAnswer));
		});


	$("#resultpopover").css("display", "flex");
}

/*
	This function finds the first ancestor element of the element passed in as an argument.
	el: the element whose ancestor should be found.
	name: the class or element name of the ancestor, i.e. 'myclass' or 'DIV'
		(all element names must be in capital letters)
	type: search for ancestor by class or element name
*/
function findAncestor (el, name, type) {
	if(type == 'className') {
		while ((el = el.parentElement) && !el.classList.contains(name));
    	return el;
	} else if(type == 'elName') {
		while ((el = el.parentElement) && el.nodeName != name);
    	return el;
	}
	return null;
}

$(document).scroll(function(e){
	localStorage.setItem("duggaEdScrollPosition" + globalData.coursecode, $(window).scrollTop());
});

// Start of functions handling the FAB-button functionality

function createQuickItem(){
	newDugga();
	createDugga();
}

// End of functions handling the FAB-button functionality
