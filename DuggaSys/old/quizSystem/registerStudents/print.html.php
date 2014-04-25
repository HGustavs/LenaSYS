<style>
table{
	font-size:15pt;
    border-collapse:collapse;
    border-spacing: 0px;
    clear:both;
}

td,th{
    border:1px solid #000;
    padding:5px 35px;
    white-space: nowrap;
    height: 20px;
}

caption{
	font-weight:bold;
	padding:20px;
}
</style>
<?php
//print.html.php
// echo "<pre>";
// print_r($_POST);
// echo "</pre>";
$students=unserialize($_POST['students']);
// echo "<pre>";
// print_r($students);
// echo "</pre>";
echo "<table>";
echo "<caption>".$_POST['courseName']." ".$_POST['courseOccasion']."</caption>";
echo "<tr><th>Name</th><th>Login name</th><th>Password</th></tr>";
foreach($students as $student){
	if($student['passw']=="HAS PASSWORD") $student['passw']='-';
	echo "<tr><td>".$student['name']."</td><td>".$student['login']."</td><td>".$student['passw']."</td></tr>";
}
echo "</table>";

?>