<?php

//---------------------------------------------------------------------------------------------------------------
// profileService - handles password changes and challenge question
//---------------------------------------------------------------------------------------------------------------


date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";


// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="1";		
} 


$password= getOP('password');
$question = getOP('question');
$answer = getOP('answer');
$action = getOP('action');
$newPassword = getOP('newPassword');
$hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
$hashedAnswer = password_hash($answer, PASSWORD_BCRYPT);

//check if the user is logged in and fetch the password from the db
if(checklogin() || isSuperUser($userid)){
    $querystring="SELECT password FROM user WHERE uid=:userid LIMIT 1";	
    $stmt = $pdo->prepare($querystring);
    $stmt->bindParam(':userid', $userid);
    
    if(!$stmt->execute()) {
        $error=$stmt->errorInfo(); 
    } else{
        $result = $stmt->fetch(PDO::FETCH_OBJ);
        $passwordz = $result->password;
        
        //If password matches update user security question
        if(password_verify($password, $passwordz)){
            //Update challenge question
            if($action == "challenge"){
                $querystringz = "UPDATE user SET securityquestion=:SQ, securityquestionanswer=:answer WHERE uid=:userid";
                $stmt = $pdo->prepare($querystringz);
                $stmt->bindParam(':userid', $userid);
                $stmt->bindParam(':SQ', $question);
                $stmt->bindParam(':answer', $hashedAnswer);

                if(!$stmt->execute()) {
                    $error=$stmt->errorInfo(); 
                }else{
                    echo "updated";
                }
            }
            //Update password
            if($action == "password"){
                $passwordquery = "UPDATE user SET password=:PW WHERE uid=:userid";
                $stmt = $pdo->prepare($passwordquery);
                $stmt->bindParam(':userid', $userid);
                $stmt->bindParam(':PW', $hashedPassword);
            
                if(!$stmt->execute()) {
                    $error=$stmt->errorInfo(); 
                }else{
                    echo "updatedPassword";
                }
            }    
        } 
        else {
            echo "error";
        }
    }
}

?>