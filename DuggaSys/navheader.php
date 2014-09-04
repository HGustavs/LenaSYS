	<!-- Navigation Header! -->
	<header>
			<nav id="navigate">
				<?php
					if(!$noup) echo "<a href='courseed.php'><img src='css/svg/Up.svg'></a>";
				?>
			</nav>
			<div id="title">
				<h1></h1>
			</div>
			<nav id="user">
				<?php 
					if(checklogin()) {
						echo "<label id='userName'>".$_SESSION['loginname']."</label>";		
						echo "<span id='loginbutton'><img class='loggedin' src='css/svg/Man.svg' onclick='processLogout(\"";
						echo $loginvar;
						echo "\");' /></span>";
					}else{
						echo "<label id='userName'>Guest</label>";		
						echo "<span id='loginbutton'><img src='css/svg/Man.svg' onclick='showLoginPopup();' /></span>";
					}

				?>
			</nav>
	</header>
	