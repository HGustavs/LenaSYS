<?php 

		//---------------------------------------------------------------------------------------------------------------
		// editorService - Saves and Reads content for Code Editor
		//---------------------------------------------------------------------------------------------------------------
		
		
		
		// TODO: Change section link according to the test/codeexample added in the section form
	
		// Check if example exists and then do operation
	
		date_default_timezone_set("Europe/Stockholm");
	
		// Include basic application services!
		include_once(dirname(__FILE__) . "/../../Shared/sessions.php");
		include_once(dirname(__FILE__) . "/../../Shared/courses.php");
	
		// Connect to database and start session
		pdoConnect();
		session_start();
	
		$courseid=$_POST['courseid'];
		//$vers=$_POST['vers'];
		$opt=$_POST['opt'];		
		//$appuser="NOT YET IMPL";
		$exampleno=0;
		$success = true;

		if(isset($_POST['sectid'])) $sectid=htmlEntities($_POST['sectid']);
		if(isset($_POST['sectpos'])) $sectpos=htmlEntities($_POST['sectpos']);
		if(isset($_POST['sectname'])) $sectname=htmlEntities($_POST['sectname']);
		if(isset($_POST['pos'])) $pos=htmlEntities($_POST['pos']);
		if(isset($_POST['newname'])) $newname=htmlEntities($_POST['newname']);
		if(isset($_POST['kind'])) $kind=htmlEntities($_POST['kind']);
		if(isset($_POST['testdugga'])) $testdugga=htmlEntities($_POST['testdugga']);
		if(array_key_exists('link', $_POST)) $link=htmlEntities($_POST['link']);
		if(array_key_exists('visibility', $_POST)) $visibility = $_POST['visibility'];
		
		$debug="NONE!";
		if(checklogin()){
			$ha = hasAccess($_SESSION['uid'], $courseid, 'w') || isSuperUser($_SESSION["uid"]);
			if($ha){
				if (strcmp("sectionNew",$opt) === 0) {
					// Find out the last position in the list
					$posq = $pdo->prepare("SELECT MAX(pos)+1 FROM listentries WHERE cid=:cid");
					$posq->bindParam(':cid', $courseid);

					// Execute the query and fetch the position if all goes well
					if($posq->execute() && $posq->rowCount() > 0) {
						$posr = $posq->fetch(PDO::FETCH_NUM);
						$pos = $posr[0];
						$code_id = NULL;

						// Prepare to insert a new row at the specified position
						$query = $pdo->prepare("INSERT INTO listentries (cid, entryname, link, kind, pos, creator, visible,code_id) VALUES(:cid, :name, :link, :kind, :pos, :uid, :visible,:code_id)");
						$query->bindParam(':cid', $courseid);
						$query->bindParam(':name', $sectname);
						if($kind == 2) {
							if ($testdugga == "-1") {
								$stmt = $pdo->prepare("INSERT INTO codeexample (cid, examplename, wordlist, runlink,uid) VALUES(:cid, :name, 'JS', '<none>',:uid)");
								$stmt->bindParam(':cid', $courseid);
								$stmt->bindParam(':name', $sectname);
								$stmt->bindParam(':uid', $_SESSION['uid']);
								if(!$stmt->execute()) {
									// TODO: Remove these debug prints
									print_r($stmt->errorInfo());
								} else {
									// Get example id
									$eidq = $pdo->query("SELECT LAST_INSERT_ID() as code_id");
									$eidq->execute();
									$eid = $eidq->fetch(PDO::FETCH_NUM);
									$code_id = $eid[0];
									$link = "../CodeViewer/EditorV30.php?exampleid=".$code_id."&courseid=".$courseid;

									// Create file list
									$sinto = $pdo->prepare("INSERT INTO filelist(exampleid, filename, uid) SELECT exampleid,'<none>',uid FROM codeexample WHERE exampleid=:eid");
									$sinto->bindParam(':eid', $eid[0]);
									if(!$sinto->execute()) {
										// TODO: Remove these debug prints
										print_r($sinto->errorInfo());
									}
								}
							} else {
								$link = "../CodeViewer/EditorV30.php?exampleid=".$testdugga ."&courseid=".$courseid;
							}
						} else if ($kind == 3) {
							if ($testdugga == "-1") {
								// Insert new test
							} else {
								$link = "startDugga?duggaid=".$testdugga."&courseid=".$courseid;
							}
						}
						$query->bindParam(':link', $link);
						$query->bindParam(':kind', $kind);
						$query->bindParam(':pos', $pos);
						$query->bindParam(':uid', $_SESSION['uid']);
						$query->bindParam(':visible', $visibility);
						$query->bindParam(':code_id', $code_id);

						// Insert it.
						if(!$query->execute()) {
							echo "Error updating entries";
						}
					}
				} else if (strcmp("sectionDel",$opt) === 0) {
					$query = $pdo->prepare("DELETE FROM listentries WHERE lid=:lid");
					$query->bindParam(':lid', $sectid);
					if(!$query->execute()) {
						echo "Error updating entries";
					}
				} else if(strcmp("updateEntries", $opt) === 0) {
 					$sectionArray = $_POST['Entry'];
 
 					$counter = 0;
 					foreach ($sectionArray as $entryID) {
 						$query = $pdo->prepare("UPDATE listentries SET pos=:pos WHERE lid =:lid");
 						$query->bindParam(':pos', $counter);
 						$query->bindParam(':lid', $entryID);
 						if(!$query->execute()) {
							echo "Error updating entries";
 						} else {
 							$counter = $counter + 1;
 						}
 					}
  				}
			}
		}

		//------------------------------------------------------------------------------------------------
		// Retrieve Information			
		//------------------------------------------------------------------------------------------------
		$query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:1");
		$query->bindParam(':1', $courseid);
		$result = $query->execute();
		if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
			$hr = ((checklogin() && hasAccess($_SESSION['uid'], $courseid, 'r')) || $row['visibility'] != 0);
			if (!$hr) {
				if (checklogin()) {
					$hr = isSuperUser($_SESSION['uid']);
				}
			}
		}
		$ha = (checklogin() && (hasAccess($_SESSION['uid'], $courseid, 'w') || isSuperUser($_SESSION["uid"])));
		$entries=array();
		$query = $pdo->prepare("SELECT lid,entryname,pos,kind,link,visible,code_id FROM listentries WHERE listentries.cid=:cid ORDER BY pos");
		$query->bindParam(':cid', $courseid);
		$result=$query->execute();
		if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
		foreach($query->fetchAll() as $row) {
			array_push(
				$entries,
				array(
					'entryname' => $row['entryname'],
					'lid' => $row['lid'],
					'pos' => $row['pos'],
					'kind' => $row['kind'],
					'link'=>$row['link'],
					'visible'=>$row['visible'],
					'code_id' => $row['code_id']
				)
			);
		}
		
		$_SESSION['courseid'] = $courseid;

		$array = array(
			'entries' => $entries,
			"debug" => $debug,
			'writeaccess' => $ha,
			'readaccess' => $hr,
			'coursename' => getCourseName($courseid),
			'courseid' => $courseid,
			'success' => $success
		);

		echo json_encode($array);
?>
