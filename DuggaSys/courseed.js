var sessionkind=0;
var querystring=parseGet();
var versions;

AJAXServiceCourse("GET","");

//----------------------------------------
// Service:
//----------------------------------------

function AJAXServiceCourse(opt,para)
{
	$.ajax({
		url: "courseedservice.php",
		type: "POST",
		data: "opt="+opt+para,
		dataType: "json",
		success: returnedCourse
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
					$("#loginbutton").click(function(){processLogout();});
					AJAXServiceCourse("GET","");
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
			$("#loginbutton").click(function(){showLoginPopup();});
			AJAXServiceCourse("GET","");
		},
		error:function() {
			console.log("error");
		}
	});
}

//----------------------------------------
// Commands:
//----------------------------------------

function updateCourse()
{
		alert("Uppd!");
}

function accessCourse()
{
		window.location.href = "accessed.php?cid="+$("#cid").val();;
}

function closeSelect()
{
		$(".item").css("border","none");
		$(".item").css("box-shadow","none");
		$("#editCourse").css("display","none");
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

function newCourse()
{
		AJAXServiceCourse("NEW","");
} 

function selectCourse(cid,coursename,coursecode,visi,vers,edvers)
{
	
		$(".item").css("border","none");
		$(".item").css("box-shadow","none");
		$("#C"+cid).css("border","2px dashed #FC5");
		$("#C"+cid).css("box-shadow","1px 1px 3px #000 inset");
		$(".item").css("background","#fff");
		$("#C"+cid).css("background","#EDF");

		// Set Name		
		$("#coursename").val(coursename);
		
		// Set Cid	
		$("#cid").val(cid);

		// Set Code		
		$("#coursecode").val(coursecode);

		// Set Visibiliy
		str="";
		if(visi==0) str+="<option selected='selected' value='0'>Hidden</option>"
		else str+="<option value='0'>Hidden</option>";
		if(visi==1) str+="<option selected='selected' value='1'>Public</option>"
		else str+="<option value='1'>Public</option>";
		if(visi==2) str+="<option selected='selected' value='2'>Login</option>"
		else str+="<option value='2'>Login</option>";
		if(visi==3) str+="<option selected='selected' value='3'>Deleted</option>"
		else str+="<option value='3'>Deleted</option>";
		$("#visib").html(str);

		var cstr="";
		var sstr="";
		var estr="";
		
		if (versions.length > 0) {
				for(i=0;i<versions.length;i++){
						var item=versions[i];
						if(cid==item['cid']){
								var vvers=item['vers'];
								
								if(vvers==vers){
										sstr+="<option selected='selected' value='"+vvers+"'>"+vvers+"</option>";
								}else{
										sstr+="<option value='"+vvers+"'>"+vvers+"</option>";
								}
								if(vvers==edvers){
										estr+="<option selected='selected' value='"+vvers+"'>"+vvers+"</option>";
								}else{
										estr+="<option value='"+vvers+"'>"+vvers+"</option>";
								}
								cstr+="<option value='"+vvers+"'>"+vvers+"</option>";
						}
				}
		}
		
		$("#activeversion").html(sstr);
		$("#activeedversion").html(estr);
		$("#copyversion").html(cstr);
		
		// Show dialog
		$("#editCourse").css("display","block");

		return false;
}

//----------------------------------------
// Renderer
//----------------------------------------

function returnedCourse(data)
{
		
		versions=data['versions'];
			
		// Fill section list with information
		str="";

		if(data['writeaccess']) {
			str+="<div style='float:right;'>";
			str+="<input class='submit-button' type='button' value='New' onclick='newCourse();'/>";
			str+="</div>";
		}
		
		// Course Name
		str+="<div id='Courselistc' >";

		str+="<div id='lena' class='head'><a href='https://github.com/HGustavs/LenaSYS_2014'><span class='sys'><span class='lena'>LENA</span>Sys</span></a> Course Organization System</div>";

		// For now we only have two kinds of sections
		if (data['entries'].length > 0) {
			for(i=0;i<data['entries'].length;i++){
				var item=data['entries'][i];

				str+="<span class='bigg item' id='C"+item['cid']+"' ";
				if(parseInt(item['visibility'])==0){
						str+="style='opacity:0.3;' ";
				}
				str+=">";

					str+="<span><a style='margin-right:15px;' href='sectioned.php?courseid="+item['cid']+"&coursename="+item['coursename']+"&coursevers="+item['activeversion']+"'>"+item['coursename']+"</a></span>";
					if(data['writeaccess']) {
						str+="<a style='margin-right:15px;' href='sectioned.php?courseid="+item['cid']+"&coursename="+item['coursename']+"&coursevers="+item['activeedversion']+"'><img id='dorf' src='css/svg/PenV.svg'></a>";
						str+="<img id='dorf' style='float:right;' src='css/svg/Cogwheel.svg' ";
						str+=" onclick='selectCourse(\""+item['cid']+"\",\""+item['coursename']+"\",\""+item['coursecode']+"\",\""+item['visibility']+"\",\""+item['activeversion']+"\",\""+item['activeedversion']+"\");' >";
					}
				
				str+="</span>";
			}	
		} else {
				// No items were returned! 
				str+="<div class='bigg'>";
				str+="<span>There are no courses available at this point in time.</span>";
				str+="</div>";
		}

		str+="</div>";

		var slist=document.getElementById('Courselist');
		slist.innerHTML=str;

	  if(data['debug']!="NONE!") alert(data['debug']);

}

