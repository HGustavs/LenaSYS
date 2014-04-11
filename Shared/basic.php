<?php
include_once "database.php";
include_once "courses.php";
include_once "sessions.php";
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
