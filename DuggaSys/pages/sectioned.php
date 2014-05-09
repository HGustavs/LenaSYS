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
												$("#dragupdate").html('Sparade listelementen');
											} else {
												$("#dragupdate").html('Kunde inte spara listan');
											}
											$("#dragupdate").slideDown('slow');
											setTimeout(function(){
												$("#dragupdate").slideUp("slow", function () { });
											}, 2000);
											dragtimer = null;
										});
									}, 4000);

								}
						});
					}
				})

				function serviceOnSuccess(data) {
					sessionkind=data.writeaccess;
					if(sessionkind==true) {
						$(document).makesortable();
					}
					returnedSection(data);
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

            <!--Linkans fula meddelande som kommer upp när du har gjort en dragNdrop-->
	</head>
	<div id="dragupdate"></div>
	<div id="Sectionlist">
	</div>
</html>


<!--Place tooltips on all objects with a title

Do we want to tooltips?

 <script>
    $( document ).ready(function() {
        setTimeout(function() {
            $("*[title]").tooltips();
        }, 800);
    });
</script>-->
