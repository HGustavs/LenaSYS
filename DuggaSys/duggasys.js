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
								str+="<span style='Opacity:0.5;'>"+data['entries'][i]['entryname']+"</span>";
								str+="<img style='opacity:0.5;'onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_white.svg' />";
							} else {
								str+="<span>"+data['entries'][i]['entryname']+"</span>";
								str+="<img onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_white.svg' />";
							}
						} else {
							if (parseInt(data['entries'][i]['visible']) === 0) {
								//Adding the opacity here instead for visible = 0
								str+="<span><a id='section-list' style='opacity:0.5;' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a></span>";
								str+="<img style='opacity:0.5;' onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							
							} else{
								str+="<span><a id='section-list' href="+data['entries'][i]['link']+">"+data['entries'][i]['entryname']+"</a></span>";
								str+="<img onclick='showSectionSettingRow("+data["entries"][i]['lid']+")' id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							}
						}
						str+="<div class='sectionlist-change-div' id='sectioned_"+data["entries"][i]['lid']+"'>";
						str+="Edit name:<input type='text' name='sectionname' value='"+data['entries'][i]['entryname']+"' />";
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
						str+="Edit link:<input type='text' name='link' value='"+data['entries'][i]['link']+"' />";
						str+="Visibility:<select name='visibility'><option value='"+data['entries'][i]['visible']+"'>";
						if(data['entries'][i]['visible'] != 0){
							str+="Public</option>";
							str+="<option value='0'>Hidden</option>";
						}else{
							str+="Hidden</option>";
							str+="<option value='1'>Public</option>";
						}
						str+="</select>";
						str+="<div style='float:right;'>";
						str+="<input class='submit-button' type='button' value='Delete' onclick='AJAXServiceSection(\"sectionDel\", \"&sectid="+data['entries'][i]['lid']+"\");' style='margin-left:10px;margin-right:10px;' />";
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

}
  function studentDelete(showhide) {
      if (showhide == "show") {
          document.getElementById('deletebox').style.visibility = "visible";
          document.getElementById('deletebutton').style.visibility = "visible";
      } else if (showhide == "hide") {
          document.getElementById('deletebox').style.visibility = "hidden";
          document.getElementById('deletebutton').style.visibility = "hidden";
      }
  }


$(function() {
       $('#hide').click(function() {
                $('td:nth-child(4)').hide();                
       });

	   $('#show').click(function() {
                $('td:nth-child(4)').show();                
       });
    });

function passPopUp(){

$.ajax({
		dataType: "json",
		type: "POST",
		url: 'addstudent_ajax.php',
		data: {
			string: $("#string").val()
		},
		success: function (returnedData) {
		console.log(returnedData);
		showPopUp('show', returnedData)
		},
	});
	}

	function showPopUp(showhidePop, returnedData){
		if(showhidePop == "show"){
		document.getElementById('light').style.visibility = "visible";
		document.getElementById('fade').style.visibility = "visible";

		if (returnedData.length == 0){
   	 		var output = "Användaren/användarna du registrerade finns redan inlagda globalt och har nu lagts till på kursen";
   		}
   		else {
	  var output = "<div id='printArea'>";
	  output += "<table class='list'>";
      output += "<tr><th>Namn</th>";
      output += "<th>Användarnamn</th>";
      output += "<th>Lösenord</th></tr>";

      $.each(returnedData, function(){
      output += "<tr><td>"+this[1]+"</td>";
      output += "<td>"+this[0]+"</td>";
      output += "<td>"+this[2]+"</td></tr>";
		})
       output += "</table>";
       output += "</div>";
	   output += "<input type='button' onclick='printDiv()' value='Print passwords' />";
   }
      var div = document.getElementById('light');
      div.innerHTML = output;
	}
	else if(showhidePop == "hide"){
		document.getElementById('light').style.visibility = "hidden";
		document.getElementById('fade').style.visibility = "hidden";	
	}
}

function printDiv(){
	var printArea = document.getElementById('printArea').innerHTML;
	var originalContents = document.body.innerHTML;

	document.body.innerHTML = printArea;

	window.print();

	document.body.innerHTML = originalContents;
}