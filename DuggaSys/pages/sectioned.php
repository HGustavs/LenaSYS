<?php
include_once(dirname(__FILE__) . "/../../../coursesyspw.php");	
include_once(dirname(__FILE__) . "/../../Shared/database.php");
include_once(dirname(__FILE__) . "/../../Shared/courses.php");
include_once(dirname(__FILE__) . "/../../Shared/sessions.php");	

pdoConnect();
session_start();
checklogin();
?>
	<link type="text/css" href="css/style.css" rel="stylesheet" />
	<script type="text/javascript" src="js/duggasys.js"></script>
	<script type="text/javascript" src="js/verificationFunctions.js"></script>
	<script>
		var sessionkind=0;
		var querystring=getUrlVars();
		database = new getDatabase();
		database.populateData(querystring.courseid, "example");
		database.populateData(querystring.courseid, "test");
		$.fn.extend({
			makesortable: function() {
				// Initialize timer object
				$( "#Sectionlist" ).sortable({
					opacity: 0.5,
					cursor: "move",
					items: "> span"
				});
			}
		})
		
		function serviceOnSuccess(data) {
			sessionkind=data.writeaccess;
			readaccess=data.readaccess;
			if(sessionkind==true) {
				$(document).makesortable();
				$("#Sectionlist").sortable("disable");
			}
			if (readaccess==true) {
				returnedSection(data);
			} else {
				changeURL('noid');
			}
			page.title(data.coursename);
		}
		function AJAXServiceSection(opt,para)
		{
			$.ajax({
				url: "ajax/SectionedService.php",
				type: "POST",
				data: "courseid="+querystring.courseid+"&opt="+opt+para,
				dataType: "json",
				success: serviceOnSuccess
			});
		}
		AJAXServiceSection("List", '');
	</script>
    <!--This needs to be here in order to print sectionlist-->        
	<div id="Sectionlist"></div>
