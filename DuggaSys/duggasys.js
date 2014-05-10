function returnedSection(data)
{
		retdata=data;
		
		// Fill section list with information
		str="";
		str+="<div style='float:right;'><input class='submit-button' type='button' value='Add' onclick='changeURL(\"newSectionForm?courseid=" + data.courseid + "\")'/></div>";	
		// Course Name
		str+="<div class='course'>"+data.coursename+"</div>";

		// For now we only have two kinds of sections
		for(i=0;i<data['entries'].length;i++){
			if (parseInt(data['entries'][i]['visible']) === 1 || sessionkind === true) {
				if (parseInt(data['entries'][i]['visible']) === 0) {
					str+="<span class='hidden' id='Entry_"+data['entries'][i]['lid']+"'>";
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
						str+="<span>"+data['entries'][i]['entryname']+"</span>";
						str+="<img id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
					} else {
						str+="<span><a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a></span>";
						str+="<img id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";	
					}
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
			
			var slist=document.getElementById('Sectionlist');
			slist.innerHTML=str;


		  if(data['debug']!="NONE!") alert(data['debug']);

}