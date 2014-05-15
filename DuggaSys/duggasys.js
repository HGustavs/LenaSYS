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
				switch(parseInt(data['entries'][i]['kind'])) {
					case 0:
						// Styling for header row
						if (parseInt(data['entries'][i]['visible']) === 0) {
							str+="<span class='hidden' id='Entry_"+data['entries'][i]['lid']+"'>";
						} else {
							str+="<span class='bigg' id='Entry_"+data['entries'][i]['lid']+"'>";
						}
						if(sessionkind===true){
							str+="<span id='SE"+data['entries'][i]['lid']+"' ><a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a></span>";
							str+="<span class='smallishbutt'>";
							str+="<img id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";											
							str+="</span>";
						}else{
							str+="<span id='SE"+data['entries'][i]['lid']+"'>"+data['entries'][i]['entryname']+"</span>";						
						}
						str+="</span>";
						break;
					case 1:
						//Styling for section row
						if (parseInt(data['entries'][i]['visible']) === 0) {
							str+="<span class='hidden' id='Entry_"+data['entries'][i]['lid']+"'>";
						} else {
							str+="<span class='butt' id='Entry_"+data['entries'][i]['lid']+"'>";
						}

						// If we are allowed to edit
						if(sessionkind===true){
							str+="<span id='SE"+data['entries'][i]['lid']+"'>"+data['entries'][i]['entryname']+"</span>";
							str+="<span class='smallbutt'>";
							str+="<img id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							str+="</span>";
						}else{
							str+="<span id='SE"+data['entries'][i]['lid']+"'>"+data['entries'][i]['entryname']+"</span>";						
						}
						
						// End of butt span
						str+="</span>"
						break;
					case 2:
						// Styling for example row
						if (parseInt(data['entries'][i]['visible']) === 0) {
							str+="<span class='hidden' id='Entry_"+data['entries'][i]['lid']+"'>";
						} else {
							str+="<span class='example' id='Entry_"+data['entries'][i]['lid']+"'>";
						}
						if(sessionkind===true){
								str+="<span id='EX"+data['entries'][i]['lid']+"'><a id='section-list' href='../CodeViewer/EditorV30.php?exampleid=" + data['entries'][i]['code_id'] + "&courseid=" + data.courseid + "'>"+data['entries'][i]['entryname']+"</a></span>";
								str+="<span class='smallbutt'>";
								str+="<img id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";											
								str+="</span>"
						}else{
								str+="<a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a>";		
						}
						str+="</span>";
						break;
					case 3:
						// Styling for test row
						if (parseInt(data['entries'][i]['visible']) === 0) {
							str+="<span class='hidden' id='Entry_"+data['entries'][i]['lid']+"'>";
						} else {
							str+="<span class='test' id='Entry_"+data['entries'][i]['lid']+"'>";
						}
						if(sessionkind===true){
								str+="<span id='EX"+data['entries'][i]['lid']+"'><a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a></span>";
								str+="<span class='smallbutt'>";
								str+="<img id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";										
								str+="</span>"
						}else{
								str+="<a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a>";		
						}
						str+="</span>";
						break;
					default:
					case 4:
						// Styling for 'others' row
						if (parseInt(data['entries'][i]['visible']) === 0) {
							str+="<span class='hidden' id='Entry_"+data['entries'][i]['lid']+"'>";
						} else {
							str+="<span class='norm' id='Entry_"+data['entries'][i]['lid']+"'>";
						}
						if(sessionkind===true){
								str+="<span id='EX"+data['entries'][i]['lid']+"'><a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a></span>";
								str+="<span style='float:right;' class='smallbutt'>";
								str+="<img id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";											
								str+="</span>"
						}else{
								str+="<a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a>";		
						}
						str+="</span>";
						break;
					}
				}
			}
			
			var slist=document.getElementById('Sectionlist');
			slist.innerHTML=str;


		  if(data['debug']!="NONE!") alert(data['debug']);

}
