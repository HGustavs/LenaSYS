function saveSort() {
	var serialized = $("#Sectionlist").sortable("serialize");
	// Pass course ID to check write access
	var array = serialized + "&courseid=" + querystring.courseid + "&opt=updateEntries";
	$.post("ajax/SectionedService.php", array, function(theResponse) {
		var data = $.parseJSON(theResponse);
		if(data.success) {
			successBox(data.coursename, "Updates saved", 50);
		} else {
			warningBox(data.coursename, "Could not save list elements", 50);
		}
	});
}

function setupSort() {
	var sort = document.getElementById('setupsort');
	if (sort.value == "Enable sorting") {
		sort.value = "Disable sorting";
		document.getElementById('savesort').style.display = 'initial';
		noticeBox("Sorting enabled!", "Sections are now draggable");
		$("#Sectionlist").sortable("enable");
		sort.className = "submit-button-red";
	} else {
		sort.value = "Enable sorting";
		document.getElementById('savesort').style.display = 'none';
		noticeBox("Sorting disabled!", "Sections are not draggable any longer");
		$("#Sectionlist").sortable("disable");
		sort.className = "submit-button";
	}
	
}

function getDatabase() {
	this.exampleData = null;
	this.quizData = null;
	
	this.populateData = function(courseID, opt) {
		var result;
		$.ajax({
			dataType: 'json',
			url: 'ajax/testduggaService.php',
			async: false,
			method: 'post',
			data: {
				'courseid': courseID,
				'opt': opt
			},
			success: function(returnData) {
				result = returnData;
			}
		});
		
		if (opt == "example") {
			this.exampleData = result;
		} else {
			this.quizData = result;
		}
	}
}

function returnedSection(data)
{
		retdata=data;
		
		// Fill section list with information
		str="";
		if(sessionkind) {
			str+="<div style='float:right;'>";
			str+="<input class='submit-button' type='button' value='Add' onclick='changeURL(\"newSectionForm?courseid=" + data.courseid + "\")'/>";
			str+="</div>";
			
			str+="<div style='float:left;'>";
			str+="<input class='submit-button' style='margin-right:5px;' id='setupsort' type='button' value='Enable sorting' onclick='setupSort()'/>";
			str+="<input class='submit-button' style='display:none;' padding id='savesort' type='button' value='Save' onclick='saveSort()'/>";
			str+="</div>";
		}
		// Course Name
		str+="<div class='course'>"+data.coursename+"</div>";

		// For now we only have two kinds of sections
		if (data['entries'].length > 0) {
			for(i=0;i<data['entries'].length;i++){
				if (parseInt(data['entries'][i]['visible']) === 1 || sessionkind === true) {
					if (parseInt(data['entries'][i]['visible']) === 0) {
						//checks if it is a header, section and hidden.
						if(parseInt(data['entries'][i]['kind']) === 0 ){
							str+="<span class='bigg' id='Entry_"+data['entries'][i]['lid']+"'>";
						} else if(parseInt(data['entries'][i]['kind']) === 1 ){
							str+="<span class='butt' id='Entry_"+data['entries'][i]['lid']+"'>";
						}else {
							str+="<span class='hidden' id='Entry_"+data['entries'][i]['lid']+"'>";
						}
					} else {
						switch(parseInt(data['entries'][i]['kind'])) {
							case 0:
								// Styling for header row
								str+="<span class='bigg' id='Entry_"+data['entries'][i]['lid']+"'>";
								break;
							case 1:
								//Styling for section row
								str+="<span class='butt' id='Entry_"+data['entries'][i]['lid']+"'>";
								break;
							case 2:
								// Styling for example row
								str+="<span class='example' id='Entry_"+data['entries'][i]['lid']+"'>";
								break;
							case 3:
								// Styling for test row
								str+="<span class='test' id='Entry_"+data['entries'][i]['lid']+"'>";
								break;
							default:
							case 4:
								// Styling for 'others' row
								str+="<span class='norm' id='Entry_"+data['entries'][i]['lid']+"'>";
								break;
						}
					}
					
					if(sessionkind) {
						if (parseInt(data['entries'][i]['kind']) < 2) {
							if (parseInt(data['entries'][i]['visible']) === 0) {
								//Adding the opacity here instead for visible = 0
								str+="<span style='padding-left:5px;color:rgba(255,255,255,0.5);'>"+data['entries'][i]['entryname']+"</span>";
								str+="<img style='padding-right:5px;opacity:0.5;'onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_white.svg' />";
							} else {
								str+="<span style='padding-left:5px;'>"+data['entries'][i]['entryname']+"</span>";
								str+="<img style='padding-right:5px;' onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_white.svg' />";
							}
						} else if (parseInt(data['entries'][i]['kind']) == 2 || parseInt(data['entries'][i]['kind']) >= 4) {
							if (parseInt(data['entries'][i]['visible']) === 0) {
								//Adding the opacity here instead for visible = 0
								str+="<a id='section-list' style='color:rgba(67,67,67,0.5);margin-left:15px;' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a>";
								str+="<img style='padding-right:5px;opacity:0.5;' onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							
							} else{
								str+="<a style='margin-left:15px;' id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a>";
								str+="<img style='padding-right:5px;' onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							}
						} else {
							if (parseInt(data['entries'][i]['visible']) === 0) {
								//Adding the opacity here instead for visible = 0
								str+="<a id='section-list' style='cursor:pointer;color:rgba(67,67,67,0.5);margin-left:15px;' onClick='changeURL(\""+data['entries'][i]['link']+"\")'>"+data['entries'][i]['entryname']+"</a>";
								str+="<img style='padding-right:5px;opacity:0.5;' onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							
							} else{
								str+="<a id='section-list' style='cursor:pointer;margin-left:15px;' onClick='changeURL(\""+data['entries'][i]['link']+"\")'>"+data['entries'][i]['entryname']+"</a>";
								str+="<img style='padding-right:5px;' onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							}
						}
						str+="<div class='sectionlist-change-div' id='sectioned_"+data["entries"][i]['lid']+"'>";
						str+="Edit name:<input type='text' name='sectionname' value='"+data['entries'][i]['entryname']+"' />";
						if (data['entries'][i]['kind'] != 2 && data['entries'][i]['kind'] != 3) {
							str+="Select test/dugga:<select name='testduggaselect' id='testdugga' disabled style='background-color:#dfdfdf'>";
						} else {
							str+="Select test/dugga:<select name='testduggaselect' id='testdugga'>";
						}
						str+="<option value='-1'>Create new</option>";
						str+="</select>";
						str+="Edit type:<select name='type'><option value='"+parseInt(data['entries'][i]['kind'])+"'>";
						switch(parseInt(data['entries'][i]['kind'])){
							case 0:
								str+="Header</option>";
								str+="<option value='1'>Section</option>";
								str+="<option value='2'>Code Example</option>";
								str+="<option value='3'>Test</option>";
								str+="<option value='4'>Link</option>";
								break;
							case 1:
								str+="Section</option>";
								str+="<option value='0'>Header</option>";
								str+="<option value='2'>Code Example</option>";
								str+="<option value='3'>Test</option>";
								str+="<option value='4'>Link</option>";
								break;
							case 2:
								str+="Code Example</option>";
								str+="<option value='0'>Header</option>";
								str+="<option value='1'>Section</option>";
								str+="<option value='3'>Test</option>";
								str+="<option value='4'>Link</option>";
								break;
							case 3:
								str+="Test</option>";
								str+="<option value='0'>Header</option>";
								str+="<option value='1'>Section</option>";
								str+="<option value='2'>Code Example</option>";
								str+="<option value='4'>Link</option>";
								break;
							default:
							case 4:
								str+="Link</option>";
								str+="<option value='0'>Header</option>";
								str+="<option value='1'>Section</option>";
								str+="<option value='2'>Code Example</option>";
								str+="<option value='3'>Test</option>";
								break;
						}
						str+="</select>";
						if(data['entries'][i]['kind'] != 4){
							str+="Edit link:<input type='text' name='link' value='' disabled style='background-color:#dfdfdf'/>";
						} else {
							str+="Edit link:<input type='text' name='link' value='"+data['entries'][i]['link']+"' />";
						}
						str+="Visibility:<select name='visibility' id='visib'><option value='"+data['entries'][i]['visible']+"'>";
						if(data['entries'][i]['visible'] != 0){
							str+="Public</option>";
							str+="<option value='0'>Hidden</option>";
						}else{
							str+="Hidden</option>";
							str+="<option value='1'>Public</option>";
						}
						str+="</select>";
						str+="<div style='float:right;'>";
						str+="<input class='submit-button-red' type='button' value='Delete' onclick='warningBox(\"Confirm Delete\", \"Would you like to delete this?\", 0, deleteFromSectionlist, "+data['entries'][i]['lid']+")' style='margin-left:10px;margin-right:10px;' />";
						str+="<input class='submit-button' type='button' value='Save' onclick='sectionSettingsService("+data['entries'][i]['lid']+")' />";
						str+="</div></div>";
					} else {
						if (parseInt(data['entries'][i]['kind']) < 2) {
							str+="<span style='padding-left:5px;'>"+data['entries'][i]['entryname']+"</span>";
						} else if (parseInt(data['entries'][i]['kind']) == 2 || parseInt(data['entries'][i]['kind']) >= 4) {
							str+="<span><a style='margin-left:15px;' id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a></span>";
						} else {
							str+="<a id='section-list' style='cursor:pointer;margin-left:15px;' onClick='changeURL(\""+data['entries'][i]['link']+"\")'>"+data['entries'][i]['entryname']+"</a>";
						}
					}
					str+="</span>";
				}
			}
		} else {
			str+="<div class='bigg'>";
			str+="<span>There is currently no content in this course</span>";
			str+="</div>";
		}
			
			var slist=document.getElementById('Sectionlist');
			slist.innerHTML=str;


		  if(data['debug']!="NONE!") alert(data['debug']);
		  
		  (function($) {
				var disabled = {'background-color': '#ddd'};
				var enabled = {'background-color': '#fff'};
				for(i=0;i<data['entries'].length;i++){
					$("#sectioned_"+data["entries"][i]['lid']+" select[name=type]").change({
						data: data['entries'][i],
						id: data.courseid
					}, function(event) {
						$("#sectioned_"+event.data.data['lid']+" select[name=testduggaselect]").find('option').remove();
						var selectOption = document.createElement('option');
						selectOption.value = "-1";
						selectOption.innerHTML = "Create new";
						$("#sectioned_"+event.data.data['lid']+" select[name=testduggaselect]").append(selectOption);
						
						var type = $(this).val();
						if(type == 0 || type == 1 || type == 2 || type == 3) {
							$("#sectioned_"+event.data.data['lid']+" input[name=link]").val('');
							$("#sectioned_"+event.data.data['lid']+" input[name=link]").prop("disabled", true).css(disabled);
						} else if(type == "4") {
							$("#sectioned_"+event.data.data['lid']+" input[name=link]").val(event.data.data['link']);
							$("#sectioned_"+event.data.data['lid']+" input[name=link]").removeAttr("disabled").css(enabled);
						}
						
						if (type == 0 || type == 1 ||type == 4) {
							$("#sectioned_"+event.data.data['lid']+" select[name=testduggaselect]").prop("disabled", true).css(disabled);
						} else if (type == 2 || type == 3) {
							$("#sectioned_"+event.data.data['lid']+" select[name=testduggaselect]").removeAttr("disabled").css(enabled);
							if (type == 2) {
								var opt = "example";
							} else {
								var opt = "test";
							}
							populateSelect(opt, event.data.data['lid'], event.data.data['link']);
						}
					});
				}
			})(jQuery);
			if(sessionkind) {
				for (k = 0; k<data['entries'].length; k++) {
					if (data['entries'][k]['kind'] == "2") {
						populateSelect("example", data['entries'][k]['lid'], data['entries'][k]['link']);
					} else if (data['entries'][k]['kind'] == "3") {
						populateSelect("test", data['entries'][k]['lid'], data['entries'][k]['link']);
					}
				}
			}

}

function resetPassword(uid){
	$.ajax({
		url: 'ajax/resetpassword_ajax.php',
		type: "POST",
		dataType: "json",
		data: {
			user_id: uid
		},
		success: function (returnedData) {
			if(returnedData != "false"){
				createPlaceholder();
				showPopUp('reset', returnedData);
				$('#overlay').on('click', function() { showPopUp('hide', returnedData) });
			} else {
				dangerBox('Problems reseting password', 'Could not reset password');
			}
		},
		error: function(){
			alert("error");
		},
	});
}

$(function() {
	   $("#reset_pw_btn").on('click',function(){
	   	alert("clcied");
	   });
       $('#hide').click(function() {
                $('td:nth-child(5)').hide();                
       });
       $('#hide').click(function() {
                $('td:nth-child(6)').hide();                
       });

	   $('#show').click(function() {
                $('td:nth-child(5)').show();                
       });
        $('#show').click(function() {
                $('td:nth-child(6)').show();                
       });
       $("#deletebutton").on('click',function(){
           warningBox('Confirm removal', 'Are you sure you want to remove the selected students from the current course?', 0, deleteStudent);
       });
       $("#resetbox input").on('click',function(){
           resetPassword();
       });

    });

function deleteStudent(){

	var delete_ids = $.map($('input:checkbox:checked'), function(checked, i) {
		return +checked.value;
	});
	$.ajax({
		url: 'ajax/deletestudent_ajax.php',
		dataType: "json",
		type: "POST",
		data: {
			user_id: delete_ids
		},
		success: function (returnedData) {
			if(typeof returnedData.success == "undefined" || returnedData.success) {
			  	successBox('Successfully removed students', 'Removed student(s): '+returnedData+' from the course.');
				getResults(pagination);
				pagination.goToPage(pagination.currentPage);
			} else {
				dangerBox('Problems removing students', 'Could not remove the students from the course. Make sure you selected at least one student.');
			}
		},
		error: function(){
			dangerBox('Problems removing students', 'Could not remove the students from the course. Make sure you selected at least one student.');
		},
	});
}

function createPlaceholder()
{
	$("body").prepend("<div id='overlay'></div>");
	$("#light").html("Saving students...");
	$("#light").show();
	document.getElementById('light').style.visibility = "visible";
}

function passPopUp(){
    var qs = getUrlVars();

	if($("#string").val().length < 1)
		return;
	
	createPlaceholder();

    $.ajax({
		dataType: "json",
		type: "POST",
		url: 'ajax/addstudent_ajax.php',
		data: {
			string: $("#string").val(),
			courseid: qs.courseid
		},
		success: function (returnedData) {
			$('#overlay').on('click', function() { showPopUp('hide', returnedData) });
			console.log(returnedData);
			showPopUp('show', returnedData)
		},
		error: function(){
			showPopUp('hide');
			dangerBox('Problems adding students', 'Could not add the students from the course. Make sure you add at least one student.');
		},
	});
	}

function showPopUp(showhidePop, returnedData){
    console.log(returnedData);
	if(showhidePop == "reset"){
		var output = "<div id='printArea'>";
		output += "<table class='list'>";
		output += "<tr><th>Name</th>";
		output += "<th>Username</th>";
		output += "<th>New password</th></tr>";
        output += "<tr><td>"+returnedData['firstname']+ " "+returnedData['lastname']+"</td>";
		output += "<td>"+returnedData['username']+"</td>";
		output += "<td>"+returnedData['pw']+"</td></tr>";

		output += "</table>";
		//output += returnedData.length + " users added to the system";
		output += "</div>";
		output += "<input type='button' onclick='printDiv()' value='Print passwords' />";
		
		var div = document.getElementById('light');
		div.innerHTML = output;

	}
	if(showhidePop == "show"){

		if (returnedData.length == 0){
			var output = "The users you were adding already existed globally and were added to the course";
		} else {
			var output = "<div id='printArea'>";
			output += "<table class='list'>";
			output += "<tr><th>Name</th>";
			output += "<th>Username</th>";
			output += "<th>Password</th></tr>";
             
			$.each(returnedData, function(){
				output += "<tr><td>"+this[1]+"</td>";
				output += "<td>"+this[0]+"</td>";
				output += "<td>"+this[2]+"</td></tr>";
			})

			output += "</table>";
			output += returnedData.length + " users added to the system";
			output += "</div>";

			output += "<input type='button' onclick='printDiv()' value='Print passwords' />";
		}
		var div = document.getElementById('light');
		div.innerHTML = output;
	}
	else if(showhidePop == "hide"){
		if (typeof returnedData == "undefined" || returnedData.length == 0) {
			$("#light").hide();
			$("#overlay").remove();
		} else {
			if(confirm('Have you printed the passwords?')) {
				$("#light").hide();
				$("#overlay").remove();
			}
		}
	}
}

function populateSelect(opt, sectionID, link) {
	link = link || "";
	$("#sectioned_"+sectionID+" select[name=testduggaselect]").find('option').remove();
	var selectOption = document.createElement('option');
	selectOption.value = "-1";
	selectOption.innerHTML = "Create new";
	$("#sectioned_"+sectionID+" select[name=testduggaselect]").append(selectOption);
	if (opt == "example") {
		for (j=0; j<database.exampleData['entries'].length; j++) {
			var option = document.createElement('option');
			option.value = database.exampleData['entries'][j]['id'];
			option.innerHTML = database.exampleData['entries'][j]['name'];
			if (link.length > 0) {
				var string = link.split("&");
				if (string[0]) {
					string = string[0].split("?");
					if (string[1]) {
						string = string[1].split("=");
						if (string[1] && (database.exampleData['entries'][j]['id'] == string[1])) {
							option.setAttribute('selected', true);
						}
					}
				}
			}
			$("#sectioned_"+sectionID+" select[name=testduggaselect]").append(option);
		}
	} else {
		for (j=0; j<database.quizData['entries'].length; j++) {
			var option = document.createElement('option');
			option.value = database.quizData['entries'][j]['id'];
			option.innerHTML = database.quizData['entries'][j]['name'];
			if (link.length > 0) {
				var string = link.split("&");
				if (string[0]) {
					string = string[0].split("?");
					if (string[1]) {
						string = string[1].split("=");
						if (string[1] && (database.quizData['entries'][j]['id'] == string[1])) {
							option.setAttribute('selected', true);
						}
					}
				}
			}
			$("#sectioned_"+sectionID+" select[name=testduggaselect]").append(option);
		}
	}
}
function printDiv(){
	var printArea = document.getElementById('printArea').innerHTML;
	var originalContents = document.body.innerHTML;

	document.body.innerHTML = printArea;

	window.print();

	document.body.innerHTML = originalContents;
	$('#overlay').on('click', function() { showPopUp('hide', {}) });
}


function deleteFromSectionlist(ID){
	AJAXServiceSection("sectionDel","&sectid="+ID);
}
