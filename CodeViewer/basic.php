<?php
include "../Shared/basic.php";

	//---------------------------------------------------------------------------------------------------------------
	// editcontentmenu - Code Viewer Menu Code
	//---------------------------------------------------------------------------------------------------------------

		function editcodemenu($kind)
		{	
				// Body if we are allowed to run code viewer
				echo '<body style="margin: 0; padding: 0;" onload="setup();">';
				echo '<span id="forwdrop" class="dropdown forwdrop"><div class="dropdownback">Forw</div></span>';
				echo '<span id="backwdrop" class="dropdown backwdrop"><div class="dropdownback">Backw</div></span>';
				echo '<span id="hotdogdrop" class="dropdown" style="overflow:scroll;">';
					echo '<table cellspacing="0"><tr>';
						echo '<td class="butto" title="Back to list" onclick="Up();"><img src="new icons/home_button.svg" /></td>';
						echo '<td class="butto beforebutton" id="beforebutton" title="Previous example" onmousedown="SkipBDown();" onmouseup="SkipBUp();" onclick="SkipB();"><img src="new icons/backward_button.svg" /></td>';
						echo '<td class="butto afterbutton" id="afterbutton" title="Next example" onmousedown="SkipFDown();" onmouseup="SkipFUp();" onclick="SkipF();""><img src="new icons/forward_button.svg" /></td>';
						echo '<td class="butto playbutton" id="playbutton" title="Open demo" onclick="Play();"><img src="new icons/play_button.svg" /></td>';
					echo '</tr>';
						echo '<tr><td class="butto" title="Show code" onclick="" colspan="3">Code</td><td class="butto">IMG</td></tr>';
						echo '<tr><td class="butto" title="Show description" onclick="" colspan="3">Description</td><td class="butto">IMG</td></tr>';
						echo '<tr><td class="butto" title="Show JS" onclick="" colspan="3">JS</td><td class="butto">IMG</td></tr>';
						echo '<tr><td class="butto" title="Show rownumbers" onclick="" colspan="3">Show rownumbers</td><td class="butto">IMG</td></tr>';
						echo '<tr><td class="butto" title="Settings" onclick="" colspan="4">Settings</td></tr>';
						echo '<tr><td class="butto" title="Change to desktop site" onclick="" colspan="4">Desktop site</td></tr>';
					echo '</table>';
			echo '</span>';				
				if($kind){
						echo '<span id="codedrop" class="dropdown codedrop" style="overflow:scroll;"><div class="dropdownback">Code viewer Code File Selector</div></span>';
						echo '<span id="docudrop" class="dropdown docudrop" style="overflow:scroll;"><div class="dropdownback">General settings</div></span>';
                        echo '<span id="imgdrop" class="dropdown imgdrop" style="overflow:scroll;"><div class="dropdownback">Image Selector</div></span>';
				}

				echo '<div id="buttomenu">';
				echo '<table cellspacing="2"><tr>';
				if($kind){

								echo '<td class="buttospacer">&nbsp;</td>';
								echo '<td class="menutext"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName" contenteditable="true">Example Code Page</td>';
								echo '<td class="butto" title="Settings" onclick="generalSettings();"><img src="new icons/general_settings_button.svg" /></td>';
								echo '<td class="butto" title="Select codesource" onclick="Code();"><img src="new icons/list_codefiles.svg" /></td>';
								
								
				}else{
								echo '<td class="menutext"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName">Example Code Page</td>';
				}		
						echo '<td id="hotdogbutton" class="butto" title="Menu" onclick="showhotdogmenu();"><img src="new icons/hotdog_button.svg" /></td>';
						echo '<td class="butto" title="Back to list" onclick="Up();"><img src="new icons/home_button.svg" /></td>';
						echo '<td class="butto" id="numberbutton" title="Show/hide linenumbers" onclick="fadelinenumbers();"><img src="new icons/numbers_button.svg" /></td>';
						echo '<td class="butto beforebutton" id="beforebutton" title="Previous example" onmousedown="SkipBDown();" onmouseup="SkipBUp();" onclick="SkipB();"><img src="new icons/backward_button.svg" /></td>';
						echo '<td class="butto afterbutton" id="afterbutton" title="Next example" onmousedown="SkipFDown();" onmouseup="SkipFUp();" onclick="SkipF();"><img src="new icons/forward_button.svg" /></td>';
						echo '<td class="butto playbutton" id="playbutton" title="Open demo" onclick="Play();"><img src="new icons/play_button.svg" /></td>';
						echo '<td class="buttospacer">&nbsp;</td>';

				echo '</table></div>';
				echo '<div id="div2" style="width:100%; position: absolute; top: 50px; bottom: 0px; background-color:#def">';

				if($kind){


                    echo '<div id="buttomenu2">';
                    echo '<table cellspacing="2"><tr>';
                    echo '<td class="butto" title="Heading" onclick="styleHeader();"><img src="new icons/hotdog_button.svg" /></td>';
                    echo '<td class="butto" title="Code example" onclick="styleCode();"><img src="new icons/hotdog_button.svg" /></td>';
                    echo '<td class="butto" title="Remove formatting" onclick="styleReset();"><img src="new icons/hotdog_button.svg" /></td>';
					echo '<td class="butto" title="Save" onclick="Save();"><img src="new icons/hotdog_button.svg" /></td>';
                    echo '<td class="butto" title="Select image" onclick="Images();"><img src="new icons/list_codefiles.svg" /></td>';
                    echo '</tr></table></div>';


                    echo '<div id="docucontent" contenteditable="true">';



				}

            else{
                echo '<div id="docucontent">';

            }


				echo '<div style="left:20px" class="warning">';
						echo 'Please wait while content loads<br/>';
						echo '<img src="new icons/loadingJS.gif" /><br/>';
						echo 'Do not forget to enable Javascript<br/>';
						echo '</div>';
						echo '</div>';
						echo '<div id="codebox">';
				//		echo '<span id="playlinkErrorMsg" onclick="$(this).hide();"></span>';
						echo '<div id="infobox" class="codeview">';
						echo '<div style="left:300px" class="warning">';
							echo 'Please wait while content loads<br/>';
							echo '<img src="new icons/loadingJS.gif" /><br/>';
							echo 'Do not forget to enable Javascript<br/>';
					echo '</div>';
				echo '</div>';
		echo '</div>';
		echo '</div>';
		}
?>
