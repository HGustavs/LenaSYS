/********************************************************************************

   Globals

*********************************************************************************/
var sessionkind=0;
var querystring=parseGet();
var filez;
var variant = [];
var submissionRow = 0;
var decider;
var itemToDelete;
var list = "";


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
//----------------------------------------
// Commands:
//----------------------------------------

// Adds a submission row in Edit Variant
function addSubmissionRow() {
	$('#submissions').append("<div style='width:100%;display:flex;flex-wrap:wrap;flex-direction:row;'>"+
					"<select name='type' id='submissionType"+submissionRow+"' style='width:65px;'>"+
						"<option value='pdf'>PDF</option>"+
						"<option value='zip'>Zip</option>"+
						"<option value='link'>Link</option>"+
						"<option value='text'>Text</option>"+
            "<option value='text'>Text</option>"+
					"</select>"+
					"<input type='text' name='fieldname' class='fieldnameRows' id='fieldname"+submissionRow+"' placeholder='Submission name' style='flex:1;margin-bottom:3px;height:24.8px;' onkeydown='if (event.keyCode == 13) return false;'/>"+
					"<input type='text' name='instruction' id='instruction"+submissionRow+"' placeholder='Upload instruction' style='flex:3;margin-bottom:3px;height:25px;' onkeydown='if (event.keyCode == 13) return false;'/>"+
					"<input type='button' class='delButton submit-button' value='-' style='width:32px;margin:0px 0px 3px 0px;'></input>"+
				 "</div>");
	submissionRow++;
}

/**
* @TODO Make it possible to allow for no submission fields, or omission of any other field.
* @TODO Add the free text field submission.
* This function demands specific names on the form fields, elaborate on this
* @param formData an array of the "Edit Variant: Param" form.
* @return a JSON string
*/
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

function selectVariant(vid,param,answer,template,dis)
{
	$("#editVariant").css("display","flex"); // Display edit dialog
	//$("#overlay").css("display","block");
	$("#vid").val(vid); // Set Variant ID
	$("#parameter").val(decodeURIComponent(param)); // Set Variant parameter
	$("#variantanswer").val(decodeURIComponent(answer)); // Set Variant answer
	if(dis.localeCompare("1")===0){
		$("#toggleVariantButton").val("Enable");
	} else {
		$("#toggleVariantButton").val("Disable");
	}

	//Parse JSON to add data to forms again
	var data = $("#parameter").val();
	if(data == "" || data == "UNK"){}
	else{
		var result = JSON.parse(data);
		//Adds data to forms
		if(result["type"]!=undefined){
			$("#type").val(result["type"]);
		}

		if(result["filelink"]!=undefined){
			$("#filelink").val(result["filelink"]);
		}

		if(result["submissions"]!=undefined){
			//Adds more submission rows if necessary
			for(i = 0; i < result["submissions"].length; i++){
				if(i > 0 && i <= submissionRow) {
					addSubmissionRow();
				}
				if(result["submissions"][i]["type"]!=undefined){
					$("#submissionType"+i).val(result["submissions"][i]["type"]);
				}
				if(result["submissions"][i]["fieldname"]!=undefined){
					$("#fieldname"+i).val(result["submissions"][i]["fieldname"]);
				}
				if(result["submissions"][i]["instruction"]!=undefined){
					$("#instruction"+i).val(result["submissions"][i]["instruction"]);
				}
			}
		}
	}
}

function closeVariant(){
	//Hides error message
	$("#submissionError").css("display", "none");
	for(i=0; i<submissionRow; i++){
		$("#fieldname"+i).css("background-color", "white");
	}
	//Removes data from forms, going back to original style
	$("#type").val("md");
	$("#filelink").val("");
	for(i = 0; i < 100; i++){
		$("#submissionType"+i).val("pdf");
		$("#fieldname"+i).val("");
		$("#instruction"+i).val("");
	}
	//Removes all submission rows
	for(i=0; i < submissionRow; i++){
		$("#submissionType"+i).parent().remove();
	}
	submissionRow=0;
	//Adds one submission row so that one is visible next time it's opened
	addSubmissionRow();
}

function deleteVariant()
{
	var vid=$("#vid").val();
	if(confirm("Do you really want to delete this Variant?")) AJAXService("DELVARI",{cid:querystring['cid'],vid:vid,coursevers:querystring['coursevers']},"DUGGA");
	$("#editVariant").css("display","none");
	//$("#overlay").css("display","none");
}

function toggleVariant()
{
	var vid=$("#vid").val();
	if ($("#toggleVariantButton").val()==="Disable") {
		if(confirm("Do you really want to disable this Variant?")) AJAXService("TOGGLEVARI",{cid:querystring['cid'],vid:vid,disabled:"1",coursevers:querystring['coursevers']},"DUGGA");
	} else {
		if(confirm("Do you really want to enable this Variant?")) AJAXService("TOGGLEVARI",{cid:querystring['cid'],vid:vid,disabled:"0",coursevers:querystring['coursevers']},"DUGGA");
	}
	$("#editVariant").css("display","none");
	//$("#overlay").css("display","none");
}

function addVariant(cid,qid)
{
	AJAXService("ADDVARI",{cid:cid,qid:qid,coursevers:querystring['coursevers']},"DUGGA");
}

function updateVariant()
{
	var fieldnames = [];
	var rows = $(".fieldnameRows").length;

	$(".fieldnameRows").each(function(){
		fieldnames.push($(this).val());
		$(this).css("background-color", "white");
	});
	fieldnames.sort();

	var correct;
	var value = [];

	//If the same fieldname has been input more than once
	for(i=0; i<fieldnames.length; i++){
		if(fieldnames[i]==fieldnames[i+1]){
			correct = "no";
			value.push(fieldnames[i]);
		}
	}

	//If wrong fieldnames (same name used more than once)
	if(correct=="no"){
		$("#submissionError").css("display", "block");
		for(i=0; i<rows; i++){
			for(j=0; j<value.length; j++){
				if($("#fieldname"+i).val()==value[j]){
					$("#fieldname"+i).css("background-color", "rgba(255, 0, 6, 0.2)");
				}
			}
		}
	}
	//If correct input in forms, close box
	else{
		$('#parameter').val(createJSONString($('#jsonform').serializeArray()));
		$("#editVariant").css("display","none");
		//$("#overlay").css("display","none");

		var vid=$("#vid").val();
		var answer=$("#variantanswer").val();
		var parameter=$("#parameter").val();

		AJAXService("SAVVARI",{cid:querystring['cid'],vid:vid,variantanswer:answer,parameter:parameter,coursevers:querystring['coursevers']},"DUGGA");

		closeVariant();
	}
}

function closeEditVariant()
{
	$("#editVariant").css("display","none");
}


// Displaying and hidding the dynamic comfirmbox for the section edit dialog
function confirmBox(operation, item) {
	if(operation == "openConfirmBox") {
		itemToDelete = item; // save the item to delete in this variable
		$("#sectionConfirmBox").css("display","flex");
	} else if (operation == "deleteItem") {
		deleteDugga(itemToDelete);
		$("#sectionConfirmBox").css("display","none");
	} else if (operation == "closeConfirmBox") {
		$("#sectionConfirmBox").css("display","none");
	}
}

function createDugga()
{
	decider = "createDugga";
	var did=$("#did").val();
	var nme=$("#name").val();
	var autograde=$("#autograde").val();
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

function deleteDugga(did)
{
//    if(confirm("Do you really want to delete this dugga?"))AJAXService("DELDU",{cid:querystring['cid'],qid:did,coursevers:querystring['coursevers']},"DUGGA");
	AJAXService("DELDU",{cid:querystring['cid'],qid:did,coursevers:querystring['coursevers']},"DUGGA");
	$("#editDugga").css("display","none");
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


function updateDugga()
{
	$("#editDugga").css("display","none");
	//$("#overlay").css("display","none");

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


	AJAXService("SAVDUGGA",{cid:querystring['cid'],qid:did,nme:nme,autograde:autograde,gradesys:gradesys,template:template,qstart:qstart,deadline:deadline,deadline2:deadline2,deadline3:deadline3,release:release,coursevers:querystring['coursevers']},"DUGGA");
}

function closeEditDugga()
{
	$("#editDugga").css("display","none");
	document.getElementById("name").style.backgroundColor = "#fff";  // Resets color for name input
	$('#submitBtn').removeAttr('disabled');  						 // Resets submit button to its default form
	$('#saveBtn').removeAttr('disabled');  						 	 // Resets save button to its default form
	$('#tooltipTxt').css("display","none");							 // Resets tooltip text to its default form
	//$("#overlay").css("display","none");
}

function showLoginPopup()
{
	$("#loginBox").css("display","block");
	//$("#overlay").css("display","block");
}

function hideLoginPopup()
{
	$("#loginBox").css("display","none");
	//$("#overlay").css("display","none");
}

function showSubmitButton(){
  $(".submitDugga").css("display","inline-block");
  $(".updateDugga").css("display","none");
  $(".deleteDugga").css("display","none");
  $(".closeDugga").css("display","inline-block");
  //$("#overlay").css("display","block");
}

function showSaveButton(){
  $(".submitDugga").css("display","none");
  $(".updateDugga").css("display","block");
  $(".deleteDugga").css("display","block");
  $(".closeDugga").css("display","none");
//  $("#overlay").css("display","none");
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


function newDugga()
{
	document.getElementById('name').value='New Dugga';
	document.getElementById('release').value='2017-05-15';
	document.getElementById('deadline').value='2017-07-31';
	document.getElementById('deadline2').value='';
	document.getElementById('deadline3').value='';
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

function selectVariant(vid,param,answer,template,dis)
{

	$("#editVariant").css("display","flex"); // Display edit dialog
	//$("#overlay").css("display","block");
	$("#vid").val(vid); // Set Variant ID
	//var pparam = parseParameters(param);
	$("#parameter").val(decodeURIComponent(param)); // Set Variant parameter
	//var panswer = parseParameters(answer);
	$("#variantanswer").val(decodeURIComponent(answer)); // Set Variant answer
	if(dis.localeCompare("1")===0){
		$("#toggleVariantButton").val("Enable"); // Set Variant answer
	} else {
		$("#toggleVariantButton").val("Disable"); // Set Variant answer
	}

	//Parse JSON to add data to forms again
	var data = $("#parameter").val();
	if(data == "" || data == "UNK"){}
	else{
		var result = JSON.parse(data);
		//Adds data to forms
		if(result["type"]!=undefined){
			$("#type").val(result["type"]);
		}

		if(result["filelink"]!=undefined){
			$("#filelink").val(result["filelink"]);
		}

		if(result["submissions"]!=undefined){
			//Adds more submission rows if necessary
			for(i = 0; i < result["submissions"].length; i++){
				if(i > 0 && i <= submissionRow) {
					addSubmissionRow();
				}
				if(result["submissions"][i]["type"]!=undefined){
					$("#submissionType"+i).val(result["submissions"][i]["type"]);
				}
				if(result["submissions"][i]["fieldname"]!=undefined){
					$("#fieldname"+i).val(result["submissions"][i]["fieldname"]);
				}
				if(result["submissions"][i]["instruction"]!=undefined){
					$("#instruction"+i).val(result["submissions"][i]["instruction"]);
				}
			}
		}
	}

}

function closeVariant(){
	//Removes data from forms, going back to original style
	$("#type").val("md");
	$("#filelink").val("");
	for(i = 0; i < 100; i++){
		$("#submissionType"+i).val("pdf");
		$("#fieldname"+i).val("");
		$("#instruction"+i).val("");
	}
	//Removes all submission rows
	for(i=0; i < submissionRow; i++){
		$("#submissionType"+i).parent().remove();
	}
	submissionRow=0;
	//Adds one submission row so that one is visible next time it's opened
	addSubmissionRow();
}

function isInArray(array, search)
{
    return array.indexOf(search) >= 0;
}

function showVariant(param){
    var variantId="#variantInfo" + param;
    var duggaId="#dugga" + param;
    var arrowId="#arrow" + param;
    var index = variant.indexOf(param);


    if (document.getElementById("variantInfo"+param) && document.getElementById("dugga"+param)) { // Check if dugga row and corresponding variant
        if(!isInArray(variant, param)){
             variant.push(param);
        }

        if($(duggaId).hasClass("selectedtr")){ // Add a class to dugga if it is not already set and hide/show variant based on class.
            $(variantId).hide();
            $(duggaId).removeClass("selectedtr");
            $(arrowId).html("&#9658;");
            if (index > -1) {
               variant.splice(index, 1);
            }

        } else {
            $(duggaId).addClass("selectedtr");
            $(variantId).slideDown();
            $(arrowId).html("&#x25BC;");
        }

        $(variantId).css("border-bottom", "1px solid gray");
    }
}

function showVariantz(param){
    var index = variant.indexOf(param);
    if(!isInArray(variant, param)){
         variant.push(param);
    }
}

function returnedQuiz(data) {
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


// Start of rendering the table
var myTable;
function returnedDugga(data) {
	filez = data;

    var tabledata = {
    	tblhead:{
    		arrow:"->",
    		qname:"Name",
    		autograde:"Autograde",
    		gradesystem:"Gradesystem",
    		quizFile:"Template",
    		deadline:"Deadline",
    		qrelease:"Result date",
    		modified:"Last modified",
    		cogwheel:"*",
    		trashcan:"-"
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
	duggaPages = data['duggaPages'];

	str="";

}

// Rendring specific cells
function renderCell(col,celldata,cellid) {
	list+= celldata + " ";
	
	// Translating autograding from integers to show the data like yes/no.
	if (col == "autograde"){
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
	    str="<img id='dorf' class='trashcanIcon' src='../Shared/icons/Cogwheel.svg' ";
		str+=" onclick='selectDugga(\""+object+"\");' >";
		return str;
	}

	// Placing a clickable trash can in its designated column and implementing the code behind it.
	else if (col == "trashcan"){
		object=JSON.parse(celldata);
		list+= ",";
	    str="<img id='dorf' class='trashcanIcon' src='../Shared/icons/Trashcan.svg' ";
		str+=" onclick='confirmBox(\"openConfirmBox\",\""+object+"\");' >";
		return str;
	}
	return celldata;
}
// End of rendering the table.

function parseParameters(str){
	return str;
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
	//$("#overlay").css("display", "block");

}


function displayfield(res)
{
	$("#autogradeselect"+res).css("display","block");
}

function changename(didd,num)
{
	var yes = didd;
	$("#did").val(yes);
	var name =  $("#duggav"+num).val();
	$("#name").val(name);
	var nme=$("#name").val();
	var did=$("#did").val();

	AJAXService("UPDATEDNAME",{cid:querystring['cid'],qid:did,nme:nme,coursevers:querystring['coursevers']},"DUGGA");
}
function changeauto(didd,num)
{
	var yes = didd;
	$("#did").val(yes);
	var auto =  $("#duggav"+num).val();
	$("#autograde").val(auto);
	var autograde=$("#autograde").val();
	var did=$("#did").val();
	var autograde=$("#autograde").val();

	AJAXService("UPDATEAUTO",{cid:querystring['cid'],qid:did,autograde:autograde,coursevers:querystring['coursevers']},"DUGGA");
}
function changegrade(didd,num)
{
	var yes = didd;
	$("#did").val(yes);
	var auto =  $("#duggav"+num).val();
	$("#gradesys").val(auto);
	var did=$("#did").val();
	var gradesys=$("#gradesys").val();

	AJAXService("UPDATEGRADE",{cid:querystring['cid'],qid:did,gradesys:gradesys,coursevers:querystring['coursevers']},"DUGGA");

}
function changefile(didd,num)
{
	str="";
	for(var j=0;j<filez.length;j++){
			filen=filez[j];
			if(filen!=".."&&filen!="."){
					if(template==filen) str+="<option selected='selected' value='"+filen+"'>"+filen+"</option>"
					else str+="<option value='"+filen+"'>"+filen+"</option>"
			}
	}
	$("#template").html(str);
	var yes = didd;
	$("#did").val(yes);
	var templates =  $("#duggav"+num).val();
	$("#template").val(templates);
	var did=$("#did").val();
	var template=$("#template").val();

	AJAXService("UPDATETEMPLATE",{cid:querystring['cid'],qid:did,template:template,coursevers:querystring['coursevers']},"DUGGA");
}

function changeparam(vidd,num)
{
	var yes = vidd;
	$("#vid").val(yes);
	var paraa =  $("#duggav"+num).val();
	$("#parameter").val(paraa);
	var vid=$("#vid").val();
	var parameter=$("#parameter").val();

	AJAXService("SAVVARIPARA",{cid:querystring['cid'],vid:vid,parameter:parameter,coursevers:querystring['coursevers']},"DUGGA");
}
function changeanswer(vidd,num)
{
	var yes = vidd;
	$("#vid").val(yes);
	var answerd =  $("#duggav"+num).val();
	$("#variantanswer").val(answerd);
	var vid=$("#vid").val();
	var answer=$("#variantanswer").val();

	AJAXService("SAVVARIANSWER",{cid:querystring['cid'],vid:vid,variantanswer:answer,coursevers:querystring['coursevers']},"DUGGA");
}

function closePreview()
{
	$("#resultpopover").css("display", "none");
	$("#overlay").css("display", "none");
	document.getElementById("MarkCont").innerHTML = '<div id="MarkCont" style="position:absolute; left:4px; right:4px; top:34px; bottom:4px; border:2px inset #aaa;background:#bbb"> </div>';

}

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
          	showSaveButton();
        }
      });
});
