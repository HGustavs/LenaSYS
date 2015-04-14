var sessionkind=0;
var querystring=parseGet();
var filez;

AJAXService("GET",{cid:querystring['cid']},"DUGGA");

$(function() {
  $( "#release" ).datepicker({dateFormat: "yy-mm-dd"});
    $( "#deadline" ).datepicker({dateFormat: "yy-mm-dd"});
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
		
		// Set Variant ID		
		$("#did").val(did);
		
		// Set Dugga name
		$("#dugganamewrapper").html("<input style='float:right;width:390px;' class='form-control textinput' type='text' id='name' placeholder='"+name+"' />");
		
		// Set Release date name
		$("#releasenamewrapper").html("<input class='form-control textinput datepicker hasDatepicker' type='text' id='release' placeholder='"+release+"' />");

		// Set Deadline date name
		$("#deadlinenamewrapper").html("<input class='form-control textinput datepicker hasDatepicker' type='text' id='deadline' placeholder='"+deadline+"' />");

		// Set Autograde
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

function selectVariant(vid,param,answer)
{
		// Alert(vid+" "+param+" "+answer);
		$("#editVariant").css("display","block");
		
		// Set Variant ID		
		$("#vid").val(vid);
		
		// Set Variant parameter
		$("#parameternamewrapper").html("<input style='float:right;width:390px;' class='form-control textinput' type='text' id='parameter' placeholder='"+param+"' />");
		
		// Set Variant answer
		$("#answernamewrapper").html("<input style='float:right;width:390px;' class='form-control textinput' type='text' id='variantanswer' placeholder='"+answer+"' />");
}

//----------------------------------------
// Renderer
//----------------------------------------
function returnedDugga(data)
{
		filez = data['files'];
		// Fill section list with information
		str="";
		if (data['files'].length > 0) {

				str+="<div style='float:right;'>";
				str+="<input class='submit-button' type='button' value='Add Dugga' onclick='createDugga();'/>";
				str+="</div>";
				
				str+="<table class='list'>";

				str+="<tr><th class='first'>Name</th><th>Autograde</th><th>Gradesys</th><th>Template</th><th>Release</th><th>Deadline</th><th>Modified</th><th style='width:30px'></th><th style='width:30px' class='last'></th></tr>";

				for(i=0;i<data['entries'].length;i++){

						var item=data['entries'][i];
						str+="<tr class='fumo'>";

						str+="<td>"+item['name']+"</td>";
						if(item['autograde']=="1"){
								str+="<td>On</td>";
						}else{
								str+="<td>Off</td>";
						}
			
						if(item['gradesystem']=="1"){
								str+="<td>U/G/VG</td>";
						}else if(item['gradesystem']=="2"){
								str+="<td>U/G</td>";
						}else{
								str+="<td>U/3/4/5</td>";
						}

						str+="<td>"+item['template']+"</td>";

						if(item['release']==null){
								str+="<td></td>";
						}else{
							str+="<td>"+item['release'].substr(0,10)+"</td>";						
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
								str+=" onclick='selectDugga(\""+item['did']+"\",\""+item['name']+"\",\""+item['autograde']+"\",\""+item['gradesys']+"\",\""+item['template']+"\",\""+item['release']+"\",\""+item['deadline']+"\");' >";
						str+="</td>";
						str+="</tr>";
						
						var variantz=item['variants'];
						
						if(variantz.length>0){
								str+="<tr class='fumo'><td colspan='9' style='padding:0px;'>";
								str+="<table width='100%' class='innertable'>";
								for(j=0;j<variantz.length;j++){
										var itemz=variantz[j];
										str+="<tr>";
										str+="<td style='width:30px;'></td>"
										str+="<td colspan='1'><div style='overflow:hidden;	max-width: 300px;	max-height: 20px;text-overflow: ellipsis;'>"+itemz['param']+"</div></td>";
										str+="<td colspan='1'>"+itemz['variantanswer']+"</td>";

										str+="<td>"+itemz['modified'].substr(0,10)+"</td>";

										str+="<td style='padding:4px;'>";
												str+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Cogwheel.svg' ";
												str+=" onclick='selectVariant(\""+itemz['vid']+"\",\""+htmlEntities(itemz['param'])+"\",\""+htmlEntities(itemz['variantanswer'])+"\");' >";
										str+="</td>";

										str+="</tr>";
								}
								str+="</table>";
								str+="</td></tr>";
						}
				}

				str+="</table>";

		}

		var slist=document.getElementById("content");
		slist.innerHTML=str;

	  if(data['debug']!="NONE!") alert(data['debug']);

}

		
