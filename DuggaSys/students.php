<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
			<link type="text/css" href="css/style.css" rel="stylesheet">
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script type="text/javascript" src="duggasys.js"></script>
	</head>
<body>
<?php

	include_once("../../coursesyspw.php");	
		include_once("../Shared/basic.php");

		pdoConnect();

?>
		<header>
		<nav id="navigate">
			<img src="css/svg/Up.svg">
			<img onclick="menuDugga()" src="css/svg/SkipB.svg">
		</nav>
		<nav id="user">
			Emil & Martina
			<img src="css/svg/Man.svg">
		</nav>
	</header>
	<div id="content">

	<div id="student-box">
		<div id="student-header">Studentvy</div>
		<a href="addstudent.php"><input type="submit" id="submit-button" value="Lägg till student"/></a>
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

		<input id="hide" type="button" value="Tillbaka" onclick="javascript:studentDelete('hide');"/>
		<input id="show" type="button" value="Redigera" onclick="javascript:studentDelete('show');"/>
		<input id="deletebutton" type="submit" style='visibility: hidden' value="Delete" name="delete"/>


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
	</div>
</body>
</html>