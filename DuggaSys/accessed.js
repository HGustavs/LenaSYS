var sessionkind=0;
var querystring=parseGet();
var versions;

AJAXService("GET",{cid:querystring['cid']},"ACCESS");

//----------------------------------------
// Commands:
//----------------------------------------

function addUsers()
{
	var rawNewUsers=$("#import").val().split("\n");
	var newUsers = [];
	var length = rawNewUsers.length-1;
	var segments = "";
	var numberOfSegments = 0;
	for(i=0;i<length;i++)
	{
		segments = rawNewUsers[i].split(" ");
		numberOfSegments = segments.length;
		for(j=0;j<numberOfSegments;j++)
		{
			segments[j] = segments[j].replace(":","NULL");
			segments[j] = segments[j].replace("teacher","W");
			segments[j] = segments[j].replace("student","R");
			segments[j] = segments[j].replace("none","N");
			
		}
		
		segments = { ssn:segments[0], lastname:segments[1], firstname:segments[2], anmkod:segments[3], access:segments[4], clas:segments[5], date:segments[6], email:segments[7]};

		newUsers.push(segments);

		
	}
	newUsers = JSON.stringify(newUsers);
	
	//console.log(newUsers);
	AJAXService("ADDUSR",{cid:querystring['cid'],newusers:newUsers},"ACCESS");
	$("#createUsers").css("display","none");
}

function addSelectedUsers()
{
	var userRows = document.getElementById("filterFrame").contentWindow.document.getElementById("addSelected").val.split("\n");
	var anmKode = $("#anmKode").val()
	
	userRows[0] = userRows[0].replace("undefined", "");
	
	var rows = userRows.length-1;

	var row = "";
	var segments = 0;
	var cleanRow = "";
	var addCleanUsers = [];
	// Segment scrubbing.
	// I clean and recreate each part of the string.
	// I do it this what to avoid regular expressions that might not work with older versions of windows.
	for(i=0;i<rows;i++)
	{
		row = userRows[i];
		row = row.split(" ");
		segments = row.length;
		cleanRow = "";
		for (j=0;j<segments;j++)
		{
			row[j] = row[j].replace("anmkod", anmKode);
			row[j] = row[j].replace("undefined", "NULL");
			row[j] = row[j].replace("[]", "NULL");
			row[j] = row[j].replace("[", "");
			row[j] = row[j].replace("]", "");
			
		}
		row[4] = row[4].replace("N","R");
		row[4] = row[4].replace("NULL","R");
		
		cleanRow = { ssn:row[0], lastname:row[1], firstname:row[2], anmkod:row[3], access:row[4], clas:row[5], date:row[6], email:row[7]};

		addCleanUsers.push(cleanRow);
		
	}
	addCleanUsers = JSON.stringify(addCleanUsers);
	
	AJAXService("ADDUSR",{cid:querystring['cid'],newusers:addCleanUsers},"ACCESS");
	
	$("#addUsers").css("display","none");

	
	document.getElementById('filterFrame').src = "searchFrame.php?cid="+querystring['cid'];
	document.getElementById('filterFrame').reload;
}

function showCreateUsersPopup()
{
	$("#createUsers").css("display","block");
}

function showAddUsersPopup()
{
	$("#addUsers").css("display","block");
}

function hideCreateUsersPopup()
{
	$("#createUsers").css("display","none");
}

function changeAccess(cid,uid,val)
{
	AJAXService("ACCESS",{cid:cid,uid:uid,val:val},"ACCESS");
}

function selectUser(uid,username,ssn,firstname,lastname,access)
{
	// Set Name		
	$("#firstname").val(firstname);
	$("#lastname").val(lastname);
		
	// Set User name
	$("#usrnme").val(username);
		
	//Set SSN
	$("#ussn").val(ssn);
	
	$("#uid").val(uid);
	$("#editUsers").css("display","block");
}

function updateUser()
{
	var ussn=$("#ussn").val();
	var usrnme=$("#usrnme").val();
	var firstname=$("#firstname").val();
	var lastname=$("#lastname").val();
	var uid=$("#uid").val();
	
	AJAXService("UPDATE",{ssn:ussn,uid:uid,firstname:firstname,lastname:lastname,username:usrnme,cid:querystring['cid']},"ACCESS");
	
	$("#editUsers").css("display","none");
}

function closeEdituser()
{
	$("#editUsers").css("display","none");
}

function resetPw(uid,username)
{
	rnd=randomstring();

	window.location="mailto:"+username+"@student.his.se?Subject=LENASys%20Password%20Reset&body=Your%20LENASys%20Login%20is%20"+username+"%0AYour%20new%20password%20for%20LENASys%20is:%20"+rnd+"%0A%0A/LENASys Administrators";
	
	AJAXService("CHPWD",{cid:querystring['cid'],uid:uid,pw:rnd},"ACCESS");
}

function filterSelections(){
	var access = $("#teacherStudent").val();
	var clas = $("#filterCourses").val();
	
	var teacherTab = document.getElementById("filterFrame").contentWindow.document.getElementById("teachers");
	var studentTab = document.getElementById("filterFrame").contentWindow.document.getElementById("students");
	var noneTab = document.getElementById("filterFrame").contentWindow.document.getElementById("nones");
	var nullTab = document.getElementById("filterFrame").contentWindow.document.getElementById("nulls");

	switch(access){
		case "teachers":
			teacherTab.style = "";
			studentTab.style = "display:none;";
			noneTab.style = "display:none;";
			nullTab.style = "display:none;";
			console.log("teachers");
		break;
		case "students":
			teacherTab.style = "display:none;";
			studentTab.style = "";
			noneTab.style = "display:none;";
			nullTab.style = "display:none;";
			console.log("students");
		break;
		case "nones":
			teacherTab.style = "display:none;";
			studentTab.style = "display:none;";
			noneTab.style = "";
			nullTab.style = "display:none;";
			console.log("nones");
		break;
		case "nulls":
			teacherTab.style = "display:none;";
			studentTab.style = "display:none;";
			noneTab.style = "display:none;";
			nullTab.style = "";
			console.log("nulls");
		break;
		default:
			teacherTab.style = "";
			studentTab.style = "";
			noneTab.style = "";
			nullTab.style = "";
			console.log("default");
		break;
	}
}

function checkBox(checkBox){
	var isChecked = checkBox.checked;
	
	//get the cell in which your dropdown is
	var cell      = checkBox.parentNode;

	//get the row of that cell
	var row       = cell.parentNode;

	//get the array of all cells in that row 
	var cells     = row.getElementsByTagName("td");

	//get the first input element in the second cell
	var textfield = cells[4].getElementsByTagName("input")[0];
	
	//get parent window.
	var parentWindow = document.getElementById('addSelected'); 
	
	
	if(isChecked)
	{
		parentWindow.val += textfield.value+"\n";
	}
	else
	{
	   var fullValue = parentWindow.val;
	   
	   parentWindow.val = fullValue.replace(textfield.value+"\n", "");
	}
}

//----------------------------------------
// Renderer
//----------------------------------------
function returnedAccess(data)
{
	// Fill section list with information
	str="";
	if (data['entries'].length > 0) {

		str+="<table class='list'>";

		str+="<tr><th class='first' style='text-align:left; padding-left:8px; width:140px;'>Username</th><th style='text-align:left; padding-left:8px; width:150px;'>SSN</th><th style='text-align:left; padding-left:8px;'>First Name</th><th style='text-align:left; padding-left:8px;'>Last Name</th><th style='text-align:left; padding-left:8px; width:100px;'>Modified</th><th style='text-align:left; padding-left:8px; width:90px;'>Access</th><th style='text-align:left; padding-left:8px; width:90px;'>Settings</th><th class='last' style='text-align:left; padding-left:8px; width:120px;'>Password</th></tr>";
		for(i=0;i<data['entries'].length;i++){
			var item=data['entries'][i];
			str+="<tr>";
			str+="<td>"+item['username']+"</td>";
			str+="<td>"+item['ssn']+"</td>";
			str+="<td>"+item['firstname']+"</td>";
			str+="<td>"+item['lastname']+"</td>";
			str+="<td>"+item['modified'].substr(0,10)+"</td>";
			
			str+="<td valign='center'><select onChange='changeAccess(\""+querystring['cid']+"\",\""+item['uid']+"\",this.value);' onclick='return false;' id='"+item['uid']+"'>";
			
			if(item['access']=="R"){
				str+="<option selected='selected' value='R'>Student</option>";
			}else{
				str+="<option value='R'>Student</option>";
			}
			if(item['access']=="W"){
				str+="<option selected='selected' value='W'>Teacher</option>";
			}else{
				str+="<option value='W'>Teacher</option>";
			}
			if(item['access']=="N"){ 
				str+="<option selected='selected' value='N'>None</option>"
			}else{ 
				str+="<option value='N'>None</option>";
			}
			str+="</select>";
			
			
			str+="<td><img id='dorf' style='float:none; margin-right:4px;' src='../Shared/icons/Cogwheel.svg' title='" + item['username'] + " settings'";
			str+=" onclick='selectUser(\""+item['uid']+"\",\""+item['username']+"\",\""+item['ssn']+"\",\""+item['firstname']+"\",\""+item['lastname']+"\",\""+item['access']+"\");'></td>";
			str+="<td><input class='submit-button' type='button' value='Reset PW' onclick='if(confirm(\"Reset Password for "+item['username']+" ?\")) resetPw(\""+item['uid']+"\",\""+item['username']+"\"); return false;' style='float:none;'></td>";
			str+="</tr>";
		}
		str+="</table>";
	}
	var slist=document.getElementById("accessedcontent");
	slist.innerHTML=str;
	
	if(data['debug']!="NONE!") alert(data['debug']);
}
