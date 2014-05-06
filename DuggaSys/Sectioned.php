<?php
include_once("../../coursesyspw.php");	
include_once("../Shared/database.php");
include_once("../Shared/courses.php");
include_once("../Shared/sessions.php");	
include_once("basic.php");

dbConnect();
session_start();
?>
<!DOCTYPE html>
<html>
	<head>
			<link type="text/css" href="../CodeViewer/css/codeviewer.css" rel="stylesheet" />	
			<link type="text/css" href="css/duggasys.css" rel="stylesheet" />
			<script type="text/javascript" src="../Shared/js/jquery-1.11.0.min.js"></script>
			<script src="http://code.jquery.com/ui/1.9.1/jquery-ui.js"></script>
			<script type="text/javascript" src="duggasys.js"></script>
			<script type="text/javascript" src="startpage.js"></script>
            <script type="text/javascript" src="../CodeViewer/js/tooltips.js"></script>
			<script>
				setupLogin();
				<?php

						if(isset($_GET['courseid'])&&isset($_GET['vers'])){
								echo 'var courseID="'.$_GET['courseid'].'";';
								echo 'var vers="'.$_GET['vers'].'";';
						}else{
								echo 'var courseID="NONE!";';
								echo 'var vers="NONE!";';					
						}

						if(array_key_exists('uid', $_SESSION)) {
							echo 'var sessionkind=' . (hasAccess($_SESSION['uid'], $_GET['courseid'], 'w') ? 1 : 0) .';';
						//	$_SESSION['kind'] =  (hasAccess($_SESSION['uid'], $_GET['courseid'], 'w') ? 1 : 0);						
						} else {
							echo 'var sessionkind=0';
						}
				?>			
				
				function AJAXServiceSection(opt,para)
				{
						$.ajax({url: "SectionedService.php", type: "POST", data: "coursename="+courseID+"&vers="+vers+"&opt="+opt+para, dataType: "json", success: returnedSection});
				}

			</script>
	<div id="dragupdate"></div>
	</head>

<?php
		if(isset($_GET['courseid'])&&isset($_GET['vers'])){
				$courseID=$_GET['courseid'];
				if(courseexists($courseID)){
						// If course exists - check login credentials
						// Logged in and with credentials - show full editor otherwise show viewer version 

						if(checklogin()){
							$ha=hasAccess($_SESSION['uid'], $courseID, 'w');
							if($ha){
										// Allowed to edit this course
										editsectionmenu(true);
										?>
										<script>
										$(function() {
											// Initialize timer object
											var timer = null;
											// Placeholder
											$( "#Sectionlist" ).sortable({
												opacity: 0.5,
												cursor: "move",
												items: "> span",
												update: function() {
													// Check if timer was initialized
													if (timer != null) {
														// Clear the timer
														clearInterval(timer);
													}
													var serialized = $(this).sortable("serialize");
													timer = setTimeout(function(){
														// Pass course ID to check write access
														var array = serialized + "&courseid=" + '<?php echo $courseID; ?>';
														$.post("entryupdate.php", array, function(theResponse){
															$("#dragupdate").html(theResponse);
															$("#dragupdate").slideDown('slow');
															setTimeout(function(){
															  $("#dragupdate").slideUp("slow", function () { });
															}, 2000);
															timer = null;
														});
													}, 4000);
													
												}
											});
										});
										</script>
<?php
							} else {
										// No editing
										editsectionmenu(false);
							}
						}else{
								editsectionmenu(false);
						}			
				} else {
						// Print Warning If course does not exist!
						bodywarning("This course does not seem to exist!");
				}
		}else{
						bodywarning("This course does not seem to exist!");
		}
		loginwins();

?>		
</html>


<!--Place tooltips on all objects with a title-->
<script>
    $( document ).ready(function() {
        setTimeout(function() {
            $("*[title]").tooltips();
        }, 800);
    });
</script>
