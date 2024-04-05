<?php
	ini_set("auto_detect_line_endings", true);
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";
		
	ob_start();
	date_default_timezone_set("Europe/Stockholm");
		
	// Include basic application services!
	session_start();
	$readfile = false;
	// Connect to database and start session
	pdoConnect();
	$cid=getOPG('courseid');
	$fid=getOPG('fid');
	$fname=getOPG('fname');
	$coursevers=getOPG('coursevers');
	$preview = getOPG('read');
	$submission = getOPG('sub');

	$hdrs=getOPG('headers');

	$file_extension="UNK";

	if($submission != "UNK" && $_SESSION["superuser"]==1){
		$query = $pdo->prepare("SELECT * FROM submission WHERE subid=:subid");
		$query->bindParam(':subid', $submission);
		$result = $query->execute();
		if($row = $query->fetch(PDO::FETCH_ASSOC)){
			$attachment_location = $row['filepath']."/".$row['filename'].$row['seq'].'.'.$row['extension'];
			header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
			header("Cache-Control: public"); // needed for internet explorer
			//header("Content-Type: application/zip");
			header("Content-Type: application/octet-stream");
			header("Content-Transfer-Encoding: Binary");
			header("Content-Length:".filesize($attachment_location));
			header("Content-Disposition: attachment; filename=".$row['filename'].'.'.$row['extension']);
			readfile($attachment_location);
			die();        				
		}
		exit;
	}
		
	// If no course version is given, read course version from session
	if($cid=="UNK"){
		if(isset($_SESSION['courseid'])){
			$cid=$_SESSION['courseid'];
		}
	}
	if($coursevers=="UNK"){
		if(isset($_SESSION['coursevers'])){
			$coursevers=$_SESSION['coursevers'];
			$_GET['coursevers'] = $coursevers;
		}			
	}
		
	// Read User ID from session
	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="UNK";		
	} 
		
	// Get visibility from course table
	$hr=false;
	$query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:cid");
	$query->bindParam(':cid', $cid);
	$result = $query->execute();
	if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$hr = ((checklogin() && hasAccess($userid, $cid, 'r')) || $row['visibility'] != 0);
		if(!$hr){
			if(checklogin()){
				$hr = isSuperUser($userid);
			}
		}
	}

	if($hr){
		// If we have access rights, read the file securely to document
		if(is_numeric($fid)){ 
			// Check if it is a number or a filename
			$query = $pdo->prepare("SELECT filename,kind from fileLink WHERE cid=:cid and fileid=:fid;");
			$query->bindParam(':cid', $cid);
			$query->bindParam(':fid', $fid);
			$result = $query->execute();
			if($row = $query->fetch(PDO::FETCH_ASSOC)){
				if(file_exists ( $row['filename'])){
				}else{
					$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!</div>";
				}
			}else{
				$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
			}
		}else if($fname!="UNK"){
			$query = $pdo->prepare("SELECT filename,path,kind from fileLink WHERE (cid=:cid or isGlobal='1') and (vers is null OR vers=:vers) and UPPER(filename)=UPPER(:fname) ORDER BY kind DESC LIMIT 1;");
			$query->bindParam(':cid', $cid);
			$query->bindParam(':fname', $fname);
			$query->bindParam(':vers', $coursevers);
			$result = $query->execute();
			if($row = $query->fetch(PDO::FETCH_ASSOC)){
				$filekind=$row['kind'];
				$filename = $row['filename'];
				$path = $row['path'];
		
				if($filekind==1){
					// Link
					//--------------------------
					echo "<script>window.location.replace('".$filename."');</script>";
				}else{
		
					if($filekind==2){
						// Global
						$file = "../courses/global/".$filename;
					}else if($filekind==3){
						// Course Local
						if ($path == null)
							$file = "../courses/" . $cid . "/" . $filename;
						else 
							$file = "../courses/" . $cid . "/Github/" . $path;
					}else if($filekind==4){
						// Local
						$file = "../courses/".$cid."/".$coursevers."/".$filename;
						}else{
						$file = "UNK";					
					}
					
					if(file_exists ( $file)){
						$file_extension = strtolower(substr(strrchr($filename,"."),1));									
						if($file_extension=="html"){
							$bummer=file_get_contents($file);
						}else if($file_extension=="md"){
							$bummer=file_get_contents($file);
						}else{
							$readfile = true;
							switch($file_extension){
								case "pdf": $ctype="application/pdf"; break;
								case "exe": $ctype="application/octet-stream"; break;
								case "zip": $ctype="application/zip"; break;
								case "doc": $ctype="application/msword"; break;
								case "xls": $ctype="application/vnd.ms-excel"; break;
								case "ppt": $ctype="application/vnd.ms-powerpoint"; break;
								case "gif": $ctype="image/gif"; break;
								case "png": $ctype="image/png"; break;
								case "jpg": $ctype="image/jpg"; break;
								case "svg": $ctype="image/svg+xml"; break;                        
								default: $ctype=mime_content_type($file); break;
							}
							header("Content-Type: ".$ctype);
							header('Content-Disposition: inline; filename="' .$filename.'"');
							header('Content-Transfer-Encoding: binary');
							header('Accept-Ranges: bytes');
							@readfile($file);
							exit;
						}
					}else{
						$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist! ".$file."</div>";
					}
				}
			}else{
				$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
			}
		}else{
			$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
		}		
	}else{
		$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
	}		

	if(strcmp($preview,"UNK")!=0){
		echo $bummer;
	}else	if(!$readfile){
		if($hdrs=="none"){
				
		}else{
			$temp = explode('.', $filename);
			$ext  = array_pop($temp);
			$name = implode('.', $temp);
			echo "<html>";
			echo "<head>";
			echo "<link rel='icon' type='image/ico' href='../Shared/icons/favicon.ico'/>";
			echo "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>";
			echo "<title>Document Viewer: $name</title>";
			echo "<link type='text/css' href='../Shared/css/style.css' rel='stylesheet'>";
			echo "<link type='text/css' href='../Shared/css/markdown.css' rel='stylesheet'>";
			echo "<link type='text/css' href='../Shared/css/jquery-ui-1.10.4.min.css' rel='stylesheet'>";  
			echo "<script src='../Shared/js/jquery-1.11.0.min.js'></script>";
			echo "<script src='../Shared/js/jquery-ui-1.10.4.min.js'></script>";
			echo "<script src='../Shared/dugga.js'></script>";
			echo "<script src='../Shared/markdown.js'></script>";				
			echo "</head>";
			echo "<body>";
		}
				
		if($hdrs=="none"){
					
		}else if($readfile == false){
			$noup="SECTION";
			include '../Shared/navheader.php';
		}
								
		if($hdrs!="none") echo "<div id='content'>";

		// Only .md files are supported
		if($file_extension=="md"){
			// If markdown -- perform replacements in code
            $bummer=str_replace("\n","\\n",$bummer);
            $bummer=str_replace("\r","",$bummer);
            $bummer=str_replace('"','\\"',$bummer);
					
            $mstr="<div id='mdtarget' class='descbox'></div>";
            $mstr.="<script>";
            $mstr.="var plorf=\"".$bummer."\";";
            $mstr.="document.getElementById('mdtarget').innerHTML=parseMarkdown(plorf);";
            $mstr.="</script>";
            $bummer=$mstr;
		}
				
		echo $bummer;

		if($hdrs!="none"){
			echo "</div>";
						
			include '../Shared/loginbox.php';
		
			// Code for supporting markdown gif clips for animated tutorials				
			echo "<div id='figmd' class='figmd'><img id='bigmd' src='' class='bigmd' /></div>";
			echo "<div id='backmd' class='backmd'></div>";

			echo "</body>";
			echo "</html>";		
		}
	}
?>