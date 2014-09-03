var querystring=parseGet();
var retdata;

AJAXServiceSection("get","all");

//----------------------------------------
// Service:
//----------------------------------------

function AJAXServiceSection(opt,para)
{
	$.ajax({
		url: "sectionedservice.php",
		type: "POST",
		data: "courseid="+querystring['courseid']+"&coursename="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&opt="+opt+para,
		dataType: "json",
		success: returnedSection
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
					AJAXServiceSection("get","all");
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
			AJAXServiceSection("get","all");			
		},
		error:function() {
			console.log("error");
		}
	});
}

//----------------------------------------
// Commands:
//----------------------------------------

function selectItem(lid,entryname,kind,evisible,elink,moment)
{
		
		// Display Select Marker
		$(".item").css("border","none");
		$(".item").css("box-shadow","none");
		$("#I"+lid).css("border","2px dashed #FC5");
		$("#I"+lid).css("box-shadow","1px 1px 3px #000 inset");
		
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
		if(kind==3) str+="<option selected='selected' value='3'>Test</option>"
		else str+="<option value='3'>Test</option>";
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
		$("#visib").html(str);

		// Set Link
		$("#link").val(elink);
		
		// Graying of Link
		if(kind<2){
				$("#link").css("opacity","0.3");		
				$("#linklabel").css("opacity","0.3");	
				$("#link").prop('disabled', true);					
				$("#createbutton").css('visibility', 'hidden');					
		}else{
				$("#link").css("opacity","1.0");		
				$("#linklabel").css("opacity","1.0");				
				$("#link").prop('disabled', false);					

				if(elink==""){
						$("#createbutton").css('visibility', 'visible');					
				}else{
						$("#createbutton").css('visibility', 'hidden');					
				}
		}
		
		// Show dialog
		$("#editSection").css("display","block");
		
}

function deleteItem()
{
		lid=$("#lid").val();
		AJAXServiceSection("DEL","&lid="+lid);
}

function updateItem()
{
		lid=$("#lid").val();
		kind=$("#type").val();
		link=$("#link").val();
		sectionname=$("#sectionname").val();
		visibility=$("#visib").val();
		moment=$("#moment").val();

		AJAXServiceSection("UPDATE","&lid="+lid+"&kind="+kind+"&link="+link+"&sectname="+sectionname+"&visibility="+visibility+"&moment="+moment);

		$("#editSection").css("display","none");
}

// Create New Dugga/Example

function createLink()
{
		alert("CREATE!");
}
		
function newItem()
{
		lid=$("#lid").val();
		AJAXServiceSection("NEW","&lid="+lid);
}

function closeSelect()
{
		$(".item").css("border","none");
		$(".item").css("box-shadow","none");
		$("#editSection").css("display","none");
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

function returnedSection(data)
{
		retdata=data;
				
		// Fill section list with information
		str="";

		if(data['writeaccess']) {
			str+="<div style='float:right;'>";
			str+="<input class='submit-button' type='button' value='New' onclick='newItem();'/>";
			str+="</div>";
		}
		
		// Course Name
		str+="<div class='course'>"+data.coursename+" "+data.coursevers+"</div>";

		str+="<div id='Sectionlistc' >";
  
		// For now we only have two kinds of sections
		if (data['entries'].length > 0) {
			var kk=0;
			for(i=0;i<data['entries'].length;i++){
				var item=data['entries'][i];

				// If visible or we are a teacher/superuser
				if (parseInt(item['visible']) === 1 || data['writeaccess']) {
								
						if(parseInt(item['kind']) === 0 ){
								// Styling for header row
								str+="<span class='header item' id='I"+item['lid']+"' ";
								kk=0;
						} else if(parseInt(item['kind']) === 1 ){
								//Styling for section row
								str+="<span class='section item' id='I"+item['lid']+"' ";
								kk=0;
						} else if(parseInt(item['kind']) === 2 ){
								// Styling for example row
								str+="<span";
								if(kk%2==0){
										str+=" class='example item hi' id='I"+item['lid']+"' ";
								}else{
										str+=" class='example item lo' id='I"+item['lid']+"' ";
								}
								kk++;
						} else if(parseInt(item['kind']) === 3 ){
								// Styling for quiz row
								str+="<span";
								if(kk%2==0){
										str+=" class='example item hi' id='I"+item['lid']+"' ";
								}else{
										str+=" class='example item lo' id='I"+item['lid']+"' ";
								}
								kk++;
						} else if(parseInt(item['kind']) === 4 ){
								// Styling for moment row
								str+="<span class='moment item' id='I"+item['lid']+"' ";
								kk=0;
						} else if(parseInt(item['kind']) === 5 ){
								// Styling for link row
								str+="<span";
								if(kk%2==0){
										str+=" class='example item hi' id='I"+item['lid']+"' ";
								}else{
										str+=" class='example item lo' id='I"+item['lid']+"' ";
								}
								kk++;
						}

						if(kk==1){
								if (parseInt(item['visible']) === 0) str+=" style='opacity: 0.5; box-shadow: 0px 3px 2px #aaa inset; border-radius:8px; margin-left:4px;' "
								else str+="style='box-shadow: 0px 3px 2px #aaa inset;' ";				
						}else{
								if (parseInt(item['visible']) === 0) str+=" style='opacity: 0.5; border-radius:8px; margin-left:4px;' ";
						}
			
						str+=">";
						
						if (parseInt(item['kind']) < 2||parseInt(item['kind']) == 4) {
							str+="<span style='padding-left:5px;'>"+item['entryname']+"</span>";
						} else if (parseInt(item['kind']) == 2 || parseInt(item['kind']) > 4) {
							str+="<span><a style='margin-left:15px;' href="+item['link']+">"+item['entryname']+"</a></span>";
						} else {
							str+="<a style='cursor:pointer;margin-left:15px;' onClick='changeURL(\""+item['link']+"\")'>"+item['entryname']+"</a>";
						}	

						if(data['writeaccess']) str+="<img id='dorf' style='float:right;margin-right:8px' src='css/svg/Cogwheel.svg' onclick='selectItem(\""+item['lid']+"\",\""+item['entryname']+"\",\""+item['kind']+"\",\""+item['visible']+"\",\""+item['link']+"\",\""+item['moment']+"\");' />";
											
						str+="</span>";
				}
			}	
		} else {
				// No items were returned! 
				
				str+="<div class='bigg'>";
				str+="<span>There is currently no content in this course</span>";
				str+="</div>";
		}
			
		str+="</div>";

		var slist=document.getElementById('Sectionlist');
		slist.innerHTML=str;

		if(data['writeaccess']) {				
			// Enable sorting always if we are superuser as we refresh list on update 
			$("#Sectionlistc").sortable({
					helper: 'clone',
	      	update:  function (event, ui) {
	            str="";
	            $("#Sectionlist").find(".item").each(function(i) { 
	  						if(i>0) str+=",";
	  						ido=$(this).attr('id');
	  						str+=i+"XX"+ido.substr(1);
							});
							
							AJAXServiceSection("REORDER","&order="+str);
	        		
	        		return false;
	        }										
			});
	
		}
		
	  if(data['debug']!="NONE!") alert(data['debug']);

}
