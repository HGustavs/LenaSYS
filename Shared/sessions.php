<?php
require_once(dirname(__FILE__) . '/../Shared/database.php');
require_once(dirname(__FILE__) . '/constants.php');
//---------------------------------------------------------------------------------------------------------------
// checklogin - Checks Login Credentials and initiates the kind session variable that holds the credentials
//---------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
// addlogintry
//------------------------------------------------------------------------------------------------
// Check whether or not the user is logged in.
// return bool Returns true if the user is logged in and false if they aren't
//------------------------------------------------------------------------------------------------

function addlogintry(){ // A function that will record the amount of tries when login in.
        global $pdo;

        if($pdo == null) {
            pdoConnect();
        }

        $query = $pdo->prepare('insert into eventlog (address,type,ts) values (:addr,:type,NOW())');
        // TODO: Proxy detection?
        $query->bindParam(':addr', $_SERVER['REMOTE_ADDR']);
        $query->bindValue(':type', EVENT_LOGINERR);
        $query->execute();
}

//------------------------------------------------------------------------------------------------
// checklogin
//------------------------------------------------------------------------------------------------
// checks against session to see if we are logged in
//------------------------------------------------------------------------------------------------

function checklogin()
{
      // If neither session nor post return not logged in
      if(array_key_exists('loginname', $_SESSION)){
        return true;
      } else if(failedLoginCount($_SERVER['REMOTE_ADDR']) < 100 && array_key_exists('username', $_COOKIE) && array_key_exists('password', $_COOKIE)) {
        return login($_COOKIE['username'], $_COOKIE['password'], false);
      } else {
        return false;
      }
}

//------------------------------------------------------------------------------------------------
// showLoginPopup
//------------------------------------------------------------------------------------------------
// Helper function to display the login box if the user is not authenticated
//------------------------------------------------------------------------------------------------

function showLoginPopup()
{
	   echo '<script>$(function() { showLoginPopup(); });</script>';
}

//------------------------------------------------------------------------------------------------
// failedLoginCount
//------------------------------------------------------------------------------------------------
// Returns the number of failed logins from this IP address in the
// last 30 minutes.
// @param string $addr Address to look up
// @return int
//------------------------------------------------------------------------------------------------

function failedLoginCount($addr)
{
        global $pdo;

        if($pdo == null) {
            pdoConnect();
        }

        $query = $pdo->prepare('SELECT COUNT(1) FROM eventlog WHERE address=:addr AND type=:type AND ts > (CURRENT_TIMESTAMP() - interval 1 minute)');
        // TODO: Proxy detection?
        $query->bindParam(':addr', $addr);
        $query->bindValue(':type', EVENT_LOGINERR);

        if($query->execute() && $query->rowCount() > 0) {
            $count = $query->fetch(PDO::FETCH_NUM);
            return $count[0];
        }else{
            return 0;
        }
}

//------------------------------------------------------------------------------------------------
// getQuestion
//------------------------------------------------------------------------------------------------
// Returns true if we are allowed to alter security question
//------------------------------------------------------------------------------------------------

function getQuestion($username)
{
      global $pdo;

      if($pdo == null) {
        pdoConnect();
      }
      //Gets info for the user whose username has been input
      $query = $pdo->prepare("SELECT uid,username,superuser,securityquestion,requestedpasswordchange FROM user WHERE username=:username LIMIT 1");

      $query->bindParam(':username', $username);

      $query->execute();

      if($query->rowCount() > 0) {
            // Fetch the result
            $row = $query->fetch(PDO::FETCH_ASSOC);
            $_SESSION["securityquestion"]=$row['securityquestion'];

            /* If the security question is null/default there is no point in allowing the user to continue.
            Returning something else than false here might be good since false right now means there is no user with this name, that the name belong to a superuser or that there is no question */
            if($row["superuser"]==1){
                  $_SESSION["getname"] = "Username not found";
                  return false;
            }

            $query = $pdo->prepare("SELECT access FROM user_course WHERE uid=:uid AND access='W'");

            $query->bindParam(':uid', $row['uid']);

            $query->execute();

            if($query->rowCount() > 0) {
                $_SESSION["getname"] = "Username not found";
                return false;
            }

            if($row["securityquestion"]==null){
                $_SESSION["getname"] = "Security question not found";
                return false;
            }

            if($row["requestedpasswordchange"]==1){
                $_SESSION["getname"] = "You already have a pending reset password request";
                return false;
            }

            return true;
      }else{
            $_SESSION["getname"] = "Username not found";
            return false;
      }
}

//------------------------------------------------------------------------------------------------
// getQuestion
//------------------------------------------------------------------------------------------------
// Returns true if we are allowed to alter security question
//------------------------------------------------------------------------------------------------

function checkAnswer($username, $securityquestionanswer)
{
        global $pdo;

        if($pdo == null) {
                pdoConnect();
        }
        //Gets info for the user whose username has been input
        $query = $pdo->prepare("SELECT uid,username,securityquestionanswer FROM user WHERE username=:username LIMIT 1");

        $query->bindParam(':username', $username);
        $query->execute();

        if($query->rowCount() > 0) {
            // Fetch the result
            $row = $query->fetch(PDO::FETCH_ASSOC);
            $securityquestionanswer = strtolower($securityquestionanswer);

            if (password_verify($securityquestionanswer, $row['securityquestionanswer'])){
                  if (standardPasswordNeedsRehash($row['securityquestionanswer'])) {
                  // The php password is not up to date, update it to be even safer (the cost may have changed, or another algoritm than bcrypt is used)
                    $row['securityquestionanswer'] = standardPasswordHash($securityquestionanswer);
                    $query = $pdo->prepare("UPDATE user SET securityquestionanswer = :sqa WHERE uid=:uid");
                    $query->bindParam(':uid', $row['uid']);
                    $query->bindParam(':sqa', $row['securityquestionanswer']);
                    $query->execute();
                  }
                  return true;
            }else{
                  //Wrong password
                  return false;
            }
        }else{
                return false;
        }
}

//------------------------------------------------------------------------------------------------
// requestChange
//------------------------------------------------------------------------------------------------
// Asks system to allow request of password change
//------------------------------------------------------------------------------------------------

function requestChange($username)
{
    global $pdo;

    if($pdo == null) {
        pdoConnect();
    }

    $query = $pdo->prepare("UPDATE user set requestedpasswordchange=1 where username=:username;");
    $query->bindParam(':username', $username);

    if(!$query->execute()) {
        return false;
    }else{
        return true;
    }

}

//------------------------------------------------------------------------------------------------
// standardPasswordHash
//------------------------------------------------------------------------------------------------
// Asks system to allow request of password change
// Hash a string with the global LenaSys settings.
// By having this function encapsulated it enables simpler change in the future.
// @param string $text Text to hash
// @return string Hashed text
//------------------------------------------------------------------------------------------------

function standardPasswordHash($text)
{
        if(function_exists ("password_hash")){
            return password_hash($text, PASSWORD_BCRYPT);
        }else{
            return "UNK";
        }
}

//------------------------------------------------------------------------------------------------
// standardPasswordNeedsRehash
//------------------------------------------------------------------------------------------------
// Test if a hashed string meets the global LenaSys settings.
// @param string $text Text to check
// @return boolean
//------------------------------------------------------------------------------------------------

function standardPasswordNeedsRehash($text)
{
        if(function_exists ("password_needs_rehash")){
            return password_needs_rehash($text, PASSWORD_BCRYPT);
        }else{
            return "UNK";
        }
}

//------------------------------------------------------------------------------------------------
// standardPasswordNeedsRehash
//------------------------------------------------------------------------------------------------
// Log in the user with the specified username and password and optionally set cookies for the user to be remembered until next time they visit the site.
// @param string $username Username of the user to log in
// @param string $password Password of the user to log in
// @param bool $savelogin Whether or not to save the information in a cookie
// @return bool True on success (the user was logged in), false on failure.
//------------------------------------------------------------------------------------------------

function login($username, $password, $savelogin)
{
    global $pdo;

    if($pdo == null) {
        pdoConnect();
    }

    if(MYSQL_VERSION<"8.0"){
        $query = $pdo->prepare("SELECT uid,username,password,superuser,lastname,firstname,securityquestion,password(:pwd) as mysql_pwd_input FROM user WHERE username=:username LIMIT 1");
        $query->bindParam(':pwd', $password);
    }else{
        $query = $pdo->prepare("SELECT uid,username,password,superuser,lastname,firstname,securityquestion,NULL as mysql_pwd_input FROM user WHERE username=:username LIMIT 1");
    }
    $query->bindParam(':username', $username);

    if(!$query->execute()){
        $error=$query->errorInfo();
        echo "Error reading user entries".$error[2]."\n";
    }

    if($query->rowCount() > 0) {
        $row = $query->fetch(PDO::FETCH_ASSOC);

        if ($row['password'] == $row['mysql_pwd_input']) {
            // User still has a mysql password, update to better
            $newpassword=standardPasswordHash($password);
            if($newpassword!="UNK"){
                $row['password'] = $newpassword;
                $query = $pdo->prepare("UPDATE user SET password = :pwd WHERE uid=:uid");
                $query->bindParam(':uid', $row['uid']);
                $query->bindParam(':pwd', $row['password']);
                $query->execute();
            }
        } else if (password_verify($password, $row['password'])) {
            // User has a php password
            if (standardPasswordNeedsRehash($row['password'])) {
                // The php password is not up to date, update it to be even safer (the cost may have changed, or another algoritm than bcrypt is used)
                $row['password'] = standardPasswordHash($password);
                $query = $pdo->prepare("UPDATE user SET password = :pwd WHERE uid=:uid");
                $query->bindParam(':uid', $row['uid']);
                $query->bindParam(':pwd', $row['password']);
                $query->execute();
            }
        } else {
            // Wrong password entered
            return false;
        }

        $_SESSION['uid'] = $row['uid'];
        $_SESSION["loginname"]=$row['username'];
        $_SESSION["passwd"]=$row['password'];
        $_SESSION["superuser"]=$row['superuser'];
        $_SESSION["lastname"]=$row['lastname'];
        $_SESSION["firstname"]=$row['firstname'];

        if($row['securityquestion'] != null) {
            $_SESSION["securityquestion"]="set";
        }

        // Since teacher and superusers can not have security question we can just say that they have one in order to not show them the popup that they need to set one
        if($row['superuser'] == 1) {
            $_SESSION["securityquestion"]="set";
        }

        $query = $pdo->prepare("SELECT access FROM user_course WHERE uid=:uid AND access='W'");

        $query->bindParam(':uid', $row['uid']);

        $query->execute();

        if($query->rowCount() > 0){
            $_SESSION["securityquestion"]="set";
        }
        return true;

    } else {
        // echo "Rowcount==0\n";

        return false;
    }
}

//------------------------------------------------------------------------------------------------
// hasAccess
//------------------------------------------------------------------------------------------------
// Check if a specified user ID has the requested access on a specified course
// @param int $userId User ID of the user to look up
// @param int $courseId ID of the course to look up access for
// @param string $access_type A single letter denoting read or write access
// (r and w respectively)
// @return bool Returns true if the user has the requested access on the course
// and false if they don't.
//------------------------------------------------------------------------------------------------

function hasAccess($userId, $courseId, $access_type)
{
	$access = getAccessType($userId, $courseId);

	if($access_type === 'w') {
		return strtolower($access) == 'w';
	} else if ($access_type === 'r') {
		return strtolower($access) == 'r' || strtolower($access) == 'w' || strtolower($access) == 'st';
	} else if ($access_type === 'st') {
        return strtolower($access) == 'st';
    }else if ($access_type === 'sv') {
        return strtolower($access) == 'sv';
    } else {
		return false;
	}
}

//------------------------------------------------------------------------------------------------
// isSuperUser
//------------------------------------------------------------------------------------------------
// Returns superuser status of user
// @param int $userId User ID of the user to look up
// @return true false. True if superuser false if not
//------------------------------------------------------------------------------------------------

function isSuperUser($userId)
{
        global $pdo;

        if($pdo == null) {
                pdoConnect();
        }

        $query = $pdo->prepare('SELECT count(uid) AS count FROM user WHERE uid=:1 AND superuser=1');
        $query->bindParam(':1', $userId);
        $query->execute();
        $result = $query->fetch();

        if ($result["count"]==1) {
                return true;
        }else{
                return false;
        }
}

//------------------------------------------------------
//isStudentUser
//-------------------------------------------------------
//Returns superuser status of user
//@param in $userId user ID of the user to ook up
//@return true false. True id studentuser false if not
//-------------------------------------------------------
function isStudentUser($userId)
{
        global $pdo;

        if($pdo == null) {
                pdoConnect();
        }

        $query = $pdo->prepare('SELECT count(uid) AS count FROM user WHERE (uid=:uid AND superuser=0) OR (uid=:uid AND superuser IS NULL)');
        $query->bindParam(':uid', $userId);
        $query->execute();
        $result = $query->fetch();

        if ($result["count"] == 1) {
                return true;
        }else{
                return false;
        }
}


//------------------------------------------------------------------------------------------------
// getAccessType
//------------------------------------------------------------------------------------------------
// Returns the access a specified user has on the specified course
// @param int $userId User ID of the user to look up
// @param int $courseId Course ID of the course to look up access on
// @return string Returns the access for the user on the selected course (r or w)
//------------------------------------------------------------------------------------------------

function getAccessType($userId, $courseId)
{
        global $pdo;

        if($pdo == null) {
            pdoConnect();
        }

        $query = $pdo->prepare('SELECT access FROM user_course WHERE uid=:uid AND cid=:cid LIMIT 1');
        $query->bindParam(':uid', $userId);
        $query->bindParam(':cid', $courseId);
        $query->execute();

        // Fetch data from the database
        if($query->rowCount() > 0) {
            $access = $query->fetch(PDO::FETCH_ASSOC);
            return strtolower($access['access']);
        }else{
            return false;
        }
}

?>
