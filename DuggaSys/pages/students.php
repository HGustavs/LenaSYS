<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script type="text/javascript" src="js/duggasys.js"></script>
		<script>page.title("Studentview");</script>
	</head>
<body>
<?php

	include_once(dirname(__FILE__). "/../../../coursesyspw.php");	
	include_once(dirname(__FILE__) . "/../../Shared/basic.php");


		pdoConnect();

?>
	<script type="text/javascript">
		var qs = getUrlVars();
	</script>

	<div id="student-box">
		<div id="student-header">Studentvy</div>
		<button onclick="changeURL('addstudent?courseid=' + qs.courseid)">
			Add students 
		</button>
	<form action="" method="post">
	<div id='students'>
	<table class='list'>
	<tr><th>Name</th>
	<th>UserID</th>
	<th>Dugga</th>
	<th id='deletebox' style='visibility: hidden'>Delete</th></tr>


<?php
              foreach($pdo->query( "SELECT * FROM user, user_course WHERE cid='1' and user.uid=user_course.uid" ) as $row){
              	$userid = $row['uid'];
               echo "<tr><td>".$row['username']."</td>";
               echo "<td>".$row['uid']."</td>";
               echo "<td>FAIL</td>";
               echo "<td id='deletebox1' style='display:none'><input type='checkbox' name='checkbox[]' value='".$userid."'/></td></tr>";
}
	?>
	</table>

		<input id="hide" type="button" class="submit-button" value="Tillbaka" onclick="javascript:studentDelete('hide');"/>
		<input id="show" type="button" class="submit-button" value="Redigera" onclick="javascript:studentDelete('show');"/>
		<input id="deletebutton" type="submit" class="submit-button" style='visibility: hidden' value="Delete" name="delete"/>


		<?php

 	
		if (isset($_POST['delete'])) {

			if(!empty($_POST['checkbox'])) {
   				foreach($_POST['checkbox'] as $check) {
	    			$pdo->query( "DELETE FROM user_course WHERE uid='$check'" );
	    			header("Location: students.php");
   				}
			}
		}

		?>
		</form>
		</div>
	</div>
</body>
</html>
