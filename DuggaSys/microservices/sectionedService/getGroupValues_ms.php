<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
include('../shared_microservices/getUid_ms.php');


// Connect to database and start session
pdoConnect();
session_start();

$courseid=getOP('courseid');
$coursevers=getOP('coursevers');

if(checklogin()){
			if(isset($_SESSION['uid'])){
				$userid=$_SESSION['uid'];
				$hasread=hasAccess($userid, $courseid, 'r');
				$studentTeacher=hasAccess($userid, $courseid, 'st');
				$haswrite=hasAccess($userid, $courseid, 'w');
			}else{
				$userid="guest";
			}

if(strcmp($opt,"GRP")===0) {
		        $query = $pdo->prepare("SELECT user.uid,user.username,/*user.firstname,user.lastname,*/user.email,user_course.groups FROM user,user_course WHERE user.uid=user_course.uid AND cid=:cid AND vers=:vers");
		        $query->bindParam(':cid', $courseid);
		        $query->bindParam(':vers', $coursevers);
		        /*
		        $glst=array();
		        if($showgrp!="UNK"){
		            foreach($groups as $grptype){
		                if(in_array($showgrp,$grptype)){
		                    $glst=$grptype;
		                    break;
		                }
		            }
		        }
		        */
		        if($query->execute()) {
		            $showgrps=explode(',',$showgrps);
		            $showgrp=$showgrps[0];
		            if($ha || $studentTeacher)$showgrp=explode('_',$showgrp)[0];
		            foreach($query->fetchAll() as $row) {
		                $grpmembershp=$row['groups'];
		                $idx=strpos($grpmembershp,$showgrp);
		                while($idx!==false){
		                    $grp=substr($grpmembershp,$idx,strpos($grpmembershp,' ',$idx)-$idx);
		                    $email=$row['email'];
		                    if(is_null($email)){
		                        $email=$row['username']."@student.his.se";
		                    }
		                //    array_push($grplst, array($grp,$row['firstname'],$row['lastname'],$email));
		                    $idx=strpos($grpmembershp,$showgrp,$idx+1);
		                }
		            }
		            sort($grplst);
		            /*
		            foreach($query->fetchAll() as $row) {
		                if(isset($row['groups'])){
		                    $grpmembershp = explode(" ", $row['groups']);

		                    foreach($grpmembershp as $member){
		                        if($ha||in_array($member,$glst)){
		                          foreach($groups as $groupKind=>$group){
		                            if(in_array($member,$group)){
		                                if(!isset($grplst[$groupKind])){
		                                    $grplst[$groupKind]=array();
		                                }
		                                if(!isset($grplst[$groupKind][$member])){
		                                    $grplst[$groupKind][$member]=array();
		                                }
		                                array_push($grplst[$groupKind][$member], array($row['firstname'],$row['lastname'],$row['email']));
		                            }
		                          }

		                        }

		                    }
		                }
		            }
		            */
		        }else{
		            $debug="Failed to get group members!";
		        }
		    }

            echo json_encode(array('id' => $courseid, 'vers' => $coursevers, 'debug' => $debug));
		return;

?>