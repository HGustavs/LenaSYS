<?php
	include_once "../Shared/sessions.php";
	include_once "../Shared/basic.php";

	// Connect to database and start/resume session
 	session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/markdown.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/dugga.css" rel="stylesheet">

		<!-- To enable dark mode, these 2 files were added. -->
	<link id="themeBlack" type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet">
	<script src="darkmodeToggle.js"></script>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  	<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  	<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="../DuggaSys/templates/svg-dugga.js"></script>
	<script src="../Shared/markdown.js"></script>
	<script>var querystring=parseGet();</script>

<?php
	date_default_timezone_set("Europe/Stockholm");

	// Include basic application services!
	pdoConnect();

	#general vars regarding current dugga.
	$cid=getOPG('courseid');
	$vers=getOPG('coursevers');
	?>
		<script>var cid = <?php echo $cid ?>,vers = <?php echo $vers ?>;</script>
	<?php
	$quizid=getOPG('did');
	$deadline=getOPG('deadline');
	$comments=getOPG('comments');
	$hash = getOPG("hash");
	$test=getOPG('test');
	$isNewDugga=getOPG("newDugga");
	$duggatitle="UNK";
	$duggafile="UNK";
	$duggarel="UNK";
	$duggadead="UNK";

	$visibility=false;
	$checklogin=false;

	$duggaid=getOPG('did');
	$moment=getOPG('moment');
	$courseid=getOPG('courseid');

	
    if(isset($_GET['hash']) && $_GET['hash'] != "UNK")
	{
		$_SESSION['tempHash'] = $hash;
	}
	

  
// can see all duggas and deleted ones
  if(isSuperUser($userid)){
	$query = $pdo->prepare("SELECT quiz.id as id,entryname,quizFile,qrelease,deadline FROM listentries,quiz WHERE listentries.cid=:cid AND kind=3 AND listentries.vers=:vers AND quiz.cid=listentries.cid AND quiz.id=:quizid AND listentries.link=quiz.id;");
}
// can see all duggas expect from deleted ones
	else{
	$query = $pdo->prepare("SELECT quiz.id as id,entryname,quizFile,qrelease,deadline FROM listentries,quiz WHERE listentries.cid=:cid AND kind=3 AND (visible=1 OR visible=2) AND listentries.vers=:vers AND quiz.cid=listentries.cid AND quiz.id=:quizid AND listentries.link=quiz.id;");
}
	  $query->bindParam(':cid', $cid);
	  $query->bindParam(':vers', $vers);
	  $query->bindParam(':quizid', $quizid);
	  $result = $query->execute();

//		foreach($result->fetch(PDO::FETCH_ASSOC) as $row){
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$duggatitle=$row['entryname'];
			$duggafile=$row['quizFile'];
			$duggarel=$row['qrelease'];
			$duggadead=$row['deadline'];

			$output = "<title>%TITLE%</title>";
			if ($duggafile === 'contribution') {
				$output = str_replace('%TITLE%', 'Contribution', $output);
			} else if ($duggafile === 'daily-minutes') {
				$output = str_replace('%TITLE%', 'Daily minutes', $output);
			} else {
				$output = str_replace('%TITLE%', 'Dugga viewer - ' . $duggatitle, $output);
			}
		}
		if($duggatitle!="UNK"){
			//echo "<script>setDuggaTitle('" . $duggatitle . "');</script>";
			echo $output;
			
			echo "<script src='templates/".$duggafile.".js'></script>";
			echo "</head>";
			echo "<body onload='setup();addAlertOnUnload();'>"; //Adds an alert when leaving page with changes.
		}else{													//^this also works as a event for doing things before page unloads.
			echo "</head>";										
			echo "<body onload='addAlertOnUnload()'>"; 			//Same as above but without other stuff.
		}
?>

	<?php
		$noup="SECTION";
		include '../Shared/navheader.php';
	?>

<div id='login_popup'>
<?php

// Check if we have a hash/hashpwd and dugga variant
//echo "|". print_r($_SESSION)."|<br>";
if(!isset($_SESSION["submission-$cid-$vers-$duggaid-$moment"])){
	$bytes = random_bytes(4);
	$hash=bin2hex($bytes);
	$_SESSION["submission-$cid-$vers-$duggaid-$moment"]=$hash;
	$bytes = random_bytes(4);
	$hashpwd=bin2hex($bytes);
	$_SESSION["submission-password-$cid-$vers-$duggaid-$moment"]=$hashpwd;

	// Randomly select variant from available variants
	$versarr=array();
	$sql="SELECT * FROM variant LEFT JOIN quiz ON quiz.id=variant.quizID WHERE disabled=0 AND quizID=:duggaid;";
	$query = $pdo->prepare($sql);
	$query->bindParam(':duggaid', $duggaid);
	$query->execute();
	foreach($query->fetchAll() as $row){
		array_push($versarr,$row['vid']);
	}
	
	if(!empty($versarr)){
		$rand_idx = array_rand($versarr, 1);
	}	

	if(sizeof($versarr) > 0){ //fixed error where 'array_rand' would give fatal error due to empty array
		$variant=$versarr[array_rand($versarr, 1)];
	}else{
		$debug=$variant="This dugga does not have any variants enabled!";
	}
	
	$_SESSION["submission-variant-$cid-$vers-$duggaid-$moment"]=$variant;
}else{
	$hash=$_SESSION["submission-$cid-$vers-$duggaid-$moment"];
	$hashpwd=$_SESSION["submission-password-$cid-$vers-$duggaid-$moment"];
	$variant=$_SESSION["submission-variant-$cid-$vers-$duggaid-$moment"];

}?>

</div>
	<!-- content START -->
	<div id="content">
		<?php
			if($duggafile!="UNK"){
				#depending of the type of dugga being loaded, use the appropriate layout and elements.
				if(file_exists ( "templates/".$duggafile.".html")){
					readfile("templates/".$duggafile.".html");

					if(checklogin() && (isSuperUser($_SESSION['uid']))) {
						#a teacher may not submit any duggas
						echo "<div id='submitButtonTable'>";
						echo "<input class='submit-button large-button' onclick='editDuggaInstruction()' type='button' value='Edit instructions'/>";	
						echo "</div>";
						
					}else if ($duggafile !== 'contribution') {						
						echo "<div id='submitButtonTable' class='submitButtonTable-center'>";
						echo "<input class='btn-disable submit-button large-button' type='button' value='Save' onclick='uploadFile(); showReceiptPopup();' />";
						if ($duggafile !== 'generic_dugga_file_receive') {
							echo "<input class='btn-disable submit-button large-button' type='button' value='Reset' onclick='reset();' />";
							echo "<input class='submit-button large-button' type='button' value='Load Dugga' onclick='showLoadDuggaPopup();' />";
						}
						echo "</div>";
					}

				}else{
					echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The dugga you asked for does not currently exist!</div>";
				}
			}else if ($visibility==1){
				if(file_exists ( "templates/".$duggafile.".html")){
					readfile("templates/".$duggafile.".html");

				}else{
					echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!</div>";
				}
        		echo "<div class='loginTransparent' id='lockedDuggaInfo' style='margin-bottom:5px;'>";
        		echo "<img src='../Shared/icons/duggaLock.svg'>";
        		echo "</div>";

			}else{
				echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> Something went wrong in loading the test. Contact LENASys-admin.</div>";
			}

		
		?>
	</div>
	
	<!-- formBox (receipt&Feedback-box ) Start! -->
	<div id='receiptBox' class="loginBoxContainer" style="display:none">
	  <div class="receiptBox formBox" style="max-width:400px; overflow-y:visible;">
			<div class='formBoxHeader'><h3>Dugga Submission Receipt</h3><div class='cursorPointer' onclick="hideReceiptPopup()">x</div></div>
			<div id='feedbackbox'>
				<span id='feedbackquestion'></span>
					<div id="ratingbox">
						<label for='r1'>1<br />
							<input type='radio' id='r1' value='1' name="rating">
						</label>
						<label for='r2'>2<br />
							<input type='radio' id='r2' value='2' name="rating">
						</label>
						<label for='r3'>3<br />
							<input type='radio' id='r3' value='3' name="rating">
						</label>
						<label for='r4'>4<br />
							<input type='radio' id='r4' value='4' name="rating">
						</label>
						<label for='r5'>5<br />
							<input type='radio' id='r5' value='5' name="rating">
						</label>
						<label for='r6'>6<br />
							<input type='radio' id='r6' value='6' name="rating">
						</label>
						<label for='r7'>7<br />
							<input type='radio' id='r7' value='7' name="rating">
						</label>
						<label for='r8'>8<br />
							<input type='radio' id='r8' value='8' name="rating">
						</label>
						<label for='r9'>9<br />
							<input type='radio' id='r9' value='9' name="rating">
						</label>
						<label for='r10'>10<br />
							<input type='radio' id='r10' value='10' name="rating">
						</label>
					</div>
					<div>
						<label for='contactable'><input type='checkbox' id='contactable' value='true'>It is okay to contact me	
						</label>
					</div>
					<div>
						<input type='button' class='submit-button'  onclick="sendFeedback(<?php echo "'". $duggatitle ."'" ?>)" value='Save feedback'>
						<span style='color:var(--color-green); text-align: center; line-height: 2.6; Display:none;' id='submitstatus'>Feedback saved</span>
					</div>
			</div>
			<div id='receiptInfo'></div>

			<?php 
			$parentDir = basename(dirname(__DIR__));
			#determine if it's https or http, add $_SERVER[HTTP_HOST] (url) and add hash. Might need to change s to either a or c, depending on type of submit.
			$receiptLink = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]/$parentDir/sh/?s=$hash";
			?>
    		<div id='emailPopup' style="display:block">
				<p>Your dugga has been saved. Be sure to store the hash and hash password in a safe place before submitting the dugga in canvas! <em>There is <strong>no way</strong> to restore a submission without the hash and hash password.</em></p>
				<div id="submission-receipt" rows="15" cols="50" style="height: 180px;resize: none; border-style: solid; border-width: 1px; font-size: 13px; font-weight: bold;">
					<?php echo $duggatitle; ?></br></br>
					Direct link (to be submitted in canvas):</br>
					<a type='link' href='<?php echo $receiptLink;?>' > <?php echo $receiptLink; ?></a></br></br>
					Hash:</br>
					<?php echo $hash; ?></br></br>
					Hash password:</br>
					<?php echo $hashpwd; ?></br></br>
				</div>					
				<div class="button-row">
					<input type='button' class='submit-button' onclick="copySubmissionReceiptToClipboard();" value='Copy Receipt'>
					<input type='button' class='submit-button'  onclick="hideReceiptPopup();" value='Close'>
				</div>
    		</div>
      </div>
	</div>
	<!-- Login Box (receipt&Feedback-box ) End! -->

<!---------------------=============####### Preview Popover #######=============--------------------->

	<?php
	#see no functionality for session var below. Is set to 1 in hashpasswordauth.php but never used.
	$_SESSION['pwdentrance'] = 0;
	?>
	
	<!-- Timer START -->
	<div id='scoreElement'>	
	</div>
	<!-- Test output -->
	<div id='groupAssignment'>
		<p id='clicks'><p>	
	</div>

	<div id='loadDuggaBox' class="loginBoxContainer" style="display:none">
	  <div class="loadDuggaBox formBox">
			<div class='formBoxHeader'><h3>Load dugga with hash</h3><div class='cursorPointer' onclick="hideLoadDuggaPopup()">x</div></div>
			<div id='loadDuggaInfo'></div>
    		<div id='loadDuggaPopup' style="display:block">
				<div class='inputwrapper'><span>Enter hash:</span><input class='textinput' type='text' id='hash' placeholder='Hash' value='' autocomplete="off"/></div>
				<div class="button-row">
					<input type='button' class='submit-button' onclick="loadDugga();" value='Load Dugga'>
				</div>
    		</div>
      </div>
	</div>

	<script>
</script>
	<!-- content END -->
	<?php
		include '../Shared/loginbox.php';
	?>

</head>

</body>
</html>
