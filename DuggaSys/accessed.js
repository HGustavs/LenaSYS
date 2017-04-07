var sessionkind=0;
var querystring=parseGet();
var versions;
var dataInfo;

AJAXService("GET",{cid:querystring['cid'],coursevers:querystring['coursevers']},"ACCESS");

//----------------------------------------
// Commands:
//----------------------------------------

function addUsers()
{
		var newUsersArr = new Array();
		newusers=$("#import").val();
		var myArr=newusers.split("\n");
		for (var i=0; i<myArr.length; i++){
				newUsersArr.push(myArr[i].split("\t"));
		}
		var newUserJSON = JSON.stringify(newUsersArr);	
		AJAXService("ADDUSR",{cid:querystring['cid'],newusers:newUserJSON,coursevers:querystring['coursevers']},"ACCESS");
		$("#createUsers").css("display","none");
}

function showCreateUsersPopup()
{
	$("#createUsers").css("display","block");
}

function hideCreateUsersPopup()
{
	$("#createUsers").css("display","none");
}

function changeAccess(cid,uid,val)
{
	AJAXService("ACCESS",{cid:cid,uid:uid,val:val,coursevers:querystring['coursevers']},"ACCESS");
}

// Sets values in the "cogwheel popup"
function selectUser(uid,username,ssn,firstname,lastname,access,className,teacherstring,classString)
{
	// Reverts the string to an array
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
	$("#editUsers").css("display","block");
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
//----------------------------------------
// Renderer
//----------------------------------------
function returnedAccess(data)
{
  // Defining arrays for later use
  var teachs = [];
  var userClass = [];
  dataInfo = data;
	// Fill section list with information
	str="";
	if (data['entries'].length > 0) {

		  str+="<table class='list'>";
      str+="<tr><th class='first' onclick='sortData($( this ).text())' style='text-align:left; padding-left:8px; width:140px; cursor: pointer;'>Username</th>" +
			"<th onclick='sortData($( this ).text())' style='text-align:left; padding-left:8px; width:150px; cursor: pointer;'>SSN</th>" +
			"<th onclick='sortData($( this ).text())' style='text-align:left; padding-left:8px; cursor: pointer;'>First Name</th>" +
			"<th onclick='sortData($( this ).text())' style='text-align:left; padding-left:8px; cursor: pointer;'>Last Name</th>" +
			"<th onclick='sortData($( this ).text())' style='text-align:left; padding-left:8px; width:150px; cursor: pointer;'>Class</th>" +
			"<th onclick='sortData($( this ).text())' style='text-align:left; padding-left:8px; width:150px; cursor: pointer;'>Teacher</th>" +
			"<th onclick='sortData($( this ).text())' style='text-align:left; padding-left:8px; width:100px; cursor: pointer;'>Added</th>" +
          	"<th style='text-align:left; padding-left:8px; width:90px;'>Version</th>" +
		  	"<th style='text-align:left; padding-left:8px; width:90px;'>Access</th>" +
			"<th style='text-align:left; padding-left:8px; width:90px;'>Settings</th>" +
			"<th class='last' style='text-align:left; padding-left:8px; width:120px;'>Password</th></tr>";
		for(i=0;i<data['entries'].length;i++){
			var item=data['entries'][i];

			// If this 
			if(parseFloat(item['newly'])<10){
					str+="<tr style='background:#efd;'>";						
			}else{
					str+="<tr>";			
			}

			str+="<td>"+item['username']+"</td>";
			str+="<td>"+item['ssn']+"</td>";
			str+="<td>"+item['firstname']+"</td>";
			str+="<td>"+item['lastname']+"</td>";
			str+="<td>"+item['class']+"</td>";

			// Place array value in a temporary vairable
			var teacher = item['teacher'];
			// Check if the value is null (replace won't work with null)
			if( teacher !== null){
				// Place spaces in the string when a lowercase is followed by a uppercase
				teacher = teacher.replace(/([a-z])([A-Z])/g, '$1 $2');
			}
			str+="<td>"+teacher+"</td>";

			str+="<td>"+item['modified'].substr(0,10)+"</td>";

            str+="<td>"+item['vers']+"</td>";

			// Select box for Access
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
			
			// Loops through the "teachers" data array and stores the name of all teachers in a new array
			for(j=0; j<data['teachers'].length;j++){
				var items=data['teachers'][j];
				teachs[j] = items['firstname']+" "+items['lastname'];
			}

			// Loops through the "classes" data array and stores all the classes in a new array
			for(h=0; h<data['classes'].length;h++){
				var itemc=data['classes'][h];
				userClass[h] = itemc['class'];
			}
			// Convert our arrays to strings where each field is separated with /t, this is necessary to keep structure when we send it to another function
			var teacherstring = teachs.join("/t");
			var classString = userClass.join("/t");

			// Create cogwheel
			str+="<td><img id='dorf' style='float:none; margin-right:4px;' src='../Shared/icons/Cogwheel.svg' ";
			str+=" onclick='selectUser(\""+item['uid']+"\",\""+item['username']+"\",\""+item['ssn']+"\",\""+item['firstname']+"\",\""+item['lastname']+"\",\""+item['access']+"\",\""+item['class']+"\",\""+teacherstring+"\",\""+classString+"\");'></td>";
			
			str+="<td><input class='submit-button' type='button' value='Reset PW' onclick='if(confirm(\"Reset Password for "+item['username']+" ?\")) resetPw(\""+item['uid']+"\",\""+item['username']+"\"); return false;' style='float:none;'></td>";
			str+="</tr>";
		}
		str+="</table>";
	}
	var slist=document.getElementById("accessedcontent");
	slist.innerHTML=str;
	
	if(data['debug']!="NONE!") alert(data['debug']);
}