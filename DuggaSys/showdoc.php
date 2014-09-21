<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "basic.php";
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

	<script src="dugga.js"></script>

</head>
<body>

	<?php 
		$noup=false;
		$loginvar="LINK"; 
		include 'navheader.php';
	?>
		
	<!-- content START -->
	<div id="content">
	
	<?php

			// Connect to database and start session
			pdoConnect();
			
			$cid=getOPG('cid');
			$fid=getOPG('fid');
			
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

			}else{
					echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
			}
	
	?>
			
	</div>
				
	<!-- content END -->

	<?php
		include 'loginbox.php';
	?>
	
</body>
</html>
