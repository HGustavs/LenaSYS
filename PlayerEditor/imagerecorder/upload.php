<?php
	$files = array();
	$data = array();
	$error = false;
	if(isset($_GET['lib'])) {
		// TODO: Sanitize $libName  <-------------
		$libName = $_GET['lib'];
		
		$uploaddir = "../canvasrenderer/libs/image/".$libName;
		if(!file_exists($uploaddir)) {
			try { 
				if(!@mkdir($uploaddir, 0777)) {
					throw new Exception();
				}
			} catch (Exception $e) {
				$error = true;
				$data = array("ERROR" => "Couldn't create library folder.");
			}
		}
	}
	else {
		$error = true;
		$data = array("ERROR" => "No library name.");		
	}

	
	if(!$error) {
		$fileCount = count($_FILES);
		for($i=0; $i < $fileCount; $i++) {

			$filename = basename($_FILES[$i]["name"]);
			$fileext = substr(strrchr($filename,'.'),1);
			// Encrypt file name to ensure duplicate file names can co-exist (16 char names)
			$encrypted_filename = "i".substr(md5($filename.$_FILES[$i]['size']),0,15);
			
			// Put it all together
			$finalPath = $uploaddir."/".$encrypted_filename.".".$fileext;
			
			// If file doesn't already exist upload it.
			if(!file_exists($finalPath)) {
				// Upload the file.
				if(move_uploaded_file($_FILES[$i]['tmp_name'], $finalPath)) {
					array_push($files, $finalPath);
				}
				else {
					$error = true;
					$data = array("ERROR" => "Couldn't execute move_uploaded_file.");
				}
			} 
			// File already exist, return a success so it's added again
			else {
				array_push($files, $finalPath);
			}
			
		}
	}
	
	if(!$error) {
		$data = array("SUCCESS" => $files);
	}
	
	
	// Give response
	
	echo json_encode($data);
	
?>