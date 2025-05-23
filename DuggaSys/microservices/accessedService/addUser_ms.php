<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../curlService.php";
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "retrieveAccessedService_ms.php";

// Connect to database and start session
pdoConnect();
session_start();

$opt = getOP('opt');
$cid = getOP('courseid');
$newusers = getOP('newusers');
$coursevers = getOP('coursevers');
$log_uuid = getOP('log_uuid');
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");
$debug = "NONE!";

if (hasAccess($userid, $cid, 'w') || isSuperUser($userid)) {
	$hasAccess = true;
} else {
	$hasAccess = false;
} 

if(checklogin() && $hasAccess) {
    if(strcmp($opt,"ADDUSR")==0){
        $newUserData = json_decode(htmlspecialchars_decode($newusers));
        foreach ($newUserData as $user) {
			$uid="UNK";
			$regstatus="UNK";
			
			//if 1 user was sent and they have set a username
            if (count($user) == 1&&strcmp($user[0],"")!==0) {

				//extracts username from email
				if($saveemail){
					$username = explode('@', $saveemail)[0];
				}

                // See if user exists in database with username
                $userquery = $pdo->prepare("SELECT uid FROM user WHERE username=:username");
                $userquery->bindParam(':username', $username);

                if(!$userquery->execute()) {
                  	$error=$userquery->errorInfo();
                  	$debug.="Error adding user by ssn or username: ".$error[2];
                }else {
                  	foreach($userquery->fetchAll(PDO::FETCH_ASSOC) as $row){ $uid = $row["uid"];}
                }

                if(strcmp($uid,"UNK")===0){
                    if(strcmp($debug,"NONE!")===0){$debug="";}
                    $debug.=$user[0]." was not found as a user in the system!\n";
                }
            }else if (count($user) > 1){
            	$ssn = $user[0]; //ssn is not sent with newusers in the current implementation of lenasys

				$saveemail = $user[3];
				if(isset($saveemail)){
					$username = explode('@', $saveemail)[0];
				}else{
					$username=makeRandomString(6);
				}

              	// Check if user has an account with username (ssn is not sent in the current implementation of lenasys)
              	$userquery = $pdo->prepare("SELECT uid FROM user WHERE username=:username");
              	$userquery->bindParam(':username', $username);
              	if ($userquery->execute() && $userquery->rowCount() <= 0) {
                  	$firstname = $user[1];
                  	$lastname = $user[2];
	                $term = $user[5];
					
					if (isset($user[4])){
						$className = $user[4];
					}
					else{
						$className = "UNK"; // no class is sent with newusers in the current implementation of lenasys
					}
    	            
					//If a className has been set. (this is not implemented in lenasys right now)
                  	if(strcmp($className,"UNK")!==0){
                     	$cstmt = $pdo->prepare("SELECT class FROM class WHERE class=:clsnme;");
                      	$cstmt->bindParam(':clsnme', $className);
                      	if(!$cstmt->execute()) {
                        	$error=$cstmt->errorInfo();
                        	$debug.="Could not read class\n".$error[2];
                      	}

                      	// If class does not exist
                      	if($cstmt->rowCount() === 0){
                          	$querystring='INSERT INTO class (class, responsible) VALUES(:className,1);';
                          	$stmt = $pdo->prepare($querystring);
                          	$stmt->bindParam(':className', $className);
                          	if(!$stmt->execute()) {
                              	$error=$stmt->errorInfo();
                              	$debug.="Error inserting into class\n".$error[2];
                          	}
                      	}
                  	}

					//creates a new user if one didn't exist in the database
					if($uid=="UNK"){
						$rnd=standardPasswordHash(makeRandomString(9));
						$querystring='INSERT INTO user (username, email, firstname, lastname, ssn, password,addedtime, class) VALUES(:username,:email,:firstname,:lastname,:ssn,:password,now(),:className);';
						$stmt = $pdo->prepare($querystring);
						$stmt->bindParam(':username', $username);
						$stmt->bindParam(':email', $saveemail);
						$stmt->bindParam(':firstname', $firstname);
						$stmt->bindParam(':lastname', $lastname);
						$stmt->bindParam(':ssn', $ssn);
						$stmt->bindParam(':password', $rnd);
						$stmt->bindParam(':className', $className);

						try {
							if(!$stmt->execute()) {
								$error=$stmt->errorInfo();
								$debug.="Error updating entries\n".$error[2];
								$debug.="   ".$username."Does not Exist \n";
								$debug.=" ".$uid;
							}
							$uid=$pdo->lastInsertId();
						} catch (PDOException $e) {
							if ($e->errorInfo[1] == 1062) {
								$debug="Duplicate SSN or Username";
							} else {
								$debug="Error updating entries\n".$error[2];
							}
						}
					}

				}else if($userquery->rowCount() > 0){
                	$usr = $userquery->fetch(PDO::FETCH_ASSOC);
                    $uid = $usr['uid'];
                }
			}
					
          	// We have a user, connect to current course
          	if($uid!="UNK"){
				if($regstatus=="Registrerad"||$regstatus=="UNK"){
					$stmt = $pdo->prepare("INSERT INTO user_course (uid, cid, access,term,creator,vers,vershistory) VALUES(:uid, :cid,'R',:term,:creator,:vers,'') ON DUPLICATE KEY UPDATE vers=:avers, vershistory=CONCAT(vershistory, CONCAT(:bvers,','))");
					$stmt->bindParam(':uid', $uid);
					$stmt->bindParam(':cid', $cid);
					$stmt->bindParam(':term', $term);
					$stmt->bindParam(':creator', $userid);
					$stmt->bindParam(':vers', $coursevers);
					$stmt->bindParam(':avers', $coursevers);
					$stmt->bindParam(':bvers', $coursevers);
					// Insert the user into the database.
					try {
						if(!$stmt->execute()) {
							$error=$stmt->errorInfo();
							$debug.="Error connecting user to course: ".$error[2];
						}
					}catch(Exception $e) {
						$debug.="Error connecting user to course: ".$e->getMessage();
					}
				}
        	}
		} // End of foreach user
	} // End ADD_USER

	$array = retrieveAccessedService($pdo, $debug, $userid, $cid, $log_uuid, $opt, null);
	echo json_encode($array);
}
