<?php
include "../Shared/basic.php";

	//---------------------------------------------------------------------------------------------------------------
	// editcontentmenu - Code Viewer Menu Code
	//---------------------------------------------------------------------------------------------------------------

		function editcodemenu($kind)
		{	
				// Body if we are allowed to run code viewer
				echo '<body style="margin: 0; padding: 0;" onload="setup();">';
				echo '<span id="forwdrop" class="dropdown dropdownStyle forwdrop "><div class="dropdownback dropdownbackStyle">Forw</div></span>';
				echo '<span id="backwdrop" class="dropdown dropdownStyle backwdrop "><div class="dropdownback dropdownbackStyle">Backw</div></span>';
				echo '<span id="hotdogdrop" class="hotdogdropStyle dropdown dropdownStyle showmobile" style="overflow:auto;">';
					echo '<table cellspacing="0" class="showmobile"><tr>';
						echo '<td class="mbutto mbuttoStyle " title="Back to list" onclick="Up();"><img src="new icons/home_button.svg" /></td>';
						echo '<td class="mbutto mbuttoStyle beforebutton " id="beforebutton" title="Previous example" onmousedown="SkipBDown();" onmouseup="SkipBUp();" onclick="SkipB();"><img src="new icons/backward_button.svg" /></td>';
						echo '<td class="mbutto mbuttoStyle afterbutton " id="afterbutton" title="Next example" onmousedown="SkipFDown();" onmouseup="SkipFUp();" onclick="SkipF();""><img src="new icons/forward_button.svg" /></td>';
						echo '<td class="mbutto mbuttoStyle playbutton " id="playbutton" title="Open demo" onclick="Play();"><img src="new icons/play_button.svg" /></td>';
					echo '</tr>';
						echo '<tr><td class="mbutto mbuttoStyle " title="Show code" onclick="" colspan="4">Code<img src="new icons/hotdogTabButton2.svg" /></td></tr>';
 						echo '<tr><td class="mbutto mbuttoStyle " title="Show description" onclick="" colspan="4">Description<img src="new icons/hotdogTabButton2.svg" /></td></tr>';
 						echo '<tr><td class="mbutto mbuttoStyle " title="Show JS" onclick="" colspan="4">JS<img src="new icons/hotdogTabButton2.svg" /></td></tr>';
 						echo '<tr><td id="numberbuttonMobile" class="mbutto mbuttoStyle " title="Show rownumbers" onclick="fadelinenumbers();" colspan="4">Show rownumbers<img src="new icons/hotdogTabButton.svg" /></td></tr>';
						echo '<tr><td class="mbutto mbuttoStyle " title="Settings" onclick="" colspan="4">Settings</td></tr>';
						echo '<tr><td class="mbutto mbuttoStyle " title="Change to desktop site" onclick="" colspan="4">Desktop site</td></tr>';
					echo '</table>';
			echo '</span>';				
				if($kind){
						echo '<span id="codedrop" class="dropdown dropdownStyle codedrop codedropStyle " style="overflow:auto;"><div class="dropdownback dropdownbackStyle">Code viewer Code File Selector</div></span>';
						echo '<span id="docudrop" class="dropdown dropdownStyle docudrop docudropStyle" style="overflow:auto;"><div class="dropdownback dropdownbackStyle">General settings</div></span>';
						echo '<span id="imgdrop" class="dropdown dropdownStyle imgdrop imgdropStyle" style="overflow:auto;"><div class="dropdownback dropdownbackStyle">Images</div></span>';
						echo '<span id="themedrop" class="dropdown dropdownStyle themedrop themedropStyle" style="overflow:auto;"><div class="dropdownback dropdownbackStyle">Theme</div></span>';
				}

				echo '<div id="buttomenu" class="buttomenuStyle">';
				echo '<table cellspacing="2"><tr>';
				echo '<td class="mbutto mbuttoStyle showdesktop" title="Back to list" onclick="Up();"><img src="new icons/home_button.svg" /></td>';
				if($kind){		
								echo '<td class="buttospacer">&nbsp;</td>';
								echo '<td class="menutext menutextStyle"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName" contenteditable="true">Example Code Page</td>';
								echo '<td><span id="feedbacksection"></span></td>';
								echo '<td class="mbutto mbuttoStyle" id="savebutton" title="Save" onclick="Save();"><img src="new icons/save_button.svg" /></td>';
								echo '<td class="mbutto mbuttoStyle showdesktop" title="Settings" id="hidesettings"><img src="new icons/general_settings_button.svg" /></td>';
								
								echo '<td class="mbutto mbuttoStyle showdesktop" title="Themes" id="hidetheme" onclick="Theme();"><img src="new icons/switchColorTemp.svg" /></td>';
								
				}else{
								echo '<td class="menutext menutextStyle"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName">Example Code Page</td>';
				}		
						echo '<td class="mbutto mbuttoStyle showmobile" title="Menu" id="hidehotdog"><img src="new icons/hotdog_button.svg" /></td>';
						echo '<td class="mbutto mbuttoStyle showdesktop" id="numberbutton" title="Show/hide linenumbers" onclick="fadelinenumbers();"><img src="new icons/numbers_button.svg" /></td>';
						echo '<td class="mbutto mbuttoStyle beforebutton showdesktop" id="beforebutton" title="Previous example" onmousedown="SkipBDown();" onmouseup="SkipBUp();" onclick="SkipB();"><img src="new icons/backward_button.svg" /></td>';
						echo '<td class="mbutto mbuttoStyle afterbutton showdesktop" id="afterbutton" title="Next example" onmousedown="SkipFDown();" onmouseup="SkipFUp();" onclick="SkipF();"><img src="new icons/forward_button.svg" /></td>';
						echo '<td class="mbutto mbuttoStyle playbutton showdesktop" id="playbutton" title="Open demo" onclick="Play();"><img src="new icons/play_button.svg" /></td>';
						echo '<td class="buttospacer">&nbsp;</td>';

				echo '</table></div>';
				echo '<div id="div2" style="width:100%; position: absolute; top: 50px; bottom: 0px; background-color:#def">';

				if($kind){
             /*       echo '<div id="buttomenu2">';
                    echo '<table cellspacing="2"><tr>';
                    echo '<td class="butto2" title="Remove formatting" onclick="styleReset();"><img src="new icons/reset_button.svg" /></td>';
                    echo '<td class="butto2" title="Heading" onclick="styleHeader();"><img src="new icons/boldtext_button.svg" /></td>';
                    echo '<td class="butto2" title="Code example" onclick="styleCode();"><img src="new icons/quote_button.svg" /></td>';
                    echo '<td class="butto2" id="hideimage" title="Select image"><img src="new icons/picture_button.svg" /></td>';
                    echo '<td class="butto2" title="Save" onclick="Save();"><img src="new icons/save_button.svg" /></td>';
                    echo '</tr></table></div>';  */
           //      echo '<div id="docucontent" class="docucontentStyle" contenteditable="true">';
				}
            else{
            //   echo '<div id="docucontent" class="docucontentStyle">';
            }
        		/*    echo '<div style="left:20px" class="warning">';
						echo 'Please wait while content loads<br/>';
						echo '<img src="new icons/loadingJS.gif" /><br/>';
						echo 'Do not forget to enable Javascript<br/>';
						echo '</div>';
						echo '</div>';
						echo '<div id="codebox" class="codeboxStyle">';
						echo '<div id="infobox" class="codeview">';
						echo '<div style="left:300px" class="warning warningStyle">';
							echo 'Please wait while content loads<br/>';
							echo '<img src="new icons/loadingJS.gif" /><br/>';
							echo 'Do not forget to enable Javascript<br/>';
					echo '</div>';
				echo '</div>';
		echo '</div>';
	*/	echo '</div>';
		}
?>
