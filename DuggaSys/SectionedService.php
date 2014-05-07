<?php 

		//---------------------------------------------------------------------------------------------------------------
		// editorService - Saves and Reads content for Code Editor
		//---------------------------------------------------------------------------------------------------------------
	
		// Check if example exists and then do operation
	
		date_default_timezone_set("Europe/Stockholm");
	
		// Include basic application services!
		include_once("../../coursesyspw.php");
		include_once("../Shared/database.php");
		include_once("../Shared/sessions.php");
		include_once("basic.php");
	
		// Connect to database and start session
		dbConnect();
		session_start();
	
		$courseid=$_POST['courseid'];
		//$vers=$_POST['vers'];
		$opt=$_POST['opt'];		
		//$appuser="NOT YET IMPL";
		$exampleno=0;

		if(isset($_POST['sectid'])) $sectid=htmlEntities($_POST['sectid']);
		if(isset($_POST['sectpos'])) $sectpos=htmlEntities($_POST['sectpos']);
		if(isset($_POST['sectname'])) $sectname=htmlEntities($_POST['sectname']);
		if(isset($_POST['pos'])) $pos=htmlEntities($_POST['pos']);
		if(isset($_POST['newname'])) $newname=htmlEntities($_POST['newname']);
		if(isset($_POST['kind'])) $kind=htmlEntities($_POST['kind']);
		
		$debug="NONE!";
		if(checklogin()){
			$ha = hasAccess($_SESSION['uid'], $courseid, 'w');
			if($ha){
				if (strcmp("sectionNew",$opt) === 0) {
					//$newsectpos = getqueryvalue("SELECT MAX(pos)+1 FROM listentries WHERE cid='$courseID';");
					$result = mysql_query("INSERT INTO listentries (cid, entryname, link, kind, pos, creator, visible) VALUES(1, 'Ny sektion', NULL, 0, 6, 1, 1);");
					if(!$result) {
						echo "Error updating entries";
					}
				} else if (strcmp("sectionDel",$opt) === 0) {
					$result = mysql_query("DELETE FROM listentries WHERE lid = '$sectid';");
					if(!$result) {
						echo "Error updating entries";
					}
				}
			}
		}

		//------------------------------------------------------------------------------------------------
		// Retrieve Information			
		//------------------------------------------------------------------------------------------------
		$ha = (checklogin() && hasAccess($_SESSION['uid'], $courseid, 'w'));
		$entries=array();
		$query = "SELECT lid,entryname,pos,kind,link,visible FROM listentries WHERE listentries.cid='$courseid' ORDER BY pos;";		
		$result=mysql_query($query);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!");	
		while ($row = mysql_fetch_assoc($result)){
			array_push(
				$entries,
				array(
					'entryname' => $row['entryname'],
					'lid' => $row['lid'],
					'pos' => $row['pos'],
					'kind' => $row['kind'],
					'link'=>$row['link'],
					'visible'=>$row['visible']
				)
			);
		}

		$array = array('entries'=>$entries,"debug"=>$debug, 'writeaccess' => $ha);
		echo json_encode($array);
?>
