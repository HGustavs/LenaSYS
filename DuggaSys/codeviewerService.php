<?php

	//----------------------------------------------------------------------------------
	// TODO:
	//	78: Better handle a situation where there are no examples available
	//	84: Redundant? Is set a couple of rows above
	//	106: Check what viktig is and what it's for
	//	107: Should only bind with the file used (if used) and not to one by default
	//	128: Check for better way to get and set before/afterId
	//	Change variables to a fitting or standardized manner:
	//		forward_examples
	//		currid
	//		backward_examples
	//		boxcontent
	//	Comment and document functions/statements that seems non-self explanatory
	//---------------------------------------------------------------------------------------------------------------
	// editorService - Saves and Reads content for Code Editor
	//---------------------------------------------------------------------------------------------------------------

	date_default_timezone_set("Europe/Stockholm");

	// Include basic application services
	include_once ("../../coursesyspw.php");
	include_once ("../Shared/sessions.php");
	include_once ("../Shared/basic.php");
	include_once ("../Shared/courses.php");
	include_once ("../Shared/database.php");

	// Connect to database and start session
	pdoConnect();
	session_start();

	// Global variables
	$exampleId=getOP('exampleid');
	$boxId=getOP('boxid');
	$opt=getOP('opt');
	$courseId=getOP('courseid');
	$courseVersion=getOP('cvers');
	$templateNumber=getOP('templateno');
	$beforeId=getOP('beforeid');
	$afterId=getOP('afterid');
	$sectionName=getOP('sectionname');
	$exampleName=getOP('examplename');
	$playlink=getOP('playlink');
	$debug="NONE!";
	// Checks user id, if user has none a guest id is set
	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="1";
	}

	$log_uuid = getOP('log_uuid');
	$log_timestamp = getOP('log_timestamp');

	$log_uuid = getOP('log_uuid');
	$info=$opt." ".$courseId." ".$courseVersion." ".$exampleName." ".$sectionName." ".$exampleId;
	logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "codeviewerService.php",$userid,$info);

	// Checks and sets user rights
	if(checklogin() && (hasAccess($userid, $courseId, 'w'))){
		$writeAccess="w";
	}else{
		$writeAccess="s";
	}
	$appuser=(array_key_exists('uid', $_SESSION) ? $_SESSION['uid'] : 0);

	$exampleCount = 0;

  $query = $pdo->prepare( "SELECT exampleid,sectionname,examplename,runlink,cid,cversion,beforeid,afterid,public FROM codeexample WHERE exampleid = :exampleid;");
  $query->bindParam(':exampleid', $exampleId);
	$query->execute();

	while ($row = $query->fetch(PDO::FETCH_ASSOC)){
		$exampleCount++;
		$exampleId=$row['exampleid'];
		$exampleName=$row['examplename'];
		$courseID=$row['cid'];
		$cversion=$row['cversion'];
		$beforeId=$row['beforeid'];
		$afterId=$row['afterid'];
		$public=$row['public'];
		$sectionName=$row['sectionname'];
		$playlink=$row['runlink'];
	}

	// TODO: Better handle a situation where there are no examples available
	if($exampleCount>0){
		//------------------------------------------------------------------------------------------------
		// Perform Update Action
		//------------------------------------------------------------------------------------------------
		if(checklogin() && (hasAccess($_SESSION['uid'], $courseId, 'w') || isSuperUser($_SESSION['uid']))) {
			$writeAccess="w"; // TODO: Redundant? Is set a couple of rows above
			if(strcmp('SETTEMPL',$opt)===0){
				// Parse content array
				$content = getOP('content');
				$cArray = explode(',', $content);
				$multiArray = array_chunk($cArray, 3);

				$query = $pdo->prepare( "UPDATE codeexample SET templateid = :templateno WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
				$query->bindParam(':templateno', $templateNumber);
				$query->bindParam(':exampleid', $exampleId);
				$query->bindParam(':cid', $courseId);
				$query->bindParam(':cvers', $courseVersion);

				// Update code example to reflect change of template
				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug.="Error updating code example: ".$error[2];
				}

				// There are at least two boxes, create two boxes to start with
				if($templateNumber==10) $boxCount=1;
				if($templateNumber==1||$templateNumber==2) $boxCount=2;
				if($templateNumber==3||$templateNumber==4 ||$templateNumber==8) $boxCount=3;
				if($templateNumber==5||$templateNumber==6 ||$templateNumber==7) $boxCount=4;
				if($templateNumber==9) $boxCount=5;

				// Create appropriate number of boxes
				for($i=1;$i<$boxCount+1;$i++){
						$kind = $multiArray[$i-1][0];
						$file = $multiArray[$i-1][1];
						$wordlist = $multiArray[$i-1][2];

						// Create boxes, if some box does not exist
						$query = $pdo->prepare("INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename,wordlistid) VALUES (:i,:exampleid, :boxtitle, :boxcontent, :settings, :filename, :wordlistid);");

						$query->bindParam(':i', $i);
						$query->bindParam(':exampleid', $exampleId);
						$query->bindValue(':boxtitle', 'Title');
						$query->bindValue(':boxcontent', $kind);
						$query->bindValue(':settings', '[viktig=1]'); //TODO: Check what viktig is and what it's for
						$query->bindValue(':filename', $file); 
						$query->bindValue(':wordlistid', $wordlist);

						// Update code example to reflect change of template
						if(!$query->execute()) {
							$error=$query->errorInfo();

							// If we get duplicate key error message, ignore error, otherwise carry on adding to debug message
							if(strpos($error[2],"Duplicate entry")==-1) $debug.="Error creating new box: ".$error[2];

						}
				}
			}else if(strcmp('EDITEXAMPLE',$opt)===0){
				if(isset($_POST['playlink'])) {$playlink = $_POST['playlink'];}
				if(isset($_POST['examplename'])) {$exampleName = $_POST['examplename'];}
				if(isset($_POST['sectionname'])) {$sectionName = $_POST['sectionname'];}
				if(isset($_POST['beforeid'])) {$beforeId = $_POST['beforeid'];}
				if(isset($_POST['afterid'])) {$afterId = $_POST['afterid'];}

				// Change content of example
				$query = $pdo->prepare( "UPDATE codeexample SET runlink = :playlink , examplename = :examplename, sectionname = :sectionname WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
				$query->bindParam(':playlink', $playlink);
				$query->bindParam(':examplename', $exampleName);
				$query->bindParam(':sectionname', $sectionName);
				$query->bindParam(':exampleid', $exampleId);
				$query->bindParam(':cid', $courseId);
				$query->bindParam(':cvers', $courseVersion);
				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug.="Error updaring example: ".$error[2]." ".__LINE__;
				}

				// TODO: Check for better way to get and set before/afterId
				if($beforeId!="UNK"){
					$query = $pdo->prepare( "UPDATE codeexample SET beforeid = :beforeid WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
					$query->bindParam(':beforeid', $beforeId);
					$query->bindParam(':exampleid', $exampleId);
					$query->bindParam(':cid', $courseId);
					$query->bindParam(':cvers', $courseVersion);
					if(!$query->execute()) {
						$error=$query->errorInfo();
						$debug.="Error updaring example: ".$error[2]." ".__LINE__;
					}
				}
				if($afterId!="UNK"){
					$query = $pdo->prepare( "UPDATE codeexample SET afterid = :afterid WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
					$query->bindParam(':afterid', $afterId);
					$query->bindParam(':exampleid', $exampleId);
					$query->bindParam(':cid', $courseId);
					$query->bindParam(':cvers', $courseVersion);
					if(!$query->execute()) {
						$error=$query->errorInfo();
						$debug.="Error updaring example: ".$error[2]." ".__LINE__;
					}
				}
				if(isset($_POST['addedWords'])) {
					// Converts to array
					$addedWords = explode(",",$_POST['addedWords']);

					// Loops through the array of added words and inserts them one by one.
					foreach ($addedWords as $word) {
						$query = $pdo->prepare("INSERT INTO impwordlist(exampleid,word,uid) VALUES (:exampleid,:word,:uid);");
						$query->bindParam(':exampleid', $exampleId);
						$query->bindParam(':word', $word);
						$query->bindParam(':uid', $_SESSION['uid']);
						if(!$query->execute()) {
							$error=$query->errorInfo();
							$debug.="Error updaring example: ".$error[2]." ".__LINE__;
						}
					}
				}
				if(isset($_POST['removedWords'])) {
					// Converts to array
					$removedWords = explode(",",$_POST['removedWords']);

					// Loops through the array of removed words and deletes them one by one.
					foreach ($removedWords as $word) {
						$query = $pdo->prepare("DELETE FROM impwordlist WHERE word=:word AND exampleid=:exampleid;");
						$query->bindParam(':exampleid', $exampleId);
						$query->bindParam(':word', $word);
						if(!$query->execute()) {
							$error=$query->errorInfo();
							$debug.="Error deleting impword: ".$error[2]." ".__LINE__;
						}
					}
				}
			}else if(strcmp('EDITCONTENT',$opt)===0) {
				$exampleId = $_POST['exampleid'];
				$boxId = $_POST['boxid'];
				$boxTitle = $_POST['boxtitle'];
				$boxContent = $_POST['boxcontent'];
				$wordlist = $_POST['wordlist'];
				$filename = $_POST['filename'];
				$fontsize = $_POST['fontsize'];
				$addedRows = $_POST['addedRows'];
				$removedRows = $_POST['removedRows'];

				$query = $pdo->prepare("UPDATE box SET boxtitle=:boxtitle, boxcontent=:boxcontent, filename=:filename, fontsize=:fontsize, wordlistid=:wordlist WHERE boxid=:boxid AND exampleid=:exampleid;");
				$query->bindParam(':boxtitle', $boxTitle);
				$query->bindParam(':boxcontent', $boxContent);
				$query->bindParam(':wordlist', $wordlist);
				$query->bindParam(':filename', $filename);
				$query->bindParam(':fontsize', $fontsize);
				$query->bindParam(':boxid', $boxId);
				$query->bindParam(':exampleid', $exampleId);
				$query->execute();

				if (isset($_POST['addedRows'])) {
					preg_match_all("/\[(.*?)\]/", $addedRows, $matches, PREG_PATTERN_ORDER);
					foreach ($matches[1] as $match) {
						$row = explode(",", $match);
						$query = $pdo->prepare("INSERT INTO improw(boxid,exampleid,istart,iend,uid) VALUES (:boxid,:exampleid,:istart,:iend,:uid);");
						$query->bindValue(':boxid', $boxId);
						$query->bindValue(':exampleid', $exampleId);
						$query->bindValue(':istart', $row[1]);
						$query->bindValue(':iend', $row[2]);
						$query->bindValue(':uid', $_SESSION['uid']);
						$query->execute();
					}
				}

				if (isset($_POST['removedRows'])) {
					preg_match_all("/\[(.*?)\]/", $removedRows, $matches, PREG_PATTERN_ORDER);
					foreach ($matches[1] as $match) {
						$row = explode(",", $match);
						$query = $pdo->prepare("DELETE FROM improw WHERE boxid=:boxid AND istart=:istart AND iend=:iend AND exampleid=:exampleid;");
						$query->bindValue(':boxid', $boxId);
						$query->bindValue(':exampleid', $exampleId);
						$query->bindValue(':istart', $row[1]);
						$query->bindValue(':iend', $row[2]);
						$query->execute();
					}
				}
			}else if(strcmp('EDITTITLE',$opt)===0) {
				$exampleid = $_POST['exampleid'];
				$boxId = $_POST['boxid'];
				$boxTitle = $_POST['boxtitle'];

				$query = $pdo->prepare("UPDATE box SET boxtitle=:boxtitle WHERE boxid=:boxid AND exampleid=:exampleid;");
				$query->bindParam(':boxtitle', $boxTitle);
				$query->bindValue(':exampleid', $exampleId);
				$query->bindParam(':boxid', $boxId);
				$query->execute();

				echo json_encode($boxTitle);
				return;
			}
		}


		//------------------------------------------------------------------------------------------------
		// Retrieve Information
		//------------------------------------------------------------------------------------------------
		// Read exampleid, examplename and runlink etc from codeexample and template
		$exampleName="";
		$templateId="";
		$styleSheet="";
		$numBox="";
		$exampleNumber=0;
		$playlink="";
		$public="";
		$entryname="";

		$query = $pdo->prepare("SELECT exampleid, examplename, sectionname, runlink, public, template.templateid AS templateid, stylesheet, numbox FROM codeexample LEFT OUTER JOIN template ON template.templateid = codeexample.templateid WHERE exampleid = :exampleid AND cid = :courseID;");
		$query->bindParam(':exampleid', $exampleId);
		$query->bindParam(':courseID', $courseId);
		$query->execute();

		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			$exampleName=$row['examplename'];
			$exampleNumber=$row['exampleid'];
			$public=$row['public'];
			$playlink=$row['runlink'];
			$sectionName=$row['sectionname'];
			$templateId=$row['templateid'];
			$styleSheet=$row['stylesheet'];
			$numBox=$row['numbox'];
		}


		// Read ids and names from before/after list
		$beforeAfter = array();
		$beforeAfters = array();

		$query = $pdo->prepare( "SELECT exampleid, sectionname, examplename, beforeid, afterid FROM codeexample WHERE cid = :cid AND cversion = :cvers ORDER BY sectionname, examplename;");
		$query->bindParam(':cid', $courseId);
		$query->bindParam(':cvers', $courseVersion);
		$query->execute();

		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			$beforeAfter[$row['exampleid']]=array($row['exampleid'],$row['sectionname'],$row['examplename'],$row['beforeid'],$row['afterid']);
				array_push($beforeAfters,array($row['exampleid'],$row['sectionname'],$row['examplename'],$row['beforeid'],$row['afterid']));
		}

		// Iteration to find after examples - We start with $exampleId and at most 5 are collected
		$nextExampleCount = 0;
		$forwardExamples = array();
		$currentId=$exampleId;

		do{
			if(isset($beforeAfter[$currentId])){
				$currentId=$beforeAfter[$currentId][4];
			}else{
				$currentId=null;
			}
			if($currentId!=null){
				if(isset($beforeAfter[$currentId])) array_push($forwardExamples,$beforeAfter[$currentId]);
			}
			$nextExampleCount++;
		// Iteration to find before examples - We start with $exampleId and at most 5 are collected
		}while($currentId!=null&&$nextExampleCount<5);

		$backwardExamples = array();
		$currentId=$exampleId;
		$previousExamplesCount = 0;
		do{
			if(isset($beforeAfter[$currentId])){
				$currentId=$beforeAfter[$currentId][3];
			}else{
				$currentId=null;
			}
			if($currentId!=null){
				if(isset($beforeAfter[$currentId]))	array_push($backwardExamples,$beforeAfter[$currentId]);
			}
			$previousExamplesCount++;
		}while($currentId!=null&&$previousExamplesCount<5);

		// Read important lines
		$importantRows=array();
		$query = $pdo->prepare("SELECT boxid, istart, iend FROM improw WHERE exampleid = :exampleid ORDER BY istart;");
		$query->bindParam(':exampleid', $exampleId);
		$query->execute();

		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			array_push($importantRows,array($row['boxid'],$row['istart'],$row['iend']));
		}

		// Get all words for each wordlist
		$words = array();
		$query = $pdo->prepare( "SELECT wordlistid,word,label FROM word ORDER BY wordlistid");
		$query->execute();

		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			array_push($words,array($row['wordlistid'],$row['word'],$row['label']));
		}

		// Get all wordlists
		$wordLists=array();
		$query = $pdo->prepare( "SELECT wordlistid, wordlistname FROM wordlist ORDER BY wordlistid;");
		$query->execute();

		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			array_push($wordLists,array($row['wordlistid'],$row['wordlistname']));
		}

		// Read important wordlist
		$importantWordList=array();
		$query = $pdo->prepare( "SELECT word,label FROM impwordlist WHERE exampleid = :exampleid ORDER BY word;");
		$query->bindParam(':exampleid', $exampleId);
		$query->execute();

		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			array_push($importantWordList,$row['word']);
		}

		// Read file lists from database and add only .txt and .md to descdir

		$directories = array();
		$codeDir=array();
		$descDir=array();
		$prevDir=array();
		$query = $pdo->prepare("SELECT fileid,filename,kind FROM fileLink WHERE cid=:cid ORDER BY kind,filename");
		$query->bindParam(':cid', $courseId);

		// Allowed file extensions for each view. Just add an extension as a new string in the array to allow it.
		$codeFiles=array(".html", ".htm", ".xhtml", ".php", ".css", ".js", ".c", ".cpp", ".java", ".sl", ".glsl", ".rib", ".sql", ".xml", ".svg", ".rss", ".json", ".aspx", ".asp");	// File extensions for code view
		$descFiles=array(".txt", ".md", ".doc", ".docx", ".odt");	// File extensions for document view
		$prevFiles=array(".pdf", ".png", ".jpg", ".jpeg", ".svg", ".bmp", ".gif", ".html", ".txt");	// File extensions for preview view
		
		// We add only local files to code (no reading code from external sources) and allow preview to files or links.				
		if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading entries\n".$error[2];
		}
		$oldkind=2;
		foreach($query->fetchAll() as $row) {
				// Add separators to separate the current file from all the other files
				if($row['kind']!=$oldkind){
					array_push($codeDir,array('fileid' => -1,'filename' => "---===######===---"));
					array_push($descDir,array('fileid' => -1,'filename' => "---===######===---"));
					array_push($prevDir,array('fileid' => -1,'filename' => "---===######===---"));
				}
				$oldkind=$row['kind'];
				
				// List only .md, .txt, etc files for Document view
				foreach($descFiles as $filetype){
					if(endsWith($row['filename'],$filetype)){
						array_push($descDir,array('fileid' => $row['fileid'],'filename' => $row['filename']));			
					}
				}
				
				// List only .js, .css, .html, .c, .cpp, .xml, .sl, .rib, .glsl, .sql, etc files for Code view
				foreach($codeFiles as $filetype){
					if(endsWith($row['filename'],$filetype)){
						array_push($codeDir,array('fileid' => $row['fileid'],'filename' => $row['filename']));			
					}
				}

				// List only .pdf, .png, .jpg, .svg, etc for Preview view
				foreach($prevFiles as $filetype){
					if(endsWith($row['filename'],$filetype)){
						array_push($prevDir,array('fileid' => $row['fileid'],'filename' => $row['filename']));			
					}
				}
				//if($row['kind']!=1) array_push($codeDir,array('fileid' => $row['fileid'],'filename' => $row['filename']));
				//array_push($prevDir,array('fileid' => $row['fileid'],'filename' => $row['filename']));				
		}
		array_push($directories, $codeDir);
		array_push($directories, $descDir);
		array_push($directories, $prevDir);

		// Collects information for each box
		$box=array();
		// Array to be filled with the primary keys to all boxes of the example
		$queryy = $pdo->prepare("SELECT boxid, boxcontent, boxtitle, filename, wordlistid, segment, fontsize FROM box WHERE exampleid = :exampleid ORDER BY boxid;");
		$queryy->bindParam(':exampleid', $exampleId);

		if(!$queryy->execute()) {
			$error=$queryy->errorInfo();
			$debug="Error reading boxes \n".$error[2];
		}
		while ($row = $queryy->FETCH(PDO::FETCH_ASSOC)){
      $boxContent=strtoupper($row['boxcontent']);
			$filename=$row['filename'];
			$content="";

			$ruery = $pdo->prepare("SELECT filename,kind from fileLink WHERE (cid=:cid or isGlobal='1') and UPPER(filename)=UPPER(:fname) ORDER BY kind DESC LIMIT 1;");
			$ruery->bindParam(':cid', $courseId);
			$ruery->bindParam(':fname', $filename);
			$sesult = $ruery->execute();
			if($sow = $ruery->fetch(PDO::FETCH_ASSOC)){
					$filekind=$sow['kind'];
					$filename = $sow['filename'];

					if($filekind==2){
						// Global
						$file = "../courses/global/".$filename;
					}else if($filekind==3){
						// Course Local
						$file = "../courses/".$courseId."/".$filename;
					}else if($filekind==4){
						// Local
						$file = "../courses/".$courseId."/".$courseVersion."/".$filename;
					}else{
						$file = "UNK";
					}

					if(file_exists ($file)){
							$file_extension = strtolower(substr(strrchr($filename,"."),1));
							if(strcmp("DOCUMENT",$boxContent)===0){
									if($file_extension=="txt"||$file_extension=="md"){
											// It is a .txt or .md file that exists!
											$buffer=file_get_contents($file);
											$content=$content.$buffer;
									}else{
											$content.="File: ".$filename." is not correctly formatted.";
									}
							}else if(strcmp("IFRAME",$boxContent)===0){
									$content=$file;
							}else{
									$buffer=file_get_contents($file);
									$content=$content.$buffer;
							}
					}else{
							$content.="File: ".$file." not found.";
					}
					$ruery->closeCursor();
			}else{
					$content.="File: ".$filename." not found.";
			}

			array_push($box,array($row['boxid'],$boxContent,$content,$row['wordlistid'],$row['boxtitle'],$row['filename'], $row['fontsize']));
		}
		$array = array(
			'before' => $backwardExamples,
			'after' => $forwardExamples,
			'templateid' => $templateId,
			'stylesheet' => $styleSheet,
			'numbox' => $numBox,
			'box' => $box,
			'improws' => $importantRows,
			'impwords' => $importantWordList,
			'directory' => $directories,
			'examplename'=> $exampleName,
			'sectionname'=> $sectionName,
			'playlink' => $playlink,
			'exampleno' => $exampleNumber,
			'words' => $words,
			'wordlists' => $wordLists,
			'writeaccess' => $writeAccess,
			'debug' => $debug,
			'beforeafter' => $beforeAfters,
			'public' => $public,
            'courseid' => $courseId,
            'courseversion' => $courseVersion
		);
		echo json_encode($array);
	}else{
		$debug = "Debug: Error occur at line " . __LINE__ . " in file " . __FILE__ . ". There are no examples or the ID of example is incorrect.\n";
		$array = array(
		 	'debug' => $debug
		);
		echo json_encode($array);

	}

	logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "codeviewerService.php",$userid,$info);

?>
