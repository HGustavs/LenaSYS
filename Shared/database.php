<?php
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

function makequery($querystring,$errormessage)
{
		$result=mysql_query($querystring);
		if (!$result) err("SQL Query Error: ".mysql_error(),$errormessage);
}

	//---------------------------------------------------------------------------------------------------------------
	// getqueryvalue - Using a query string returns the value generated from that query
	//---------------------------------------------------------------------------------------------------------------
	
	function getqueryvalue($querystring)
	{		
		$pos=-1;
		$result=mysql_query($querystring);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Section Position Reading Error");
		while ($row = mysql_fetch_assoc($result)){
				$pos=$row['pos'];
		}
		
		return $pos;
	}
?>
