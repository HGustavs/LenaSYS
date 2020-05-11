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

	// Gets username based on uid, USED FOR LOGGING
	$query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
	$query->bindParam(':uid', $userid);
	$query-> execute();

	// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
	while ($row = $query->fetch(PDO::FETCH_ASSOC)){
		$username = $row['username'];
	}


	logDuggaLoadEvent($cid, $userid, $username, $vers, $quizid, EventTypes::pageLoad);

if($cid != "UNK") $_SESSION['courseid'] = $cid;
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
      // If the user is a super user, get all quizes.
			$query = $pdo->prepare("SELECT quiz.id as id,entryname,quizFile,qrelease,deadline FROM listentries,quiz WHERE listentries.cid=:cid AND kind=3 AND listentries.vers=:vers AND quiz.cid=listentries.cid AND quiz.id=:quizid AND listentries.link=quiz.id;");
		}else if($readaccess){
      // If logged in and has access, get all private(requires login) and public quizes.
			$query = $pdo->prepare("SELECT quiz.id as id,entryname,quizFile,qrelease,deadline FROM listentries,quiz WHERE listentries.cid=:cid AND kind=3 AND listentries.vers=:vers AND (visible=1 OR visible=2) AND quiz.cid=listentries.cid AND quiz.id=:quizid AND listentries.link=quiz.id;");
		} else {
      // If not logged in, get only the public quizes.
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

			$output = "<title>%TITLE%</title>";
			if ($duggafile === 'contribution') {
				$output = str_replace('%TITLE%', 'Contribution', $output);
			} else if ($duggafile === 'daily-minutes') {
				$output = str_replace('%TITLE%', 'Daily minutes', $output);
			} else {
				$output = str_replace('%TITLE%', 'Dugga viewer - ' . $duggatitle, $output);
			}
			echo $output;
			
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

					if ($duggafile !== 'contribution') {
						echo "<table id='submitButtonTable' class='navheader'>";
						echo "<tr>";
						echo "<td align='center'>";
						echo "<input id='saveDuggaButton' class='submit-button large-button' type='button' value='Save' onclick='saveClick();' />";
						echo "<input class='submit-button large-button' type='button' value='Reset' onclick='reset();' />";
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
        if ($userid!="UNK") {
          echo "<p>Not registered to the course!	You can view the assignment but you need to be registered to the course to save your dugga result.</p>";
        } else {
  				echo "<p>Not logged in!	You can view the assignment but you need to be logged in and registered to the course to save your dugga result.</p>";
        }
        echo "</div>";

			}else{
				echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> Something went wrong in loading the test. Contact LENASys-admin.</div>";
			}
		?>
	</div>

	<!-- LoginBox (receiptbox) Start! -->
	<div id='receiptBox' class="loginBoxContainer" style="display:none">
      <div class="loginBox" style="max-width:400px;">
    		<div class='loginBoxheader'><h3>Kvitto - Duggasvar</h3><div class='cursorPointer' onclick="hideReceiptPopup()">x</div></div>
    		<div id='receiptInfo'></div>
    		<textarea id="receipt" autofocus readonly></textarea>
 <!--    		<div class="button-row">
    			<input type='button' class='submit-button'  onclick="showEmailPopup();" value='Save Receipt'>
    			<input type='button' class='submit-button'  onclick="hideReceiptPopup();" value='Close'>
    		</div>-->
    		<div id='emailPopup' style="display:block">
    			<div class='inputwrapper'><span>Ange din email:</span><input class='textinput' type='text' id='email' placeholder='Email' value=''/></div>
				<div class="button-row">
					<input type='button' class='submit-button'  onclick="sendReceiptEmail();" value='Send Receipt'>
					<input type='button' class='submit-button'  onclick="hideReceiptPopup();" value='Close'>
				</div>
    		</div>
      </div>
	</div>
	<!-- Login Box (receiptbox) End! -->

<!---------------------=============####### Preview Popover #######=============--------------------->

  <!--<div id='previewpopover' class='previewPopover' style='display:none;'>-->
  <div id='previewpopover' class='loginBoxContainer' style='display:none; align-items:stretch;'>
    <div style='width:100%; max-height:none;' class="loginBox">
    		<div class='loginBoxheader'>
    			<h3 style='width:100%;' id='Nameof'>Submission and feedback view</h3><div class='cursorPointer' onclick='closeWindows();'>x</div>
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
