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
function selectItem(lid,entryname,kind,evisible,elink,moment,gradesys,highscoremode)
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
	$("#sectionname").val(entryname);
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
	
	// Add hichscore mode options
	str = "";
	if(highscoremode==0) str +="<option selected='selected' value ='0'>None</option>" 
	else str +="<option value ='0'>None</option>"; 

	if(highscoremode==1) str +="<option selected='selected' value ='1'>Time based</option>" 
	else str +="<option value ='1'>Time based</option>"; 

	if(highscoremode==2) str +="<option selected='selected' value ='2'>Click based</option>" 
	else str +="<option value ='2'>Click based</option>"; 
	$("#highscoremode").html(str);
	
	// Set Link
	$("#link").val(elink);
	
	// Show dialog
	iistr="";
	if(kind==0){	
		$("#inputwrapper-link").css("display","none");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
	}else if(kind==1){
		$("#inputwrapper-link").css("display","none");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
	}else if(kind==2){
		for(var ii=0;ii<retdata['codeexamples'].length;ii++){
			var iitem=retdata['codeexamples'][ii];
			if(xelink==iitem['exampleid']){
				iistr+="<option selected='selected' value='"+iitem['exampleid']+"'>"+iitem['sectionname']+"</option>";
			}else{
				iistr+="<option value='"+iitem['exampleid']+"'>"+iitem['sectionname']+"</option>";
			}
		}
		$("#link").html(iistr);
		$("#inputwrapper-link").css("display","block");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
	}else if(kind==3){
		for(var ii=0;ii<retdata['duggor'].length;ii++){
			var iitem=retdata['duggor'][ii];
			if(xelink==iitem['id']){
				iistr+="<option selected='selected' value='"+iitem['id']+"'>"+iitem['qname']+"</option>";
			}else{
				iistr+="<option value='"+iitem['id']+"'>"+iitem['qname']+"</option>";
			}
		}
		$("#link").html(iistr);
		$("#inputwrapper-link").css("display","block");
		$("#inputwrapper-gradesystem").css("display","block");
		$("#inputwrapper-highscore").css("display","block");
	}else if(kind==4){
		$("#inputwrapper-link").css("display","none");
		$("#inputwrapper-gradesystem").css("display","block");
		$("#inputwrapper-highscore").css("display","none");
	}else if(kind==5){
		for(var ii=0;ii<retdata['links'].length;ii++){
			var iitem=retdata['links'][ii];
			if(xelink==iitem['fileid']){
				iistr+="<option selected='selected' value='"+iitem['filename']+"'>"+iitem['filename']+"</option>";								
			}else{
				iistr+="<option value='"+iitem['filename']+"'>"+iitem['filename']+"</option>";																
			}
		}
		$("#link").html(iistr);
		$("#inputwrapper-link").css("display","block");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
	}
	$("#editSection").css("display","block");
}

function changedType()
{
	kind=$("#type").val();		
	iistr="";
	if(kind==0){	
		$("#inputwrapper-link").css("display","none");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
	}else if(kind==1){
		$("#inputwrapper-link").css("display","none");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
	}else if(kind==2){
		for(var ii=0;ii<retdata['codeexamples'].length;ii++){
			var iitem=retdata['codeexamples'][ii];
			if(xelink==iitem['exampleid']){
				iistr+="<option selected='selected' value='"+iitem['exampleid']+"'>"+iitem['sectionname']+"</option>";
			}else{
				iistr+="<option value='"+iitem['exampleid']+"'>"+iitem['sectionname']+"</option>";
			}
		}
		$("#link").html(iistr);
		$("#inputwrapper-link").css("display","block");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
	}else if(kind==3){
		for(var ii=0;ii<retdata['duggor'].length;ii++){
			var iitem=retdata['duggor'][ii];
			if(xelink==iitem['id']){
				iistr+="<option selected='selected' value='"+iitem['id']+"'>"+iitem['qname']+"</option>";
			}else{
				iistr+="<option value='"+iitem['id']+"'>"+iitem['qname']+"</option>";
			}
		}
		$("#link").html(iistr);
		$("#inputwrapper-link").css("display","block");
		$("#inputwrapper-gradesystem").css("display","block");
		$("#inputwrapper-highscore").css("display","block");
	}else if(kind==4){
		$("#inputwrapper-link").css("display","none");
		$("#inputwrapper-gradesystem").css("display","block");
		$("#inputwrapper-highscore").css("display","none");
	}else if(kind==5){
		for(var ii=0;ii<retdata['links'].length;ii++){
			var iitem=retdata['links'][ii];
			if(xelink==iitem['fileid']){
				iistr+="<option selected='selected' value='"+iitem['filename']+"'>"+iitem['filename']+"</option>";								
			}else{
				iistr+="<option value='"+iitem['filename']+"'>"+iitem['filename']+"</option>";																
			}
		}
		$("#link").html(iistr);
		$("#inputwrapper-link").css("display","block");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
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
	highscoremode=$("#highscoremode").val();
	sectionname=$("#sectionname").val();
	visibility=$("#visib").val();
	moment=$("#moment").val();
	gradesys=$("#gradesys").val();
	AJAXService("UPDATE",{lid:lid,kind:kind,link:link,sectname:sectionname,visibility:visibility,moment:moment,gradesys:gradesys,highscoremode:highscoremode},"SECTION");
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

function showCreateVersion()
{
	$("#newCourseVersion").css("display", "block");
}

function createVersion(){

	var cid = $("#cid").val();
	var versid = $("#versid").val();
	var versname = $("#versname").val();
	var coursecode = $("#course-coursecode").text();
	var courseid = $("#course-courseid").text();
	var coursename = $("#course-coursename").text();
	var makeactive = $("#makeactive").is(':checked');
	var coursevers = $("#course-coursevers").text();
	
	if(coursevers=="null"){
		makeactive=true;
	}
	
	AJAXService("NEWVRS", {
		cid : cid,
		versid : versid,
		versname : versname,
		coursecode : coursecode,
		coursename : coursename
	}, "SECTION");
	
	if(makeactive){
		AJAXService("CHGVERS", {
			cid : cid,
			versid : versid,
		}, "SECTION");
	}

	$("#newCourseVersion").css("display","none");
	window.setTimeout(function(){
		changeURL("sectioned.php?courseid=" + courseid + "&coursename=" + coursename + "&coursevers=" + versid);
	}, 10);
}

function showEditVersion(versid, versname)
{
	$("#eversid").val(versid);
	$("#eversname").val(versname);
	$("#editCourseVersion").css("display", "block");
}

function updateVersion(){
	var cid = $("#cid").val();
	var versid = $("#eversid").val();
	var versname = $("#eversname").val();
	var coursecode = $("#course-coursecode").text();
	var makeactive = $("#emakeactive").is(':checked');

	AJAXService("UPDATEVRS", {
		cid : cid,
		versid : versid,
		versname : versname,
		coursecode : coursecode
	}, "SECTION");
	
	if(makeactive){
		AJAXService("CHGVERS", {
			cid : cid,
			versid : versid,
		}, "SECTION");
	}

	$("#editCourseVersion").css("display","none");
}

function goToVersion(selected)
{
	var value = selected.value;
	changeURL("sectioned.php"+value)
}

function accessCourse() {
	var coursevers = $("#course-coursevers").text();
	window.location.href = "accessed.php?cid=" + querystring['courseid']+"&coursevers="+coursevers;
	resetinputs();
	//resets all inputs
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
			
			str+="<div class='course-menu--settings'>";
			str+="<select class='course-dropdown' onchange='goToVersion(this)'>";
			if (retdata['versions'].length > 0) {
				for ( i = 0; i < retdata['versions'].length; i++) {
					var item = retdata['versions'][i];
					if (retdata['courseid'] == item['cid']) {
						var vvers = item['vers'];
						var vname = item['versname'];
						str += "<option value='?courseid=" + retdata['courseid'] + "&coursename=" + retdata['coursename'] + "&coursevers=" + vvers + "'";
						if(retdata['coursevers']==vvers){
							str += "selected";
							var versionname=vname;
						}
						str += ">" + vname + " - " + vvers + "</option>";
					}
				}
			}
			str+="</select>";
			str+="<input type='button' class='submit-button' value='Edit version' title='Edit the selected version' onclick='showEditVersion";
			str+='("'+querystring['coursevers']+'","'+versionname+'")';
			str+=";'>";	
			str+="<input type='button' class='submit-button' value='New version' title='Create a new version of this course' onclick='showCreateVersion();'>";
			str+="</div>";
			
			str+="<div class='course-menu--options'>";
			str+="<input type='button' class='submit-button' value='Access' title='Give students access to the selected version' onclick='accessCourse();'/>";
			str+="<input class='submit-button' type='button' value='Results' onclick='changeURL(\"resulted.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/>";
			str+="<input class='submit-button' type='button' value='Tests' id='testbutton' onclick='changeURL(\"duggaed.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/>";
			str+="<input class='submit-button' type='button' value='Files' onclick='changeURL(\"fileed.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/>";
			str+="<input class='submit-button' type='button' value='List' onclick='changeURL(\"resultlisted.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/>";
			str+="</div>";
		}else{
			str+="<div class='course-menu--settings'>";
			str+="<select class='course-dropdown' onchange='goToVersion(this)'>";
			if (retdata['versions'].length > 0) {
				for ( i = 0; i < retdata['versions'].length; i++) {
					var item = retdata['versions'][i];
					if (retdata['courseid'] == item['cid']) {
						var vvers = item['vers'];
						var vname = item['versname'];
						str += "<option value='?courseid=" + retdata['courseid'] + "&coursename=" + retdata['coursename'] + "&coursevers=" + vvers + "'";
						if(retdata['coursevers']==vvers){
							str += "selected";
							var versionname=vname;
						}
						str += ">" + vname + " - " + vvers + "</option>";
					}
				}
			}
			str+="</select>";
			str += "</div>";	
		}
	
		// Course Name
		str+="<div class='course'><div id='course-coursename' style='display: inline-block; margin-right:10px;'>"+data.coursename+"</div><div id='course-coursecode' style='display: inline-block; margin-right:10px;'>"+data.coursecode+"</div><div id='course-versname' style='display: inline-block; margin-right:10px;'>"+versionname+"</div><div id='course-coursevers' style='display: none; margin-right:10px;'>"+data.coursevers+"</div><div id='course-courseid' style='display: none; margin-right:10px;'>"+data.courseid+"</div>";

		if(retdata["writeaccess"]){
			str += "<input class='new-item-button' type='button' value='New Item' onclick='newItem();'/></div>";
		}else{
			str += "</div>";
		}


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
						kk++;
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
						str+="<span><a style='margin-left:15px;' href='../CodeViewer/EditorV50.php?exampleid="+item['link']+"&courseid="+querystring['courseid']+"&cvers="+querystring['coursevers']+"'>"+item['entryname']+"</a></span>";
						
					}else if (parseInt(item['kind']) == 3 ) {
						//Dugga!
						str+="<a style='cursor:pointer;margin-left:15px;' onClick='changeURL(\"showDugga.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&did="+item['link']+"&moment="+item['lid']+"&highscoremode="+item['highscoremode']+"\");' >"+item['entryname']+"</a>";
					}else if(parseInt(item['kind']) == 5){
						str+="<a style='cursor:pointer;margin-left:75px;' onClick='changeURL(\"showdoc.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&fname="+item['link']+"\");' >"+item['entryname']+" (material)</a>";
					}	
		
					if(data['writeaccess']) str+="<img id='dorf' style='float:right;margin-right:8px;margin-top:3px;' src='../Shared/icons/Cogwheel.svg' onclick='selectItem(\""+item['lid']+"\",\""+item['entryname']+"\",\""+item['kind']+"\",\""+item['visible']+"\",\""+item['link']+"\",\""+momentexists+"\",\""+item['gradesys']+"\",\""+item['highscoremode']+"\");' />";
		
					if(parseInt(item['kind']) === 3||parseInt(item['kind']) === 4){
						var grady=-1;
						for(jjj=0;jjj<data['results'].length;jjj++){
							var lawtem=data['results'][jjj];
							//alert("G: "+lawtem['grade']);
							if((lawtem['moment']==item['lid'])){
								grady=lawtem['grade'];
							}
						}
						
						if(item['highscoremode'] != 0 && parseInt(item['kind']) == 3) {
							str+="<img style='float:right;margin-right:8px' title='Highscore' src='../Shared/icons/top10.png' onclick='showHighscore(\""+item['link']+"\",\""+item['lid']+"\")'/>";
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
			str+="<span>You either have no access or there isn't anything under this course</span>";
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
		str="<div class='course'><div id='course-coursename' style='display: inline-block; margin-right:10px;'>"+data.coursename+"</div><div id='course-coursecode' style='display: inline-block; margin-right:10px;'>"+data.coursecode+"</div><div id='course-coursevers' style='display: inline-block; margin-right:10px;'>"+data.coursevers+"</div><div id='course-courseid' style='display: none; margin-right:10px;'>"+data.courseid+"</div></div>";
		str+="<div class='err'><span style='font-weight:bold;'>Bummer!</span>This version does not seem to exist!</div>";										  
		var slist=document.getElementById('Sectionlist');
		slist.innerHTML=str;
		showCreateVersion();
		
	}
	if(data['debug']!="NONE!") alert(data['debug']);
}

function showHighscore(did, lid)
{
	AJAXService("GET", {did:did, lid:lid}, "DUGGAHIGHSCORE");
}

function returnedHighscore(data){

	var str = "";
	
	str += "<tr>";
	str += "<th>Rank</th>";
	str += "<th>Name</th>";
	str += "<th>Score</th>";
	str += "</tr>";

	if (data['highscores'].length > 0) {
		for(i=0;i<data['highscores'].length;i++){
			var item=data['highscores'][i];
			if(!isNaN(data["user"][0]) && data["user"][0] === i){
				str += "<tr class='highscoreUser'>"
			}else{
				str += "<tr>";
			}
			str += "<td>";
			str += (i + 1);
			str += "</td>";

			str += "<td>";
			str += item['username'];
			str += "</td>"
			str += "<td>";
			str += "Score: ";
			str += item['score']
			str += "</td>";
			str += "</tr>";
		}
	}
	
	if(data["user"]["username"]){	
		str += "<tr class='highscoreUser'>";
		str += "<td>";
		str += "";
		str += "</td>";
		str += "<td>";
		str += data["user"]["username"];
		str += "</td>"
		str += "<td>";
		str += "Score: ";
		str += data["user"]["score"]
		str += "</td>";
		str += "</tr>";
	}

	var highscorelist=document.getElementById('HighscoreTable').innerHTML = str;
	$("#HighscoreBox").css("display", "block");
}
