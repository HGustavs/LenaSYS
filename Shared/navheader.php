<!-- Navigation Header! -->
<!-- New Version includes code for Code Viewer -->
	<header>
		<?php
			echo "<table width='100%'><tr>";
				
			include_once "../Shared/basic.php";
			
			// Set the target for the 'Upward' Button
			
			if($noup=="COURSE"){
				echo "<td class='navButt' id='home' title='Home'><a href='../DuggaSys/courseed.php'><img src='../Shared/icons/Home.svg'></a></td>";
			}else if($noup=="SECTION"){
				$cid=getOPG('cid');
				$coursevers=getOPG('coursevers');
				echo "<td class='navButt' id='home' title='Home'><a href='../DuggaSys/sectioned.php?courseid=".$cid."&coursevers=".$coursevers."'><img src='../Shared/icons/Home.svg'></a></td>";
			}else {
				// None!
			}
	
			// Either generate code viewer specific nav menu or a spacer
			if(isset($codeviewer)){
					echo "<td class='navButt' id='beforebutton' title='Previous example' onmousedown='Skip(\"bd\");' onmouseup='Skip(\"bu\");' onclick='Skip(\"b\");'><img src='../Shared/icons/backward_button.svg'></td>";
					echo "<td class='navButt' id='afterbutton' title='Next example' onmousedown='Skip(\"fd\");' onmouseup='Skip(\"fu\");' onclick='Skip(\"f\");'><img src='../Shared/icons/forward_button.svg' /></td>";
					echo "<td class='navButt' id='playbutton' title='Open demo' onclick='Play();'><img src='../Shared/icons/play_button.svg' /></td>";
					if(checklogin()) {
						echo "<td class='navButt' onclick='displayEditExample();' ><img src='../Shared/icons/general_settings_button.svg' /></td>";
					}

					if($codeviewerkind) echo "<td class='navButt' title='Settings' id='hidesettings'><img src='../Shared/icons/general_settings_button.svg' /></td>";
					if($codeviewerkind) echo "<td class='navButt'id='savebutton' title='Save' onclick='Save();'><img src='../Shared/icons/save_button.svg' /></td>";
					echo "<td class='navButt showmobile' style='display:none;'><a href='courseed.php'><img src='../Shared/icons/hotdog_button.svg'></a></td>";
					echo "<td id='navHeading' class='navHeading'>";
					echo "<span id='exampleSection'>Exsect</span>";
					echo "<span id='exampleName'>Exname</span>";
					echo "</td>";					
				}else{
					echo "<td class='navSpacer'></td>";
			}


			if(checklogin()) {
					echo "<td class='navName'><label id='userName' onclick='redirectToUMV()'>".$_SESSION['loginname']."</label></td>";		
					echo "<td id='loginbutton' class='loggedin' onclick='processLogout(\"$loginvar\");'><img id='loginbuttonIcon' onload='loginButtonHover(\"online\")' src='../Shared/icons/Man.svg' /></td>";
			}else{
					echo "<td class='navName'><label id='userName'>Guest</label></td>";		
					echo "<td id='loginbutton' class='loggedout' onclick='showLoginPopup();'><img id='loginbuttonIcon' onload='loginButtonHover(\"offline\")' src='../Shared/icons/Man.svg' /></td>";
			}


		echo "</tr></table>";
	?>
</header>
