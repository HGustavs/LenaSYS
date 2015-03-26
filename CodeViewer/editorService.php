<?php 

	//---------------------------------------------------------------------------------------------------------------
	// editorService - Saves and Reads content for Code Editor
	//---------------------------------------------------------------------------------------------------------------

	// Check if example exists and then do operation

	date_default_timezone_set("Europe/Stockholm");

	// Include basic application services!
	include_once("../../coursesyspw.php");	
	include_once ("../Shared/sessions.php");
	include_once ("../Shared/basic.php");
	include_once ("../Shared/courses.php");
	
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
					
					if(strcmp('addImpWord',$opt)===0){
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
					}else if(strcmp("editExample",$opt)===0){
								$playlink=htmlEntities($_POST['playlink']);
								$query = "UPDATE codeexample SET runlink='$playlink',public='$security',examplename='$examplename' WHERE exampleid='$exampleid';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating codeexample!");	
					}else if(strcmp("changeboxcontent",$opt)===0){
								$content=$_POST['boxcontent'];
								$query = "UPDATE box SET boxcontent='$content',boxtitle='$boxtitle' WHERE boxid='$boxid' AND exampleid='$exampleid';";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating box!");	
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
			$query = "SELECT exampleid,examplename,sectionname,runlink,public,template.templateid as templateid,stylesheet,numbox FROM codeexample LEFT OUTER JOIN template ON template.templateid=codeexample.templateid WHERE exampleid=$exampleid and cid='$courseID'";		
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
					$examplename=$row['examplename'];
					$exampleno=$row['exampleid'];
					$public=$row['public'];
					$playlink=$row['runlink'];
					$sectionname=$row['sectionname'];
					$templateid=$row['templateid'];
					$stylesheet=$row['stylesheet'];
					$numbox=$row['numbox'];					
			}
			
			$filename=array();
			$query = "SELECT boxid,filename FROM codeBox WHERE exampleid=$exampleid";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
				array_push($filename,array($row['boxid'],$row['filename']));
			}	
						
			// Read ids and names from before/after list
			$beforeafter = array();
			$query = "select exampleid,sectionname,examplename,beforeid,afterid from codeexample where cid='".$cid."' and cversion='".$cvers."' order by sectionname,examplename;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		$beforeafter[$row['exampleid']]=array($row['exampleid'],$row['sectionname'],$row['examplename'],$row['beforeid'],$row['afterid']);
			}  
									
			// iteration to find after examples - We start with $exampleid and at most 5 are collected
			$cnt=0;
			$forward_examples = array();	
			$currid=$exampleid;
			do{
					if(isset($beforeafter[$currid])){
							$currid=$beforeafter[$currid][4];
					}else{
							$currid=null;
					}					
					if($currid!=null){
							array_push($forward_examples,$beforeafter[$currid]);
							$cnt++;
					}
			}while($currid!=null&&$cnt<5);

			// iteration to find before examples - We start with $exampleid and at most 5 are collected 
			$backward_examples = array();	
			$currid=$exampleid;
			$cnt=0;
			do{
					if(isset($beforeafter[$currid])){
							$currid=$beforeafter[$currid][4];
					}else{
							$currid=null;
					}					
					if($currid!=null){
							array_push($backward_examples,$beforeafter[$currid]);
							$cnt++;
					}
			}while($currid!=null&&$cnt<5);
				  
		  // Read important lines
			$imp=array();
			$query = "SELECT codeBoxid,istart,iend FROM improw WHERE exampleid=$exampleid ORDER BY istart;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($imp,array($row['codeBoxid'],$row['istart'],$row['iend']));
			}  
		
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
			
		  // Read important wordlist
			$impwordlist=array();
			$query = "SELECT word,label FROM impwordlist WHERE exampleid=$exampleid ORDER BY word;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($impwordlist,$row['word']);					
			}  
			
			// Read Directory - Codeexamples
			$directory=array();
			$dir = opendir('./codeupload');
		  while (($file = readdir($dir)) !== false) {
		  	if(endsWith($file,".js")){
		    		array_push($directory,$file);		
		    }
		  }  

      // Read Directory - Images
      $images=array();
      $img_dir = opendir('./imgupload');
      while (($img_file = readdir($img_dir)) !== false) {
          if(endsWith($img_file,".png")){
              array_push($images,$img_file);
          }
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
					'filename' => $filename,
					'examplename'=> $examplename,
					'sectionname'=> $sectionname,
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
