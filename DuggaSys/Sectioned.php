<?php
include_once("../../coursesyspw.php");	
include_once("basic.php");

dbConnect();
session_start();
?>
<html>
	<head>
			<link type="text/css" href="../CodeViewer/css/codeviewer.css" rel="stylesheet" />	
			<script type="text/javascript" src="../CodeViewer/js/jquery-1.5.1.min.js"></script>
			<script type="text/javascript" src="duggasys.js"></script>

			<script>
				<?php

						if(isset($_GET['courseid'])&&isset($_GET['vers'])){
								echo 'var courseID="'.$_GET['courseid'].'";';
								echo 'var vers="'.$_GET['vers'].'";';
						}else{
								echo 'var courseID="NONE!";';
								echo 'var vers="NONE!";';					
						}

						if(array_key_exists('uid', $_SESSION)) {
							echo 'var sessionkind=' . hasAccess($_SESSION['uid'], $_GET['courseid'], 'w').';';						
						} else {
							echo 'var sessionkind=0';
						}
				?>			
				
				function AJAXServiceSection(opt,para)
				{
						$.ajax({url: "SectionedService.php", type: "POST", data: "coursename="+courseID+"&vers="+vers+"&opt="+opt+para, dataType: "json", success: returnedSection});
				}

			</script>

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

?>			
</html>
