<?php
session_start();
include_once(dirname(__file__)."/../../../coursesyspw.php");	
include_once(dirname(__file__)."/../../shared/database.php");

dbConnect();
?>
<div style="margin-bottom:7px; float:right;"><input style="cursor:pointer;" onclick="changeURL('newCourseForm')" class='submit-button' type='button' value='Add course'></div>
<table class="course-table" cellspacing="0">
	<tr>
		<th colspan="2">Course Example Organization System</th>
	</tr>	
	<?php
		$querystring="SELECT course.coursename,max(cversion) AS version, cid AS id FROM course LEFT OUTER JOIN section ON course.coursename=section.coursename GROUP BY course.coursename";
		$result=mysql_query($querystring);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
		while ($row = mysql_fetch_assoc($result)){
				echo "<tr><td style='width:98%;' onclick='changeURL(\"Sectioned?courseid=". $row['id']. "&coursename=" . $row['coursename'] . "\")'>".$row['coursename']."</td>";
				echo "<td style='width:2%;'><img id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
				echo "</td></tr>";
		}	
	?>
</table>
