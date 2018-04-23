var sessionkind=0;
var querystring=parseGet();
var versions;
var dataInfo;

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
	$("#menuHook").before(filt);

	var dropdownOptions = "";
	dropdownOptions+="<div class='checkbox-accessed accessedLine'><input type='checkbox' class='headercheck' id='selectAll' onclick='checkedAll();'><label class='headerlabel'>Select all/Unselect all</label></div>";
	dropdownOptions+="<div class='checkbox-accessed accessedLine'></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' class='headercheck' id='selectUser' onclick='filter(0);'><label class='headerlabel'>User</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' class='headercheck' id='selectSSN' onclick='filter(1);'><label class='headerlabel'>SSN</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' class='headercheck' id='selectFN' onclick='filter(2);'><label class='headerlabel'>First Name</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' class='headercheck' id='selectLN' onclick='filter(3);'><label class='headerlabel'>Last Name</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' class='headercheck' id='selectClass' onclick='filter(4);'><label class='headerlabel'>Class</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' class='headercheck' id='selectAdded' onclick='filter(5);'><label class='headerlabel'>Added</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' class='headercheck' id='selectExaminer' onclick='filter(6);'><label class='headerlabel'>Examiner</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' class='headercheck' id='selectVersion' onclick='filter(7);'><label class='headerlabel'>Version</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' class='headercheck' id='selectAccess' onclick='filter(8);'><label class='headerlabel'>Access</label></div>";
	dropdownOptions+="<div class='checkbox-accessed'><input type='checkbox' class='headercheck' id='selectPassword' onclick='filter(9);'><label class='headerlabel'>Password</label></div>";

	$("#dropdownc").append(dropdownOptions);


	/*    Add sort icon in the navheader   */
	var sort ="";
	sort+="<td id='filter' class='navButt'><span class='dropdown-container' onmouseover='hovers();' onmouseleave='leaves();'>";
	sort+="<img class='navButt' src='../Shared/icons/sort_white.svg'>";
	sort+="<div id='dropdowns' class='dropdown-list-container'>";
	sort+="</div>";
	sort+="</span></td>";
	$("#menuHook").before(sort);
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

function checkedAll()
{
	// Current state
	var accessedElements = document.getElementsByClassName("headercheck");
	var selectToggle = document.getElementById('selectAll');

	// Yes, there is at lease one element checked, so default is clear
	if(!selectToggle.checked) {
		selectToggle.checked = false;
		for (var i =0; i < accessedElements.length; i++) {
			accessedElements[i].checked = false;
		}
	} else { // There are no element(s) checked, so set all
		selectToggle.checked = true;
		for (var i =0; i < accessedElements.length; i++) {
			accessedElements[i].checked = true;
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

	AJAXService("ADDUSR",{cid:querystring['cid'],newusers:newUserJSON,coursevers:querystring['coursevers']},"ACCESS");
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

function showCreateUserPopup()
{
	$("#createUser").css("display","flex");
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
	if (col == "requestedpasswordchange"){
		obj=JSON.parse(celldata);
		str = "<input class='submit-button' type='button' value='Reset PW' style='float:none;'";
		str += " onclick='if(confirm(\"Reset password for " + obj.username + "?\")) ";
    str += "resetPw(\""+ obj.uid +"\",\""+ obj.username + "\"); return false;'>";
    return str;
	}else if(col == "examiner"){
    if(celldata[celldata.length - 1]['access'] == 'W'){
      str = "none";
    }else{
      var teacher = celldata[celldata.length - 1]['teacher'];
      var items = new Array();
      items.push("unassigned");
      for(var i = 0; i < celldata.length - 1; i++){
        items.push(celldata[i]['username']);
      }

      str = makeDropdown("changeExaminer(\""+querystring['cid']+"\",\""+celldata[celldata.length - 1]['uid']+"\",this.value);", items, items, teacher);
    }
    return str;
  }else if(col == "access"){
    obj=JSON.parse(celldata);
    str = makeDropdown("changeAccess(\""+querystring['cid']+"\",\""+obj.uid+"\",this.value);", new Array("W", "R", "null"), new Array("Teacher", "Student", "none"), obj.access);
    return str;
	}else if(col == "vers"){
    obj=JSON.parse(celldata);
    var items = new Array();
    for(var i = 0; i < filez['courses'].length; i++){
      items.push(filez['courses'][i]['vers']);
    }
    str = makeDropdown("changeVersion(\""+querystring['cid']+"\",\""+obj.uid+"\",this.value);", items, items, obj.vers);
    return str;
	}else {
		return "<div id='" + cellid + "'>" + celldata + "</div>";
	}
	return celldata;
}

function makeDropdown(onChange, values, items, selected){
  str = "<select onChange='"+onChange+"' onclick='return false;'>";
  for(var i = 0; i < values.length; i++){
    str+="<option value='"+values[i]+"'" + (values[i] == selected ? " selected='selected'" : "") + ">"+items[i]+"</option>";
  }
  str+="</select>";
  return str;
}

function sortData(column){
    if(bool) {
        dataInfo['entries'].sort(propComparator(column));
    }
    else{
        dataInfo['entries'].sort(propComparator(column)).reverse();
	}
    returnedAccess(dataInfo);
    bool = !bool;
}

var myTable;
//----------------------------------------
// Renderer
//----------------------------------------

function returnedAccess(data) {
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
		true
	);

	myTable.renderTable();

	if(data['debug']!="NONE!") alert(data['debug']);

	makeAllSortable();
}

window.onresize = function() {

myTable.magicHeader();

}

//----------------------------------------
// makeAllSortable(parent) <- Makes all tables within given scope sortable.
//----------------------------------------
function makeAllSortable(parent) {
	parent = parent || document.body;
	var t = parent.getElementsByTagName('table'), i = t.length;
	//while (--i >= 0) makeSortable(t[i]);
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
