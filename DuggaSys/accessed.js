var sessionkind=0;
var querystring=parseGet();
var versions;

AJAXService("GET",{cid:querystring['cid']},"ACCESS");

//----------------------------------------
// Commands:
//----------------------------------------

function addUsers()
{
	newusers=$("#import").val();
	AJAXService("ADDUSR",{cid:querystring['cid'],newusers:newusers},"ACCESS");
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

	window.location="mailto:"+username+"@student.his.se?Subject=LENASys%20Password%20Reset&body=Your%20new%20password%20for%20LENASys%20is:%20"+rnd+"%0A%0A/LENASys Administrators";
	
	AJAXService("CHPWD",{cid:querystring['cid'],uid:uid,pw:rnd},"ACCESS");
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
			
			
			str+="<td><img id='dorf' style='float:none; margin-right:4px;' src='../Shared/icons/Cogwheel.svg' ";
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
