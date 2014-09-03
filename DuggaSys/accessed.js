var sessionkind=0;
var querystring=parseGet();
var versions;

AJAXServiceAccess("GET","&cid="+querystring['cid']);

function randomstring()
{
		str="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890![]#/()=+-_:;.,*";

		var valu="";
		for(i=0;i<9;i++){
				valu+=str.substr(Math.round(Math.random()*78),1);
		}

		return valu;
}

//----------------------------------------
// Service:
//----------------------------------------

function AJAXServiceAccess(opt,para)
{
	$.ajax({
		url: "accessedservice.php",
		type: "POST",
		data: "opt="+opt+para,
		dataType: "json",
		success: returnedAccess
	});
}

function processLogin() {
		var username = $("#login #username").val();
		var saveuserlogin = $("#login #saveuserlogin").val();
		var password = $("#login #password").val();
		$.ajax({
			type:"POST",
			url: "login.php",
			data: {
				username: username,
				saveuserlogin: saveuserlogin == 1 ? 'on' : 'off',
				password: password
			},
			success:function(data) {
				var result = JSON.parse(data);
				if(result['login'] == "success") {
					$("#user label").html(result['username']);
					$("#user img").addClass("loggedin");
					hideLoginPopup();
					$("#loginbutton").html("<span id='loginbutton'><img class='loggedin' src='css/svg/Man.svg' onclick='processLogout();' /></span>");
				}else{
					console.log("Failed to log in.");
					if(typeof result.reason != "undefined") {
						$("#login #message").html("<div class='alert danger'>" + result.reason + "</div>");
					} else {
						$("#login #message").html("<div class='alert danger'>Wrong username or password!</div>");
					}
					$("input#username").css("background-color", "#ff7c6a");
					$("input#password").css("background-color", "#ff7c6a");
				}
				AJAXServiceAccess("GET","&cid="+querystring['cid']);
			},
			error:function() {
				console.log("error");
			}
		});
}

function processLogout() {
	$.ajax({
		type:"POST",
		url: "logout.php",
		success:function(data) {
			$("#user label").html("Guest");
			$("#user img").removeClass("loggedin");
			$("#loginbutton").html("<span id='loginbutton'><img src='css/svg/Man.svg' onclick='showLoginPopup();' /></span>");
			AJAXServiceAccess("GET","&cid="+querystring['cid']);
		},
		error:function() {
			console.log("error");
		}
	});
}

//----------------------------------------
// Commands:
//----------------------------------------

function addUsers()
{
		AJAXServiceAccess("ADDUSR","&cid="+querystring['cid']+"&newusers="+$("#import").val());
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
		AJAXServiceAccess("ACCESS","&cid="+cid+"&uid="+uid+"&val="+val);
}

function selectUser(uid,username,ssn,firstname,lastname,access)
{
		// Set Name		
		$("#firstname").val(firstname);
		$("#lastname").val(lastname);

		$("#usrnme").val(username);
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
		
		AJAXServiceAccess("UPDATE","&ssn="+ussn+"&uid="+uid+"&firstname="+firstname+"&lastname="+lastname+"&username="+usrnme+"&cid="+querystring['cid']);
		
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
		
		AJAXServiceAccess("CHPWD","&cid="+querystring['cid']+"&uid="+uid+"&pw="+rnd);

}

function showLoginPopup()
{
		$("#loginBox").css("display","block");
		$("#overlay").css("display","block");
}

function hideLoginPopup()
{
		$("#loginBox").css("display","none");
		$("#overlay").css("display","none");
}

//----------------------------------------
// Renderer
//----------------------------------------
function returnedAccess(data)
{
		// Fill section list with information
		str="";
		if (data['entries'].length > 0) {

				str+="<div style='float:right;'>";
				str+="<input class='submit-button' type='button' value='Add Users' onclick='showCreateUsersPopup();'/>";
				str+="</div>";
				
				str+="<table class='list'>";

				str+="<tr><th class='first'>Username</th><th>SSN</th><th>First Name</th><th>Last Name</th><th>Modified</th><th>Access</th><th>PW</th><th class='last'>Settings</th></tr>";
				for(i=0;i<data['entries'].length;i++){
						var item=data['entries'][i];
						str+="<tr>";
						str+="<td>"+item['username']+"</td>";
						str+="<td>"+item['ssn']+"</td>";
						str+="<td>"+item['firstname']+"</td>";
						str+="<td>"+item['lastname']+"</td>";
						str+="<td>"+item['modified'].substr(0,10)+"</td>";
						
						str+="<td valign='center'><select onChange='changeAccess(\""+querystring['cid']+"\",\""+item['uid']+"\",this.value);' onclick='return false;' id='"+item['uid']+"'>";
						if(item['access']=="R") str+="<option selected='selected' value='R'>Student</option>"
						else str+="<option value='R'>Student</option>";
						if(item['access']=="W") str+="<option selected='selected' value='W'>Teacher</option>"
						else str+="<option value='W'>Teacher</option>";									
						if(item['access']=="N") str+="<option selected='selected' value='N'>None</option>"
						else str+="<option value='N'>None</option>";
						str+="</select>";

						str+="<td><input class='submit-button' type='button' value='Reset PW' onclick='if(confirm(\"Reset Password for "+item['username']+" ?\")) resetPw(\""+item['uid']+"\",\""+item['username']+"\"); return false;'></td>";

						str+="<td><img id='dorf' style='float:right;margin-right:4px;' src='css/svg/Cogwheel.svg' ";
						str+=" onclick='selectUser(\""+item['uid']+"\",\""+item['username']+"\",\""+item['ssn']+"\",\""+item['firstname']+"\",\""+item['lastname']+"\",\""+item['access']+"\");' ></td>";

						//alert("selectUser(\""+item['uid']+"\",\""+item['username']+"\",\""+item['ssn']+"\",\""+item['firstname']+"\",\""+item['lastname']+"\",\""+item['access']+"\");' >");

						str+="</tr>";
				}

				str+="</table>";

		}

		var slist=document.getElementById("content");
		slist.innerHTML=str;

	  if(data['debug']!="NONE!") alert(data['debug']);

}

		
