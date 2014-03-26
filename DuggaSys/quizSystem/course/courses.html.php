<?php
echo "<form name='addCourseForm' action='.' method='post' style='display:inline-block;border:1px #000 solid;'/>";
echo "<h3>Add course</h3><br />";
echo "<label>Course name:";
echo "<input type='text' name='newCourseName' ";
if(isset($_POST['editCourse']) && isset($courseData['name'])) echo "value='".$courseData['name']."'";
echo " />";
echo "</label><br />";
echo "<label>Course description:</label><br />";
echo "<textarea name='courseDesc' cols='50' rows='5'>";
if(isset($_POST['editCourse']) && isset($courseData['description'])) echo $courseData['description'];
echo "</textarea>";
echo "<br /><label>Course data:</label><br />";
echo "<textarea name='courseData' cols='50' rows='5'>";
if(isset($_POST['editCourse']) && isset($courseData['courseData'])) echo $courseData['courseData'];
echo "</textarea>";
if(isset($_POST['editCourse'])){
	echo "<input type='submit' name='updateCourse' value='Save' />";
} else {
	echo "<input type='submit' name='addCourse' value='Add' />";
}
if(isset($_POST['editCourse']))	echo "<input type='hidden' name='courseName' value='".$courseData['name']."' />";
echo "<input type='hidden' name='coursesLink' />";
echo "<input type='hidden' name='scrolly' id='scrolly' value='0' />";
echo "</form>";
echo "<table class='dataTable'>";
echo "<caption>All courses</caption>";
if(count($courseList)>0){
	foreach($courseList[0] as $columnName=>$data){
		echo "<th>".$columnName."</th>";
	}
	echo "<th colspan='2'>-</th>";
	foreach($courseList as $course){
		echo "<tr>";
		foreach($course as $data){
			echo "<td>".$data."</td>";
		}
		echo "<td>";
			echo "<form name='editCourseForm' action='.' method='post'>";
				echo "<input type='hidden' name='courseName' value='".$course['name']."' />";
				echo "<input type='hidden' name='coursesLink' />";
				echo "<input type='hidden' name='scrolly' id='scrolly' value='0' />";
				echo "<input type='submit' value='Edit' name='editCourse' />";
			echo "</form>";
		echo "</td>";
		echo "<td>";
			echo "<form name='removeCourseForm' action='.' method='post'>";
				echo "<input type='hidden' name='courseName' value='".$course['name']."' />";
				echo "<input type='hidden' name='coursesLink' />";
				echo "<input type='hidden' name='scrolly' id='scrolly' value='0' />";
				echo "<input type='submit' value='Remove' name='removeCourse' class='confirm' />";
			echo "</form>";
		echo "</td>";
		echo "</tr>";
	}
} else {
	echo "<tr><td>No courses found in the database</td></tr>";
}
echo "</table>";

?>