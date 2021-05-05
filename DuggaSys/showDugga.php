<?php
 	session_start();
?>
<!DOCTYPE html>
<html>
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
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";

	// Connect to database and start session
	pdoConnect();

	$cid=getOPG('courseid');
	$vers=getOPG('coursevers');
	$quizid=getOPG('did');
	$deadline=getOPG('deadline');
	$comments=getOPG('comments');
	$hash = getOPG("hash");
	$test=getOPG('test');
	
	
	$duggatitle="UNK";
	$duggafile="UNK";
	$duggarel="UNK";
	$duggadead="UNK";

	$visibility=false;
	$checklogin=false;

	$duggaid=getOPG('did');
	$moment=getOPG('moment');
	$courseid=getOPG('courseid');

	if(isset($_SESSION['hashpassword'])){
		$hashpassword=$_SESSION['hashpassword'];
	}else{
		$hashpassword='UNK';
	}	

	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="UNK";
	}

	//logDuggaLoadEvent($cid, $userid, $username, $vers, $quizid, EventTypes::pageLoad);

if($cid != "UNK") $_SESSION['courseid'] = $cid;
	$hr=false;
	$query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:cid");
	$query->bindParam(':cid', $cid);
	$result = $query->execute();
	if($row = $query->fetch(PDO::FETCH_ASSOC)){
			$visibility=$row['visibility'];
	}
	
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

		if($row = $query->fetch(PDO::FETCH_ASSOC)){
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
			echo "<script>setDuggaTitle('" . $duggatitle . "');</script>";
			echo $output;
			
			echo "<script src='templates/".$duggafile.".js'></script>";
			echo "</head>";
			echo "<body onload='setup();'>";
		}else{
			echo "</head>";
			echo "<body>";
		}
?>
<script type="text/javascript">

	setHash("<?php echo $hash ?>");

</script>


	<?php
		$noup="SECTION";
		include '../Shared/navheader.php';
	?>

<div id='login_popup'>
<?php
function hashPassword($password, $hash){
		if($password == 'UNK')
			return false;
		global $pdo;
		$sql = "SELECT hash,password FROM userAnswer WHERE '" .$password. "' LIKE password AND '".$hash."' LIKE hash";
		$query = $pdo->prepare($sql);
		$query->execute();
		$count = $query->rowCount();
			if($count == 0){
				echo '<script>console.log(false)</script>';
				echo "<script>console.log('".$count."')</script>;";
				return false;
			} else{
				echo '<script>console.log(true)</script>';
				echo "<script>console.log('".$count."')</script>;";
				return true;
			}
}
echo "<script>console.log('".$hash."')</script>;";
echo "<script>console.log('".$hashpassword."')</script>;";
//Saved Dugga Login
if($hash!='UNK'){
	if(!hashPassword($hashpassword, $hash)){
		if($_SESSION['hasUploaded'] != 1){
			echo "<div class='loginBoxContainer' id='hashBox' style='display:block;'>";	
			echo "<div class='loginBox' style='max-width:400px; margin: 20% auto;'>";
			echo "<div class='loginBoxheader'>";
			echo "<h3>Login for Saved Dugga</h3>";
			echo "<div onclick='hideHashBox()' class='cursorPointer'>x</div>";
			echo "</div>";
			echo "<p id='passwordtext'>Enter your password for the hash:</p>";
			echo "<p id='hash' style='font-weight: bold;'>$hash</p>";
			echo "<input id='passwordfield' name='password' class='textinput' type='password' placeholder='Password'>";
			echo "<input type='submit' class='submit-button' value='Confirm' name='Confirm' onclick='checkHashPassword()'>";
			echo "</div>";
			echo "</div>";
			exit();
		}
		
	}
}



//Remove if you want the password to be persistent.
//$_SESSION['hashpassword'] = 'UNK';

?>

</div>
	<!-- content START -->
	<div id="content">
		<?php
		echo "<script>console.log('".$duggafile."');</script>";
			// Log USERID for Dugga Access
			// commented out because we are unsure about the usage of logs
			//makeLogEntry($userid,1,$pdo,$cid." ".$vers." ".$quizid." ".$duggafile);
			//Retrieved from 'password' input field
			// Put information in event log irrespective of whether we are allowed to or not.
			// If we have access rights, read the file securely to document
			// Visibility: 0 Hidden 1 Public 2 Login 3 Deleted
			// if($duggafile!="UNK"&&$userid!="UNK"&&($readaccess||isSuperUser($userid))){
			if($duggafile!="UNK"){
				if(file_exists ( "templates/".$duggafile.".html")){
					readfile("templates/".$duggafile.".html");

					if ($duggafile !== 'contribution') {						
						echo "<table id='submitButtonTable' class='navheader'>";
						echo "<tr>";
						echo "<td align='left'>";
						echo "<input id='saveDuggaButton' class='submit-button large-button' type='button' value='Save' onclick='saveClick();' />";
						if ($duggafile !== 'generic_dugga_file_receive') {
							echo "<input class='submit-button large-button' type='button' value='Reset' onclick='reset();' />";
						}
						echo "</td>";
						echo "<td align='right'>";
						echo "<input id='loadDuggaButton' class='submit-button large-button' type='button' value='Load Dugga' onclick='showLoadDuggaPopup();' />";
						echo "</td>";
						echo "</tr>";
						echo "</table>";
					}

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
        		echo "</div>";

			}else{
				echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> Something went wrong in loading the test. Contact LENASys-admin.</div>";
			}

			// Feedback area START
			if(isSuperUser($userid) && $hash!='UNK'){
				echo "<div id='container' style='margin:0px;'>";
					echo "<div class='instructions-container'>";
						echo "<div class='instructions-button' onclick='toggleFeedback()'><h3>Feedback</h3></div>";
							echo "<div class='feedback-content' style=' -webkit-columns: 1; -moz-columns: 1; columns: 1; ' id='snus'>";
								echo "<textarea name='feedback' id='feedback' style='float: left; width: 100%; min-height: 75px;'></textarea><br>";
								echo "<input class='submit-button large-button' type='button' value='Skicka feedback' />";
							echo "</div>";
						echo "</div>";
					echo "</div>";
				echo "</div>";
			}
		?>
	</div>

	<!-- LoginBox (receipt&Feedback-box ) Start! -->
	<div id='receiptBox' class="loginBoxContainer" style="display:none">
	  <div class="receiptBox loginBox" style="max-width:400px; overflow-y:visible;">
			<div class='loginBoxheader'><h3>Kvitto och feedback - Duggasvar</h3><div class='cursorPointer' onclick="hideReceiptPopup()">x</div></div>
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
						<label for='contactable'><input type='checkbox' id='contactable' value='true'>Det går bra att kontakta mig	
						</label>
					</div>
					<div>
						<input type='button' class='submit-button'  onclick="sendFeedback(<?php echo "'". $duggatitle ."'" ?>)" value='Save feedback'>
						<span style='color:var(--color-green); text-align: center; line-height: 2.6; Display:none;' id='submitstatus'>Feedback saved</span>
					</div>
			</div>
			<div id='receiptInfo'></div>

    		<div id='emailPopup' style="display:block">
				<div id='urlAndPwd'>
					<div class="testasd"><p class="bold">URL</p><p id='url'></p></div>
					<div class="testasd"><p class="bold">Password</p><p id='pwd'></p></div>
				</div>
				
				<div class="button-row">
					<input type='button' class='submit-button' onclick="copyHashtoCB();" value='Copy Hash'>
					<input type='button' class='submit-button'  onclick="hideReceiptPopup();" value='Close'>
				</div>
    		</div>
      </div>
	</div>
	<!-- Login Box (receipt&Feedback-box ) End! -->


	<!-- Load Dugga Popup (Enter hash to get redirected to specified dugga) -->
	<div id='loadDuggaBox' class="loginBoxContainer" style="display:none">
	  <div class="loadDuggaBox loginBox" style="max-width:400px; overflow-y:visible;">
			<div class='loginBoxheader'><h3>Hämta dugga genom hash</h3><div class='cursorPointer' onclick="hideLoadDuggaPopup()">x</div></div>
			<div id='loadDuggaInfo'></div>
    		<div id='loadDuggaPopup' style="display:block">
				<div class='inputwrapper'><span>Ange din hash:</span><input class='textinput' type='text' id='hash' placeholder='Hash' value=''/></div>
				<div class="button-row">
					<input type='button' class='submit-button' onclick="loadDugga();" value='Load Dugga'>
					<input type='button' class='submit-button' onclick="hideLoadDuggaPopup();" value='Close'>
				</div>
    		</div>
      </div>
	</div>
	<!-- Load Dugga Popup (Enter hash to get redirected to another dugga) End! -->

	<!-- Load Variant Popup (Change variant locally to check if the variant is presented) -->
	<div id='loadVariantBox' class="loginBoxContainer" style="display:none">
	  <div class="loadDuggaBox loginBox" style="max-width:400px; overflow-y:visible;">
			<div class='loginBoxheader'><h3>Hämta variant av dugga</h3><div class='cursorPointer' onclick="hideLoadVariantPopup()">x</div></div>
			<div id='loadDuggaInfo'></div>
    		<div id='loadDuggaPopup' style="display:block">
				<div class='inputwrapper'><span>Varianter:</span><br></div>
				<div class="button-row">
					<input type='button' class='submit-button' onclick="loadDugga();" value='Load variant'>
					<input type='button' class='submit-button' onclick="hideLoadVariantPopup();" value='Close'>
				</div>
    		</div>
      </div>
	</div>
	<!-- Load Variant Popup (Change variant locally to check if the variant is presented) End! -->


<!---------------------=============####### Preview Popover #######=============--------------------->

	<?php 
	if(isSuperUser($userid)){
		if($hash == "UNK"){
			echo '<script type="text/javascript">toggleLoadVariant(true);</script>';
		}
    	echo '<script type="text/javascript">',
    	'displayDownloadIcon();', 'noUploadForTeacher();',
    	'</script>';
	}
	?>
	
	<!-- Timer START -->
	<div id='scoreElement'>	
	</div>
	<!-- Test output -->
	<div id='groupAssignment'>
		<p id='clicks'><p>	
	</div>
	<!-- content END -->
	<?php
		include '../Shared/loginbox.php';
	?>

</head>
</body>
</html>
