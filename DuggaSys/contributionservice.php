<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

$cid=$_SESSION['courseid'];
$vers=$_SESSION['coursevers'];

$debug="NONE!";

$log_db = new PDO('sqlite:../../GHData/GHdata_2019_2.db');

$allusers=array();

$allrowranks=array();
$alleventranks=array();
$allcommentranks=array();

$allcommitranks=array();

$draught=false;

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

$commitrank="NOT FOUND";
$commitrankno="NOT FOUND";
$i=1;
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
    }
  
    if($draught) array_push($allcommitranks, $row);
  
    $i++;
}
$rowrank="NOT FOUND";
$rowrankno="NOT FOUND";
$i=1;
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
    }
    if($draught) array_push($allrowranks, $row);
  
    $i++;
  
}

$eventrankno="NOT FOUND";
$eventrank="NOT FOUND";
$i=1;
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
    }
  
    if($draught) array_push($alleventranks, $row);
  
    $i++;
}

$commentrankno="NOT FOUND";
$commentrank="NOT FOUND";
$i=1;
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
    }
  
    if($draught) array_push($allcommentranks, $row);
  
    $i++;
}

$issuerank="NOT FOUND";
$issuerankno="NOT FOUND";
$i=1;
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
    }
    $i++;
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
$array = array(
	'debug' => $debug,
	'weeks' => $weeks,
    'rowrankno' => $rowrankno,
	'rowrank' => $rowrank,
    'eventrankno' => $eventrankno,
	'eventrank' => $eventrank,
    'issuerankno' => $issuerankno,
	'issuerank' => $issuerank,
    'commentrankno' => $commentrankno,
    'commentrank' => $commentrank,
    'commitrankno' => $commitrankno,
    'commitrank' => $commitrank,
    'allusers' => $allusers,
    'allrowranks' => $allrowranks,
    'alleventranks' => $alleventranks,
    'allcommentranks' => $allcommentranks,
    'allcommitranks' => $allcommitranks,
	'githubuser' => $gituser,
	'count' => $count
);

echo json_encode($array);

?>