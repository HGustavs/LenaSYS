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
	var data = new Array()
	var element = document.getElementById('settings_'+ID);
	var elementChild = element.childNodes[0];;
	var settingsChildren = elementChild.childNodes;
	for(i = 0; i < settingsChildren.length; i++) {
		if(settingsChildren[i].nodeName == "INPUT") {
			if (settingsChildren[i].className != "submit-button") {
				data['coursename'] = settingsChildren[i].value;
			}
		} else if (settingsChildren[i].nodeName == "SELECT") {
			data['visibility'] = settingsChildren[i].value;
		}
	}
	
	$.ajax({
		url: "ajax/updateCourses.php",
		type: "POST",
		data: "courseid="+ID+"&coursename="+data['coursename']+"&visibility="+data['visibility'],
		dataType: "json",
		success: changeURL("menulist")
	});
}