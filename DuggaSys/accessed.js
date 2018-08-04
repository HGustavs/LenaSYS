var sessionkind=0;
var activeElement;
var querystring=parseGet();
var versions;
var dataInfo;
var expanded = false;
var searchterm = "";
var tableName = "accessTable";
var tableCellName = "accessTableCell";

//----------------------------------------
// User Interface:
//----------------------------------------

function setup()
{
  AJAXService("GET",{cid:querystring['cid'],coursevers:querystring['coursevers']},"ACCESS");
}

function hoverc()
{
    $('#dropdowns').css('display','none');
    $('#dropdownc').css('display','block');
}

function hovers()
{
  $('#dropdowns').css('display','block');
  $('#dropdownc').css('display','none');
}

function leavec()
{
		$('#dropdownc').css('display','none');
}

function leaves()
{
		$('#dropdowns').css('display','none');
}

function showCreateUserPopup()
{
	$("#createUser").css("display","flex");
}

function showCreateClassPopup()
{
	$("#createClass").css("display","flex");
}

function showImportUsersPopup()
{
	$("#importUsers").css("display", "flex");
}

function hideCreateUserPopup()
{
    $("#createUser").css("display","none");
}

function hideCreateClassPopup()
{
    $("#createClass").css("display","none");
}

function hideImportUsersPopup()
{
	$("#importUsers").css("display","none");
}

function closeEdituser()
{
    $("#editUsers").css("display","none");
}

//----------------------------------------
// Commands:
//----------------------------------------

function importUsers()
{
	var newUsersArr = new Array();
	newusers=$("#import").val();
	var myArr=newusers.split("\n");
	for (var i=0; i<myArr.length; i++){
			newUsersArr.push(myArr[i].split("\t"));
	}
	var newUserJSON = JSON.stringify(newUsersArr);

	AJAXService("CLASS",{cid:querystring['cid'],newusers:newUserJSON,coursevers:querystring['coursevers']},"ACCESS");
	hideImportUsersPopup();
}

function addSingleUser()
{
    var newUser = new Array();
    newUser.push($("#addSsn").val());
    newUser.push($("#addLastname").val() + ", " + $("#addFirstname").val());
    newUser.push($("#addCid").val());
    newUser.push($("#addNy").val());
    newUser.push($("#addPid").val() + ', ' + $("#addTerm").val());
    newUser.push($("#addEmail").val());

    var outerArr = new Array();
    outerArr.push(newUser);

    var newUserJSON = JSON.stringify(outerArr);
    AJAXService("ADDUSR",{cid:querystring['cid'],newusers:newUserJSON,coursevers:querystring['coursevers']},"ACCESS");
    hideCreateUserPopup();
}

var inputVerified;

function addClass()
{
  inputVerified = true;
  document.getElementById("classErrorText").innerHTML = "";
  var newClass = new Array();
  newClass.push(verifyClassInput($("#addClass"), null, ""));
  newClass.push(verifyClassInput($("#addResponsible"), null, ""));
  newClass.push(verifyClassInput($("#addClassname"), null, ""));
  newClass.push(verifyClassInput($("#addRegcode"), /^[0-9]*$/, "number"));
  newClass.push(verifyClassInput($("#addClasscode"), null, ""));
  newClass.push(verifyClassInput($("#addHp"), /^[0-9.]*$/, "(decimal) number"));
  newClass.push(verifyClassInput($("#addTempo"), /^[0-9]*$/, "number"));
  newClass.push(verifyClassInput($("#addHpProgress"), /^[0-9.]*$/, "(decimal) number"));

  if(inputVerified){
    var outerArr = new Array();
    outerArr.push(newClass);

    var newClassJSON = JSON.stringify(outerArr);
    AJAXService("ADDCLASS",{cid:querystring['cid'],newclass:newClassJSON,coursevers:querystring['coursevers']},"ACCESS");
    hideCreateClassPopup();
  }
}

function resetPw(uid,username)
{
    rnd=randomstring();

    window.location="mailto:"+username+"@student.his.se?Subject=LENASys%20Password%20Reset&body=Your%20new%20password%20for%20LENASys%20is:%20"+rnd+"%0A%0A/LENASys Administrators";

    AJAXService("CHPWD",{cid:querystring['cid'],uid:uid,pw:rnd,coursevers:querystring['coursevers']},"ACCESS");
}

function changeOpt(e)
{
		var paramlist=e.target.id.split("_");
		changeProperty(paramlist[1],paramlist[0],e.target.value);
}

function changeProperty(targetobj,propertyname,propertyvalue)
{
		AJAXService("UPDATE",{cid:querystring['cid'],uid:targetobj,prop:propertyname,val:propertyvalue},"ACCESS");
}

//----------------------------------------------------------------
// rowFilter <- Callback function that renders cells in the table
//----------------------------------------------------------------

function renderCell(col,celldata,cellid) {
		var str="UNK";
		if(col == "username"||col == "ssn"||col == "firstname"||col == "lastname"||col == "class"||col == "examiner"||col == "groups"||col == "vers"||col == "access"){
					obj = JSON.parse(celldata);			
		}
	
		if(col == "username"||col == "ssn"||col == "firstname"||col == "lastname"){
			str = "<input id='"+col+"_"+obj.uid+"' onKeyDown='if(event.keyCode==13) changeOpt(event)' value=\""+obj[col]+"\" size=8 >";
		}else if(col=="class"){
			str="<select onchange='changeOpt(event)' id='"+col+"_"+obj.uid+"'><option value='None'>None</option>"+makeoptionsItem(obj.class,filez['classes'],"class","class")+"</select>";
		}else if(col=="examiner"){
			str="<select onchange='changeOpt(event)' id='"+col+"_"+obj.uid+"'><option value='None'>None</option>"+makeoptionsItem(obj.examiner,filez['teachers'],"name","uid")+"</select>";
		}else if(col=="vers"){
			str="<select onchange='changeOpt(event)' id='"+col+"_"+obj.uid+"'>"+makeoptionsItem(obj.vers,filez['courses'],"versname","vers")+"</select>";
		}else if(col=="access"){
			str="<select onchange='changeOpt(event)' id='"+col+"_"+obj.uid+"'>"+makeoptions(obj.access,["Teacher","Student"],["W","R"])	+"</select>";
		}else if(col == "requestedpasswordchange") {
				str = "<input class='submit-button' type='button' value='Reset PW' style='float:none;'";
				str += " onclick='if(confirm(\"Reset password for " + obj.username + "?\")) ";
				str += "resetPw(\""+ obj.uid +"\",\""+ obj.username + "\"); return false;'>";
		}else if(col == "groups") {
				if(obj.groups==null){
						var tgroups=[];
				}else{
						var tgroups=obj.groups.split(" ");
				}
				var optstr="";
				for(var i=0;i<tgroups.length;i++){
						if(i>0) optstr+=" ";
						optstr+=tgroups[i];
				}
				str= "<div class='multiselect-group'><div class='group-select-box' onclick='showCheckboxes(this)'>";
				str+= "<select><option>"+optstr+"</option></select><div class='overSelect'></div></div><div class='checkboxes' id='grp"+obj.uid+"' >";
				for(var i=0;i<filez['groups'].length;i++){
						var group=filez['groups'][i];
						if(tgroups.indexOf(group.groupval)>-1){
								str += "<label><input type='checkbox' checked id='g"+obj.uid+"' />"+group.groupval+"</label>";						
						}else{
								str += "<label><input type='checkbox' id='g"+obj.uid+"' />"+group.groupval+"</label>";												
						}
				}
				str += '</div></div>';
		}else{
				str=celldata;
		}
		return str;
	
}

function renderSortOptions(col,status) {
	str = "";
	if (status == -1) {
		str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + col + "</span>";
	} else if (status == 0) {
		str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + col + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
	} else {
		str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + col + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
	}
	return str;
}

//----------------------------------------------------------------
// rowFilter <- Callback function that sorts rows in the table
//----------------------------------------------------------------

function compare(a,b) {
	var col = sortableTable.currentTable.getSortcolumn();
	var tempA = a;
	var tempB = b;

	// Needed so that the counter starts from 0
	// everytime we sort the table
	count = 0;
	if (col == "Examiner") {
		tempA = JSON.parse(tempA)['examiners'];
		tempB = JSON.parse(tempB)['examiners'];
    tempA = tempA[tempA.length - 1]['teacher'];
    tempB = tempB[tempB.length - 1]['teacher'];
	}

  if(tempA != null){
    tempA = tempA.toUpperCase();
  }
  if(tempB != null){
    tempB = tempB.toUpperCase();
  }

	if (tempA > tempB) {
		return 1;
	} else if (tempA < tempB) {
		return -1;
	} else {
		return 0;
	}
}

//----------------------------------------------------------------
// rowFilter <- Callback function that filters rows in the table
//----------------------------------------------------------------
function rowFilter(row) {
	for (key in row) {
    if (key == "examiner"){
      var examiners = JSON.parse(row[key])['examiners']
      var teacher = examiners[examiners.length - 1]['teacher'];
      if (teacher && teacher.toUpperCase().indexOf(searchterm.toUpperCase()) != -1) return true;
    } else if (key == "access") {
      var access = "none";
      if (JSON.parse(row[key])['access'] == "W"){
        access = "teacher";
      } else if (JSON.parse(row[key])['access'] == "R"){
        access = "student";
      }
			if (access.toUpperCase().indexOf(searchterm.toUpperCase()) != -1) return true;
		} else if (row[key] != null) {
			if (row[key].toUpperCase().indexOf(searchterm.toUpperCase()) != -1) return true;
		}
	}
	return false;
}

function renderColumnFilter(colname,col,status) {
  str = "<div class='checkbox-dugga'>";
  str += "<input " + (status ? "checked " : "") + "type='checkbox' onclick='myTable.toggleColumn(\"" + colname + "\",\"" + col + "\")'><label class='headerlabel'>" + col + "</label>";
  str += "</div>";
  return str;
}

var myTable;
//----------------------------------------
// Renderer
//----------------------------------------

function returnedAccess(data) {

	filez = data;
	
	if(data['debug']!="NONE!") alert(data['debug']);
	
	if(data["entries"].length>0){
			document.getElementById("sort").style.display="table-cell";
			document.getElementById("select").style.display="table-cell";		
	}

	var tabledata = {
		tblhead:{
			username:"User",
			ssn:"SSN",
			firstname:"First name",
			lastname:"Last name",
			class:"Class",
			modified:"Added",
			examiner:"Examiner",
			vers:"Version",
			access:"Access",
			groups:"Group(s)",
			requestedpasswordchange:"Password"
		},
		tblbody: data['entries'],
		tblfoot:[]
	}
	myTable = new SortableTable(
		tabledata,
		"accessTable",
		"filterOptions",
		"",
		renderCell,
		renderSortOptions,
		renderColumnFilter,
		rowFilter,
		[],
		[],
		"",
		null,
		null,
		null,
		null,
		null,
		null,
		true,
		true
	);
	myTable.renderTable();
	
}

//excuted onclick button for quick searching in table
function keyUpSearch() {
	$('#searchinput').keyup(function() {
	    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
	    $('#accesstable_body tr').show().filter(function() {
	        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
	        return !~text.indexOf(val);
	    }).hide();
	});
}

function showCheckboxes(element) {
	activeElement = element;
	var checkboxes = $(element).find(".checkboxes");
	checkboxes = element.parentElement.lastChild;
	if (!expanded) {
		checkboxes.style.display = "block";
		expanded = true;
	} else {
		checkboxes.style.display = "none";
		expanded = false;
    }
}

$(document).mouseup(function(e)
{
	// if the target of the click isn't the container nor a descendant of the container
	if (activeElement) {
		var checkboxes = $(activeElement).find(".checkboxes");
		checkboxes = activeElement.parentElement.lastChild;

		if (expanded && !checkboxes.contains(e.target)){
			checkboxes.style.display = "none";
			var str="";
			for(i=0;i<checkboxes.childNodes.length;i++){
					if(checkboxes.childNodes[i].childNodes[0].checked){
							str+=checkboxes.childNodes[i].textContent+" ";
					}
			}
			expanded=false;
			changeProperty(checkboxes.id.substr(3),"group",str);
		}
  }
});

function toggleFabButton() {
	if (!$('.fab-btn-sm').hasClass('scale-out')) {
		$('.fab-btn-sm').toggleClass('scale-out');
		$('.fab-btn-list').delay(100).fadeOut(0);
	} else {
		$('.fab-btn-list').fadeIn(0);
		$('.fab-btn-sm').toggleClass('scale-out');
	}
}

$(document).mouseup(function(e) {
	// The "Import User(s)" popup should appear on
	// a "fast click" if the fab list isn't visible
	if (!$('.fab-btn-list').is(':visible')) {
			if (e.target.id == "fabBtnAcc") {
				clearTimeout(pressTimer);
				showImportUsersPopup();
			 }
			 return false;
   }
	// Click outside the FAB list
    if ($('.fab-btn-list').is(':visible') && !$('.fixed-action-button').is(e.target)// if the target of the click isn't the container...
        && $('.fixed-action-button').has(e.target).length === 0) {// ... nor a descendant of the container
		if (!$('.fab-btn-sm').hasClass('scale-out')) {
			$('.fab-btn-sm').toggleClass('scale-out');
			$('.fab-btn-list').delay(100).fadeOut(0);
		}
	} else if ($('.fab-btn-list').is(':visible') && $('.fixed-action-button').is(e.target)) {
		if (!$('.fab-btn-sm').hasClass('scale-out')) {
			$('.fab-btn-sm').toggleClass('scale-out');
			$('.fab-btn-list').fadeOut(0);
		}
	}
}).mousedown(function(e) {
	// If the fab list is visible, there should be no timeout to toggle the list
	if ($('.fab-btn-list').is(':visible')) {
			fabListIsVisible = false;
	} else {
			fabListIsVisible = true;
	}
	if (fabListIsVisible) {
		if (e.target.id == "fabBtnAcc") {
			pressTimer = window.setTimeout(function() {toggleFabButton();}, 500);
		}
	} else {
		toggleFabButton();
		if (e.target.id == "iFabBtn" || e.target.id == "iFabBtnImg") {
	    	showImportUsersPopup();
	  }else if(e.target.id == "cFabBtn" || e.target.id == "cFabBtnImg"){
	    	showCreateUserPopup();
		}
	}
})
