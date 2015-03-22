<?php 

	//---------------------------------------------------------------------------------------------------------------
	// editorService - Saves and Reads content for Code Editor
	//---------------------------------------------------------------------------------------------------------------

	// Check if example exists and then do operation

	date_default_timezone_set("Europe/Stockholm");

	// Include basic application services!
	include_once("../../coursesyspw.php");	

	include_once "../Shared/sessions.php";
	include_once "../Shared/basic.php";

	include_once("../Shared/basic.php");
	include_once("../Shared/courses.php");
	
	// Connect to database and start session
	dbConnect();
	session_start();

	$writeaccess="";
	
	$exampleid=getOP('exampleid');
	$boxid=getOP('boxid');
	$opt=getOP('opt');
	$cid=getOP('courseid');
	$cvers=getOP('cvers');
		
	$debug="NONE!";	

	$appuser=(array_key_exists('uid', $_SESSION) ? $_SESSION['uid'] : 0);

	// Make sure there is an exaple
	$cnt=0;
	$query = "SELECT exampleid,examplename,cid,cversion,public FROM codeexample WHERE exampleid='$exampleid';";	
	$result=mysql_query($query);
	if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
	while ($row = mysql_fetch_assoc($result)){
			$cnt++;
			$exampleid=$row['exampleid'];
			$examplename=$row['examplename'];
			$courseID=$row['cid'];
			$cversion=$row['cversion'];
			$public=$row['public'];
	}
	
	if($cnt>0){

				//------------------------------------------------------------------------------------------------
				// Perform Update Action
				//------------------------------------------------------------------------------------------------

				if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {
						$writeaccess="w";
//			if(checklogin()){
		
					if(strcmp('addWordlistWord',$opt)===0){
								// Add word to wordlist
								$word=htmlEntities($_POST['word']);
								$wordlistid=htmlEntities($_POST['wordlist']);
								$label=htmlEntities($_POST['label']);
								$query = "INSERT INTO word(wordlistid,word,label,uid) VALUES ('$wordlistid','$word','$label','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('delWordlistWord',$opt)===0){
								// Add word to wordlist
								$word=htmlEntities($_POST['word']);
								$wordlistid=htmlEntities($_POST['wordlist']);
								$query = "DELETE FROM word WHERE wordlistid='$wordlistid' and word='$word';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('newWordlist',$opt)===0){
								// Add new wordlist
								$wordlistname=htmlEntities($_POST['wordlistname']);
								$query = "INSERT INTO wordlist(wordlistname,uid) VALUES ('$wordlistname','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('delWordlist',$opt)===0){
								// Add new wordlist
								$wordlistid=htmlEntities($_POST['wordlistid']);
								$query = "DELETE FROM wordlist WHERE wordlistid='$wordlistid';";	
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error deleting Wordlist!");						
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
								$query = "INSERT INTO improw(codeBoxid,exampleid,istart,iend,uid) VALUES ('$boxid','$exampleid','$from','$to','$appuser');";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('delImpLine',$opt)===0){
								// Add word to wordlist
								$from=htmlEntities($_POST['from']);
								$to=htmlEntities($_POST['to']);						
								$query = "DELETE FROM improw WHERE exampleid='$exampleid' AND codeBoxid='$boxid' and istart='$from' and iend='$to';";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('selectWordlist',$opt)===0){
								$wordlistid=htmlEntities($_POST['wordlistid']);
								$query = "UPDATE codeBox SET wordlistid='$wordlistid' WHERE exampleid='$exampleid' AND boxid='$boxid';";		
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
								$query = "UPDATE codeBox SET filename='$filename' WHERE exampleid='$exampleid' AND boxid='$boxid';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
								
								/* Need to update file id in box-talble here. */
					}else if(strcmp("editDescription",$opt)===0){
								// replace HTML-spaces and -breakrows for less memory taken in db and nicer formatting
								$description = str_replace("&nbsp;"," ",$_POST['description']);
								$description = str_replace("<br>","\n",$description);
								$query = "UPDATE descriptionBox SET segment='$description', appuser='$appuser' WHERE exampleid='$exampleid' AND boxid='$boxid';";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
					
					}else if(strcmp("CHTMPL",$opt)===0){
								
								/*  Codeexample resets when changing templates  */
								$templateid=$_POST['templateid'];
								// Reset and update codeexample
								$query = "UPDATE codeexample SET templateid='$templateid', uid='$appuser' WHERE exampleid='$exampleid';";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
								
								$query = "Select numbox from template where templateid=(select templateid from codeexample where exampleid='$exampleid');";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
								while ($row = mysql_fetch_assoc($result)){
										$required_boxes = $row['numbox'];
								}
								
								$query = "Select * from box where exampleid='$exampleid';";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
								$existing_boxes = mysql_num_rows($result);
								
								$new_boxes = $required_boxes-$existing_boxes;
								
								/* Create new boxes if it's needed */								
								if($new_boxes != 0){
									for($i=0; $i<$new_boxes; $i++){
										// Set correct ID number for new box.
										$existing_boxes++;
										$query = "INSERT INTO box(boxid,exampleid,boxcontent,boxtitle,settings) VALUES ('$existing_boxes','$exampleid','NOT DEFINED','Box title','[viktig=1]');";		
										$result=mysql_query($query);
										if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating File List!");	
									}
								}
					}else if(strcmp("changeboxcontent",$opt)===0){
								$content=$_POST['boxcontent'];
								// Update content in a box.
								$query = "UPDATE box SET boxcontent='$content' WHERE boxid='$boxid' AND exampleid='$exampleid';";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating box!");	
					}else if(strcmp("updateboxtitle",$opt)===0){
								$boxtitle=$_POST['boxtitle'];
								// Update content in a box.
								$query = "UPDATE box SET boxtitle='$boxtitle' WHERE boxid='$boxid' AND exampleid='$exampleid';";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating box!");	
					}
					else if(strcmp("updateSecurity",$opt)===0){
								$security=$_POST['public'];
								$query = "UPDATE codeexample SET public='$security' WHERE exampleid='$exampleid';";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Security!");
					}
			}
	
			//------------------------------------------------------------------------------------------------
			// Retrieve Information			
			//------------------------------------------------------------------------------------------------	
				
			// Read ids and names from before/after list
			$beforeafter = array();
			$query = "select exampleid,sectionname,examplename from codeexample where cid='".$cid."' and cversion='".$cvers."' order by sectionname,examplename;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($beforeafter,array($row['exampleid'],$row['sectionname'],$row['examplename']));
			}  
			
			/* GET PREVIOUS AND NEXT EXAMPLE ID's AND NAMES */	
			$posquery = mysql_query(sprintf("SELECT pos FROM listentries WHERE code_id=%d",mysql_real_escape_string($exampleid)));
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
				if($offset-1 >= 0) {
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
								
				
						
			// Open file and read name of Example
			$examplename="";
			$exampleno=0;
		//	$chosenwordlist="";
			$playlink="";
			$query = "SELECT exampleid,examplename,runlink FROM codeexample WHERE exampleid=$exampleid and cid='$courseID'";		
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
					$examplename=$row['examplename'];
					$exampleno=$row['exampleid'];
				//	$chosenwordlist=$row['wordlist'];
					$playlink=$row['runlink'];
			}
				  
		  // Read important lines
			$imp=array();
			$query = "SELECT codeBoxid,istart,iend FROM improw WHERE exampleid=$exampleid ORDER BY istart;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($imp,array($row['codeBoxid'],$row['istart'],$row['iend']));
			}  
		
		  // Read wordlist
		/*	$wordlist=array();
			$query = "SELECT wordlist,word,label FROM wordlist ORDER BY word;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($wordlist,array($row['wordlist'],$row['word'],$row['label']));					
			}  
		*/
			// Get all words for each wordlist
			$words = array();
			$query = "SELECT wordlistid,word,label FROM word ORDER BY wordlistid";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($words,array($row['wordlistid'],$row['word'],$row['label']));					
			}
			
			// Get all wordlists
			$wordlists=array();
			$query = "SELECT wordlistid, wordlistname FROM wordlist ORDER BY wordlistid;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($wordlists,array($row['wordlistid'],$row['wordlistname']));					
			} 
			
			
		  // Read wordlists
		/*	$wordlists=array();
			$query = "SELECT distinct(wordlist) FROM wordlist ORDER BY wordlist;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($wordlists,$row['wordlist']);					
			}  
		*/
		  // Read important wordlist
			$impwordlist=array();
			$query = "SELECT word,label FROM impwordlist WHERE exampleid=$exampleid ORDER BY word;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($impwordlist,$row['word']);					
			}  
		
			// Read sectionname 
			$entryname="";
			$query = "SELECT entryname FROM listentries WHERE pos=$previuous";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
					$entryname=$row['entryname'];
			} 
			
			// Read Directory - Codeexamples
			$directory=array();
			$dir = opendir('./codeupload');
		  while (($file = readdir($dir)) !== false) {
		  	if(endsWith($file,".js")){
		    		array_push($directory,$file);		
		    }
		  }  

			// Get templates -- Assuming there is at most one template
			$template=array();
			$query = "SELECT * FROM template,codeexample WHERE template.templateid=codeexample.templateid and exampleid=$exampleid;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
					$template=array('templateid' => $row['templateid'],'stylesheet' => $row['stylesheet'],'numbox' => $row['numbox']);
					//array_push($template,array('templateid' => $row['templateid'],'stylesheet' => $row['stylesheet'],'numbox' => $row['numbox']));	
			}
			

      // Read Directory - Images
      $images=array();
      $img_dir = opendir('./imgupload');
      while (($img_file = readdir($img_dir)) !== false) {
          if(endsWith($img_file,".png")){
              array_push($images,$img_file);
          }
      }
			
			//get public value
			$public=array();
			$query = "SELECT public FROM codeexample WHERE exampleid=$exampleid";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
					array_push($public,array($row['public']));	
			}
			
			// Get boxes and its information
			$box=array();   // get the primary keys for all types kind of boxes.
			$query = "SELECT boxid,boxcontent,boxtitle FROM box WHERE exampleid=$exampleid ORDER BY boxid;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
					$boxcontent=strtoupper($row['boxcontent']);
					$boxid=$row['boxid'];
					$boxtitle=$row['boxtitle'];
					
				if(strcmp("DOCUMENT",$boxcontent)===0){
					$query2 = "SELECT segment FROM descriptionBox WHERE exampleid='$exampleid' AND boxid='$boxid';";
					$result2=mysql_query($query2);
					if (!$result2) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
					while ($row2 = mysql_fetch_assoc($result2)){
						
						// replace spaces and breakrows to &nbsp; and <br> for nice formatting in descriptionbox str_replace(" ", "&nbsp;",str_replace("\n","<br>",$row2['segment']))
							array_push($box,array($boxid,$boxcontent,str_replace(" ", "&nbsp;",str_replace("\n","<br>",$row2['segment'])),$boxtitle));
					}		
					
				}else if(strcmp("CODE",$boxcontent)===0){					
					$query3 = "SELECT filename,wordlistid FROM codeBox WHERE exampleid=$exampleid AND boxid=$boxid;";
					$result3=mysql_query($query3);
					if (!$result3) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
					while ($row3 = mysql_fetch_assoc($result3)){
						$filename=$row3['filename'];
						$code="";
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
						array_push($box,array($boxid,$boxcontent,$code,$boxtitle,$row3['wordlistid']));
					} 
				}else if (strcmp("NOT DEFINED",$boxcontent)===0){
					array_push($box,array($boxid,$boxcontent));
				}						
			}
				
			
			$filename=array();
				$query = "SELECT boxid,filename FROM codeBox WHERE exampleid=$exampleid";
				$result=mysql_query($query);
				if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
				while ($row = mysql_fetch_assoc($result)){
					array_push($filename,array($row['boxid'],$row['filename']));
				}	
				

			$array = array(
					'before' => $backward_examples,
					'after' => $forward_examples,
					'template' => $template,
					'box' => $box,
					'improws' => $imp,
					'impwords' => $impwordlist,
					'directory' => $directory,
					'filename' => $filename,
					'examplename'=> $examplename,
					'entryname'=> $entryname,
					'playlink' => $playlink,
					'exampleno' => $exampleno,
					'words' => $words,
					'wordlists' => $wordlists, 
					'images' => $images,
					'writeaccess' => $writeaccess,
					'debug' => $debug,
					'beforeafter' => $beforeafter, 
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
