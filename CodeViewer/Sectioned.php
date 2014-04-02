<html>
	<head>
			<link type="text/css" href="css/codeviewer.css" rel="stylesheet" />	
			<script type="text/javascript" src="js/jquery-1.5.1.min.js"></script>
			<script type="text/javascript" src="js/codeviewer.js"></script>

			<script>
				//HEJ! :)
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
				
		include_once("../../coursesyspw.php");	
		include_once("basic.php");
		
		dbConnect();
		
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
