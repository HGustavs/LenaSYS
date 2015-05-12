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
	// Checks and sets user rights
	if(checklogin() && (hasAccess($userid, $courseId, 'w'))){
		$writeAccess="w";
	}else{
		$writeAccess="s";	
	}
	$debug = "Debug: writeAccess = $writeAccess\n";
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
	$debug = $debug .' '. "Debug: beforeId/afterId = $beforeId/$afterId at line ". __LINE__ . ". \n";
	$debug = $debug .' '. "Debug: exampleCount = $exampleCount\n, if zero, there are no examples";
	// TODO: Better handle a situation where there are no examples available
	if($exampleCount>0){
		//------------------------------------------------------------------------------------------------
		// Perform Update Action
		//------------------------------------------------------------------------------------------------
		if(checklogin() && (hasAccess($_SESSION['uid'], $courseId, 'w') || isSuperUser($_SESSION['uid']))) {
			$writeAccess="w"; // TODO: Redundant? Is set a couple of rows above
			if(strcmp('SETTEMPL',$opt)===0){
				// Add word to wordlist
				$query = $pdo->prepare( "UPDATE codeexample SET templateid = :templateno WHERE exampleid = :exampleid and cid = :cid and cversion = :cvers;");		
				$query->bindParam(':templateno', $templateNumber);
				$query->bindParam(':exampleid', $exampleId);
				$query->bindParam(':cid', $courseId);
				$query->bindParam(':cversion', $courseVersion);
				$query->execute();
				
				// There are at least two boxes, create two boxes to start with
				if($templateNumber==1||$templateNumber==2) $boxCount=2;
				if($templateNumber==3||$templateNumber==4) $boxCount=3;
				if($templateNumber==5||$templateNumber==6) $boxCount=4;
				
				// Create appropriate number of boxes
				for($i=1;$i<$boxCount+1;$i++){
					$query = $pdo->prepare("INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename) VALUES (:i,:exampleid, :boxtitle, :boxcontent, :settings, :filename);");		
					$query->bindParam(':i', $i);
					$query->bindParam(':exampleid', $exampleId);
					$query->bindValue(':boxtitle', 'Title');
					$query->bindValue(':boxcontent', 'Code');
					$query->bindValue(':settings', '[viktig=1]'); //TODO: Check what viktig is and what it's for
					$query->bindValue(':filename', 'js1.js'); // TODO: Should only bind with the file used (if used) and not to one by default
					$query->execute();
				}	
			}else if(strcmp('EDITEXAMPLE',$opt)===0){
				if(isset($_POST['playlink'])) {$playlink = $_POST['playlink'];}
				if(isset($_POST['examplename'])) {$exampleName = $_POST['examplename'];}
				if(isset($_POST['sectionname'])) {$sectionName = $_POST['sectionname'];}
				if(isset($_POST['beforeid'])) {$beforeId = $_POST['beforeid'];}
				if(isset($_POST['afterid'])) {$afterId = $_POST['afterid'];}

				// Change content of example
				$query = $pdo->prepare( "UPDATE codeexample SET runlink = :playlink , examplename = :examplename, sectionname = :sectionname WHERE exampleid = :exampleid and cid = :cid and cversion = :cvers;");		
				$query->bindParam(':playlink', $playlink);
				$query->bindParam(':examplename', $exampleName);
				$query->bindParam(':sectionname', $sectionName);
				$query->bindParam(':exampleid', $exampleId);
				$query->bindParam(':cid', $courseId);
				$query->bindParam(':cvers', $courseVersion);
				$query->execute();
				
				// TODO: Check for better way to get and set before/afterId
				if($beforeId!="UNK"){
					$query = $pdo->prepare( "UPDATE codeexample SET beforeid = :beforeid WHERE exampleid = :exampleid and cid = :cid and cversion = :cvers;");		
					$query->bindParam(':beforeid', $beforeId);
					$query->bindParam(':exampleid', $exampleId);
					$query->bindParam(':cid', $courseId);
					$query->bindParam(':cvers', $courseVersion);
					$query->execute();
				}
				if($afterId!="UNK"){
					$query = $pdo->prepare( "UPDATE codeexample SET afterid = :afterid WHERE exampleid = :exampleid and cid = :cid and cversion = :cvers;");		
					$query->bindParam(':afterid', $afterId);
					$query->bindParam(':exampleid', $exampleId);
					$query->bindParam(':cid', $courseId);
					$query->bindParam(':cvers', $courseVersion);
					$query->execute();
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
						$query->execute();
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
						$query->execute();
					}
				}			
			}else if(strcmp('EDITCONTENT',$opt)===0) {
				$exampleId = $_POST['exampleid'];
				$boxId = $_POST['boxid'];
				$boxTitle = $_POST['boxtitle'];
				$boxContent = $_POST['boxcontent'];
				$wordlist = $_POST['wordlist'];
				$filename = $_POST['filename'];
				$addedRows = $_POST['addedRows'];
				$removedRows = $_POST['removedRows'];

				$query = $pdo->prepare("UPDATE box SET boxtitle=:boxtitle, boxcontent=:boxcontent, filename=:filename, wordlistid=:wordlist WHERE boxid=:boxid AND exampleid=:exampleid;");	
				$query->bindParam(':boxtitle', $boxTitle);
				$query->bindParam(':boxcontent', $boxContent);
				$query->bindParam(':wordlist', $wordlist);
				$query->bindParam(':filename', $filename);
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
		
		$query = $pdo->prepare("SELECT exampleid, examplename, sectionname, runlink, public, template.templateid as templateid, stylesheet, numbox FROM codeexample LEFT OUTER JOIN template ON template.templateid = codeexample.templateid WHERE exampleid = :exampleid and cid = :courseID;");		
		$query->bindParam(':exampleid', $exampleId);
		$query->bindParam(':courseID', $courseID);
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
		
		$query = $pdo->prepare( "select exampleid, sectionname, examplename, beforeid, afterid from codeexample order by exampleid");
		$query->execute();
	
		//SAVE THIS FOR FUTURE USE!!!!!
		//$query = $pdo->prepare( "select exampleid, sectionname, examplename, beforeid, afterid from codeexample where cid = :cid and cversion = :cvers order by sectionname, examplename;");
		//$query->bindParam(':cid', $cid);
		//$query->bindParam(':cvers', $courseVersion);
		//$query->execute();

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
				array_push($forwardExamples,$beforeAfter[$currentId]);
			}
			$nextExampleCount++;
		// Iteration to find before examples - We start with $exampleId and at most 5 are collected
		}while($currentId!=null&&$nextExampleCount<5);
		$debug= $debug . ' ' . "Debug: Nr upcoming examples found:  $nextExampleCount at line ". __LINE__ . ". \n";
		
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
				array_push($backwardExamples,$beforeAfter[$currentId]);
			}
			$previousExamplesCount++;
		}while($currentId!=null&&$previousExamplesCount<5);
		$debug= $debug . ' ' ."Debug: Nr previous examples found:  $previousExamplesCount at line " . __LINE__ . ". \n";
		
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
		
		$directories = array();
		
		// Read Directory - Codeexamples
		$codeDir=array();
		if(file_exists('./codeupload')){
			$dir = opendir('./codeupload');
			while (($file = readdir($dir)) !== false) {
				if(endsWith($file,".js") || endsWith($file,".html") || endsWith($file,".php") || endsWith($file,".css")){
					array_push($codeDir,$file);
				}
			}  
		}
		array_push($directories, $codeDir);

		// Read Directory - Description
		$descDir=array();
		if(file_exists('./descupload')){
			$dir = opendir('./descupload');
			while (($file = readdir($dir)) !== false) {
				if(endsWith($file,".txt")){
					array_push($descDir,$file);	
				}
			}  
		}
		array_push($directories, $descDir);

		$images=array();
		if(file_exists('./imgupload')){
			// Read Directory - Images
			$imgDir = opendir('./imgupload');
			while (($imgFile = readdir($imgDir)) !== false) {
				if(endsWith($imgFile,".png")){
					array_push($images,$imgFile);
				}
			}		
		}
	
		// Collect information for each box
		$box=array();   // Array to be filled with the primary keys to all boxes of the example
		$query = $pdo->prepare( "SELECT boxid, boxcontent, boxtitle, filename, wordlistid, segment FROM box WHERE exampleid = :exampleid ORDER BY boxid;");
		$query->bindParam(':exampleid', $exampleId);
		$query->execute();

		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			$boxContent=strtoupper($row['boxcontent']);
			$filename=$row['filename'];
			$content="";					
			if(strcmp("DOCUMENT",$boxContent)===0){
				if(file_exists('./descupload')){
					$filename="./descupload/".$filename;
					$handle = @fopen($filename, "r");
					if ($handle) {
						while (($buffer = fgets($handle, 1024)) !== false) {
							$content=$content.$buffer;
						}
						if (!feof($handle)) {
							$content.="Error: Unexpected end of file ".$descFilename."\n";			    			    
						}
						fclose($handle);
					}
				}
			//If box is not of Document type, code is assumed
			}else{
				if(file_exists('./codeupload')){
					$filename="./codeupload/".$filename;
					$handle = @fopen($filename, "r");
					if ($handle) {
						while (($buffer = fgets($handle, 1024)) !== false) {
							$content=$content.$buffer;
						}
						if (!feof($handle)) {
							$content.="Error: Unexpected end of file ".$filename."\n";
						}
						fclose($handle);
					}
				}else{
					$content="No file found!";
				}
			}
			array_push($box,array($row['boxid'],$boxContent,$content,$row['wordlistid'],$row['boxtitle'],$row['filename']));
		}
		$debug = $debug . "File : " . __FILE__ . ". \n";
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
			'images' => $images,
			'writeaccess' => $writeAccess,
			'debug' => $debug,
			'beforeafter' => $beforeAfters, 
			'public' => $public
		);
		echo json_encode($array);
	}else{
		$debug = "Debug: Error occur at line " . __LINE__ . " in file " . __FILE__ . ". There are no examples or the ID of example is incorrect.\n";
		$array = array(
		 	'debug' => $debug
		);		
		echo json_encode($array);
	}
?>
