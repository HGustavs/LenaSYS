<h1>Registration list</h1>
<?php
echo "<h3>Added:".$succeeded."</h3>";
echo "<h3>Existed:".$failed."</h3>";
echo "<br />";
echo "<table class='dataTable'>";
echo "<caption>Added students</caption>";
foreach($students as $student){
	//echo "</br> ssn:".$student['ssn']."|name:".$student['name']."|login:".$student['login']."|<br />";
	if($student['passw']!="HAS PASSWORD"){
		echo "<tr>";
		foreach($student as $data){
			echo "<td>".$data."</td>";
		}
		echo "</tr>";
	}
}
echo "</table>";
echo "<form name='printViewStudnetsForm' action='registerStudents/print.html.php' method='post' target='_blank' >";
echo "<input type='submit' name='printViewSubmit' value='Print' />";
$studentsSerialized=serialize($students);
echo "<input type='hidden' name='courseName' value='".$_POST['course']."' />";
echo "<input type='hidden' name='courseOccasion' value='".$occation."' />";
echo "<input type='hidden' name='students' value='".$studentsSerialized."' />";
echo "</form>";
echo "<br />";
echo "<table class='dataTable'>";
echo "<caption>All parsed students</caption>";
foreach($students as $student){
		echo "<tr>";
		foreach($student as $data){
			echo "<td>".$data."</td>";
		}
		echo "</tr>";
}
echo "</table>";
?>
<a href=".">Back</a>