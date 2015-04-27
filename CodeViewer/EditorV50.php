<!-----------------------------------------------------------------------------------------
                         Code Viewer V3 (CV3) 
-------------------------------------------------------------------------------------------

Version History

 1.0		 2010       - Code viewer version 1 - mostly manual with many issues
 2.0     2012       - Improved code viewer code by A. Grahn and J. Grimling
 3.0     2013-08-10 - Refactoring of existing code viewer (v1 and v2) base code together with working css demonstrator for independent scrolling windows
 3.01    2013-08-15 - Cockford parser implemented for c-like languages
 3.02    2013-08-16 - Improved back-end using database definition, ideas and code from WEBUG/DVP project 2013
                         Forward/Backward
                         Code
                         File list from upload directory 
                         Name of Example                        
 3.03    2013-08-18 - First iteration of back-end 
 3.05    2013-08-21 - Added new features to back-end
 												Separate tables for Important words and descriptions
 												Fields for play link and chosen wordlist
 												Updates of database from back-end 
 												Navigation using arrows (dropdown still missing)
 3.06	2013-08-21 - Create new example and save description 
 3.07   2013-08-22 - Section Editor
 3.08   2013-08-25 - Section Editor Back-End finished and more minor bug fixes
                      Linked to external CSS anf JS
 3.09   2013-08-30 - Login / Logout
                    - Viewer Functionality if not logged in
 3.10	2013-10-10 - 
 4.00   2014-05-30 - Release version from WEBUG/DVP project 2013
 5.00   2014-10-30 - Redacted version of 4.00
 5.10	2015-02-27 - Fixes for duggasys form
 
Bugs:
------------------
	
Missing Features:
------------------
Changing language -- All Strings in File that can be translated to fit other languages.... including language change.
    
Fixed Bugs:
------------------

Testing Link:

EditorV50.php?exampleid=1&courseid=1&cvers=2013
 
---->
<?php
	session_start();
	include_once("../../coursesyspw.php");
	include_once("../Shared/basic.php");
	include_once("../Shared/sessions.php");
	include_once("../Shared/database.php");
	include_once("../Shared/courses.php");
	pdoConnect();		
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Result Editor</title>
		<title>Code Viewer and Editor Version 3</title>
		<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">  
		<link type="text/css" href="../Shared/css/codeviewer.css" rel="stylesheet" />
		<link type="text/css" href="../Shared/css/whiteTheme.css" rel="stylesheet" />
		<link type="text/css" href="../Shared/css/responsive.css" rel="stylesheet" />
		<link type="text/css" href="../Shared/css/style.css" rel="stylesheet" />
		<script type="text/javascript" src="../Shared/js/jquery-1.11.0.min.js"></script>
		<script type="text/javascript" src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
		<script type="text/javascript" src="../Shared/dugga.js"></script>
		<script type="text/javascript" src="codeviewer.js"></script>
		<meta name="viewport" content="width=device-width, initial-scale=1">
	</head>
		<body onload="setup();">
		<!-- content START -->
		<div id="content">
		<?php 
			$exampleid = getOPG('exampleid');
			$courseID = getOPG('courseid');
			//get the visibility
			$query = $pdo->prepare( "SELECT public FROM codeexample WHERE exampleid = :exampleid';");
			$query->bindParam(':exampleid', $exampleid);
			$query-> execute();
			$row = $query -> fetch(PDO::FETCH_ASSOC);
			$public=$row['public'];	
			$noup="CODEVIEWER"; //Is called for in Shared/navheader.php, used to call for generic Home/Backbuttons
			$loginvar="CODV";
			$codeviewer = true;
			$codeviewerkind=false;
			if($courseID!="UNK"&&$exampleid!="UNK"){
				if(courseexists($courseID)){
					// If course exists - check login credentials
					// Logged in and with credentials - show full editor otherwise show viewer version 
					if(checklogin()){
						$ha=getAccessType($_SESSION['uid'], $courseID);
						if($ha == "w"){
							// Allowed to edit this course
							$codeviewerkind=true;
						}else{
							// No editing
							$codeviewerkind=false;
						}
						include '../Shared/navheader.php';
					}else{
						if($public == 0){
							$codeviewerkind=false;									
							include '../Shared/navheader.php';
							echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have to be logged in to view this code example.</div>";;
						}else{
							$codeviewerkind=false;
							include '../Shared/navheader.php';
						}
					}
				}else{
					$codeviewer = false;
					include '../Shared/navheader.php';
					// Print Warning If course does not exist!
					echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> Course does not seem to exist!</div>";
				}
			}else{
				$codeviewer = false;
				include '../Shared/navheader.php';
				echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> Course or Code Example does not seem to exist! <a href='./EditorV50.php?exampleid=1&courseid=1&cvers=2013'>Click here</a> to redirect to example 1.</div>";
			}
			echo "</div>";
			if($codeviewer) echo "<div id='div2'>If no content appears here... update your browser, enable javascript and try again.</div>";
		?>						
		<!--- Dropdowns START --->
		<span id='backwdrop' style='left:40px;display:none;' class='dropdown dropdownStyle backwdrop'><div class='dropdownback dropdownbackStyle'>Backw</div><span id='backwdropc'>oii</span></span>
		<span id='forwdrop' style='left:100px;display:none;' class='dropdown dropdownStyle forwdrop'><div class='dropdownback dropdownbackStyle'>Forw</div><span id='forwdropc'>bii</span></span>
		<!--- Dropdowns END --->
		<!--- Example Content Cog Wheel Dialog START --->
		<div id='editContent' class='loginBox' style='width:464px;display:none;'>
			<div class='loginBoxheader'>
				<h3>Edit Content</h3>
				<div onclick='closeEditContent();'>x</div>
			</div>	
			<table width="100%" style="table-layout:fixed;">
				<tr>
					<td>Title:</td>
					<td>Kind:</td>
				</tr>
				<tr>
					<td><input class='form-control textinput' type='text' id='boxtitle' value='Title' /></td>		
					<td><select id='boxcontent'><option value='DOCUMENT'>Document</option><option value='CODE'>Code</option><option value='HTML'>HTML</option></select></td>
				</tr>
				<tr>
					<td>Wordlist:</td>
					<td>File:</td>
				</tr>
				<tr>
					<td><select id='wordlist'></select></td>
					<td><select id='filename'></select></td>
				</tr>
				<tr>
					<td>Important Rows:</td>
				</tr>
				<tr>
					<td colspan="1"><select id='improws'></select></td>
					<td colspan="1"><input style="width:32px;" class='submit-button' type='button' value='-' onclick='editImpRows("-");' /></td>
				</tr>		
				<tr>
					<td colspan="1"><input style="width:91px;" class='form-control textinput' min='0' type='number' id='improwfrom' placeholder='From #' />&nbsp;-&nbsp;<input style="width:91px;" class='form-control textinput' min='0' type='number' id='improwto' placeholder='To #' /></td>
					<td colspan="1"><input style="width:32px;" class='submit-button' type='button' value='+' onclick='editImpRows("+");' /></td>
				</tr>		
			</table>
			<table width="100%">
				<tr>
					<td align='right'><input class='submit-button' type='button' value='Save' onclick='updateContent();' /></td>
				</tr>
			</table>
		</div>
		<!--- Example Content Cog Wheel Dialog END --->
		<!--- Code Example Cog Wheel Dialog START --->
		<div id='editExample' class='loginBox' style='width:464px;display:none;'>
			<div class='loginBoxheader'>
				<h3>Edit Example</h3>
				<div onclick='closeEditExample();'>x</div>
			</div>
			<table width="100%">
				<tr>
					<td>Title: <input class='form-control textinput' type='text' id='title' value='&lt;Title&gt;' /></td>		
					<td>Section Title: <input class='form-control textinput' type='text' id='secttitle' value='&lt;Section Title&gt;' /></td>		
				</tr>
				<tr>
					<td>Before: <select  id='before'></select></td>
					<td>After: <select  id='after'></select></td>
				</tr>
				<tr>
					<td>Play Link:</td>
					<td>Important Words:</td>
				</tr>
				<tr>
					<td colspan="1"><input class='form-control textinput' type='text' id='playlink' value='User Name' /></td>
					<td colspan="1"><input class='form-control textinput' type='text' id='impword' value='&lt;Important Word&gt;' </td>
					<input style="width:32px;" class='submit-button' type='button' value='+' onclick='editImpWords("+");' /></td>			
				</tr>
				<tr>
					<td colspan="2">&nbsp;<select style="float:none;" id='impwords'><input style="width:32px;" class='submit-button' type='button' value='-' onclick='editImpWords("-");' />
					</select></td>
				</tr>	
			</table>
			<table width="100%">
				<tr>
					<td align='right'><input class='submit-button' type='button' value='Save' onclick='updateExample();' /></td>
				</tr>
			</table>
		</div>
		<!--- Code Example Cog Wheel Dialog END --->
		<div id='chooseTemplate' class='loginBox' style='width:464px;display:none;'>
			<div class='loginBoxheader'>
				<h3>Edit Example</h3>
				<div onclick='closeTemplateWindow();'>x</div>
			</div>
			<table width="100%">
				<tr>
					<td id="templat1" class="tmpl"><input id="templateno" type="hidden" value="0" />
						<img class='templatethumbicon wiggle' onclick='changetemplate("1");' src='../Shared/icons/template1_butt.svg' />
					</td>
					<td id="templat2" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("2");' src='../Shared/icons/template2_butt.svg' /></td>
					<td id="templat3" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("3");' src='../Shared/icons/template3_butt.svg' /></td>
					<td id="templat4" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("4");' src='../Shared/icons/template4_butt.svg' /></td>
					<td id="templat5" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("5");' src='../Shared/icons/template5_butt.svg' /></td>
					<td id="templat6" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("6");' src='../Shared/icons/template6_butt.svg' /></td>
				</tr>		
			</table>
			<table width="100%">
				<tr>
					<td align='right'><input class='submit-button' type='button' value='Save' onclick='updateTemplate();' /></td>
				</tr>
			</table>
		</div>		
		<!--- Template Choosing Box --->
		<?php
			include '../Shared/loginbox.php';
		?>		
	</body>
</html>
