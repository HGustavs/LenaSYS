<?php

include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

include_once "../../coursesyspw.php";

$opt=getOP('opt');

if($opt=="GETQUESTION"){
	$username=getOP('username');
  $securityquestion=getOP('securityquestion');
  
  // Request barrier
  $maxRequestTries = 5;
  $log_db = new PDO('sqlite:../../log/loglena4.db');
  $IP = getIP();
  $timeInterval = 5; // in minutes

  $query = $GLOBALS['log_db']->prepare("SELECT COUNT(*) FROM userLogEntries
    WHERE eventType = 12
    AND remoteAddress = :IP
    AND timestamp > DATETIME(DATETIME('NOW'), :timeInterval)");
  $query->bindParam(':IP', $IP);
  $query->bindValue(':timeInterval', '-' . $timeInterval . ' minute');

  if(!$query->execute()) {
    $error=$query->errorInfo();
    $debug="Error counting rows".$error[2];
  } else {
    $result = $query->fetch(PDO::FETCH_ASSOC);
    $queryResult = $result['COUNT(*)'];
  }

  pdoConnect(); // Makes sure it actually connects to a database
  
  // Retriving uid from database is used for logging 
			// Gets uid based on username
			$query = $pdo->prepare( "SELECT uid FROM user WHERE username = :username");
			$query->bindParam(':username', $username);
			$query-> execute();

			// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set
			while ($row = $query->fetch(PDO::FETCH_ASSOC)){
				$userid = $row['uid'];
  }

	// Default values
	$res = array("getname" => "failed");
	$res = array("securityquestion" => "undefined");
  if($queryResult < $maxRequestTries){
    if(getQuestion($username)){
		$res["getname"] = "success";
		$res["username"] = $username;
		$res["securityquestion"] = $_SESSION["securityquestion"];
    }else{
      $res["getname"] = $_SESSION["getname"];
      logUserEvent($userid, $username, EventTypes::RequestNewPW,"");
    }
  }else{
    $res["getname"] = "limit";
  }
	
	
	echo json_encode($res);

}else if($opt=="REQUESTCHANGE"){
	$username=getOP('username');

	pdoConnect(); // Makes sure it actually connects to a database

  // Security question barrier
  $maxQuestionTries = 5;
  $log_db = new PDO('sqlite:../../log/loglena4.db');
  $IP = getIP();
  $timeInterval = 5; // in minutes

  $query = $GLOBALS['log_db']->prepare("SELECT COUNT(*) FROM userLogEntries
    WHERE eventType = 13
    AND uid = :user
    AND remoteAddress = :IP
    AND timestamp > DATETIME(DATETIME('NOW'), :timeInterval)");
  $query->bindParam(':IP', $IP);
  $query->bindValue(':timeInterval', '-' . $timeInterval . ' minute');
  $query->bindParam(':user', $username);

  if(!$query->execute()) {
    $error=$query->errorInfo();
    $debug="Error counting rows".$error[2];
  } else {
    $result = $query->fetch(PDO::FETCH_ASSOC);
    $queryResult = $result['COUNT(*)'];
  }
  
  
  // CheckAnswer
  $securityquestionanswer=getOP('securityquestionanswer');
  
	$res = array("requestchange" => "failed");
  if($queryResult < $maxQuestionTries){
    if(checkAnswer($username, $securityquestionanswer)){
      $res["username"] = $username;
      if(requestChange($username)){
        $res["requestchange"] = "success";
      }
    }else{
      $res["requestchange"] = "wrong";
      logUserEvent($userid, $username, EventTypes::CheckSecQuestion,"");
    }
  }else{
    $res["requestchange"] = "limit";
  }
	

	echo json_encode($res);
}
	
?>