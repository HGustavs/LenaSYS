<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Dugga Viewer</title>
		
	<link type="text/css" href="css/style.css" rel="stylesheet">
	<link type="text/css" href="templates/dugga.css" rel="stylesheet">

	<script src="js/jquery-1.11.0.min.js"></script>
	<script src="js/jquery-ui-1.10.4.min.js"></script>

	<script src="dugga.js"></script>
	
	<script>var querystring=parseGet();</script>

<?php
			date_default_timezone_set("Europe/Stockholm");
								
			$noup="SECTION";
			$loginvar="PDUGGA"; 
			include '../Shared/navheader.php';
			
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
			if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
				$hr = ((checklogin() && hasAccess($userid, $cid, 'r')) || $row['visibility'] != 0);
				if (!$hr) {
					if (checklogin()) {
						$hr = isSuperUser($userid);
					}
				}
			}

			// if we have permit, and if file exists, include javascript file.			
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

					if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
							$duggatitle=$row['entryname'];
							$duggafile=$row['quizFile'];
							$duggarel=$row['qrelease'];
							$duggadead=$row['deadline'];

							echo "<script src='templates/".$duggafile.".js'></script>";

							echo "</head>";
							echo "<body onload='readDugga();setup();'>";

					}else{
							echo "</head>";
							echo "<body>";							
					}

		}else{
					echo "</head>";
					echo "<body>";		
		}
?>

		
	<!-- content START -->
	<div id="content">
<?php

			// Log USERID for Dugga Access
			makeLogEntry($userid,1,$pdo,$cid." ".$vers." ".$quizid." ".$duggafile);
			
			// Put information in event log irrespective of whether we are allowed to or not.
			// If we have access rights, read the file securely to document
			if($duggafile!="UNK"&&$userid!="UNK"){
			  	if(file_exists ( "templates/".$duggafile.".html")){
					  	readfile("templates/".$duggafile.".html");
				  
							echo "<table width='100%'>";
							echo "<tr>";
								echo "<td align='center'>";
									echo "<input class='submit-button' type='button' value='Save' onclick='saveClick();' style='box-shadow:none;width:160px;height:48px;line-height:48px;' />";
								echo "</td>";
							echo "</tr>";
							echo "</table>";
				  
				  }else{
							echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!</div>";
				  }
			}else if ($userid=="UNK"){
					echo "<div class='err'><span style='font-weight:bold;'>Inte inloggad!</span> Du måste logga in för att kunna se och genomföra duggor. Klicka på symbolen längst upp till höger.</div>";
			}else {
					echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> Något gick fel vid hämtningen av duggan. Kontakta LENASys-adminsitratör.</div>";
			}								

	?>
			
	</div>

	<!-- Login Box Start! -->

  <div id='receiptBox' class="loginBox" style="display:none">
		<div id='receipt'>
			<div class='loginBoxheader'>
				<h3>Kvitto - Duggasvar</h3>
				<div onclick="hideReceiptPopup()">x</div>
			</div>
			  <div class="table-wrap">
				<table>
					<tr>
						<td>
							<textarea id="kvittotext" cols='20' rows='5' wrap='hard' style='width: 346px; height: 150px; resize: none;' autofocus readonly></textarea>
						</td>
					</tr>
					<tr>
						<td>
							<input type='button' class='submit-button' style="float: right;" onclick="hideReceiptPopup();" value='Stäng'>
						</td>
					</tr>
				</table>
			  </div>
		</div>
	</div>
	
	<!-- Login Box End! -->
				
	<!-- content END -->

	<?php
		include 'loginbox.php';
	?>
	
</body>
</html>
