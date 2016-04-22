<html>
<head>
<?php
date_default_timezone_set("Europe/Stockholm");
// Include basic application services!
//---------------------------------------------------------------------	
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

session_start();
pdoConnect(); // Connect to database and start session

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="UNK";		
} 

//is it a request to delete template or add template
$request = getOP('request');

//access if user is superuser
$ha = checklogin() && isSuperUser($userid);
if ($ha && $request == "add") {
	//allowed fileformats
	$allowedT = array("image/png", "text/html", "application/javascript");
	$allowedX = array("png", "html", "js");

	$storefile=false;
	$currcvd=getcwd();
	$swizzled = swizzleArray($_FILES['uploadedfile']);
	foreach ($swizzled as $key => $filea){
		$fname = $filea['name'];
		if ($fname != "") {
			$temp = explode(".", $filea["name"]);
			$extension = end($temp); //stores the file type

			// Remove white space and non ascii characters
			$fname=preg_replace('/[[:^print:]]/', '', $fname);
			$fname = preg_replace('/\s+/', '', $fname); 
			$movname=$currcvd."/templates/".$fname;
			if (in_array($extension, $allowedX)&&in_array($filea['type'], $allowedT)) {
				//  if file type is allowed, continue the uploading process.
				if (!file_exists ($movname)) {
					if (move_uploaded_file($filea["tmp_name"],$movname)) {
						echo "you transfered ".$fname;
						echo "<br>";
					}
					else{
						echo "could not write.".$movname.".<br>";
					}
				}
				else{
					echo $fname." already exists.<br>";
				}
			}
			else{
				echo $fname." file type not allowed.<br>";
			}

		}

	}
}
else if($ha && $request == "remove"){
	$currcvd=getcwd();
	//get template to remove	
	$file = getOP("templateDropdown");
	//file name for the js- and html file
	$jsFile = $file.".js";
	$htmlFile = $file.".html";
	//add path
	$jsFile = $currcvd."/templates/".$jsFile;
	$htmlFile = $currcvd."/templates/".$htmlFile;
	if (!unlink($jsFile))
  	{
 	 	echo ("Error deleting $jsFile <br>");
  	}
	else
  	{
  		echo ("Deleted $jsFile <br>");
  	}
  	if (!unlink($htmlFile))
  	{
 	 	echo ("Error deleting $htmlFile <br>");
  	}
	else
  	{
  		echo ("Deleted $htmlFile <br>");
  	}
}
else{
	echo "not logged in/not superuser.";
}

//return to previous page after 2s
header("Refresh: 2; URL={$_SERVER["HTTP_REFERER"]}");
?>
</head>
<body>
</body>
</html>