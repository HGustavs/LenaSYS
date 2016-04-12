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
$inputtext=getOP('inputtext');			
$cid=getOP('cid');
$vers=getOP('coursevers');
$moment=getOP('moment');
$segment=getOP('segment');
$duggaid=getOP('did');
$fieldtype=getOP('field');
$fieldkind=getOP('kind');
$error=false;
$type = getOP('type');

$seq=0;		
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
$ha = checklogin();
if($ha){
		// Create folder if link textinput or file
		if($link=="UNK"){
				$currcvd=getcwd();
				if (!file_exists($currcvd."/submissions/")) {
					mkdir($currcvd."/submissions/");
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
		
				if(!file_exists ($currcvd."/submissions/".$cid."/".$vers."/".$duggaid."/".$userdir)){
						if(!mkdir($currcvd."/submissions/".$cid."/".$vers."/".$duggaid."/".$userdir)){
								echo "Error creating folder: ".$currcvd."/submissions/cid/vers/duggaid/".$userdir;
								$error=true;
						}
				}
		}

		if($inputtext!="UNK"){
				
				$fname=$fieldtype;
				
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
			  
				$query = $pdo->prepare("INSERT INTO submission(fieldnme,uid,cid,vers,did,filepath,filename,extension,mime,kind,seq,updtime) VALUES(:field,:uid,:cid,:vers,:did,:filepath,:filename,:extension,:mime,:kind,:seq,now());");
				
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
				
				if(!$query->execute()) {
					$error=$query->errorInfo();
					echo "Error updating file entries".$error[2];
				}			 				

		}else if($link!="UNK"){
				if (checkLinkValidity($link)) {
					$query = $pdo->prepare("SELECT COUNT(*) AS Dusty FROM submission WHERE uid=:uid AND did=:did AND filepath=:fname AND cid=:cid;", array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));  
					$query->bindParam(':uid', $userid);
					$query->bindParam(':did', $duggaid);
					$query->bindParam(':cid', $cid);
					$query->bindParam(':fname', $link);
					$query->execute();
					foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
								$seq=$row['Dusty']+1;
					}			

					$query = $pdo->prepare("INSERT INTO submission(fieldnme,uid,cid,vers,did,filepath,filename,extension,mime,kind,seq,updtime) VALUES(:field,:uid,:cid,:vers,:did,:filepath,null,null,null,:kind,:seq,now());");
					
				
					$query->bindParam(':uid', $userid);
					$query->bindParam(':cid', $cid);
					$query->bindParam(':vers', $vers);
					$query->bindParam(':did', $duggaid);
					$query->bindParam(':filepath', $link);
					$query->bindParam(':field', $fieldtype);
					$query->bindParam(':kind', $fieldkind);
					$query->bindParam(':seq', $seq);
					
					if(!$query->execute()) {
						$error=$query->errorInfo();
						echo "Error updating file entries".$error[2];
					}	
				}
				else{
					$error = true;
					echo "invalid link, http:// or https:// must be present.";
				}
						 				
		}else{
				// chdir('../'); 
								
				//  if the file is of valid type and it doesn't exists in the db, add a row into the db
				$allowedT = array("application/x-msdownload","application/x-pdf ","application/pdf","application/x-rar-compressed","application/zip", "application/octet-stream","application/force-download","application/x-download", "application/x-zip-compressed", "binary/octet-stream");
				$allowedX = array("pdf","zip","rar");
				//type of filesubmit,eg. if its from the pdf-submit, only allow pdf.
				if (type === "pdf") {
					$allowedX = array("pdf");
					$allowedT = array("application/x-pdf ","application/pdf");
				}
				else if (type == "zip") {
					$allowedX = array("zip","rar");
					$allowedT = array("application/x-rar-compressed","application/zip","application/x-zip-compressed");
				}

				
				$swizzled = swizzleArray($_FILES['uploadedfile']);
				
				foreach ($swizzled as $key => $filea){
					
						//  if the file has a name (e.g it is successfully sent to "filereceive.php") begin the upload process.
						if($filea["name"]!=""){
								$fname=$filea['name'];
		
								// Remove white space and non ascii characters
								$fname=preg_replace('/[[:^print:]]/', '', $fname);
								$fname = preg_replace('/\s+/', '', $fname); 
		
								
								$posPeriod = strrpos($fname, ".");
								if ($posPeriod !== false){
									$extension = substr($fname, $posPeriod+1);
									$fname = substr($fname, 0, $posPeriod);								
								} else {
									$extension = "UNK";
								}
				
								if(in_array($extension, $allowedX)&&in_array($filea['type'], $allowedT)){ 
										//  if file type is allowed, continue the uploading process.
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
		
														$query = $pdo->prepare("INSERT INTO submission(fieldnme,uid,cid,vers,did,filepath,filename,extension,mime,kind,seq,updtime) VALUES(:field,:uid,:cid,:vers,:did,:filepath,:filename,:extension,:mime,:kind,:seq,now());");
														
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
									if(!in_array($extension, $allowedX)) echo "Extension ".$extension." not allowed.\n";
									if(!in_array($filea['type'], $allowedT)) echo "Type ".$filea['type']." not allowed.\n";
									$error=true;
								}
						}
				}						

		}

}
	
if(!$error){
		echo "<meta http-equiv='refresh' content='0;URL=showDugga.php?cid=".$cid."&coursevers=".$vers."&did=".$duggaid."&moment=".$moment."&segment=".$segment."&highscoremode=0' />";  //update page, redirect to "fileed.php" with the variables sent for course id and version id
}


function checkLinkValidity($link){
	if ( strpos($data, 'http://') !== 0 && strpos($data, 'https://') !== 0 ) {
			return false;
		}
	else
		return true;

}


?>
</head>
<body>
<?php
if(!$error){
		echo "<script>window.gocation.replace('showDugga.php?cid=".$cid."&coursevers=".$vers."&did=".$duggaid."&moment=".$moment."&segment=".$segment."&highscoremode=0');</script>"; //update page, redirect to "fileed.php" with the variables sent for course id and version id
}else{
		echo $error;
}
?>
</body>
</html>
