<?php 

	//---------------------------------------------------------------------------------------------------------------
	// editorService - Saves and Reads content for Code Editor
	//---------------------------------------------------------------------------------------------------------------

	// Check if example exists and then do operation

	date_default_timezone_set("Europe/Stockholm");

	// Include basic application services!
	include_once("../../coursesyspw.php");	
	include_once("basic.php");

	// Connect to database and start session
	dbConnect();
	session_start();
	
	$coursename=$_POST['coursename'];	
	$sectionid=$_POST['sectionid'];
	$position=$_POST['position'];
	$version=$_POST['version'];
	$opt=$_POST['opt'];
	$appuser="NOT YET IMPL";
	$exampleno=0;
	
	// To guarantee that things only happen if the example exists in the named version
	$cnt=0;
	$query = "SELECT exampleno FROM codeexample WHERE cversion=$version and coursename='$coursename' and pos='$position' and sectionno='$sectionid';";		
	$result=mysql_query($query);
	if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
	while ($row = mysql_fetch_assoc($result)){
			$cnt++;
			$exampleno=$row['exampleno'];
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
								$query = "INSERT INTO wordlist(wordlist,word,appuser) VALUES ('$wordlist','$word','$appuser');";		
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
								$query = "INSERT INTO wordlist(wordlist,word,appuser) VALUES ('$wordlist','$word','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('addImpWord',$opt)===0){
								// Add word to wordlist
								$word=htmlEntities($_POST['word']);
								$query = "INSERT INTO impwordlist(exampleno,word,appuser) values ('$exampleno','$word','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('delImpWord',$opt)===0){
								// Add word to wordlist
								$word=htmlEntities($_POST['word']);
								$query = "DELETE FROM impwordlist WHERE word='$word' and exampleno='$exampleno';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('addImpLine',$opt)===0){
								// Add word to wordlist
								$from=htmlEntities($_POST['from']);
								$to=htmlEntities($_POST['to']);						
								$query = "INSERT INTO improw(exampleno,istart,iend,appuser) VALUES ('$exampleno','$from','$to','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('delImpLine',$opt)===0){
								// Add word to wordlist
								$from=htmlEntities($_POST['from']);
								$to=htmlEntities($_POST['to']);						
								$query = "DELETE FROM improw WHERE exampleno='$exampleno' and istart='$from' and iend='$to';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");						
					}else if(strcmp('selectWordlist',$opt)===0){
								$wordlist=htmlEntities($_POST['wordlist']);
								$query = "UPDATE codeexample SET wordlist='$wordlist' WHERE exampleno='$exampleno';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
					}else if(strcmp("editPlaylink",$opt)===0){
								$playlink=htmlEntities($_POST['playlink']);
								$query = "UPDATE codeexample SET runlink='$playlink' WHERE exampleno='$exampleno';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating codeexample!");	
					}else if(strcmp("editExampleName",$opt)===0){
								$examplename=htmlEntities($_POST['examplename']);
								$query = "UPDATE codeexample SET examplename='$examplename' WHERE exampleno='$exampleno';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
					}else if(strcmp("selectFile",$opt)===0){
								$filename=htmlEntities($_POST['filename']);
								$query = "UPDATE filelist SET filename='$filename' WHERE exampleno='$exampleno' and pos=1;";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
					}else if(strcmp("createNewExample",$opt)===0){
								// Create new codeExample - create new file with same id.
								$newpos=$position+1;
										
								$query = "INSERT INTO codeexample(coursename,sectionno,examplename,wordlist,runlink,pos,appuser,cversion) values ('$coursename','$sectionid','New Example','JS','<none>','$newpos','$appuser','$version');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Example!");	
		
								$query = "INSERT INTO filelist(exampleno,filename,appuser) VALUES ((SELECT exampleno FROM codeexample WHERE pos='$newpos' and coursename='$coursename' and sectionno='$sectionid' and cversion='$version'),'<none>','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating File List!");	
		
								$query = "INSERT INTO descriptionsection(exampleno,segment,appuser) VALUES ((SELECT exampleno FROM codeexample WHERE pos='$newpos' and coursename='$coursename' and sectionno='$sectionid' and cversion='$version'),'Enter description here.','$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating File List!");	
								
					}else if(strcmp("editDescription",$opt)===0){
							// replace HTML-spaces and -breakrows for less memory taken in db and nicer formatting
								$description = str_replace("&nbsp;"," ",$_POST['description']);
								$description = str_replace("<br>","\n",$description);
								$query = "UPDATE descriptionsection SET segment='$description' WHERE exampleno='$exampleno';";
                                $result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
					}
			
			}
	
			//------------------------------------------------------------------------------------------------
			// Retrieve Information			
			//------------------------------------------------------------------------------------------------
		
			// Backward Button Data
			$before=array();
			$query = "SELECT examplename,pos FROM codeexample WHERE cversion=$version and coursename='$coursename' and pos<$position and sectionno='$sectionid' ORDER BY pos ASC;";		
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
			while ($row = mysql_fetch_assoc($result)){
					array_push($before,array($row['examplename'],$row['pos']));
			}
		
			// Forward Button Data
			$after=array();
			$query = "SELECT examplename,pos FROM codeexample WHERE cversion=$version and coursename='$coursename' and sectionno='$sectionid' and pos>$position ORDER BY pos ASC;";		
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
			while ($row = mysql_fetch_assoc($result)){
					array_push($after,array($row['examplename'],$row['pos']));
			}
						
			// Open file and read name of Example
			$examplename="";
			$exampleno=0;
			$chosenwordlist="";
			$playlink="";
			$query = "SELECT exampleno,examplename,wordlist,runlink FROM codeexample WHERE cversion=$version and coursename='$coursename' and sectionno='$sectionid' and pos='$position'";		
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
			while ($row = mysql_fetch_assoc($result)){
					$examplename=$row['examplename'];
					$exampleno=$row['exampleno'];
					$chosenwordlist=$row['wordlist'];
					$playlink=$row['runlink'];
			}
				
			// Read File
			$code="";
			$filename="";
			$query = "SELECT filename FROM filelist WHERE exampleno='$exampleno' ORDER BY pos ASC LIMIT 1;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
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
			$query = "SELECT istart,iend FROM improw WHERE exampleno=$exampleno ORDER BY istart;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($imp,array($row['istart'],$row['iend']));					
			}  
		
		  // Read wordlist
			$wordlist=array();
			$query = "SELECT wordlist,word FROM wordlist ORDER BY word;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($wordlist,array($row['wordlist'],$row['word']));					
			}  
		
		  // Read wordlists
			$wordlists=array();
			$query = "SELECT distinct(wordlist) FROM wordlist ORDER BY wordlist;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($wordlists,$row['wordlist']);					
			}  
		
		  // Read important wordlist
			$impwordlist=array();
			$query = "SELECT word,description FROM impwordlist WHERE exampleno=$exampleno ORDER BY word;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
			while ($row = mysql_fetch_assoc($result)){
		  		array_push($impwordlist,$row['word']);					
			}  
		
			// Read Description Segments
			$desc="";
			$query = "SELECT segment FROM descriptionsection WHERE exampleno=$exampleno ORDER BY pos ASC LIMIT 1;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
			while ($row = mysql_fetch_assoc($result)){
				// replace spaces and breakrows to &nbsp; and <br> for nice formatting in descriptionbox
					$desc=str_replace(" ", "&nbsp;",str_replace("\n","<br>",$row['segment']));
				//	$desc = $row['segment'];
			}  
			
			// Read sectionname 
			$sectionname="";
			$query = "SELECT sectionname FROM section WHERE sectionno=$sectionid;";
			$result=mysql_query($query);
			if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
			while ($row = mysql_fetch_assoc($result)){
					$sectionname=$row['sectionname'];
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
                array_push($images,"imgupload/".$img_file);
            }
        }

        $array = array('before' => $before,'after' => $after,'code' => $code,'filename' => $filename,'improws' => $imp,'impwords' => $impwordlist,'directory' => $directory,'images' => $images, 'examplename'=> $examplename,'playlink' => $playlink,'desc' => $desc,'sectionname' => $sectionname,'exampleno' => $exampleno,'wordlist' => $wordlist,'wordlists' => $wordlists,'chosenwordlist' => $chosenwordlist);
			echo json_encode($array);

	}else{
			echo "Example does not exist!";	
	}

	
?>