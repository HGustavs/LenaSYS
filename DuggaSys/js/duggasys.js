function returnedSection(data)
{
		retdata=data;
		
		// Fill section list with information
		str="";
		if(sessionkind) {
			str+="<div style='float:right;'><input class='submit-button' type='button' value='Add' onclick='changeURL(\"newSectionForm?courseid=" + data.courseid + "\")'/></div>";	
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
								str+="<span style='color:rgba(255,255,255,0.5);'>"+data['entries'][i]['entryname']+"</span>";
								str+="<img style='opacity:0.5;'onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_white.svg' />";
							} else {
								str+="<span>"+data['entries'][i]['entryname']+"</span>";
								str+="<img onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_white.svg' />";
							}
						} else if (parseInt(data['entries'][i]['kind']) == 2 || parseInt(data['entries'][i]['kind']) >= 4) {
							if (parseInt(data['entries'][i]['visible']) === 0) {
								//Adding the opacity here instead for visible = 0
								str+="<a id='section-list' style='color:rgba(67,67,67,0.5);' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a>";
								str+="<img style='opacity:0.5;' onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							
							} else{
								str+="<a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a>";
								str+="<img onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							}
						} else {
							if (parseInt(data['entries'][i]['visible']) === 0) {
								//Adding the opacity here instead for visible = 0
								str+="<a id='section-list' style='color:rgba(67,67,67,0.5);' onClick='changeURL(\""+data['entries'][i]['link']+"\")'>"+data['entries'][i]['entryname']+"</a>";
								str+="<img style='opacity:0.5;' onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							
							} else{
								str+="<a id='section-list' style='cursor: pointer;' onClick='changeURL(\""+data['entries'][i]['link']+"\")'>"+data['entries'][i]['entryname']+"</a>";
								str+="<img onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							}
						}
						str+="<div class='sectionlist-change-div' id='sectioned_"+data["entries"][i]['lid']+"'>";
						str+="Edit name:<input type='text' name='sectionname' value='"+data['entries'][i]['entryname']+"' />";
						if (data['entries'][i]['kind'] == 2) {
							str+="Select test/dugga:<select name='testduggaselect' id='testdugga'>";
							testDuggaService(data.courseid, "example", data['entries'][i]['lid'], data['entries'][i]['link']);
						} else if (data['entries'][i]['kind'] == 3) { 
							str+="Select test/dugga:<select name='testduggaselect' id='testdugga'>";
							testDuggaService(data.courseid, "test", data['entries'][i]['lid'], data['entries'][i]['link']);
						} else {
							str+="Select test/dugga:<select name='testduggaselect' id='testdugga' disabled style='background-color:#dfdfdf'>";
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
						str+="<input class='submit-button-red' type='button' value='Delete' onclick='AJAXServiceSection(\"sectionDel\", \"&sectid="+data['entries'][i]['lid']+"\");' style='margin-left:10px;margin-right:10px;' />";
						str+="<input class='submit-button' type='button' value='Save' onclick='sectionSettingsService("+data['entries'][i]['lid']+")' />";
						str+="</div></div>";
					} else {
						if (parseInt(data['entries'][i]['kind']) < 2) {
							str+="<span>"+data['entries'][i]['entryname']+"</span>";
						} else {
							str+="<span><a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a></span>";
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
		  
		  // The holy shit function (placeholder function)
		  // Needs to be cleaned up
		  
		  // Used to populate dugga/test selection
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
							testDuggaService(event.data.id, opt, event.data.data['lid']);
						}
					});
				}
			})(jQuery);

}

function testDuggaService(courseID, opt, sectionID, link) {
	link = link || "";
	$("#sectioned_"+sectionID+" select[name=testduggaselect]").find('option').remove();
	var selectOption = document.createElement('option');
	selectOption.value = "-1";
	selectOption.innerHTML = "Create new";
	$("#sectioned_"+sectionID+" select[name=testduggaselect]").append(selectOption);
	$.ajax({
		dataType: 'json',
		url: 'ajax/testduggaService.php',
		method: 'post',
		data: {
			'courseid': courseID,
			'opt': opt
		},
		success: function(returnData) {
			for (i=0; i<returnData['entries'].length; i++) {
				var option = document.createElement('option');
				option.value = returnData['entries'][i]['id'];
				option.innerHTML = returnData['entries'][i]['name'];
				if (opt == "example") {
					if (link.length > 0) {
						var string = link.split("&");
						if (string[0]) {
							string = string[0].split("?");
							if (string[1]) {
								string = string[1].split("=");
								if (string[1] && (returnData['entries'][i]['id'] == string[1])) {
									option.setAttribute('selected', true);
								}
							}
						}
					}
				}
				$("#sectioned_"+sectionID+" select[name=testduggaselect]").append(option);
			}
		}
	});
}