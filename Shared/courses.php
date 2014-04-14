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

function getCourseId($coursename)
{
	$querystring = sprintf("SELECT cid FROM course WHERE coursename='%s' LIMIT 1",
		mysql_real_escape_string($coursename)
	);

	$result = mysql_query($querystring);

	if(!$result) {
		return false;
	} else {
		if(mysql_num_rows($result) > 0) {
			$course = mysql_fetch_assoc($result);
			return $course['cid'];
		} else {
			return false;
		}
	}
}
?>
