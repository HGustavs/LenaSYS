<?php session_start(); ?>
<html>
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
 3.06		 2013-08-21 - Create new example and save description 
 3.07    2013-08-22 - Section Editor
 3.08    2013-08-25 - Section Editor Back-End finished and more minor bug fixes
                      Linked to external CSS anf JS
 3.09    2013-08-30 - Login / Logout
                    - Viewer Functionality if not logged in
 3.10		 2013-10-10 - 

 Bugs:
	[*] Possible to navigate using buttons to numbers beyond existing positions - unknown under which conditions
	
Missing Features:
	[*] Loading other files than code
  [*] Centralized file upload
  [*] Timed error message if no content has loaded after 30 sec.
  [*] Multiple file select using colors - ex	red for file1, green for file 2 and blue for file 3
  [*] Hover of current row possible?
	[*] Hash arrays better than dense arrays for features - now we write: data['improws'][i][1] instead of data['improws'][i]['name'] which is much less error prone
  [*] Move to PDO to save space and face
  [*] User Agent Logging
	[*] Student Login - To protect content from outside persons
	[*] Hide Row numbers Button for copy-pastists
  [*] Important words not highlighted in Description Box
  [*] Code display vs Run button - What if we want to run other code than we display e.g. WebGL?
  [*] Empty descriptions are not saved properly.
    
Fixed Bugs:
	[*] Play Link Visible even if we have nothing to run
	(*) Undefined variable filename (if there is no file created for example - create file with example creation and also fix bug!) 
	[*] Canot choose file if no file table entry was created (create file entry upon creation of example).
	[*] Dehtml has unpredictive behavior
	[*] Versioning Does not Work
  [*] Backward / Forward Link List Does not Work when clicked
	[*] Hide Backward / Forward button if Either List is Empty
  [*] Only show arrows if skipping F / B is possible to avoid confusion. Should be simple!
	[*] Does not work if section name has spaces in name. Must encode the section name parameter better
	[*] Duplicate names of examples are created when create section button is pressed repeatedly
	[*] Generates incorrect javascript if course etc does not exist
	[*] Generates JSON and error messages even if course does not exist
	[*] Selected lines and important words list are not used
	[*] Dropd is null error - was hiding dropdowns even if they were not generated due to not being logged in
	[*] Output breaks if there are no important lines - must have special case for no important lines
	[*] Output breaks if string is empty before line number. Add &nbsp;

Testing Link:

EditorV30.php?courseid=Webbprogrammering&sectionid=Javascript&version=2013&position=3
 
---->

	<head>

		<title>Code Viewer and Editor Version 3</title>
		<link type="text/css" href="css/template1.css" rel="stylesheet" />
		<link type="text/css" href="css/codeviewer.css" rel="stylesheet" />
		<link type="text/css" href="css/blackTheme.css" rel="stylesheet" />		
		<script type="text/javascript" src="js/jquery-1.5.1.min.js"></script>
        <script type="text/javascript" src="js/codeviewer.js"></script>
        <script type="text/javascript" src="js/tooltips.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1">


<?php
				include_once("../../coursesyspw.php");
				include_once("basic.php");
				include_once("../Shared/database.php");
				dbConnect();
				
                echo'<script>';
				jsvarget("courseid","courseID");				
				jsvarget("position","position");
				jsvarget("version","version");
				jsvarget("exampleid","exampleid");
				
				$kind = "r";
				if(array_key_exists('uid', $_SESSION)) {
					$type = getAccessType($_SESSION['uid'], $_GET['courseid']);
					// If we get a type back, set it.
					if($type)
						$kind = $type;
				}
				echo "var sessionkind='" . $kind . "';";			
?>				
				console.log(courseID);

				function AJAXService(sname,param)
				{	
					$.ajax({url: "editorService.php", type: "POST", data: "exampleid="+exampleid+"&opt="+sname+param, dataType: "json", success: returned});
				<!--		$.ajax({url: "editorService.php", type: "POST", data: "coursename="+courseID+"&version="+version+"&position="+position+"&opt="+sname+param, dataType: "json", success: returned});	  -->														
				}

<!--                Alternative function used only when editing codeexample-descriptionbox-->
                function AJAXService2(sname,param)
                {
                	$.ajax({url: "editorService.php", type: "POST", data: {coursename:courseID,version:version,sectionid:sectionID,position:position,opt:sname,description:param}, dataType: "json", success: returned});
                }

		
		</script>
	</head>
	
<?php

	$exampleid = $_GET['exampleid'];
	//get the visibility
	$query = "SELECT visible FROM listentries WHERE code_id='$exampleid';";
	$result=mysql_query($query);
	if (!$result) err("SQL Query Error: ".mysql_error(),"Field Querying Error!" . __LINE__);	
	$row = mysql_fetch_assoc($result);
	Print "<b>Visible:</b> ".$row['visible'] . " "; 
	
					
	
		if(isset($_GET['courseid'])){
				$courseID=$_GET['courseid'];
				if(courseexists($courseID)){
						// If course exists - check login credentials
						// Logged in and with credentials - show full editor otherwise show viewer version 

						if(checklogin()){
							$ha=getAccessType($_SESSION['uid'], $courseID);
							if($ha == "w"){
								// Allowed to edit this course
								editcodemenu(true);
							}else{
								// No editing
								editcodemenu(false);
							}
						}else{
								editcodemenu(false);
						}
						
				}else{
						// Print Warning If course does not exist!
						bodywarning("This course does not seem to exist!");
				}
		}else{
				bodywarning("This course does not seem to exist!");
		}

?>			

</body>
</html>

        <!--Place tooltips on all objects with a title-->
        <script>

    $( document ).ready(function() {

        setTimeout(function() {

            $("*[title]").tooltips();

        }, 800);


    });

        </script>
