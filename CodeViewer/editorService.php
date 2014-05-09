<?php 

	//---------------------------------------------------------------------------------------------------------------
	// editorService - Saves and Reads content for Code Editor
	//---------------------------------------------------------------------------------------------------------------

	// Check if example exists and then do operation

	date_default_timezone_set("Europe/Stockholm");

	// Include basic application services!
	include_once("../../coursesyspw.php");	
	include_once("basic.php");
	include_once("../Shared/courses.php");
	
	// Connect to database and start session
	dbConnect();
	session_start();
	
//	$coursename=getCourseId($_POST['coursename']);	
	//$sectionid=mysql_real_escape_string($_POST['sectionid']);
//	$position=mysql_real_escape_string($_POST['position']);

	$exampleid = $_POST['exampleid'];
	
//	$version=$_POST['version'];
	$opt=$_POST['opt'];
	$appuser=(array_key_exists('uid', $_SESSION) ? $_SESSION['uid'] : 0);

	// Make sure there is an exaple
	$cnt=0;
	$query = "SELECT exampleid,examplename,cid,cversion FROM codeexample WHERE exampleid='$exampleid';";		
	$result=mysql_query($query);
	if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
	while ($row = mysql_fetch_assoc($result)){
			$cnt++;
			$exampleid=$row['exampleid'];
			$examplename=$row['examplename'];
			$courseID=$row['cid'];
			$cversion=$row['cversion'];
	}
	
	
	
	if($cnt>0){

			if(checklogin()){
					//------------------------------------------------------------------------------------------------
					// Perform Update Action
					//------------------------------------------------------------------------------------------------
		
					if(strcmp('addWordlistWord',$opt)===0){
								// Add word to wordlist
								$word=htmlEntities($_POST['word']);
								$wordlist=htmlEntities($_POST['wordlist']);
								$label=htmlEntities($_POST['label']);
								$query = "INSERT INTO wordlist(wordlist,word,description,uid) VALUES ('$wordlist','$word','$label','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('delWordlistWord',$opt)===0){
								// Add word to wordlist
								$word=htmlEntities($_POST['word']);
								$wordlist=htmlEntities($_POST['wordlist']);
								$query = "DELETE FROM wordlist WHERE wordlist='$wordlist' and word='$word';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('newWordlist',$opt)===0){
								// Add word to wordlist
								$word="-new-";
								$wordlist=htmlEntities($_POST['wordlist']);
								$query = "INSERT INTO wordlist(wordlist,word,uid) VALUES ('$wordlist','$word','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('addImpWord',$opt)===0){
								// Add word to wordlist
								$word=htmlEntities($_POST['word']);
								$query = "INSERT INTO impwordlist(exampleid,word,uid) values ('$exampleid','$word','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('delImpWord',$opt)===0){
								// Add word to wordlist
								$word=htmlEntities($_POST['word']);
								$query = "DELETE FROM impwordlist WHERE word='$word' and exampleid='$exampleid';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('addImpLine',$opt)===0){
								// Add word to wordlist
								$from=htmlEntities($_POST['from']);
								$to=htmlEntities($_POST['to']);						
								$query = "INSERT INTO improw(exampleid,istart,iend,uid) VALUES ('$exampleid','$from','$to','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('delImpLine',$opt)===0){
								// Add word to wordlist
								$from=htmlEntities($_POST['from']);
								$to=htmlEntities($_POST['to']);						
								$query = "DELETE FROM improw WHERE exampleid='$exampleid' and istart='$from' and iend='$to';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('selectWordlist',$opt)===0){
								$wordlist=htmlEntities($_POST['wordlist']);
								$query = "UPDATE codeexample SET wordlist='$wordlist' WHERE exampleid='$exampleid';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
					}else if(strcmp("editPlaylink",$opt)===0){
								$playlink=htmlEntities($_POST['playlink']);
								$query = "UPDATE codeexample SET runlink='$playlink' WHERE exampleid='$exampleid';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating codeexample!");	
					}else if(strcmp("editExampleName",$opt)===0){
								$examplename=htmlEntities($_POST['examplename']);
								$query = "UPDATE codeexample SET examplename='$examplename' WHERE exampleid='$exampleid';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
					}else if(strcmp("selectFile",$opt)===0){
								$filename=htmlEntities($_POST['filename']);
								$query = "UPDATE filelist SET filename='$filename' WHERE exampleid='$exampleid';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
					}else if(strcmp("createNewExample",$opt)===0){
								// Create new codeExample - create new file with same id.
								$newpos=$position+1;
								
								$query = "INSERT INTO codeexample(cid,examplename,wordlist,runlink,pos,uid,cversion) values ('$coursename','New Example','JS','<none>','$newpos','$appuser','$version');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Example!");	
		
								$query = "INSERT INTO filelist(exampleid,filename,uid) VALUES ((SELECT exampleid FROM codeexample WHERE pos='$newpos' and cid='$coursename' and cversion='$version'),'<none>','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating File List!");	
		
								$query = "INSERT INTO descriptionsection(exampleid,segment,uid) VALUES ((SELECT exampleid FROM codeexample WHERE pos='$newpos' and cid='$coursename' and cversion='$version'),'Enter description here.','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating File List!");	
								
					}else if(strcmp("editDescription",$opt)===0){
								// replace HTML-spaces and -breakrows for less memory taken in db and nicer formatting
								$description = str_replace("&nbsp;"," ",$_POST['description']);
								$description = str_replace("<br>","\n",$description);
								$query = "UPDATE descriptionsection SET segment='$description' WHERE exampleno='$exampleid';";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
					}
					else if(strcmp("chooseTemplate",$opt)===0){
								$templateid=$_POST['templateid'];
								$query = "UPDATE codeexample SET templateid='$templateid' WHERE exampleid='$exampleid';";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
					}
			}
	
			//------------------------------------------------------------------------------------------------
			// Retrieve Information			
			//------------------------------------------------------------------------------------------------	
				
				
		/* GET PREVIOUS AND NEXT EXAMPLE ID's AND NAMES */	
			$posquery = mysql_query(
				sprintf("SELECT pos FROM listentries WHERE code_id=%d",
					mysql_real_escape_string($exampleid)
				)
			);
			$res = mysql_fetch_assoc($posquery);
			$pos = $res['pos'];
			
			// Locate all the sections in the listentries table
			$r = mysql_query("SELECT pos FROM listentries WHERE kind=1 ORDER BY pos");

			if($r && mysql_num_rows($r) > 0) {
				$positions = array();
			
				// Fetch all positions for sections
				while(($position = mysql_fetch_array($r, MYSQL_NUM)) != null) {
					array_push($positions, $position[0]);
				}
			
				// add the current position into the array and sort
				array_push($positions, $pos);
				sort($positions, SORT_NUMERIC);
			
				$offset = array_search($pos, $positions);
			
				// Remember to check offsets and set the previous and next section
				// position.
				if($offset-1 > 0) {
					$previuous = $positions[$offset-1];
				} else {
					$previuous = 0;
				}
				if($offset+1 < count($positions)) {
					$next = $positions[$offset+1];
				} else {
					$next = false;
				}
			} else {
				die("Failed to get codeexample in listentries." . mysql_error());
			}	
			$prevquery = sprintf("SELECT code_id FROM listentries WHERE code_id IS NOT NULL and pos < %d AND pos > %d",
				mysql_real_escape_string($pos),
				mysql_real_escape_string($previuous)
			);
			
			// SELECT code_id FROM listentries WHERE code_id IS NOT NULL pos < 5 AND pos > 1
			$prev_ex = mysql_query($prevquery);
			
			$nextquery = sprintf("SELECT code_id FROM listentries WHERE code_id IS NOT NULL and pos > %d",
				mysql_real_escape_string($pos)
			);
			
			if($next !== false) {
				$nextquery .= sprintf(" AND pos < %d", mysql_real_escape_string($next));
			}
			
			$next_ex = mysql_query($nextquery);
			
			// Fetch examples before
			$backward_examples = array();
			while(($example = mysql_fetch_array($prev_ex, MYSQL_NUM)) != null) {
				$backexamplequery = mysql_query( // get example names
					sprintf("SELECT examplename FROM codeexample WHERE exampleid=%d;",
						mysql_real_escape_string($example[0])
					)
				);
				$res = mysql_fetch_assoc($backexamplequery);
				array_push($backward_examples,array($res['examplename'],$example[0]));
			}
			
			// Fetch examples after
			$forward_examples = array();
			while(($example = mysql_fetch_array($next_ex, MYSQL_NUM)) != null) {
				$forwexamplequery = mysql_query(  // get example names
					sprintf("SELECT examplename FROM codeexample WHERE exampleid=%d;",
						mysql_real_escape_string($example[0])
					)
				);
				$res = mysql_fetch_assoc($forwexamplequery);
				array_push($forward_examples,array($res['examplename'],$example[0]));
			}
							
			
			// Get entryname
			$query = "SELECT entryname FROM listentries WHERE code_id='$exampleid';";		
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
					$entryname = $row['entryname'];
			}
				
				
						
			// Open file and read name of Example
			$examplename="";
			$exampleno=0;
			$chosenwordlist="";
			$playlink="";
			$query = "SELECT exampleid,examplename,wordlist,runlink FROM codeexample WHERE exampleid=$exampleid and cid='$courseID'";		
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
					$examplename=$row['examplename'];
					$exampleno=$row['exampleid'];
					$chosenwordlist=$row['wordlist'];
					$playlink=$row['runlink'];
			}
				
			// Read File
			$code="";
			$filename="";
			$query = "SELECT filename FROM filelist WHERE exampleid='$exampleid' ORDER BY pos ASC LIMIT 1;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
					$filename=$row['filename'];
					if(strcmp($filename,"<none>")===0){
							// If file name is <none> this is a new file which does not yet have a file name
					}else{
							$filename="./codeupload/".$filename;
							$handle = @fopen($filename, "r");
							if ($handle) {
							    while (($buffer = fgets($handle, 1024)) !== false) {
											$code=$code.$buffer;
									}
							    if (!feof($handle)) {
					        		$code.="Error: Unexpected end of file ".$filename."\n";			    
							    }
							    fclose($handle);
							}else{
					        $code.="Error: could not open file".$filename."\n";
							}
							$filename=$row['filename'];
					}
		  }
		  
		  // Read important lines
			$imp=array();
			$query = "SELECT istart,iend FROM improw WHERE exampleid=$exampleid ORDER BY istart;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($imp,array($row['istart'],$row['iend']));					
			}  
		
		  // Read wordlist
			$wordlist=array();
			$query = "SELECT wordlist,word,description FROM wordlist ORDER BY word;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($wordlist,array($row['wordlist'],$row['word'],$row['description']));					
			}  
		
		  // Read wordlists
			$wordlists=array();
			$query = "SELECT distinct(wordlist) FROM wordlist ORDER BY wordlist;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($wordlists,$row['wordlist']);					
			}  
		
		  // Read important wordlist
			$impwordlist=array();
			$query = "SELECT word,description FROM impwordlist WHERE exampleid=$exampleid ORDER BY word;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($impwordlist,$row['word']);					
			}  
		
			// Read Description Segments
			$desc="";
			$query = "SELECT segment FROM descriptionsection WHERE exampleno=$exampleid ORDER BY pos LIMIT  1;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
				// replace spaces and breakrows to &nbsp; and <br> for nice formatting in descriptionbox
					$desc=str_replace(" ", "&nbsp;",str_replace("\n","<br>",$row['segment']));
				//	$desc = $row['segment'];
			}  
			
			// Read sectionname 
			$sectionname="";
			$query = "SELECT entryname FROM listentries WHERE pos=$previuous";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
					$sectionname=$row['entryname'];
			} 
			
			// Read Directory - Codeexamples
			$directory=array();
			$dir = opendir('./codeupload');
		  while (($file = readdir($dir)) !== false) {
		  	if(endsWith($file,".js")){
		    		array_push($directory,$file);		
		    }
		  }  
			// Get templates
			$template=array();
			$query = "SELECT * FROM template WHERE templateid = (SELECT templateid FROM codeexample WHERE exampleid=$exampleid) ";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
					array_push($template,array($row['templateid'],$row['stylesheet'],$row['numbox']));	
			}
			


        // Read Directory - Images
        $images=array();
        $img_dir = opendir('./imgupload');
        while (($img_file = readdir($img_dir)) !== false) {
            if(endsWith($img_file,".png")){
                array_push($images,$img_file);
            }
        }

			$array = array('before' => $backward_examples,'after' => $forward_examples,'template' => $template,'code' => $code,'filename' => $filename,'improws' => $imp,'impwords' => $impwordlist,'directory' => $directory,'examplename'=> $examplename,'entryname'=> $entryname,'playlink' => $playlink,'desc' => $desc,'exampleno' => $exampleno,'wordlist' => $wordlist,'wordlists' => $wordlists,'chosenwordlist' => $chosenwordlist, 'images' => $images);
			echo json_encode($array);


	}else{
			echo "Example does not exist!";	
	}

	
?>
