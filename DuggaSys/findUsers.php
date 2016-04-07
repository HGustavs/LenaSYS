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



$query = $pdo->prepare("SELECT DISTINCT user.class FROM user WHERE NOT user.class='NULL' GROUP BY user.class ORDER BY user.class DESC");

$query->execute();

$rawData = $query->fetchAll();



echo"<table style=\"dispalay:block;float:right;\">";
echo"	<td>";
echo"		<tr>";
echo"			<select id=\"teacherStudent\" onchange=\"filterSelections();\">";
echo"				<option value=\"-1\">Filter access</option>";
echo"				<option value=\"R\">Student</option>";
echo"				<option value=\"W\">Teacher</option>";
echo"				<option value=\"N\">None</option>";
echo"			</select>";
echo"		</tr>";
echo"		<tr>";
echo"			<select id=\"filterCourses\" onchange=\"filterSelections();\">";
echo"				<option value=\"-1\">Filter class</option>";
foreach($rawData as  $filterd){
	echo"			<option value=\"".$filterd['class']."\">".$filterd['class']."</option>";
}
echo"			</select>";
echo"		</tr>";
echo"	</td>";
echo"</table>";

echo "<iframe id=\"filterFrame\" src=\"searchFrame.php?access=-1&course=-1\"  style=\"width:100%; border:1px solid black; overflow:scroll;\">";
			
echo "</iframe>";
 
?>