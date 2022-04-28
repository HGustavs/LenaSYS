<?php
	include_once "../Shared/sessions.php";
	include_once "../Shared/basic.php";

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
	// Connect to database and start session
	pdoConnect();

	$cid=getOPG('courseid');
	$vers=getOPG('coursevers');
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
//	$queryArray = array($cid, $vers, $quizid);

	#vars for handling fetching of diagram variant file name
	$variantParams = "UNK";
	$filePath ="";
	#$finalArray = [];
	$fileContent="UNK";
	$splicedFileName = "UNK";
	$isGlobal = -1;
	$count = 0;
	
	#create request to database and execute it
	$response = $pdo->prepare("SELECT param as jparam FROM variant LEFT JOIN quiz ON quiz.id = variant.quizID WHERE quizID = $quizid AND quiz.cid = $cid;");
	$response->execute();

	#loop through responses, fetch param column in variant table, splice string to extract file name, then close request.
	foreach($response->fetchAll(PDO::FETCH_ASSOC) as $row)
	{
		$variantParams=$row['jparam'];
		$start = strpos($variantParams, "diagram File&quot;:&quot;") + 25;
		$end = strpos($variantParams, "&quot;:&quot;&quot;,&quot;diagram_type") - 177;
		$splicedFileName = substr($variantParams, strpos($variantParams, "diagram File&quot;:&quot;") + 25, ($end - $start));
	}
	$response->closeCursor();

	$doesFileExist = @file_get_contents("../courses/global/"."$splicedFileName");
	if($doesFileExist === FALSE)
	{
		$doesFileExist = @file_get_contents("../courses/".$cid."/"."$splicedFileName");

		if($doesFileExist === FALSE)
		{
			$doesFileExist = @file_get_contents("../courses/".$cid."/"."$vers"."/"."$splicedFileName");
		}
	}

	if($doesFileExist === FALSE)
	{
		$fileContent = "NO_FILE_FETCHED";
	}
	else{
		$fileContent = $doesFileExist;
	}

	#I have no idea what the things below
	// if(isset($_SESSION['hashpassword'])){
	// 	$hashpassword=$_SESSION['hashpassword'];
	// }else{
	// 	$hashpassword='UNK';
	// }	

	// if(isset($_SESSION['uid'])){
	// 	$userid=$_SESSION['uid'];
	// }else{
	// 	$userid="UNK";
	// }

	// if(!isset($_SESSION['hasUploaded'])){
	// 	$_SESSION['hasUploaded'] = "UNK";
	// }

	// if(!isset($_SESSION['pwdentrance'])){
	// 	$_SESSION['pwdentrance'] = 0;
	// }
	//logDuggaLoadEvent($cid, $userid, $username, $vers, $quizid, EventTypes::pageLoad);

// if($cid != "UNK") $_SESSION['courseid'] = $cid;
// 	$hr=false;
// 	$query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:cid");
// 	$query->bindParam(':cid', $cid);
// 	$result = $query->execute();
// 	if($row = $query->fetch(PDO::FETCH_ASSOC)){
// 			$visibility=$row['visibility'];
// 	}
	
/*
		//Give permit if the user is logged in and has access to the course or if it is public
		$hr = ((checklogin() && hasAccess($userid, $cid, 'r')) || $row['visibility'] != 0  && $userid != "UNK");

		if(!$hr){
			if (checklogin()){
				$hr = isSuperUser($userid);$hr;
			}
		}
*/

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
			echo "<body onload='setup();'>";
		}else{
			echo "</head>";
			echo "<body>";
		}
?>

<!--<script type="text/javascript">

	setHash("<?php /*echo $hash*/ ?>");

</script>-->



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
	//echo "<br>submission-$cid-$vers-$duggaid-$moment<br>";
	//echo "|$hash|$hashpwd|$variant|$moment|<br>";
}else{
	$hash=$_SESSION["submission-$cid-$vers-$duggaid-$moment"];
	$hashpwd=$_SESSION["submission-password-$cid-$vers-$duggaid-$moment"];
	$variant=$_SESSION["submission-variant-$cid-$vers-$duggaid-$moment"];
	//echo "<br>submission-$cid-$vers-$duggaid-$moment<br>";
	//echo "|$hash|$hashpwd|$variant|$moment|<br>";
}

//Remove if you want the password to be persistent.
//$_SESSION['hashpassword'] = 'UNK';
?>
</div>
	<!-- content START -->
	<div id="content">
		<?php
		//echo "<script>console.log('".$duggafile."');</script>";
			// Log USERID for Dugga Access
			// commented out because we are unsure about the usage of logs
			//makeLogEntry($userid,1,$pdo,$cid." ".$vers." ".$quizid." ".$duggafile);
			//Retrieved from 'password' input field
			// Put information in event log irrespective of whether we are allowed to or not.
			// If we have access rights, read the file securely to document
			// Visibility: 0 Hidden 1 Public 2 Login 3 Deleted
			// if($duggafile!="UNK"&&$userid!="UNK"&&($readaccess||isSuperUser($userid))){

			$btnDisable = "btn-disable";

			if($duggafile!="UNK"){
				if(file_exists ( "templates/".$duggafile.".html")){
					readfile("templates/".$duggafile.".html");

					if(isSuperUser($userid)){
						// A teacher may not submit any duggas
						echo "<table id='submitButtonTable' class='navheader'>";
						echo "</table>";
					}else if ($duggafile !== 'contribution') {						
						echo "<table id='submitButtonTable' class='navheader'>";
						echo "<tr>";
						echo "<td align='left'>";
						echo "<input id='saveDuggaButton' class='".$btnDisable." submit-button large-button' type='button' value='Save' onclick='saveClick();' />";
						if ($duggafile !== 'generic_dugga_file_receive') {
							echo "<input class='".$btnDisable." submit-button large-button' type='button' value='Reset' onclick='reset();' />";
							echo "<td align='right'>";
							echo "<input id='loadDuggaButton' class='submit-button large-button' type='button' value='Load Dugga' onclick='showLoadDuggaPopup();' />";
							echo "</td>";
							
						}

						echo "</td>";
						echo "</tr>";
						echo "</table>";
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

	<!-- LoginBox (receipt&Feedback-box ) Start! -->
	<div id='receiptBox' class="loginBoxContainer" style="display:none">
	  <div class="receiptBox loginBox" style="max-width:400px; overflow-y:visible;">
			<div class='loginBoxheader'><h3>Dugga Submission Receipt</h3><div class='cursorPointer' onclick="hideReceiptPopup()">x</div></div>
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

    		<div id='emailPopup' style="display:block">
				<p>Your dugga has been saved. Besure to store the hash and hash password in a safe place before submitting the dugga in canvas! <em>There is <strong>no way</strong> to restore a submission without the hash and hash password.</p>
				<textarea readonly id="submission-receipt" rows="15" cols="50" style="height: 180px;resize: none;"></textarea>					
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
	if(isSuperUser($userid) || hasAccess($userid, $cid, 'w') || hasAccess($userid, $cid, 'st')){
		if($hash == "UNK"){		//A teacher should not be able to change the variant (local) if they are grading an assignment.
			//echo '<script type="text/javascript">toggleLoadVariant(true);</script>';
		}
    	//echo '<script type="text/javascript">','displayDownloadIcon();', 'noUploadForTeacher();','</script>';
	}

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
	  <div class="loadDuggaBox loginBox" style="max-width:400px; overflow-y:visible;">
			<div class='loginBoxheader'><h3>Load dugga with hash</h3><div class='cursorPointer' onclick="hideLoadDuggaPopup()">x</div></div>
			<div id='loadDuggaInfo'></div>
    		<div id='loadDuggaPopup' style="display:block">
				<div class='inputwrapper'><span>Enter hash:</span><input class='textinput' type='text' id='hash' placeholder='Hash' value='' autocomplete="off"/></div>
				<div class="button-row">
					<input type='button' class='submit-button' onclick="loadDuggaType();" value='Load Dugga'>
				</div>
    		</div>
      </div>
	</div>
	<script type="text/javascript">
	function getVariantParam()
	{
		var variantArray = [<?php echo "'$variantParams'"?>];
		variantArray.push(<?php echo "$cid"?>);
		variantArray.push(<?php echo "$vers"?>);
		variantArray.push(<?php echo "'$splicedFileName'"?>);
		variantArray.push(<?php echo "'$fileContent'"?>);
		return variantArray;
	} 
	</script>

	<script>
</script>
	<!-- content END -->
	<?php
		include '../Shared/loginbox.php';
	?>

</head>

</body>
</html>
