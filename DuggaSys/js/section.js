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
				}
			}
		}
		var courseID = document.URL.split('courseid=')[1];
		courseID = courseID.split('&')[0];
		$.post("ajax/updateSections.php", "sectionid="+ID+"&courseid="+courseID+"&sectionname="+data['sectionname']+"&type="+data['type']+"&link="+data['link']+"&visibility="+data['visibility'], function(response) {
			$('#testdugga').find('option').remove();
			element = document.getElementById('Entry_'+ID);
			settingsChildren = element.childNodes;
			var children = settingsChildren[0].childNodes;
			children[0].textContent = data['sectionname'];
			children = settingsChildren[2].childNodes;
			var option = document.createElement('option');
			option.value = parseInt(data['type']);
			// Is there a way to reduce this code?
			switch(parseInt(data['type'])){
				case 0:
					element.className = "bigg";
					option.innerHTML = "Header";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 1;
					option.innerHTML = "Section";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 2;
					option.innerHTML = "Code Example";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 3;
					option.innerHTML = "Test";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 4;
					option.innerHTML = "Link";
					$("#testdugga").append(option);
					break;
				case 1:
					element.className = "butt";
					option.innerHTML = "Section";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 0;
					option.innerHTML = "Header";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 2;
					option.innerHTML = "Code Example";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 3;
					option.innerHTML = "Test";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 4;
					option.innerHTML = "Link";
					$("#testdugga").append(option);
					break;
				case 2:
					element.className = "example";
					option.innerHTML = "Code Example";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 0;
					option.innerHTML = "Header";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 1;
					option.innerHTML = "Section";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 3;
					option.innerHTML = "Test";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 4;
					option.innerHTML = "Link";
					$("#testdugga").append(option);
					break;
				case 3:
					element.className = "test";
					option.innerHTML = "Test";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 0;
					option.innerHTML = "Header";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 1;
					option.innerHTML = "Section";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 2;
					option.innerHTML = "Code Example";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 4;
					option.innerHTML = "Link";
					$("#testdugga").append(option);
					break;
				default:
				case 4:
					element.className = "norm";
					option.innerHTML = "Link";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 0;
					option.innerHTML = "Header";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 1;
					option.innerHTML = "Section";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 2;
					option.innerHTML = "Code Example";
					$("#testdugga").append(option);
					
					option = document.createElement('option');
					option.value = 3;
					option.innerHTML = "Test";
					$("#testdugga").append(option);
					break;
			}
			
			children[7].textContent = data['link'];
			
			var option = document.createElement('option');
			option.value = parseInt(data['visibility']);
			if(data['visibility'] != 0){
				option.innerHTML = "Public";
				$("#visib").append(option);
				element.style.opacity = "1";
				settingsChildren[1].style.opacity = "1";
			} else {
				option.innerHTML = "Hidden";
				$("#visib").append(option);
				element.style.opacity = "0.5";
				settingsChildren[1].style.opacity = "0.5";
			}
			$('#sectioned_'+ID).hide();
			//Calls function to notice user of changes
			if(!response) {
				warningBox(data['sectionname'], "Updates not saved", 50);
			}else {
				successBox(data['sectionname'], "Updates saved", 50);
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