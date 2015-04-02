	<!-- Navigation Header! -->
	<header>
			<nav id="navigate">
				<?php
					include_once "basic.php";
					if($noup=="COURSE"){
						echo "<a href='courseed.php'><img src='../Shared/icons/Up.svg' class='what' ></a>";
					}else if($noup=="SECTION"){
						$cid=getOPG('cid');
						$coursevers=getOPG('coursevers');
						echo "<a href='sectioned.php?courseid=".$cid."&coursevers=".$coursevers."'><img src='../Shared/icons/Up.svg' class='what'></a>";
					}else{
							// None!
					}
				?>
			</nav>
			<div id="title">
				
			</div>
			<nav id="user">
				<?php 
					if(checklogin()) {
							
							
						
							
						echo "<div id='loginbutton' id='YO' onload='hidelogout()' class='loggedin'><img src='../Shared/icons/Man.svg' onclick='processLogout(\"";
						echo $loginvar;
						echo "\");' /></div>";
						echo "<div class='navName'><label id='userName'>".$_SESSION['loginname']."</label></div>";	
					}else{
							
						echo "<div id='loginbutton' onload='hidelogin()'id='YE' class='loggedout2'><img src='../Shared/icons/Man.svg' onclick='showLoginPopup();' /></div>";
							echo "<div class='navName'><label id='userName'>Guest</label></div>";
					}

				?>
			</nav>
	</header>
	
