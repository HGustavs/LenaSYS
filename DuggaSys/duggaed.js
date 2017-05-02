/********************************************************************************

   Globals

*********************************************************************************/
var sessionkind=0;
var querystring=parseGet();
var filez;
var variant = [];
var submissionRow = 0;

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
	$('#deadline').datepicker({
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
					"</select>"+
					"<input type='text' name='fieldname' class='fieldnameRows' id='fieldname"+submissionRow+"' placeholder='Submission name' style='flex:1;margin-left:5px;margin-bottom:3px;height:24.8px;' onkeydown='if (event.keyCode == 13) return false;'/>"+
					"<input type='text' name='instruction' id='instruction"+submissionRow+"' placeholder='Upload instruction' style='flex:3;margin-left:5px;margin-bottom:3px;height:24.8px;' onkeydown='if (event.keyCode == 13) return false;'/>"+
					"<input type='button' class='delButton submit-button' value='-' style='width:32px;margin:0px 0px 3px 5px;'></input><br/>"+
				 "</div>");
	submissionRow++;
}

function selectVariant(vid,param,answer,template,dis)
{
	$("#editVariant").css("display","block"); // Display edit dialog
	$("#overlay").css("display","block"); 
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
	$("#overlay").css("display","none");
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
	$("#overlay").css("display","none");
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
		$("#editVariant").css("display","none");
		$("#overlay").css("display","none");
		
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

function createDugga()
{
	AJAXService("ADDUGGA",{cid:querystring['cid'],coursevers:querystring['coursevers']},"DUGGA");
}

function deleteDugga()
{
    did=$("#did").val();
    if(confirm("Do you really want to delete this dugga?")) AJAXService("DELDU",{cid:querystring['cid'],qid:did,coursevers:querystring['coursevers']},"DUGGA");
    $("#editDugga").css("display","none");
    $("#overlay").css("display","none");
}

function updateDugga()
{
	$("#editDugga").css("display","none");
	$("#overlay").css("display","none");

	var did=$("#did").val();
	var nme=$("#name").val();
	var autograde=$("#autograde").val();
	var gradesys=$("#gradesys").val();
	var template=$("#template").val();
	var release=$("#release").val();
	var deadline=$("#deadline").val();
	console.log(deadline);

	AJAXService("SAVDUGGA",{cid:querystring['cid'],qid:did,nme:nme,autograde:autograde,gradesys:gradesys,template:template,release:release,deadline:deadline,coursevers:querystring['coursevers']},"DUGGA");
}

function closeEditDugga()
{
	$("#editDugga").css("display","none");
	$("#overlay").css("display","none");
}

function showLoginPopup()
{
	$("#loginBox").css("display","block");
	$("#overlay").css("display","block");
}

function hideLoginPopup()
{
	$("#loginBox").css("display","none");
	$("#overlay").css("display","none");
}

function selectDugga(did,name,autograde,gradesys,template,release,deadline)
{
	$("#editDugga").css("display","block");
	$("#overlay").css("display","block");
	$("#did").val(did); // Set Variant ID
	$("#name").val(name); // Set Dugga name
	$("#release").val(release); // Set Release date name
	$("#deadline").val(deadline); // Set Deadline date name

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
//----------------------------------------
// Renderer
//----------------------------------------
var alla = 0;
function returnedDugga(data)
{
	$("content").html();
	var result = 0;
	filez = data['files'];
	duggaPages = data['duggaPages'];

	str="";
	if (data['files'].length > 0) {

		str+="<div class='titles' style='padding-top:10px;'>";
		str+="<h1 style='flex:10;text-align:center;'>Tests</h1>";
		str+="<input style='float:none;flex:1;max-width:85px;' class='submit-button' type='button' value='Add Dugga' onclick='createDugga();'/>";
		str+="</div>";
		
		str+="<table class='list' id='testTable'>";
		str+="<tr><th></th><th class='first'>Name</th><th>Autograde</th><th>Gradesys</th><th>Template</th><th>Release</th><th>Deadline</th><th>Modified</th><th style='width:30px'></th><th style='width:30px' class='last'></th></tr>";

		for(i=0;i<data['entries'].length;i++){

			var item=data['entries'][i];
      
			str+="<tr class='fumo' id='dugga" +i+ "'>";

			result++;
            str+="<td id='arrowz' onClick='showVariant("+i+")'><span class='arrow' id='arrow"+i+"'>&#9658;</span></td>";
			str+="<td><label>Name: </label><input type='text' id='duggav"+result+"' style='font-size:1em;border: 0;border-width:0px;' onchange='changename("+item['did']+","+result+")' placeholder='"+item['name']+"' /></td>";
			if(item['autograde']=="1"){
				result++;
				str+="<td><label>Autograde: </label><select onchange='changeauto("+item['did']+","+result+")' style='font-size:1em;' id='duggav"+result+"' ><option selected value='1'>On</option><option value='2'>Off</option></select></td>";
			}else{
				result++;
				str+="<td><label>Autograde: </label><select onchange='changeauto("+item['did']+","+result+")' style='font-size:1em;' id='duggav"+result+"' ><option value='1'>On</option><option selected value='2'>Off</option></select></td>";
			}

			if(item['gradesystem']=="1"){
				result++;
				str+="<td><label>Grade System: </label><select style='font-size:1em;' onchange='changegrade("+item['did']+","+result+")' id='duggav"+result+"' ><option selected='selected' value='1'>U/G/VG</option><option value='2'>U/G</option><option value='3'>U/3/4/5</option></select></td>";
			}else if(item['gradesystem']=="2"){
				result++;
				str+="<td class='gradesystem'><label>Grade System: </label><select style='font-size:1em;' onchange='changegrade("+item['did']+","+result+")' id='duggav"+result+"' ><option value='1'>U/G/VG</option><option value='2' selected='selected'>U/G</option><option value='3'>U/3/4/5</option></select></td>";
			}else{
				result++;
				str+="<td><label>Grade System: </label><select style='font-size:1em;' onchange='changegrade("+item['did']+","+result+")' id='duggav"+result+"' ><option value='1'>U/G/VG</option><option value='2'>U/G</option><option selected='selected' value='3'>U/3/4/5</option></select></td>";
			}
			result++;

			str+="<td><label>Template: </label><select style='font-size:1em;' onchange='changefile("+item['did']+","+result+")' id='duggav"+result+"'>";

			for(var j=0;j<filez.length;j++){
				filen=filez[j];
				if(filen!=".."&&filen!="."){
					if(item['template']==filen) str+="<option selected='selected' value='"+filen+"'>"+filen+"</option>"
					else str+="<option value='"+filen+"'>"+filen+"</option>"
				}
			}

			str+="</select></td>";

			if(item['release']==null){
				str+="<td></td>";
			}else{
			result++;
				str+="<td>"+item['release'].substr(0,10)+"</td>";
				//Set the min-date for a deadline to be the release date
				$('#deadline').datepicker("option","minDate", item['release']);
			}

			if(item['deadline']==null){
				str+="<td></td>";
			}else{
				str+="<td>"+item['deadline'].substr(0,10)+"</td>";
			}

			str+="<td>"+item['modified'].substr(0,10)+"</td>";

			str+="<td style='padding:4px;'>";
			str+="<img id='plorf' style='float:left;margin-right:4px;' src='../Shared/icons/PlusU.svg' ";
			str+=" onclick=' showVariantz("+i+"); addVariant(\""+querystring['cid']+"\",\""+item['did']+"\");'>";
			str+="</td>";


			str+="<td style='padding:4px;'>";
			str+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Cogwheel.svg' ";
			str+=" onclick='selectDugga(\""+item['did']+"\",\""+item['name']+"\",\""+item['autograde']+"\",\""+item['gradesystem']+"\",\""+item['template']+"\",\""+item['release']+"\",\""+item['deadline']+"\");' >";
			str+="</td>";
			str+="</tr>";

			var variantz=item['variants'];

			if(variantz.length>0){
                
				str+="<tr class='variantInfo' id='variantInfo"+i+"'><td colspan='10' style='padding:0px;'>";
				str+="<table width='100%' class='innertable' id='testinnertable'>";
				for(j=0;j<variantz.length;j++){
					var itemz=variantz[j];
					var paramz = encodeURIComponent("{}");
					var answerz = encodeURIComponent("{}");;
					if (itemz['param'] !== null){ paramz = encodeURIComponent(itemz['param']); }
					if (itemz['variantanswer'] !== null){ answerz = encodeURIComponent(itemz['variantanswer']);	}
					str+="<tr";
					if(itemz['disabled'] === null || itemz['disabled'].localeCompare("1")===0){
						str += " class='disabled-dugga' style='opacity:0.2;'>"
					} else {
						str += ">"
					}
					str+="<td colspan='1' style='padding-right:50px;'></td>";
					result++;
					str+="<td colspan='1'><label>Params: </label><input type='text' id='duggav"+result+"' style='font-size:1em;border: 0;border-width:0px;' onchange='changeparam("+itemz['vid']+","+result+")' placeholder='"+itemz['param']+"' /></td></td>";
					result++;
					str+="<td colspan='2'><label>Answer: </label><input type='text' id='duggav"+result+"' style='font-size:1em;border: 0;border-width:0px;' onchange='changeanswer("+itemz['vid']+","+result+")' placeholder='"+itemz['variantanswer']+"' /></td>";

					str+="<td>"+itemz['modified'].substr(0,10)+"</td>";

					str+="<td style='padding:4px;'>";
					str+="<img id='variantPlay"+j+"' style='float:right;margin-right:4px;' src='../Shared/icons/PlayT.svg' ";
					str+=" onclick='getVariantPreview(\""+paramz+"\",\""+answerz+"\",\""+item['template']+"\")' >";
					str+="<img id='dorf"+j+"' style='float:right;margin-right:4px;' src='../Shared/icons/Cogwheel.svg' ";
					str+=" onclick='selectVariant(\""+itemz['vid']+"\",\""+paramz+"\",\""+answerz+"\",\"UNK\",\""+itemz['disabled']+"\");' >";
					str+="</td>";
                    
					str+="</tr>";
				}
				str+="</table>";
				str+="</td></tr>";
			}
		}

		str+="</table>";
	}
	alla = result;
	var slist=document.getElementById("content");
	slist.innerHTML=str;
	if(data['debug']!="NONE!") alert(data['debug']);
    
    var length = variant.length;
    for(index = 0;  index < length; index++){
        showVariant(variant[index]);
    }
    
    var variantLength = data['entries'].length;
    for(idx = 0; idx < variantLength; idx++) {
        if (!document.getElementById("variantInfo"+idx) && document.getElementById("dugga"+idx)) {
            $("#arrow"+idx).hide();
        }
    }
}

function parseParameters(str){
	return str;
}

function getVariantPreview(duggaVariantParam, duggaVariantAnswer, template){
	$("#MarkCont").html(duggaPages[template]);

	$.getScript("templates/"+template+".js")
	  .done(function( script, textStatus ) {

		showFacit(decodeURIComponent(duggaVariantParam),"UNK",decodeURIComponent(duggaVariantAnswer),null,null,null);

	  })
	  .fail(function( jqxhr, settings, exception ) {
	  	console.log(jqxhr);
	  	console.log(settings);
	  	console.log(exception);
	  	eval(script);
	  	showFacit(decodeURIComponent(duggaVariantParam),"UNK",decodeURIComponent(duggaVariantAnswer));
	});

	$("#resultpopover").css("display", "block");
	$("#overlay").css("display", "block");

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
