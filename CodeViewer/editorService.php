<?php 
	//---------------------------------------------------------------------------------------------------------------
	// editorService - Saves and Reads content for Code Editor
	//---------------------------------------------------------------------------------------------------------------

	// Check if example exists and then do operation
	date_default_timezone_set("Europe/Stockholm");
	// Include basic application services!
	include_once ("../../coursesyspw.php");	
	include_once ("../Shared/sessions.php");
	include_once ("../Shared/basic.php");
	include_once ("../Shared/courses.php");
	include_once ("../Shared/database.php");
	// Connect to database and start session
	pdoConnect();
	session_start();
	$exampleId=getOP('exampleid');
	$boxId=getOP('boxid');
	$opt=getOP('opt');
	$courseId=getOP('courseid');
	$courseVersion=getOP('cvers');
	$templateNumber=getOP('templateno');
	$beforeId=getOP('beforeid');
	$afterId=getOP('afterid');
	$sectionName=getOP('sectionname');
	$examplename=getOP('examplename');
	$playlink=getOP('playlink');
	$debug="NONE!";	
	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="1";
	} 
	if(checklogin() && (hasAccess($userid, $courseId, 'w'))){
		$writeaccess="w";
	}else{
		$writeaccess="s";
	}
	$appuser=(array_key_exists('uid', $_SESSION) ? $_SESSION['uid'] : 0);
	// Make sure there is an example
	$cnt=0;
	$query = $pdo->prepare( "SELECT exampleid,sectionname,examplename,runlink,cid,cversion,public FROM codeexample WHERE exampleid = :exampleid;");
    $query->bindParam(':exampleid', $exampleId);
	$query -> execute();
	while ($row = $query->fetch(PDO::FETCH_ASSOC)){
		$cnt++;
		$exampleId=$row['exampleid'];
		$examplename=$row['examplename'];
		$courseID=$row['cid'];
		$courseVersionTmp=$row['cversion'];
		$public=$row['public'];
		$sectionName=$row['sectionname'];
		$playlink=$row['runlink'];
	}
	if($cnt>0){
		//------------------------------------------------------------------------------------------------
		// Perform Update Action
		//------------------------------------------------------------------------------------------------

		if(checklogin() && (hasAccess($_SESSION['uid'], $courseId, 'w') || isSuperUser($_SESSION['uid']))) {
			$writeaccess="w";
			if(strcmp('SETTEMPL',$opt)===0){
				// Add word to wordlist
				$query = $pdo->prepare( "UPDATE codeexample SET templateid = :templateno WHERE exampleid = :exampleid and cid = :cid and cversion = :cvers;");
				$query->bindParam(':templateno', $templateNumber);
				$query->bindParam(':exampleid', $exampleId);
				$query->bindParam(':cid', $courseId);
				$query->bindParam(':cversion', $courseVersion);
				$query -> execute();
				
				// We have two boxes. Create two boxes to start with
				if($templateNumber==1||$templateNumber==2) $boxcnt=2;
				if($templateNumber==3||$templateNumber==4) $boxcnt=3;
				if($templateNumber==5) $boxcnt=4;
				
				// Create appropriate number of boxes
				for($i=1;$i<$boxcnt+1;$i++){
					$query = $pdo->prepare("INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename) VALUES (:i,:exampleid, :boxtitle, :boxcontent, :settings, :filename);");		
					$query->bindParam(':i', $i);
					$query->bindParam(':exampleid', $exampleId);
					$query->bindValue(':boxtitle', 'Title');
					$query->bindValue(':boxcontent', 'Code');
					$query->bindValue(':settings', '[viktig=1]');
					$query->bindValue(':filename', 'js1.js');
					$query -> execute();
				}
			}else if(strcmp('EDITEXAMPLE',$opt)===0){

				if(isset($_POST['playlink'])) {$playlink = $_POST['playlink'];}
				if(isset($_POST['examplename'])) {$examplename = $_POST['examplename'];}
				if(isset($_POST['sectionname'])) {$sectionName = $_POST['sectionname'];}
				if(isset($_POST['beforeid'])) {$beforeId = $_POST['beforeid'];}
				if(isset($_POST['afterid'])) {$afterId = $_POST['afterid'];}

				// Change content of example
				$query = $pdo->prepare( "UPDATE codeexample SET runlink = :playlink , examplename = :examplename, sectionname = :sectionname WHERE exampleid = :exampleid and cid = :cid and cversion = :cvers;");		
				$query->bindParam(':playlink', $playlink);
				$query->bindParam(':examplename', $examplename);
				$query->bindParam(':sectionname', $sectionName);
				$query->bindParam(':exampleid', $exampleId);
				$query->bindParam(':cid', $courseId);
				$query->bindParam(':cvers', $courseVersion);
				$query -> execute();

				// Is there a better way to set beforeid and afterid?
				if($beforeId!="UNK"){
						$query = $pdo->prepare( "UPDATE codeexample SET beforeid = :beforeid WHERE exampleid = :exampleid and cid = :cid and cversion = :cvers;");		
						$query->bindParam(':beforeid', $beforeid);
						$query->bindParam(':exampleid', $exampleId);
						$query->bindParam(':cid', $courseId);
						$query->bindParam(':cvers', $courseVersion);
						$query -> execute();
				}
				if($afterId!="UNK"){
						
						$query = $pdo->prepare( "UPDATE codeexample SET afterid = :afterid WHERE exampleid = :exampleid and cid = :cid and cversion = :cvers;");		
						$query->bindParam(':afterid', $afterId);
						$query->bindParam(':exampleid', $exampleId);
						$query->bindParam(':cid', $courseId);
						$query->bindParam(':cvers', $courseVersion);
						$query -> execute();
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
			}
		}
		//------------------------------------------------------------------------------------------------
		// Retrieve Information			
		//------------------------------------------------------------------------------------------------	
			
		// Read exampleid, examplename and runlink etc from codeexample and template
		$examplename="";
		$templateid="";
		$stylesheet="";
		$numbox="";
		$exampleno=0;
		$playlink="";
		$public="";
		$entryname="";
		
		$query = $pdo->prepare("SELECT exampleid, examplename, sectionname, runlink, public, template.templateid as templateid, stylesheet, numbox FROM codeexample LEFT OUTER JOIN template ON template.templateid = codeexample.templateid WHERE exampleid = :exampleid and cid = :courseID;");		
		$query->bindParam(':exampleid', $exampleId);
		$query->bindParam(':courseID', $courseID);
		$query->execute();

		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			$examplename=$row['examplename'];
			$exampleno=$row['exampleid'];
			$public=$row['public'];
			$playlink=$row['runlink'];
			$sectionName=$row['sectionname'];
			$templateid=$row['templateid'];
			$stylesheet=$row['stylesheet'];
			$numbox=$row['numbox'];					
		}
		
		// Read ids and names from before/after list
		$beforeafter = array();
		$beforeafters = array();
		
		$query = $pdo->prepare( "select exampleid, sectionname, examplename, beforeid, afterid from codeexample where cid = :cid and cversion = :cvers order by sectionname, examplename;");
		$query->bindParam(':cid', $courseId);
		$query->bindParam(':cvers', $courseVersion);
		$query->execute();
	
		//SAVE THIS FOR FUTURE USE!!!!!
		//$query = $pdo->prepare( "select exampleid, sectionname, examplename, beforeid, afterid from codeexample where cid = :cid and cversion = :cvers order by sectionname, examplename;");
		//$query->bindParam(':cid', $cid);
		//$query->bindParam(':cvers', $cvers);
		//$query->execute();
					
		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			$beforeafter[$row['exampleid']]=array($row['exampleid'],$row['sectionname'],$row['examplename'],$row['beforeid'],$row['afterid']);
				array_push($beforeafters,array($row['exampleid'],$row['sectionname'],$row['examplename'],$row['beforeid'],$row['afterid']));
		}  

		// iteration to find after examples - We start with $exampleid and at most 5 are collected
		$cnt=0;
		$forward_examples = array();	
		$currid=$exampleId;
		do{
			if(isset($beforeafter[$currid])){
				$currid=$beforeafter[$currid][4];
			}else{
				$currid=null;
			}					
			if($currid!=null){
				array_push($forward_examples,$beforeafter[$currid]);
			}
			$cnt++;
		}while($currid!=null&&$cnt<5);

		// iteration to find before examples - We start with $exampleid and at most 5 are collected 
		$backward_examples = array();	
		$currid=$exampleId;
		$cnt=0;
		do{
			if(isset($beforeafter[$currid])){
				$currid=$beforeafter[$currid][3];
			}else{
				$currid=null;
			}					
			if($currid!=null){
				array_push($backward_examples,$beforeafter[$currid]);
			}
			$cnt++;
		}while($currid!=null&&$cnt<5);

		// Read important lines
		$imp=array();
		$query = $pdo->prepare("SELECT boxid, istart, iend FROM improw WHERE exampleid = :exampleid ORDER BY istart;");
		$query->bindParam(':exampleid', $exampleId);
		$query->execute();
						
		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			array_push($imp,array($row['boxid'],$row['istart'],$row['iend']));
		}  

		// Get all words for each wordlist
		$words = array();
		$query = $pdo->prepare( "SELECT wordlistid,word,label FROM word ORDER BY wordlistid");
		$query->execute();

		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			array_push($words,array($row['wordlistid'],$row['word'],$row['label']));					
		}
		
		// Get all wordlists
		$wordlists=array();
		$query =$pdo->prepare( "SELECT wordlistid, wordlistname FROM wordlist ORDER BY wordlistid;");
		$query->execute();

		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			array_push($wordlists,array($row['wordlistid'],$row['wordlistname']));					
		} 
		
	  // Read important wordlist
		$impwordlist=array();
		$query = $pdo->prepare( "SELECT word,label FROM impwordlist WHERE exampleid = :exampleid ORDER BY word;");
		$query->bindParam(':exampleid', $exampleId);
		$query->execute();
				
		while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
			array_push($impwordlist,$row['word']);					
		}  
		
		// Read Directory - Codeexamples
		$directory=array();
		if(file_exists('./codeupload')){
			$dir = opendir('./codeupload');
			while (($file = readdir($dir)) !== false) {
				if(endsWith($file,".js")){
					array_push($directory,$file);		
				}
			}  
		}

		// Read Directory - Description
		$descDirectory=array();
		if(file_exists('./descupload')){
			$descDir = opendir('./descupload');
			while (($descFile = readdir($descDir)) !== false) {
				if(endsWith($descFile,".txt")){
					array_push($descDirectory,$descFile);		
				}
			}  
		}
				
		$images=array();
		if(file_exists('./imgupload')){
			// Read Directory - Images
			$img_dir = opendir('./imgupload');
			while (($img_file = readdir($img_dir)) !== false) {
				if(endsWith($img_file,".png")){
					array_push($images,$img_file);
				}
			}		
		}
	
	// Collect information for each box
	$box=array();   // get the primary keys for all types kind of boxes.
	$query = $pdo->prepare( "SELECT boxid, boxcontent, boxtitle, filename, wordlistid, segment FROM box WHERE exampleid = :exampleid ORDER BY boxid;");
	$query->bindParam(':exampleid', $exampleId);
	$query->execute();
	
	while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
		$boxcontent=strtoupper($row['boxcontent']);
		$filename=$row['filename'];
		$content="";
				
		if(strcmp("DOCUMENT", $boxcontent)===0){
					
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
		//$desc = "CODE"; $descContent, $desc, $descContent, $description,
		array_push($box, array($row['boxid'],$boxcontent, $content, $row['wordlistid'],$row['boxtitle']));
	}
	$array = array(
		'before' => $backward_examples,
		'after' => $forward_examples,
		'templateid' => $templateid,
		'stylesheet' => $stylesheet,
		'numbox' => $numbox,
		'box' => $box,
		'improws' => $imp,
		'impwords' => $impwordlist,
		'directory' => $directory,
		'descDirectory' => $descDirectory,
		'examplename'=> $examplename,
		'sectionname'=> $sectionName,
		'playlink' => $playlink,
		'exampleno' => $exampleno,
		'words' => $words,
		'wordlists' => $wordlists, 
		'images' => $images,
		'writeaccess' => $writeaccess,
		'debug' => $debug,
		'beforeafter' => $beforeafters, 
		'public' => $public
	);
	echo json_encode($array);
	}else{
		$array = array(
		 	'debug' => "ID does not exist" 
		);		
		echo json_encode($array);
	}
	
?>
