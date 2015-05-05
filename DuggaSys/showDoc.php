<?php


ob_start();
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
$file;
session_start();
$readfile = false;
	
			// Connect to database and start session
			pdoConnect();
			
			$cid=getOPG('cid');
			$fid=getOPG('fid');
			$fname=getOPG('fname');
			$coursevers=getOPG('coursevers');
			
			if(isset($_SESSION['uid'])){
					$userid=$_SESSION['uid'];
			}else{
					$userid="UNK";		
			} 	

			$hr=false;
			$query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:cid");
			$query->bindParam(':cid', $cid);

			$result = $query->execute();
			if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
				$hr = ((checklogin() && hasAccess($userid, $cid, 'r')) || $row['visibility'] != 0);
				if (!$hr) {
					if (checklogin()) {
						$hr = isSuperUser($userid);
					}
				}
			}
			
			if($hr){// If we have access rights, read the file securely to document
					if(is_numeric($fid)){ // Check if it is a number or a filename
							$query = $pdo->prepare("SELECT filename,kind from fileLink WHERE cid=:cid and fileid=:fid;");
							$query->bindParam(':cid', $cid);
							$query->bindParam(':fid', $fid);
							$result = $query->execute();
							if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
									if(file_exists ( $row['filename'])){
									
									}else{
												$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exists!</div>";
									}
							}else{
									$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
							}
					}else if($fname!="UNK"){
							$query = $pdo->prepare("SELECT filename,kind from fileLink WHERE cid=:cid and UPPER(filename)=UPPER(:fname) ORDER BY kind LIMIT 1;");

							$query->bindParam(':cid', $cid);
							$query->bindParam(':fname', $fname);
							$result = $query->execute();						
							
							if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
								$filekind=$row['kind'];
								if($filekind==1){
											// Link
											//--------------------------
											echo "<script>window.location.replace('".$row['filename']."');</script>";
								}else if($filekind==2){
											// Global
											//--------------------------
										$file = "../templates/".$row['filename'];
									  	if(file_exists ( $file)){
											$filename = $row['filename'];
									
											$readfile = true;

											$file_extension = strtolower(substr(strrchr($filename,"."),1));
										
											switch ($file_extension) {
												case "pdf": $ctype="application/pdf"; break;
												case "exe": $ctype="application/octet-stream"; break;
												case "zip": $ctype="application/zip"; break;
												case "doc": $ctype="application/msword"; break;
												case "xls": $ctype="application/vnd.ms-excel"; break;
												case "ppt": $ctype="application/vnd.ms-powerpoint"; break;
												case "gif": $ctype="image/gif"; break;
												case "png": $ctype="image/png"; break;
												case "jpg": $ctype="image/jpg"; break;
												default: $ctype="application/force-download";
											}

											header("Content-Type: ".$ctype);
											header('Content-Type: application/octet-stream');
											header('Content-Disposition: inline; filename="' .$filename.'"');
											header('Content-Transfer-Encoding: binary');
											header('Accept-Ranges: bytes');
											@readfile($file);

											 $bummer = "<div class='err'><span style='font-weight:bold;'>YES!</span> the link exists".$filename." fssafsafasf ".$file_extension."!!!!</div>";								
										  }else{
													$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!</div>";										  
										  }
								}else if($filekind==3){
											// Course Local
											//--------------------------
											$file = "../courses/".$cid."/".$row['filename'];
									  	if(file_exists ($file)){
											 $filename = $row['filename'];
									
											$readfile = true;

											$file_extension = strtolower(substr(strrchr($filename,"."),1));
										
											switch ($file_extension) {
												case "pdf": $ctype="application/pdf"; break;
												case "exe": $ctype="application/octet-stream"; break;
												case "zip": $ctype="application/zip"; break;
												case "doc": $ctype="application/msword"; break;
												case "xls": $ctype="application/vnd.ms-excel"; break;
												case "ppt": $ctype="application/vnd.ms-powerpoint"; break;
												case "gif": $ctype="image/gif"; break;
												case "png": $ctype="image/png"; break;
												case "jpg": $ctype="image/jpg"; break;
												default: $ctype="application/force-download";
											}

											header("Content-Type: ".$ctype);
											header('Content-Type: application/octet-stream');
											header('Content-Disposition: inline; filename="' .$filename.'"');
											header('Content-Transfer-Encoding: binary');
											header('Accept-Ranges: bytes');
											@readfile($file);
											
											 $bummer = "<div class='err'><span style='font-weight:bold;'>YES!</span> the link exists".$filename." fssafsafasf ".$file_extension."!!!!</div>";		
										  }else{
													$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!</div>";										  
										  }
								}else if($filekind==4){
											// Local
											$file = "../courses/".$cid."/".$row['filename'];
									  	if(file_exists ($file)){
												$filename = $row['filename'];
										
												$readfile = true;

												$file_extension = strtolower(substr(strrchr($filename,"."),1));
											
												switch ($file_extension) {
														case "pdf": $ctype="application/pdf"; break;
														case "exe": $ctype="application/octet-stream"; break;
														case "zip": $ctype="application/zip"; break;
														case "doc": $ctype="application/msword"; break;
														case "xls": $ctype="application/vnd.ms-excel"; break;
														case "ppt": $ctype="application/vnd.ms-powerpoint"; break;
														case "gif": $ctype="image/gif"; break;
														case "png": $ctype="image/png"; break;
														case "jpg": $ctype="image/jpg"; break;
														default: $ctype="application/force-download";
												}

												header("Content-Type: ".$ctype);
												header('Content-Type: application/octet-stream');
												header('Content-Disposition: inline; filename="' .$filename.'"');
												header('Content-Transfer-Encoding: binary');
												header('Accept-Ranges: bytes');
												@readfile($file);
														
												$bummer = "<div class='err'><span style='font-weight:bold;'>YES!</span> the link exists".$filename." fssafsafasf ".$file_extension."!!!!</div>";	
										  }else{
													$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!</div>";										  
										  }
								}

							}else{
									$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
									$query = $pdo->prepare("SELECT filename,kind from fileLink WHERE cid=:cid and UPPER(filename)=UPPER(:fname) ORDER BY kind LIMIT 1;");
									$temp = substr($fname,6); 
									$out = substr_replace($fname,"//",6); 
									$out .= $temp; 
									//
									$query->bindParam(':cid', $cid);
									$query->bindParam(':fname', $out);
									$result = $query->execute();						
									
									if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
									$filekind=$row['kind'];
											if($filekind==1){
														// Link
														echo "<script>window.location.replace('".$row['filename']."');</script>";
											}else{
											}
									}
							}

					}

			}else{
					$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
			}
	

	//
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Document Viewer</title>
		
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
  <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">  

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>

	<script src="../Shared/dugga.js"></script>

</head>
<body>
<?php 
		if($readfile == false){
		$noup="SECTION";
			$loginvar="LINK"; 
			include '../Shared/navheader.php';
			setcookie("loginvar", $loginvar); 
		}
		?>	
		
	<!-- content START -->
	<div id="content">
	<?php 
	echo $bummer;
	
		?>	
	</div>
				
	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';
	?>
	
</body>
</html>
