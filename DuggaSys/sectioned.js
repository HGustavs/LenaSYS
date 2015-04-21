var querystring=parseGet();
var retdata;

AJAXService("get",{},"SECTION");

//----------------------------------------
// Commands:
//----------------------------------------

var xelink;

function displaymessage(){
   $(".messagebox").css("display","block");
}
$(document).ready(function(){
    $(".messagebox").hover(function(){
        $("#testbutton").css("background-color", "red");
    });
	$(".messagebox").mouseout(function(){
        $("#testbutton").css("background-color", "#614875");
    });
});
function selectItem(lid,entryname,kind,evisible,elink,moment,gradesys)
{
		
	xelink=elink;
		
	// Display Select Marker
	$(".item").css("border","none");
	$(".item").css("box-shadow","none");
	$("#I"+lid).css("border","2px dashed #FC5");
	$("#I"+lid).css("box-shadow","1px 1px 3px #000 inset");
		
	// Set GradeSys
	str="";
	if(gradesys==null||gradesys==0) str+="<option selected='selected' value='0'>-</option>"
	else str+="<option value='0'>-</option>";
	
	if(gradesys==1) str+="<option selected='selected' value='1'>U-G-VG</option>"
	else str+="<option value='1'>U-G-VG</option>";
	
	if(gradesys==2) str+="<option selected='selected' value='2'>U-G</option>"
	else str+="<option value='2'>U-G</option>";
	
	if(gradesys==3) str+="<option selected='selected' value='3'>U-3-4-5</option>"
	else str+="<option value='3'>U-3-4-5</option>";

	$("#gradesys").html(str);
	
	// Set Moments
	str="";
	if (retdata['entries'].length > 0) {		
		
		// Account for null
		if(moment=="") str+="<option selected='selected' value='null'>&lt;None&gt;</option>"
		else str+="<option value='null'>&lt;None&gt;</option>";
		
		// Account for rest of moments!
		for(var i=0;i<retdata['entries'].length;i++){
			var item=retdata['entries'][i];
			if(item['kind']==4){
				if(parseInt(moment)==parseInt(item['lid'])) str+="<option selected='selected' value='"+item['lid']+"'>"+item['entryname']+"</option>";
				else str+="<option value='"+item['lid']+"'>"+item['entryname']+"</option>";
			}
		}		
	}
	$("#moment").html(str);

	// Set Name		
	//$("#sectionname").val(entryname);
	$("sectionnamewrapper").html("<input type='text' class='form-control textinput' id='sectionname' value='"+entryname+"' style='width:448px;'/>");

	// Set Lid	
	$("#lid").val(lid);

	// Set Kind
	str="";
	if(kind==0) str+="<option selected='selected' value='0'>Header</option>"
	else str+="<option value='0'>Header</option>";
	
	if(kind==1) str+="<option selected='selected' value='1'>Section</option>"
	else str+="<option value='1'>Section</option>";
	
	if(kind==2) str+="<option selected='selected' value='2'>Code</option>"
	else str+="<option value='2'>Code</option>";
	
	if(retdata['duggor'].length == 0){
		str+="<option disabled>Test</option>";
		displaymessage();
	}else{
		if(kind==3) str+="<option selected='selected' value='3'>Test</option>"
		else str+="<option value='3'>Test</option>";
	}
	
	if(kind==4) str+="<option selected='selected' value='4'>Moment</option>"
	else str+="<option value='4'>Moment</option>";
	
	if(kind==5) str+="<option selected='selected' value='5'>Link</option>"
	else str+="<option value='5'>Link</option>";
	$("#type").html(str);
					
	// Set Visibiliy
	str="";
	if(evisible==0) str+="<option selected='selected' value='0'>Hidden</option>"
	else str+="<option value='0'>Hidden</option>";
	
	if(evisible==1) str+="<option selected='selected' value='1'>Public</option>"
	else str+="<option value='1'>Public</option>";
	$("#visib").html(str);

	// Set Link
	$("#link").val(elink);

	// Graying of Link
	if((kind==5)||(kind==3)){
		$("#linklabel").css("opacity","1.0");				
		$("#link").prop('disabled', false);					

		iistr="";
		if(kind==5){
			for(var ii=0;ii<retdata['links'].length;ii++){
				var iitem=retdata['links'][ii];
				if(elink==iitem['fileid']){
					iistr+="<option selected='selected' value='"+iitem['filename']+"'>"+iitem['filename']+"</option>";								
				}else{
					iistr+="<option value='"+iitem['filename']+"'>"+iitem['filename']+"</option>";																
				}
			}
				$("#link").html(iistr);					
		}else if(kind==3){
			for(var ii=0;ii<retdata['duggor'].length;ii++){
				var iitem=retdata['duggor'][ii];
				if(elink==iitem['id']){
					iistr+="<option selected='selected' value='"+iitem['id']+"'>"+iitem['qname']+"</option>";
				}else{
					iistr+="<option value='"+iitem['id']+"'>"+iitem['qname']+"</option>";
				}
			}
		}
	$("#link").html(iistr);					
	}else{
		$("#linklabel").css("opacity","0.3");	
		$("#link").prop('disabled', true);					
		$("#createbutton").css('visibility', 'hidden');					
	}
	
	// Show dialog
	$("#editSection").css("display","block");
		
}

function changedType()
{
	kind=$("#type").val();		
	
	// Graying of Link
	if((kind==5)||(kind==3)){
		$("#linklabel").css("opacity","1.0");				
		$("#link").prop('disabled', false);					
		iistr="";
		if(kind==5){
			for(var ii=0;ii<retdata['links'].length;ii++){
				var iitem=retdata['links'][ii];
				if(xelink==iitem['fileid']){
					iistr+="<option selected='selected' value='"+iitem['filename']+"'>"+iitem['filename']+"</option>";								
				}else{
					iistr+="<option value='"+iitem['filename']+"'>"+iitem['filename']+"</option>";																
				}
			}
			$("#link").html(iistr);					
		}else if(kind==3){
			for(var ii=0;ii<retdata['duggor'].length;ii++){
				var iitem=retdata['duggor'][ii];
				if(xelink==iitem['id']){
					iistr+="<option selected='selected' value='"+iitem['id']+"'>"+iitem['qname']+"</option>";
				}else{
					iistr+="<option value='"+iitem['id']+"'>"+iitem['qname']+"</option>";
				}
			}
						
		}
		$("#link").html(iistr);					
	}else{
		$("#linklabel").css("opacity","0.3");	
		$("#link").prop('disabled', true);					
		$("#createbutton").css('visibility', 'hidden');					
	}	
}

function deleteItem()
{
	lid=$("#lid").val();
	AJAXService("DEL",{lid:lid},"SECTION");
	$("#editSection").css("display","none");
}

function updateItem()
{
	lid=$("#lid").val();
	kind=$("#type").val();
	link=$("#link").val();
	sectionname=$("#sectionname").val();
	visibility=$("#visib").val();
	moment=$("#moment").val();
	gradesys=$("#gradesys").val();
	AJAXService("UPDATE",{lid:lid,kind:kind,link:link,sectname:sectionname,visibility:visibility,moment:moment,gradesys:gradesys},"SECTION");
	$("#editSection").css("display","none");
}

// Create New Dugga/Example

function createLink()
{
	alert("CREATE!");
}
		
function newItem()
{
	lid=$("#lid").val();
	AJAXService("NEW",{lid:lid},"SECTION");
}

function closeSelect()
{
	$(".item").css("border","none");
	$(".item").css("box-shadow","none");
	$("#editSection").css("display","none");
}

//----------------------------------------
// Renderer
//----------------------------------------
var momentexists=0;
var resave = false;
function returnedSection(data)
{
	retdata=data;

	if(querystring['coursevers']!="null"){
	// Fill section list with information
		str="";
		if(data['writeaccess']) {
			str+="<div style='float:right;'>";
			str+="<input class='submit-button' type='button' value='New' onclick='newItem();'/>";
			str+="<input class='submit-button' type='button' value='Results' onclick='changeURL(\"resulted.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/>";
			str+="<input class='submit-button' type='button' value='Tests' id='testbutton' onclick='changeURL(\"duggaed.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/>";
			str+="<input class='submit-button' type='button' value='Files' onclick='changeURL(\"fileed.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/>";
			str+="<input class='submit-button' type='button' value='List' onclick='changeURL(\"resultlisted.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/>";
			str+="</div>";
		}
			
				// Course Name
		str+="<div class='course'>"+data.coursename+" "+data.coursevers+"</div>";
		str+="<div id='Sectionlistc' >";
			
		var groupitems = 0;
				
		// For now we only have two kinds of sections
		if (data['entries'].length > 0) {
			var kk=0;
			for(i=0;i<data['entries'].length;i++){
				var item=data['entries'][i];
				// If visible or we are a teacher/superuser
				if (parseInt(item['visible']) === 1 || data['writeaccess']) {		
					if(parseInt(item['kind']) === 0 ){
						// Styling for header row
						str+="<span class='header item' placeholder='"+momentexists+"'id='I"+item['lid']+"' ";
						kk=0;
					}else if(parseInt(item['kind']) === 1 ){
						//Styling for section row
						str+="<span class='section item' placeholder='"+momentexists+"'id='I"+item['lid']+"' ";
						kk=0;
					}else if(parseInt(item['kind']) === 2 ){
						// Styling for example row
						str+="<span";
						if(kk%2==0){
							str+=" class='example item hi' placeholder='"+momentexists+"'id='I"+item['lid']+"' ";
						}else{
							str+=" class='example item lo' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
						}
						kk++;
					}else if(parseInt(item['kind']) === 3 ){
						// Styling for quiz row
						str+="<span";
						if(kk%2==0){
							str+=" class='example item hi' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
						}else{
							str+=" class='example item lo' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
						}
						kk++;
					}else if(parseInt(item['kind']) === 4 ){
						//new moment bool equals true
						momentexists = item['lid'];
									
						// Styling for moment row
						str+="<span class='moment item' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
						kk=0;
					}else if(parseInt(item['kind']) === 5 ){
						// Styling for link row
						str+="<span";
						if(kk%2==0){
							str+=" class='example item hi' placeholder='"+momentexists+"'id='I"+item['lid']+"' ";
						}else{
							str+=" class='example item lo' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
						}
						k++;
					}

					if(kk==1){
						if (parseInt(item['visible']) === 0) str+=" style='opacity: 0.5; box-shadow: 0px 3px 2px #aaa inset; border-radius:8px; margin-left:4px;' "
						else str+="style='box-shadow: 0px 3px 2px #aaa inset;' ";				
					}else{
						if (parseInt(item['visible']) === 0) str+=" style='opacity: 0.5;border-radius:8px; margin-left:4px;' ";
					}
		
					str+=">";
					
					if (parseInt(item['kind']) < 2) {
						str+="<span style='padding-left:5px;'>"+item['entryname']+"</span>";
					}else if (parseInt(item['kind']) == 4) {
						str+="<span style='padding-left:5px;border-bottom:3px solid white'>Course Segment "+item['entryname']+"</span>";
					}else if (parseInt(item['kind']) == 2) {
						str+="<span><a style='margin-left:15px;' href="+item['link']+">"+item['entryname']+"</a></span>";
					}else if (parseInt(item['kind']) == 3 ) {
						//Dugga!
						str+="<a style='cursor:pointer;margin-left:15px;' onClick='changeURL(\"showDugga.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&did="+item['link']+"&moment="+item['lid']+"\");' >"+item['entryname']+"</a>";
					}else if(parseInt(item['kind']) == 5){
						str+="<a style='cursor:pointer;margin-left:75px;' onClick='changeURL(\"showDoc.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&fname="+item['link']+"\");' >"+item['entryname']+"</a>";
					}	
		
					if(data['writeaccess']) str+="<img id='dorf' style='float:right;margin-right:8px;margin-top:3px;' src='../Shared/icons/Cogwheel.svg' onclick='selectItem(\""+item['lid']+"\",\""+item['entryname']+"\",\""+item['kind']+"\",\""+item['visible']+"\",\""+item['link']+"\",\""+momentexists+"\",\""+item['gradesys']+"\");' />";
		
					if(parseInt(item['kind']) === 3||parseInt(item['kind']) === 4){
						var grady=-1;
						for(jjj=0;jjj<data['results'].length;jjj++){
							var lawtem=data['results'][jjj];
							//alert("G: "+lawtem['grade']);
							if((lawtem['moment']==item['lid'])){
								grady=lawtem['grade'];
							}
						}
						
						if(grady==-1){
								// Nothing submitted nor marked (White)
								str+="<img id='korf' style='float:right;margin-right:8px' title='Status: Not Handed In' src='../Shared/icons/StopN.svg' />";
						}else if(grady==null){
								//	Nothing marked yet (Yellow)
								str+="<img id='korf' style='float:right;margin-right:8px' title='Status: Handed in\nDate: "+lawtem['submitted']+"' src='../Shared/icons/StopY.svg' />";
						}else if(grady==1){
								//	Marked Fail! (Red)								
								str+="<img id='korf' style='float:right;margin-right:8px' title='Status: Failed\nDate: "+lawtem['marked']+"' src='../Shared/icons/StopR.svg' />";
						}else if(grady>1){
								//	Marked Pass i.e. G/VG/3/4/5 (Green)		
								str+="<img id='korf' style='float:right;margin-right:8px' title='Status: Pass\nDate: "+lawtem['marked']+"' src='../Shared/icons/StopG.svg' />";
						}
					}				
													
					str+="</span>";
				}
			}								
		}else{
			// No items were returned! 
			str+="<div class='bigg'>";
			str+="<span>There is currently no content in this course</span>";
			str+="</div>";
		}
					
		str+="</div>";
		var slist=document.getElementById('Sectionlist');
		slist.innerHTML=str;	
		if(resave == true){
			str="";
			$("#Sectionlist").find(".item").each(function(i) {
				if(i>0) str+=",";
				ido=$(this).attr('id');
				phld=$(this).attr('placeholder')
				str+=i+"XX"+ido.substr(1)+"XX"+phld;
									
			});
							
			AJAXService("REORDER",{order:str},"SECTION");	
			resave = false;
		}
		if(data['writeaccess']) {				
			// Enable sorting always if we are superuser as we refresh list on update 
					
			$("#Sectionlistc").sortable({
				helper: 'clone',		
				update:  function (event, ui) {	
					str="";
					$("#Sectionlist").find(".item").each(function(i) {
						if(i>0) str+=",";
						ido=$(this).attr('id');
						phld=$(this).attr('placeholder')
						str+=i+"XX"+ido.substr(1)+"XX"+phld;
									
					});
							
					AJAXService("REORDER",{order:str},"SECTION");	
					resave = true;		
					return false;
				}	
							
			});							
		}
	}else{
		str="<div class='err'><span style='font-weight:bold;'>Bummer!</span>This version does not seem to exist!</div>";										  
		var slist=document.getElementById('Sectionlist');
		slist.innerHTML=str;
	}
	if(data['debug']!="NONE!") alert(data['debug']);
}
