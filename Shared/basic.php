<?php

//------------------------------------------------------------------------------------------------
// makeLogEntry
//------------------------------------------------------------------------------------------------
//
// Reads service Parameter from POST encoding using entities
//
// 1,2 Signify Reading and Writing of Dugga
// 3,4 Signify Sucessful and Failed Login

function makeLogEntry($userid,$entrytype,$pdo,$etext)
{
			$userag=$etext."|".$_SERVER['HTTP_USER_AGENT'];
			if(strlen($userag)>1024) substr ($userag,0,1024);
			$query = $pdo->prepare("INSERT INTO eventlog(address,raddress, type, user, eventtext) VALUES(:address,:raddress, :type, :user, :eventtext)");
		
			$query->bindParam(':user', $userid);
			$query->bindParam(':type', $entrytype);
		
			$query->bindParam(':address', $_SERVER['REMOTE_ADDR']);
			$query->bindParam(':raddress', $_SERVER['HTTP_CLIENT_IP']);
			$query->bindParam(':eventtext', $userag);
			
			return ($query->execute() && $query->rowCount() > 0);
}


//------------------------------------------------------------------------------------------------
// getOP
//------------------------------------------------------------------------------------------------
//
// Reads service Parameter from POST encoding using entities
//

function getOP($name)
{
		if(isset($_POST[$name]))	return urldecode($_POST[$name]);
		else return "UNK";			
}

//------------------------------------------------------------------------------------------------
// getOP
//------------------------------------------------------------------------------------------------
function gettheOP($name)
{
	if(isset($_POST[$name])){
		return $_POST[$name];
	}		
	else return "UNK";			
}

//
// Reads service Parameter from POST encoding using entities
//

function getOPG($name)
{
		if(isset($_GET[$name]))	return urldecode($_GET[$name]);
		else return "UNK";			
}

//------------------------------------------------------------------------------------------------
// makeRandomString
//------------------------------------------------------------------------------------------------
//
// Makes a random string of length X
//

function makeRandomString($length = 6) {
    $validCharacters = "abcdefghijklmnopqrstuxyvwzABCDEFGHIJKLMNOPQRSTUXYVWZ+-*#&@!?";
    $validCharNumber = strlen($validCharacters);
    $result = "";
    for ($i = 0; $i < $length; $i++) {
    	$index = mt_rand(0, $validCharNumber - 1);
      $result .= $validCharacters[$index];
    }
    return $result;
}

//---------------------------------------------------------------------------------------------------------------
// endsWith - Tests if a string ends with another string - defaults to being non-case sensitive
//---------------------------------------------------------------------------------------------------------------
function endsWith($haystack,$needle,$case=true)
{
	if($case){
		return (strcmp(substr($haystack, strlen($haystack) - strlen($needle)),$needle)===0);
	}
	return (strcasecmp(substr($haystack, strlen($haystack) - strlen($needle)),$needle)===0);
}

//---------------------------------------------------------------------------------------------------------------
// endsWith - Tests if a string ends with another string - defaults to being non-case sensitive
//---------------------------------------------------------------------------------------------------------------

function swizzleArray(&$filepost) {

    $filearray = array();
    $filecount = count($filepost['name']);
    if ($filepost !== null) $filekeys = array_keys($filepost);

    for ($i=0; $i<$filecount; $i++) {
        foreach ($filekeys as $key) {
            $filearray[$i][$key] = $filepost[$key][$i];
        }
    }

    return $filearray;
}

?>