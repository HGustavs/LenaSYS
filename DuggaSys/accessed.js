var sessionkind=0;
var querystring=parseGet();
var versions;
var dataInfo;

AJAXService("GET",{cid:querystring['cid'],coursevers:querystring['coursevers']},"ACCESS");

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
	if(col == "requestedpasswordchange") {
		obj=JSON.parse(celldata);
		str = "<input class='submit-button' type='button' value='Reset PW' style='float:none;'";
		str += " onclick='if(confirm(\"Reset password for " + obj.username + "?\")) ";
    	str += "resetPw(\""+ obj.uid +"\",\""+ obj.username + "\"); return false;'>";
    	return str;
	} else if(col == "examiner") {
		if(celldata[celldata.length - 1]['access'] == 'W') {
			str = "none";
		} else {
			str = "<select onChange='changeExaminer(\""+querystring['cid']+"\",\""+celldata[celldata.length - 1]['uid']+"\",this.value);' onclick='return false;'>";
			for(var i = 0; i < celldata.length - 1; i++) {
				str+="<option ";
				if(celldata[i]['username'] === celldata[celldata.length - 1]['teacher']) {
					str+="selected='selected' ";
				}
				str+="value='"+celldata[i]['username']+"'>"+celldata[i]['username']+"</option>";
			}
			str+="</select>";
		}
		return str;
	} else if(col == "access") {
		obj=JSON.parse(celldata);
		str = "<select onChange='changeAccess(\""+querystring['cid']+"\",\""+obj.uid+"\",this.value);' onclick='return false;'>";
		str+="<option value='W'" + (obj.access == 'W' ? " selected='selected'" : "") + ">Teacher</option>";
		str+="<option value='R'" + (obj.access == 'R' ? " selected='selected'" : "") + ">Student</option>";
		str+="<option value=null"+ (obj.access == 'null' || obj.access == null ? " selected='selected'" : "") + ">none</option>";
		str+="</select>";
		return str;
	} else if(col == "vers") {
		obj=JSON.parse(celldata);
		str = "<select onChange='changeVersion(\""+querystring['cid']+"\",\""+obj.uid+"\",this.value);' onclick='return false;'>";
		for(var i = 0; i < filez['courses'].length; i++){
			str+="<option value='"+filez['courses'][i]['vers']+"'" + (obj.vers == filez['courses'][i]['vers'] ? " selected='selected'" : "") + ">"+filez['courses'][i]['vers']+"</option>";
		}
		str+="</select>";
		return str;
	} else if(col == "groups") {
		return "<span>" + celldata + "</span>";
	} else {
		return "<div id='" + cellid + "'>" + celldata + "</div>";
	}
	return celldata;
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
