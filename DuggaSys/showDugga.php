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
	$password= "UNK";

	$duggatitle="UNK";
	$duggafile="UNK";
	$duggarel="UNK";
	$duggadead="UNK";

	$visibility=false;
	$checklogin=false;
	$insertparam = false;
	
	$variantsize;
	$variants=array();
	$duggaid=getOPG('did');
	$moment=getOPG('moment');
	$courseid=getOPG('courseid');
	

	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="UNK";
	}


	// Get type of dugga
	$query = $pdo->prepare("SELECT * FROM quiz WHERE id=:duggaid;");
	$query->bindParam(':duggaid', $duggaid);
	$result=$query->execute();
	if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"quizfile Querying Error!");
	foreach($query->fetchAll() as $row) {
		$duggainfo=$row;
		$quizfile = $row['quizFile'];
	}

	// Retrieve all dugga variants
	$firstvariant=-1;
	$query = $pdo->prepare("SELECT vid,param,disabled FROM variant WHERE quizID=:duggaid;");
	$query->bindParam(':duggaid', $duggaid);
	$result=$query->execute();
	if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"variant Querying Error!");
	$i=0;
	foreach($query->fetchAll() as $row) {
		if($row['disabled']==0) $firstvariant=$i;
		$variants[$i]=array(
			'vid' => $row['vid'],
			'param' => $row['param'],
			'disabled' => $row['disabled']
		);
		$i++;
		$insertparam = true;
	}

	if ($hash != "UNK") {
		//echo "<script>console.log('asdasdsad')</script>";
		$query = $pdo->prepare("SELECT score,aid,cid,quiz,useranswer,variant,moment,vers,marked,submitted,password FROM userAnswer WHERE hash=:hash;");
		$query->bindParam(':hash', $hash);
		$query->execute();
		//$result = $query->fetch();
		//$password = $result["password"];

		if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
			$savedvariant=$row['variant'];
			$savedanswer=$row['useranswer'];
			$score = $row['score'];
			$isIndb=true;
	/* 		if ($row['feedback'] != null){
					$duggafeedback = $row['feedback'];
			} else {
					$duggafeedback = "UNK";
			} */
			//$grade = $row['grade'];
			$submitted = $row['submitted'];
			$marked = $row['marked'];
			$password = $row['password'];
		}
	}

/* 	$query = $pdo->prepare("SELECT score,aid,cid,quiz,useranswer,variant,moment,vers,uid,marked,feedback,grade,submitted FROM userAnswer WHERE uid=:uid AND cid=:cid AND moment=:moment AND vers=:coursevers;");
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':coursevers', $coursevers);
	$query->bindParam(':uid', $userid);
	$query->bindParam(':moment', $moment);
	$result = $query->execute(); */
	
	$savedvariant="UNK";
	$newvariant="UNK";
	$savedanswer="UNK";
	$isIndb=false;


	// If selected variant is not found - pick another from working list.
	// Should we connect this to answer or not e.g. if we have an answer should we still give a working variant??
	$foundvar=-1;
	foreach ($variants as $key => $value){
			if($savedvariant==$value['vid']&&$value['disabled']==0) $foundvar=$key;
	}
	if($foundvar==-1){
			$savedvariant="UNK";
	}

	// If there are many variants, randomize
	if($savedvariant==""||$savedvariant=="UNK"){
		// Randomize at most 8 times
		$cnt=0;
		do{
				$randomno=rand(0,sizeof($variants)-1);
				
				// If there is a variant choose one at random
				if(sizeof($variants)>0){
						if($variants[$randomno]['disabled']==0){
								$newvariant=$variants[$randomno]['vid'];						
						}
				} 
				$cnt++;
		}while($cnt<8&&$newvariant=="UNK");
		
		// if none has been chosen and there is a first one take that one.
		if($newvariant=="UNK" && $firstvariant!=-1) $newvariant=$firstvariant;
	}else{
		// There is a variant already -- do nothing!	
	}

	$savedvariant=$newvariant;

	// Retrieve variant
	if($insertparam == false){
			$param="NONE!";
	}
	foreach ($variants as $variant) {
		if($variant["vid"] == $savedvariant){
				$param=html_entity_decode($variant['param']);
		}
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

<!-- Finds the highest variant.quizID, which is then used to compare against the duggaid to make sure that the dugga is within the scope of listed duggas in the database -->
<?php
	$query = $pdo->prepare("SELECT MAX(quizID) FROM variant");
	$query->execute();
	$variantsize = $query->fetchColumn();
?>
<script type="text/javascript">
	// This if-statement will only store to localstorage if there is a variant.quizID
	// that match $duggaid. This is to prevent unecessary local storage when there is no matching variant, and in doing so, prevent swelling of the local storage
	if(<?php echo $duggaid; ?> <= <?php echo $variantsize; ?>) {
		// localStorageName is unique and depends on did
		var localStorageName = "duggaID: " + '<?php echo $duggaid; ?>';
		var variant;
		var newvariant = '<?php echo $newvariant; ?>';
		
		if(localStorage.getItem(localStorageName) == null){
			//localStorage.setItem(localStorageName, newvariant);
			setExpireTime(localStorageName, newvariant, 10000);
		}
		getExpireTime(localStorageName);

		variant = JSON.parse(localStorage.getItem(localStorageName));
		setVariant(variant);
		//setExpireTime(variant, )
	}

	variant = JSON.parse(localStorage.getItem(localStorageName));
	setVariant(variant);
  
	setPassword("<?php echo $password ?>");
	setHash("<?php echo $hash ?>");	

</script>
	<?php
		$noup="SECTION";
		include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content">
		<?php
			// Log USERID for Dugga Access

      // commented out because we are unsure about the usage of logs
			//makeLogEntry($userid,1,$pdo,$cid." ".$vers." ".$quizid." ".$duggafile);
  
			//Saved Dugga Login 
			if($hash!='UNK'){
				echo "<div class='loginBoxContainer' id='hashBox' style='display:block;'>";	
				echo "<div class='loginBox' style='max-width:400px; margin: 20% auto;'>";
				echo "<div class='loginBoxheader'>";
				echo "<h3>Login for Saved Dugga</h3>";
				echo "<div onclick='hideHashBox()' class='cursorPointer'>x</div>";
				echo "</div>";
				echo "<p>Enter your password for the hash</p>";
				echo "<input name='password' class='textinput' type='password' placeholder='Password'>";
				echo "<input type='submit' class='submit-button' value='Confirm' onclick='hideHashBox()'>";
				echo "</div>";
				echo "</div>";
			}

			function hashPassword($password, $hash){
				if($hash!='UNK'){
				exit();
				//Authentication Function
				}
			}
			//Retrieved from 'password' input field
			hashPassword($password, $hash);


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
        echo "</div>";

			}else{
				echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> Something went wrong in loading the test. Contact LENASys-admin.</div>";
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
    		<textarea id="receipt" autofocus readonly style="resize: none;"></textarea>
 
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

<!---------------------=============####### Preview Popover #######=============--------------------->

	<?php 
	if(isSuperUser($userid)){
    	echo '<script type="text/javascript">',
    	'displayDownloadIcon();', 'noUploadForTeacher();',
    	'</script>';
	}?>

  <!--<div id='previewpopover' class='previewPopover' style='display:none;'>-->
  <div id='previewpopover' class='loginBoxContainer' style='display:none; align-items:stretch;'>
    <div style='width:100%; max-height:none;' class="loginBox">
    		<div class='loginBoxheader'>
    			<h3 style='width:100%;' id='Nameof'>Submission and feedback view</h3><div class='cursorPointer' onclick='closeWindows();'>x</div>
    		</div>
    		<div style="position:absolute;left:0px;top:34px;bottom:0px;right:0px;">
    			<table width="100%" height="100%">
    					<tr>
    							<td width="75%" height="100%" id="popPrev" style="display:none;border:2px inset #aaa;background:#bbb; overflow:scroll;">
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
