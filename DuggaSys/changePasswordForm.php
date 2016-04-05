<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Dugga Viewer</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/markdown.css" rel="stylesheet">
	<link type="text/css" href="templates/dugga.css" rel="stylesheet">

	
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="timer.js"></script>
	<script src="clickcounter.js"></script>
	<script>var querystring=parseGet();</script>

<?php
	date_default_timezone_set("Europe/Stockholm");

	// Include basic application services!
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";

	session_start();

	// Connect to database and start session
	pdoConnect();

	$cid=getOPG('cid');
	$vers=getOPG('coursevers');
	$quizid=getOPG('did');

	$duggatitle="UNK";
	$duggafile="UNK";
	$duggarel="UNK";
	$duggadead="UNK";


	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="UNK";		
	} 	

	$hr=false;
	$query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:cid");
	$query->bindParam(':cid', $cid);

	$result = $query->execute();
	if($row = $query->fetch(PDO::FETCH_ASSOC)){
		//Give permit if the user is logged in and has access to the course or if it is public
		$hr = ((checklogin() && hasAccess($userid, $cid, 'r')) || $row['visibility'] != 0  && $userid != "UNK");
		if(!$hr){
			if (checklogin()){
				$hr = isSuperUser($userid);
			}
		}
	}

	//If we have permission, and if file exists, include javascript file.			
	if($hr){
		if(isSuperUser($userid)){
			$query = $pdo->prepare("SELECT quiz.id as id,entryname,quizFile,qrelease,deadline FROM listentries,quiz WHERE listentries.cid=:cid AND kind=3 AND listentries.vers=:vers AND quiz.cid=listentries.cid AND quiz.id=:quizid AND listentries.link=quiz.id;");
		}else{
			$query = $pdo->prepare("SELECT quiz.id as id,entryname,quizFile,qrelease,deadline FROM listentries,quiz WHERE listentries.cid=:cid AND kind=3 AND listentries.vers=:vers AND visible=1 AND quiz.cid=listentries.cid AND quiz.id=:quizid AND listentries.link=quiz.id;");					
		}
		$query->bindParam(':cid', $cid);
		$query->bindParam(':vers', $vers);
		$query->bindParam(':quizid', $quizid);
		$result = $query->execute();

		if($row = $query->fetch(PDO::FETCH_ASSOC)){
			$duggatitle=$row['entryname'];
			$duggafile=$row['quizFile'];
			$duggarel=$row['qrelease'];
			$duggadead=$row['deadline'];

			echo "<script src='templates/".$duggafile.".js'></script>";

			echo "</head>";
			echo "<body onload='setup();'>";

		}else{
			echo "</head>";
			echo "<body>";							
		}

	}else{
		echo "</head>";
		echo "<body>";
	}
?>


	<?php 
		$noup="SECTION";
		$loginvar="PDUGGA"; 
		include '../Shared/navheader.php';
	?>
			<div>
				<table>
					<form method="POST" action="changepw.php">
					<tr>
						<td>
							<label class="text">Current Password</label>
						</td>
					</tr>
					<tr>
						<td>
							<input name="curPass" placeholder="Current Password" class='form-control textinput' type='password' >
						</td>
					</tr>
					<tr>
						<td>
							<label class="text">New Password</label>
						</td>
					</tr>
					<tr>
						<td>
							<input name="newPass" placeholder="New Password" class='form-control textinput' type='password' >
						</td>
					</tr>
					<tr>
						<td>
							<label class="text">Repeat Password</label>
						</td>
					</tr>
					<tr>
						<td>
							<input name="checkPass" placeholder="Repeat Password" class='form-control textinput' type='password' >
						</td>
					</tr>
					<tr>
						<td>
							<input type='submit' class='submit-button' value='Change Password'>
						</td>
					</tr>
					</form>
				</table>
			</div>
	<?php
		include '../Shared/loginbox.php';
	?>
</body>
</html>