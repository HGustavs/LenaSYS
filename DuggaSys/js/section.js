function showSettingRow(ID){
	var display = $('#settings_'+ID).css('display');
	if(display == 'none'){
		$('#settings_'+ID).show();
	}else {
		$('#settings_'+ID).hide();
	}
}

function courseSettingsService(ID)
{
	if (validateUpdateCourses(ID)) {
		var data = new Array()
		var element = document.getElementById('settings_'+ID);
		var elementChild = element.childNodes[0];;
		var settingsChildren = elementChild.childNodes;
		for(i = 0; i < settingsChildren.length; i++) {
			if (settingsChildren[i].nodeType == 1) {
				if (settingsChildren[i].getAttribute("name") == "coursename") {
					data['coursename'] = settingsChildren[i].value;
				} else if (settingsChildren[i].getAttribute("name") == "visibility") {
					data['visibility'] = settingsChildren[i].value;
				}
			}
		}
		$.post("ajax/updateCourses.php", "courseid="+ID+"&coursename="+data['coursename']+"&visibility="+data['visibility'], function(response) {
			page.show();
			
			//Calls function to notice user of changes
			if(!response){
				warningBox("Menulist", "Updates not saved", 50);
			}else{
				successBox("Menulist", "Updates saved", 50);
			}
		});
	}
}

function sectionSettingsService(ID)
{
	if (validateUpdateSections(ID)) {
		var data = new Array()
		var element = document.getElementById('sectioned_'+ID);
		var settingsChildren = element.childNodes;
		for(i = 0; i < settingsChildren.length; i++) {
			if (settingsChildren[i].nodeType == 1) {
				if (settingsChildren[i].getAttribute("name") == "sectionname") {
					data['sectionname'] = settingsChildren[i].value;
				} else if (settingsChildren[i].getAttribute("name") == "type") {
					data['type'] = settingsChildren[i].value;
				} else if (settingsChildren[i].getAttribute("name") == "link") {
					data['link'] = settingsChildren[i].value;
				} else if (settingsChildren[i].getAttribute("name") == "visibility") {
					data['visibility'] = settingsChildren[i].value;
				} else if (settingsChildren[i].getAttribute("name") == "testduggaselect") {
					data['testdugga'] = settingsChildren[i].value;
				}
			}
		}
		var qs = getUrlVars();
		var courseID = qs.courseid;
		if (data['testdugga'] != "-1") {
			if (data['type'] == 2) {
				data['link'] = "../CodeViewer/EditorV30.php?exampleid="+data['testdugga']+"&courseid="+courseID;
			} else if (data['type'] == 3) {
				data['link'] = "quiz/menu?quizid="+data['testdugga']+"&courseid="+courseID;
			}
		}
		$.post("ajax/updateSections.php",
		{
			'sectionid': ID,
			'courseid': courseID,
			'sectionname': data['sectionname'],
			'type': data['type'],
			'link': data['link'],
			'visibility': data['visibility']
		}, function(response)
		{
			$('#testdugga').find('option').remove();
			element = document.getElementById('Entry_'+ID);
			settingsChildren = element.childNodes;
			var children = settingsChildren[0].childNodes;
			children[0].textContent = data['sectionname'];
			
			if (data['type'] == 2) {
				settingsChildren[0].href = JSON.parse(response);
				settingsChildren[0].onclick = null;
			} else if (data['type'] == 3) {
				settingsChildren[0].removeAttribute("href");
				settingsChildren[0].style.cursor = "pointer";
				if (settingsChildren[0].addEventListener) {  // all browsers except IE before version 9
					settingsChildren[0].addEventListener("click", function() { changeURL(JSON.parse(response)); }, false);
				} else {
					if (settingsChildren[0].attachEvent) {   // IE before version 9
						settingsChildren[0].attachEvent("click", function() { changeURL(JSON.parse(response)); });
					}
				}
			} else {
				settingsChildren[0].onclick = null;
				settingsChildren[0].removeAttribute("href");
			}
			
			switch(parseInt(data['type'])){
				case 0:
					element.className = "bigg";
					break;
				case 1:
					element.className = "butt";
					break;
				case 2:
					element.className = "example";
					break;
				case 3:
					element.className = "test";
					break;
				default:
				case 4:
					element.className = "norm";
					break;
			}
			if(data['visibility'] != 0) {
				
				settingsChildren[0].style.opacity = "1";
				settingsChildren[1].style.opacity = "1";
				
			} else {
				settingsChildren[0].style.opacity = "0.5";
				settingsChildren[1].style.opacity = "0.5";
				
			}
			
			if(data['type'] < 2){
					settingsChildren[0].style.color = "white";
					settingsChildren[0].style.fontSize = "14pt";
					settingsChildren[0].style.marginLeft = "0px";
					settingsChildren[0].style.paddingLeft = "5px";
					settingsChildren[1].src="css/images/general_settings_button_white.svg";
			}else {
					settingsChildren[0].style.color = "#434343";
					settingsChildren[0].style.fontSize = "10pt";
					settingsChildren[0].style.marginLeft = "15px";
					settingsChildren[0].style.paddingLeft = "0px";
					settingsChildren[1].src="css/images/general_settings_button_darkgrey.svg";
			}
			
			
			$("input[name*='sectionname']").css("background-color", "#fff");
			$('#sectioned_'+ID).hide();
			//Calls function to notice user of changes
			if(!response) {
				warningBox(data['sectionname'], "Updates not saved", 50);
			}else {
				successBox(data['sectionname'], "Updates saved", 50);
				if (data['type'] == 2) {
					database.populateData(courseID, "example");
					populateSelect("example", ID, JSON.parse(response));
				} else if (data['type'] == 3) {
					database.populateData(courseID, "test");
					populateSelect("test", ID, JSON.parse(response));
				}
			}
		});
	}
}


function showSectionSettingRow(ID){
	var display = $('#sectioned_'+ID).css('display');
	if(display == 'none'){
		$('#sectioned_'+ID).show();
	}else {
		$('#sectioned_'+ID).hide();
	}
}