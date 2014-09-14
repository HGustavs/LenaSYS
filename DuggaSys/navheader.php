	<!-- Navigation Header! -->
	<header>
			<nav id="navigate">
				<?php
					include_once "basic.php";
					if($noup=="COURSE"){
						echo "<a href='courseed.php'><img src='css/svg/Up.svg'></a>";
					}else if($noup=="SECTION"){
						$cid=getOPG('cid');
						$coursevers=getOPG('coursevers');
						echo "<a href='sectioned.php?courseid=".$cid."&coursevers=".$coursevers."'><img src='css/svg/Up.svg'></a>";
					}else{
							// None!
					}
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
	