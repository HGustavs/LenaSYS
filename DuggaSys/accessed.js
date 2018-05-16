var sessionkind=0;
var querystring=parseGet();
var versions;
var dataInfo;
var searchterm = "";

AJAXService("GET",{cid:querystring['cid'],coursevers:querystring['coursevers']},"ACCESS");

//----------------------------------------
// Commands:
//----------------------------------------

function setup()
{
	/*    Add filter icon in the navheader   */
	var filt ="";
	filt+="<td id='select' class='navButt'><span class='dropdown-container' onmouseover='hoverc();' onmouseleave='leavec();'>";
	filt+="<img class='navButt' src='../Shared/icons/tratt_white.svg'>";
	filt+="<div id='dropdownc' class='dropdown-list-container' style='z-index: 1'>";
	filt+="</div>";
	filt+="</span></td>";
	$("#menuHook").html(filt);

	var dropdownOptions = "";
	dropdownOptions+="<div class='checkbox-accessed accessedLine'><input type='checkbox' checked class='headercheck' id='selectAll' onclick='checkedAll();'><label class='headerlabel'>Select all/Unselect all</label></div>";
	dropdownOptions+="<div class='checkbox-accessed accessedLine'></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' checked class='headercheck selectoption'  id='selectusername' onclick='filter(\"username\");'><label class='headerlabel'>User</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' checked class='headercheck selectoption' id='selectssn' onclick='filter(\"ssn\");'><label class='headerlabel'>SSN</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' checked class='headercheck selectoption' id='selectfirstname' onclick='filter(\"firstname\");'><label class='headerlabel'>First Name</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' checked class='headercheck selectoption' id='selectlastname' onclick='filter(\"lastname\");'><label class='headerlabel'>Last Name</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' checked class='headercheck selectoption' id='selectclass' onclick='filter(\"class\");'><label class='headerlabel'>Class</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' checked class='headercheck selectoption' id='selectmodified' onclick='filter(\"modified\");'><label class='headerlabel'>Added</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' checked class='headercheck selectoption' id='selectexaminer' onclick='filter(\"examiner\");'><label class='headerlabel'>Examiner</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' checked class='headercheck selectoption' id='selectvers' onclick='filter(\"vers\");'><label class='headerlabel'>Version</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' checked class='headercheck selectoption' id='selectaccess' onclick='filter(\"access\");'><label class='headerlabel'>Access</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' checked class='headercheck selectoption' id='selectrequestedpasswordchange' onclick='filter(\"requestedpasswordchange\");'><label class='headerlabel'>Password</label></div>";
	$("#dropdownc").html(dropdownOptions);

	/*    Add sort icon in the navheader   */
	var sort = "";
	sort+="<td id='filter' class='navButt'><span class='dropdown-container' onmouseover='hovers();' onmouseleave='leaves();'>";
	sort+="<img class='navButt' src='../Shared/icons/sort_white.svg'>";
	sort+="<div id='dropdowns' class='dropdown-list-container'>";
	sort+="</div>";
	sort+="</span></td>";
	$("#menuHook").append(sort);

	dropdownOptions = "";
	dropdownOptions+="<div class='checkbox-accessed accessedLine'></div>";
	dropdownOptions+="<div class='checkbox-accessed' style='border-bottom:1px solid #888'><input type='radio' checked class='headercheck' name='sortdir' value='1' id='sortdir1'><label class='headerlabel' for='sortdir1'>Sort ascending</label><input name='sortdir' onclick='toggleSortDir(0)' type='radio' class='headercheck' value='-1' id='sortdir0'><label class='headerlabel' for='sortdir0'>Sort descending</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input name='sortcol' type='radio' class='headercheck'  id='selectUser' onclick='sorttype(0);'><label class='headerlabel'>User</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input name='sortcol' type='radio' class='headercheck' id='selectSSN' onclick='sorttype(1);'><label class='headerlabel'>SSN</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input name='sortcol' type='radio' class='headercheck' id='selectFN' onclick='sorttype(2);'><label class='headerlabel'>First Name</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input name='sortcol' type='radio' class='headercheck' id='selectLN' onclick='sorttype(3);'><label class='headerlabel'>Last Name</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input name='sortcol' type='radio' class='headercheck' id='selectClass' onclick='sorttype(4);'><label class='headerlabel'>Class</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input name='sortcol' type='radio' class='h+eadercheck' id='selectAdded' onclick='sorttype(5);'><label class='headerlabel'>Added</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input name='sortcol' type='radio' class='headercheck' id='selectExaminer' onclick='sorttype(6);'><label class='headerlabel'>Examiner</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input name='sortcol' type='radio' class='headercheck' id='selectVersion' onclick='sorttype(7);'><label class='headerlabel'>Version</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input name='sortcol' type='radio' checked class='headercheck' id='selectAccess' onclick='sorttype(8);'><label class='headerlabel'>Access</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input name='sortcol' type='radio' class='headercheck' id='selectPassword' onclick='sorttype(9);'><label class='headerlabel'>Password</label></div>";
	$("#dropdowns").html(dropdownOptions);
}

function fillResponsibleOptions(responsibles)
{
    var selectResponsibleTag = document.getElementById("addResponsible");    
    var formatInnerHTML = function(responsibles, i){return responsibles[i]["firstname"]+" "+responsibles[i]["lastname"]+" ("+responsibles[i]["uid"]+")";}
    var formatValue = function(responsibles, i){return responsibles[i]["uid"];}
    
    for(var i = 0;i < responsibles.length; i++){
	addSingleOptionToSelectTag(selectResponsibleTag, responsibles, formatInnerHTML, formatValue, i);
    }
}

// formatInnerHTMLFunction - provide a function to format the string. Same for formatValueFunction.
function addSingleOptionToSelectTag(tag, jsonList, formatInnerHTMLFunction, formatValueFunction, index)
{
    var option = document.createElement("option");
    option.innerHTML = formatInnerHTMLFunction(jsonList, index);
    option.value = formatValueFunction(jsonList, index);
    tag.appendChild(option);
}

function hoverc()
{
    $('#dropdowns').css('display','none');
    $('#dropdownc').css('display','block');
}

function leavec()
{
		$('#dropdownc').css('display','none');
}

function hovers()
{
    $('#dropdownc').css('display','none');
    $('#dropdowns').css('display','block');
}

function leaves()
{
		$('#dropdowns').css('display','none');
}

function filter(name)
{
	if (document.getElementById("select" + name).checked){
		var arr = document.getElementsByClassName("user-" + name);
		document.getElementById(name + "_user_tbl").style.display = "table-cell";
		for (var i = 0; i < arr.length; i++){
			arr[i].style.display = "table-cell";
		}
	} else {
		var arr = document.getElementsByClassName("user-" + name);
		document.getElementById(name + "_user_tbl").style.display = "none";
		for (var i = 0; i < arr.length; i++){
			arr[i].style.display = "none";
		}
	}
}

function toggleSortDir(type)
{

}

function sorttype(type)
{

}

function checkedAll()
{
	// Current state
	var accessedElements = document.getElementsByClassName("selectoption");
	var selectToggle = document.getElementById('selectAll');

	// Yes, there is at lease one element checked, so default is clear
	if(!selectToggle.checked) {
		selectToggle.checked = false;
		for (var i =0; i < accessedElements.length; i++) {
			accessedElements[i].checked = false;
			filter(accessedElements[i].getAttribute('id').replace("select", ""));
		}
	} else { // There are no element(s) checked, so set all
		selectToggle.checked = true;
		for (var i =0; i < accessedElements.length; i++) {
			accessedElements[i].checked = true;
			filter(accessedElements[i].getAttribute('id').replace("select", ""));
		}
	}
}

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

function addClass()
{
    var newClass = new Array();
    newClass.push($("#addClass").val());
    newClass.push($("#addResponsible").val());
    newClass.push($("#addClassname").val());
    newClass.push($("#addRegcode").val());
    newClass.push($("#addClasscode").val());
    newClass.push($("#addHp").val());
    newClass.push($("#addTempo").val());
    newClass.push($("#addHpProgress").val());

    var outerArr = new Array();
    outerArr.push(newClass);

    var newClassJSON = JSON.stringify(outerArr);
    AJAXService("ADDCLASS",{cid:querystring['cid'],newclass:newClassJSON,coursevers:querystring['coursevers']},"ACCESS");
    hideCreateClassPopup();
}

function showCreateUserPopup()
{
	$("#createUser").css("display","flex");
	//$("#overlay").css("display","block");
}

function showCreateClassPopup()
{
	$("#createClass").css("display","flex");
	//$("#overlay").css("display","block");
}

function showImportUsersPopup()
{
	$("#importUsers").css("display", "flex");
	//$("#overlay").css("display", "block");
}

function hideCreateUserPopup()
{
    $("#createUser").css("display","none");
    //$("#overlay").css("display","none");
}

function hideCreateClassPopup()
{
    $("#createClass").css("display","none");
    //$("#overlay").css("display","none");
}

function hideImportUsersPopup()
{
	$("#importUsers").css("display","none");
	//$("#overlay").css("display","none");
}

function changeAccess(cid,uid,val)
{
	AJAXService("ACCESS",{cid:cid,uid:uid,val:val,coursevers:querystring['coursevers']},"ACCESS");
}

function changeVersion(cid,uid,val)
{
	AJAXService("VERSION",{cid:cid,uid:uid,val:val,coursevers:querystring['coursevers']},"ACCESS");
}

function changeExaminer(cid,uid,val)
{
	AJAXService("EXAMINER",{cid:cid,uid:uid,val:val,coursevers:querystring['coursevers']},"ACCESS");
}
function changeUsername(uid,id)
{
	AJAXService("USERNAME",{cid:querystring['cid'],uid:uid,val:$("#"+id).val(),coursevers:querystring['coursevers']},"ACCESS");
}
function changeSSN(uid,id)
{
	AJAXService("SSN",{cid:querystring['cid'],uid:uid,val:$("#"+id).val(),coursevers:querystring['coursevers']},"ACCESS");
}
function changeFirstname(uid,id)
{
	AJAXService("FIRSTNAME",{cid:querystring['cid'],uid:uid,val:$("#"+id).val(),coursevers:querystring['coursevers']},"ACCESS");
}
function changeLastname(uid,id)
{
	AJAXService("LASTNAME",{cid:querystring['cid'],uid:uid,val:$("#"+id).val(),coursevers:querystring['coursevers']},"ACCESS");
}
function changeClass(cid,uid,val,selected)
{
    if(val!="newClass"){
	AJAXService("CLASS",{cid:cid,uid:uid,val:val,coursevers:querystring['coursevers']},"ACCESS");
    }else if(val=="newClass"){
	AJAXService("CLASS",{cid:cid,uid:uid,val:selected,coursevers:querystring['coursevers']},"ACCESS");
	showCreateClassPopup();
    }
}

// Sets values in the "cogwheel popup"
//function selectUser(uid,username,ssn,firstname,lastname,access,className,teacherstring,classString)
function selectUser(uid,username,ssn,firstname,lastname,access,className)
{
    // Reverts the string to an array
    /*
       var teachs = teacherstring.split("/t");
       var userClass = classString.split("/t");
       // Sort the array to make navigation easier
       teachs.sort();
       userClass.sort();

       // Array with no spaces used for our IF case as option[value] does not work with spaces
       var trimmed = $.map(teachs, function(value){
       return value.replace(/ /g, '');
       });

       // Loop through our array to put the teachers into an option in our select input
       for(var i = 0; i < teachs.length; i++){
       // If the teacher already exists in an option
       if($("#teacher option[value="+ trimmed[i] +"]").length > 0){
       // Loop through all of our options
       $("#teacher option").each(function(){

       // If a teacher no longer exists but the option for said teacher still exists
       if ($.inArray(this.text, teachs) == -1)
       {
       // Remove that option
       $(this).remove();
       }
       })
       }
       // If the teacher doesn't exist in an option
       else{
       // Create a new option where the value and text is the teachers name
       $('#teacher').append($('<option>', {
       value: trimmed[i],
       text: teachs[i]
       }));
       }
       };

       // Loop through our array to put the classes into an option in our select input
       for(var j = 0; j < userClass.length; j++){
       // If the class already exists in an option
       if($("#class option[value="+ userClass[j] +"]").length > 0){
       }
       // If the class doesn't exist in an option
       else{
       // Create a new option where the value and text is the classes name
       $('#class').append($('<option>', {
       value: userClass[j],
       text: userClass[j]
       }));
       }
       };

     */
    // Set Name
    $("#firstname").val(firstname);
    $("#lastname").val(lastname);

    // Set User name
    $("#usrnme").val(username);

    //Set SSN
    $("#ussn").val(ssn);
    if (className != "null" || className != "UNK") {$("#class").val(className);}
    $("#uid").val(uid);

    // Displays the cogwheel box
    $("#editUsers").css("display","flex");

    //$("#overlay").css("display","block");
}

function updateUser()
{
    var ussn=$("#ussn").val();
    var usrnme=$("#usrnme").val();
    var firstname=$("#firstname").val();
    var lastname=$("#lastname").val();
    var uid=$("#uid").val();
    var className=$("#class").val();
    var teach=$("#teacher").val();

    AJAXService("UPDATE",{ssn:ussn,uid:uid,firstname:firstname,lastname:lastname,username:usrnme,className:className,cid:querystring['cid'],coursevers:querystring['coursevers'],teacher:teach},"ACCESS");

    $("#editUsers").css("display","none");
    //$("#overlay").css("display","none");
}

function closeEdituser()
{
    $("#editUsers").css("display","none");
}

function resetPw(uid,username)
{
    rnd=randomstring();

    window.location="mailto:"+username+"@student.his.se?Subject=LENASys%20Password%20Reset&body=Your%20new%20password%20for%20LENASys%20is:%20"+rnd+"%0A%0A/LENASys Administrators";

    AJAXService("CHPWD",{cid:querystring['cid'],uid:uid,pw:rnd,coursevers:querystring['coursevers']},"ACCESS");
}

/**
 * Selects column to be sorted from table.
 * @param prop Column to sort
 * @returns {Function} Sorting function with the correct property to fetch.
 */
function propComparator(prop) {
    var propt = prop.split(' ').join('').toLocaleLowerCase();
    return function(a, b) {
	if(!a[propt] || !b[propt]) {
            return 0;
        }
        else{
            var aName = a[propt].toLowerCase();
            var bName = b[propt].toLowerCase();
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
	}
    }
}
var bool = true;
/**
 * Sort based on what cell was pressed. Toggles between sort and reverse sort.
 * @param column
 */

function renderCell(col,celldata,cellid) {
  
	if(col == "requestedpasswordchange") {
		obj=JSON.parse(celldata);
		str = "<input class='submit-button' type='button' value='Reset PW' style='float:none;'";
		str += " onclick='if(confirm(\"Reset password for " + obj.username + "?\")) ";
    str += "resetPw(\""+ obj.uid +"\",\""+ obj.username + "\"); return false;'>";
    return str;
	}else if(col == "examiner"){
    obj=JSON.parse(celldata)['examiners'];
    if(obj[obj.length - 1]['access'] == 'W'){
      str = "none";
    }else{
      var teacher = obj[obj.length - 1]['teacher'];
      var items = new Array();
      items.push("unassigned");
      for(var i = 0; i < obj.length - 1; i++){
        items.push(obj[i]['username']);
      }
      str = makeDropdown("changeExaminer(\""+querystring['cid']+"\",\""+obj[obj.length - 1]['uid']+"\",this.value);", items, items, teacher);
      str += "<div style='display:none;'>" + teacher + "</div>";
    }
    return str;
  }else if(col == "access"){
    obj=JSON.parse(celldata);
    str = makeDropdown("changeAccess(\""+querystring['cid']+"\",\""+obj.uid+"\",this.value);", new Array("W", "R", "null"), new Array("Teacher", "Student", "none"), obj.access);
    str += "<div style='display:none;'>" + obj.access + "</div>";
    return str;
	}else if(col == "vers"){
    obj=JSON.parse(celldata);
    var items = new Array();
    for(var i = 0; i < filez['courses'].length; i++){
      items.push(filez['courses'][i]['vers']);
    }
    str = makeDropdown("changeVersion(\""+querystring['cid']+"\",\""+obj.uid+"\",this.value);", items, items, obj.vers);
    return str;
	}else if (col == "username") {
		obj = JSON.parse(celldata);
		str = "<input id=\""+cellid+"_input\" onKeyDown='if(event.keyCode==13) changeUsername("+obj.uid+",\""+cellid+"_input\");' value=\""+obj.username+"\" size=8 onload='resizeInput(\""+cellid+"_input\")'>";
		return str;
	}else if (col == "ssn") {
		obj = JSON.parse(celldata);
		str = "<input id=\""+cellid+"_input\" onKeyDown='if(event.keyCode==13) changeSSN("+obj.uid+",\""+cellid+"_input\");' value=\""+obj.ssn+"\" size=13 onclick='return false;'>";
		return str;
	}else if (col == "firstname") {
		obj = JSON.parse(celldata);
		str = "<input id=\""+cellid+"_input\" onKeyDown='if(event.keyCode==13) changeFirstname("+obj.uid+",\""+cellid+"_input\");' value=\""+obj.firstname+"\" size=8 onclick='return false;'>";
		return str;
	}else if (col == "lastname") {
		obj = JSON.parse(celldata);
		str = "<input id=\""+cellid+"_input\" onKeyDown='if(event.keyCode==13) changeLastname("+obj.uid+",\""+cellid+"_input\");' value=\""+obj.lastname+"\" size=10 onclick='return false;'>";
		return str;
	}else if(col == "class"){
	obj=JSON.parse(celldata);
	var items = new Array();
	for(var i = 0; i < filez['classes'].length; i++){
	    items.push(filez['classes'][i]['class']);
	}
	    var selectedItem = obj.class;
	    str = makeClassDropdown("changeClass(\""+querystring['cid']+"\",\""+obj.uid+"\",this.value,\""+selectedItem+"\");", items, items, selectedItem);
	str += "<div style='display:none;'>" + obj.class + "</div>";
	return str;
    } else if(col == "groups") {
	return "<span>" + celldata + "</span>";
    } else {
	return "<div id='" + cellid + "'>" + celldata + "</div>";
    }
    return celldata;
}

function makeDropdown(onChange, values, items, selected){
    str = "<select id='testId' onChange='"+onChange+"' onclick='return false;'>";
    for(var i = 0; i < values.length; i++){
	str+="<option value='"+values[i]+"'" + (values[i] == selected ? " selected='selected'" : "") + ">"+items[i]+"</option>";
    }
    str+="</select>";
    return str;
}

function makeClassDropdown(onChange, values, items, selected){
    str = "<select onChange='"+onChange+"' onclick='return false;'>";

    str+= "<option value='null'></option>";

    for(var i = 0; i < values.length; i++){
	str+="<option value='"+values[i]+"'" + (values[i] == selected ? " selected='selected'" : "") + ">"+items[i]+"</option>";
    }
    str+= "<option value='newClass'>&#x2795 New Class</option>";
    str+="</select>";
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

function compare(a,b) {
	let col = sortableTable.currentTable.getSortcolumn();
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
      if (teacher.toUpperCase().indexOf(searchterm.toUpperCase()) != -1) return true;
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

var myTable;
//----------------------------------------
// Renderer
//----------------------------------------

function returnedAccess(data) {
    setup();
    fillResponsibleOptions(data.responsibles);
	filez = data;
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
		"user",
		null,
		"",
	    renderCell,
	    renderSortOptions,
	    null,
	    rowFilter,
	    [],
	    [],
	    "",
	    null,
	    null,
		rowHighlightOn,
		rowHighlightOff,
		null,
	    null,
		true
	);
	myTable.renderTable();
	if(data['debug']!="NONE!") alert(data['debug']);
}

window.onresize = function() {

myTable.magicHeader();

}

function rowHighlightOn(rowid,rowno,colclass,centerel){
    document.getElementById(rowid).style.borderTop="2px solid rgba(255,0,0,1)";
		document.getElementById(rowid).style.borderBottom="2px solid rgba(255,0,0,1)";
		centerel.style.backgroundImage="radial-gradient(RGBA(0,0,0,0),RGBA(0,0,0,0.2))";
}

function rowHighlightOff(rowid,rowno,colclass,centerel){
    document.getElementById(rowid).style.borderTop="";
		document.getElementById(rowid).style.borderBottom="";
		centerel.style.backgroundImage="none";
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
