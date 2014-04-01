<?php 

		//---------------------------------------------------------------------------------------------------------------
		// editorService - Saves and Reads content for Code Editor
		//---------------------------------------------------------------------------------------------------------------
	
		// Check if example exists and then do operation
	
		date_default_timezone_set("Europe/Stockholm");
	
		// Include basic application services!
		include_once("../coursesyspw.php");	
		include_once("basic.php");
	
		// Connect to database and start session
		dbConnect();
		session_start();
	
		$coursename=$_POST['coursename'];
		$vers=$_POST['vers'];
		$opt=$_POST['opt'];		
		$appuser="NOT YET IMPL";
		$exampleno=0;

		if(isset($_POST['sectid'])) $sectid=htmlEntities($_POST['sectid']);
		if(isset($_POST['sectpos'])) $sectpos=htmlEntities($_POST['sectpos']);
		if(isset($_POST['sectname'])) $sectname=htmlEntities($_POST['sectname']);
		if(isset($_POST['pos'])) $pos=htmlEntities($_POST['pos']);
		if(isset($_POST['newname'])) $newname=htmlEntities($_POST['newname']);
		if(isset($_POST['kind'])) $kind=htmlEntities($_POST['kind']);
		
		$debug="NONE!";
		
		if(checklogin()){
				if(strcmp("sectionUp",$opt)===0){
							// Move Section UP!
							$currpos=getqueryvalue("SELECT sectionpos as pos FROM section WHERE sectionno='$sectid';");
							$newpos=getqueryvalue("SELECT sectionpos as pos FROM section WHERE sectionpos<'$currpos'and coursename='$coursename' and cversion='$vers' order by sectionpos desc limit 1;");
							if($newpos>-1){
									makequery("UPDATE section SET sectionpos='$currpos' WHERE coursename='$coursename' and cversion='$vers' and sectionpos='$newpos';","Section Position Update Error");
									makequery("UPDATE section SET sectionpos='$newpos' WHERE sectionno='$sectid';","Section Position Update Error");
							}
				}else if(strcmp("sectionDown",$opt)===0){
							// Move Section DOWN!
							$currpos=getqueryvalue("SELECT sectionpos as pos FROM section WHERE sectionno='$sectid';");
							$newpos=getqueryvalue("SELECT sectionpos as pos FROM section WHERE sectionpos>'$currpos'and coursename='$coursename' and cversion='$vers' order by sectionpos asc limit 1;");
							if($newpos>-1){
									makequery("UPDATE section SET sectionpos='$currpos' WHERE coursename='$coursename' and cversion='$vers' and sectionpos='$newpos';","Section Position Update Error");
									makequery("UPDATE section SET sectionpos='$newpos' WHERE sectionno='$sectid';","Section Position Update Error");
							}
				}else if(strcmp("sectionDel",$opt)===0){
							// Delete Section
							makequery("DELETE FROM section WHERE sectionno='$sectid';","Section Deletion Error");
				}else if(strcmp("exampleUp",$opt)===0){
							// Move Example UP!
							$currpos=getqueryvalue("SELECT pos FROM codeexample WHERE exampleno='$sectid';");
							$sectno=getqueryvalue("SELECT sectionno as pos FROM codeexample WHERE exampleno='$sectid';");
							$newpos=getqueryvalue("SELECT pos FROM codeexample WHERE pos<'$currpos'and sectionno='$sectno' order by pos desc limit 1;");
							$prevsection=getqueryvalue("SELECT sectionno as pos FROM section WHERE sectionpos<(select sectionpos from section where sectionno='$sectno') and coursename='$coursename' and cversion='$vers' and kind=1 order by sectionpos desc limit 1;");
							$prevpos=getqueryvalue("SELECT (max(pos)+1) as pos FROM codeexample WHERE sectionno='$prevsection';");
							$debug="SELECT max(pos) as pos FROM codeexample WHERE sectionno='$prevsection';";
							if($newpos>-1){
									// We can move upward in current section
									makequery("UPDATE codeexample SET pos='$currpos' WHERE coursename='$coursename' and cversion='$vers' and sectionno='$sectno' and pos='$newpos';","Section Position Update Error");
									makequery("UPDATE codeexample SET pos='$newpos' WHERE exampleno='$sectid';","Section Position Update Error");
							}else if($prevsection>-1){
									// There is a higher section that we can place the example in
									makequery("UPDATE codeexample SET pos='$prevpos',sectionno='$prevsection' WHERE exampleno='$sectid';","Section Position Update Error");
							}
				}else if(strcmp("exampleDown",$opt)===0){
							// Move Example Down!!
							$currpos=getqueryvalue("SELECT pos FROM codeexample WHERE exampleno='$sectid';");
							$sectno=getqueryvalue("SELECT sectionno as pos FROM codeexample WHERE exampleno='$sectid';");
							$newpos=getqueryvalue("SELECT pos FROM codeexample WHERE pos>'$currpos'and sectionno='$sectno' order by pos asc limit 1;");
							$nextsection=getqueryvalue("SELECT sectionno as pos FROM section WHERE sectionpos>(select sectionpos from section where sectionno='$sectno') and coursename='$coursename' and cversion='$vers' and kind=1 order by sectionpos asc limit 1;");

							if($newpos>-1){
									// We can move downward in current section
									makequery("UPDATE codeexample SET pos='$currpos' WHERE coursename='$coursename' and cversion='$vers' and sectionno='$sectno' and pos='$newpos';","Section Position Update Error");
									makequery("UPDATE codeexample SET pos='$newpos' WHERE exampleno='$sectid';","Section Position Update Error");
							}else if($nextsection>-1){
									// There is a higher section that we can place the example in
									makequery("UPDATE codeexample SET pos=0,sectionno='$nextsection' WHERE exampleno='$sectid';","Section Position Update Error");
									makequery("UPDATE codeexample SET pos=pos+1 WHERE coursename='$coursename' and cversion='$vers' and sectionno='$nextsection';","Section Position Update Error");
							}
				}else if(strcmp("exampleNew",$opt)===0){
								// Create new codeExample - Last in Section.
						
								$newpos=getqueryvalue("SELECT max(pos) as pos FROM codeexample WHERE sectionno='$sectid';")+1;
								makequery("INSERT INTO codeexample(coursename,sectionno,examplename,wordlist,runlink,pos,appuser,cversion) values ('$coursename','$sectid','New Example','JS','<none>','$newpos','$appuser','$vers');","Error Creating New Code Example");
								makequery("INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES ((SELECT exampleno FROM codeexample WHERE pos='$newpos' and coursename='$coursename' and cversion='$vers' limit 1),'<none>',1,'$appuser');","Error Creating New Code Example");
								makequery("INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES ((SELECT exampleno FROM codeexample WHERE pos='$newpos' and coursename='$coursename' and cversion='$vers' limit 1),'Enter description here.',1,'$appuser');","Error Creating Description Text");
	
				}else if(strcmp("editExampleName",$opt)===0){
								$sectid=substr($sectid,2);
								makequery("UPDATE codeexample SET examplename='$newname' WHERE exampleno='$sectid';","Error Updating Example Name");
				}else if(strcmp("editSectionName",$opt)===0){
								$sectid=substr($sectid,2);
								makequery("UPDATE section SET sectionname='$newname' WHERE sectionno='$sectid';","Error Updating Example Name");
				}else if(strcmp("sectionNew",$opt)===0){
								$newsectpos=getqueryvalue("SELECT MAX(sectionpos)+1 AS pos FROM section WHERE coursename='$coursename' and cversion='$vers';");
								$exname="New Section".$newsectpos;
								if($kind==2){
										makequery("INSERT INTO section(coursename,sectionname,kind,cversion,sectionpos,appuser) values ('$coursename','$exname',2,'$vers','$newsectpos','$appuser');","Error Inserting New Sectiob Example Name");
								}else{
										makequery("INSERT INTO section(coursename,sectionname,kind,cversion,sectionpos,appuser) values ('$coursename','$exname',1,'$vers','$newsectpos','$appuser');","Error Inserting New Sectiob Example Name");
								}
	
				}else if(strcmp("exampleDel",$opt)===0){
							makequery("DELETE FROM codeexample WHERE exampleno='$sectid'","Example Deletion Error");
				}
		
		}
				
	
		//------------------------------------------------------------------------------------------------
		// Retrieve Information			
		//------------------------------------------------------------------------------------------------
	
		$examples=array();
		$query = "SELECT section.sectionname,section.sectionno,examplename,exampleno,pos,sectionpos,kind FROM section,codeexample WHERE section.sectionno=codeexample.sectionno and section.cversion='$vers' and section.coursename='$coursename' ORDER BY sectionpos,pos;";		
		$result=mysql_query($query);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
		while ($row = mysql_fetch_assoc($result)){
				array_push($examples,array('exampleno'=>$row['exampleno'],'sectionname'=>$row['sectionname'],'sectionno'=>$row['sectionno'],'examplename'=>$row['examplename'],'pos'=>$row['pos'],'sectionpos'=>$row['sectionpos'],'kind'=>$row['kind']));
		}

		$sections=array();
		$query = "SELECT sectionno,sectionname,sectionpos,kind FROM section WHERE section.cversion='$vers' and section.coursename='$coursename' ORDER BY sectionpos;";		
		$result=mysql_query($query);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
		while ($row = mysql_fetch_assoc($result)){
				array_push($sections,array('sectionname'=>$row['sectionname'],'sectionno'=>$row['sectionno'],'sectionpos'=>$row['sectionpos'],'sectionkind'=>$row['kind']));
		}
	
		$array = array('sections'=>$sections,'examples'=>$examples,"debug"=>$debug);
			
		echo json_encode($array);
	
?>
