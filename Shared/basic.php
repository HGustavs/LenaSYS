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

	function makequery($querystring,$errormessage)
	{
			$result=mysql_query($querystring);
			if (!$result) err("SQL Query Error: ".mysql_error(),$errormessage);
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
?>
