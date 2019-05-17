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

function setup() {

  var filt = "";

  filt += "<td id='testSearchContainer' class='navButt'>"
  filt += "<input id='duggaSearch' type='text' placeholder='Search...' onkeyup='searchterm=document.getElementById(\"duggaSearch\").value; searchKeyUp(event); duggaTable.renderTable();'onsearch='searchterm=document.getElementById(\"duggaSearch\").value; searchKeyUp(event); duggaTable.renderTable();'/>"
  filt += "<button id='searchbutton' class='switchContent' onclick='return searchKeyUp(event);' type='button'>"
  filt += "<img id='lookingGlassSVG' style='height:18px;' src='../Shared/icons/LookingGlass.svg'>"
  filt += "</button>"
  filt += "</td>"

  $("#menuHook").before(filt);

  AJAXService("GET", { cid: querystring['cid'], coursevers: querystring['coursevers'] }, "DUGGA");
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

function selectDugga(qid) {
  var tarro=["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
  var tarrv=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  var marro=["00","05","10","15","20","25","30","35","40","45","50","55"];
  var marrv=[0,5,10,15,20,25,30,35,40,45,50,55];
  if(qid=="UNK"){
      quiz={"arrow":"UNK","qname":"New Dugga","autograde":0,"gradesystem":1,"quizFile":0,"qstart":"UNK","deadline":"UNK","jsondeadline":"","qrelease":"UNK"};
  }else{
      globalData['entries'].forEach(function (element) {
          if (element['did'] == qid) {
              quiz = element;
          }
      });
  }

	$("#did").val(quiz['arrow']);
	$("#name").val(quiz['qname']);
	$("#autograde").html(makeoptions(quiz['autograde'],["Hidden","Yes"],[0,1]));
	$("#gradesys").html(makeoptions(quiz['gradesystem'],["U-G-VG","U-G"],[1,2,3]));
	$("#template").html(makeoptions(quiz['quizFile'],globalData["files"],globalData["files"]));
  if(quiz['qstart']===null)quiz['qstart']="";
  $("#qstart").val(quiz['qstart'].substr(0,10));
	$("#qstartt").html(makeoptions(quiz['qstart'].substr(11,2),tarro,tarrv));
  $("#qstartm").html(makeoptions(quiz['qstart'].substr(14,2),marro,marrv));

  if(quiz['jsondeadline'].indexOf("'")>=0)quiz['jsondeadline']=quiz['jsondeadline'].replace(/'/g, "\"");
  if(quiz['jsondeadline']===null||quiz['jsondeadline']=="")quiz['jsondeadline']='{"deadline1":"", "comment1":"","deadline2":"", "comment2":"", "deadline3":"", "comment3":""}';
  let dls=JSON.parse(quiz['jsondeadline']);
  if(quiz['deadline']===null)quiz['deadline']="";
  $("#deadline").val(quiz['deadline'].substr(0,10));
  $("#deadlinecomments1").val(dls.comment1);
	$("#deadlinet").html(makeoptions(quiz['deadline'].substr(11,2),tarro,tarrv));
  $("#deadlinem").html(makeoptions(quiz['deadline'].substr(14,2),marro,marrv));
  $("#deadline2").val(dls.deadline2.substr(0,10));
  $("#deadlinecomments2").val(dls.comment2);
	$("#deadlinet2").html(makeoptions(dls.deadline2.substr(11,2),tarro,tarrv));
  $("#deadlinem2").html(makeoptions(dls.deadline2.substr(14,2),marro,marrv));
  $("#deadline3").val(dls.deadline3.substr(0,10));
  $("#deadlinecomments3").val(dls.comment3);
	$("#deadlinet3").html(makeoptions(dls.deadline3.substr(11,2),tarro,tarrv));
  $("#deadlinem3").html(makeoptions(dls.deadline3.substr(14,2),marro,marrv));
  if(quiz['qrelease']===null)quiz['qrelease']="";
  $("#release").val(quiz['qrelease'].substr(0,10));
	$("#releaset").html(makeoptions(quiz['qrelease'].substr(11,2),tarro,tarrv));
  $("#releasem").html(makeoptions(quiz['qrelease'].substr(14,2),marro,marrv));

  $("#editDugga").css("display", "flex");
}


function updateDugga() {
	var did = $("#did").val();
	var nme = $("#name").val();
	var autograde = $("#autograde").val();
	var gradesys = $("#gradesys").val();
	var template = $("#template").val();
  var qstart = $("#qstart").val()+" "+$("#qstartt").val()+":"+$("#qstartm").val();
  if($("#qstart").val()=="") {
		alert("Missing Start Date");
		return;
  }
	var deadline = $("#deadline").val()+" "+$("#deadlinet").val()+":"+$("#deadlinem").val();
	var release = $("#release").val()+" "+$("#releaset").val()+":"+$("#releasem").val();
	if($("#release").val()=="")release="UNK";
  var jsondeadline = {"deadline1":"", "comment1":"","deadline2":"", "comment2":"", "deadline3":"", "comment3":""};
  if($("#deadline").val()!=""){
      jsondeadline.deadline1=deadline;
      jsondeadline.comment1=$("#deadlinecomments1").val();
  }else{
      alert("Missing Deadline 1");
      return;
  }
  if(deadline < qstart) {
		alert("Deadline before start:\nDeadline: "+deadline+" - Start: "+qstart);
		return;
  }
  if($("#deadline2").val()!=""){
      jsondeadline.deadline2=$("#deadline2").val()+" "+$("#deadlinet2").val()+":"+$("#deadlinem2").val();
      jsondeadline.comment2=$("#deadlinecomments2").val();
  }else{
      jsondeadline.deadline2="";
      jsondeadline.comment2="";
  }

  if($("#deadline3").val()!=""){
      jsondeadline.deadline3=$("#deadline3").val()+" "+$("#deadlinet3").val()+":"+$("#deadlinem3").val();
      jsondeadline.comment3=$("#deadlinecomments3").val();
  }else{
      jsondeadline.deadline3="";
      jsondeadline.comment3="";
  }
  jsondeadline=JSON.stringify(jsondeadline);

	closeWindows();

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
	document.getElementById('variantSearch').value = '';
  document.getElementById('filelink').value = '';
	document.getElementById('filelink').placeholder = 'File link';
	document.getElementById('extraparam').value = '';
	document.getElementById('extraparam').placeholder = 'Extra dugga parameters in valid JSON';
	document.getElementById('variantparameterText').value = '';
	document.getElementById('variantparameterText').placeholder = 'Undefined JSON parameter';
	document.getElementById('variantanswerText').value = '';
	document.getElementById('variantanswerText').placeholder = 'Undefined JSON answer';
	if (document.querySelector('#submissionType0')) {
		document.querySelector('#submissionType0').value = 'pdf';
		document.querySelector('#fieldname0').value = '';
		document.querySelector('#fieldname0').placeholder = 'Submission name';
		document.querySelector('#instruction0').value = '';
		document.querySelector('#instruction0').placeholder = 'Upload instruction';
	}

}

function createVariant() {
	var qid = $("#did").val();
	var answer = $("#variantanswerText").val();
  var parameter = $("#variantparameterText").val();
	AJAXService("ADDVARI", { cid: querystring['cid'], qid: qid, disabled: "1", variantanswer: answer, parameter: parameter, coursevers: querystring['coursevers'] }, "DUGGA");
}

function selectVariant(vid, el) {
	var target_variant;
	let isSelected = markSelectedVariant(el);
	globalData['entries'].forEach(element => {
		var tempVariant = element['variants'];
		tempVariant.forEach(variant => {
			if (variant['vid'] == vid) {
        target_variant = variant;
        $("#saveVariant").attr('disabled',false);
			}
		});
	});
	$("#saveVariant").css("display", "block");

		//Get information for rightDivDialog and display it.
		if(isSelected) {
			document.getElementById('vid').value = target_variant['vid'];
			document.getElementById('variantparameterText').value = target_variant['param'];
			document.getElementById('variantanswerText').value = target_variant['variantanswer'];
		} else {
			// But hide the information if it is deselected.
			document.getElementById('vid').value = "";
			document.getElementById('variantparameterText').value = "";
			document.getElementById('variantanswerText').value = "";
		}


		//Get information for leftDivDialog and display it.
		if(isSelected) {
      try {
        var obj = JSON.parse(target_variant['param']);
  			var it = Object.keys(obj).length;
  			for(var i = 0; i<it; i++){
  				var result = Object.keys(obj)[i];

  				if(result == "type"){
  					document.getElementById('type').value = obj[result];
  				}
  				else if(result == "filelink"){
  					document.getElementById('filelink').value = obj[result];
  				}
  				else if(result == "extraparam"){
  					document.getElementById('extraparam').value = obj[result];
  				}
  			}

        var submissionTypes = obj.submissions;
        if (submissionTypes) {
  			  document.getElementById('submissionType0').value = submissionTypes[0].type;
  			  document.getElementById('fieldname0').value = submissionTypes[0].fieldname;
  			  document.getElementById('instruction0').value = submissionTypes[0].instruction;

  			  for (var i = 1; i < submissionTypes.length; i++) {
  				  addVariantSubmissionRow();
  				  document.getElementById('submissionType'+i).value = submissionTypes[i].type;
  				  document.getElementById('fieldname'+i).value = submissionTypes[i].fieldname;
  				  document.getElementById('instruction'+i).value = submissionTypes[i].instruction;
  				  document.getElementById('variantparameterText').value = target_variant['param'];
  			 }
  		  }
      } catch (e) {
        console.log("Unable to parse json data.");
      }
		} else {
				// Hide information if it is deselected.
				document.getElementById('type').value = "";
				document.getElementById('filelink').value = "";
				document.getElementById('extraparam').value = "";
		}

  var disabled = (target_variant['disabled']);
  $("#disabled").val(disabled);
	if (disabled == 0) {
      //showVariantDisableButton();
      $("#disableVariant").attr('disabled',false);
      $("#enableVariant").attr('disabled',true);
	}else{
      //showVariantEnableButton();
      $("#disableVariant").attr('disabled',true);
      $("#enableVariant").attr('disabled',false);
	}
}


function updateVariant(status) {
	var vid = $("#vid").val();
	var answer = $("#variantanswerText").val();
  var parameter = $("#variantparameterText").val();
	AJAXService("SAVVARI", { cid: querystring['cid'], vid: vid, disabled: status, variantanswer: answer, parameter: parameter, coursevers: querystring['coursevers'] }, "DUGGA");
  $('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));
	$("#editVariant").css("display", "flex"); //Display variant-window

	// Remove extra submission rows
	if (submissionRow > 0) {
		for (var i = submissionRow-1; i > 0; i--) {
			// The function needs an element of the row to be removed, so this is what we have to do
			var rows = [...document.getElementById('submissions').childNodes];
			var elements = [...rows[i].childNodes];
			var element = elements[0];
			removeVariantSubmissionRow(element);
		}
	}
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
  if(submissionRow == 0){
    // The submission row doesn't go away when leaving the modal
    // so without the if statement a new submission div would be created each time.
    addVariantSubmissionRow();
  } else if (submissionRow > 1) {
		removeExtraSubmissionRows();
	}
  $('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));
	$("#editVariant").css("display", "flex"); //Display variant-window
}

// Adds a submission row
function addVariantSubmissionRow() {
  var subDivContent = "<div style='width:100%;display:flex;flex-wrap:wrap;flex-direction:row;'>" +
		"<select name='s_type' id='submissionType" + submissionRow + "' style='width:65px;' onchange='$(\"#variantparameterText\").val(createJSONString($(\"#jsonForm\").serializeArray()));'>" +
		"<option value='pdf'>PDF</option>" +
		"<option value='zip'>Zip</option>" +
		"<option value='link'>Link</option>" +
		"<option value='text'>Text</option>" +
		"<option value='timesheet'>Timesheet</option>" +
		"</select>" +
		"<input type='text' name='s_fieldname' id='fieldname" + submissionRow + "' placeholder='Submission name' style='flex:1;margin-left:5px;margin-bottom:3px;height:24.8px;' onkeyup='$(\"#variantparameterText\").val(createJSONString($(\"#jsonForm\").serializeArray()));'/>" +
		"<input type='text' name='s_instruction' id='instruction" + submissionRow + "' placeholder='Upload instruction' style='flex:3;margin-left:5px;margin-bottom:3px;height:24.8px;' onkeyup='$(\"#variantparameterText\").val(createJSONString($(\"#jsonForm\").serializeArray()));'/>"
    if(submissionRow != 0){
      // Can't/don't want the first submission row to be deleted so no point having a delete button.
      subDivContent += "<input type='button' class='delButton submit-button' value='-' style='width:32px;margin:0px 0px 3px 5px;' onclick='removeVariantSubmissionRow(this);'></input><br/>";
    }
    subDivContent += "</div>";
    $('#submissions').append(subDivContent);

  submissionRow++;
  $('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));
}

// Removes the submissionRow on which the -(delete) was clicked on
function removeVariantSubmissionRow(buttonElement){
  // Get the parent element
  var subRow = buttonElement.parentElement
  // loop through all chidlren and remove them (cruel)
  while (subRow.firstChild) {
    subRow.removeChild(subRow.firstChild);
  }
  // Remove parent once children are gone.
  subRow.remove();
  submissionRow = submissionRow-1;
  $("#variantparameterText").val(createJSONString($("#jsonForm").serializeArray()));
}

function removeExtraSubmissionRows() {
	for (var i = submissionRow-1; i > 0; i--) {
		// The function needs an element of the row to be removed, so this is what we have to do
		var rows = [...document.getElementById('submissions').childNodes];
		var elements = [...rows[i].childNodes];
		var element = elements[0];
		removeVariantSubmissionRow(element);
	}
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

// Does the reverse of what createJSONString does.
function createJSONFormData(){
  var jsonData = $("#variantparameterText").val();

  try {
    var obj = JSON.parse(jsonData);

    // Remove extra submission rows
    if (submissionRow > 0) {
      removeExtraSubmissionRows();
    }

    var it = Object.keys(obj).length;
    for(var i = 0; i<it; i++){
      var result = Object.keys(obj)[i];

      if(result == "type"){
        document.getElementById('type').value = obj[result];
      }
      else if(result == "filelink"){
        document.getElementById('filelink').value = obj[result];
      }
      else if(result == "extraparam"){
        document.getElementById('extraparam').value = obj[result];
      }
    }

    var submissionTypes = obj.submissions;
    if (submissionTypes) {
      document.getElementById('submissionType0').value = submissionTypes[0].type;
      document.getElementById('fieldname0').value = submissionTypes[0].fieldname;
      document.getElementById('instruction0').value = submissionTypes[0].instruction;

      for (var i = 1; i < submissionTypes.length; i++) {
        addVariantSubmissionRow();
        document.getElementById('submissionType'+i).value = submissionTypes[i].type;
        document.getElementById('fieldname'+i).value = submissionTypes[i].fieldname;
        document.getElementById('instruction'+i).value = submissionTypes[i].instruction;
        document.getElementById('variantparameterText').value = jsonData;
      }
    }
  } catch (e) {
    console.log("unable to parse json.");
    console.log(e);
  }
}

/*
	This function marks the selected variant when editing by changing the
	background color of the table row.
*/
function markSelectedVariant(el) {
	let row = el.closest("tr");

    $('.active-variant').not(row).each(function() {
        $(this).removeClass('active-variant');
    });

		if($(row).hasClass('active-variant')) {
			$(row).removeClass('active-variant');
			return false;
		} else {
			$(row).addClass('active-variant');
			return true;
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
/*
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
  */
}

// START OF RENDERING TABELS
//Table for duggas
function returnedDugga(data) {
	filez = data;
	globalData = data;

	if (data['debug'] != "NONE!") alert(data['debug']);

    $("#disableVariant").attr('disabled',true);
    $("#enableVariant").attr('disabled',true);
    $("#saveVariant").attr('disabled',true);

	if (data['writeaccess']) {
		$('#quiz').show();
		$('.fixed-action-button').show();
		$('#duggaSearch').show();
		$('#searchbutton').show();
	}
	else {
		$('#quiz').hide();
		$('.fixed-action-button').hide();
		$('#duggaSearch').hide();
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
			trashcan: ""
		},
		tblbody: data['entries'],
		tblfoot: {}
	}
		var colOrder=["did","qname","autograde","gradesystem","quizFile","qstart","deadline","qrelease","modified","arrow","cogwheel","trashcan"];
		duggaTable = new SortableTable({
				data:tabledata,
				tableElementId:"quiz",
				renderCellCallback:renderCell,
				renderSortOptionsCallback:renderSortOptionsDugga,
				rowFilterCallback:duggaFilter,
				columnOrder:colOrder,
				hasRowHighlight:true,
				hasMagicHeadings:false ,
				hasCounterColumn:false
		});

		duggaTable.renderTable(); // Renders the dugga table

		var content = "";

		// If the user has access to the dugga page, then render the content
		if (data['writeaccess']) {

				/* Page title */
				content += "<div class='titles' style='padding-top:10px;'>"
						content += "<h1 style='flex:1;text-align:center;'>Tests</h1>"
				content += "</div>"

		}
		else {
				$("#quiz").html("");
				alert("You don't have access to this page. You are now being redirected!")
				changeURL("sectioned.php?courseid=" + querystring['cid'] + "&coursename=" + data.coursename + "&coursevers=" + querystring['coursevers'] + "");
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
				tblfoot: {}
		}
		var colOrderVariant=["vid","param","modified","disabled","arrowVariant","cogwheelVariant","trashcanVariant"];
		variantTable = new SortableTable({
				data:tabledata,
				tableElementId:"variant",
				renderCellCallback:renderCell,
				renderSortOptionsCallback:renderSortOptionsVariant,
				rowFilterCallback:variantFilter,
				columnOrder:colOrderVariant,
				hasRowHighlight:true,
				hasMagicHeadings:false,
				hasCounterColumn:false
		});
		searchterm = '';
		variantTable.renderTable();
    newVariant();
    $('#did').val(globalData['entries'][clickedElement].arrow);
    $('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));

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
		str += " onclick='selectDugga(\"" + object + "\");' >";

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
		str += " onclick='selectVariant(" + object + ",this);' >";
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
function renderSortOptionsDugga(col,status,colname) {
		str = "";
		/*
		if(col == "headingAddButton"){
			str += "<input type='button' value='+' style='float:left;' class='submit-button-newitem' onclick='showDuggaSubmitButton(); newDugga();'>";
		}
		else{
			if (status ==- 1) {
				str += "<span class='sortableHeading' onclick='duggaTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "</span>";
			} else if (status == 0) {
				str += "<span class='sortableHeading' onclick='duggaTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
			} else {
				str += "<span class='sortableHeading' onclick='duggaTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
			}
		}
		*/
		if (col != "arrow" && col != "cogwheel" && col != "trashcan") {			//Disable sorting for pen, cog and trashcan icons
			if (status ==- 1) {
				str += "<span class='sortableHeading' onclick='duggaTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "</span>";
			} else if (status == 0) {
					str += "<span class='sortableHeading' onclick='duggaTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
			} else {
					str += "<span class='sortableHeading' onclick='duggaTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
			}
		}
return str;
}

//Making variant headers clickable for sorting.
function renderSortOptionsVariant(col,status,colname) {
	str = "";
	if (status ==- 1) {
		str += "<span class='sortableHeading' onclick='variantTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "</span>";
	} else if (status == 0) {
		str += "<span class='sortableHeading' onclick='variantTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
	} else {
		str += "<span class='sortableHeading' onclick='variantTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
	}
	return str;
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
	mouseDown(e);
	TouchFABDown(e);
});

$(document).on("touchend", function (e) {
	mouseUp(e);
	TouchFABUp(e);
});

//----------------------------------------------------------------------------------
// mouseDown: make sure mousedown is only handled in one single place regardless if touch or mouse
//----------------------------------------------------------------------------------

function mouseDown(e){

}

//----------------------------------------------------------------------------------
// mouseUp: make sure mousedown is only handled in one single place regardless if touch or mouse
//----------------------------------------------------------------------------------

function mouseUp(e){

}

function createQuickItem(){
		selectDugga("UNK");
		//createDugga();
}

// End of functions handling the FAB-button functionality
