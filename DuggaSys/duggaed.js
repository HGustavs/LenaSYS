/********************************************************************************

   Globals

*********************************************************************************/
var sessionkind=0;
var querystring=parseGet();
var filez;
var duggaPages;

AJAXService("GET",{cid:querystring['cid']},"DUGGA");

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

function deleteVariant()
{
	var vid=$("#vid").val();
	if(confirm("Do you really want to delete this Variant?")) AJAXService("DELVARI",{cid:querystring['cid'],vid:vid},"DUGGA");
	$("#editVariant").css("display","none");
}

function toggleVariant()
{
	var vid=$("#vid").val();
	if ($("#toggleVariantButton").val()==="Disable") {
		if(confirm("Do you really want to disable this Variant?")) AJAXService("TOGGLEVARI",{cid:querystring['cid'],vid:vid,disabled:"1"},"DUGGA");
	} else {
		if(confirm("Do you really want to enable this Variant?")) AJAXService("TOGGLEVARI",{cid:querystring['cid'],vid:vid,disabled:"0"},"DUGGA");
	}
	$("#editVariant").css("display","none");
}

function addVariant(cid,qid)
{
	AJAXService("ADDVARI",{cid:cid,qid:qid},"DUGGA");
}

function updateVariant()
{
	$("#editVariant").css("display","none");

	var vid=$("#vid").val();
	var answer=$("#variantanswer").val();
	var parameter=$("#parameter").val();
	
	AJAXService("SAVVARI",{cid:querystring['cid'],vid:vid,variantanswer:answer,parameter:parameter},"DUGGA");
}

function closeEditVariant()
{
	$("#editVariant").css("display","none");
}

function createDugga()
{
	AJAXService("ADDUGGA",{cid:querystring['cid']},"DUGGA");
}

function updateDugga()
{
	$("#editDugga").css("display","none");

	var did=$("#did").val();
	var nme=$("#name").val();
	var autograde=$("#autograde").val();
	var gradesys=$("#gradesys").val();
	var template=$("#template").val();
	var release=$("#release").val();
	var deadline=$("#deadline").val();
	
	AJAXService("SAVDUGGA",{cid:querystring['cid'],qid:did,nme:nme,autograde:autograde,gradesys:gradesys,template:template,release:release,deadline:deadline},"DUGGA");
}

function closeEditDugga()
{
	$("#editDugga").css("display","none");
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

function selectVariant(vid,param,answer,template,dis)
{

	$("#editVariant").css("display","block"); // Display edit dialog
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

		str+="<div style='float:right;padding-bottom:10px;'>";
		str+="<input class='submit-button' type='button' value='Add Dugga' onclick='createDugga();'/>";
		str+="</div>";
		str+="<table class='list'>";
		str+="<tr><th class='first'>Name</th><th>Autograde</th><th>Gradesys</th><th>Template</th><th>Release</th><th>Deadline</th><th>Modified</th><th style='width:30px'></th><th style='width:30px' class='last'></th></tr>";

		for(i=0;i<data['entries'].length;i++){
			
			var item=data['entries'][i];
			
			str+="<tr class='fumo'>";
			result++;
			str+="<td style='width:170px'><input type='text' id='duggav"+result+"' style='font-size:1em;border: 0;border-width:0px;' onchange='changename("+item['did']+","+result+")' placeholder='"+item['name']+"' /></td>";
			if(item['autograde']=="1"){
				result++;
				str+="<td><select onchange='changeauto("+item['did']+","+result+")' style='font-size:1em;' id='duggav"+result+"' ><option selected value='1'>On</option><option value='2'>Off</option></select></td>";
			}else{
				result++;
				str+="<td><select onchange='changeauto("+item['did']+","+result+")' style='font-size:1em;' id='duggav"+result+"' ><option value='1'>On</option><option selected value='2'>Off</option></select></td>";
			}

			if(item['gradesystem']=="1"){
				result++;
				str+="<td><select style='font-size:1em;' onchange='changegrade("+item['did']+","+result+")' id='duggav"+result+"' ><option selected='selected' value='1'>U/G/VG</option><option value='2'>U/G</option><option value='3'>U/3/4/5</option></select></td>";
			}else if(item['gradesystem']=="2"){
				result++;
				str+="<td><select style='font-size:1em;' onchange='changegrade("+item['did']+","+result+")' id='duggav"+result+"' ><option value='1'>U/G/VG</option><option value='2' selected='selected'>U/G</option><option value='3'>U/3/4/5</option></select></td>";
			}else{
				result++;
				str+="<td><select style='font-size:1em;' onchange='changegrade("+item['did']+","+result+")' id='duggav"+result+"' ><option value='1'>U/G/VG</option><option value='2'>U/G</option><option selected='selected' value='3'>U/3/4/5</option></select></td>";
			}
			result++;
			str+="<td><select style='font-size:1em;' onchange='changefile("+item['did']+","+result+")' id='duggav"+result+"'>";		
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
			str+=" onclick='addVariant(\""+querystring['cid']+"\",\""+item['did']+"\");' >";
			str+="</td>";


			str+="<td style='padding:4px;'>";
			str+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Cogwheel.svg' ";
			str+=" onclick='selectDugga(\""+item['did']+"\",\""+item['name']+"\",\""+item['autograde']+"\",\""+item['gradesystem']+"\",\""+item['template']+"\",\""+item['release']+"\",\""+item['deadline']+"\");' >";
			str+="</td>";
			str+="</tr>";
			
			var variantz=item['variants'];
			
			if(variantz.length>0){
				str+="<tr class='fumo'><td colspan='9' style='padding:0px;'>";
				str+="<table width='100%' class='innertable'>";
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
					str+="<td style='width:30px;'></td>"
					result++;
					str+="<td colspan='1'><div style='overflow:hidden;	max-width: 300px;	max-height: 20px;text-overflow: ellipsis;'><input type='text' id='duggav"+result+"' style='font-size:1em;border: 0;border-width:0px;' onchange='changeparam("+itemz['vid']+","+result+")' placeholder='"+itemz['param']+"' /></td></div></td>";
					result++;
					str+="<td colspan='1'><input type='text' id='duggav"+result+"' style='font-size:1em;border: 0;border-width:0px;' onchange='changeanswer("+itemz['vid']+","+result+")' placeholder='"+itemz['variantanswer']+"' /></td>";

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

}

function parseParameters(str){
	return str;
}

function getVariantPreview(duggaVariantParam, duggaVariantAnswer, template){
	$("#MarkCont").html(duggaPages[template]);

	$.getScript("templates/"+template+".js")
	  .done(function( script, textStatus ) {	    	    
		
		showFacit(duggaVariantParam,"UNK",duggaVariantAnswer,[0,0,0,0]);
		
	  })
	  .fail(function( jqxhr, settings, exception ) {
	  	console.log(jqxhr);
	  	console.log(settings);
	  	console.log(exception);	    
	  	eval(script);
	  	showFacit(duggaVariantParam,"UNK",duggaVariantAnswer);
	});

	$("#resultpopover").css("display", "block");
	
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
	
	AJAXService("UPDATEDNAME",{cid:querystring['cid'],qid:did,nme:nme},"DUGGA");
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
	
	AJAXService("UPDATEAUTO",{cid:querystring['cid'],qid:did,autograde:autograde},"DUGGA");
}
function changegrade(didd,num)
{
	var yes = didd;
	$("#did").val(yes);
	var auto =  $("#duggav"+num).val();
	$("#gradesys").val(auto);
	var did=$("#did").val();
	var gradesys=$("#gradesys").val();
	
	AJAXService("UPDATEGRADE",{cid:querystring['cid'],qid:did,gradesys:gradesys},"DUGGA");

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
	
	AJAXService("UPDATETEMPLATE",{cid:querystring['cid'],qid:did,template:template},"DUGGA");
}

function changeparam(vidd,num)
{
	var yes = vidd;
	$("#vid").val(yes);
	var paraa =  $("#duggav"+num).val();
	$("#parameter").val(paraa);
	var vid=$("#vid").val();
	var parameter=$("#parameter").val();
	
	AJAXService("SAVVARIPARA",{cid:querystring['cid'],vid:vid,parameter:parameter},"DUGGA");
}
function changeanswer(vidd,num)
{
	var yes = vidd;
	$("#vid").val(yes);
	var answerd =  $("#duggav"+num).val();
	$("#variantanswer").val(answerd);
	var vid=$("#vid").val();
	var answer=$("#variantanswer").val();

	AJAXService("SAVVARIANSWER",{cid:querystring['cid'],vid:vid,variantanswer:answer},"DUGGA");
}

function closePreview()
{
	$("#resultpopover").css("display", "none");
	document.getElementById("MarkCont").innerHTML = '<div id="MarkCont" style="position:absolute; left:4px; right:4px; top:34px; bottom:4px; border:2px inset #aaa;background:#bbb"> </div>';
}