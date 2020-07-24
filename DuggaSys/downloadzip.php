<?php
/***********************DOCUMENTATION**************************
 * This file should make downloading of all material of the   *
 * current course version given we know the courseid          *
 * every file sould be put in one zip file and then downloaded*
 **************************************************************/
// Used tutorial https://learncodeweb.com/php/select-and-download-multi-files-in-zip-format-with-php/
include_once	"../Shared/basic.php";
include_once	"../Shared/sessions.php";


session_start();
if(hasAccess($_SESSION["uid"], $_SESSION["courseid"], "w") || $_SESSION["superuser"] == 1){
pdoConnect(); // Connect to database and start session


// Get real path for our folder
$cid	= $_SESSION['courseid'];
$vers	= $_SESSION['coursevers'];
$pathToActiveVersionOfCourse	=	'/courses/' . $cid .	'/'	.	$vers	.	'/';
$zipcreated	=	"./downloads/courseID-"	.	$cid	.	"_version-"	.	$vers	.	"_All_files.zip";
$error = false;

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="UNK";
}

// Gets username based on uid, USED FOR LOGGING
$query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query-> execute();

// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
while ($row = $query->fetch(PDO::FETCH_ASSOC)){
	$username = $row['username'];
}

// Logging who request to download all content from what course version 
$description=$cid." ".$vers;
logUserEvent($userid, $username, EventTypes::DownloadAllCourseVers, $description);

// Create new zip class 
$zip	=	new	ZipArchive; 

if (!file_exists('./downloads/')) {
	mkdir('./downloads/', 0777, true);
}

if($zip	->	open($zipcreated,	ZipArchive::CREATE	)	===	TRUE){ 
	
	chdir('..');
	$currcvd	=	getcwd();

	// Enter the name of directory
	$pathdir	=	$currcvd.$pathToActiveVersionOfCourse;  
	
	// Store the path into the variable 
	if (!file_exists($pathdir)) {
		echo "Could not find the file, try to upload a version dependend file to create this directory.";
		return;
	}


	if($dir = opendir($pathdir)){ 
		while(false !== $file = readdir($dir)) { 
			if($file != "." && $file	!=	".."	&&	!is_dir($pathdir."/".$file)) { 
				echo "adding file: " . $pathdir.$file . "\n";
				$zip -> addFile($pathdir.$file, $file); 
			} 
		} 
		closedir($dir);
	}	else{
		echo "Could not find: ". $pathdir . "\nTry to upload a version dependend file to create this directory.";
		$error = true;
	}
	
	
	if($zip	->	close()){ 
		chdir('./DuggaSys');
		echo " " . getcwd();
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
		echo "failed to find the temp zip file";
		$error = true;
		}
	
	}else{
		echo "error to create temporary file";
		$error = true;
	}
}

}

?>
<html>
<head>
</head>
<body>
<?php
	if($error === false){
		echo "<script> window.close() </script>";
		//echo	"<script>window.location.replace('sectioned.php?cid="	.	$cid	.	"&coursevers="	.	$vers	.	"');</script>";	//update page, redirect to "sectioned.php" with the variables sent for course id and version id
	}
?>
</body>
</html>