<!-- Navigation Header! -->
<!-- New Version includes code for Code Viewer -->
	<header>
		<?php
			echo "<table width='100%'><tr>";
				
			include_once "../Shared/basic.php";
			
			// Always show home button which links to course homepage
			echo "<td class='navButt' id='home' title='Home'><a href='../DuggaSys/courseed.php'><img src='../Shared/icons/Home.svg'></a></td>";

			// Generate different back buttons depending on which page is including
			// this file navheader file. The switch case uses ternary operators to
			// determine the href attribute value. (if(this) ? dothis : elsethis)
			//---------------------------------------------------------------------
			echo "<td class='navButt' id='home' title='Home'>";
			switch ($noup) {
				case 'COURSE':
					echo "<a href='";
					echo (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : "../DuggaSys/courseed.php");
					echo "'>";
					echo "<img src='../Shared/icons/Up.svg'></a></td>";
					break;
				case 'SECTION':
					$cid=getOPG('cid');
					$coursevers=getOPG('coursevers');
					echo "<a href='";
					echo ($cid != (string)"UNK" ? "../DuggaSys/sectioned.php?courseid=".$cid."&coursevers=".$coursevers : "../DuggaSys/courseed.php");
					echo "'>";
					echo "<img src='../Shared/icons/Up.svg'></a></td>";
					break;
				case 'CODEVIEWER':
					echo "<a href='";
					echo (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '../codeviewer/EditorV50.php');
					echo "'>";
					echo "<img src='../Shared/icons/Up.svg'></a></td>";
					break;
				case 'NONE';
					// This case is used for pages still under development
					break;
				default:
					// Show generic back button
					echo "<a href='";
					echo (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : "../DuggaSys/courseed.php");
					echo "'>";
					echo "<img src='../Shared/icons/Up.svg'></a></td>";
					break;
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
