<?php
session_start();
include_once(dirname(__file__)."/../../../coursesyspw.php");	
include_once(dirname(__file__)."/../../shared/database.php");

dbConnect();
?>
<div style="margin-right:2px;margin-bottom:5px; float:right;"><input style="cursor:pointer;" onclick="changeURL('newCourseForm')" class='submit-button' type='button' value='Add course'></div>
<table class="course-table">
	<tr>
		<th><span class='course'>Course Example Organization System</span></th>
	</tr>	
	<?php
		$querystring="SELECT course.coursename,max(cversion) AS version FROM course LEFT OUTER JOIN section ON course.coursename=section.coursename GROUP BY course.coursename";
		$result=mysql_query($querystring);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
		while ($row = mysql_fetch_assoc($result)){
				echo "<tr><td><span class='bigg'><a id='courses' href='Sectioned.php?courseid=".$row['coursename']."&vers=".$row['version']."'>".$row['coursename']."</a></span>";
				echo "<a href=''><img src='../CodeViewer/new icons/general_settings_button.svg' style='float:right; width:15px;height:15px;padding:3px;' /></a>";
				echo "</td></tr>";
		}	
	?>
</table>
