<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<link type="text/css" href="css/style.css" rel="stylesheet">
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script type="text/javascript" src="duggasys.js"></script>
	</head>
<body>
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
	<form action="" method="post">
		<div id="student-header">Lägg till student!</div>
		<br>
		<br>
		<textarea placeholder="SSN, Name, email" name="string" id="string" cols="30"></textarea>
		<br>
		<input type="button" value="Lägg till student" onclick="passPopUp();"/>
		<a href="students.php"><input type="button" value="Cancel"/></a>
	</form>


		<div id="light" class="white_content">
		</div>
</div>
</div>
		<div id="fade" class="black_overlay" onclick="javascript:showPopUp('hide');"></div>

</body>
</html>