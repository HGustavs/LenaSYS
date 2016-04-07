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

$access = $_GET["access"];
$course = $_GET["course"];


$query = $pdo->prepare("SELECT DISTINCT  user.ssn, user.firstname, user.lastname, user.email, user_course.access, user.class 
FROM user 
LEFT JOIN user_course ON (user.uid=user_course.uid) 
WHERE user_course.access=:access OR user.class=:class 
ORDER BY user_course.access DESC, user.class DESC");

$query->bindParam(':access', $access);
$query->bindParam(':class', $course);

if ($access == -1 && $course != -1){
$query = $pdo->prepare("SELECT DISTINCT  user.ssn, user.firstname, user.lastname, user.email, user_course.access, user.class 
FROM user 
LEFT JOIN user_course ON (user.uid=user_course.uid) 
WHERE  user.class=:class
ORDER BY user_course.access DESC, user.class DESC");

$query->bindParam(':class', $course);
}

if ($access != -1 && $course == -1){
$query = $pdo->prepare("SELECT DISTINCT  user.ssn, user.firstname, user.lastname, user.email, user_course.access, user.class 
FROM user 
LEFT JOIN user_course ON (user.uid=user_course.uid) 
WHERE user_course.access=:access
ORDER BY user_course.access DESC, user.class DESC");

$query->bindParam(':access', $access);
}


if ($access == -1 && $course == -1){
	$query = $pdo->prepare("SELECT DISTINCT  user.ssn, user.firstname, user.lastname, user.email, user_course.access, user.class 
FROM user 
LEFT JOIN user_course ON (user.uid=user_course.uid) 
ORDER BY user_course.access DESC, user.class DESC");
}



$query->execute();

$rawData = $query->fetchAll();

echo"<div id=\"FilterLists\"><table class=\"class='list'\" style=\"float:left;\">";

$currentAccess = "-1";

foreach($rawData as  $filterd)
{
	if($currentAccess !=  $filterd['access']){
		$currentAccess = $filterd['access'];
		switch ($currentAccess){
			case "W":
				echo "<tr class='loginBoxheader' ><th class='first' style='color:white; text-align:left; padding-left:8px; width:140px;'>Teacher</th><th></th><th></th><th></th><th></th></tr>";
			break;
			case "R":
				echo "<tr class='loginBoxheader'><th class='first' style='color:white; text-align:left; padding-left:8px; width:140px;'>Student</th><th></th><th></th><th></th><th></th></tr>";
			break;
			case "N":
				echo "<tr class='loginBoxheader'><th class='first' style='color:white; text-align:left; padding-left:8px; width:140px;'>Free students</th><th></th><th></th><th></th><th></th></tr>";
			break;
			case NULL:
				echo "<tr class='loginBoxheader'><th class='first' style='color:white; text-align:left; padding-left:8px; width:140px;'>Unassigned</th><th></th><th></th><th></th><th></th></tr>";
			break;
		}
	}
	
	echo"<tr>";
	echo"<td><input type=\"checkbox\" onchange=\"checkBox(this);\"></td>" .
	"<td><p>  " . $filterd['lastname'] . " </p></td>" .
	"<td><p> " . $filterd['firstname'] . " </p></td>" .
	"<td><p> " . $filterd['class'] . " </p></td>";
	echo"<td><p style=\"display:none;\">";
	echo"<input type=\"hidden\" value=\"" . $filterd['ssn'] . " " . $filterd['firstname'] . " " .$filterd['lastname'] . " " .$filterd['email'] . "\">";
	echo"</p></td></tr>";
	
}

echo"</table>
</div>
</div>";

echo "<input id='addSelected' value=\"\" type='hidden' />";

//  Add tables for each student.
//  add filter options.<	
//  add check buttons.
//  
?>
</body>
</html>
