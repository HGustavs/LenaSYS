<?php
include_once(dirname(__FILE__) . "/../../../coursesyspw.php");	
include_once(dirname(__FILE__) . "/../../Shared/database.php");
include_once(dirname(__FILE__) . "/../../Shared/courses.php");
include_once(dirname(__FILE__) . "/../../Shared/sessions.php");	

dbConnect();
session_start();
checklogin();
?>
<!DOCTYPE html>
<html>
	<head>
            <link type="text/css" href="css/style.css" rel="stylesheet" />
			<script type="text/javascript" src="duggasys.js"></script>
			<script type="text/javascript" src="js/verificationFunctions.js"></script>
            <!--<script type="text/javascript" src="../CodeViewer/js/tooltips.js"></script>-->
			<script>
				var sessionkind=0;
				var querystring=getUrlVars();
				var coursename=querystring.coursename;

				$.fn.extend({
					makesortable: function() {
						// Initialize timer object
						var dragtimer = null;
						$( "#Sectionlist" ).sortable({
							opacity: 0.5,
								cursor: "move",
								items: "> span",
								update: function() {
									// Check if timer was initialized
									if (dragtimer != null) {
										// Clear the timer
										clearInterval(dragtimer);
									}
									var serialized = $(this).sortable("serialize");
									dragtimer = setTimeout(function(){
										// Pass course ID to check write access
										var array = serialized + "&courseid=" + querystring.courseid + "&opt=updateEntries";
										$.post("SectionedService.php", array, function(theResponse){
											var data = $.parseJSON(theResponse);
											if(data.success) {
												$("#dragupdate-section").html('Saved list elements');
											} else {
												$("#dragupdate-section").html('Could not save list elements');
											}
											$("#dragupdate-section").slideDown('slow');
											setTimeout(function(){
												$("#dragupdate-section").slideUp("slow", function () { });
											}, 2500);
											dragtimer = null;
										});
									}, 2000);

								}
						});
					}
				})

				function serviceOnSuccess(data) {
					sessionkind=data.writeaccess;
					readaccess=data.readaccess;
					if(sessionkind==true) {
						$(document).makesortable();
					}
					if (readaccess==true) {
						returnedSection(data);
					} else {
						changeURL('noid');
					}
				}
				function AJAXServiceSection(opt,para)
				{
					$.ajax({
						url: "SectionedService.php",
						type: "POST",
						data: "courseid="+querystring.courseid+"&opt="+opt+para,
						dataType: "json",
						success: serviceOnSuccess
					});
				}
				AJAXServiceSection("List", '');
			</script>
	</head>
	<div id="dragupdate-section"></div>
	<div id="Sectionlist"></div>
</html>