	<!-- Navigation Header! -->
	<!-- New Version includes code for Code Viewer -->
	
	<header>
				<?php
					echo "<table width='100%'><tr>";
					
					include_once "../Shared/basic.php";
					
					// Set the target for the 'Upward' Button
					if($noup=="COURSE"){
							echo "<td class='navButt'><a href='courseed.php'><img src='../Shared/svg/Up.svg'></a></td>";
					}else if($noup=="SECTION"){
							$cid=getOPG('cid');
							$coursevers=getOPG('coursevers');
							echo "<td class='navButt'><a href='sectioned.php?courseid=".$cid."&coursevers=".$coursevers."'><img src='../Shared/svg/Up.svg'></a></td>";
					}else{
							// None!
					}
				
					// Either generate code viewer specific nav menu or a spacer
					if(isset($codeviewer)){
							echo "<td class='navButt' id='beforebutton' title='Previous example' onmousedown='SkipBDown();' onmouseup='SkipBUp();' onclick='SkipB();'><img src='new icons/backward_button.svg'></td>";
							echo "<td class='navButt' id='afterbutton' title='Next example' onmousedown='SkipFDown();' onmouseup='SkipFUp();' onclick='SkipF();'><img src='new icons/forward_button.svg' /></td>";
							echo "<td class='navButt' id='playbutton' title='Open demo' onclick='Play();'><img src='new icons/play_button.svg' /></td>";
							if(checklogin()) {
									echo "<td class='navButt' onclick='displayEditExample();' ><img src='new icons/general_settings_button.svg' /></td>";
							}
	
							if($codeviewerkind) echo "<td class='navButt' title='Settings' id='hidesettings'><img src='new icons/general_settings_button.svg' /></td>";
							if($codeviewerkind) echo "<td class='navButt'id='savebutton' title='Save' onclick='Save();'><img src='new icons/save_button.svg' /></td>";
							echo "<td class='navButt showmobile' style='display:none;'><a href='courseed.php'><img src='new icons/hotdog_button.svg'></a></td>";
							echo "<td id='navHeading' class='navHeading'>";
									echo "<span id='exampleSection'>Exsect</span>";
									echo "<span id='exampleName'>Exname</span>";
							echo "</td>";					
					}else{
							echo "<td class='navSpacer'></td>";
					}

					if(checklogin()) {
							echo "<td class='navName'><label id='userName'>".$_SESSION['loginname']."</label></td>";		
							echo "<td id='loginbutton' class='loggedin'><img src='../Shared/svg/Man.svg' onclick='processLogout(\"";
							echo $loginvar;
							echo "\");' /></td>";
					}else{
							echo "<td class='navName'><label id='userName'>Guest</label></td>";		
							echo "<td id='loginbutton' class='loggedout'><img src='../Shared/svg/Man.svg' onclick='showLoginPopup();' /></td>";
					}

					echo "</tr></table>";
				?>
	</header>