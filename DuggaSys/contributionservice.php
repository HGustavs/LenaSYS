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

$cid=$_SESSION['courseid'];
$vers=$_SESSION['coursevers'];


$debug="NONE!";

$log_db = new PDO('sqlite:../../GHData/GHdata_2019_10.db');

$opt = getOP('opt');
$coursename=getOP('coursename');
$visibility=getOP('visib');
$versid=getOP('versid');

$log_uuid = getOP('log_uuid');
$info=$opt." ".$cid." ".$coursename." ".$versid." ".$visibility;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "contributionservice.php",$userid,$info);

$allusers=array();
$allrowranks=array();
$alleventranks=array();
$allcommentranks=array();
$allcommitranks=array();

$draught=false;

if (!checklogin()) die;
if(strcmp($opt,"get")==0) {
	if(checklogin() && isSuperUser($_SESSION['uid'])) {
		$gituser = getOP('userid');
		$query = $log_db->prepare('select distinct(usr) from ( select blameuser as usr from blame where blamedate>"2019-03-31" and blamedate<"2020-01-01" union select author as usr from event where eventtime>"2019-03-31" and eventtime<"2020-01-01" union select author as usr from issue where issuetime>"2019-03-31" and issuetime<"2019-01-08") order by usr;');
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries\n".$error[2];
		}
		$rows = $query->fetchAll();
		foreach($rows as $row){
			if(strlen($row['usr'])<9) array_push($allusers, $row['usr']);
		}

		$draught=true;
	}else{
		if(isset($_SESSION['uid'])){
			$userid=$_SESSION['uid'];
			$loginname=$_SESSION['loginname'];
			$lastname=$_SESSION['lastname'];
			$firstname=$_SESSION['firstname'];
		}
		$gituser=$loginname;
	}

	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
		$loginname=$_SESSION['loginname'];
		$lastname=$_SESSION['lastname'];
		$firstname=$_SESSION['firstname'];
	}else{
		$userid=1;
		$loginname="UNK";
		$lastname="UNK";
		$firstname="UNK";
	}

	//$debug=print_r($_SESSION,true);

	$startweek = strtotime('2019-04-01');									// First monday in january
	$currentweek=$startweek;
	$currentweekend=strtotime("+1 week",$currentweek);
	$weekno=1;

	$weeks = array();

  $groupMembers = "UNK";
  $userGroups = "UNK";
  // Get all groups user belong to in current course + version.
  $stmt = $pdo->prepare("SELECT `groups` FROM user_course WHERE user_course.uid=:uid AND user_course.cid=:cid AND user_course.vers=:vers");
  $stmt->bindParam(':uid',$userid);
  $stmt->bindParam(':cid',$cid);
  $stmt->bindParam(':vers',$vers);
  if(!$stmt->execute()){
    $error=$stmt->errorInfo();
    $debug = "Error getting groups from user in course + vers.\n".$error[2];
  } else {
    // There should only be one entry that matches the where clause.
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $result = $result['groups'];
    if(strlen($result) > 0){
      $result = trim($result);
      $userGroups = explode(" ",$result);
    }
  }
  // Using groups, get all other students/users in the same group in the same course version.
  if($userGroups != "UNK"){
    // Because a user could(probably shouldn't) be part of multiple groups we build
    // the query as a string before to dynamically add "like" + group[i] before executing it.
    $queryString = "SELECT user.username FROM user INNER JOIN user_course ON user.uid = user_course.uid WHERE user_course.cid=:cid AND user_course.vers=:vers AND ";
    for ($i=0; $i < sizeof($userGroups); $i++) {
      if($i != 0){
        // if we're not the first like we need to add an or.
        $queryString .= " OR ";
      } else {
        $queryString .= "(";
      }
      $queryString .= "user_course.groups LIKE '%".$userGroups[$i]."%'";
    }
    // end the queryString
    $queryString .= ");";
    $stmt = $pdo->prepare($queryString);
    $stmt->bindParam(':cid',$cid);
    $stmt->bindParam(':vers',$vers);
    // set groupMembers to empty array.
    $groupMembers = array();
    if(!$stmt->execute()){
      $error=$stmt->errorInfo();
      $debug = "Error getting groups from user in course + vers.\n".$error[2];
    } else {
      foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        array_push($groupMembers,$row['username']);
      }

      if(sizeof($groupMembers) < 0){
        // if there are no results (shouldn't be possible since at least the person who's $groups
        // we are checkin on should be here) we set groupMembers back to "UNK".
        $groupMembers = "UNK";
      }
    }
  }
  // Get amount of students in course vers.
  $stmt = $pdo->prepare("SELECT user.username FROM user INNER JOIN user_course ON user.uid = user_course.uid WHERE user_course.cid=:cid AND user_course.vers=:vers");
  $stmt->bindParam(":cid",$cid);
  $stmt->bindParam(":vers",$vers);
  $courseMembers = array();
  if(!$stmt->execute()){
    $error = $stmt->errorInfo();
    $debug = "Error getting students in course + vers .\n".$error[2];
  } else {
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row){
        array_push($courseMembers,$row['username']);
    }
  }

  $amountInCourse = sizeof($courseMembers);
  if(!is_array($groupMembers)){
    $amountInGroups = 0;
  } else {
    $amountInGroups = sizeof($groupMembers);
  }


  /*
   * Rankings, numbers etc below.
   */

	$commitrank="NOT FOUND";
	$commitrankno="NOT FOUND";
  $commitgrouprank="NOT FOUND";
	$i=1;
  $j=1;
	$query = $log_db->prepare('SELECT COUNT(*) as rowk, author FROM commitgit WHERE thedate>"2019-03-31" AND thedate<"2020-01-01" GROUP BY author ORDER BY rowk DESC;');
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading entries\n".$error[2];
	}
	$rows = $query->fetchAll();
	foreach($rows as $row){
		if($row['author']==$gituser){
			$commitrank=$i;
			$commitrankno=$row['rowk'];
      if($groupMembers != "UNK"){
        $commitgrouprank = $j;
      }
		}

		if($draught) array_push($allcommitranks, $row);

		$i++;
    // If the person is in your group, increment j.
    if($groupMembers != "UNK" && in_array($row['author'],$groupMembers)){
      $j++;
    }
	}

	$rowrank="NOT FOUND";
	$rowrankno="NOT FOUND";
  $rowgrouprank="NOT FOUND";
	$i=1;
  $j=1;
	$query = $log_db->prepare('SELECT sum(rowcnt) as rowk, blameuser FROM Bfile,Blame WHERE Blame.fileid=Bfile.id and blamedate>"2019-03-31" and blamedate<"2020-01-01" group by blameuser order by rowk desc;');
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading entries\n".$error[2];
	}
	$rows = $query->fetchAll();
	foreach($rows as $row){
		if($row['blameuser']==$gituser){
			$rowrank=$i;
			$rowrankno=$row['rowk'];
      if($groupMembers != "UNK"){
        $rowgrouprank = $j;
      }
		}
		if($draught) array_push($allrowranks, $row);

		$i++;
    // If the person is in your group, increment j.
    if($groupMembers != "UNK" && in_array($row['blameuser'],$groupMembers)){
      $j++;
    }

	}

	$eventrankno="NOT FOUND";
	$eventrank="NOT FOUND";
  $eventgrouprank="NOT FOUND";
	$i=1;
  $j=1;
	$query = $log_db->prepare('SELECT count(*) as rowk, author FROM event where eventtime>"2019-03-31" AND  eventtime<"2020-01-01" and eventtime!="undefined" AND kind != "comment" group by author order by rowk desc;');
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading entries\n".$error[2];
	}
	$rows = $query->fetchAll();
	foreach($rows as $row){
		if($row['author']==$gituser){
			$eventrank=$i;
			$eventrankno=$row['rowk'];
      if($groupMembers != "UNK"){
        $eventgrouprank = $j;
      }
		}

		if($draught) array_push($alleventranks, $row);

		$i++;
    // If the person is in your group, increment j.
    if($groupMembers != "UNK" && in_array($row['author'],$groupMembers)){
      $j++;
    }
	}

	$commentrankno="NOT FOUND";
	$commentrank="NOT FOUND";
  $commentgrouprank="NOT FOUND";
	$i=1;
  $j=1;
	$query = $log_db->prepare('SELECT count(*) as rowk, author FROM event where eventtime>"2019-03-31" and eventtime!="undefined" and eventtime<"2020-01-01" and kind="comment" group by author order by rowk desc;');
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading entries\n".$error[2];
	}
	$rows = $query->fetchAll();
	foreach($rows as $row){
		if($row['author']==$gituser){
			$commentrank=$i;
			$commentrankno=$row['rowk'];
      if($groupMembers != "UNK"){
        $commentgrouprank = $j;
      }
		}

		if($draught) array_push($allcommentranks, $row);

		$i++;
    // If the person is in your group, increment j.
    if($groupMembers != "UNK" && in_array($row['author'],$groupMembers)){
      $j++;
    }
	}

	$issuerank="NOT FOUND";
	$issuerankno="NOT FOUND";
  $issuegrouprank="NOT FOUND";
	$i=1;
  $j=1;
	$query = $log_db->prepare('SELECT count(*) as rowk, author FROM issue where issuetime>"2019-03-31" and issuetime<"2020-01-01" and issuetime!="undefined" group by author order by rowk desc;');
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading entries\n".$error[2];
	}
	$rows = $query->fetchAll();
	foreach($rows as $row){
		if($row['author']==$gituser){
			$issuerank=$i;
			$issuerankno=$row['rowk'];
      if($groupMembers != "UNK"){
        $issuegrouprank = $j;
      }
		}

		$i++;
    // If the person is in your group, increment j.
    if($groupMembers != "UNK" && in_array($row['author'],$groupMembers)){
      $j++;
    }
	}


	/*
	$overallrank="NOT FOUND";
	$overallrankno="NOT FOUND";
	$i=1;
	$query = $log_db->prepare('SELECT sum(rowk) as davegrowl,author FROM (SELECT count(*) as rowk, author FROM event where eventtime>"2017-03-03" and eventtime!="undefined" group by author having count(*)>4 UNION SELECT COUNT(*) as rowk,author FROM comment where commenttime>"2017-03-03" group by author UNION SELECT count(*) as rowk, author FROM issue where issuetime>"2017-03-01" and issuetime!="undefined" group by author order by rowk desc ) group by author order by davegrowl desc;');
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading entries".$error[2];
	}
	$rows = $query->fetchAll();
	foreach($rows as $row){
		if($row['author']==$gituser){
			$overallrank=$i;
			$overallrankno=$row['davegrowl'];
		}

		if($draught) array_push($alltotalranks, $row);

		$i++;
	}


	SELECT sum(rowk),author FROM (SELECT count(*) as rowk, author FROM event where eventtime>"2017-03-03" group by author UNION SELECT COUNT(*) as rowk,author FROM comment where commenttime>"2017-03-03" group by author UNION SELECT count(*) as rowk,author from issue where issuetime>"2017-03-03" group by author ) group by author order by rowk desc;
	*/

	do{

			// Number of issues created by user during the interval

			$issues= array();
		$currentweekdate=date('Y-m-d', $currentweek);
		$currentweekenddate=date('Y-m-d', $currentweekend);
			$query = $log_db->prepare('SELECT * FROM issue WHERE author=:gituser AND issuetime>:issuefrom AND issuetime<:issueto;');
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading entries\n".$error[2];
			}
			$query->bindParam(':gituser', $gituser);
			$query->bindParam(':issuefrom', $currentweekdate);
			$query->bindParam(':issueto', $currentweekenddate );
			$query->execute();
			$rows = $query->fetchAll();
			foreach($rows as $row){
					$issue = array(
						'issueno' => $row['issueno'],
						'title' => $row['title'],
						'issuetime' =>$row['issuetime']
					);
					array_push($issues, $issue);
			}

			// Event count of the various kinds of events during interval
			$events = array();
			$query = $log_db->prepare("SELECT kind,count(kind) as cnt FROM event WHERE kind!='comment' AND event.author=:gituser AND eventtime>:eventfrom AND eventtime<:eventto GROUP BY kind");
			$query->bindParam(':gituser', $gituser);
			$query->bindParam(':eventfrom', $currentweekdate);
			$query->bindParam(':eventto', $currentweekenddate );
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading entries\n".$error[2];
			}
			$rows = $query->fetchAll();
			foreach($rows as $row){
					$event = array(
						'kind' => $row['kind'],
						'cnt' => $row['cnt']
					);
					array_push($events, $event);
			}

			// Number of comments posted by the user during the interval
			$comments= array();
			$query = $log_db->prepare('SELECT * FROM event WHERE author=:gituser AND eventtime>:eventfrom AND eventtime<:eventto AND kind="comment"');
			$query->bindParam(':gituser', $gituser);
			$query->bindParam(':eventfrom', $currentweekdate);
			$query->bindParam(':eventto', $currentweekenddate );
		if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error reading entries\n".$error[2];
			}
			$rows = $query->fetchAll();
			foreach($rows as $row){
					$comment = array(
						'issueno' => $row['issueno'],
						'content' => $row['content']
					);
					array_push($comments, $comment);
			}

			// Number of commits made by the user during the interval
			$commits=array();
			$query = $log_db->prepare('SELECT message,cid,author FROM commitgit WHERE author=:gituser AND thedate>:eventfrom AND thedate<:eventto');
			$query->bindParam(':gituser', $gituser);
			$query->bindParam(':eventfrom', $currentweekdate);
			$query->bindParam(':eventto', $currentweekenddate );
		if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error reading entries\n".$error[2];
			}
			$rows = $query->fetchAll();
			foreach($rows as $row){
					$commit=array(
						'message' => $row['message'],
						'cid' => $row['cid']
					);
					array_push($commits, $commit);
			}

			// Number of lines changed in each file during interval
			$files= array();
			$query = $log_db->prepare('SELECT sum(rowcnt) as rowk, * FROM Bfile,Blame where Blame.fileid=Bfile.id and blameuser=:gituser and blamedate>:blamefrom and blamedate<:blameto GROUP BY filename');
			$query->bindParam(':blamefrom', $currentweekdate);
			$query->bindParam(':blameto', $currentweekenddate );
			$query->bindParam(':gituser', $gituser);
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading entries".$error[2];
			}
			$rows = $query->fetchAll();
			foreach($rows as $row){
					$file = array(
						'path' => $row['path'],
						'filename' => $row['filename'],
						'lines' => $row['rowk']
					);
					array_push($files, $file);
			}

			$week = array(
				'weekno' => $weekno,
				'weekstart' => $currentweekdate,
				'weekend' => $currentweekenddate,
				'events' => $events,
				'issues' => $issues,
				'comments' => $comments,
				'commits' => $commits,
				'files' => $files
			);
			array_push($weeks, $week);

			$currentweek=$currentweekend;

			$currentweekend=strtotime("+1 week",$currentweek);

			$weekno++;

	}while($weekno<11);
	
	$hourlyevents = array();

	// Events and issues by the user today
	$query = $log_db->prepare('SELECT kind, eventtimeh FROM event WHERE author=:gituser AND eventtime>"2019-03-31" and eventtime!="undefined" and eventtime<"2020-01-01" AND kind IN ("comment", "commit");');
	$query->bindParam(':gituser', $gituser);
	if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries\n".$error[2];
	}
	$rows = $query->fetchAll();
	foreach($rows as $row){
			$event = array(
				'type' => $row['kind'],
				'time' => $row['eventtimeh']
			);
			array_push($hourlyevents, $event);
	}
	$commits = array();
	$query = $log_db->prepare('SELECT issuetimeh FROM issue WHERE author=:gituser AND issuetime>"2019-03-31" and issuetime!="undefined" and issuetime<"2020-01-01";');
	$query->bindParam(':gituser', $gituser);
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading entries\n".$error[2];
	}
	$rows = $query->fetchAll();
	foreach($rows as $row){
		$issue = array(
			'type' => 'issue',
			'time' => $row['issuetimeh']
		);
		array_push($hourlyevents, $issue);
	}


	$count = array();
	$currentdate = $startweek;
	for($i=0;$i<70;$i++){
		$currentdate=date('Y-m-d',$currentdate);
		$daycount = array();
		//Events
		$query = $log_db->prepare('SELECT count(*) FROM event WHERE author=:gituser AND Date(eventtime)=:currentdate AND kind!="comment"');
		$query->bindParam(':gituser', $gituser);
		$query->bindParam(':currentdate', $currentdate);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries".$error[2];
		}
		$eventcount = $query->fetchAll();

	  //Comments
		$query = $log_db->prepare('SELECT count(*) FROM event WHERE author=:gituser AND Date(eventtime)=:currentdate AND kind="comment"');
		$query->bindParam(':gituser', $gituser);
		$query->bindParam(':currentdate', $currentdate);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries".$error[2];
		}
		$commentcount = $query->fetchAll();

		//Commits
		$query = $log_db->prepare('SELECT count(*) FROM commitgit WHERE author=:gituser AND Date(thedate)=:currentdate');
		$query->bindParam(':gituser', $gituser);
		$query->bindParam(':currentdate', $currentdate);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries".$error[2];
		}
		$commitcount = $query->fetchAll();

		//LOC
		$query = $log_db->prepare('SELECT sum(rowcnt) FROM Bfile,Blame where Blame.fileid=Bfile.id and blameuser=:gituser and Date(blamedate)=:currentdate');
		$query->bindParam(':gituser', $gituser);
		$query->bindParam(':currentdate', $currentdate);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries".$error[2];
		}
		$loccount = $query->fetchAll();

		$daycount = array('events' => $eventcount,
						  'commits' => $commitcount,
						  'loc' => $loccount,
				'comments' => $commentcount);
		$count[$currentdate] = $daycount;
		$currentdate=strtotime("+1 day",strtotime($currentdate));
	}
	$timesheets = array();
	$query = $pdo->prepare('SELECT day, week, type, reference, comment FROM timesheet WHERE uid=:userid AND cid=:cid AND vers=:vers;');
	$query->bindParam(':userid', $userid);
	$query->bindParam(':cid', $cid);
	$query->bindParam(':vers', $vers);
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="TIMESHEET";
	} else {
		$rows = $query->fetchAll();
		foreach($rows as $row){
			$timesheet = array(
				'day' => $row['day'],
				'week' => intval($row['week']),
				'type' => $row['type'],
				'reference' => intval($row['reference']),
				'comment' => $row['comment']
			);
			array_push($timesheets, $timesheet);
		}
	}

	$array = array(
		'debug' => $debug,
		'weeks' => $weeks,
		'rowrankno' => $rowrankno,
		'rowrank' => $rowrank,
    'rowgrouprank' => $rowgrouprank,
		'eventrankno' => $eventrankno,
		'eventrank' => $eventrank,
    'eventgrouprank' => $eventgrouprank,
		'issuerankno' => $issuerankno,
		'issuerank' => $issuerank,
    'issuegrouprank' => $issuegrouprank,
		'commentrankno' => $commentrankno,
		'commentrank' => $commentrank,
    'commentgrouprank' => $commentgrouprank,
		'commitrankno' => $commitrankno,
		'commitrank' => $commitrank,
    'commitgrouprank' => $commitgrouprank,
		'allusers' => $allusers,
		'allrowranks' => $allrowranks,
		'alleventranks' => $alleventranks,
		'allcommentranks' => $allcommentranks,
		'allcommitranks' => $allcommitranks,
		'githubuser' => $gituser,
		'count' => $count,
    'amountInCourse' => $amountInCourse,
    'amountInGroups' => $amountInGroups,
		'hourlyevents' => $hourlyevents,
		'timesheets' => $timesheets
	);

	echo json_encode($array);
} else if (strcmp($opt, "updateday")==0) {
	$today = getOP('today');
	$gituser = getOP('userid');
	$todaysevents = array();

	// Events and issues by the user today
	$query = $log_db->prepare('SELECT kind, eventtimeh FROM event WHERE author=:gituser AND DATE(eventtime)=:today AND kind IN ("comment", "commit");');
	$query->bindParam(':gituser', $gituser);
	$query->bindParam(':today', $today);
	if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error reading entries\n".$error[2];
	}
	$rows = $query->fetchAll();
	foreach($rows as $row){
			$event = array(
				'type' => $row['kind'],
				'time' => $row['eventtimeh']
			);
			array_push($todaysevents, $event);
	}
	$commits = array();
	$query = $log_db->prepare('SELECT issuetimeh FROM issue WHERE author=:gituser AND DATE(issuetime)=:today;');
	$query->bindParam(':gituser', $gituser);
	$query->bindParam(':today', $today);
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading entries\n".$error[2];
	}
	$rows = $query->fetchAll();
	foreach($rows as $row){
		$issue = array(
			'type' => 'issue',
			'time' => $row['issuetimeh']
		);
		array_push($todaysevents, $issue);
	}
	$array = array(
		'day' => $today,
		'events' => $todaysevents
	);
	echo json_encode($array);
}

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "contributionservice.php",$userid,$info);

?>
