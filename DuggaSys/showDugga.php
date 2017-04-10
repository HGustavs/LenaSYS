<?php
 	session_start();
?>
<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Dugga Viewer</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/markdown.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/dugga.css" rel="stylesheet">

	
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
  <script src="../Shared/markdown.js"></script>
	<script src="timer.js"></script>
	<script src="clickcounter.js"></script>
	<script>var querystring=parseGet();</script>

<?php
	date_default_timezone_set("Europe/Stockholm");

	// Include basic application services!
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";

	// Connect to database and start session
	pdoConnect();

	$cid=getOPG('cid');
	$vers=getOPG('coursevers');
	$quizid=getOPG('did');
	$deadline=getOPG('deadline');
	$comments=getOPG('comments');

	$duggatitle="UNK";
	$duggafile="UNK";
	$duggarel="UNK";
	$duggadead="UNK";
	
	$visibility=false;
	$readaccess=false;
	$checklogin=false;


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
			$visibility=$row['visibility'];
	}
	$readaccess=hasAccess($userid, $cid, 'r');

/*
		//Give permit if the user is logged in and has access to the course or if it is public
		$hr = ((checklogin() && hasAccess($userid, $cid, 'r')) || $row['visibility'] != 0  && $userid != "UNK");
		
		if(!$hr){
			if (checklogin()){
				$hr = isSuperUser($userid);$hr;
			}
		}
*/

	//If we have permission, and if file exists, include javascript file.			
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

?>


	<?php 
		$noup="SECTION";
		$loginvar="PDUGGA"; 
		include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content">
		<?php

			// Log USERID for Dugga Access
			makeLogEntry($userid,1,$pdo,$cid." ".$vers." ".$quizid." ".$duggafile);
			
			// Put information in event log irrespective of whether we are allowed to or not.
			// If we have access rights, read the file securely to document
			// Visibility: 0 Hidden 1 Public 2 Login 3 Deleted 
			
			if($duggafile!="UNK"&&$userid!="UNK"&&($readaccess||isSuperUser($userid))){
				if(file_exists ( "templates/".$duggafile.".html")){
					readfile("templates/".$duggafile.".html");

					echo "<table id='submitButtonTable' class='navheader'>";
					echo "<tr>";
          echo "<td align='center'>";
					echo "<input id='saveDuggaButton' class='submit-button large-button' type='button' value='Save' onclick='saveClick();' />";
					echo "<input class='submit-button large-button' type='button' value='Reset' onclick='reset();' />";
					echo "</td>";
					echo "</tr>";
					echo "</table>";

				}else{
					echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!</div>";
				}
			}else if ($visibility==1){
				if(file_exists ( "templates/".$duggafile.".html")){
					readfile("templates/".$duggafile.".html");
				}else{
					echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!</div>";
				}
        echo "<div class='loginTransparent' id='lockedDuggaInfo' style='margin-bottom:5px;'>";
        echo "<img src='../Shared/icons/duggaLock.svg'>";
        if ($userid!="UNK") {
          echo "<p>Not registered to the course!<br>You can view the assignment but you need to be registered to the course to save your dugga result.</p>";
        } else {
  				echo "<p>Not logged in!<br>You can view the assignment but you need to be logged in and registered to the course to save your dugga result.</p>";
        }
        echo "</div>";

			}else{
				echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> Something went wrong in loading the test. Contact LENASys-admin.</div>";
			}		
		?>

	</div>

	<!-- LoginBox (receiptbox) Start! -->
	<div id='receiptBox' class="loginBox" style="display:none">
		<div class='loginBoxheader'><h3>Kvitto - Duggasvar</h3><div onclick="hideReceiptPopup()">x</div></div>
		<div id='receiptInfo'></div>
		<textarea id="receipt" autofocus readonly></textarea>
		<div class="button-row">
			<input type='button' class='submit-button'  onclick="showEmailPopup();" value='Save Receipt'> 
			<input type='button' class='submit-button'  onclick="hideReceiptPopup();" value='Close'>	
		</div>
		<div id='emailPopup' style="display:none">
			<div class='inputwrapper'><span>Ange din email:</span><input class='textinput' type='text' id='email' placeholder='Email' value=''/></div>
			<div class="button-row"><input type='button' class='submit-button'  onclick="sendReceiptEmail();" value='Send Email'></div>
		</div>	
	</div>
	<!-- Login Box (receiptbox) End! -->

<!---------------------=============####### Preview Popover #######=============--------------------->

	<div id='previewpopover' class='previewPopover' style='display:none;'>
		<div class='loginBoxheader'>
			<h3 style='width:100%;' id='Nameof'>Submission and feedback view</h3><div onclick='closeWindows();'>x</div>
		</div>
		<div style="position:absolute;left:0px;top:34px;bottom:0px;right:0px;">
			<table width="100%" height="100%">
					<tr>
							<td width="75%" height="100%" id="popPrev" style="border:2px inset #aaa;background:#bbb; overflow:scroll;">
									<embed src="" width="100%" height="100%" type='application/pdf' />
							</td>
							<td height="100%" id='markMenuPlaceholderz' style="background:#bbb;">
										<table width="100%" height="100%">
											<tr height="24px" style="text-align: center;"><td><h2>Teacher Feedback</h2></td></tr>
											<tr height="100%">
													<td>
															<textarea id="responseArea" style="width: 100%;height:100%;-webkit-box-sizing: border-box; -moz-box-sizing: border-box;box-sizing: border-box;">Glomar Explorer</textarea>
													</td>
											</tr>
										</table>
							</td>
					</tr>
			</table>
		</div>
	</div>

	<!-- Timer START -->

	<div id='scoreElement'>

	</div>

	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';
	?>
</head>
</body>
</html>
