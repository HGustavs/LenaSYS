<?php 	
		include_once("../Shared/coursesyspw.php");
		include_once("../Shared/database.php");
		include_once("../Shared/courses.php");
		include_once("../Shared/sessions.php");	
		include_once("../Shared/basic.php");	
		include_once("basic.php");
		dbConnect();
?>

<html>
	<head>
			<link type="text/css" href="../CodeViewer/css/codeviewer.css" rel="stylesheet" />	
			<script src="http://code.jquery.com/jquery-1.8.2.js"></script>
			<script src="http://code.jquery.com/ui/1.9.1/jquery-ui.js"></script>
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

						session_start();
						if(isset($_SESSION['kind'])){
								echo 'var sessionkind="'.$_SESSION['kind'].'";';						
						}else{
								echo 'var sessionkind="NONE!";';												
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
								$kind=$_SESSION['kind'];
								if(strpos($kind,$courseID)>-1||strpos($kind,"Superuser")>-1){
										// Allowed to edit this course
										editsectionmenu(true);
										?>
										<script>
											$(function() {
												// Placeholder
												$( "#Sectionlist" ).sortable({
													opacity: 0.5,
													cursor: "move",
													items: "> span",
													update: function() {
														// Pass course ID to check write access
														var array = $(this).sortable("serialize");
														$.post("entryupdate.php", array);
													}
												});
											});
										</script>
<?php
								}else if($kind!="LOGIN!"){
										// No editing
										editsectionmenu(false);
								}
						}else{
								editsectionmenu(false);
						}			
				}else{
						// Print Warning If course does not exist!
						bodywarning("This course does not seem to exist!");
				}
		}else{
						bodywarning("This course does not seem to exist!");
		}

?>		
</html>
