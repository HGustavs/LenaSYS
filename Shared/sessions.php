<?php
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
// logout
//---------------------------------------------------------------------------------------------------------------

function logout()
{
		$_SESSION["loginname"]="NONE!";
		$_SESSION["passwd"]="NONE!";
		$_SESSION["kind"]="NONE!";

		session_destroy();
}
?>
