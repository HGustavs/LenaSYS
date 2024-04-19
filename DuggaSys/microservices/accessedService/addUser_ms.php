<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include ('../shared_microservices/getUid_ms.php');
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

$opt = getOP('opt');
$cid = getOP('courseid');
$newusers = getOP('newusers');
$coursevers = getOP('coursevers');
$log_uuid = getOP('log_uuid');

if(strcmp($opt,"ADDUSR")==0){
    $newUserData = json_decode(htmlspecialchars_decode($newusers));
    echo $newusers;
    foreach ($newUserData as $user) {
        $uid="UNK";
        $regstatus="UNK";
                
        if (count($user) == 1&&strcmp($user[0],"")!==0) {
            // See if we have added with username or SSN
            //$userquery = $pdo->prepare("SELECT uid FROM user WHERE username=:usernameorssn1 or ssn=:usernameorssn2");
            $userquery->bindParam(':usernameorssn1', $user[0]);
            //$userquery->bindParam(':usernameorssn2', $user[0]);

            if(!$userquery->execute()) {
              $error=$userquery->errorInfo();
              $debug.="Error adding user by ssn or username: ".$error[2];
            }	else {
              foreach($userquery->fetchAll(PDO::FETCH_ASSOC) as $row){ $uid = $row["uid"];}
            }

            if(strcmp($uid,"UNK")===0){
                if(strcmp($debug,"NONE!")===0){$debug="";}
                $debug.=$user[0]." was not found as a user in the system!\n";
            }
        } else if (count($user) > 1){
          $ssn = $user[0];
          // Check if user has an account
          //$userquery = $pdo->prepare("SELECT uid FROM user WHERE ssn=:ssn");
          //$userquery->bindParam(':ssn', $ssn);

          if ($userquery->execute() && $userquery->rowCount() <= 0) {
                            
              //$firstname = $user[1];
              //$lastname = $user[2];
              $className = $user[count($user)-2];
              $saveemail = $user[3];
              $regstatus = $user[count($user)-1];

              if($saveemail){
                  $username = explode('@', $saveemail)[0];
              }else{
                  $username=makeRandomString(6);
              }

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
                          $debug.="Error updating klasse malmberg\n".$error[2];
                      }
                  }

              }

                                if($user[0]!="PNR"){
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
                    $debug=$regstatus;						
                    if($regstatus=="Registrerad"||$regstatus=="UNK"){
                            $stmt = $pdo->prepare("INSERT INTO user_course (uid, cid, access,vers,vershistory) VALUES(:uid, :cid,'R',:vers,'') ON DUPLICATE KEY UPDATE vers=:avers, vershistory=CONCAT(vershistory, CONCAT(:bvers,','))");
                            $stmt->bindParam(':uid', $uid);
                            $stmt->bindParam(':cid', $cid);
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

                            }
                    }
      }
        } // End of foreach user
} // End



?>