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

//$cid = $_GET["cid"];
$access = $_GET["access"];
$class = $_GET["class"];


$queryString = "SELECT users.ssn, users.firstname, users.lastname, users.email, user_course.access, users.class 
FROM (SELECT * FROM user AS A WHERE NOT EXISTS (SELECT * FROM user_course AS B WHERE A.uid = B.uid and B.cid=:cid)) AS users 
LEFT JOIN user_course on users.uid=user_course.uid 
WHERE users.class=:class OR user_course.access=:access 
GROUP BY (users.ssn) 
ORDER BY user_course.access DESC, users.class";

if ($access == -1 && $class != -1){
$queryString = "SELECT users.ssn, users.firstname, users.lastname, users.email, user_course.access, users.class 
FROM (SELECT * FROM user AS A WHERE NOT EXISTS (SELECT * FROM user_course AS B WHERE A.uid = B.uid and B.cid=:cid)) AS users 
LEFT JOIN user_course on users.uid=user_course.uid 
WHERE users.class=:class
GROUP BY (users.ssn) 
ORDER BY user_course.access DESC, users.class";
}

if ($access != -1 && $class == -1){
$queryString = "SELECT users.ssn, users.firstname, users.lastname, users.email, user_course.access, users.class 
FROM (SELECT * FROM user AS A WHERE NOT EXISTS (SELECT * FROM user_course AS B WHERE A.uid = B.uid and B.cid=:cid)) AS users 
LEFT JOIN user_course on users.uid=user_course.uid 
WHERE user_course.access=:access 
GROUP BY (users.ssn) 
ORDER BY user_course.access DESC, users.class";
}


if ($access == -1 && $class == -1){
$queryString = "SELECT users.ssn, users.firstname, users.lastname, users.email, user_course.access, users.class 
FROM (SELECT * FROM user AS A WHERE NOT EXISTS (SELECT * FROM user_course AS B WHERE A.uid = B.uid and B.cid=2)) AS users 
LEFT JOIN user_course on users.uid=user_course.uid 
GROUP BY (users.ssn) 
ORDER BY user_course.access DESC, users.class";
}

$query = $pdo->prepare($queryString);

if($access != -1){
	$query->bindParam(':access', $access);
}
if($class != -1){
	$query->bindParam(':class', $class);
}

$query->bindParam(':cid', $cid);

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
				echo "<tr class='loginBoxheader' ><th class='first' style='color:white; text-align:left; padding-left:8px; width:140px;'>Teachers</th><th></th><th></th><th></th><th></th></tr>";
			break;
			case "R":
				echo "<tr class='loginBoxheader'><th class='first' style='color:white; text-align:left; padding-left:8px; width:140px;'>Students</th><th></th><th></th><th></th><th></th></tr>";
			break;
			case "N":
				echo "<tr class='loginBoxheader'><th class='first' style='color:white; text-align:left; padding-left:8px; width:140px;'>Free students</th><th></th><th></th><th></th><th></th></tr>";
			break;
			case NULL:
				echo "<tr class='loginBoxheader'><th class='first' style='color:white; text-align:left; padding-left:8px; width:140px;'>Unassigned users</th><th></th><th></th><th></th><th></th></tr>";
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
