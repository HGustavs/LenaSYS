<html>	
	<head>
		<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
		<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
		<script src="accessed.js"></script>
	</head>
	<body>
<?PHP
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

$cid = $_GET["cid"];

// These will be used as sorting parameters
$access = $_GET["access"];
$class = $_GET["class"];


$queryString = "SELECT users.ssn, users.lastname, users.firstname, course.access, users.class, EXTRACT(YEAR FROM users.addedtime) AS date, users.email 
FROM user AS users 
LEFT JOIN user_course AS course ON users.uid=course.uid
WHERE users.uid NOT IN (SELECT user_course.uid FROM user_course WHERE user_course.cid=:cid) GROUP BY (users.uid)";

$query = $pdo->prepare($queryString);

$query->bindParam(':cid', $cid);

$query->execute();

$rawData = $query->fetchAll();

$teachers = array();
$students = array();
$nones = array();
$nulls = array();

// This way of sorting should be faster then MySql's standard sorting since it wants to use index.
// This method of sorting is a bucket sort.
// 

foreach($rawData as  $filterd){
	switch ($filterd['access']){
		case"W":
			 array_push($teachers, $filterd);
		break;
		case"R":
			 array_push($students, $filterd);
		break;
		case"N":
			 array_push($nones, $filterd);
		break;
		case NULL:
			 array_push($nulls, $filterd);
		break;
	}
}

echo"<div id=\"FilterLists\"><table class=\"class='list'\" style=\"float:left;\">";

echo"<tbody id=\"teachers\" style=\"\">";
if(sizeof($teachers) > 0){
	echo "<tr class='loginBoxheader' ><th class='first' style='color:white; text-align:left; padding-left:8px; width:140px;'>Teachers</th><th></th><th></th><th></th><th></th></tr>";
	foreach($teachers as  $filterd)
	{
		echo"<tr>";
		echo"<td><input type=\"checkbox\" onchange=\"checkBox(this);\"></td>" .
		"<td><p>  " . $filterd['lastname'] . " </p></td>" .
		"<td><p> " . $filterd['firstname'] . " </p></td>" .
		"<td><p> " . $filterd['class'] . " </p></td>";
		echo"<td><p style=\"display:none;\">";
		echo"<input type=\"hidden\" value=\"[" . 
		$filterd['ssn'] . "] [" .
		$filterd['lastname'] . "] [" .
		$filterd['firstname'] . 
		"] [anmkod] [" .
		$filterd['access'] . "] [" .
		$filterd['class'] . "] [" .
		$filterd['date'] . "] [" .
		$filterd['email'] .
		"]\">";
		echo"</p></td></tr>";
	}
}
echo"</tbody>";

echo"<tbody id=\"students\" style=\"\">";
if(sizeof($students) > 0){
	echo"<tr class='loginBoxheader'><th class='first' style='color:white; text-align:left; padding-left:8px; width:140px;'>Students</th><th></th><th></th><th></th><th></th></tr>";
	foreach($students as  $filterd)
	{
		echo"<tr>";
		echo"<td><input type=\"checkbox\" onchange=\"checkBox(this);\"></td>" .
		"<td><p>  " . $filterd['lastname'] . " </p></td>" .
		"<td><p> " . $filterd['firstname'] . " </p></td>" .
		"<td><p> " . $filterd['class'] . " </p></td>";
		echo"<td><p style=\"display:none;\">";
		echo"<input type=\"hidden\" value=\"[" . 
		$filterd['ssn'] . "] [" .
		$filterd['lastname'] . "] [" .
		$filterd['firstname'] . 
		"] [anmkod] [" .
		$filterd['access'] . "] [" .
		$filterd['class'] . "] [" .
		$filterd['date'] . "] [" .
		$filterd['email'] .
		"]\">";
		echo"</p></td></tr>";
	}

}
echo"</tbody>";

echo"<tbody id=\"nones\" style=\"\">";
if(sizeof($nones) > 0){
	echo "<tr class='loginBoxheader'><th class='first' style='color:white; text-align:left; padding-left:8px; width:140px;'>Free students</th><th></th><th></th><th></th><th></th></tr>";
	foreach($nones as  $filterd)
	{
		echo"<tr>";
		echo"<td><input type=\"checkbox\" onchange=\"checkBox(this);\"></td>" .
		"<td><p>  " . $filterd['lastname'] . " </p></td>" .
		"<td><p> " . $filterd['firstname'] . " </p></td>" .
		"<td><p> " . $filterd['class'] . " </p></td>";
		echo"<td><p style=\"display:none;\">";
		echo"<input type=\"hidden\" value=\"[" . 
		$filterd['ssn'] . "] [" .
		$filterd['lastname'] . "] [" .
		$filterd['firstname'] . 
		"] [anmkod] [" .
		$filterd['access'] . "] [" .
		$filterd['class'] . "] [" .
		$filterd['date'] . "] [" .
		$filterd['email'] .
		"]\">";
		echo"</p></td></tr>";
	}

}
echo"</tbody>";

echo"<tbody id=\"nulls\" style=\"\">";
if(sizeof($nulls) > 0){

	echo "<tr class='loginBoxheader'><th class='first' style='color:white; text-align:left; padding-left:8px; width:140px;'>Unassigned users</th><th></th><th></th><th></th><th></th></tr>";
	foreach($nulls as  $filterd)
	{
		echo"<tr>";
		echo"<td><input type=\"checkbox\" onchange=\"checkBox(this);\"></td>" .
		"<td><p>  " . $filterd['lastname'] . " </p></td>" .
		"<td><p> " . $filterd['firstname'] . " </p></td>" .
		"<td><p> " . $filterd['class'] . " </p></td>";
		echo"<td><p style=\"display:none;\">";
		echo"<input type=\"hidden\" value=\"[" . 
		$filterd['ssn'] . "] [" .
		$filterd['lastname'] . "] [" .
		$filterd['firstname'] . 
		"] [anmkod] [" .
		$filterd['access'] . "] [" .
		$filterd['class'] . "] [" .
		$filterd['date'] . "] [" .
		$filterd['email'] .
		"]\">";
		echo"</p></td></tr>";
	}	
	
}
echo"</tbody>";
echo"</table>

</div>";

echo "<input id='addSelected' value=\"\" type='hidden' />";

//  Add tables for each student.
//  add filter options.<	
//  add check buttons.
//  
?>
</body>
</html>
