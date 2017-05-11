<html>
<head>
<?php
/********************************************************************************

   Documentation 

*********************************************************************************

Execution Order
---------------------
#1  Handle files! One by one  -- if all is ok add file name (if file doesn't exists under a template create it)
#2 if variable $storefile == true, then add row(existence) of file into mysql
#3 if sent file isn't empty and upload is completed (e.g not a duplicate file that already exists) it checks if there already is a row in the db that is the same, if not, add row to db
#4 updates the page, redirects to "fileed.php" with the values for $cid, &coursevers and $vers.
-------------==============######## Documentation End ###########==============-------------

http://webblabb.iit.his.se/Dugga/DuggaSys/showDugga.php?cid=16&coursevers=98242&did=54&moment=594&segment=547&highscoremode=0

*/
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
//---------------------------------------------------------------------	
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
session_start();

pdoConnect(); // Connect to database and start session

$link=getOP('link');			
$inputtext=gettheOP('inputtext');			
$cid=getOP('cid');
$vers=getOP('coursevers');
$moment=getOP('moment');
$segment=getOP('segment');
$duggaid=getOP('did');
$fieldtype=getOP('field');
$fieldkind=getOP('kind');
$error=false;

$seq=0;

$loginname="";
$lastname="";
$firstname="";
					
if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
	$loginname=$_SESSION['loginname'];
	$lastname=$_SESSION['lastname'];
	$firstname=$_SESSION['firstname'];
}else{
	$userid="UNK";		
} 	

//  Handle files! One by one  -- if all is ok add file name to database
//  login for user is successful & has either write access or is superuser					
$filo=print_r($_FILES,true);
$info=$cid." ".$vers." ".$moment." ".$segment." ".$duggaid." ".$fieldtype." ".$fieldkind." ".$link." ".$filo;
$log_uuid= rand();
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "filereceive_dugga.php",$userid,$info);

$ha = checklogin();
if($ha){

		// Create folder if link textinput or file
		$currcvd=getcwd();

		if(!file_exists($currcvd."/submissions")) {
				if(!mkdir($currcvd."/submissions")) {
						echo "Error creating folder: ".$currcvd."/submissions";
						$error=true;
				}
		}

		if(!file_exists ($currcvd."/submissions/".$cid)){
				if(!mkdir($currcvd."/submissions/".$cid)){
						echo "Error creating folder: ".$currcvd."/submissions/cid";
						$error=true;
				}
		}

		if(!file_exists ($currcvd."/submissions/".$cid."/".$vers)){
				if(!mkdir($currcvd."/submissions/".$cid."/".$vers)){
						echo "Error creating folder: ".$currcvd."/submissions/cid/vers";
						$error=true;
				}
		}

		if(!file_exists ($currcvd."/submissions/".$cid."/".$vers."/".$duggaid)){
				if(!mkdir($currcvd."/submissions/".$cid."/".$vers."/".$duggaid)){
						echo "Error creating folder: ".$currcvd."/submissions/cid/vers/duggaid";
						$error=true;
				}
		}

		// Create a file area with format Lastname-Firstname-Login
		$userdir = $lastname."_".$firstname."_".$loginname;
		
		// First replace a predefined list of national characters
		// Then replace any additional character that is not a-z, a number, period or underscore
		$national = array("&ouml;", "&Ouml;", "&auml;", "&Auml;", "&aring;", "&Aring;","&uuml;","&Uuml;");
		$nationalReplace = array("o", "O", "a", "A", "a", "A","u","U");
		$userdir = str_replace($national, $nationalReplace, $userdir);
		$userdir=preg_replace("/[^a-zA-Z0-9._]/", "", $userdir);				

		if(!file_exists ($currcvd."/submissions/".$cid."/".$vers."/".$duggaid."/".$userdir)){
				if(!mkdir($currcvd."/submissions/".$cid."/".$vers."/".$duggaid."/".$userdir)){
						echo "Error creating folder: ".$currcvd."/submissions/cid/vers/duggaid/".$userdir;
						$error=true;
				}
		}

		if($inputtext!="UNK"){
				
				$fname=$fieldtype;
				$fname=preg_replace("/[^a-zA-Z0-9._]/", "", $fname);				
				
				$extension="txt";
				$mime="txt";

				$query = $pdo->prepare("SELECT COUNT(*) AS Dusty FROM submission WHERE uid=:uid AND did=:did AND filename=:fname AND cid=:cid;", array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));  
				$query->bindParam(':did', $duggaid);
				$query->bindParam(':cid', $cid);
				$query->bindParam(':fname', $fname);
				$query->bindParam(':uid', $userid);
				if(!$query->execute()) {
					$error=$query->errorInfo();
					echo "Error reading submissions a".$error[2];
				}			 				
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
							$seq=$row['Dusty'];
				}
				$seq++;		  

				$filepath="submissions/".$cid."/".$vers."/".$duggaid."/".$userdir."/";
			  $movname=$currcvd."/submissions/".$cid."/".$vers."/".$duggaid."/".$userdir."/".$fname.$seq.".".$extension;	
			  file_put_contents($movname, htmlentities($inputtext, ENT_QUOTES | ENT_IGNORE, "UTF-8"));
			  
				$query = $pdo->prepare("INSERT INTO submission(fieldnme,uid,cid,vers,did,filepath,filename,extension,mime,kind,seq,segment,updtime) VALUES(:field,:uid,:cid,:vers,:did,:filepath,:filename,:extension,:mime,:kind,:seq,:segment,now());");
				
				$query->bindParam(':uid', $userid);
				$query->bindParam(':cid', $cid);
				$query->bindParam(':vers', $vers);
				$query->bindParam(':did', $duggaid);
				$query->bindParam(':filepath', $filepath);
				$query->bindParam(':filename', $fname);
				$query->bindParam(':extension', $extension);
				$query->bindParam(':mime', $mime);
				$query->bindParam(':field', $fieldtype);
				$query->bindParam(':kind', $fieldkind);
				$query->bindParam(':seq', $seq);
				$query->bindParam(':segment', $moment);
				
				if(!$query->execute()) {
					$error=$query->errorInfo();
					echo "Error updating file entries".$error[2];
				}			 				

		}else if($link!="UNK"){
				// Create a MD5 hash from url to use as file marker - used when giving responsible
				$md5_filename = md5 ( $link );	
				$query = $pdo->prepare("SELECT COUNT(*) AS Dusty FROM submission WHERE uid=:uid AND did=:did AND filename=:fname AND cid=:cid;", array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));  
				$query->bindParam(':uid', $userid);
				$query->bindParam(':did', $duggaid);
				$query->bindParam(':cid', $cid);
				$query->bindParam(':fname', $md5_filename);
				$query->execute();
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
							$seq=$row['Dusty'];
				}
				$seq++;		  

				$filepath="submissions/".$cid."/".$vers."/".$duggaid."/".$userdir."/";

				$movname = $currcvd."/submissions/".$cid."/".$vers."/".$duggaid."/".$userdir."/".$md5_filename.$seq;
				file_put_contents($movname, $link);

				$query = $pdo->prepare("INSERT INTO submission(fieldnme,uid,cid,vers,did,filepath,filename,extension,mime,kind,seq,segment,updtime) VALUES(:field,:uid,:cid,:vers,:did,:filepath,:filename,null,null,:kind,:seq,:segment,now());");				
			
				$query->bindParam(':uid', $userid);
				$query->bindParam(':cid', $cid);
				$query->bindParam(':vers', $vers);
				$query->bindParam(':did', $duggaid);
				$query->bindParam(':filepath', $filepath);
				$query->bindParam(':filename', $md5_filename);
				$query->bindParam(':field', $fieldtype);
				$query->bindParam(':kind', $fieldkind);
				$query->bindParam(':seq', $seq);
				$query->bindParam(':segment', $moment);
				
				if(!$query->execute()) {
					$error=$query->errorInfo();
					echo "Error updating file entries".$error[2];
				}			 				
		}else{
				// chdir('../'); 

				
								
				//  if the file is of type "GFILE"(global) or "MFILE"(course local) and it doesn't exists in the db, add a row into the db
			  //$allowedT = array("applicaton/octet-stream","application/x-zip","application/x-msdownload","application/x-pdf","application/pdf","application/x-rar-compressed","application/zip", "application/octet-stream","application/force-download","application/x-download", "application/x-zip-compressed", "binary/octet-stream", "application/download","application/application-download", "text/html", "application/save");
				//$allowedX = array("pdf","zip","rar");
				$allowedExtensions = [
					"pdf"		=> ["application/pdf"],
					"zip"		=> ["application/zip"],
					//"rar"	=> [
				];
				
				$swizzled = swizzleArray($_FILES['uploadedfile']);
				
				foreach ($swizzled as $key => $filea){
					
						$filea['type']=str_replace('"', "",$filea['type']);
						$filea['type']=str_replace("'", "",$filea['type']);
					
						//  if the file has a name (e.g it is successfully sent to "filereceive.php") begin the upload process.
						if($filea["name"]!=""){
								$fname=$filea['name'];
		
								// Remove white space and non ascii characters
								$fname=preg_replace("/[^a-zA-Z0-9._]/", "", $fname);				
								
								$posPeriod = strrpos($fname, ".");
								if ($posPeriod !== false){
									$extension = substr($fname, $posPeriod+1);
									$fname = substr($fname, 0, $posPeriod);								
								} else {
									$extension = "UNK";
								}
								$filetype = mime_content_type($filea["tmp_name"]);
								//  if file type is allowed, continue the uploading process.
								if(array_key_exists($extension, $allowedExtensions) && in_array($filetype, $allowedExtensions[$extension], True)){ 
										$seq=0;
										$query = $pdo->prepare("SELECT COUNT(*) AS Dusty FROM submission WHERE uid=:uid AND did=:did AND filename=:fname AND cid=:cid;", array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));  
										$query->bindParam(':did', $duggaid);
										$query->bindParam(':cid', $cid);
										$query->bindParam(':fname', $fname);
										$query->bindParam(':uid', $userid);
										$query->execute();
										foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
													$seq=$row['Dusty']+1;
										}															  
		
									  $movname=$currcvd."/submissions/".$cid."/".$vers."/".$duggaid."/".$userdir."/".$fname.$seq.".".$extension;	
					
										// check if upload is successful 
										if(move_uploaded_file($filea["tmp_name"],$movname)){ 
		
														$query = $pdo->prepare("INSERT INTO submission(fieldnme,uid,cid,vers,did,filepath,filename,extension,mime,kind,seq,segment,updtime) VALUES(:field,:uid,:cid,:vers,:did,:filepath,:filename,:extension,:mime,:kind,:seq,:segment,now());");
														
														$filepath="submissions/".$cid."/".$vers."/".$duggaid."/".$userdir."/";
		
														$query->bindParam(':uid', $userid);
														$query->bindParam(':cid', $cid);
														$query->bindParam(':vers', $vers);
														$query->bindParam(':did', $duggaid);
														$query->bindParam(':filepath', $filepath);
														$query->bindParam(':filename', $fname);
														$query->bindParam(':extension', $extension);
														$query->bindParam(':mime', $filea['type']);
														$query->bindParam(':field', $fieldtype);
														$query->bindParam(':kind', $fieldkind);
														$query->bindParam(':seq', $seq);
														$query->bindParam(':segment', $moment);
														
														if(!$query->execute()) {
															$error=$query->errorInfo();
															echo "Error updating file entries".$error[2];
														}			 				
										}else{
												echo "Error moving file ".$movname;
												$error=true;
										}
				
								}else{ 
									//if the file extension is not allowed
									if(!array_key_exists($extension, $allowedExtensions)) echo "Extension \"".$extension."\" not allowed.\n";
								 	else echo "Type \"$filetype\" not valid for file extension: \"$extension\"" . "\n";
									$error=true;
								}
						}
				}						

		}

}

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "filerecrive_dugga.php", $userid,$info);
	
if(!$error){
		echo "<meta http-equiv='refresh' content='0;URL=showDugga.php?cid=".$cid."&coursevers=".$vers."&did=".$duggaid."&moment=".$moment."&segment=".$segment."&highscoremode=0' />";  //update page, redirect to "fileed.php" with the variables sent for course id and version id
}

?>
</head>
<body>
<?php
if(!$error){
		echo "<script>window.gocation.replace('showDugga.php?cid=".$cid."&coursevers=".$vers."&did=".$duggaid."&moment=".$moment."&segment=".$segment."&highscoremode=0');</script>"; //update page, redirect to "fileed.php" with the variables sent for course id and version id
}else{

}
?>
</body>
</html>
