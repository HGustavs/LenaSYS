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
		var dragtimer = null;
		dragtimer = setTimeout(function() {
			if(!response) {
				$("#dragupdate-menulist").html('Could not update course');
			} else {
				$("#dragupdate-menulist").html('Updated course');
			}
			$("#dragupdate-menulist").slideDown('slow');
			setTimeout(function(){
				$("#dragupdate-menulist").slideUp("slow", function () { });
			}, 2500);
			dragtimer = null;
		}, 500);
	});
}

function sectionSettingsService(ID)
{
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
		page.show();
		var dragtimer = null;
		dragtimer = setTimeout(function() {
			if(!response) {
				$("#dragupdate-menulist").html('Could not update course');
			} else {
				$("#dragupdate-menulist").html('Updated course');
			}
			$("#dragupdate-menulist").slideDown('slow');
			setTimeout(function(){
				$("#dragupdate-menulist").slideUp("slow", function () { });
			}, 2500);
			dragtimer = null;
		}, 500);
	});
}


function showSectionSettingRow(ID){
	var display = $('#sectioned_'+ID).css('display');
	if(display == 'none'){
		$('#sectioned_'+ID).show();
	}else {
		$('#sectioned_'+ID).hide();
	}
}