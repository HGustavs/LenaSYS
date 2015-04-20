<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";

session_start();
	
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Document Viewer</title>
		
	<link type="text/css" href="css/style.css" rel="stylesheet">
  <link type="text/css" href="css/jquery-ui-1.10.4.min.css" rel="stylesheet">  

	<script src="js/jquery-1.11.0.min.js"></script>
	<script src="js/jquery-ui-1.10.4.min.js"></script>

	<script src="../Shared/dugga.js"></script>

</head>
<body>

	<?php 
		$noup="SECTION";
		$loginvar="LINK"; 
		include '../Shared/navheader.php';
		setcookie("loginvar", $loginvar);
	?>
		
	<!-- content START -->
	<div id="content">
	
	<?php

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
			
			// If we have access rights, read the file securely to document
			if($hr){
					if(is_numeric($fid)){
							// Check if it is a number or a filename, if so, 
							$query = $pdo->prepare("SELECT filename,kind from fileLink WHERE cid=:cid and fileid=:fid;");
							$query->bindParam(':cid', $cid);
							$query->bindParam(':fid', $fid);
							$result = $query->execute();
							if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
						  	if(file_exists ( $row['filename'])){
								  	readfile($row['filename']);
							  }else{
										echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exists!</div>";
							  }
							}else{
									echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
							}
					}else if($fname!="UNK"){
							// Check if it is a number or a filename, if so, 
							$query = $pdo->prepare("SELECT filename,kind from fileLink WHERE cid=:cid and UPPER(filename)=UPPER(:fname) ORDER BY kind LIMIT 1;");
							$query->bindParam(':cid', $cid);
							$query->bindParam(':fname', $fname);
							$result = $query->execute();
							
							// Start at the "root-level"
							chdir('../../');
			 				$currcvd=getcwd();
							
							if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
								$filekind=$row['kind'];
								if($filekind==1){
											// Link
								}else if($filekind==2){
											// Global
									  	if(file_exists ( "templates/".$row['filename'])){
											  	readfile("templates/".$row['filename']);
										  }else{
													echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!</div>";										  
										  }
								}else if($filekind==3){
											// Course Local
									  	if(file_exists ($currcvd."/Courses/".$cid."/".$row['filename'])){
											  	readfile($currcvd."/Courses/".$cid."/".$row['filename']);
										  }else{
													echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!</div>";										  
										  }
								}else if($filekind==4){
											// Local
									  	if(file_exists ($currcvd."/Courses/".$cid."/".$coursevers."/".$row['filename'])){
											  	readfile($currcvd."/Courses/".$cid."/".$coursevers."/".$row['filename']);
										  }else{
													echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!</div>";										  
										  }
								}

							}else{
									echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
							}

					}

			}else{
					echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
			}
	
	?>
			
	</div>
				
	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';
	?>
	
</body>
</html>
