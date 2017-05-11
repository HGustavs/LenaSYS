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
$hashedAnswer = standardPasswordHash($answer);

//check if the user is logged in and fetch the password from the db
if(checklogin() || isSuperUser($userid)){
    $querystring="SELECT password FROM user WHERE uid=:userid LIMIT 1";	
    $stmt = $pdo->prepare($querystring);
    $stmt->bindParam(':userid', $userid);
    
    if(!$stmt->execute()) {
        $error=$stmt->errorInfo(); 
    } 
    else{
        $result = $stmt->fetch(PDO::FETCH_OBJ);
        $passwordz = $result->password;
        
        //If password matches update user security question
        if(password_verify($password, $passwordz)){           
            //Query that selects the user row if it is a superuser or a teacher
            $accessString = "SELECT user.superuser, user_course.access FROM user LEFT JOIN user_course ON user_course.uid=user.uid WHERE  user.uid=:userid AND (user.superuser='1' OR user_course.access='W') LIMIT 1";
            $query = $pdo->prepare($accessString);
            $query->bindParam('userid', $userid);
            $query->execute();
    
            if($query->rowCount() > 0) {
                 //If a row matches query, the user is a teacher/superuser and cannot change password/security questions
                  echo "teacher";
             }
             else{  
                 //Action determines which form is being used
                 if($action == "challenge"){   
                        //Update challenge question
                        $querystringz = "UPDATE user SET securityquestion=:SQ, securityquestionanswer=:answer WHERE uid=:userid";
                        $stmt = $pdo->prepare($querystringz);
                        $stmt->bindParam(':userid', $userid);
                        $stmt->bindParam(':SQ', $question);
                        $stmt->bindParam(':answer', $hashedAnswer);

                        if(!$stmt->execute()) {
                            $error=$stmt->errorInfo(); 
                        }
                        else{
                            echo "updated";
                        }
                    }
                else if($action == "password"){
                    //Update password
                    $passwordquery = "UPDATE user SET password=:PW WHERE uid=:userid";
                    $stmt = $pdo->prepare($passwordquery);
                    $stmt->bindParam(':userid', $userid);
                    $stmt->bindParam(':PW', $hashedPassword);

                    if(!$stmt->execute()) {
                        $error=$stmt->errorInfo(); 
                    }
                    else{
                        echo "updatedPassword";
                    }
                }
            }     
        }
    }
}

?>