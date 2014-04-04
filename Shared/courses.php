<?php
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
?>
