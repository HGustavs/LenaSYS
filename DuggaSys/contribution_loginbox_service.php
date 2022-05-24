<?php


date_default_timezone_set("Europe/Stockholm");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

$git_pending = 101;
$git_revoked = 102;
$git_accepted = 0;

$debug="NONE!";

//This uses an hardcoded path to a database file containing all Github data and run all funtions on that data. No other connection to a database at the moment.
$log_db = new PDO('sqlite:../../BGHdata_2021_05.db');

$opt = getOP('opt');

$allusers=array();

if(checklogin() || git_checklogin()) // methods needing you to be logged in
{
    // nothing yet
}

// does not require you to be logged in

if (strcmp($opt, "checkForGitUser")==0)
{
	$gituser = getOP('userid');
	$query = $log_db->prepare('select distinct(usr) from 
		(	select blameuser as usr from blame
		union select author as usr from event
		union select author as usr from issue
		union select author as usr from commitgit
		union select blameuser as usr from coderow
		order by usr);');

	if(!$query->execute()) 
	{
		$error=$query->errorInfo();
		$debug="Error reading entries\n".$error[2];
	}

	$rows = $query->fetchAll();
	foreach($rows as $row)
	{
		//(strlen($row['usr'])<9) // the reason for this is a username check, only users with names less than 9 characters are allowed, commented out for now, i want all users of all lengths
		array_push($allusers, $row['usr']); 
	}


	$userExisted = in_array($gituser, $allusers); // if the user existed it should be not empty, aka this checks if we retrieved the user from the DB
		
    echo json_encode(array(
        "returnMethod" => getOP('return'),
        "debug" => $debug,
        "returnData" => json_encode($userExisted)
    ));


}


//To edit the status of git accounts on contribution
else if(strcmp($opt,"gitUserAdmin") == 0)
{

	global $pdo;

	if($pdo == null) 
	{
		pdoConnect();
	}
	$gituser = getOP('username');
	$gitUserChange = getOP('gitUserChange');

	//Deny user
	if($gitUserChange == 1){
		$query = $pdo->prepare("UPDATE git_user SET status_account=102 WHERE username=:gituser;");
		$query->bindParam(':gituser', $gituser);
	}

	//Delete user
	elseif($gitUserChange == 2){
		$query = $pdo->prepare("DELETE FROM git_user WHERE username=:gituser;");
		$query->bindParam(':gituser', $gituser);
	}

	//Accept user
	elseif($gitUserChange == 3){
		$query = $pdo->prepare("UPDATE git_user SET status_account=0 WHERE username=:gituser;");
		$query->bindParam(':gituser', $gituser);
	}

	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error updating user\n".$error[2];
	}
}

else if(strcmp($opt, "checkForLenasysUser")==0)
{
	global $pdo;
	$status = "";
	$userExisted = false;

	if($pdo == null) 
	{
		pdoConnect();
	}
	$gituser = getOP('userid');


	$query = $pdo->prepare("SELECT username,uid FROM user WHERE username=:GU LIMIT 1;"); // check the teacher table
	$query->bindParam(':GU', $gituser);
	
	if(!$query->execute()) 
	{
		$error=$query->errorInfo();
		$debug="Error reading entries\n".$error[2];
	}

	$userrows = $query->fetchAll();

	$query = $pdo->prepare("SELECT username,git_uid FROM git_user WHERE username=:GU LIMIT 1;"); // check the git_user table
	$query->bindParam(':GU', $gituser);
	
	if(!$query->execute()) 
	{
		$error=$query->errorInfo();
		$debug="Error reading entries\n".$error[2];
	}

	$git_userrows = $query->fetchAll();


	$userExisted = (!empty($userrows[0]['uid']) || !empty($git_userrows[0]['git_uid'])); // if we managed to retrieve something with the query we found the user in the lenasys DB
	


	if($userExisted) // start of teacher/superuser check
	{
		if (isSuperUser($userrows[0]['uid'])) 
		{
			$status = "super";
		}
		else if(!empty($git_userrows[0]['git_uid']))
		{
			$status = "student"; // you exist in the git_user table
		}
	}


    echo json_encode(array(
        "returnMethod" => getOP('return'),
        "debug" => $debug,
        "returnData" => json_encode(array(
            "success" => $userExisted,
            "status" => $status,
            "debug" => $debug
        ))
    ));

	

}
else if(strcmp($opt,"requestGitUserCreation") == 0)
{
	global $pdo;

	if($pdo == null) 
	{
		pdoConnect();
	}
	$gituser = getOP('userid');
	$gitpass = getOP('userpass');
	
	$addStatus = false;

// ------------------------


	$query = $log_db->prepare('select distinct(usr) from 
		(	select blameuser as usr from blame
		union select author as usr from event
		union select author as usr from issue
		union select author as usr from commitgit
		union select blameuser as usr from coderow
		order by usr);');

	if(!$query->execute()) 
	{
		$error=$query->errorInfo();
		$debug="Error reading entries\n".$error[2];
	}

	$rows = $query->fetchAll();
	foreach($rows as $row)
	{
		//(strlen($row['usr'])<9) // the reason for this is a username check, only users with names less than 9 characters are allowed, commented out for now, i want all users of all lengths
		array_push($allusers, $row['usr']); 
	}


	$userExisted = in_array($gituser, $allusers); // if the user existed it should be not empty, aka this checks if we retrieved the user from the DB
		
	/*
            There exists a number of combinations that we need to handle¨

            onGit | onLena
            --------------
              T   |  T    -> Log in with lena
              F   |  T    -> Log in with lena
              T   |  F    -> Create new user
              F   |  F    -> User does not exist
          */


	if($userExisted) // exists in git data
	{

		$allusers = array();

		$query = $pdo->prepare("SELECT username FROM git_user WHERE username=:GU;");
		$query->bindParam(':GU', $gituser);
	
		if(!$query->execute()) 
		{
			$error=$query->errorInfo();
			$debug="Error reading entries\n".$error[2];
		}

		$rows = $query->fetchAll();
		foreach($rows as $row)
		{
			array_push($allusers, $row['usr']); 
		}

		$userExisted = !empty($allusers); // if we managed to retrieve something with the query we found the user in the lenasys DB

		if(!$userExisted) // if it isnt on the lenasys database
		{
			/*
            onGit | onLena
            --------------
              T   |  F    -> Create new user

			  At this point we have done the server side check and we can create a pending user creation from here
        	 */
			
		
			$temp_null_str = "NULL";
			
			$rnd=standardPasswordHash($gitpass);
			if(preg_match('/[a-z|A-Z|0-9]+$/',$gitpass ) && strlen($gitpass) >= 8 && strlen($gitpass) <=64){

				$querystring='INSERT INTO git_user (username, password, status_account, addedtime) VALUES(:username, :password, :status_account, now());';
				$stmt = $pdo->prepare($querystring);
				$stmt->bindParam(':username', $gituser);
				$stmt->bindParam(':password', $rnd);
				$stmt->bindParam(':status_account', $git_pending);
				
				try {
					if(!$stmt->execute()) {
						$error=$stmt->errorInfo();
						$debug.="Error updating entries\n".$error[2];
						$debug.="   ".$gituser."Does not Exist \n";
						$debug.=" ".$uid;
					}
					$uid=$pdo->lastInsertId();
					$addStatus = true;

				} catch (PDOException $e) {
					if ($e->errorInfo[1] == 1062) {
						$debug="Duplicate Username";
					} else {
						$debug="Error updating entries\n".$error[2];
					}
				}

			}
		}

	}

    echo json_encode(array(
        "returnMethod" => getOP('return'),
        "debug" => $debug,
        "returnData" => json_encode($addStatus)
    ));

}
else if(strcmp($opt,"requestContributionUserLogin") == 0)
{
	/*
		This is a special login function just for the contribution page
		This is only supposed to be employed on the contribution page and should not be used to login anywhere else
	*/

	global $pdo;

	if($pdo == null)
	{
		pdoConnect();
	}

	$gituser = getOP('username');
	$gitpass = getOP('userpass');
	$status = '';


	$query = $pdo->prepare("SELECT username,uid FROM user WHERE username=:GU LIMIT 1;");
	$query->bindParam(':GU', $gituser);
	
	if(!$query->execute()) 
	{
		$error=$query->errorInfo();
		$debug="Error reading entries\n".$error[2];
	}

	$rows = $query->fetchAll();
	
	$userExisted = !empty($rows[0]['uid']); // if we managed to retrieve something with the query we found the user in the lenasys DB
	
	if($userExisted) // start of teacher/superuser check
	{
		if (isSuperUser($rows[0]['uid'])) 
		{
			$status = "super";
		}
	}


	if($gituser != "UNK" && $status != "super") // we are either a git_user or not a user at all
	{
		// retrieve a user with the same name
		$query = $pdo->prepare("SELECT git_uid,username,password,status_account FROM git_user WHERE username=:username LIMIT 1");
		$query->bindParam(':username',$gituser);

		if(!$query->execute()) // execute and check for errors
		{
			$error=$query->errorInfo();
			echo "Error reading user entries".$error[2]."\n";
		}

		if($query->rowCount() > 0) // we actually retrieved entries
		{
			$row = $query->fetch(PDO::FETCH_ASSOC);
			
			if(password_verify($gitpass, $row['password'])) // entered gitpass matched hashed password
			{
                $status_account_int = (int)$row['status_account'];
                if($status_account_int == $git_pending)
                {
                   /* $_SESSION['git_uid'] = $row['git_uid'];
                    $_SESSION["git_loginname"]=$row['username'];
                    $_SESSION["git_passwd"]=$row['password']; */


                    echo json_encode(array(
                        "returnMethod" => getOP('return'),
                        "debug" => $debug,
                        "returnData" => json_encode(array(
                            "success" => false,
                            "status" => "pending",
                            "debug" => $debug
                        )
                    )));
                }
                else if($status_account_int == $git_revoked)
                {
                    echo json_encode(array(
                        "returnMethod" => getOP('return'),
                        "debug" => $debug,
                        "returnData" => json_encode(array(
                            "success" => false,
                            "status" => "revoked",
                            "debug" => $debug
                        )
                    )));
                }
                else if($status_account_int == $git_accepted)
                {
                    $_SESSION['git_uid'] = $row['git_uid'];
                    $_SESSION["git_loginname"]=$row['username'];
                    $_SESSION["git_passwd"]=$row['password'];

                    echo json_encode(array(
                        "returnMethod" => getOP('return'),
                        "debug" => $debug,
                        "returnData" => json_encode(array(
                            "success" => true,
                            "status" => "accepted",
                            "debug" => $debug
                        )
                    )));

                }			
            }
			else // wrong password entered
			{

                echo json_encode(array(
                    "returnMethod" => getOP('return'),
                    "debug" => $debug,
                    "returnData" => json_encode(array(
                        "success" => false,
                        "status" => "wrong pass",
                        "debug" => $debug
                    )
                )));

			}
		}

	}
	else if($status == "super") // user exists on the lenasys database login with this instead of the git database
	{
		if(login($gituser, $gitpass, false))
		{
            echo json_encode(array(
                "returnMethod" => getOP('return'),
                "debug" => $debug,
                "returnData" => json_encode(array(
                    "success" => true,
                    "status" => "super",
                    "debug" => $debug
                )
            )));

		}
		else
		{
            echo json_encode(array(
                "returnMethod" => getOP('return'),
                "debug" => $debug,
                "returnData" => json_encode(array(
                    "success" => false,
                    "status" => "wrong pass",
                    "debug" => $debug
                )
            )));


		}
	}
	else // logout the git
	{
		$_SESSION = array(); // logout so we yeet the session
		if (ini_get("session.use_cookies")) // logout so we yeet the cookies
		{
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000,$params["path"], $params["domain"],$params["secure"], $params["httponly"]);
		}
		session_unset();
		session_destroy();
		clearstatcache(); 

        echo json_encode(array(
            "returnMethod" => getOP('return'),
            "debug" => $debug,
            "returnData" => json_encode(array(
                "success" => true,
                "status" => "logged out",
                "debug" => $debug
            )
        )));
	}
}




die; // end of file, kill yourself


?>