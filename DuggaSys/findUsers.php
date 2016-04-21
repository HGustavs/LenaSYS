<?php
date_default_timezone_set("Europe/Stockholm");
// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
// Connect to database and start session
pdoConnect();
session_start();
if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="1";		
} 



$query = $pdo->prepare("SELECT DISTINCT class.class FROM class ORDER BY class.class DESC");

$query->execute();

$rawData = $query->fetchAll();

$cid = $_GET["cid"];

echo"<table style=\"dispalay:block;float:right;\">";
echo"	<td>";
echo"		<tr>";
echo"			<select id=\"teacherStudent\" onchange=\"filterSelections();\">";
echo"				<option value=\"-1\">Filter access</option>";
echo"				<option value=\"students\">Student</option>";
echo"				<option value=\"teachers\">Teacher</option>";
echo"				<option value=\"nones\">None</option>";
echo"				<option value=\"nulls\">Unassigned</option>";
echo"			</select>";
echo"		</tr>";
echo"	</td>";
echo"</table>";

echo "<iframe id=\"filterFrame\" src=\"searchFrame.php?cid=" . $cid . "\"  style=\"width:100%; border:1px solid black; overflow:scroll;\">";
			
echo "</iframe>";
 
?>