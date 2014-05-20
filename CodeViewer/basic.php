<?php
include "../Shared/basic.php";

	//---------------------------------------------------------------------------------------------------------------
	// editcontentmenu - Code Viewer Menu Code
	//---------------------------------------------------------------------------------------------------------------

		function editcodemenu($kind)
		{	
				// Body if we are allowed to run code viewer
				echo '<body style="margin: 0; padding: 0;" onload="setup();">';
				echo '<span id="themedrop" class="dropdown dropdownStyle themedrop themedropStyle" style="overflow:auto;"><div class="dropdownback dropdownbackStyle">Theme</div></span>';
				echo '<span id="forwdrop" class="dropdown dropdownStyle forwdrop "><div class="dropdownback dropdownbackStyle">Forw</div></span>';
				echo '<span id="backwdrop" class="dropdown dropdownStyle backwdrop "><div class="dropdownback dropdownbackStyle">Backw</div></span>';
			
				if($kind){
						echo '<span id="codedrop" class="dropdown dropdownStyle codedrop codedropStyle " style="overflow:auto;"><div class="dropdownback dropdownbackStyle">Code viewer Code File Selector</div></span>';
						echo '<span id="docudrop" class="dropdown dropdownStyle docudrop docudropStyle" style="overflow:auto;"><div class="dropdownback dropdownbackStyle">General settings</div></span>';
						echo '<span id="imgdrop" class="dropdown dropdownStyle imgdrop imgdropStyle" style="overflow:auto;"><div class="dropdownback dropdownbackStyle">Images</div></span>';
				}

				echo '<div id="buttomenu" class="buttomenuStyle">';
				echo '<table cellspacing="2"><tr>';
				echo '<td class="mbutto mbuttoStyle showdesktop" title="Back to list" onclick="Up();"><img src="new icons/home_button.svg" /></td>';
				if($kind){		
					echo '<td class="buttospacer">&nbsp;</td>';
					echo '<td class="menutext menutextStyle"><span id="exampleSection">Foo </span><span id="exampleName" contenteditable="true">Example Code Page</td>';								echo '<td><span id="feedbacksection"></span></td>';
					echo '<td class="mbutto mbuttoStyle showdesktop" title="Settings" id="hidesettings"><img src="new icons/general_settings_button.svg" /></td>';
					echo '<td class="mbutto mbuttoStyle showdesktop" id="savebutton" title="Save" onclick="Save();"><img src="new icons/save_button.svg" /></td>';
				}else{
					echo '<td class="menutext menutextStyle"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName">Example Code Page</td>';
				}		
						echo '<td class="mbutto mbuttoStyle showmobile" title="Menu" id="hidehotdog"><img src="new icons/hotdog_button.svg" /></td>';
						echo '<td class="mbutto mbuttoStyle showdesktop" title="Themes" id="hidetheme" onclick="Theme();"><img src="new icons/switchColorTemp.svg" /></td>';
						echo '<td class="mbutto mbuttoStyle showdesktop" id="numberbutton" title="Show/hide linenumbers" onclick="fadelinenumbers();"><img src="new icons/numbers_button.svg" /></td>';
						echo '<td class="mbutto mbuttoStyle beforebutton showdesktop" id="beforebutton" title="Previous example" onmousedown="SkipBDown();" onmouseup="SkipBUp();" onclick="SkipB();"><img src="new icons/backward_button.svg" /></td>';
						echo '<td class="mbutto mbuttoStyle afterbutton showdesktop" id="afterbutton" title="Next example" onmousedown="SkipFDown();" onmouseup="SkipFUp();" onclick="SkipF();"><img src="new icons/forward_button.svg" /></td>';
						echo '<td class="mbutto mbuttoStyle playbutton showdesktop" id="playbutton" title="Open demo" onclick="Play();"><img src="new icons/play_button.svg" /></td>';
						echo '<td class="buttospacer">&nbsp;</td>';

				echo '</table></div>';
				echo '<div id="div2" style="width:100%; position: absolute; top: 50px; bottom: 0px;">';
			echo '</div>';
		}
?>
