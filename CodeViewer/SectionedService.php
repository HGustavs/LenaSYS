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
		$vers=$_POST['vers'];
		$opt=$_POST['opt'];		
		$appuser="NOT YET IMPL";
		$exampleno=0;

		if(isset($_POST['sectpos'])) $sectpos=htmlEntities($_POST['sectpos']);
		if(isset($_POST['sectname'])) $sectname=htmlEntities($_POST['sectname']);
		if(isset($_POST['pos'])) $pos=htmlEntities($_POST['pos']);
		if(isset($_POST['newname'])) $newname=htmlEntities($_POST['newname']);
		if(isset($_POST['kind'])) $kind=htmlEntities($_POST['kind']);

		if(checklogin()){
				if(strcmp("sectionUp",$opt)===0){
							// Move Section UP!
							if($sectpos>0){
									$kpos=$sectpos-1;
									$query = "UPDATE section SET sectionpos=4000 WHERE coursename='$coursename' and cversion='$vers' and sectionpos='$kpos'";		
									$result=mysql_query($query);
									if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
			
									$query = "UPDATE section SET sectionpos='$kpos' WHERE coursename='$coursename' and cversion='$vers' and sectionpos='$sectpos'";		
									$result=mysql_query($query);
									if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
			
									$query = "UPDATE section SET sectionpos='$sectpos' WHERE coursename='$coursename' and cversion='$vers' and sectionpos='4000'";		
									$result=mysql_query($query);
									if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
							}
				}else if(strcmp("exampleUp",$opt)===0){
							// Move Example UP!
							if($pos>0){
									$kpos=$pos-1;
									$query = "UPDATE codeexample SET pos=4000 WHERE sectionname='$sectname' and coursename='$coursename' and cversion='$vers' and pos='$kpos'";		
									$result=mysql_query($query);
									if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
			
									$query = "UPDATE codeexample SET pos='$kpos' WHERE sectionname='$sectname' and coursename='$coursename' and cversion='$vers' and pos='$pos'";		
									$result=mysql_query($query);
									if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
			
									$query = "UPDATE codeexample SET pos='$pos' WHERE sectionname='$sectname' and coursename='$coursename' and cversion='$vers' and pos='4000'";		
									$result=mysql_query($query);
									if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
							}
				}else if(strcmp("sectionDown",$opt)===0){
							// Move Section UP!
							$kpos=$sectpos+1;
							$query = "UPDATE section SET sectionpos=4000 WHERE coursename='$coursename' and cversion='$vers' and sectionpos='$kpos'";		
							$result=mysql_query($query);
							if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
		
							$query = "UPDATE section SET sectionpos='$kpos' WHERE coursename='$coursename' and cversion='$vers' and sectionpos='$sectpos'";		
							$result=mysql_query($query);
							if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
		
							$query = "UPDATE section SET sectionpos='$sectpos' WHERE coursename='$coursename' and cversion='$vers' and sectionpos='4000'";		
							$result=mysql_query($query);
							if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
				}else if(strcmp("exampleDown",$opt)===0){
							// Move Example UP!
							$kpos=$pos+1;
							$query = "UPDATE codeexample SET pos=4000 WHERE sectionname='$sectname' and coursename='$coursename' and cversion='$vers' and pos='$kpos'";		
							$result=mysql_query($query);
							if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
		
							$query = "UPDATE codeexample SET pos='$kpos' WHERE sectionname='$sectname' and coursename='$coursename' and cversion='$vers' and pos='$pos'";		
							$result=mysql_query($query);
							if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
		
							$query = "UPDATE codeexample SET pos='$pos' WHERE sectionname='$sectname' and coursename='$coursename' and cversion='$vers' and pos='4000'";		
							$result=mysql_query($query);
							if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
		
				}else if(strcmp("exampleNew",$opt)===0){
		
								// Create new codeExample - After example pos.
								$newpos=$pos+1;
		
								$query = "UPDATE codeexample SET pos=pos+1 WHERE pos>'$pos' and coursename='$coursename' and sectionname='$sectname' and cversion='$vers';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Positions!");	
								
								$query = "INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ('$coursename','$sectname','New Example','JS','<none>','$newpos','$appuser','$vers');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Example!");	
		
								$query = "INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES ((SELECT exampleno FROM codeexample WHERE pos='$newpos' and coursename='$coursename' and sectionname='$sectname' and cversion='$vers'),'<none>',1,'$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating File List!");	
		
								$query = "INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES ((SELECT exampleno FROM codeexample WHERE pos='$newpos' and coursename='$coursename' and sectionname='$sectname' and cversion='$vers'),'Enter description here.',1,'$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating File List!");	
		
				}else if(strcmp("exampleNewSection",$opt)===0){
		
								// Create new codeExample - Last in section.
								$kpos=0;
								$query = "SELECT MAX(pos)+1 AS kpos FROM codeexample WHERE coursename='$coursename' and sectionname='$sectname' and cversion='$vers';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
								while ($row = mysql_fetch_assoc($result)){
										$kpos=$row['kpos'];
								}
								
								$query = "INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ('$coursename','$sectname','New Example','JS','<none>','$kpos','$appuser','$vers');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Example!");	
		
								$query = "INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES ((SELECT exampleno FROM codeexample WHERE pos='$kpos' and coursename='$coursename' and sectionname='$sectname' and cversion='$vers'),'<none>',1,'$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating File List!");	
		
								$query = "INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES ((SELECT exampleno FROM codeexample WHERE pos='$kpos' and coursename='$coursename' and sectionname='$sectname' and cversion='$vers'),'Enter description here.',1,'$appuser');";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating File List!");	
		
				}else if(strcmp("editExampleName",$opt)===0){
								$query = "UPDATE codeexample SET examplename='$newname' WHERE pos='$pos' and coursename='$coursename' and sectionname='$sectname' and cversion='$vers'";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Wordlist!");	
				}else if(strcmp("editSectionName",$opt)===0){
								$query = "UPDATE codeexample SET sectionname='$newname' WHERE coursename='$coursename' AND sectionname='$sectname' AND cversion='$vers'";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");	
								
								
								$query = "UPDATE section SET sectionname='$newname' WHERE sectionpos='$sectpos' AND coursename='$coursename' AND sectionname='$sectname' AND cversion='$vers'";
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");	
				}else if(strcmp("sectionNew",$opt)===0){
								// Create new section at the end of section list
		
								$kpos=0;
								$query = "SELECT MAX(sectionpos)+1 AS kpos FROM section WHERE coursename='$coursename' and cversion='$vers';";		
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
								while ($row = mysql_fetch_assoc($result)){
										$kpos=$row['kpos'];
								}
		
								$exname="New Section".$kpos;
								
								if($kind==2){
										$query = "INSERT INTO section(coursename,sectionname,kind,cversion,sectionpos,appuser) values ('$coursename','$exname',2,'$vers','$kpos','$appuser');";
								}else{
										$query = "INSERT INTO section(coursename,sectionname,kind,cversion,sectionpos,appuser) values ('$coursename','$exname',1,'$vers','$kpos','$appuser');";
								}
								$result=mysql_query($query);
								if (!$result) err("SQL Query Error: ".mysql_error(),"Error creating Section!");													
		
								if($kind!=2){
										$query = "INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ('$coursename','$exname','New Example','JS','<none>','$kpos','$appuser','$vers');";		
										$result=mysql_query($query);
										if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Example!");	
		
										$query = "INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES ((SELECT exampleno FROM codeexample WHERE pos='$kpos' and coursename='$coursename' and sectionname='$exname' and cversion='$vers'),'<none>',1,'$appuser');";		
										$result=mysql_query($query);
										if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating File List!");	
				
										$query = "INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES ((SELECT exampleno FROM codeexample WHERE pos='$kpos' and coursename='$coursename' and sectionname='$exname' and cversion='$vers'),'Enter description here.',1,'$appuser');";		
										$result=mysql_query($query);
										if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating File List!");	
		
								}
				}else if(strcmp("exampleDel",$opt)===0){
							$query = "DELETE FROM codeexample WHERE sectionname='$sectname' and coursename='$coursename' and cversion='$vers' and pos='$pos'";		
							$result=mysql_query($query);
							if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
				}else if(strcmp("sectionDel",$opt)===0){
							$query = "DELETE FROM section WHERE sectionname='$sectname' and coursename='$coursename' and cversion='$vers' and sectionpos='$sectpos'";		
							$result=mysql_query($query);
							if (!$result) err("SQL Query Error: ".mysql_error(),"Error updating Section!");										
				}
		
		}
				
	
		//------------------------------------------------------------------------------------------------
		// Retrieve Information			
		//------------------------------------------------------------------------------------------------
	
		$examples=array();
		$query = "SELECT section.sectionname,examplename,pos,sectionpos,kind FROM section LEFT JOIN codeexample ON section.sectionname=codeexample.sectionname WHERE section.cversion='$vers' and section.coursename='$coursename' ORDER BY sectionpos,pos;";		
		$result=mysql_query($query);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
		while ($row = mysql_fetch_assoc($result)){
				array_push($examples,array($row['sectionname'],$row['examplename'],$row['pos'],$row['sectionpos'],$row['kind']));
		}

		$sections=array();
		$query = "SELECT sectionname,sectionpos,kind FROM section WHERE section.cversion='$vers' and section.coursename='$coursename' ORDER BY sectionpos;";		
		$result=mysql_query($query);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
		while ($row = mysql_fetch_assoc($result)){
				array_push($sections,array($row['sectionname'],$row['sectionpos'],$row['kind']));
		}
	
		$array = array('sections'=>$sections,'examples'=>$examples);
			
		echo json_encode($array);
	
?>