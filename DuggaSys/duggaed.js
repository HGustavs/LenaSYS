/********************************************************************************

   Globals

 *********************************************************************************/
var sessionkind = 0;
var querystring = parseGet();
var filez;
var variant = [];
var submissionRow = 0;
var myTable;
var variantTable;
var str;
var globalData;
var globalVariant;
var itemToDelete;
var typeOfItem;
var duggaPages;
var isClickedElementBox = false;
var searchterm = "";
var targetfile;
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

function setup() {
	/* Replaced by search bar in navheader.php. Remove this code when the new search bar has been properly tested
	var filt = "";

	filt += `<td id='testSearchContainer' class='navButt'>`
    filt += `<form autocomplete='off' style='display:contents'><input id='duggaSearch' readonly style='margin-top:4px;' onmouseover = 'duggaSearchMouseOver()' type='text' name='search' placeholder='Search..'`;
	filt += `onkeyup='searchterm=document.getElementById("duggaSearch").value;searchKeyUp(event);myTable.renderTable();'onsearch='searchterm=document.getElementById("duggaSearch").value; searchKeyUp(event); myTable.renderTable();document.getElementById("searchinputMobile").value=document.getElementById("duggaSearch").value;'/></form>`;
	filt += `<button id='searchbutton' class='switchContent' onclick='return searchKeyUp(event);' type='button'>`
    filt += `<img alt='search icon' id='lookingGlassSVG' style='height:18px;margin-bottom:6px;' src='../Shared/icons/LookingGlass.svg'>`
	filt += `</button>`
	filt += `</td>`
    filt += `<img id='lookingGlassSVG' style='height:18px;margin-bottom:6px;' src='../Shared/icons/LookingGlass.svg'/>`;
    filt += `</button></td>`;
    filt += `<script> function duggaSearchMouseOver() {var obj = document.getElementById("duggaSearch"); if(obj != null){obj.removeAttribute('readonly');}}</script>`;

	$("#menuHook").before(filt);
	*/
	AJAXService("GET", { cid: querystring['courseid'], coursevers: querystring['coursevers'] }, "DUGGA");
}

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

// Detects clicks
$(document).mousedown(function (e) {
	var box = $(e.target);
	if (box[0].classList.contains("formBox")) { // is the clicked element a formBox?
		isClickedElementBox = true;
	} else if ((findAncestor(box[0], "formBox") != null) // or is it inside a formBox?
		&& (findAncestor(box[0], "formBox").classList.contains("formBox"))) {
		isClickedElementBox = true;
	} else {
		isClickedElementBox = false;
	}
});

$(document).mouseup(function (e) {
	// Click outside the formBox
	if ($('.formBox').is(':visible') && !$('.formBox').is(e.target) // if the target of the click isn't the container...
		&& $('.formBox').has(e.target).length === 0 // ... nor a descendant of the container
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
		quiz={"arrow":"UNK","qname":"","autograde":0,"gradesystem":1,"quizFile":0,"qstart":"UNK","deadline":"UNK","jsondeadline":"","qrelease":"UNK"};
	} else {
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
	if(quiz['qstart']===null) quiz['qstart']="";
	$("#qstart").val(quiz['qstart'].substr(0,10));
	$("#qstartt").html(makeoptions(quiz['qstart'].substr(11,2),tarro,tarrv));
	$("#qstartm").html(makeoptions(quiz['qstart'].substr(14,2),marro,marrv));

	if(quiz['jsondeadline'].indexOf("'")>=0) quiz['jsondeadline']=quiz['jsondeadline'].replace(/'/g, "\"");
	if(quiz['jsondeadline']===null||quiz['jsondeadline']=="") quiz['jsondeadline']='{"deadline1":"", "comment1":"","deadline2":"", "comment2":"", "deadline3":"", "comment3":""}';
	var dls=JSON.parse(quiz['jsondeadline']);
	if(quiz['deadline']===null) quiz['deadline']="";
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
	if(quiz['qrelease']===null) quiz['qrelease']="";
	$("#release").val(quiz['qrelease'].substr(0,10));
	$("#releaset").html(makeoptions(quiz['qrelease'].substr(11,2),tarro,tarrv));
	$("#releasem").html(makeoptions(quiz['qrelease'].substr(14,2),marro,marrv));

	$("#editDugga").css("display", "flex");
	/* Validates name as soon as a dugga is selected, but only if dugga already exists (new duggas will not be validated here).*/
	if(qid != "UNK"){
		validateDuggaName();
	}
}

function updateDugga() {
	var did = $("#did").val();
	var nme = $("#name").val();
	var autograde = $("#autograde").val();
	var gradesys = $("#gradesys").val();
	var template = $("#template").val();
  var qstart = $("#qstart").val()+" "+$("#qstartt").val()+":"+$("#qstartm").val();
  if($("#qstart").val()=="") {
		toast("warning","Missing Start Date",7);
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
      toast("warning","Missing Deadline 1",7);
      return;
  }
  if(deadline < qstart) {
		toast("error",`Deadline before start:\nDeadline: ${deadline} - Start: ${qstart}`,7);
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

	AJAXService("SAVDUGGA", { cid: querystring['courseid'], qid: did, nme: nme, autograde: autograde, gradesys: gradesys, template: template, qstart: qstart, deadline: deadline, jsondeadline: jsondeadline, release: release, coursevers: querystring['coursevers'] }, "DUGGA");
}

function deleteDugga(did) {
	AJAXService("DELDU", { cid: querystring['courseid'], qid: did, coursevers: querystring['coursevers'] }, "DUGGA");
	$("#editDugga").css("display", "none");
}

function isNameValid(){
	var nme = document.getElementById("name");

	if (nme.value.match(/^[A-Za-zÅÄÖåäö\s\d(),.]+$/)) {
		return true;
	}
	return false;
}

function quickValidateDugga(formid, submitButton){
	const saveButton = document.getElementById(submitButton);
	valid = true;
	valid2 = true;
	valid3 = true;
	valid = validateDuggaName()
	valid2 = validateDeadlineComments()
	valid3 = validateDeadlines()


	valid = valid && valid2 && valid3;
	if (valid){
		saveButton.disabled = false;
	}else{
		saveButton.disabled = true;
	}
	
}

function validateDeadlineComments(){
 cmt1 = document.getElementById('deadlinecomments1')
 cmtdialog1 = document.getElementById('deadlinecomments1Dialog')
 cmt2 = document.getElementById('deadlinecomments2')
 cmtdialog2 = document.getElementById('deadlinecomments2Dialog')
 cmt3 = document.getElementById('deadlinecomments3')
 cmtdialog3 = document.getElementById('deadlinecomments3Dialog')
 valid = true;


  	var regComment = /(^$)|(^[-a-zåäöA-ZÅÄÖ0-9_+§&%# ?!,.]*$)/;
  	var rangeComment = /^.{0,50}$/;
	if (cmt1.value.match(regComment) && cmt1.value.match(rangeComment)) {
		$(cmtdialog1).fadeOut();
		cmt1.style.backgroundColor = "#ffff";
		cmt1.style.borderColor = "#383";
		cmt1.style.borderWidth = "2px";
	}else{
		$(cmtdialog1).fadeIn();
		cmt1.style.backgroundColor = "#f57";
		cmt1.style.borderColor = "#E54";
		cmt1.style.borderWidth = "2px";
		valid = false
	}
	if (cmt2.value.match(regComment) && cmt2.value.match(rangeComment) ) {
		$(cmtdialog2).fadeOut();
		cmt2.style.backgroundColor = "#ffff";
		cmt2.style.borderColor = "#383";
		cmt2.style.borderWidth = "2px";
	}else{
		$(cmtdialog2).fadeIn();
		cmt2.style.backgroundColor = "#f57";
		cmt2.style.borderColor = "#E54";
		cmt2.style.borderWidth = "2px";
		valid = false
	}
	if (cmt3.value.match(regComment) && cmt3.value.match(rangeComment)) {
		$(cmtdialog3).fadeOut();
		cmt3.style.backgroundColor = "#ffff";
		cmt3.style.borderColor = "#383";
		cmt3.style.borderWidth = "2px";
	}else{
		$(cmtdialog3).fadeIn();
		cmt3.style.backgroundColor = "#f57";
		cmt3.style.borderColor = "#E54";
		cmt3.style.borderWidth = "2px";
		valid = false
	}
	return valid;
}

function validateDeadlines(){
  startdialog = document.getElementById('StartDateDialog')
  dldialog1 = document.getElementById('Deadline1Dialog')
  dldialog2 = document.getElementById('Deadline2Dialog')
  dldialog3 = document.getElementById('Deadline3Dialog')
  rrtdialog = document.getElementById('ResultReleaseDialog')

  var qstart1 = $("#qstart").val()+" "+$("#qstartt").val()+":"+$("#qstartm").val();
  var qstartbox = document.getElementById('qstart')

  var qdeadline1 = $("#deadline").val()+" "+$("#deadlinet").val()+":"+$("#deadlinem").val();
  var deadlinebox = document.getElementById('deadline')

  var qdeadline2 = $("#deadline2").val()+" "+$("#deadlinet2").val()+":"+$("#deadlinem2").val();
  var deadline2box = document.getElementById('deadline2')

  var qdeadline3 = $("#deadline3").val()+" "+$("#deadlinet3").val()+":"+$("#deadlinem3").val();
  var deadline3box = document.getElementById('deadline3')

  var qrelease = $("#release").val()+" "+$("#releaset").val()+":"+$("#releasem").val();
  var releasebox = document.getElementById('release')


  var valid = true;

    if($("#qstart").val()=="") {
		//alert("Missing Start Date");
		startdialog.innerHTML = "Missing Start Date."
		$(startdialog).fadeIn()
		formStatusAppearance(qstartbox.id, 1);
		valid = false;
    }else{
		$(startdialog).fadeOut()
		formStatusAppearance(qstartbox.id, 0);
    }
	
	if($("#deadline").val()==""){
		//alert("Missing Deadline 1");
		dldialog1.innerHTML = "Missing Deadline 1";
		$(dldialog1).fadeIn()
		formStatusAppearance(deadlinebox.id, 1);
		valid = false;

	}else{
		if(qdeadline1 < qstart1) {
			//alert(`Deadline before start:\nDeadline: ${deadline} - Start: ${qstart}`);
			dldialog1.innerHTML = "Cannot be before Start";
			$(dldialog1).fadeIn()
			formStatusAppearance(deadlinebox.id, 1);
		  	valid = false;

		 }else{
			$(dldialog1).fadeOut()
			formStatusAppearance(deadlinebox.id, 0);
		 }
	}
	//The other deadlines are not required.
  	if($("#deadline2").val()!=""){
		if(qdeadline2 < qstart1 || qdeadline2 < qdeadline1) {
			//alert(`Deadline before start:\nDeadline: ${deadline} - Start: ${qstart}`);
			dldialog2.innerHTML = "Cannot be before above dates";
			$(dldialog2).fadeIn()
			formStatusAppearance(deadline2box.id, 1);
			valid = false;

		 }else{
			$(dldialog2).fadeOut()
			formStatusAppearance(deadline2box.id, 0);
		 }
  	}else{
		$(dldialog2).fadeOut()
		formStatusAppearance(deadline2box.id, 3);
	}
	
  	if($("#deadline3").val()!=""){
		if(qdeadline3 < qstart1 || qdeadline3 < qdeadline2 || qdeadline3 < qdeadline1) {
			//alert(`Deadline before start:\nDeadline: ${deadline} - Start: ${qstart}`);
			dldialog3.innerHTML = "Cannot be before above dates";
			$(dldialog3).fadeIn()
			formStatusAppearance(deadline3box.id, 1);
			valid = false;

		 }else{
			$(dldialog3).fadeOut()
			formStatusAppearance(deadline3box.id, 0);
		 }

  	} else{
		$(dldialog3).fadeOut()
		formStatusAppearance(deadline3box.id, 3);
	}
	
	if($("#release").val()==""){
		//alert("Missing release date");
		rrtdialog.innerHTML = "Missing release date";
		$(rrtdialog).fadeIn()
		formStatusAppearance(releasebox.id, 1);
		valid = false;
		
	}else{
		if(qrelease < qstart1 || qrelease < qdeadline1) {
			//alert(`Deadline before start:\nDeadline: ${deadline} - Start: ${qstart}`);
			rrtdialog.innerHTML = "Cannot be before first deadline";
			$(rrtdialog).fadeIn()
			formStatusAppearance(releasebox.id, 1);
			valid = false;

		 }else{
			$(rrtdialog).fadeOut()
			formStatusAppearance(releasebox.id, 0);
		 }
	}
return valid;
}

function formStatusAppearance(id, status){
	//0 = success, 1 = failure, else = neutral.
	var box = document.getElementById(id);
 switch(status){
	case 0:
		box.style.backgroundColor = "#ffff";
		box.style.borderColor = "#383";
		box.style.borderWidth = "2px";
		break;
	case 1:
		box.style.backgroundColor = "#f57";
		box.style.borderColor = "#E54";
		box.style.borderWidth = "2px";
		break;
	default:
		box.style.backgroundColor = "#ffff";
		box.style.borderColor = "#383";
		box.style.borderWidth = "0px";
 } 

}

// Checks if the title name includes any invalid characters
function validateDuggaName() {
	var retValue = false;
	var nme = document.getElementById("name");

	if (nme.value.match(/^[A-Za-zÅÄÖåäö\s\d():_-]+$/)) {
		$('#tooltipTxt').fadeOut();
		//$('#saveDugga').removeAttr('disabled');
		//$('#submitDugga').removeAttr('disabled');
		formStatusAppearance(nme.id, 0);
		//nme.style.backgroundColor = "#fff";
		retValue = true;
	} else {
		$('#tooltipTxt').fadeIn();
		//$('#submitDugga').attr('disabled', 'disabled');
		//$('#saveDugga').attr('disabled', 'disabled');
		formStatusAppearance(nme.id, 1);
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
	document.getElementById('gFilelink').value = '';
	document.getElementById('gFilelink').placeholder = 'File link';
	document.getElementById('extraparam').value = '';
	document.getElementById('extraparam').placeholder = 'Extra dugga parameters in valid JSON';
	document.getElementById('notes').value = '';
	document.getElementById('notes').placeholder = 'Notes';
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
	AJAXService("ADDVARI", { cid: querystring['courseid'], qid: qid, disabled: "1", variantanswer: answer, parameter: parameter, coursevers: querystring['coursevers'] }, "DUGGA");
}

function selectVariant(vid, el) {
	var target_variant;
	var isSelected = markSelectedVariant(el);
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
			document.getElementById("variantparameterText").value = "";
			document.getElementById('variantanswerText').value = "";
			
		}
		
		//Disable and enable update/disable/enable buttons depending on isSelect and if item in list is set enable/disable.
		if(isSelected){
			document.getElementById("disableVariant").disabled = false;
			document.getElementById("saveVariant").disabled = false;

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
		}else{
			document.getElementById("disableVariant").disabled = true;
			document.getElementById("saveVariant").disabled = true;
			document.getElementById("enableVariant").disabled = true;
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
					  updateInstructions();
  				}
  				else if(result == "filelink"){
  					document.getElementById('filelink').value = obj[result];
  				}
				  if(result == "gType"){
					document.getElementById('gType').value = obj[result];
					updateInformation();
				}
				else if(result == "gFilelink"){
					document.getElementById('gFilelink').value = obj[result];
				}
  				else if(result == "extraparam"){
  					document.getElementById('extraparam').value = obj[result];
  				}
				else if(result == "notes"){
					document.getElementById('notes').value = obj[result];
				}
				else if(result =="errorActive"){
					document.getElementById("errorActive").checked = obj[result];
				}else if(result == "diagram_File"){
                    document.getElementById('file').value = obj[result];
                }
  			}
		var diagramType = obj.diagram_type; //<-- UML/IE functionality start
		if(diagramType){
			document.getElementById('ER').checked = diagramType.ER;
			document.getElementById('UML').checked = diagramType.UML;
			document.getElementById('IE').checked = diagramType.IE;
		}//<-- UML/IE functionality end
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
				document.getElementById('gType').value = "";
				document.getElementById('gFilelink').value = "";
				document.getElementById('extraparam').value = "";
				document.getElementById('notes').value = ""; 				
		}

}


function updateVariant(status) {
	clearActiveDiagram();
	var vid = $("#vid").val();
	var answer = $("#variantanswerText").val();
  	var parameter = $("#variantparameterText").val();

	AJAXService("SAVVARI", { cid: querystring['courseid'], vid: vid, disabled: status, variantanswer: answer, parameter: parameter, coursevers: querystring['coursevers'] }, "DUGGA");
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
	clearActiveDiagram();
	AJAXService("DELVARI", { cid: querystring['courseid'], vid: vid, coursevers: querystring['coursevers'] }, "DUGGA");
}

// Update the title of the variant editor to refer to the dugga that "owns" the variants
function updateVariantTitle(number) {
	document.getElementById("editVariantTitle").innerHTML = `Variants for: ${globalData['entries'][number].qname}`;
}

// Opens the variant editor.
function showVariantEditor() {
	AJAXService("GET", { cid: querystring['courseid'], coursevers: querystring['coursevers'] }, "FILE");
	//check if the selected dugga is a diagram dugga
	if(globalData['entries'][globalVariant].quizFile == "diagram_dugga"){
		$("#selectBox").css("display", "flex");
		$("#typeCheckbox").css("display", "flex");
		$("#errorCheck").css("display", "flex");
	}
	else{
		$("#selectBox").css("display", "none");
		$("#typeCheckbox").css("display", "none");
		$("#errorCheck").css("display","none");
	}

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

function returnedFile(data){
	retdata = data;
	filearray = [];
	
	/*Because the 'filename' value is just raw JSON, it needs to be parsed. You can test this by printing retdata in the
	console while in the variant editor. After parsing they're placed in array which then gets filtered for JSON files*/
	for (var i = 0; i < retdata['entries'].length; i++){
		filearray[i] = JSON.parse(retdata['entries'][i].filename);
	}
	filteredarray = filearray.filter(x => x.extension === "json");
	instrArray = filearray.filter(x => x.extension === $("#type").val());
	infArray = filearray.filter(x => x.extension === $("#gType").val());

	$("#file").html(makeoptionsItem("AddEmptyField", filteredarray, 'filename','filename'));
	$("#filelink").html(makeoptionsItem("AddEmptyField", instrArray, 'filename', 'filename'));
	$("#gFilelink").html(makeoptionsItem("AddEmptyField", infArray, 'filename', 'filename'));
}

function updateInstructions(){
	instrArray = filearray.filter(x => x.extension === $("#type").val());
	$("#filelink").html(makeoptionsItem("AddEmptyField", instrArray, 'filename', 'filename'));
}

function updateInformation(){
	infArray = filearray.filter(x => x.extension === $("#gType").val());
	$("#gFilelink").html(makeoptionsItem("AddEmptyField", infArray, 'filename', 'filename'));
}

// Adds a submission row
function addVariantSubmissionRow() {
  var subDivContent = `<div style='width:100%;display:flex;flex-wrap:nowrap;flex-direction:row; margin-right:2%;'>
		<select name='s_type' id='submissionType${submissionRow}' style='width:65px;' onchange='$(\"#variantparameterText\").val(createJSONString($(\"#jsonForm\").serializeArray()));'>
		<option value='pdf'>PDF</option>
		<option value='zip'>Zip</option>
		<option value='link'>Link</option>
		<option value='text'>Text</option>
		<option value='timesheet'>Timesheet</option>
		</select>
		<input type='text' name='s_fieldname' id='fieldname${submissionRow}' placeholder='Submission name' style='flex:1;margin-left:5px;margin-bottom:3px;height:24.8px;' onkeyup='$(\"#variantparameterText\").val(createJSONString($(\"#jsonForm\").serializeArray()));'/>
		<input type='text' name='s_instruction' id='instruction${submissionRow}' placeholder='Upload instruction' style='flex:3;margin-left:5px;margin-bottom:3px;height:24.8px;' onkeyup='$(\"#variantparameterText\").val(createJSONString($(\"#jsonForm\").serializeArray()));'/>`
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
	var type, fieldname, instruction, diagramFile;

	formData.forEach(element => {
		if (element.name == "s_type") type = element;
		if (element.name == "s_fieldname") fieldname = element;
		if (element.name == "s_instruction") instruction = element;
		

		if (type && fieldname && instruction) {
			submission_types.push({
				"type":type.value,
				"fieldname":fieldname.value,
				"instruction":instruction.value,
				
			});

			type = undefined;
			fieldname = undefined;
			instruction = undefined;
			
		}
	});

	//Adds values to the JSON object.
	return JSON.stringify({
		"type":formData[0].value,
		"filelink":formData[1].value,
		"gType":formData[2].value,
		"gFilelink":$("#gFilelink option:selected").val(),
		"diagram_File":$("#file option:selected").val(),
		"diagram_type":{ER:document.getElementById("ER").checked,UML:document.getElementById("UML").checked,IE:document.getElementById("IE").checked}, //<-- UML functionality
		"extraparam":$('#extraparam').val(),
		"notes":$('#notes').val(),
		"submissions":submission_types,
		"errorActive":document.getElementById("errorActive").checked
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
	  else if(result == "gType"){
        document.getElementById('gType').value = obj[result];
      }
      else if(result == "gFilelink"){
        document.getElementById('gFilelink').value = obj[result];
      }
      else if(result == "extraparam"){
        document.getElementById('extraparam').value = obj[result];
      }
	  else if(result == "notes"){
        document.getElementById('notes').value = obj[result];
      }
	 
	  else if(result =="file"){
		document.getElementById('file').value = "hejsan";
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
	var row = el.closest("tr");

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

	// Allows for duggor & dugga variants to be deleted by pressing the enter-key when the confirmBox is visible.
	document.addEventListener("keypress", event => {
		if (event.key === 'Enter') {	
			if(event.target.classList.contains("traschcanDelDugga")){
				$("#confirmDelSubmit").focus();
			}
			if(event.target.id == "confirmDelSubmit"){
				deleteVariant(itemToDelete);
				deleteDugga(itemToDelete);
				$("#sectionConfirmBox").css("display", "none");
			}
		}
	});
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
	
	//If the user dont have writeaccess, the user gets send to the startpage
	if (!data.writeaccess) {
		window.location.href = 'courseed.php';
	}
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
			changeURL(`sectioned.php?courseid=${querystring['courseid']}&coursename=${data.coursename}&coursevers=${querystring['coursevers']}`);
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
			modified: "Last Modified",
			arrow: "",
			cogwheel: "",
			trashcan: ""
		},
		tblbody: data['entries'],
		tblfoot: {}
	}
		var colOrder=["did","qname","autograde","gradesystem","quizFile","qstart","deadline","qrelease","modified","arrow","cogwheel","trashcan"];
		myTable = new SortableTable({
				data:tabledata,
				tableElementId:"quiz",
				renderCellCallback:renderCell,
				renderSortOptionsCallback:renderSortOptionsDugga,
				rowFilterCallback:duggaFilter,
				columnOrder:colOrder,
				hasRowHighlight:true,
				hasMagicHeadings:false ,
				hasCounterColumn:false,
        hasFooter:false
		});

		myTable.renderTable(); // Renders the dugga table

		var content = "";

		// If the user has access to the dugga page, then render the content
		if (data['writeaccess']) {

				/* Page title */
				content += "<div class='titles' style='padding-top:10px;'>"
						content += "<h1 style='flex:1;text-align:start;'>Edit dugga</h1>"
				content += "</div>"

		}
		else {
				$("#quiz").html("");
				toast("warning","You don't have access to this page. You are now being redirected!", 10);
				changeURL(`sectioned.php?courseid=${querystring['courseid']}&coursename=${data.coursename}&coursevers=${querystring['coursevers']}`);
		}

		$("#headerContent").html(content);


		$("content").html();
		var result = 0;
		filez = data['files'];
		duggaPages = data['duggaPages'];
		document.getElementById("sectionedPageTitle").innerHTML = `Dugga editor - ${data.coursename} - ${data.coursecode}`;
		str = "";
		if (globalVariant){
				renderVariant(globalVariant);
		}
		$(window).scrollTop(localStorage.getItem(`duggaEdScrollPosition${globalData.coursecode}`));
}

// Table for variants
function renderVariant(clickedElement) {
		globalVariant = clickedElement;
		updateVariantTitle(clickedElement);
		var tabledata = {
				tblhead: {					//Add header to variant window.
						vid: "",
						notes: "Note",
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
		var colOrderVariant=["vid","notes","param","modified","disabled","arrowVariant","cogwheelVariant","trashcanVariant"];
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

// Rendring specific cells inside the dugga and variant tables
function renderCell(col, celldata, cellid) {
	var retString = "";		// The string that will be returned at the end of this function

	switch(col) {
		case "did":			// DUGGA-TABLE - Enumeration column
		case "vid":			// VARIANT-TABLE - Enumeration column
			retString = celldata;
			break;
		
		case "autograde":	// DUGGA-TABLE - Translates integers to show autograde as yes/no instead
			switch(celldata) {
				case "0": retString = "No"; break;
				case "1": retString = "Yes"; break;
				default: retString = "Undefined";
			}
			break;

		case "gradesystem":	// DUGGA-TABLE - Translates gradesystem integers to corresponding strings
			switch(celldata) {
				case "1": retString = "U-G-VG"; break;
				case "2": retString = "U-G"; break;
				case "3": retString = "U-3-4-5"; break;
				default: retString = "Undefined";
			}
			break;
		
		case "qstart":		// DUGGA-TABLE - Startdate
		case "deadline":	// DUGGA-TABLE - Deadline
		case "qrelease":	// DUGGA-TABLE - Result date
		case "modified":  // DUGGA-TABLE - Last Modified
			if(!celldata) {	// if null - return string "N/A"
				retString = "N/A";
			} else if(celldata.length > 10){		// when there is time included - return date without seconds (i.e. last three charachters)
				var secCutoff = celldata.length - 3;
				retString = celldata.slice(0, secCutoff);
			} else {
				retString = celldata;	//else - simply show the celldata, in this case the date (YYYY-MM-DD)
			}
			break;

		case "arrow":		// DUGGA-TABLE - Arrow icon
			clickedElement = JSON.parse(cellid.match(/\d+/));
			retString = "<img alt='edit dugga icon' tabindex='0' id='dorf' class='markdownIcon markdownIconTab' src='../Shared/icons/markdownPen.svg' title='Edit Variants'";
			retString += ` onclick='renderVariant(\"${clickedElement}\"); showVariantEditor();'>`;
			break;

		case "cogwheel":	// DUGGA-TABLE - Cogwheel icon
			object = JSON.parse(celldata);
			retString += "<img class='settingIcon' tabindex='0' alt='dugga settings icon' id='dorf' src='../Shared/icons/Cogwheel.svg' title='Edit Dugga'";
			retString += ` onclick='selectDugga(\"${object}\");' >`;
			break;

		case "trashcan":	// DUGGA-TABLE - Trashcan icon
			object = JSON.parse(celldata);
			retString = "<img alt='delete dugga icon' tabindex='0'  class='traschcanDelDugga' id='dorf' src='../Shared/icons/Trashcan.svg' title='Delete'";
			retString += ` onclick='confirmBox(\"openConfirmBox\",\"${object}\",\"dugga\");' >`;
			break;

		case "notes":		// DUGGA-TABLE - Notes column
			// Parse JSON to get the note
			console.log(celldata);
			object = JSON.parse(celldata).notes;
			retString = `<span class='variants-notes-col'>${object}</span>`;
			break;
			
		case "param":		// DUGGA-TABLE - Parameter column
			retString = `<span class='variants-param-col'>${celldata}</span>`;
			break;

		case "disabled":	// VARIANT-TABLE - Translades disabled status from integers
			switch(celldata) {
				case 0: retString = "<span style='color:black;'>Enabled</span>"; break;
				case 1: retString = "<span style='color:red;'>Disabled</span>"; break;
				default: retString = "<span style='color:black; opacity:0.5;'>Undefined</span>";
			}
			break;

		case "arrowVariant":	// VARIANT-TABLE - Arrow icon
			object = JSON.parse(celldata);
			retString = "<img id='dorf' src='../Shared/icons/PlayT.svg' ";
			retString += ` onclick='getVariantPreview( ${object}, ${clickedElement});'>`;
			break;

		case "cogwheelVariant":	// VARIANT-TABLE - Cogwheel icon
		object = JSON.parse(celldata);
			retString = "<img id='dorf' src='../Shared/icons/Cogwheel.svg' ";
			retString += ` onclick='selectVariant(${object},this);' >`;
			break;

		case "trashcanVariant":	// VARIANT-TABLE - Trashcan icon
			object = JSON.parse(celldata);
			retString = "<img id='dorf' src='../Shared/icons/Trashcan.svg' ";
			retString += ` onclick='confirmBox(\"openConfirmBox\",\"${object}\",\"variant\");' >`;
			break;

		default:			// DUGGA- & VARIANT-TABLES - Return celldata for "regular" cells
			retString = celldata;
	}
	
	return retString;	// Returns the string/icon to be shown inside the cell
}	// End of renderCell

//Making dugga headers clickable for sorting.
function renderSortOptionsDugga(col,status,colname) {
		str = "";
		/*
		if(col == "headingAddButton"){
			str += "<input type='button' value='+' style='float:left;' class='submit-button-newitem' onclick='showDuggaSubmitButton(); newDugga();'>";
		}
		else{
			if (status ==- 1) {
				str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "</span>";
			} else if (status == 0) {
				str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
			} else {
				str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
			}
		}
		*/
		if (col != "arrow" && col != "cogwheel" && col != "trashcan") {			//Disable sorting for pen, cog and trashcan icons
			if (status ==- 1) {
				str += `<span class='sortableHeading' tabindex='0' onclick='myTable.toggleSortStatus(\"${col}\",0)'>${colname}</span>`;
			} else if (status == 0) {
					str += `<span class='sortableHeading' tabindex='0' onclick='myTable.toggleSortStatus(\"${col}\",1)'>${colname}<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>`;
			} else {
					str += `<span class='sortableHeading' tabindex='0' onclick='myTable.toggleSortStatus(\"${col}\",0)'>${colname}<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>`;
			}
		}
return str;
}

//Making variant headers clickable for sorting.
function renderSortOptionsVariant(col,status,colname) {
	str = "";
	if (status ==- 1) {
		str += `<span class='sortableHeading' onclick='variantTable.toggleSortStatus(\"${col}\",0)'>${colname}</span>`;
	} else if (status == 0) {
		str += `<span class='sortableHeading' onclick='variantTable.toggleSortStatus(\"${col}\",1)'>${colname}<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>`;
	} else {
		str += `<span class='sortableHeading' onclick='variantTable.toggleSortStatus(\"${col}\",0)'>${colname}<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>`;
	}
	return str;
}

//Filtering duggas from the searchfield.
function duggaFilter(row) {
	var regex = new RegExp('(.*)::(.*)');
    // Split the searchterm at each &&
    var splitSearch = searchterm.split("&&");

    var tempSearchTerm;
    var columnToSearch;

    // Loop through each searchterms. If there is a match set "match" to true.
    // If "match" is false at the end of an iteration return false since there wasn't a match.
    for (var i = 0; i < splitSearch.length; i++) {
        tempSearchTerm = splitSearch[i].trim().match(regex);
        var match = false;
        if (tempSearchTerm != null && tempSearchTerm.length > 1) {
            columnToSearch = tempSearchTerm[1].toLowerCase();
            tempSearchTerm = tempSearchTerm[2];
            if (row[columnToSearch].toUpperCase().indexOf(tempSearchTerm.toUpperCase()) != -1) match = true;
            
        } else {
            tempSearchTerm = splitSearch[i].trim();
            for (var key in row) {
                if (row[key] != null) {
                    if (row[key].toString().toUpperCase().indexOf(tempSearchTerm.toUpperCase()) != -1) match = true;
                    
                }
            }

        }
        if (!match) return false;
    }
    return true;
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

	document.getElementById("resultpopoverTitle").innerHTML = `Previewing a variant with ${template} template`;
	$("#MarkCont").html(duggaPages[template]);

	$.getScript(`templates/${template}.js`)
		.done(function (script, textStatus) {
			showFacit(decodeURIComponent(duggaVariantParam), "UNK", decodeURIComponent(duggaVariantAnswer), null, null, null);
		})
		.fail(function (jqxhr, settings, exception) {
			showFacit(decodeURIComponent(duggaVariantParam), "UNK", decodeURIComponent(duggaVariantAnswer));
		});
	$.getScript(`duggaed.js`);

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

document.addEventListener('keydown', function(e) {
	var element = document.getElementById('fabButtonAcc');
	if(e.keyCode === 17){
		if(window.getComputedStyle(element, null).getPropertyValue("opacity") != "1"){
			element.style.opacity = "1";
			element.style.pointerEvents = "auto";
		}else{
			element.style.opacity = "0.3";
			element.style.pointerEvents = "none";
		}	
	}
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

function createQuickItem(){
 		selectDugga("UNK");
 		//createDugga();
}

function mouseUp(e){

}



// End of functions handling the FAB-button functionality

//--------------------------------------------------------------------------
//  compare function used for sorting in Dugga Editor
//--------------------------------------------------------------------------

function compare(a, b) {
	var status = sortableTable.currentTable.getSortkind(); // Get if the sort arrow is up or down.

	if(status==1){
		var tempA = a;
		var tempB = b;
	}else{
		var tempA = b;
		var tempB = a;
	}
	
	if(tempA != null){
		tempA = tempA.toString().toLowerCase().replace(/&aring/g,"å").replace(/&auml/g,"ä").replace(/&ouml/g,"ö").replace(/&Aring/g,"Å").replace(/&Auml/g,"Ä").replace(/&Ouml/g,"Ö");
	}
	if(tempB != null){
		tempB = tempB.toString().toLowerCase().replace(/&aring/g,"å").replace(/&auml/g,"ä").replace(/&ouml/g,"ö").replace(/&Aring/g,"Å").replace(/&Auml/g,"Ä").replace(/&Ouml/g,"Ö");
	}

	if (tempA > tempB) {
		return 1;
	} else if (tempA < tempB) {
		return -1;
	} else if (a === null) {
		return -1;
	}	else if (b === null) {
		return 1;
	} else {
		return 0;
	}	
}

function checkDiagramTypes(num){
	if(num==0){
		if(document.getElementById("UML").checked == false && document.getElementById("IE").checked == false){
			document.getElementById("ER").checked = true;
		}
	}
	if(num==1){
		if(document.getElementById("ER").checked == false && document.getElementById("IE").checked == false){
			document.getElementById("UML").checked = true;
		}
	}
	if(num==2){
		if(document.getElementById("ER").checked == false && document.getElementById("UML").checked == false){
			document.getElementById("IE").checked = true;
		}
	}
	$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));
}

function clearActiveDiagram(){
	localStorage.setItem("CurrentlyActiveDiagram","");// Emptying the currently active diagram
}
