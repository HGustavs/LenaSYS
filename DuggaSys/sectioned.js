var querystring=parseGet();
var retdata;

AJAXService("get",{},"SECTION");
// These functions loads at page load
$(function() {
});

//----------------------------------------
// Commands:
//----------------------------------------

var xelink;

function displaymessage(){
   $(".messagebox").css("display","block");
}

var resizeTimer;
var showInline = false;
var menuButtonWidth = 112;
var menuButtonMarginRight = 2;
var menuButtons = [];

menuButtons.push({ 'width': 1050, 'name': 'EditVers', 'display': true });
menuButtons.push({ 'width': 950, 'name': 'NewVers', 'display': true });
menuButtons.push({ 'width': 850, 'name': 'Analysis', 'display': true });
menuButtons.push({ 'width': 750, 'name': 'Access', 'display': true });
menuButtons.push({ 'width': 650, 'name': 'Files', 'display': true });
menuButtons.push({ 'width': 550, 'name': 'Tests', 'display': true });
menuButtons.push({ 'width': 450, 'name': 'Groups', 'display': true });
menuButtons.push({ 'width': 400, 'name': 'Results', 'display': true });

function disappearingFields() {
  var windowSize = $(window).width();
  if(windowSize < 480 && showInline == true) {
    jQuery('.thisDateShouldDisappearWhenScreenIsTooSmall').fadeOut(1000);
    showInline = false;
  } else if(windowSize >= 480 && showInline == false) {
    jQuery('.thisDateShouldDisappearWhenScreenIsTooSmall').fadeIn(1000);
    showInline = true;
  }
}

function toggleMenuButtons() {
  var windowSize = $(window).width();
  for(i=0; i<menuButtons.length; i++) {
    if(windowSize < menuButtons[i].width && menuButtons[i].display) {
      jQuery("#button"+menuButtons[i].name).fadeOut({duration: 500, queue: false });
      jQuery("#td"+menuButtons[i].name).animate({width: '0px'}, {duration: 500, queue: false });
      jQuery("#td"+menuButtons[i].name).animate({marginRight: '0px'}, {duration: 500, queue: false });
      menuButtons[i].display = false;
    } else if(windowSize >= menuButtons[i].width && !menuButtons[i].display) {
      jQuery("#button"+menuButtons[i].name).fadeIn({duration: 500, queue: false });
      jQuery("#td"+menuButtons[i].name).animate({width: menuButtonWidth+'px'}, {duration: 500, queue: false });
      jQuery("#td"+menuButtons[i].name).animate({marginRight: menuButtonMarginRight+'px'}, {duration: 500, queue: false });
      menuButtons[i].display = true;
    }    
  }
}

$(document).ready(function(){
    $(".messagebox").hover(function(){
        $("#testbutton").css("background-color", "red");
    });
	$(".messagebox").mouseout(function(){
        $("#testbutton").css("background-color", "#614875");
    });

  // Picking dates when creating a new version
	$("#startdate").datepicker({
		dateFormat: "yy-mm-dd",
		minDate: 0,
		onSelect: function(date){
			var newDate = $('#startdate').datepicker('getDate');
			$('#enddate').datepicker("option","minDate", newDate);
		}
	});

	$('#enddate').datepicker({
		dateFormat: "yy-mm-dd"
	});

  // Picking dates when modifying a version
	$("#estartdate").datepicker({
		dateFormat: "yy-mm-dd",
		minDate: 0,
		onSelect: function(date){
			var newDate = $('#estartdate').datepicker('getDate');
			$('#eenddate').datepicker("option","minDate", newDate);
		}
	});

	$('#eenddate').datepicker({
		dateFormat: "yy-mm-dd"
	});

  $(window).resize(function() {
    // This here timeout stuff is to prevent certain event to be missed if user resize windows too fast
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      disappearingFields();
//      toggleMenuButtons();
    }, 250);
  });
});

function showSubmitButton(){ 
  $(".submitDugga").css("display","inline-block"); 
  $(".updateDugga").css("display","none"); 
  $(".deleteDugga").css("display","none"); 
  $(".closeDugga").css("display","inline-block"); 
  $("#overlay").css("display","block"); 
} 
 
function showSaveButton(){ 
  $(".submitDugga").css("display","none"); 
  $(".updateDugga").css("display","block");
  $(".deleteDugga").css("display","block");
  $(".closeDugga").css("display","none"); 
  $("#overlay").css("display","none"); 
} 

function selectItem(lid,entryname,kind,evisible,elink,moment,gradesys,highscoremode,comments,rowcolor,grouptype)
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
		
	// Set grouptype
	str="";
	if(grouptype==null||grouptype==0) str+="<option selected='selected' value='0'>Regular dugga</option>"
	else str+="<option value='0'>Regular dugga</option>";
	
	if(grouptype==1) str+="<option selected='selected' value='1'>Group dugga</option>"
	else str+="<option value='1'>Group dugga</option>";
	
	if(grouptype==2) str+="<option selected='selected' value='2'>Seminar</option>"
	else str+="<option value='2'>Seminar</option>";
	
	if(grouptype==3) str+="<option selected='selected' value='3'>Group seminar</option>"
	else str+="<option value='3'>Group seminar</option>";

	$("#grouptype").html(str);
	
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

	// Set Comment
	$("#comments").val(comments);
	$("sectionnamewrapper").html("<input type='text' class='form-control textinput' id='comments' value='"+comments+"' style='width:448px;'/>");
	
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
	if(evisible==2) str+="<option selected='selected' value='2'>Login</option>"
	else str+="<option value='2'>Login</option>";
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
	
	// Set tabs
	str = "";
	if(gradesys==0||gradesys==null) str +="<option selected='selected' value ='0'>0 tabs</option>" 
	else str +="<option value ='0'>0 tabs</option>"; 
	if(gradesys==1) str +="<option selected='selected' value ='1'>1 tab</option>" 
	else str +="<option value ='1'>1 tab</option>"; 
	if(gradesys==2) str +="<option selected='selected' value ='2'>2 tabs</option>" 
	else str +="<option value ='2'>2 tabs</option>"; 
	if(gradesys==3) str +="<option selected='selected' value ='3'>3 tabs</option>" 
	else str +="<option value ='3'>3 tabs</option>"; 
	if(gradesys==4) str +="<option selected='selected' value ='4'>end</option>" 
	else str +="<option value ='4'>end</option>"; 
	if(gradesys==5) str +="<option selected='selected' value ='5'>1 tab + end</option>" 
	else str +="<option value ='5'>1 tab + end</option>"; 
	if(gradesys>6||gradesys<0) str +="<option selected='selected' value ='6'>2 tabs + end</option>" 
	else str +="<option value ='6'>2 tabs + end</option>"; 
	
	$("#tabs").html(str);

	// Set color on "test"
	str="";
	if(rowcolor==0) str+="<option selected='selected' value='0' style='background-color: #dad8db; color: #927b9e;'>Standard</option>"
	else str+="<option value='0' style='background-color: #dad8db; color: #927b9e;'>Standard</option>";
	if(rowcolor==1) str+="<option selected='selected' value='1' style='background-color: #927b9e; color: white;'>Header</option>"
	else str+="<option value='1' style='background-color: #927b9e; color: white;'>Header</option>";
	$("#rowcolor").html(str);
		
	// Set Link
	$("#link").val(elink);
	
	// Show dialog
	iistr="";
	
	// Header
	if(kind==0){
		$("#inputwrapper-tabs").css("display","block");
		$("#inputwrapper-link").css("display","none");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
		$("#inputwrapper-comments").css("display","none");
		$("#inputwrapper-color").css("display","none");
		$("#inputwrapper-grouptype").css("display","none");

	// Section
	}else if(kind==1){
		$("#inputwrapper-tabs").css("display","block");
		$("#inputwrapper-link").css("display","none");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
		$("#inputwrapper-comments").css("display","none");
		$("#inputwrapper-color").css("display","none");
		$("#inputwrapper-grouptype").css("display","none");

	// Code
	}else if(kind==2){
		$("#inputwrapper-tabs").css("display","block");
		for(var ii=0;ii<retdata['codeexamples'].length;ii++){
			var iitem=retdata['codeexamples'][ii];
			if(xelink==iitem['exampleid']){
				iistr+="<option selected='selected' value='"+iitem['exampleid']+"'>"+iitem['examplename']+"</option>";
			}else{
				iistr+="<option value='"+iitem['exampleid']+"'>"+iitem['examplename']+"</option>";
			}
		}
		$("#link").html(iistr);
		$("#inputwrapper-link").css("display","block");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
		$("#inputwrapper-comments").css("display","none");
		$("#inputwrapper-color").css("display","none");
		$("#inputwrapper-grouptype").css("display","none");
    
	// Dugga
	}else if(kind==3){
		$("#inputwrapper-tabs").css("display","none");
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
		$("#inputwrapper-comments").css("display","block");
		$("#inputwrapper-color").css("display","block");
		$("#inputwrapper-grouptype").css("display","block");

	// Moment
	}else if(kind==4){
		$("#inputwrapper-tabs").css("display","none");
		$("#inputwrapper-link").css("display","none");
		$("#inputwrapper-gradesystem").css("display","block");
		$("#inputwrapper-highscore").css("display","none");
		$("#inputwrapper-comments").css("display","none");
		$("#inputwrapper-color").css("display","none");
		$("#inputwrapper-grouptype").css("display","block");

	// Link
	}else if(kind==5){
		$("#inputwrapper-tabs").css("display","block");
		for(var ii=0;ii<retdata['links'].length;ii++){
			var iitem=retdata['links'][ii];
			if(xelink==iitem['filename']){
				iistr+="<option selected='selected' value='"+iitem['filename']+"'>"+iitem['filename']+"</option>";								
			}else{
				iistr+="<option value='"+iitem['filename']+"'>"+iitem['filename']+"</option>";																
			}
		}
		$("#link").html(iistr);
		$("#inputwrapper-link").css("display","block");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
		$("#inputwrapper-comments").css("display","none");
		$("#inputwrapper-color").css("display","none");
		$("#inputwrapper-grouptype").css("display","none");

	}
	$("#editSection").css("display","block");
	$("#overlay").css("display","block");
	
}

function participationList(){
	alert("ParticipationList");
}

function changedType()
{
	kind=$("#type").val();		
	iistr="";
	
	if(kind==0){	
		$("#inputwrapper-link").css("display","none");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
		$("#inputwrapper-tabs").css("display","none");
		$("#inputwrapper-comments").css("display","none");
		$("#inputwrapper-color").css("display","none");
		$("#inputwrapper-grouptype").css("display","none");

	}else if(kind==1){
		$("#inputwrapper-link").css("display","none");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
		$("#inputwrapper-tabs").css("display","none");
		$("#inputwrapper-comments").css("display","none");
		$("#inputwrapper-color").css("display","none");
		$("#inputwrapper-grouptype").css("display","none");

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
		$("#inputwrapper-tabs").css("display","block");
		$("#inputwrapper-comments").css("display","none");
		$("#inputwrapper-color").css("display","none");
		$("#inputwrapper-grouptype").css("display","none");

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
		$("#inputwrapper-tabs").css("display","none");	
		$("#inputwrapper-comments").css("display","block");	
		$("#inputwrapper-color").css("display","block");	
		$("#inputwrapper-grouptype").css("display","block");

	}else if(kind==4){
		$("#inputwrapper-link").css("display","none");
		$("#inputwrapper-gradesystem").css("display","block");
		$("#inputwrapper-highscore").css("display","none");
		$("#inputwrapper-tabs").css("display","none");
		$("#inputwrapper-comments").css("display","none");
		$("#inputwrapper-color").css("display","none");
		$("#inputwrapper-grouptype").css("display","block");

	}else if(kind==5){
		$("#inputwrapper-tabs").css("display","block");
		for(var ii=0;ii<retdata['links'].length;ii++){
			var iitem=retdata['links'][ii];
			if(xelink==iitem['filename']){
				iistr+="<option selected='selected' value='"+iitem['filename']+"'>"+iitem['filename']+"</option>";								
			}else{
				iistr+="<option value='"+iitem['filename']+"'>"+iitem['filename']+"</option>";																
			}
		}
		$("#link").html(iistr);
		$("#inputwrapper-link").css("display","block");
		$("#inputwrapper-gradesystem").css("display","none");
		$("#inputwrapper-highscore").css("display","none");
		$("#inputwrapper-comments").css("display","none");
		$("#inputwrapper-color").css("display","none");
		$("#inputwrapper-grouptype").css("display","none");

	}
}

function deleteItem()
{
	lid=$("#lid").val();
	AJAXService("DEL",{lid:lid},"SECTION");
	$("#editSection").css("display","none");
	$("#overlay").css("display","none");
}

function updateItem()
{
	tabs=$("#tabs").val();
	lid=$("#lid").val();
	kind=$("#type").val();
	link=$("#link").val();
	highscoremode=$("#highscoremode").val();
	sectionname=$("#sectionname").val();
	visibility=$("#visib").val();
	moment=$("#moment").val();
	gradesys=$("#gradesys").val();
	comments=$("#comments").val();
	rowcolor=$("#rowcolor").val();
	grouptype=$("#grouptype").val();
	// Storing tabs in gradesys column!
	if (kind==0||kind==1||kind==2||kind==5) gradesys=tabs;
	AJAXService("UPDATE",{lid:lid,kind:kind,link:link,sectname:sectionname,visibility:visibility,moment:moment,gradesys:gradesys,highscoremode:highscoremode,comments:comments,rowcolor:rowcolor,grouptype:grouptype},"SECTION");
	$("#editSection").css("display","none");
	$("#overlay").css("display","none");
}

// Create New Dugga/Example

function createLink()
{
	alert("CREATE!");
}
		
function newItem()
{
	/*lid=$("#lid").val(); 
  AJAXService("NEW",{lid:lid},"SECTION");*/ 
   
  tabs=$("#tabs").val(); 
  lid=$("#lid").val(); 
  kind=$("#type").val(); 
  link=$("#link").val(); 
  highscoremode=$("#highscoremode").val(); 
  sectionname=$("#sectionname").val(); 
  visibility=$("#visib").val(); 
  moment=$("#moment").val(); 
  gradesys=$("#gradesys").val(); 
  comment=$("#deadlinecomment").val(); 
  rowcolor=$("#rowcolor").val();
  grouptype=$("#grouptype").val(); 
  // Storing tabs in gradesys column! 
  if (kind==0||kind==1||kind==2||kind==5) gradesys=tabs; 
  AJAXService("NEW",{lid:lid,kind:kind,link:link,sectname:sectionname,visibility:visibility,moment:moment,gradesys:gradesys,highscoremode:highscoremode,comment:comment,rowcolor:rowcolor,grouptype:grouptype},"SECTION"); 
  $("#editSection").css("display","none"); 
  window.location.reload();		// Refreshes page to make it able to update items
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
	$("#overlay").css("display", "block");
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
	var startdate = $("#startdate").val();
	var enddate = $("#enddate").val();
/*  If start date for a version is not selected when creating a version, set the current date as the start date */
//  Date Format: 2017-04-27 00:00:00
  if(startdate === "None" || startdate === null || startdate.length === 0) {
    var date = new Date();
    startdate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
  }
/*  If end date for a version is not selected when creating a version, set the start date as the end date */
  if(enddate === "None" || enddate === null || enddate.length === 0) {
    enddate = startdate;
  }
	
	if(coursevers=="null"){
		makeactive=true;
	}
	
	AJAXService("NEWVRS", {
		cid : cid,
		versid : versid,
		versname : versname,
		coursecode : coursecode,
		coursename : coursename,
   startdate : startdate,
   enddate : enddate
  }, "SECTION");
	
	if(makeactive){
		AJAXService("CHGVERS", {
			cid : cid,
			versid : versid
		}, "SECTION");
	}

	$("#newCourseVersion").css("display","none");
	$("#overlay").css("display","none");
	
	window.setTimeout(function(){
		changeURL("sectioned.php?courseid=" + courseid + "&coursename=" + coursename + "&coursevers=" + versid);
	}, 1000);
}

function showEditVersion(versid, versname, startdate, enddate)
{
	$("#eversid").val(versid);
	$("#eversname").val(versname);
	$("#estartdate").val(startdate);
	$("#eenddate").val(enddate);
	$("#editCourseVersion").css("display", "block");
	$("#overlay").css("display", "block");
}

function updateVersion(){
	var cid = $("#cid").val();
	var versid = $("#eversid").val();
	var versname = $("#eversname").val();
	var coursecode = $("#course-coursecode").text();
	var makeactive = $("#emakeactive").is(':checked');
   var startdate = $("#estartdate").val();
   var enddate = $("#eenddate").val();
/*  If start date for a version is not selected when creating a version, set the current date as the start date */
//  Date Format: 2017-04-27 00:00:00
  if(startdate === "None" || startdate === null || startdate.length === 0) {
    // 2017-04-27 00:00:00
    var date = new Date();
    startdate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
  }
/*  If end date for a version is not selected when creating a version, set the start date as the end date */
  if(enddate === "None" || enddate === null || enddate.length === 0) {
    enddate = startdate;
  }
  
	AJAXService("UPDATEVRS", {
		cid : cid,
		versid : versid,
		versname : versname,
		coursecode : coursecode,
   startdate : startdate,
   enddate : enddate
	}, "SECTION");
	
	if(makeactive){
		AJAXService("CHGVERS", {
			cid : cid,
			versid : versid,
		}, "SECTION");
	}

	$("#editCourseVersion").css("display","none");
	$("#overlay").css("display","none");
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
  if(data['debug']!="NONE!") alert(data['debug']);
  
	if(querystring['coursevers']!="null"){
		// Fill section list with information
    var versionname="";
    if (retdata['versions'].length > 0) {
      for ( j = 0; j < retdata['versions'].length; j++) {
        var itemz = retdata['versions'][j];
        if (retdata['courseid'] == itemz['cid']) {
          var vversz = itemz['vers'];
          var vnamez = itemz['versname'];
          if(retdata['coursevers']==vversz){
            versionname=vnamez;
          }
        }
      }
    }
    
		str="";

//		str+="<table class='navheader' style='overflow: hidden; table-layout: fixed;'><tr class='trsize nowrap'>"; // This is for anti-stacking buttons
		str+="<table class='navheader' style='overflow: hidden; table-layout: fixed;'><tr class='trsize'>"; // This is for stacking buttons.

        if(data['writeaccess']) {
          str+="<td style='display: inline-block; margin-right:2px; width:112px;'><select class='course-dropdown' onchange='goToVersion(this)'>";
            if (retdata['versions'].length > 0) {
                for ( i = 0; i < retdata['versions'].length; i++) {
                    var item = retdata['versions'][i];
                    if (retdata['courseid'] == item['cid']) {
                        var vvers = item['vers'];
                        var vname = item['versname'];
                        str += "<option value='?courseid=" + retdata['courseid'] + "&coursename=" + retdata['coursename'] + "&coursevers=" + vvers + "'";
                        if(retdata['coursevers']==vvers){
                            str += "selected";
                        }
                        str += ">" + vname + " - " + vvers + "</option>";
                    }
                }
            }
            str+="</select></td>";
			
			str+="<td id='tdEditVers' style='display: inline-block; margin-right:2px; width:112px;'><div style='display: inline-block;' id='buttonEditVers'><input type='button' value='Edit version' class='submit-button' title='Edit the selected version' onclick='showEditVersion";

// Retrieve start and end dates for a version, if there are such, else set to null
      var startdate = null;
      var enddate = null;
      if (retdata['versions'].length > 0) {
      for ( i = 0; i < retdata['versions'].length; i++) {
          var item = retdata['versions'][i];
          if (retdata['courseid'] == item['cid'] && retdata['coursevers'] == item['vers']) {
            startdate = item['startdate'];
            enddate = item['enddate'];
          }
        }
      }

			str+='("'+querystring['coursevers']+'","'+versionname+'","'+startdate+'","'+enddate+'")';
			str+=";'></div></td>";	

			str+="<td id='tdNewVers' style='display: inline-block; margin-right:2px; width:112px;'><div style='display: inline-block;' id='buttonNewVers'><input type='button' value='New version' class='submit-button' title='Create a new version of this course' onclick='showCreateVersion();'></div></td>";
			str+="<td id='tdAccess' style='display: inline-block; margin-right:2px; width:112px;'><div style='display: inline-block;' id='buttonAccess'><input type='button' value='Access' class='submit-button' title='Give students access to the selected version' onclick='accessCourse();'/></div></td>";
			str+="<td id='tdResults' style='display: inline-block; margin-right:2px; width:112px;'><div style='display: inline-block;' id='buttonResults'><input type='button' value='Results' class='submit-button' title='Edit student results' onclick='changeURL(\"resulted.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")' /></div></td>";
			str+="<td id='tdTests' style='display: inline-block; margin-right:2px; width:112px;'><div style='display: inline-block;' id='buttonTests'><input type='button' value='Tests' class='submit-button' id='testbutton' onclick='changeURL(\"duggaed.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/></div></td>";
			str+="<td id='tdFiles' style='display: inline-block; margin-right:2px; width:112px;'><div style='display: inline-block;' id='buttonFiles'><input type='button' value='Files' class='submit-button' onclick='changeURL(\"fileed.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/></div></td>";
			str+="<td id='tdAnalysis' style='display: inline-block; margin-right:2px; width:112px;'><div style='display: inline-block;' id='buttonAnalysis'><input type='button' value='Analysis' class='submit-button' title='Access analysis page' onclick='changeURL(\"stats.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/></div></td>";
			str+="<td id='tdGroups' style='display: inline-block; margin-right:2px; width:112px;'><div style='display: inline-block;' id='buttonGroups'><input type='button' value='Groups' class='submit-button' title='Student groups page' onclick='changeURL(\"grouped.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/></div></td>";
    }else{
			// No version selector for students
		}
        if(retdata["writeaccess"]){
            str+="</tr></table>";
            // str += "<input type='button' class='fab' value='+' title='New Item' onclick='selectItem(\""+item['lid']+"\",\"New Item\",\""+item['kind']+"\",\""+item['visible']+"\",\""+item['link']+"\",\""+momentexists+"\",\""+item['gradesys']+"\",\""+item['highscoremode']+"\");showSubmitButton();'>";
        }else{
            str+="</tr></table>";
        }

      // hide som elements if to narrow
     var hiddenInline = "";
     if($(window).width() < 480) {
        showInline = false;
        hiddenInline = "none";
      } else {
        showInline = true;
        hiddenInline = "inline";
      }

    // Course Name
    // This will ellipsis on the course name, and keep course code and vers always fully expanded
    str+="<div class='course ellipseBox' style='display: flex;align-items: center;justify-content: center;'>";
        	str+="<div class='showhide' id='course-showhide' value='Show/Hide all' style='position:absolute; left:10px; margin-top: 15px; display: flex;' ><img src='../Shared/icons/desc_complement.svg' class='arrowCompTop'><img src='../Shared/icons/right_complement.svg' class='arrowRightTop' style='display:none;'>";
        	str+="<span class='showhidetext' >Show/hide all</span>";
        	str+="</div>";
        	str+="<div id='course-coursename' class='nowrap ellipsis' style='margin-left: 90px; margin-right:10px;'>"+data.coursename+"</div>";
			str+="<div id='course-coursecode' style='margin-right:10px;'>"+data.coursecode+"</div>";
			str+="<div id='course-versname' class='thisDateShouldDisappearWhenScreenIsTooSmall' style='margin-right:10px;'>"+versionname+"</div>";
        if(retdata["writeaccess"]){
            str+="<div id='course-newitem' style='display: flex; position: absolute; right:15px;'>";
            str += "<input type='button' value='+' class='submit-button-newitem' title='New Item' onclick='selectItem(\""+item['lid']+"\",\"New Item\",\""+item['kind']+"\",\""+item['visible']+"\",\""+item['link']+"\",\""+momentexists+"\",\""+item['gradesys']+"\",\""+item['highscoremode']+"\");showSubmitButton();'/>";
           	str+="</div>";
        }
      str+="<div style='width: 50px;'></div>";
      str+='</div>';
			str+="<div id='course-coursevers' style='display: none; margin-right:10px;'>"+data.coursevers+"</div>";
			str+="<div id='course-courseid' style='display: none; margin-right:10px;'>"+data.courseid+"</div>";

		str+="</div>";

		str+="<div id='Sectionlistc' >";
			
		var groupitems = 0;
				
		// For now we only have two kinds of sections
		if (data['entries'].length > 0) {
			var kk=0;
			for(i=0;i<data['entries'].length;i++){
				var item=data['entries'][i];
				var deadline = item['deadline'];
				var released = item['release'];

				// Separating sections into different classes
				if(parseInt(item['kind']) === 0){
					str += "<div class='header' style='display:block'>";
				}else if(parseInt(item['kind']) === 1){
					str += "<div class='section' style='display:block'>";
				}else if(parseInt(item['kind']) === 2){
					str += "<div class='code' style='display:block'>";
				}else if(parseInt(item['kind']) === 3){
					str += "<div class='test' style='display:block'>";
				}else if(parseInt(item['kind']) === 4){
					str += "<div class='moment' style='display:block'>";
				}else if(parseInt(item['kind']) === 5){
					str += "<div class='link' style='display:block'>";
				}
				// All are visible according to database


				// Content table 		
				str+="<table id='lid"+item['lid']+"' style='width:100%;table-layout:fixed;'><tr style='height:32px;' ";
				if(kk%2==0){
					str+=" class='hi' ";
				}else{
					str+=" class='lo' ";
				}
				str+=" >";
				
					var blorf="";
					if (parseInt(item['visible']) === 0){
							blorf=" hidden";
					}else if(parseInt(item['visible']) === 3){
							blorf=" deleted";
					}else if(parseInt(item['visible']) === 2){
							blorf=" login";
					}else{
							blorf="";
					}
					
					// kind 0 == Header || 1 == Section || 2 == Code  ||�3 == Test (Dugga)|| 4 == Moment�|| 5 == Link
					if(parseInt(item['kind']) === 3|| parseInt(item['kind']) === 4){

							// Styling for quiz row e.g. add a tab spacer
							if(parseInt(item['kind']) === 3) str+="<td style='width:36px;'><div class='spacerLeft'></div></td>";

							var grady=-1;
							var status ="";
							var marked;
							var submitted;
							var lastSubmit = null;

							for(jjj=0;jjj<data['results'].length;jjj++){
								var lawtem=data['results'][jjj];
								if((lawtem['moment']==item['lid'])){
									grady=lawtem['grade'];
									status="";
									var st = lawtem['submitted'];
									if (st !== null) {
										submitted = new Date(st);									
									} else {
										submitted = null;
									}
									var mt = lawtem['marked'];
									if (mt !== null) {
										marked = new Date(mt);									
									} else {
										marked = null;
									}
									
									if(parseInt(item['kind']) === 3){
											if (lawtem["useranswer"] !== null && submitted !== null && marked === null) {
												status="pending";
											} 
			
											if ( submitted !== null && marked !== null && (submitted.getTime() > marked.getTime())){
												status="pending";
											} 

                      if (lastSubmit === null){
												lastSubmit = submitted;
											}else if (submitted !== null) {
												if (lastSubmit.getTime() < submitted.getTime()){
													lastSubmit=submitted;
												}
											}
									}else{
                    /*
											if (submitted !== null && marked === null) {
												status="pending";
											} 
			
											if ( submitted !== null && marked !== null && (submitted.getTime() > marked.getTime())){
												status="pending";
											} 
			
                      */
									}
								}
							}
	            if (parseInt(item['kind']) === 3){
                  str+="<td class='LightBox"+blorf+"'>";
              } else if ((parseInt(item['kind']) === 4)){
                  str+="<td class='LightBoxFilled"+blorf+"'>";
              }
							
							if((grady==-1 || grady == 0 || grady==null) && status==="") {
									// Nothing submitted nor marked (White)
									str+="<div class='StopLight WhiteLight'></div>";
							}else if(status === "pending"){
									//	Nothing marked yet (Yellow)
									str+="<div class='StopLight YellowLight' title='Status: Handed in\nDate: "+lastSubmit+"' ></div>";
							}else if(grady==1){
									//	Marked Fail! (Red)								
									str+="<div class='StopLight RedLight' title='Status: Failed\nDate: "+marked+"' ></div>";
							}else if(grady>1){
									//	Marked Pass i.e. G/VG/3/4/5 (Green)		
									str+="<div class='StopLight GreenLight'  title='Status: Pass\nDate: "+marked+"' ></div>";
							}
							str+="</td>";
				
				}

				// Make tabs to align each section element
				// kind 0 == Header || 1 == Section || 2 == Code  ||�3 == Test (Dugga)|| 4 == Moment�|| 5 == Link
				if(parseInt(item['kind']) === 0 || parseInt(item['kind']) === 1 || parseInt(item['kind']) === 2 || parseInt(item['kind']) === 5 ){
						if (parseInt(item['gradesys']) > 0 && parseInt(item['gradesys']) < 4){
								for (var numSpacers = 0; numSpacers < parseInt(item['gradesys']);numSpacers++){
									str+="<td style='width:36px;overflow:hidden;'><div class='spacerLeft'></div></td>";
								}													
						} else if (parseInt(item['gradesys']) == 4){
								str+="<td class='LightBox'><div class='spacerEnd'></div></td>";
						}else if (parseInt(item['gradesys']) == 5){
								str+="<td class='LightBox'><div class='spacerLeft'></div></td><td class='LightBox'><div class='spacerEnd'></div></td>";
						}else if (parseInt(item['gradesys']) == 6){
								str+="<td class='LightBox'><div class='spacerLeft'></div></td><td class='LightBox'><div class='spacerLeft'></div></td><td class='LightBox'><div class='spacerEnd'></div></td>";
						}
				}


				// kind 0 == Header || 1 == Section || 2 == Code  || 3 == Test (Dugga)|| 4 == Moment || 5 == Link
				if(parseInt(item['kind']) === 0 ){									// Header
					// Styling for header row
					str+="</td><td class='header item"+blorf+"' placeholder='"+momentexists+"'id='I"+item['lid']+"' ";					
					kk=0;
				}else if(parseInt(item['kind']) === 1 ){						// Section
					// Styling for Section row
					str+="<td class='section item"+blorf+"' placeholder='"+momentexists+"'id='I"+item['lid']+"' style='cursor:pointer;' ";
					kk=0;
				}else if(parseInt(item['kind']) === 2 ){						// Code Example
					str+="<td";

					if(kk==0){
						if(kk%2==0){
							str+=" class='example item"+blorf+"' style='white-space:nowrap;overflow:hidden;' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
						}else{
							str+=" class='example item"+blorf+"' style='white-space:nowrap;overflow:hidden;' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
						}
					}else{
						if(kk%2==0){
							str+=" class='example item"+blorf+"' style='white-space:nowrap;overflow:hidden;' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
						}else{
							str+=" class='example item"+blorf+"' style='white-space:nowrap;overflow:hidden;' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
						}
					}
					kk++;
				}else if(parseInt(item['kind']) === 3 ){						// Dugga
					if(item['highscoremode'] != 0 && parseInt(item['kind']) == 3) {
						str+="<td style='width:20px;'><img style=';' title='Highscore' src='../Shared/icons/top10.png' onclick='showHighscore(\""+item['link']+"\",\""+item['lid']+"\")'/></td>";
					}						
					str += "<td ";
					if(parseInt(item['rowcolor']) === 1){
						str+=" class='example item"+blorf+"' style='display:block;box-shadow: 0px 3px 2px #aaa;background-color:#927b9e;color:white;' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
					}else if(kk%2==0){
						str+=" class='example item"+blorf+"' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
					}else{
						str+=" class='example item"+blorf+"' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
					}
					kk++;
				}else if(parseInt(item['kind']) === 4 ){					// Moment
					//new moment bool equals true
					momentexists = item['lid'];
								
					// Styling for moment row
					str+="<td class='moment item"+blorf+"' placeholder='"+momentexists+"' id='I"+item['lid']+"' style='cursor:pointer;' ";
					kk=0;
				}else if(parseInt(item['kind']) === 5 ){					// Link
					str+="<td";
					if(kk%2==0){
						str+=" class='example item' placeholder='"+momentexists+"'id='I"+item['lid']+"' ";
					}else{
						str+=" class='example item' placeholder='"+momentexists+"' id='I"+item['lid']+"' ";
					}
					kk++;
				}

				// Close Information		
				str+=">";

				// Content of Section Item					
				if (parseInt(item['kind']) == 0) {						// Header
					str+="<span style='padding-left:5px;'>"+item['entryname']+"</span>";
				}else if (parseInt(item['kind']) == 1) {					// Section
					str+="<span style='padding-left:5px;'>"+item['entryname']+"</span><img src='../Shared/icons/desc_complement.svg' class='arrowComp' style='display:inline-block;'><img src='../Shared/icons/right_complement.svg' class='arrowRight' style='display:none;'>";
				}else if (parseInt(item['kind']) == 4) {		// Moment
          var momentsplit = item['entryname'].split(" ");
          var momentname = momentsplit.splice(0,momentsplit.length-1);
          var momenthp = momentsplit[momentsplit.length-1];

          str+="<div style='display:inline-block;'><div class='nowrap"+blorf+"' style='padding-left:5px;'><span class='ellipsis'>"+momentname+"</span> "+momenthp+"</div></div><img src='../Shared/icons/desc_complement.svg' class='arrowComp' style='display:inline-block;'><img src='../Shared/icons/right_complement.svg' class='arrowRight' style='display:none;'>";
				}else if (parseInt(item['kind']) == 2) {		// Code Example
					str+="<span><a class='"+blorf+"' style='margin-left:15px;' href='codeviewer.php?exampleid="+item['link']+"&courseid="+querystring['courseid']+"&cvers="+querystring['coursevers']+"'>"+item['entryname']+"</a></span>";
				}else if (parseInt(item['kind']) == 3 ) {	
					if(parseInt(item['rowcolor']) == 1) {
						str+="<a class='"+blorf+"' style='font-size:14pt;color:white;cursor:pointer;margin-left:15px;' onClick='changeURL(\"showDugga.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&did="+item['link']+"&moment="+item['lid']+"&segment="+momentexists+"&highscoremode="+item['highscoremode']+"&comment="+item['comments']+"&deadline="+item['deadline']+"\");' >"+item['entryname']+"</a>";
					}else{	// Test / Dugga
          var duggasplit = item['entryname'].split(" ");
          var dugganame = duggasplit.splice(0,duggasplit.length-1);
          var dugganumber = duggasplit[duggasplit.length-1];

						str+="<div style='display:flex;'><a class='"+blorf+"' style='cursor:pointer;margin-left:15px;' onClick='changeURL(\"showDugga.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&did="+item['link']+"&moment="+item['lid']+"&segment="+momentexists+"&highscoremode="+item['highscoremode']+"&comment="+item['comments']+"&deadline="+item['deadline']+"\");' ><span class='nowrap'><span class='ellipsis'>"+dugganame+"</span> "+dugganumber+"</span></a></div>";
					}
				}else if(parseInt(item['kind']) == 5){			// Link
					if(item['link'].substring(0,4) === "http"){
						str+= "<a class='"+blorf+"' style='cursor:pointer;margin-left:15px;'  href=" + item['link'] + " target='_blank' >"+item['entryname']+"</a>";
					}else{
						str+="<a class='"+blorf+"' style='cursor:pointer;margin-left:15px;' onClick='changeURL(\"showdoc.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&fname="+item['link']+"\");' >"+item['entryname']+"</a>";
					}
				}
													
				str+="</td>";

				// Due to date and time format problems slice is used to make the variable submitted the same format as variable deadline
				if(submitted){
					var dateSubmitted = submitted.toJSON().slice(0,10).replace(/-/g,'-');
					var timeSubmitted = submitted.toJSON().slice(11,19).replace(/-/g,'-');
					var dateTimeSubmitted = dateSubmitted + [' '] + timeSubmitted;
					
					// create a warning if the dugga is submitted after the set deadline
					if ((status === "pending")&&(dateTimeSubmitted>deadline)){
						str+="<td style='width:20px;'><img style='width:20px;' title='This dugga is not guaranteed to be marked due to submition after deadline.' src='../Shared/icons/warningTriangle.png'/></td>";
					}else{
						
					}
				}

				// Add generic td for deadlines if one exists
				if((parseInt(item['kind']) === 3)&&(deadline!== null || deadline==="undefined")){
/*					if(kk==1){
						str +="<td style='text-align:right;overflow:none;white-space:nowrap;overflow:hidden;width:140px;'";
					}else{
						str +="<td style='text-align:right;overflow:none;white-space:nowrap;overflow:hidden;width:140px;'";
					}
*/
					var dl = deadline.split(" ");
         str+="<td style='text-align:right;white-space:nowrap;overflow:hidden;width:145px;'>";

         var timeFilterAndFormat = "00:00:00";
         var yearFormat = "0000-";
         var dateFormat = "00-00";

         str+="<span class='thisDateShouldDisappearWhenScreenIsTooSmall' style='display:"+hiddenInline+";'>";

          // If the deadline is 00:00:00, only show YYYY-MM-DD
         if(dl[1] == timeFilterAndFormat) {
          str+=deadline.slice(0, yearFormat.length)+"</span>"+deadline.slice(yearFormat.length, yearFormat.length+dateFormat.length);
					} else {
          // If the deadline is set to another time, show the full YYYY-MM-DD HH:MM:SS
          // If the screen is to narrow, only show the MM-DD HH:MM
          str+=deadline.slice(0, yearFormat.length)+"</span>"+deadline.slice(yearFormat.length, yearFormat.length+dateFormat.length+1+timeFilterAndFormat.length-3)+"<span class='thisDateShouldDisappearWhenScreenIsTooSmall' style='display:"+hiddenInline+";'>"+deadline.slice(yearFormat.length+dateFormat.length+1+timeFilterAndFormat.length-3, yearFormat.length+dateFormat.length+1+timeFilterAndFormat.length)+"</span>"
;
					}
        str+="</td>";
       } else {
					// Do nothing
				}

				// Cog Wheel
				if(data['writeaccess']){
						str+="<td style='width:24" +
							"px;";
						
					
						if(parseInt(item['kind']) === 0){
								str+="' class='header"+blorf+"'><img id='dorf' style='margin:4px' src='../Shared/icons/Cogwheel.svg' onclick='selectItem(\""+item['lid']+"\",\""+item['entryname']+"\",\""+item['kind']+"\",\""+item['visible']+"\",\""+item['link']+"\",\""+momentexists+"\",\""+item['gradesys']+"\",\""+item['highscoremode']+"\",\""+item['comments']+"\",\""+item['rowcolor']+"\",\""+item['grouptype']+"\");' /></td>";
						}else if(parseInt(item['kind']) === 1){
								str+="' class='section"+blorf+"'><img id='dorf' style='margin:4px' src='../Shared/icons/Cogwheel.svg' onclick='selectItem(\""+item['lid']+"\",\""+item['entryname']+"\",\""+item['kind']+"\",\""+item['visible']+"\",\""+item['link']+"\",\""+momentexists+"\",\""+item['gradesys']+"\",\""+item['highscoremode']+"\",\""+item['comments']+"\",\""+item['rowcolor']+"\",\""+item['grouptype']+"\");' /></td>";											
						}else if(parseInt(item['kind']) === 4){
								str+="' class='moment"+blorf+"'><img id='dorf' style='margin:4px' src='../Shared/icons/Cogwheel.svg' onclick='selectItem(\""+item['lid']+"\",\""+item['entryname']+"\",\""+item['kind']+"\",\""+item['visible']+"\",\""+item['link']+"\",\""+momentexists+"\",\""+item['gradesys']+"\",\""+item['highscoremode']+"\",\""+item['comments']+"\",\""+item['rowcolor']+"\",\""+item['grouptype']+"\");' /></td>";											
						}else{
								str+="' ><img id='dorf' style='margin:4px' src='../Shared/icons/Cogwheel.svg' onclick='selectItem(\""+item['lid']+"\",\""+item['entryname']+"\",\""+item['kind']+"\",\""+item['visible']+"\",\""+item['link']+"\",\""+momentexists+"\",\""+item['gradesys']+"\",\""+item['highscoremode']+"\",\""+item['comments']+"\",\""+item['rowcolor']+"\",\""+item['grouptype']+"\");' /></td>";																	
						}
				}


                str += "</tr>";
				
				
				str +="</table></div>";
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
    disappearingFields();
//    toggleMenuButtons();
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

// Function for toggling content for each moment
$(document).on('click', '.moment', function () {
	$(this).nextUntil('.moment').slideToggle();
    $(this).children('.arrowRight').slideToggle();
    $(this).children('.arrowComp').slideToggle();
});

// Function for toggling content for each section
$(document).on('click', '.section', function () {
	$(this).nextUntil('.section').slideToggle();
	$(this).children('.arrowRight').slideToggle();
	$(this).children('.arrowComp').slideToggle();
});

// Function for toggling content for all moments
$(document).on('click', '.showhide', function () {
    $('.moment').nextUntil('.moment').slideToggle();
    $('.moment').children('.arrowRight').slideToggle();
    $('.moment').children('.arrowComp').slideToggle();
});

// Function for toggling content for all sections
$(document).on('click', '.showhide', function () {
    $('.showhide').children('.arrowRightTop').slideToggle();
    $('.showhide').children('.arrowCompTop').slideToggle();
    $('.section').nextUntil('.section').slideToggle();
    $('.section').children('.arrowRight').slideToggle();
    $('.section').children('.arrowComp').slideToggle();
});

// Function to prevent collapsing when clicking icons
$(document).ready(function(){
	$(document).on('click','#corf',function(e) {
		e.stopPropagation();
	});
	$(document).on('click','#dorf',function(e) {
		e.stopPropagation();
	});
});