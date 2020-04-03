<?php
    /***********************DOCUMENTATION**************************
     * This file should make downloading of all material          *
     * of a singel course doable given we know the courseid       *
     * every file sould be put in one zip file and then downloaded*
     **************************************************************/
		// Used tutorial https://learncodeweb.com/php/select-and-download-multi-files-in-zip-format-with-php/
		include_once	"../Shared/basic.php";
		include_once	"../Shared/sessions.php";
		session_start();

		pdoConnect(); // Connect to database and start session
		
	
		// Get real path for our folder
		$cid	= $_SESSION['courseid'];
		$vers	= $_SESSION['coursevers'];
		$pathToVersionIndependence	=	'/courses/'	.	$cid	.	'/versionIndependence/';
		$pathToActiveVersionOfCourse	=	'/courses/' . $cid .	'/'	.	$vers	.	'/';
		$zipcreated	=	"./downloads/courseID-"	.	$cid	.	"_version-"	.	$vers	.	"_All_files.zip";

		// Create new zip class 
		$zip	=	new	ZipArchive; 
   
		if($zip	->	open($zipcreated,	ZipArchive::CREATE	)	===	TRUE){ 
			chdir('../');
			$currcvd	=	getcwd();

			
			// Enter the name of directory 
			$pathdir	=	$currcvd.$pathToVersionIndependence;  


			// Store the path into the variable 
			if($dir	=	opendir($pathdir)){ 
				while(false	!==	$file	=	readdir($dir)){ 
					if($file	!=	"."	&&	$file	!=	".."	&&	!is_dir($pathdir."/".$file)){ 
							$zip	->	addFile($pathdir.$file,	$file); 
					} 
				}
				closedir($dir);
			}

			// Enter the name of directory 2
			$pathdir	=	$currcvd.$pathToActiveVersionOfCourse;  
			
			// Store the path into the variable 
			if($dir = opendir($pathdir)){ 
				while(false !== $file = readdir($dir)) { 
					if($file != "." && $file	!=	".."	&&	!is_dir($pathdir."/".$file)) { 
							$zip -> addFile($pathdir.$file, $file); 
					} 
				} 
				closedir($dir);
			}	

			$zip	->	close(); 
			chdir('./DuggaSYS');
			if(file_exists($zipcreated)) {
				echo "in file download";
				header('Content-Description: File Transfer');
				header('Content-Type: application/zip');
				header('Content-Disposition: attachment; filename='.basename($zipcreated));
				header('Content-Transfer-Encoding: binary');
				header('Expires: 0');
				header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
				header('Pragma: public');
				header('Content-Length: ' . filesize($zipcreated));
				ob_clean();
				flush();
				readfile($zipcreated);
				exit;
			}else {
				echo "failed to find a file";
			}
		}
		 
		
		?>
<html>
<head>
</head>
<body>
<?php
		echo	"<script>window.location.replace('sectioned.php?cid="	.	$cid	.	"&coursevers="	.	$vers	.	"');</script>";	//update page, redirect to "sectioned.php" with the variables sent for course id and version id
?>
</body>
</html>