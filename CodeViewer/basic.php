<?php

	//---------------------------------------------------------------------------------------------------------------
	// err - Displays nicely formatted error and exits
	//---------------------------------------------------------------------------------------------------------------
	
	function err ($errmsg,$hdr='')
	{
		if(!empty($hdr)){
				echo($hdr);
		}
		print "<p><span class=\"err\">Serious Error: <br /><i>$errmsg</i>.";
		print "</span></p>\n";
		exit;
	}
	
	//---------------------------------------------------------------------------------------------------------------
	// dbconnect - Makes database connection
	//---------------------------------------------------------------------------------------------------------------
	
	function dbConnect()
	{
		$printHeaderFunction=0;
		// Send header info to err()?
		if ($printHeaderFunction) {
			$hdr = 'Database Connection Error';
		} else {
			$hdr = '';
		}
	
		// Connect to DB server
		$OC_db = mysql_connect(DB_HOST,DB_USER,DB_PASSWORD) or err("Could not connect to database ".mysql_errno(),$hdr);
		mysql_set_charset('utf8',$OC_db); 
		// Select DB
		mysql_select_db(DB_NAME) or err("Could not select database \"".DB_NAME."\" error code".mysql_errno(),$hdr);
		
	}

	//---------------------------------------------------------------------------------------------------------------
	// endsWith - Tests if a string ends with another string - defaults to being non-case sensitive
	//---------------------------------------------------------------------------------------------------------------
	
	function endsWith($haystack,$needle,$case=true)
	{
	    if($case){return (strcmp(substr($haystack, strlen($haystack) - strlen($needle)),$needle)===0);}
	    return (strcasecmp(substr($haystack, strlen($haystack) - strlen($needle)),$needle)===0);
	}
	
	//---------------------------------------------------------------------------------------------------------------
	// endsWith - Tests if a string ends with another string - defaults to being non-case sensitive
	//---------------------------------------------------------------------------------------------------------------
	
	function loginwin()
	{
			echo "<html>";
			echo "<title>Code Viewer and Editor Version 3 Login Service</title>";
			echo	"<link type='text/css' href='css/codeviewer.css' rel='stylesheet' />";	

			echo "<body><table width='100%' height='100%'><tr><td align='center' valign='center'>";
			echo "<div id='loginbox'><span id='loginheading'>Code Example Editor Login</span><form method='post' action='loginlogout.php'>";
			echo "<div class='loginleft'><br/>Login Name:<br/><input name='loginname' type='text' class='logininput'><br/><br/>";
			echo "Password:<br/><input name='passwd' type='password' class='logininput'><br/><br/><br/></div>";
			echo "<div class='logincenter'><button class='loginbutton'>Login</button><br/></div><input type='hidden' name='reply' value='Foo'></form></div>";
			echo "</td></tr></table></body></html>";

	}

	//---------------------------------------------------------------------------------------------------------------
	// checklogin - Checks Login Credentials and initiates the kind session variable that holds the credentials
	//---------------------------------------------------------------------------------------------------------------
	
	function checklogin()
	{
		$usernme="NONE!";
		$passwd="NONE!";

		// If neither session nor post return not logged in
		if(isset($_SESSION["loginname"])&&isset($_SESSION["passwd"])){
				$usernme=$_SESSION["loginname"];
				$passwd=$_SESSION["passwd"];				
		}else if(isset($_POST["loginname"])&&isset($_POST["passwd"])){
				$usernme=$_POST["loginname"];
				$passwd=$_POST["passwd"];				
		}else{	
				return false;
		}
				
		$querystring="SELECT * FROM appuser WHERE loginname='$usernme' and passwd='$passwd' limit 1;";
		$result=mysql_query($querystring);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
		while ($row = mysql_fetch_assoc($result)){
				if(isset($row['kind'])){
						$_SESSION["loginname"]=$usernme;
						$_SESSION["passwd"]=$passwd;
						$_SESSION["kind"]=$row['kind'];
						return true;
				}
		}		
		return false;				
	}	

	//---------------------------------------------------------------------------------------------------------------
	// courseexists - Checks if a cerain course exists or not
	//---------------------------------------------------------------------------------------------------------------
	
	function courseexists($coursename)
	{		
		$guf=false;
		$querystring="SELECT * FROM course WHERE coursename='$coursename';";
		$result=mysql_query($querystring);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
		while ($row = mysql_fetch_assoc($result)){
			$guf=true;
		}
		
		return $guf;
	}

	//---------------------------------------------------------------------------------------------------------------
	// logout
	//---------------------------------------------------------------------------------------------------------------
	
	function logout()
	{
			$_SESSION["loginname"]="NONE!";
			$_SESSION["passwd"]="NONE!";
			$_SESSION["kind"]="NONE!";

			session_destroy();
	}

	//---------------------------------------------------------------------------------------------------------------
	// bodywarning - prints a nicely formatted warning
	//---------------------------------------------------------------------------------------------------------------

	function bodywarning($msg)
	{
			echo "<body>";
			echo "<span style='text-align:center;'><div class='warning'>";
			echo $msg."<hr/>";
			echo "Do not forget to use a recent browser and to enable Javascript.<br/>";
			echo "</div></span>";
			echo "</body>";		
	}

	//---------------------------------------------------------------------------------------------------------------
	// editsectionmenu - Displays an editable or un-editable section menu
	//---------------------------------------------------------------------------------------------------------------

		function editsectionmenu($kind)
		{
				echo "<body onload='AJAXServiceSection(\"\",\"\");'>";
	
				// Course Content List - If course exists!
				echo "<table width='100%'><tr><td rowspan='2'><div id='Sectionlist'>";
				echo "<div style='left:20px' class='warning'>";
				echo "Please wait while content loads<br/>";
				echo "<img src='icons/Starspinner3.gif' /><br/>";
				echo "Do not forget to enable Javascript<br/>";
				echo "</div>";
				echo "</div></td>";

				// Login log out button

				echo "<td align='right' valign='top'>";
				echo "<table cellspacing='2'><tr>";
				if($kind){
						echo "<td class='buttos' onclick='newSection(\"1\");'><img src='icons/Plus.svg' /></td>";
						echo "<td class='buttos' onclick='newSection(\"2\");'><img src='icons/Bold.svg' /></td>";
				}
				echo "<td align='right' class='butto' onclick='location=\"loginlogout.php\";'><img src='icons/Man.svg' /></td>";
				echo "</tr></table>";

				echo "</tr><tr><td></td></tr></table>";

				echo "</body>";
				echo "</html>";		

		}

	//---------------------------------------------------------------------------------------------------------------
	// courselist - Displays a list of the current courses
	//---------------------------------------------------------------------------------------------------------------
		
		function courselist()
		{		
						echo "<span class='inv'>LenaSYS</span>";
						echo "<table width='100%'><tr><td rowspan='2'><div id='Sectionlist'>";
						echo "<span class='course'>Course Example Organization System</span>";
						
						$querystring="SELECT course.coursename,max(cversion) AS version FROM course LEFT OUTER JOIN section ON course.coursename=section.coursename GROUP BY course.coursename;;";
						$result=mysql_query($querystring);
						if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
						while ($row = mysql_fetch_assoc($result)){
								echo "<span class='bigg'><a href='Sectioned.php?courseid=".$row['coursename']."&vers=".$row['version']."'>".$row['coursename']."</a></span>";
						}	

						echo "</div></td>";
						echo "<td align='right' class='butto' onclick='location=\"loginlogout.php\";'><img src='icons/Man.svg' /></td>";
						echo "</tr><tr><td></td></tr></table>";
				
		}
		
	//---------------------------------------------------------------------------------------------------------------
	// editcontentmenu - Code Viewer Menu Code
	//---------------------------------------------------------------------------------------------------------------
		
		function editcodemenu($kind)
		{
				// Body if we are allowed to run code viewer
				echo '<body style="margin: 0; padding: 0;" onload="setup();">';
				echo '<span id="forwdrop" class="dropdown forwdrop"><div class="dropdownback">Forw</div></span>';
				echo '<span id="backwdrop" class="dropdown backwdrop"><div class="dropdownback">Backw</div></span>';				
				if($kind){
						echo '<span id="codedrop" class="dropdown codedrop" style="overflow:scroll;"><div class="dropdownback">Code viewer Code File Selector</div></span>';
						echo '<span id="docudrop" class="dropdown docudrop"><div class="dropdownback">Wordlist Selector</div></span>';				
				}

				echo '<div id="buttomenu">';
				echo '<table cellspacing="2"><tr>';
						echo '<td class="butto" onclick="Up();"><img src="icons/Up.svg" /></td>';
						echo '<td class="butto" id="beforebutton" onmousedown="SkipBDown();" onmouseup="SkipBUp();" onclick="SkipB();"><img src="icons/SkipB.svg" /></td>';
						echo '<td class="butto" id="afterbutton" onmousedown="SkipFDown();" onmouseup="SkipFUp();" onclick="SkipF();""><img src="icons/SkipF.svg" /></td>';
						echo '<td class="butto" id="playbutton" onclick="Play();"><img src="icons/Play.svg" /></td>';
						echo '<td class="buttospacer">&nbsp;</td>';
						if($kind){
								echo '<td class="butto" onclick="Plus();"><img src="icons/Plus.svg" /></td>';
								echo '<td class="butto" onclick="Minus();"><img src="icons/Minus.svg" /></td>';
								echo '<td class="buttospacer">&nbsp;</td>';
								echo '<td class="butto" onclick="Bold();"><img src="icons/Bold.svg" /></td>';
								echo '<td class="butto" onclick="Save();"><img src="icons/Diskett.svg" /></td>';
								echo '<td class="buttospacer">&nbsp;</td>';
								echo '<td class="butto" onclick="Code();"><img src="icons/Document.svg" /></td>';
								echo '<td class="butto" onclick="Wordlist();"><img src="icons/Book.svg" /></td>';
								echo '<td class="menutext"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName" contenteditable="true">Example Code Page</td>';
						}else{
								echo '<td class="menutext"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName">Example Code Page</td>';						
						}
						echo '<td class="butto" onclick="location=\'loginlogout.php\';"><img src="icons/Man.svg" /></td></tr>';
				echo '</table></div>';
				echo '<div style="width:100%; position: absolute; top: 50px; bottom: 0px;" id="div2;background-color:#def">';
				echo '<div id="docucontent"';
				if($kind){
						echo ' contenteditable="true" >';				
				}else{ 
						echo '>';
				} 
				echo '<div style="left:20px" class="warning">';
						echo 'Please wait while content loads<br/>';
						echo '<img src="icons/Starspinner3.gif" /><br/>';
						echo 'Do not forget to enable Javascript<br/>';
						echo '</div>';
						echo '</div>';
						echo '<div id="codebox">';
						echo '<div id="infobox" class="codeview">';
						echo '<div style="left:300px" class="warning">';
							echo 'Please wait while content loads<br/>';
							echo '<img src="icons/Starspinner3.gif" /><br/>';
							echo 'Do not forget to enable Javascript<br/>';
					echo '</div>';
				echo '</div>';
		echo '</div>';
		echo '</div>';

		}

		//---------------------------------------------------------------------------------------------------------------
		// jsvarget - Code to translate get variable to javascript through PHP
		//---------------------------------------------------------------------------------------------------------------
		
		function jsvarget($getname,$varname){
				if(isset($_GET[$getname])){
						echo 'var '.$varname.'="'.$_GET[$getname].'";';
				}else{
						echo 'var '.$varname.'="NONE!";';												
				}
		}		

		//---------------------------------------------------------------------------------------------------------------
		// jsvarget - Code to translate session variable to javascript through PHP
		//---------------------------------------------------------------------------------------------------------------

		function jsvarsession($getname,$varname){
				if(isset($_SESSION[$getname])){
						echo 'var '.$varname.'="'.$_SESSION[$getname].'";';
				}else{
						echo 'var '.$varname.'="NONE!";';												
				}
		}		

?>