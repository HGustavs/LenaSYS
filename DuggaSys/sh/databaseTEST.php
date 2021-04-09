<?php 

include_once "../../Shared/basic.php";
include_once "../../Shared/sessions.php";

pdoConnect();
session_start();

/*
SELECT filename FROM filelink WHERE filename LIKE '%$assignment%';
SELECT cid, coursename, activeversion, coursecode FROM course WHERE '%course%' LIKE cid OR coursename OR activeversion OR coursecode;
*/
/*
$sql = 'SELECT cid, coursename, activeversion, coursecode FROM course WHERE visibility=1 ORDER BY cid';

foreach ($pdo->query($sql) as $row) {
	print $row['cid'] . "\t";
	print $row['coursename'] . "\t";
	print $row['coursecode'] . "\t";
	print $row['activeversion'] . "<br>";
}
*/

function courseQuery($course){

global $pdo;
$c = '"%' . $course . '%"';
$sql = "SELECT cid, coursename, activeversion, coursecode 
 FROM course 
 WHERE cid LIKE " . $c . " OR coursename LIKE " . $c . 
 " OR activeversion LIKE " . $c . 
 " OR coursecode LIKE " . $c . "
 AND visibility=1";

$array = array();

foreach ($pdo->query($sql) as $row) {
	$array["cid"] = $row['cid'];
	$array["coursename"] = $row['coursename'];
	$array["coursecode"] = $row['coursecode'];
	$array["courseservers"] = $row['activeversion'];
}
return $array;

}

function queryToUrl($course){

$query = courseQuery($course);

$url = "/LenaSYS/DuggaSys/sectioned.php?courseid=" . $query['cid'] ."&coursename=" . $query['coursename'] . "&coursevers=" .  $query['courseservers'];

echo $url;

return $url; 
}

queryToUrl('G420');

$pdo = null;
?>