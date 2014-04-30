<?php
include_once(dirname(__file__)."/../../../coursesyspw.php");	
include_once(dirname(__file__)."/../../shared/database.php");
session_start();
dbConnect();
?>

<table class="course-table">
	<tr>
		<th><span class='course'>Course Example Organization System</span></th>
	</tr>	
	<?php
		$querystring="SELECT course.coursename,max(cversion) AS version FROM course LEFT OUTER JOIN section ON course.coursename=section.coursename GROUP BY course.coursename";
		$result=mysql_query($querystring);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
			while ($row = mysql_fetch_assoc($result)){
				echo "<tr><td><span class='bigg'><a id='courses' href='Sectioned.php?courseid=".$row['coursename']."&vers=".$row['version']."'>".$row['coursename']."</a></span></td></tr>";
			}	
	?>
</table>
<br/>
<table class="course-table">
	<tr>
		<th><span class='course'>Course Example Organization System</span></th>
	</tr>	
	<?php
		$querystring="SELECT course.coursename,max(cversion) AS version FROM course LEFT OUTER JOIN section ON course.coursename=section.coursename GROUP BY course.coursename";
		$result=mysql_query($querystring);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
			while ($row = mysql_fetch_assoc($result)){
				echo "<tr><td><span class='bigg'><a id='courses' href='Sectioned.php?courseid=".$row['coursename']."&vers=".$row['version']."'>".$row['coursename']."</a></span></td></tr>";
			}	
	?>
</table>
<br/>
<br/>
<table class="course-table">
	<tr>
		<th><span class='course'>Course Example Organization System</span></th>
	</tr>	
	<?php
		$querystring="SELECT course.coursename,max(cversion) AS version FROM course LEFT OUTER JOIN section ON course.coursename=section.coursename GROUP BY course.coursename";
		$result=mysql_query($querystring);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
		while ($row = mysql_fetch_assoc($result)){
				echo "<tr><td><span class='bigg'><a id='courses' href='Sectioned.php?courseid=".$row['coursename']."&vers=".$row['version']."'>".$row['coursename']."</a></span></td></tr>";
		}	
	?>
</table>
        
	<?php if(checklogin()) { ?>
	<td align='right' class='butto' onclick='location="logout.php"'>
	<?php } else { ?>
	<!--<td align='right' class='butto' onclick='loginbox();'>-->
	<?php } ?>
		<!--<img src='../CodeViewer/icons/Man.svg' />-->
	</td>
</tr>