<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
//---------------------------------------
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect(); 
session_start();

// TODO 

function processDuggaFiles()
{
	global $courseid;
	global $coursevers;
	global $duggaid;
	global $duggainfo;
	global $files;
	global $moment;
	global $pdo;
	$files= array();

	if(	isset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]) && 
	isset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]) && 
	isset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"])){

	$tmphash=$_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"];
	$tmphashpwd=$_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"];
	$tmpvariant=$_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"];
	
	$query = $pdo->prepare("SELECT subid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment,hash from submission WHERE hash=:hash ORDER BY subid,fieldnme,updtime asc;");  
	$query->bindParam(':hash', $tmphash);
	$result = $query->execute();
	$rows = $query->fetchAll();
	
	//if the hash didn't work and the user is a superuser then retrive all submissions
	if(isSuperUser($_SESSION['uid']) && $rows == NULL){
		$query = $pdo->prepare("SELECT subid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment,hash from submission WHERE segment=:moment ORDER BY subid,fieldnme,updtime asc;");  
		$query->bindParam(':moment', $moment);
		$result = $query->execute();
		$rows = $query->fetchAll();
	}
	//if the hash worked or the user was not a superuser then retrive the submission
	
	// Store current day in string
	$today = date("Y-m-d H:i:s");
	
	foreach($rows as $row) {
			
			$content = "UNK";
			$feedback = "UNK";
			$zipdir = "";
			$zip = new ZipArchive;
			$currcvd=getcwd();
			

			$ziptemp = $row['filepath'].$row['filename'].$row['seq'].".".$row['extension'];
			
			if(!file_exists($ziptemp)) {
				$isFileSubmitted = false;
				$zipdir="UNK";
			}else{	
				$isFileSubmitted = true; 		
				if ($zip->open($ziptemp) == TRUE) {
					for ($i = 0; $i < $zip->numFiles; $i++) {
						$zipdir .= $zip->getNameIndex($i).'<br />';
					}
				}
			}
						
			$fedbname=$row['filepath'].$row['filename'].$row['seq']."_FB.txt";				
			if(!file_exists($fedbname)) {
					$feedback="UNK";
			} else {
				if($today > $duggainfo['qrelease']  || is_null($duggainfo['qrelease'])){
					$feedback=file_get_contents($fedbname);				
				}
			}			
			
			if($row['kind']=="3"){
					// Read file contents
					$movname=$row['filepath']."/".$row['filename'].$row['seq'].".".$row['extension'];

					if(!file_exists($movname)) {
							$content="UNK!";
					} else {
							$content=file_get_contents($movname);
					}
			}	else if($row['kind']=="2"){
					// File content is an URL
					$movname=$row['filepath']."/".$row['filename'].$row['seq'];
	
					if(!file_exists($movname)) {
							$content="UNK URL!";
					} else {
							$content=file_get_contents($movname);
					}
			}else{
					$content="Not a text-submit or URL";
			}
			
			$entry = array(
				'subid' => $row['subid'],
				'vers' => $row['vers'],
				'did' => $row['did'],
				'fieldnme' => $row['fieldnme'],
				'filename' => $row['filename'],	
				'filepath' => $row['filepath'],	
				'extension' => $row['extension'],
				'mime' => $row['mime'],
				'updtime' => $row['updtime'],
				'kind' => $row['kind'],	
				'seq' => $row['seq'],	
				'segment' => $row['segment'],	
				'content' => $content,
				'feedback' => $feedback,
				'username' => $$tmphash,
				'zipdir' => $zipdir
			);
			
			// If the filednme key isn't set, create it now
			 if (!isset($files[$row['segment']])) $files[$row['segment']] = array();
	
			array_push($files[$row['segment']], $entry);	
		}

	}
	if (sizeof($files) === 0) {$files = (object)array();} // Force data type to be object

}

// Self notes:
// The references of processDuggaFiles() inside showDuggaservice.php
/*
1. 
if(isset($variant)){
    $_SESSION["submission-$courseid-$newcoursevers-$newduggaid"]=$hash;
    $_SESSION["submission-password-$courseid-$newcoursevers-$newduggaid"]=$hashpwd;
    $_SESSION["submission-variant-$courseid-$newcoursevers-$newduggaid"]=$variant;
    $link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "https") . "://$_SERVER[HTTP_HOST]/sh/?s=$hash";
    processDuggaFiles();
}else{
    $debug="[Superuser] Could not load dugga! no userAnswer entries with moment: $moment \nline 338 showDuggaservice.php";
    $variant="UNK";
    $answer="UNK";
    $variantanswer="UNK";
    $param=html_entity_decode('{}');
}
2.
if(isset($variant)){
    $_SESSION["submission-$courseid-$newcoursevers-$newduggaid"]=$hash;
    $_SESSION["submission-password-$courseid-$newcoursevers-$newduggaid"]=$hashpwd;
    $_SESSION["submission-variant-$courseid-$newcoursevers-$newduggaid"]=$variant;
    $link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "https") . "://$_SERVER[HTTP_HOST]/sh/?s=$hash";
    processDuggaFiles();
}else{
    $debug="[Guest] Could not load dugga! Incorrect hash/password submitted! $hash/$hashpwd";
    $variant="UNK";
    $answer="UNK";
    $variantanswer="UNK";
    $param=html_entity_decode('{}');
}
3.
if(isset($param)){
    processDuggaFiles();
} else {
    $debug="[Guest] Missing hash/password/variant! Not found in db.";
    $variant="UNK";
    $answer="UNK";
    $variantanswer="UNK";
    $param=html_entity_decode('{}');
    unset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]);
    unset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]);
    unset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"]);	
}
4.
if(isset($param)) {
    processDuggaFiles();
} else {
    $debug="[Guest] Missing hash/password/variant! Not found in db.";
    $variant="UNK";
    $answer="UNK";
    $variantanswer="UNK";
    $param=html_entity_decode('{}');
    unset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]);
    unset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]);
    unset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"]);	
}

*/