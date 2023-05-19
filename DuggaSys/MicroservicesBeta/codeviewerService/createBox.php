
    //	backward_examples
	//	boxcontent
	//	Comment and document functions/statements that seems non-self explanatory
	//---------------------------------------------------------------------------------------------------------------
	// editorService - Saves and Reads content for Code Editor
	//---------------------------------------------------------------------------------------------------------------
<?php
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





    	if($exampleCount>0){
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

					$query = $pdo->prepare("SELECT * FROM box WHERE boxid = :i AND exampleid = :exampleid;");

					$query->bindParam(':i', $i);
					$query->bindParam(':exampleid', $exampleId);
					$query->execute();

					if($query->fetch(PDO::FETCH_ASSOC)){
						// Update box, if it already exist
						$query = $pdo->prepare("UPDATE box SET boxcontent = :boxcontent, filename = :filename, wordlistid = :wordlistid WHERE boxid = :i AND exampleid = :exampleid;");
					} else if (!$query->fetch(PDO::FETCH_ASSOC)){
						// Create box, if it does not exist
						$query = $pdo->prepare("INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename,wordlistid,fontsize) VALUES (:i,:exampleid, :boxtitle, :boxcontent, :settings, :filename, :wordlistid, :fontsize);");
						$query->bindValue(':boxtitle', 'Title');
						$query->bindValue(':settings', '[viktig=1]'); //TODO: Check what viktig is and what it's for
						$query->bindValue(':fontsize', '9');
					} else {
						// Should be impossible to reach, only for safety
						continue;
					}

					$query->bindParam(':i', $i);
					$query->bindParam(':exampleid', $exampleId);
					$query->bindValue(':boxcontent', $kind);
					$query->bindValue(':filename', $file);
					$query->bindValue(':wordlistid', $wordlist);

					// Update code example to reflect change of template
					if(!$query->execute()) {
						$error=$query->errorInfo();
						// If we get duplicate key error message, ignore error, otherwise carry on adding to debug message
						if(strpos($error[2],"Duplicate entry")==-1) $debug.="Error creating new box: ".$error[2];
					}
				}
            }   

	?>