/********************************************************************************

   Globals

*********************************************************************************/
var sessionkind=0;
var querystring=parseGet();
var filez;
var variant = [];
var submissionRow = 0;
var myTable;
var myTable2;
var str;
var globalData;
var itemToDelete;
var typeOfItem;

AJAXService("GET",{cid:querystring['cid'],coursevers:querystring['coursevers']},"DUGGA");

$(function() {
	$("#release").datepicker({
		dateFormat: "yy-mm-dd",
		minDate: 0,
		onSelect: function(date){
			var newDate = $('#release').datepicker('getDate');
			$('#deadline').datepicker("option","minDate", newDate);

		}
	});
	$("#deadline2").datepicker({
		dateFormat: "yy-mm-dd",
		minDate: 0,
		onSelect: function(date){
			var newDate = $('#release').datepicker('getDate');
			$('#deadline').datepicker("option","minDate", newDate);

		}
	});
	$("#deadline3").datepicker({
		dateFormat: "yy-mm-dd",
		minDate: 0,
		onSelect: function(date){
			var newDate = $('#release').datepicker('getDate');
			$('#deadline').datepicker("option","minDate", newDate);

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
$(document).ready(function(){

	addSubmissionRow();

	$(document).on('click','.delButton', function(){
		if($(this).parent().parent().children().length > 1) {
			$(this).parent().remove();
		}
		return false;
	});

	$('#addfieldname').click(function(){
		addSubmissionRow();
	});

	$('#createjson').click(function(){
		$('#parameter').val(createJSONString($('#jsonform').serializeArray()));
	});
});

$(window).load(function() {
	//There is an issue with using this code, it generates errors that stop execution
      $(window).keyup(function(event){
      	if(event.keyCode == 27) {
         	closeWindows();
         // closeSelect();
          	showDuggaSaveButton();
        }
      });
});

// DUGGA FUNCTIONS start
function newDugga(){
	$("#editDugga").css("display","none");
	document.getElementById('name').value='';
	document.getElementById('name').placeholder='Empty dugga';
	document.getElementById('qstart').value='';
	document.getElementById('qstart').placeholder='YYYY-MM-DD';
	document.getElementById('release').value='';
	document.getElementById('release').placeholder='YYYY-MM-DD';
	document.getElementById('deadline').value='';
	document.getElementById('deadline').placeholder='YYYY-MM-DD';
	//----------------------------------------------------
	// Set Autograde
	//----------------------------------------------------
	var str="";
	if(autograde==0) str+="<option selected='selected' value='0'>Off</option>"
	else str+="<option value='0'>Hidden</option>";
	if(autograde==1) str+="<option selected='selected' value='1'>On</option>"
	else str+="<option value='1'>Public</option>";
	$("#autograde").html(str);

	str="";
	if(gradesys==1) str+="<option selected='selected' value='1'>U-G-VG</option>"
	else str+="<option value='1'>U-G-VG</option>";
	if(gradesys==2) str+="<option selected='selected' value='2'>U-G</option>"
	else str+="<option value='2'>U-G</option>";
	if(gradesys==3) str+="<option selected='selected' value='3'>U-3-4-5</option>"
	else str+="<option value='3'>U-3-4-5</option>";
	$("#gradesys").html(str);

	str="";
	for(var j=0;j<filez.length;j++){
		filen=filez[j];
		if(filen!=".."&&filen!="."){
			if(template==filen) str+="<option selected='selected' value='"+filen+"'>"+filen+"</option>"
			else str+="<option value='"+filen+"'>"+filen+"</option>"
		}
	}
	$("#template").html(str);
	$("#editDugga").css("display","flex");
	//$("#overlay").css("display","block");
}

function createDugga(){
	var did=$("#did").val();
	var nme=$("#name").val();
	var autograde=$("#autograde").val();
	var qstart=$("#qstart").val();
	var gradesys=$("#gradesys").val();
	var template=$("#template").val();
	var release=$("#release").val();
	var deadline3=$("#deadline3").val();
	var deadline2=$("#deadline2").val();
	var deadline=$("#deadline").val();
	var cid=querystring['cid'];
	var coursevers=querystring['coursevers'];
	window.location.reload();
	$("#editDugga").css("display","none");
	//$("#overlay").css("display","none");

	//autograde, gradesystem, qname, quizFile, release, deadline, creator, vers
	AJAXService("ADDUGGA",{cid:cid,autograde:autograde,gradesys:gradesys,nme:nme,template:template,release:release,deadline:deadline,deadline2:deadline2,deadline3:deadline3,coursevers:coursevers},"DUGGA");
}

function selectDugga(qid){
	AJAXService("GET",{cid:querystring['cid'],coursevers:querystring['coursevers'], qid:this.qid},"GETQUIZ");

	$("#editDugga").css("display","flex");
		//$("#overlay").css("display","block");
	$("#did").val(qid); // Set Variant ID
	$("#name").val(name); // Set Dugga name
	$("#qstart").val(qstart); // Set Start date name
	$("#deadline").val(deadline); // Set Deadline date name
	$("#release").val(release); // Set Release date name

	//----------------------------------------------------
	// Set Autograde
	//----------------------------------------------------
	var str="";
	if(autograde==0) str+="<option selected='selected' value='0'>Off</option>"
	else str+="<option value='0'>Hidden</option>";
	if(autograde==1) str+="<option selected='selected' value='1'>On</option>"
	else str+="<option value='1'>Public</option>";
	$("#autograde").html(str);

	str="";
	if(gradesys==1) str+="<option selected='selected' value='1'>U-G-VG</option>"
	else str+="<option value='1'>U-G-VG</option>";
	if(gradesys==2) str+="<option selected='selected' value='2'>U-G</option>"
	else str+="<option value='2'>U-G</option>";
	if(gradesys==3) str+="<option selected='selected' value='3'>U-3-4-5</option>"
	else str+="<option value='3'>U-3-4-5</option>";
	$("#gradesys").html(str);

	str="";
	for(var j=0;j<filez.length;j++){
		filen=filez[j];
		if(filen!=".."&&filen!="."){
			if(template==filen) str+="<option selected='selected' value='"+filen+"'>"+filen+"</option>"
			else str+="<option value='"+filen+"'>"+filen+"</option>"
		}
	}
	$("#template").html(str);
}

function updateDugga(){
	var did=$("#did").val();
	var nme=$("#name").val();
	var autograde=$("#autograde").val();
	var gradesys=$("#gradesys").val();
	var template=$("#template").val();
	var qstart=$("#qstart").val();
	var deadline=$("#deadline").val();
	var deadline2=$("#deadline2").val();
	var deadline3=$("#deadline3").val();
  	var release=$("#release").val();

  	closeEditDugga();

	AJAXService("SAVDUGGA",{cid:querystring['cid'],qid:did,nme:nme,autograde:autograde,gradesys:gradesys,template:template,qstart:qstart,deadline:deadline,deadline2:deadline2,deadline3:deadline3,release:release,coursevers:querystring['coursevers']},"DUGGA");
}

function deleteDugga(did){
	AJAXService("DELDU",{cid:querystring['cid'],qid:did,coursevers:querystring['coursevers']},"DUGGA");
	$("#editDugga").css("display","none");
}
// DUGGA FUNCTIONS end

// VARIANT FUNCTIONS start
function newVariant(){
	showVariantDisableButton();
	showVariantSubmitButton();
	document.getElementById('filelink').value='';
	document.getElementById('filelink').placeholder='File link';
	document.getElementById('extraparam').value='';
	document.getElementById('extraparam').placeholder='Extra dugga parameters in valid JSON';
	document.getElementById('variantparameterText').value='';
	document.getElementById('variantparameterText').placeholder='Undefied JSON parameter';
	document.getElementById('variantanswerText').value='';
	document.getElementById('variantanswerText').placeholder='Undefied JSON answer';
	$("#editVariant").css("display","flex"); //Display variant-window
}

function createVariant(){ //removed qid and cid
	var qid = $("#did").val();
	var answer=$("#variantanswerText").val();
	var parameter=$("#variantparameterText").val();
	
	AJAXService("ADDVARI",{cid:querystring['cid'],qid:qid,variantanswer:answer,parameter:parameter,coursevers:querystring['coursevers']},"DUGGA");
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

	showVariantSaveButton();
	$("#vid").val(target_variant['vid']); // Set Variant ID
	$("#variantparameterText").val(target_variant['param']); // Set Variant ID
	$("#variantanswerText").val(target_variant['variantanswer']); // Set Variant ID
}

function updateVariant(){
	var vid=$("#vid").val();
	var answer=$("#variantanswerText").val();
	var parameter=$("#variantparameterText").val();

	AJAXService("SAVVARI",{cid:querystring['cid'],vid:vid,variantanswer:answer,parameter:parameter,coursevers:querystring['coursevers']},"DUGGA");
}

function deleteVariant(vid){
	AJAXService("DELVARI",{cid:querystring['cid'],vid:vid,coursevers:querystring['coursevers']},"DUGGA");
}
// VARIANT FUNCTIONS end

// Displaying and hidding the dynamic comfirmbox for deleting-items in duggaED
function confirmBox(operation, item, type) {
	if(operation == "openConfirmBox") {
		typeOfItem = type;
		itemToDelete = item; // save the item to delete in this variable
		$("#sectionConfirmBox").css("display","flex");
	} else if (operation == "deleteItem") {
		if(typeOfItem == "dugga"){
		deleteDugga(itemToDelete);
		$("#sectionConfirmBox").css("display","none");
		}
		else if(typeOfItem == "variant"){
		deleteVariant(itemToDelete);
		$("#sectionConfirmBox").css("display","none");
		}
	} else if (operation == "closeConfirmBox") {
		$("#sectionConfirmBox").css("display","none");
	}
}

// Storing the celldata for future use. (Needed when editing and such)
function returnedQuiz(data) {
	quizData = data;
	var quiz = data;
	
	
    var did = $('#did').val();
    quiz['entries'].forEach(function(element) {
        if(element['arrow'] == did) {
            quiz = element;
        }
    });
	$("#did").val(quiz['arrow']);
	$("#name").val(quiz['qname']);
	$("#autograde").val(quiz['autograde']);
	$("#gradesys").val(quiz['gradesystem']);
	$("#template").val(quiz['quizFile']);
	$("#qstart").val(quiz['qstart'] ? quiz['qstart'] : "null");
	$("#deadline").val(quiz['deadline']);
  	$("#release").val(quiz['qrelease']);
}

// START OF RENDERING TABELS
//Table for duggas
function returnedDugga(data) {
	filez = data;
	globalData = data;

    var tabledata = {
    	tblhead:{
    		arrow:"",
    		qname:"Name",
    		autograde:"Autograde",
    		gradesystem:"Gradesystem",
    		quizFile:"Template",
    		qstart:"Startdate",
    		deadline:"Deadline",
    		qrelease:"Result date",
    		modified:"Last modified",
    		cogwheel:"",
    		trashcan:"<input type='button' value='+' class='submit-button-newitem' onclick='showDuggaSubmitButton(); newDugga()'>"
    	},
    	tblbody: data['entries'],
    	tblfoot:[]
    }
    myTable = new SortableTable(
		tabledata,
		"quiz",
		null,
		"",
        renderCell,
        null,
        null,
        null,
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
    myTable.renderTable();

	$("content").html();
	var result = 0;
	filez = data['files'];
	var duggaPages = data['duggaPages'];
	document.getElementById("sectionedPageTitle").innerHTML = data.coursename + " - " + data.coursecode;
	str="";
}

// Table for variants
function renderVariant(clickedElement) {
	var tabledata2 = {
    	tblhead:{
    		vid:"",
    		param:"Parameter",
    		variantanswer:"Answer",
    		modified:"Modified",
    		disabled:"Disabled/Enabled",
    		cogwheelVariant: "",
    		trashcanVariant: ""
    	},
    	tblbody: globalData['entries'][clickedElement].variants, 
    	tblfoot:[]
    }
	myTable2 = new SortableTable(
		tabledata2,
		"variant",
		null,
		"",
        renderCell,
        null,
        null,
        null,
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
	myTable2.renderTable();
	newVariant();
	$('#did').val(globalData['entries'][clickedElement].arrow);
}

// Rendring specific cells
function renderCell(col,celldata,cellid) {	
	
	// DUGGA-TABLE cellstarts
	// Placing a clickable icon in its designated column that opens a window for acess to variants.
	if (col == "arrow"){
		clickedElement=JSON.parse(cellid.match(/\d+/));
	    str="<img id='dorf' src='../Shared/icons/right_primary.svg' ";
		str+=" onclick='renderVariant(\""+clickedElement+"\");'>";
		return str;
	}
	
	// Translating autograding from integers to show the data like yes/no.
	else if (col == "autograde"){
		if(celldata == "0"){
			celldata = "No";
		}else if(celldata == "1"){
			celldata = "Yes";
		}
		else{
			celldata = "Undefined";
		}
	}

	// Translating gradsystem from integers so that it shows the possible grades.
	else if (col == "gradesystem"){
		if(celldata == "1"){
			celldata = "U-G-VG";
		}else if(celldata == "2"){
			celldata = "U-G"
		}else if(celldata == "3"){
			celldata = "U-3-4-5"
		}
		else{
			celldata = "Undefined";
		}
	}

	// Placing a clickable cogwheel in its designated column that opens a window for editing the row.
	else if (col == "cogwheel"){
		object=JSON.parse(celldata);
	  	str="<img id='dorf' src='../Shared/icons/Cogwheel.svg' ";
		str+=" onclick='showDuggaSaveButton(); selectDugga(\""+object+"\");' >";

		return str;
	}

	// Placing a clickable trash can in its designated column and implementing the code behind it.
	else if (col == "trashcan"){
		object=JSON.parse(celldata);
	  	str="<img id='dorf' src='../Shared/icons/Trashcan.svg' ";
		str+=" onclick='confirmBox(\"openConfirmBox\",\""+object+"\",\"dugga\");' >";
		return str;
	}
	// DUGGA-TABLE cellend

	// VARIANT-TABLE cellstart
	// Placing a clickable arrow in its designated column for previewing the variant.
	else if (col == "vid"){
	    str="<img id='dorf' src='../Shared/icons/right_primary.svg' ";
		str+=" onclick='getVariantPreview();'>";
		return str;
	}

	//Translating the integers behind "disabled" to say disabled or enabler. Also making it look that way.
	else if (col == "disabled"){
		if(celldata == "0"){
			celldata = "Enabled";
			//MAKE IT LOOK ENABLED
		}else if(celldata == "1"){
			celldata = "Disabled";
			// MAKE IT LOOK DISABLED
		}
		else{
			celldata = "Undefined";
		}
	}

	// Placing a clickable cogwheel in its designated column that select a variant to be edited.
	else if (col == "cogwheelVariant"){
		object=JSON.parse(celldata);
	    str="<img id='dorf' src='../Shared/icons/Cogwheel.svg' ";
		str+=" onclick='selectVariant("+object+")' >";
		return str;
	}

	// Placing a clickable trashcan can in its designated column and implementing the code behind it.
	else if (col == "trashcanVariant"){
		object=JSON.parse(celldata);
	    str="<img id='dorf' src='../Shared/icons/Trashcan.svg' ";
		str+=" onclick='confirmBox(\"openConfirmBox\",\""+object+"\",\"variant\");' >";
		return str;
	}
	// VARIANT-TABLE cellend

	return celldata;
}
// END OF rendering cells
// END OF rendering tables

// START OF closers and openers
function closeEditDugga(){
	$("#editDugga").css("display","none");
	document.getElementById("name").style.backgroundColor = "#fff";  // Resets color for name input
	$('#tooltipTxt').css("display","none");							 // Resets tooltip text to its default form
}

function showLoginPopup(){
	$("#loginBox").css("display","block");
}

function hideLoginPopup(){
	$("#loginBox").css("display","none");
}

function showDuggaSubmitButton(){
  $("#submitDugga").css("display","block");
  $("#saveDugga").css("display","none");
}

function showDuggaSaveButton(){
  $("#submitDugga").css("display","none");
  $("#saveDugga").css("display","block");
}

function showVariantSubmitButton(){
  $("#submitVariant").css("display","block");
  $("#saveVariant").css("display","none");
}

function showVariantSaveButton(){
  $("#submitVariant").css("display","none");
  $("#saveVariant").css("display","block");
}

function showVariantEnableButton(){
  $("#enableVariant").css("display","block");
  $("#disableVariant").css("display","none");
}

function showVariantDisableButton(){
  $("#enableVariant").css("display","none");
  $("#disableVariant").css("display","block");
}
//END OF closers and openers

function editDialogTitle(title){
	// Change title of the edit section dialog
	if(title == "newItem"){
		document.getElementById("editDialogTitle").innerHTML = "New Item";
	}else if(title == "editItem"){
		document.getElementById("editDialogTitle").innerHTML = "Edit Item";
	}
}


// Checks if the title name includes any invalid characters
function validateName(){
	var retValue = false;
	var nme=document.getElementById("name");

	if (nme.value.match(/^[A-Za-zÅÄÖåäö\s\d()]+$/)){
		$('#tooltipTxt').fadeOut();
		$('#saveBtn').removeAttr('disabled');
		$('#submitBtn').removeAttr('disabled');
		nme.style.backgroundColor = "#fff";
		retValue = true;
	}else{
		$('#tooltipTxt').fadeIn();
		$('#submitBtn').attr('disabled','disabled');
		$('#saveBtn').attr('disabled','disabled');
		nme.style.backgroundColor = "#f57";
	}
	return retValue;
}

// Adds a submission row in Edit Variant
function addSubmissionRow() {
	$('#submissions').append("<div style='width:100%;display:flex;flex-wrap:wrap;flex-direction:row;'>"+
					"<select name='type' id='submissionType"+submissionRow+"' style='width:65px;'>"+
						"<option value='pdf'>PDF</option>"+
						"<option value='zip'>Zip</option>"+
						"<option value='link'>Link</option>"+
						"<option value='text'>Text</option>"+
					"</select>"+
					"<input type='text' name='fieldname' id='fieldname"+submissionRow+"' placeholder='Submission name' style='flex:1;margin-left:5px;margin-bottom:3px;height:24.8px;' onkeydown='if (event.keyCode == 13) return false;'/>"+
					"<input type='text' name='instruction' id='instruction"+submissionRow+"' placeholder='Upload instruction' style='flex:3;margin-left:5px;margin-bottom:3px;height:24.8px;' onkeydown='if (event.keyCode == 13) return false;'/>"+
					"<input type='button' class='delButton submit-button' value='-' style='width:32px;margin:0px 0px 3px 5px;'></input><br/>"+
				 "</div>");
	submissionRow++;
}

function createJSONString(formData) {
	// Init the JSON string variable
	var jsonStr = "{";

	// Get the first static fields
	jsonStr += '"' + formData[0]['name'] + '":"' + formData[0]['value'] + '",';
	jsonStr += '"' + formData[1]['name'] + '":"' + formData[1]['value'] + '",';
  if(document.getElementById("extraparam").value !== ""){
      jsonStr+=document.getElementById("extraparam").value+",";
  }
	jsonStr += '"submissions":[';

	// Handle the dynamic amount of submission types
	for(var i = 2; i < formData.length; i++) {
		if(i % 3 == 2) {
			// The start of a new submissions field, prepend with curly bracket
			jsonStr += "{";
		}
		// Input the values of the array. This parses the option-select first, then the textfield. But if the text field is empty, then do not write it to JSON.
		if(formData[i]['value'].length > 0) {
			jsonStr += '"' + formData[i]['name'] + '":"' + formData[i]['value'] + '",';
		}
		if(i % 3 == 1) {
			// This submission field is complete, prepare for next
			// Remove the last comma
			jsonStr = jsonStr.substr(0, jsonStr.length-1);
			// Prepare for next submissions array element.
			jsonStr += "},";
		}
	}
	// Remove the last comma
	jsonStr = jsonStr.substr(0, jsonStr.length-1);
	// Append the end of the submissions array.
	jsonStr += ']'; // The end of the submissions array.
	// Here, the freetext field handling should be added as it comes after the submissions array.
	jsonStr += '}'; // The end of the JSON-string.

	return jsonStr;
}

function getVariantPreview(duggaVariantParam, duggaVariantAnswer, template){
	$("#MarkCont").html(duggaPages[template]);

	$.getScript("templates/"+template+".js")
	  .done(function( script, textStatus ) {
        alert("snus");
		    showFacit(decodeURIComponent(duggaVariantParam),"UNK",decodeURIComponent(duggaVariantAnswer),null,null,null);
	  })
	  .fail(function( jqxhr, settings, exception ) {
      	eval(script);
      	showFacit(decodeURIComponent(duggaVariantParam),"UNK",decodeURIComponent(duggaVariantAnswer));
	});

	$("#resultpopover").css("display", "flex");
}

// function isInArray(array, search){
//     return array.indexOf(search) >= 0;
// }

// function parseParameters(str){
// 	return str;
// }

// function displayfield(res){
// 	$("#autogradeselect"+res).css("display","block");
// }

// function changename(didd,num){
// 	var yes = didd;
// 	$("#did").val(yes);
// 	var name =  $("#duggav"+num).val();
// 	$("#name").val(name);
// 	var nme=$("#name").val();
// 	var did=$("#did").val();

// 	AJAXService("UPDATEDNAME",{cid:querystring['cid'],qid:did,nme:nme,coursevers:querystring['coursevers']},"DUGGA");
// }

// function changeauto(didd,num){
// 	var yes = didd;
// 	$("#did").val(yes);
// 	var auto =  $("#duggav"+num).val();
// 	$("#autograde").val(auto);
// 	var autograde=$("#autograde").val();
// 	var did=$("#did").val();
// 	var autograde=$("#autograde").val();

// 	AJAXService("UPDATEAUTO",{cid:querystring['cid'],qid:did,autograde:autograde,coursevers:querystring['coursevers']},"DUGGA");
// }

// function changegrade(didd,num){
// 	var yes = didd;
// 	$("#did").val(yes);
// 	var auto =  $("#duggav"+num).val();
// 	$("#gradesys").val(auto);
// 	var did=$("#did").val();
// 	var gradesys=$("#gradesys").val();

// 	AJAXService("UPDATEGRADE",{cid:querystring['cid'],qid:did,gradesys:gradesys,coursevers:querystring['coursevers']},"DUGGA");
// }

// function changefile(didd,num){
// 	str="";
// 	for(var j=0;j<filez.length;j++){
// 			filen=filez[j];
// 			if(filen!=".."&&filen!="."){
// 					if(template==filen) str+="<option selected='selected' value='"+filen+"'>"+filen+"</option>"
// 					else str+="<option value='"+filen+"'>"+filen+"</option>"
// 			}
// 	}
// 	$("#template").html(str);
// 	var yes = didd;
// 	$("#did").val(yes);
// 	var templates =  $("#duggav"+num).val();
// 	$("#template").val(templates);
// 	var did=$("#did").val();
// 	var template=$("#template").val();

// 	AJAXService("UPDATETEMPLATE",{cid:querystring['cid'],qid:did,template:template,coursevers:querystring['coursevers']},"DUGGA");
// }

// function closePreview(){
// 	$("#resultpopover").css("display", "none");
// 	$("#overlay").css("display", "none");
// 	document.getElementById("MarkCont").innerHTML = '<div id="MarkCont" style="position:absolute; left:4px; right:4px; top:34px; bottom:4px; border:2px inset #aaa;background:#bbb"> </div>';
// }
