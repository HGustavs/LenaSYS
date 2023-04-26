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
$hash=getOP('hash');
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

if(	isset($_SESSION["submission-$cid-$vers-$duggaid-$moment"]) && 
	isset($_SESSION["submission-password-$cid-$vers-$duggaid-$moment"])){
		$hash=$_SESSION["submission-$cid-$vers-$duggaid-$moment"];
		$hashpwd=$_SESSION["submission-password-$cid-$vers-$duggaid-$moment"];
		$variant=$_SESSION["submission-variant-$cid-$vers-$duggaid-$moment"];

		// Make sure there is an assignment
		$query = $pdo->prepare("SELECT password,timesSubmitted,timesAccessed,grade from userAnswer WHERE hash=:hash;");
		$query->bindParam(':hash', $hash);			
		$query->execute();
		foreach($query->fetchAll() as $row){
			$grade = $row['grade'];
			$dbpwd = $row['password'];
			// $timesSubmitted = $row['timesSubmitted'];
			// $timesAccessed = $row['timesAccessed'];
		}

		if(isset($grade)&&($grade > 1)){
			//if grade equal G, VG, 3, 4, 5, or 6
			$debug="You have already passed this dugga. You are not required/allowed to submit anything new to this dugga.";
		}else if (isset($grade)&&($grade == 0)){
			// Assignment exist in db ... NOOP
		}else{
			// Assignment does not exist in db ... insert 
			$query = $pdo->prepare("INSERT INTO userAnswer(cid,quiz,vers,variant,moment,hash,password,timesSubmitted,timesAccessed,submitted) VALUES(:cid,:did,:coursevers,:variant,:moment,:hash,:password,1,1,now());");
			$query->bindParam(':cid', $cid);
			$query->bindParam(':coursevers', $vers);
			$query->bindParam(':did', $duggaid);
			$query->bindParam(':moment', $moment);
			$query->bindParam(':variant', $variant);
			$query->bindParam(':hash', $hash);
			$query->bindParam(':password', $hashpwd);
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error inserting variant (row ".__LINE__.") ".$query->rowCount()." row(s) were inserted. Error code: ".$error[2];
			}	
		}
}else{
	header("Location: ../errorpages/404.php");
	exit();	
}

// Gets username based on uid. USED FOR LOGGING
$query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query-> execute();

// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
while ($row = $query->fetch(PDO::FETCH_ASSOC)){
	$username = $row['username'];
}

//  Handle files! One by one  -- if all is ok add file name to database
//  login for user is successful & has either write access or is superuser
$filo=print_r($_FILES,true);
$info="cid: ".$cid." vers: ".$vers." moment: ".$moment." segment: ".$segment." duggaid: ".$duggaid." fieldtype: ".$fieldtype." fieldkind: ".$fieldkind." link: ".$link." filo: ".$filo;
$log_uuid= rand();
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "filereceive_dugga.php",$userid,$info);

// $ha = checklogin();
// if($ha){

		// Create folder if link textinput or file
		$currcvd=getcwd();
		$submissionpath=$currcvd."/../../submissions";
		if(!file_exists($submissionpath)) {
				if(!mkdir($submissionpath,0775,true)) {
						echo "Error creating folder: ".$submissionpath;
						$error=true;
				}
		}

		$submissionpath.="/".$cid;
		if(!file_exists ($submissionpath)){
				if(!mkdir($submissionpath,0775,true)){
						echo "Error creating folder: ".$submissionpath;
						$error=true;
				}
		}

		$submissionpath.="/".$vers;
		if(!file_exists ($submissionpath)){
				if(!mkdir($submissionpath,0775,true)){
						echo "Error creating folder: ".$submissionpath;
						$error=true;
				}
		}

		$submissionpath.="/".$duggaid;
		if(!file_exists ($submissionpath)){
				if(!mkdir($submissionpath,0775,true)){
						echo "Error creating folder: ".$submissionpath;
						$error=true;
				}
		}

		// Create a file area with format Lastname-Firstname-Login
		// Use hash if no userid exists.
		if($userid!="UNK"){
			$userdir = $lastname."_".$firstname."_".$loginname;
		}else if($userid=="UNK" && isset($hash)){
			$userdir=$hash;
		}else{
			$userdir="UNK";
		}

		// First replace a predefined list of national characters
		// Then replace any additional character that is not a-z, a number, period or underscore
		$national = array("&ouml;", "&Ouml;", "&auml;", "&Auml;", "&aring;", "&Aring;","&uuml;","&Uuml;");
		$nationalReplace = array("o", "O", "a", "A", "a", "A","u","U");
		$userdir = str_replace($national, $nationalReplace, $userdir);
		$userdir=preg_replace("/[^a-zA-Z0-9._]/", "", $userdir);

		$submissionpath.="/".$hash;
		if(!file_exists ($submissionpath)){
				if(!mkdir($submissionpath)){
						echo "Error creating folder: ".$submissionpath;
						$error=true;
				}
		}

		// For the time sheet dugga
		if($fieldtype === "timesheet"){
			// Format the input and save it as a txt file
			$formattedInput = formatTimeSheetInput();

			$fname=$fieldtype;
			$fname=preg_replace("/[^a-zA-Z0-9._]/", "", $fname);

			$extension="txt";
			$mime="txt";

			$query = $pdo->prepare("SELECT COUNT(*) AS Dusty FROM submission WHERE hash=:hash AND did=:did AND filename=:fname AND cid=:cid;", array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
			$query->bindParam(':did', $duggaid);
			$query->bindParam(':cid', $cid);
			$query->bindParam(':fname', $fname);
			$query->bindParam(':hash', $hash);
			if(!$query->execute()) {
				$error=$query->errorInfo();
				echo "Error reading submissions a".$error[2];
			}
			foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
						$seq=$row['Dusty'];
			}
			$seq++;

			$filepath=$submissionpath;
			$movname=$submissionpath."/".$fname.$seq.".".$extension;
			file_put_contents($movname, $formattedInput);

			// Save POST values in an array to loop over them
			$indexedPOST = array_values($_POST);
			$postEntries = count(preg_grep("/ts.+_\d+/", array_keys($_POST))) / 4;

			// Get start date of course
			$query=$pdo->prepare("SELECT startdate FROM vers WHERE cid=:cid AND vers=:vers LIMIT 1;");
			$query->bindParam(':cid', $cid);
			$query->bindParam(':vers', $vers);


			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading startdate".$error[2];
			} else {
				$row = $query->fetch(PDO::FETCH_ASSOC);
				$startdate = $row["startdate"];

				if ($startdate && $startdate !== 'NULL') {
					$startdate = substr($startdate, 0, 10);
				} else {
					$year = date("Y");
					$startdate = $year.'-04-01';
				}

				$weekend1 = date('Y-m-d', strtotime($startdate. ' + 7 days'));
				$weekend2 = date('Y-m-d', strtotime($startdate. ' + 14 days'));
				$weekend3 = date('Y-m-d', strtotime($startdate. ' + 21 days'));
				$weekend4 = date('Y-m-d', strtotime($startdate. ' + 28 days'));
				$weekend5 = date('Y-m-d', strtotime($startdate. ' + 35 days'));
				$weekend6 = date('Y-m-d', strtotime($startdate. ' + 42 days'));
				$weekend7 = date('Y-m-d', strtotime($startdate. ' + 49 days'));
				$weekend8 = date('Y-m-d', strtotime($startdate. ' + 56 days'));
				$weekend9 = date('Y-m-d', strtotime($startdate. ' + 63 days'));
				$weekend10 = date('Y-m-d', strtotime($startdate. ' + 70 days'));
			}
 
			for($entryIdx = 0; $entryIdx < $postEntries; $entryIdx++) {
				$date=$indexedPOST[0 + ($entryIdx * 4)];
				$type=$indexedPOST[1 + ($entryIdx * 4)];
				$ref=$indexedPOST[2 + ($entryIdx * 4)];
				$comment=$indexedPOST[3 + ($entryIdx * 4)];

				// Derive course week from date
				 switch (true) {
					case (($date >= $startdate) && ($date < $weekend1)):
					$week = 1;
					break;
					case (($date >= $weekend1) && ($date < $weekend2)):
					$week = 2;
					break;
					case (($date >= $weekend2) && ($date < $weekend3)):
					$week = 3;
					break;
					case (($date >= $weekend3) && ($date < $weekend4)):
					$week = 4;
					break;
					case (($date >= $weekend4) && ($date < $weekend5)):
					$week = 5;
					break;
					case (($date >= $weekend5) && ($date < $weekend6)):
					$week = 6;
					break;
					case (($date >= $weekend6) && ($date < $weekend7)):
					$week = 7;
					break;
					case (($date >= $weekend7) && ($date < $weekend8)):
					$week = 8;
					break;
					case (($date >= $weekend8) && ($date < $weekend9)):
					$week = 9;
					break;
					case (($date >= $weekend9) && ($date <= $weekend10)):
					$week = 10;
					break;
				} 

				$query = $pdo->prepare("INSERT INTO timesheet(uid, cid, did, vers, moment, day, week, type, reference, comment) VALUES(:uid,:cid,:did,:vers,:moment,:date,:week,:type,:reference,:comment);");
				$query->bindParam(':uid', $userid);
				$query->bindParam(':cid', $cid);
				$query->bindParam(':vers', $vers);
				$query->bindParam(':did', $duggaid);
				$query->bindParam(':moment', $moment);
				$query->bindParam(':date', $date);
				$query->bindParam(':week', $week);
				$query->bindParam(':type', $type);
				$query->bindParam(':reference', $ref);
				$query->bindParam(':comment', $comment);

				if(!$query->execute()) {
					$error=$query->errorInfo();
					echo "Error updating file entries".$error[2];
				}
			}

			$query = $pdo->prepare("INSERT INTO submission(fieldnme,cid,vers,did,filepath,filename,extension,mime,kind,seq,segment,updtime,hash) VALUES(:field,:cid,:vers,:did,:filepath,:filename,:extension,:mime,:kind,:seq,:segment,now(),:hash);");
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
			$query->bindParam(':hash', $hash);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				echo "Error updating file entries".$error[2];
			}
		} else if($inputtext!="UNK"){

				$fname=$fieldtype;
				$fname=preg_replace("/[^a-zA-Z0-9._]/", "", $fname);

				$extension="txt";
				$mime="txt";

				$query = $pdo->prepare("SELECT COUNT(*) AS Dusty FROM submission WHERE hash=:hash AND did=:did AND filename=:fname AND cid=:cid;", array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
				$query->bindParam(':did', $duggaid);
				$query->bindParam(':cid', $cid);
				$query->bindParam(':fname', $fname);
				$query->bindParam(':hash', $hash);
				if(!$query->execute()) {
					$error=$query->errorInfo();
					echo "Error reading submissions a".$error[2];
				}
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
							$seq=$row['Dusty'];
				}
				$seq++;

				$filepath=$submissionpath;
				if ($fieldkind == 4) {
					$extension = "json";
					$mime = "json";
				}
				$movname=$submissionpath."/".$fname.$seq.".".$extension;

				if ($fieldkind == 4){ // JSON-data
					file_put_contents($movname, $inputtext);
				}else{
					file_put_contents($movname, htmlentities($inputtext, ENT_QUOTES | ENT_IGNORE, "UTF-8"));
				}

				$query = $pdo->prepare("INSERT INTO submission(fieldnme,cid,vers,did,filepath,filename,extension,mime,kind,seq,segment,updtime,hash) VALUES(:field,:cid,:vers,:did,:filepath,:filename,:extension,:mime,:kind,:seq,:segment,now(),:hash);");

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
				$query->bindParam(':hash', $hash);

				if(!$query->execute()) {
					$error=$query->errorInfo();
					echo "Error updating file entries".$error[2];
				}

		}else if($link!="UNK"){
				// Create a MD5 hash from url to use as file marker - used when giving responsible
				$md5_filename = md5 ( $link );
				$query = $pdo->prepare("SELECT COUNT(*) AS Dusty FROM submission WHERE hash=:hash AND did=:did AND filename=:fname AND cid=:cid;", array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
				$query->bindParam(':hash', $hash);
				$query->bindParam(':did', $duggaid);
				$query->bindParam(':cid', $cid);
				$query->bindParam(':fname', $md5_filename);
				$query->execute();
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
							$seq=$row['Dusty'];
				}
				$seq++;

				$filepath=$submissionpath."/";

				$movname = $submissionpath."/".$md5_filename.$seq;
				file_put_contents($movname, $link);

				$query = $pdo->prepare("INSERT INTO submission(fieldnme,cid,vers,did,filepath,filename,extension,mime,kind,seq,segment,updtime,hash) VALUES(:field,:cid,:vers,:did,:filepath,:filename,null,null,:kind,:seq,:segment,now(),:hash);");

				$query->bindParam(':cid', $cid);
				$query->bindParam(':vers', $vers);
				$query->bindParam(':did', $duggaid);
				$query->bindParam(':filepath', $filepath);
				$query->bindParam(':filename', $md5_filename);
				$query->bindParam(':field', $fieldtype);
				$query->bindParam(':kind', $fieldkind);
				$query->bindParam(':seq', $seq);
				$query->bindParam(':segment', $moment);
				$query->bindParam(':hash', $hash);

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
					"rar"		=> ["application/x-rar"]
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
										$query = $pdo->prepare("SELECT COUNT(*) AS Dusty FROM submission WHERE hash=:hash AND did=:did AND filename=:fname AND cid=:cid;", array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
										$query->bindParam(':did', $duggaid);
										$query->bindParam(':cid', $cid);
										$query->bindParam(':fname', $fname);
										$query->bindParam(':hash', $hash);
										$query->execute();
										foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
													$seq=$row['Dusty']+1;
										}

									  $movname=$submissionpath."/".$fname.$seq.".".$extension;

										// check if upload is successful
										if(move_uploaded_file($filea["tmp_name"],$movname)){

														$query = $pdo->prepare("INSERT INTO submission(fieldnme,cid,vers,did,filepath,filename,extension,mime,kind,seq,segment,updtime,hash) VALUES(:field,:cid,:vers,:did,:filepath,:filename,:extension,:mime,:kind,:seq,:segment,now(),:hash);");

														$filepath=$submissionpath."/";

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
														$query->bindParam(':hash', $hash);

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
                         $discription = $filetype." ".$fname;
                         //logUserEvent($userid, $username, EventTypes::DuggaFileupload,$discription);
												 logUserEvent($userid, $hash, EventTypes::DuggaFileupload,$discription);
						}
				}

		}

// }

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "filereceive_dugga.php", $userid,$info);
/* Commenting this out because error should be displayed in showDugga, so redirect regardless of whether or not the file extension is allowed.
if(!$error){
		echo "<meta http-equiv='refresh' content='0;URL=showDugga.php?cid=".$cid."&coursevers=".$vers."&did=".$duggaid."&moment=".$moment."&segment=".$segment."&highscoremode=0' />";  //update page, redirect to "fileed.php" with the variables sent for course id and version id
}*/

//Sets hasUploaded variable so we do not get prompted for password when we upload a file.
//$_SESSION['hasUploaded'] = 1;
//echo "<meta http-equiv='refresh' content='0;URL=showDugga.php?courseid=".$cid."&coursevers=".$vers."&did=".$duggaid."&moment=".$moment."&segment=".$segment."&highscoremode=0&cid=".$cid."&hash=".$hash."' />";  //update page, redirect to "showDugga.php" with the variables sent for course id and version id and extension
//echo "{$link}|<br>";
//echo "{$movname}|<br>";
//echo "{$hash}|";
//echo "{$hashpwd}|";
//echo "{$variant}|<br>";
header("Location: /sh/?s=$hash");
exit();	


function formatTimeSheetInput(){
	$inputString = "";
	$indexedPOST = array_values($_POST);
	$entries = count(preg_grep("/ts.+_\d+/", array_keys($_POST))) / 4;
	for($entryIdx = 0; $entryIdx < $entries; $entryIdx++) {
		$date=$indexedPOST[0 + ($entryIdx * 4)];
		$type=$indexedPOST[1 + ($entryIdx * 4)];
		$ref=$indexedPOST[2 + ($entryIdx * 4)];
		$comment=$indexedPOST[3 + ($entryIdx * 4)];

		$inputString .= $date." - ".$type." #".$ref.": ".$comment."\n";
	}

	return $inputString;
}
?>
